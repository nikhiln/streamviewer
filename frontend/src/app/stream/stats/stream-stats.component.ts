import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '@app/core';
import { StreamStatService, StreamStat, StreamStatSearchContext } from '@app/stream/stats/stat.service';

@Component({
  selector: 'app-stream-stats',
  templateUrl: './stream-stats.component.html',
  styleUrls: ['./stream-stats.component.scss']
})
export class StreamStatsComponent implements OnInit {
  loading: boolean;
  streamId: string;
  user: {};
  streamStats: Array<StreamStat>;
  columns: Array<{}>;

  private routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private authService: AuthenticationService,
    private streamStatService: StreamStatService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.streamId = params['id'];
      this.getStreamStat();
    });

    this.user = this.authService.credentials.user;

    // cols
    this.columns = [{ name: 'Sender', sortable: true, prop: 'sender__username' }, { name: 'Total', sortable: true }];
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  /**
   * Gets the stream stats related data
   * @param orderBy
   */
  getStreamStat(orderBy: string = '-total') {
    this.streamStats = [];
    this.loading = true;
    const streamStatSearchContext: StreamStatSearchContext = { streamId: this.streamId, orderBy: orderBy };
    this.streamStatService.getStreamStat(streamStatSearchContext).subscribe(data => {
      this.streamStats = data;
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
        this.getStreamStat(col);
      }, 1000);
    }
  }
}
