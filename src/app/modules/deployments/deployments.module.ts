import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeploymentsListComponent } from './components/deployments-list/deployments-list.component';
import { DeploymentsRoutingModule } from './deployments-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { DeploymentDetailComponent } from './components/deployment-detail/deployment-detail.component';

@NgModule({
    declarations: [DeploymentsListComponent, DeploymentDetailComponent],
    imports: [CommonModule, DeploymentsRoutingModule, SharedModule],
})
export class DeploymentsModule {}
