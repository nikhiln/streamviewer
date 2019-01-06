import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthenticationService } from '@app/core';

const ROUTES = {
  LIVESTREAMS: '/youtube/livestream/'
};

export interface LiveStreamSearchContext {
  // topics...
  query?: string;
}

@Injectable()
export class LivestreamService {
  constructor(private httpClient: HttpClient, private authService: AuthenticationService) {}

  /**
   * Fetches the top live streams from server side
   * @param context
   */
  getLiveStreams(context: LiveStreamSearchContext): Observable<any> {
    const requestParams = this.authService.authHeaderOptions;
    requestParams['params'] = context;
    return this.httpClient.get(ROUTES.LIVESTREAMS, requestParams).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load data :-('))
    );
  }
}
