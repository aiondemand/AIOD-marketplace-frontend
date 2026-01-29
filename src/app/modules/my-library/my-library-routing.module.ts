import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookmarkViewComponent } from './components/bookmark-view/bookmark-view';

const routes: Routes = [
  {
    path: '',
    component: BookmarkViewComponent,
    data: { breadcrumb: '> Bookmarks' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class MyLibraryRoutingModule {}
