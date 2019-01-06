import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [LoaderComponent],
  exports: [LoaderComponent]
})
export class SharedModule {}
