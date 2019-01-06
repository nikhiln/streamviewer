import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { observable, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthenticationService } from '@app/core';

export interface LiveChatMessage {
  command?: string;
  message?: string;
  username?: string;
  liveStreamId?: string;
}

@Injectable()
export class LiveChatService {
  ws: WebSocket;

  constructor(private httpClient: HttpClient, private authService: AuthenticationService) {}

  /**
   * Creates observable web socket
   * @param url
   */
  createWebSocket(url: string): Observable<any> {
    this.ws = new WebSocket(url);
    return new Observable(observer => {
      this.ws.onopen = event => observer.next(event);
      this.ws.onmessage = event => observer.next(event.data);
      this.ws.onerror = event => observer.error(event);
      this.ws.onclose = event => observer.complete();
    });
  }

  /**
   * Sends the given message
   * @param message
   */
  sendMessage(message: LiveChatMessage) {
    message['command'] = 'new_message';
    this.ws.send(JSON.stringify(message));
  }

  /**
   * Fetches messages
   */
  fetchMessages(streamId: string) {
    const message: LiveChatMessage = { command: 'fetch_messages', message: '', username: '', liveStreamId: streamId };
    this.ws.send(JSON.stringify(message));
  }
}
