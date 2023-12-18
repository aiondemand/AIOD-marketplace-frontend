import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { HttpClientModule } from '@angular/common/http';
import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import { MatIconModule } from '@angular/material/icon'; 
import { RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';



@NgModule({
  declarations: [
    ShoppingCartComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ShoppingCartRoutingModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
  ]
})
export class ShoppingCartModule { }
