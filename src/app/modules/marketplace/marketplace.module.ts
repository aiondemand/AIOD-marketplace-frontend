import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { SearchPipe } from './pipes/search-card-pipe';
import { MarkdownModule } from 'ngx-markdown';
import { AssetsListComponent } from './components/assets-list/assets-list.component';
import { AssetCardComponent } from './components/assets-list/asset-card/asset-card.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { AssetDetailComponent } from './components/asset-detail/asset-detail.component';
import { DatasetComponent } from './components/asset-detail/dataset/dataset.component';
import { ExperimentComponent } from './components/asset-detail/experiment/experiment.component';
import { EducationalResourceComponent } from './components/asset-detail/educational-resource/educational-resource.component';
import { PublicationComponent } from './components/asset-detail/publication/publication.component';
import { ServiceComponentComponent } from './components/asset-detail/service-component/service-component.component';
import { AimodelComponent } from './components/asset-detail/aimodel/aimodel.component';
import { MediaComponent } from './components/asset-detail/media/media.component';
import { MatExpansionModule } from '@angular/material/expansion'; 

@NgModule({
    declarations: [
        SearchPipe,
        AssetsListComponent,
        AssetCardComponent,
        AssetDetailComponent,
        DatasetComponent,
        ExperimentComponent,
        ServiceComponentComponent,
        AimodelComponent,
        MediaComponent,
        EducationalResourceComponent,
        PublicationComponent,
    ],
    imports: [
        CommonModule,
        MarketplaceRoutingModule,
        SharedModule,
        MatPaginatorModule,
        MatExpansionModule,
        MarkdownModule.forChild(),
    ],
})
export class MarketplaceModule {}
