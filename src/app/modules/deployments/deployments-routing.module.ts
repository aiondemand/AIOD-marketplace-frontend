import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeploymentDetailComponent } from './components/deployment-detail/deployment-detail.component';
import { DeploymentsListComponent } from './components/deployments-list/deployments-list.component';

const routes: Routes = [
    {
        path: '',
        component: DeploymentsListComponent,
        data: {
            breadcrumb: 'Deployments',
        },
    },
    {
        path: ':uuid',
        component: DeploymentDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DeploymentsRoutingModule {}
