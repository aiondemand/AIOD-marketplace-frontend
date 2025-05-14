import { Component, Input, OnInit } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AssetModel } from '@app/shared/models/asset.model';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { BookmarkBodyRemove, BookmarkService, BookmarkURLParams, BookmarkOperation } from '@app/modules/marketplace/services/common-services/bookmark-service/bookmark.service'
import { environment } from '@environments/environment';
import { getKeyCategoryByValue } from '@app/modules/marketplace/utils/key-category.utils';
import { Router } from '@angular/router';
import { UserModel } from '@app/shared/models/user.model';
import { AssetsPurchase } from '@app/shared/models/asset-purchase.model';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.scss']
})
export class AssetCardComponent implements OnInit{

  public userProfile!: UserProfile;
  private isBookmark: number;
  protected environment = environment;

  constructor(
    private appConfig: AppConfigService,
    private bookmarkService: BookmarkService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    authService.userProfileSubject.subscribe((profile) => {
      this.userProfile = profile;
    });
    this.isBookmark = 0 // ToDo: this needs to be checked w.r.t user's library.
  }

  @Input() mode: number= 1
  @Input() asset!: AssetModel;
  categoryColor: string = '';
  categoryKey!: string | undefined;
  assetIcon: string = '';

  private getBookmarkedAsset(): AssetsPurchase {
    return {
      identifier: ''+this.asset.identifier,
      name: this.asset.name,
      category: this.asset.category,
      urlMetadata: this.asset.sameAs,
      price: 0,
      addedAt: new Date().getDate()
    } as AssetsPurchase
  }

  ngOnInit(): void {
    if(this.asset) {
      this.categoryKey = getKeyCategoryByValue(AssetCategory, this.asset.category);
      const bookmarkAfterLogin = this.route.snapshot.queryParamMap.has(BookmarkURLParams.OP_NAME);
      
      if (!bookmarkAfterLogin)
        return;
      this.handleBookmarkOpAfterLogin();      
    }
  }

  handleBookmarkOpAfterLogin() {
    const paramBookmarkOp = Number(this.route.snapshot.queryParamMap.get(BookmarkURLParams.OP_NAME));
    const paramId = Number(this.route.snapshot.queryParamMap.get(BookmarkURLParams.ASSET_ID));
    const paramCategory = this.route.snapshot.queryParamMap.get(BookmarkURLParams.ASSET_CATEGORY);

    if (! (paramId == this.asset.identifier) 
            && (paramCategory == this.asset.category)) 
      return;
    this.isBookmark = paramBookmarkOp;
    this.doBookmarkOperation();
  }
 

  onClickBookmark(): void {
    if (!this.isAuthenticated()) {
      const bookmarkOp = this.isBookmark ? 1 : 0;
      const paramsObject: any = {};
      paramsObject[BookmarkURLParams.OP_NAME] = bookmarkOp;
      paramsObject[BookmarkURLParams.ASSET_ID] = this.asset.identifier;
      paramsObject[BookmarkURLParams.ASSET_CATEGORY] = this.asset.category

      const httpParams = new HttpParams(paramsObject);
      const queryString = httpParams.toString();

      const redirectUri = window.location.pathname + '?' + queryString;
      console.log(redirectUri);
      this.authService.login(redirectUri);
      return;
    }

    this.doBookmarkOperation();
  }

  private isAuthenticated(): boolean {
    return this.userProfile && Object.keys(this.userProfile).length > 0;
  }

  private doBookmarkOperation() {
    if (this.isBookmark == 0) {
      this.addBookmark();
      return;
    } 
    this.deleteBookmark();
  }
  
  private addBookmark() {
    if (!!this.userProfile){
      const user = new UserModel({id_user: this.userProfile.identifier, user_email: this.userProfile.email})
      const bookmarkedAsset = this.getBookmarkedAsset();

      this.bookmarkService.addBookmark(user, [ bookmarkedAsset ]).subscribe({
        next: (_bookmarkedAssets: any) => { 
          this.isBookmark = 1;
          // ToDo: change bookmark icon style
        },
        error: (error: any) => console.error('Error bookmarking asset', error)
      });
    }    
  }

  private deleteBookmark() {
    if (!!this.userProfile){
      const user = new UserModel({id_user: this.userProfile.identifier, user_email: this.userProfile.email})
      const deleteBody = {
        identifier: this.asset.identifier.toString(),
        category: this.asset.category
      } as  BookmarkBodyRemove

      this.bookmarkService.deleteBookmark(user, deleteBody).subscribe({
        next: () => {
          this.isBookmark = 0
        },
        error: (error: any) => console.error('Error deleting asset from bookmarks', error)
      });
    }    
  }
}
