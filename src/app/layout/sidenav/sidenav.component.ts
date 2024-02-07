import { MediaMatcher } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ParamsReqSearchAsset } from '@app/shared/interfaces/search-service.interface';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { FiltersStateService } from '@app/shared/services/sidenav/filters-state.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { environment } from 'src/environments/environment';

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
        },
    ];

    acknowledgments = '';
    projectName = '';
    projectUrl = '';


    platforms: any;
    assetCategories !: any;
    selectedCategory: AssetCategory = AssetCategory.Dataset;
    selectedPlatform!: string;
    searchFormGroup!: FormGroup;

    isFiltersVisible = false;
    isFilterLibraryVisible = false;

    initializeForm() {
        this.searchFormGroup = this.fb.group({
            search: '',
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

    ngOnInit(): void {
        this.initializeForm();
        this.acknowledgments = this.appConfigService.acknowledgments;
        this.projectName = this.appConfigService.projectName;
        this.projectUrl = this.appConfigService.projectUrl;

        this.assetCategories = Object.values(AssetCategory);
        this.platforms = [
            {
                "name": "aiod",
                "identifier": 1
            },
            {
                "name": "openml",
                "identifier": 3
            },
            {
                "name": "huggingface",
                "identifier": 4
            },
            {
                "name": "zenodo",
                "identifier": 5
            },
            {
                "name": "stairwai",
                "identifier": 7
            },
            {
                "name": "bonseyes",
                "identifier": 8
            },
            {
                "name": "aida_cms",
                "identifier": 9
            }
        ];
        this.toggleFilterPanel();
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
        var query = this.searchFormGroup.get('search')?.value;
        this.filtersService.setSearchQuery(query);
    }

    onInputChange() {
        const searchValue = this.searchFormGroup.get('search')?.value;

        if(!searchValue.trim()) {
            this.filtersService.setSearchQuery('');            
        }
    }
}
