import { Component, Input, OnInit } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AssetModel } from '@app/shared/models/asset.model';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import {
  BookmarkBodyRemove,
  BookmarkService,
} from '@app/modules/marketplace/services/common-services/bookmark-service/bookmark.service';
import { environment } from '@environments/environment';
import { getKeyCategoryByValue } from '@app/modules/marketplace/utils/key-category.utils';
import { Params, Router } from '@angular/router';
import { UserModel } from '@app/shared/models/user.model';
import { AssetsPurchase } from '@app/shared/models/asset-purchase.model';

@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.scss'],
})
export class AssetCardComponent implements OnInit {
  public userProfile!: UserProfile;
  private isBookmark: number;
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
    this.isBookmark = 0; // ToDo: this needs to be checked w.r.t user's library.
  }

  @Input() mode = 1;
  @Input() asset!: any;
  categoryColor = '';
  categoryKey!: string | undefined;
  assetIcon = '';
  isBookmarked = false;

  private getBookmarkedAsset(): AssetsPurchase {
    return {
      identifier: '' + this.asset.identifier,
      name: this.asset.name,
      category: this.asset.category,
      urlMetadata: this.asset.same_as ?? '',
      price: 0,
      addedAt: new Date().getDate(),
    } as AssetsPurchase;
  }

  ngOnInit(): void {
    if (this.asset) {
      this.categoryKey = getKeyCategoryByValue(
        AssetCategory,
        this.asset.category,
      );
    }
  }

  protected onClickBookmark(): void {
    if (!this.isAuthenticated()) return;

    if (!this.isBookmarked) {
      this.addBookmark();
    } else this.deleteBookmark();

    this.isBookmarked = !this.isBookmarked;
  }

  isAuthenticated(): boolean {
    return this.userProfile && Object.keys(this.userProfile).length > 0;
  }

  private addBookmark() {
    if (this.userProfile) {
      const user = new UserModel({
        id_user: this.userProfile.identifier,
        user_email: this.userProfile.email,
      });
      const bookmarkedAsset = this.getBookmarkedAsset();

      this.bookmarkService.addBookmark(user, [bookmarkedAsset]).subscribe({
        next: (_bookmarkedAssets: any) => {
          // ToDo: change bookmark icon style
        },
        error: (error: any) => console.error('Error bookmarking asset', error),
      });
    }
  }

  private deleteBookmark() {
    if (this.userProfile) {
      const user = new UserModel({
        id_user: this.userProfile.identifier,
        user_email: this.userProfile.email,
      });
      const deleteBody = {
        identifier: this.asset.identifier.toString(),
        category: this.asset.category,
      } as BookmarkBodyRemove;

      this.bookmarkService.deleteBookmark(user, deleteBody).subscribe({
        next: () => {
          // ToDo: change bookmark icon style
        },
        error: (error: any) =>
          console.error('Error deleting asset from bookmarks', error),
      });
    }
  }

  handleMouseClick(event: MouseEvent, identifier: string, queryParams: Params) {
    const buttonPressed = event.button;
    const url = this.getAssetDetailURL(identifier, queryParams);
    let target = '_self';

    // User click with mouse wheel or right button
    if (buttonPressed === 1 || buttonPressed === 2) {
      target = '_blank';
    }

    window.open(url, target);
    event.preventDefault();
  }

  private getAssetDetailURL(route: string, queryParams: Params) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/resources', route], { queryParams }),
    );
    return url;
  }
}
