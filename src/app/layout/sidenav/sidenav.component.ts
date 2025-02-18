import { MediaMatcher } from '@angular/cdk/layout';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ParamsReqSearchAsset } from '@app/shared/interfaces/search-service.interface';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { FiltersStateService } from '@app/shared/services/sidenav/filters-state.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { Subscription, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlatformService } from '@app/modules/marketplace/services/common-services/platform.service';
import { SpinnerService } from '@app/shared/services/spinner/spinner.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, AfterViewInit {
    @ViewChild('sidenav', { static: true }) public sidenav!: MatSidenav;

    constructor(
        private _formBuilder: FormBuilder,
        protected authService: AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private sidenavService: SidenavService,
        private appConfigService: AppConfigService,
        private fb: FormBuilder,
        private router: Router,
        private filtersService: FiltersStateService,
        private platformService: PlatformService,
        public spinnerService: SpinnerService
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 1366px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    protected environment = environment;

    options = this._formBuilder.group({
        bottom: 0,
        fixed: false,
        top: 0,
    });

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    mainLinks = [
        {
            name: 'SIDENAV.MARKETPLACE',
            url: '/marketplace',
            isDisabled: false,
            isRestricted: false,
        },
        {
            name: 'SIDENAV.MY-LIBRARY',
            url: '/my-library',
            isDisabled: false,
            isRestricted: true,
        },
        {
            name: 'SIDENAV.ABOUT',
            url: '/about',
            isDisabled: false,
            isRestricted: false,
        }
    ];

    acknowledgments = '';
    projectName = '';
    projectUrl = '';


    platforms: any = [];
    assetCategories !: any;
    selectedCategory: AssetCategory = AssetCategory.Dataset;
    selectedPlatform!: string;
    searchFormGroup!: FormGroup;

    isFiltersVisible = false;
    isFilterLibraryVisible = false;

    private subscription: Subscription | undefined;

    initializeForm() {
        this.searchFormGroup = this.fb.group({
            search: '',
            enhancedSearch: [false]
        });
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    toggleFilterPanel() {
        const posiblesEndings = ['marketplace', 'my-library']
        this.router.events.subscribe((event: any) => {
            if (!!event['routerEvent']?.url) {
                this.isFiltersVisible = posiblesEndings.some(ending => {
                    this.isFilterLibraryVisible = ending == 'my-library';
                    return this.router.url.endsWith(ending);
                }
                );
            }
        })
    }

    subscriptionAssetCategory() {
        return this.filtersService.assetCategorySelected$.subscribe(
            (category: AssetCategory) => {
                this.selectedCategory = category;
            }
        );
    }

    getPlatforms() {
        this.platformService.getPlatforms().pipe(take(1)).subscribe(
            (platforms: any) => {
                this.platforms = platforms;
            }
        );
    }

    ngOnInit(): void {
        this.initializeForm();
        this.acknowledgments = this.appConfigService.acknowledgments;
        this.projectName = this.appConfigService.projectName;
        this.projectUrl = this.appConfigService.projectUrl;

        this.assetCategories = Object.values(AssetCategory);
        this.getPlatforms();
        this.toggleFilterPanel();
        this.subscription?.add(this.subscriptionAssetCategory());
    }

    onRadioTypeChange() {
        this.filtersService.setAssetCategorySelected(this.selectedCategory);
    }

    onSelectPlatformChange() {
        this.filtersService.setPlatformSelected(this.selectedPlatform);
    }

    ngAfterViewInit(): void {
        this.sidenavService.setSidenav(this.sidenav);
    }

    toggleSidenav() {
        this.sidenavService.toggle();
    }

    searchAssets() {
        const isEnhancedSearch = this.searchFormGroup.get('enhancedSearch')?.value;
        this.filtersService.setEnhancedSearch(isEnhancedSearch);

        var query = this.searchFormGroup.get('search')?.value;
        this.filtersService.setSearchQuery(query);

        if (isEnhancedSearch) {
            const searchType = this.selectedCategory || 'assets';
            this.spinnerService.show(`Searching ${searchType}...`);
        }
    }

    onInputChange() {
        const searchValue = this.searchFormGroup.get('search')?.value;

        if (!searchValue.trim()) {
            this.filtersService.setSearchQuery('');
        }
    }

    onEnhancedSearchChange(event: any) {
        const isEnhanced = event.checked || event.target?.checked;
        this.filtersService.setEnhancedSearch(isEnhanced);
    }

    isSearchButtonDisabled() {
        if (this.searchFormGroup.get('search')?.value) {
            return false;
        }

        return true;
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
