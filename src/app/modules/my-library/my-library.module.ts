import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyLibraryRoutingModule } from './my-library-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { MyListComponent } from './components/my-list/my-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    MyListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    MyLibraryRoutingModule,
  ]
})
export class MyLibraryModule { }
