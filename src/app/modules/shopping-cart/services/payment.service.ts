import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { UserModel, UserPurchases } from '@app/shared/models/user.model';
import { AssetsPurchase } from '@app/shared/models/asset-purchase.model';
import { AuthService } from '@app/core/services/auth/auth.service';

const { base, endpoints } = environment.api;
@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHttpHeader(): HttpHeaders {
    const authToken = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    });

    return headers;
  }

  private parseResponse(data: any): UserPurchases {
    return new UserPurchases(data.data);
  }

  private parseRequest(items: AssetsPurchase[]): Array<any> {
    return items.map(item => {
      return {
        identifier: item.identifier,
        name: item.name,
        category: item.category,
        url_metadata: item.urlMetadata || 'none',
        price: item.price,
        added_at: item.addedAt
      }
    })
  }
  
  processOrderPayment(user: UserModel, items: AssetsPurchase[]): Observable<UserPurchases> {
    const url = `${base}${endpoints.prefixApiPayment}${endpoints.payment}`.replace(':userId', user.id);
    const params = new HttpParams().set('user_email', user.email);
    const headers = this.getHttpHeader();

    return this.http.post<any>(url, this.parseRequest(items), { params, headers })
      .pipe(map((data) => this.parseResponse(data)));
  }
}
