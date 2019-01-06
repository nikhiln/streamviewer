import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { environment } from '@env/environment';
import { AuthenticationService } from '@app/core';
import { LiveChatService, LiveChatMessage } from '@app/stream/live-chat.service';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {
  isLoading: boolean;
  streamId: string;
  streamEmbdedUrl: any;

  // chat
  isChatReady: boolean;
  private routeSub: any;
  user: {};

  newMessage: string;
  messages: Array<LiveChatMessage>;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private authService: AuthenticationService,
    private liveChatService: LiveChatService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.streamId = params['id'];
      this.streamEmbdedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${this.streamId}?rel=0&autoplay=1`
      );
    });

    this.isChatReady = false;
    // websocket - chat
    this.liveChatService.createWebSocket(environment.webSocketServerUrl).subscribe(data => {
      if (data['type'] === 'open') {
        this.isChatReady = true;
        this.fetchMessages();
      }

      // fetching existing messages
      try {
        data = JSON.parse(data);
      } catch (e) {}

      if (data['type'] === 'messages') {
        this.messages = data['messages'];
      }

      if (data['type'] === 'new_message') {
        this.messages.push(data['message']);
      }
    });

    this.newMessage = null;
    this.user = this.authService.credentials.user;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  fetchMessages() {
    this.liveChatService.fetchMessages(this.streamId);
  }

  /**
   * Sends new chat message
   */
  onSubmit() {
    if (this.newMessage) {
      const message: LiveChatMessage = {
        message: this.newMessage,
        username: this.user['username'],
        liveStreamId: this.streamId
      };
      this.liveChatService.sendMessage(message);
      this.newMessage = null;
    }
  }
}
