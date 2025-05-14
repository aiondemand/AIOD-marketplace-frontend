import { Component, Input, OnInit } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AssetModel } from '@app/shared/models/asset.model';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { BookmarkBodyRemove, BookmarkService } from '@app/modules/marketplace/services/bookmark/bookmark.service'
import { environment } from '@environments/environment';
import { getKeyCategoryByValue } from '@app/modules/marketplace/utils/key-category.utils';
import { Router } from '@angular/router';
import { UserModel } from '@app/shared/models/user.model';
import { AssetsPurchase } from '@app/shared/models/asset-purchase.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { state } from '@angular/animations';

@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.scss']
})
export class AssetCardComponent implements OnInit{

  public userProfile!: UserProfile;
  private isBookmark: boolean;
  protected environment = environment;

  constructor(
    private appConfig: AppConfigService,
    private bookmarkService: BookmarkService,
    private router: Router,
    private authService: AuthService,
  ) {
    authService.userProfileSubject.subscribe((profile) => {
      this.userProfile = profile;
    });
    this.isBookmark = false // ToDo: this needs to be checked w.r.t user's library.
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
      this.categoryKey = getKeyCategoryByValue(AssetCategory, this.asset.category)
    }
  }

  public onClickBookmark(){
    if (!this.userProfile)
      this.authService.login(window.location.pathname);

    if (!this.isBookmark) {
      this.addBookmark();
      return;
    }
      
    this.deleteBookmark()
  }

  private addBookmark() {
    if (!!this.userProfile){
      const user = new UserModel({id_user: this.userProfile.identifier, user_email: this.userProfile.email})
      const bookmarkedAsset = this.getBookmarkedAsset();

      this.bookmarkService.addBookmark(user, [ bookmarkedAsset ]).subscribe({
        next: (_bookmarkedAssets: any) => { 
          this.isBookmark = true
        },
        error: (error: any) => console.error('Error bookmarking asset', error)
      });
    }    
  }

  private deleteBookmark() {
    if (!!this.userProfile){
      const user = new UserModel({id_user: this.userProfile.identifier, user_email: this.userProfile.email})
      const deleteBody = {
        identifier: this.asset.identifier,
        category: this.asset.category
      } as unknown as BookmarkBodyRemove

      this.bookmarkService.deleteBookmark({id: this.userProfile.identifier, email: this.userProfile.email}, deleteBody).subscribe({
        next: () => {
          this.isBookmark = false
        },
        error: (error: any) => console.error('Error deleting asset from bookmarks', error)
      });
    }    
  }
}
