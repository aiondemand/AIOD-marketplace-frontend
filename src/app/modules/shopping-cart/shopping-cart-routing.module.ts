import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';

const routes: Routes = [
    {
        path: '',
        component: ShoppingCartComponent,
    },
];
@NgModule(
    {
        imports: [RouterModule.forChild(routes)],

    }
)

export class ShoppingCartRoutingModule {

}
