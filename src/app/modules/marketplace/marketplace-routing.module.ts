import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsListComponent } from './components/assets-list/assets-list.component';
import { AssetDetailComponent } from './components/asset-detail/asset-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AssetsListComponent,
    data: { breadcrumb: '> Resources > Catalogue' },
  },
  {
    path: ':id',
    component: AssetDetailComponent,
    data: { breadcrumb: { alias: 'assetName' } },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketplaceRoutingModule {}
