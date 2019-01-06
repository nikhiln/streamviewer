import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { LivestreamService } from './livestream.service';

export interface LiveStream {
  id?: string;
  publishedAt?: string;
  channelId?: string;
  title?: string;
  description?: string;
  thumbnails?: {};
  channelTitle?: string;
  liveBroadcastContent?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  liveStreams: Array<LiveStream>;
  isLoading: boolean;

  constructor(private liveStreamSearchService: LivestreamService) {}

  ngOnInit() {
    this.getLiveStreams();
  }

  /**
   * Gets the top live streams from server side
   */
  getLiveStreams() {
    this.liveStreams = [];
    this.isLoading = true;
    this.liveStreamSearchService
      .getLiveStreams({})
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((streams: any) => {
        this.liveStreams = streams;
      });
  }
}
