import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { StreamComponent } from './stream.component';
import { StreamStatsComponent } from '@app/stream/stats/stream-stats.component';
import { StreamChatArchiveComponent } from '@app/stream/chat-archive/archive.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'stream-stats/:id',
      component: StreamStatsComponent,
      data: { title: extract('Stream Stats') }
    }
  ]),
  Shell.childRoutes([
    {
      path: 'stream-chat-history/:id',
      component: StreamChatArchiveComponent,
      data: { title: extract('Stream Chat History') }
    }
  ]),
  Shell.childRoutes([{ path: 'stream/:id', component: StreamComponent, data: { title: extract('Stream') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class StreamRoutingModule {}
