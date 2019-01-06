import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { observable, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthenticationService } from '@app/core';

const ROUTES = {
  STREAMSTAT: '/youtube/stats/'
};

export interface StreamStatSearchContext {
  streamId: string;
  orderBy?: string;
}

export interface StreamStat {
  sender__username: string;
  total?: string;
}

@Injectable()
export class StreamStatService {
  constructor(private httpClient: HttpClient, private authService: AuthenticationService) {}

  /**
   * Gets the stats for given stream id
   * @param context
   */
  getStreamStat(context: StreamStatSearchContext): Observable<Array<StreamStat>> {
    const requestParams = this.authService.authHeaderOptions;
    requestParams['params'] = context;
    return this.httpClient.get(ROUTES.STREAMSTAT, requestParams).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load data :-('))
    );
  }
}
