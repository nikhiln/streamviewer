import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate } from '@angular/common';

import { AuthenticationService } from '@app/core';
import { ChatService, StreamChatArchiveContext } from '@app/stream/chat-archive/chat.service';
import { LiveChatMessage } from '@app/stream/live-chat.service';

@Component({
  selector: 'app-stream-chat-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class StreamChatArchiveComponent implements OnInit {
  loading: boolean;
  streamId: string;
  user: {};
  private routeSub: any;

  // search by user name
  searchQueryUser: string;
  chatMessages: Array<LiveChatMessage>;
  columns: Array<{}>;
  interval: any;
  lastAppliedOrder: string;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private authService: AuthenticationService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.streamId = params['id'];
      this.getAllChatMessages();

      // auto data refresh
      this.interval = setInterval(() => {
        this.getAllChatMessages();
      }, 10000);
    });

    this.user = this.authService.credentials.user;

    // cols
    this.columns = [
      { name: 'Time', sortable: true, prop: 'created_at', pipe: { transform: this.datePipe } },
      { name: 'Sender', sortable: true, prop: 'sender' },
      { name: 'Message', sortable: false }
    ];
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  /**
   * Gets all the chat messages for stream
   */
  getAllChatMessages(orderBy?: string) {
    let searchContext: StreamChatArchiveContext = { streamId: this.streamId };
    if (this.searchQueryUser) {
      searchContext['sender'] = this.searchQueryUser;
    }
    if (orderBy) {
      searchContext['orderBy'] = orderBy;
      this.lastAppliedOrder = orderBy;
    } else if (this.lastAppliedOrder) searchContext['orderBy'] = this.lastAppliedOrder;

    this.chatService.getChatHistory(searchContext).subscribe(data => {
      this.chatMessages = data;
      this.loading = false;
    });
  }

  /**
   * Gets the records in given order
   * @param event
   */
  onSort(event: any) {
    this.loading = true;
    let sortDetails = event['sorts'] ? event['sorts'][0] : null;
    if (sortDetails) {
      let dir = sortDetails['dir'];
      let col = sortDetails['prop'];
      if (dir === 'desc') {
        col = '-' + col;
      }
      setTimeout(() => {
        this.getAllChatMessages(col);
      }, 1000);
    }
  }
  /**
   * Returns the formatted date
   * @param value
   * @param args
   */
  datePipe(value: any, ...args: any[]) {
    return formatDate(value, 'medium', 'en');
  }
}
