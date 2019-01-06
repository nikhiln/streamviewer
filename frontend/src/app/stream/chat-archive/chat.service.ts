import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { observable, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthenticationService } from '@app/core';
import { LiveChatMessage } from '@app/stream/live-chat.service';

const ROUTES = {
  STREAMCHATARCHIVE: '/youtube/stream-chat/'
};

export interface StreamChatArchiveContext {
  streamId: string;
  orderBy?: string;
  sender?: string;
}

@Injectable()
export class ChatService {
  constructor(private httpClient: HttpClient, private authService: AuthenticationService) {}

  /**
   * Gets the chat messages archive for given stream id
   * @param context
   */
  getChatHistory(context: StreamChatArchiveContext): Observable<Array<LiveChatMessage>> {
    const requestParams = this.authService.authHeaderOptions;
    requestParams['params'] = context;
    return this.httpClient.get(ROUTES.STREAMCHATARCHIVE, requestParams).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load data :-('))
    );
  }
}
