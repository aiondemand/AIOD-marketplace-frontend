import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { SearchPipe } from './pipes/search-card-pipe';
import { MarkdownModule } from 'ngx-markdown';
import { AssetsListComponent } from './components/assets-list/assets-list.component';
import { AssetCardComponent } from './components/assets-list/asset-card/asset-card.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AssetDetailComponent } from './components/asset-detail/asset-detail.component';
import { GenericComponent } from './components/asset-detail/generic/generic.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SearchPipe,
    AssetsListComponent,
    AssetCardComponent,
    AssetDetailComponent,
    GenericComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MarketplaceRoutingModule,
    SharedModule,
    MatPaginatorModule,
    MatExpansionModule,
    MarkdownModule.forChild(),
  ],
})
export class MarketplaceModule {}
