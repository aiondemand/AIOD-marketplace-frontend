import { AssetsPurchase } from "./asset-purchase.model";

export class UserModel {
    id: string;
    email: string;

    constructor(data: any) {
        this.id = data?.id_user??'';
        this.email = data?.user_email??'';
    }
}

export class UserPurchases extends UserModel {
    assets: AssetsPurchase[];
    constructor(data: any) {
        super(data);
        this.assets =  data?.assets.map((item: any) => new AssetsPurchase(item));
    }
}