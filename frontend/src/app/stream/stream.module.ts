import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { StreamRoutingModule } from './stream-routing.module';
import { StreamComponent } from './stream.component';
import { StreamStatsComponent } from '@app/stream/stats/stream-stats.component';
import { StreamStatService } from '@app/stream/stats/stat.service';
import { LiveChatService } from './live-chat.service';
import { StreamChatArchiveComponent } from '@app/stream/chat-archive/archive.component';
import { ChatService } from '@app/stream/chat-archive/chat.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NgxDatatableModule,
    CoreModule,
    SharedModule,
    StreamRoutingModule
  ],
  declarations: [StreamComponent, StreamStatsComponent, StreamChatArchiveComponent],
  providers: [LiveChatService, StreamStatService, ChatService]
})
export class StreamModule {}
