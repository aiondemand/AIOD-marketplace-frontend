import { Injectable } from "@angular/core";
import { AssetCategory } from "@app/shared/models/asset-category.model";
import { AssetModel } from "@app/shared/models/asset.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ShoppingCartService {
    constructor() {}
    private key = 'cart'
    private cartItems: BehaviorSubject<AssetModel[]> = new BehaviorSubject<AssetModel[]>(this.getCartItems());
    readonly cartItems$ = this.cartItems.asObservable();
    
    private isExistItem(asset: AssetModel): boolean {
        return !!this.getCartItems().find(item => item.identifier === asset.identifier && item.category === asset.category);
    }
    public getCartItems(): AssetModel[] {
        const items = JSON.parse(localStorage.getItem(this.key) || '[]');
        return items;
    }

    public cartItemsCount(): number {
        return this.getCartItems().length;
    }

    public addCartItems(item: AssetModel): void {
        if (this.isExistItem(item)) {
            console.warn('This asset already exists in the cart');
            return;
        }
        
        const items = this.getCartItems();
        items.push(item)
        localStorage.setItem(this.key, JSON.stringify(items));
        this.cartItems.next(items);
    }

    public deleteCartItem(id: string, category: AssetCategory): void {
        const items = this.getCartItems()
            .filter(asset => asset.identifier !== id || asset.category !== category);
        localStorage.setItem(this.key, JSON.stringify(items));
        this.cartItems.next(items);
    }
    

    public deleteCart(): void {
        localStorage.clear();
        this.cartItems.next([]);      
    }    

}