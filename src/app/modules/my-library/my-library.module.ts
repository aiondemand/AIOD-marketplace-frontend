import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyLibraryRoutingModule } from './my-library-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { BookmarkViewComponent } from './components/bookmark-view/bookmark-view';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [BookmarkViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    MyLibraryRoutingModule,
  ],
})
export class MyLibraryModule {}
