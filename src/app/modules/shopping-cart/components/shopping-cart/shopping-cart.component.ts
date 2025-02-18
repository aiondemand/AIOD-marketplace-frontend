import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingCartService } from '@app/shared/services/shopping-cart/shopping-cart.service';
import { AssetModel } from '@app/shared/models/asset.model';
import { AssetCategory } from "@app/shared/models/asset-category.model";
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { UserModel } from '@app/shared/models/user.model';
import { AssetsPurchase } from '@app/shared/models/asset-purchase.model';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  public cartItems: AssetModel[] = [];
  public userProfile!: UserProfile;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private shoppingCartService: ShoppingCartService,
    private paymentService: PaymentService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.shoppingCartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }
  private getCartItems(): AssetsPurchase[] {
    const assets: AssetModel[] = this.shoppingCartService.getCartItems();
    return assets.map(asset => { 
      return {
        identifier: ''+asset.identifier,
        name: asset.name,
        category: asset.category,
        urlMetadata: asset.sameAs,
        price: 0,
        addedAt: new Date().getDate()
      } as AssetsPurchase
    })
  }

  public deleteCartItem(id: number, category: AssetCategory): void {
    this.shoppingCartService.deleteCartItem(id, category);
  }

  public payment() {
    if (!!this.userProfile){
      const user = new UserModel({id_user: this.userProfile.identifier, user_email: this.userProfile.email})
      const items = this.getCartItems();

      this.paymentService.processOrderPayment(user, items).subscribe({
        next: (_userPurchases: any) => {
          this.shoppingCartService.deleteCart();
          this.router.navigate(['/my-library']);
        },
        error: (error: any) => console.error('Error payment', error)
      });
    }    
  }

  private isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  public isEnabledPay(): boolean {
    return this.isLoggedIn() && this.cartItems.length > 0;
  }

  ngOnInit(): void {
    const subscribeCart = this.shoppingCartService.cartItems$.subscribe(items => this.cartItems = items);
    const subscribeUser = this.authService.userProfileSubject.subscribe((profile) => this.userProfile = profile);

    this.subscriptions.add(subscribeUser)
    this.subscriptions.add(subscribeCart);
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
