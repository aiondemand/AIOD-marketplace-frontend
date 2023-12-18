import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './core/guards/authentication.guard';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';

const routes: Routes = [
    {
        path: '',
        component: ContentLayoutComponent,
        //canActivate: [NoAuthGuard], // Should be replaced with actual auth guard
        children: [
            {
                path: '',
                redirectTo: 'marketplace',
                pathMatch: 'full',
            },
/*             {
                path: 'dashboard',
                loadChildren: () =>
                    import('@modules/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: 'assets',
                loadChildren: () =>
                    import('@modules/marketplace/marketplace.module').then(
                        (m) => m.MarketplaceModule
                    ),
            },
            {
                path: 'deployments',
                canActivate: [AuthenticationGuard],
                loadChildren: () =>
                    import('@modules/deployments/deployments.module').then(
                        (m) => m.DeploymentsModule
                    ),
            },
            {
                path: 'forbidden',
                loadChildren: () =>
                    import('@modules/forbidden/forbidden.module').then(
                        (m) => m.ForbiddenModule
                    ),
            }, */

            {
                path: 'marketplace',
                loadChildren: () =>
                    import('@modules/marketplace/marketplace.module').then(
                        (m) => m.MarketplaceModule
                    ),
            },
            {
                path: 'my-library',
                loadChildren: () =>
                    import('@modules/my-library/my-library.module').then(
                        (m) => m.MyLibraryModule
                    ),
            },
            {
                path: 'shopping-cart',
                loadChildren: () =>
                    import('@modules/shopping-cart/shopping-cart.module').then(
                        (m) => m.ShoppingCartModule
                    ),
            },
            {
                path: '**',
                component: NotFoundComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
