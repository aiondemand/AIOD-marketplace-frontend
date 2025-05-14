import { Component, OnDestroy, OnInit } from "@angular/core";
import { AssetCategory } from "@app/shared/models/asset-category.model";
import { ParamsReqAsset } from "@app/shared/interfaces/asset-service.interface";
import { AssetModel } from "@app/shared/models/asset.model";
import {
  Subject,
  Subscription,
  combineLatest,
  debounceTime,
  filter,
  finalize,
  interval,
  map,
  of,
  scan,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  throwError,
} from "rxjs";
import { FiltersStateService } from "@app/shared/services/sidenav/filters-state.service";
import { PageEvent } from "@angular/material/paginator";
import { ParamsReqSearchAsset } from "@app/shared/interfaces/search-service.interface";
import { GeneralAssetService } from "../../services/assets-services/general-asset.service";
import { ElasticSearchService } from "../../services/elastic-search/elastic-search.service";
import { SearchModel } from "@app/shared/models/search.model";
import { SpinnerService } from "@app/shared/services/spinner/spinner.service";
import { hasQuotes } from "../../utils/common.utils";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PlatformService } from "../../services/common-services/platform.service";
import { AuthService } from "@app/core/services/auth/auth.service";

const MAX_ATTEMPTS = 15;

const assetCategoryMapping = {
  [AssetCategory.AIModel]: "ml_models",
  [AssetCategory.Dataset]: "datasets",
  [AssetCategory.Experiment]: "experiments",
  [AssetCategory["Educational resource"]]: "educational_resources",
  [AssetCategory["Service"]]: "services",
};

@Component({
  selector: "app-assets-list",
  templateUrl: "./assets-list.component.html",
  styleUrls: ["./assets-list.component.scss"],
})
export class AssetsListComponent implements OnInit, OnDestroy {


  private subscriptions: Subscription = new Subscription();
  private enhancedSearchSubscription?: Subscription;

  public isLoading = false;
  public assets: AssetModel[] | any[] = [];
  protected categorySelected!: AssetCategory;
  protected platformSelected: string = '';
  public isEnhancedSearch: boolean = false;
  public searchQueryValue: string = "";

  public assetsSize = 0; /* number of assets found */
  public pageSize = 15; /* assets per page */
  public offset = 0;
  public pageSizeOptions = [15, 20, 50, 100];
  public currentPage = 1;

  protected displayModeValue: number = 1; //normally on several labels per line

  destroy$ = new Subject<any>();

  assetCategories!: any;
  searchFormGroup!: FormGroup;

  isFiltersVisible = false;
  isFilterLibraryVisible = false;
  inputTooShort:boolean = true;

  private subscription: Subscription | undefined;

  platforms: any = [];

  protected lonelyCategory:boolean = false;
  isLightTheme: string | null ='dark';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private filtersService: FiltersStateService,
    private platformService: PlatformService,
    protected authService: AuthService,
    private route: ActivatedRoute,
    private generalAssetService: GeneralAssetService,
    private filtersStateService: FiltersStateService,
    private searchService: ElasticSearchService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.initializeSearchForm();
    this.assetCategories = Object.values(AssetCategory);
    this.getPlatforms();
    this.subscription?.add(this.subscriptionAssetCategory());
    this.getFilters();

    this.filtersStateService.isEnhancedSerach$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value) => {
          this.isEnhancedSearch = value;
        },
      });

    this.filtersStateService.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value) => {
          this.searchQueryValue = value;
        },
      });

      this.route.queryParams.subscribe(params => {

        for (const [key, value] of Object.entries(assetCategoryMapping)) {
          if (value === params['category']) {
            this.categorySelected = key as AssetCategory;
            this.lonelyCategory = true;
            this.searchAssets()
            break;
          }
        }
      });
      this.isLightTheme = document.documentElement.getAttribute('data-theme');
      
  }

  protected selectPlat(platform: string) {
    this.platformSelected = platform;
    this.filtersService.setPlatformSelected(this.platformSelected);
  }
  protected unSelectPlat(id: number) {
    //TODO MAKE THEM UNSElECTED
  }

  protected selectAllPlat() {
    this.platformSelected = '';
    this.searchAssets()

  }


  protected selectCat(category: AssetCategory) {
    this.categorySelected = category;
    this.filtersService.setAssetCategorySelected(this.categorySelected);
  }
  protected unSelectCat(id: number) {
    //TODO MAKE THEM UNSElECTED
  }

  protected selectAllCat() {
    throw new Error("Method not implemented.");
  }
  
  
  
  initializeSearchForm() {
    this.searchFormGroup = this.fb.group({
      search: "",
      enhancedSearch: {value: false, disabled:true }
    });
  }

  searchAssets() {
    const isEnhancedSearch = this.searchFormGroup.get("enhancedSearch")?.value;
    this.filtersService.setEnhancedSearch(isEnhancedSearch);

    var query = this.searchFormGroup.get("search")?.value;
    this.filtersService.setSearchQuery(query);
  }

  onInputChange() {
    const searchValue = this.searchFormGroup.get("search")?.value;
    this.inputTooShort = searchValue.trim().length < 3;

    if (this.inputTooShort){ 
      this.searchFormGroup.get("enhancedSearch")?.disable();
      this.searchFormGroup.get("enhancedSearch")?.setValue(false);
                  
    }
    else {this.searchFormGroup.get("enhancedSearch")?.enable()}
     

    if (!searchValue.trim()) {
            this.filtersService.setSearchQuery('');
        }
  }

  onEnhancedSearchChange(event: any) {
    const isEnhanced = event.checked || event.target?.checked;
    this.filtersService.setEnhancedSearch(isEnhanced);
  }

  isEnhancedSearchF() {
    return (
      !this.searchFormGroup.get("search")?.value &&
      this.filtersService.isEnhancedSerach
    );
  }


  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleFilterPanel() {
    const posiblesEndings = ["marketplace", "my-library"];
    this.router.events.subscribe((event: any) => {
      if (!!event["routerEvent"]?.url) {
        this.isFiltersVisible = posiblesEndings.some((ending) => {
          this.isFilterLibraryVisible = ending == "my-library";
          return this.router.url.endsWith(ending);
        });
      }
    });
  }

  subscriptionAssetCategory() {
    return this.filtersService.assetCategorySelected$.subscribe(
      (category: AssetCategory) => {
        this.categorySelected = category;
      }
    );
  }

  getPlatforms() {
    this.platformService
      .getPlatforms()
      .pipe(take(1))
      .subscribe((platforms: any) => {
        this.platforms = platforms;
      });
  }

  private basicSearch(): void {
    this.isLoading = true;

    var query = this.filtersStateService.searchQuery;
    var platformsSelected = [];

    if (!!this.filtersStateService.platformSelected) {
      platformsSelected.push(this.filtersStateService.platformSelected);
    }

    const params: ParamsReqSearchAsset = {
      searchQuery: query,
      limit: this.pageSize,
      page: this.currentPage,
      platforms: platformsSelected,
    };

    if (hasQuotes(query)) {
      params.exact_match = true;
    }

    const subscribe = this.searchService
      .getAssetBySearch(params, this.categorySelected)
      .subscribe({
        next: (resp: SearchModel) => {
          this.isLoading = false;
          this.assets = resp.resources;
          this.assetsSize = resp.totalHits;
        },
        error: (error: any) => {
          setTimeout(() => (this.isLoading = false), 5000);
          console.error("Error get assets", error);
        },
      });
    this.subscriptions.add(subscribe);
  }

  private isValidAssetCategory(category: any): boolean {
    return Object.values(AssetCategory).includes(category);
  }

  private getAssets(): void {
    this.isLoading = true;
    const parms: ParamsReqAsset = { offset: this.offset, limit: this.pageSize };
    this.generalAssetService.setAssetCategory(this.categorySelected);

    const serviceObs = !!this.platformSelected
      ? this.generalAssetService.getAssetsByPlatform(
          this.platformSelected,
          parms
        )
      : this.generalAssetService.getAssets(parms);

    const subscribe = serviceObs.subscribe({
      next: (assets: AssetModel[]) => {
        this.isLoading = false;
        this.assets = assets;
      },
      error: (error: any) => {
        (this.assets = [
          {
            identifier: 24,
            category: "Dataset",
            name: "bigIR/ar_cov19",
            description:
              "ArCOV-19 is an Arabic COVID-19 Twitter dataset that covers the period from 27th of January till 30th of April 2020. ArCOV-19 is designed to enable research under several domains including natural language processing, information retrieval, and social computing, among others",
            platform: "huggingface",
            platform_resource_identifier: "621ffdd236468d709f181d6f",
            keywords: [
              "source_datasets:original",
              "region:us",
              "language_creators:found",
              "multilinguality:monolingual",
              "language:ar",
              "annotations_creators:no-annotation",
              "size_categories:1m<n<10m",
              "task_categories:other",
              "arxiv:2004.05861",
              "data-mining",
            ],
            sameAs: "https://huggingface.co/datasets/bigIR/ar_cov19",
            scientific_domain: [],
            research_area: [],
            date_published: "2022-03-02T23:29:22",
            media: [],
            citation: [23],
            dateCreated: "2023-11-29T14:23:59.000Z",
          },
          {
            identifier: 42,
            category: "Dataset",
            name: "facebook/babi_qa",
            description:
              "The (20) QA bAbI tasks are a set of proxy tasks that evaluate reading\ncomprehension via question answering. Our tasks measure understanding\nin several ways: whether a system is able to answer questions via chaining facts,\nsimple induction, deduction and many more. The tasks are designed to be prerequisites\nfor any system that aims to be capable of conversing with a human.\nThe aim is to classify these tasks into skill sets,so that researchers\ncan identify (and then rectify)the failings of their systems.",
            platform: "huggingface",
            platform_resource_identifier: "621ffdd236468d709f181d81",
            keywords: [
              "source_datasets:original",
              "language:en",
              "size_categories:10k<n<100k",
              "region:us",
              "multilinguality:monolingual",
              "size_categories:n<1k",
              "size_categories:1k<n<10k",
              "task_categories:question-answering",
              "language_creators:machine-generated",
              "annotations_creators:machine-generated",
              "arxiv:1511.06931",
              "arxiv:1502.05698",
              "chained-qa",
              "license:cc-by-3.0",
            ],
            sameAs: "https://huggingface.co/datasets/facebook/babi_qa",
            license: "cc-by-3.0",
            scientific_domain: [],
            research_area: [],
            date_published: "2022-03-02T23:29:22",
            media: [],
            citation: [41],
            dateCreated: "2023-11-29T14:24:10.000Z",
          },
          {
            identifier: 56,
            category: "Dataset",
            name: "TheBritishLibrary/blbooks",
            description:
              "A dataset comprising of text created by OCR from the 49,455 digitised books, equating to 65,227 volumes (25+ million pages), published between c. 1510 - c. 1900.\nThe books cover a wide range of subject areas including philosophy, history, poetry and literature.",
            platform: "huggingface",
            platform_resource_identifier: "621ffdd236468d709f181d8f",
            keywords: [
              "source_datasets:original",
              "language:en",
              "region:us",
              "size_categories:100k<n<1m",
              "task_categories:fill-mask",
              "language_creators:machine-generated",
              "task_ids:language-modeling",
              "task_ids:masked-language-modeling",
              "task_categories:text-generation",
              "annotations_creators:no-annotation",
              "language:fr",
              "multilinguality:multilingual",
              "language:es",
              "language:de",
              "task_categories:other",
              "license:cc0-1.0",
              "language:nl",
              "language:it",
              "digital-humanities-research",
            ],
            sameAs: "https://huggingface.co/datasets/TheBritishLibrary/blbooks",
            license: "cc0-1.0",
            scientific_domain: [],
            research_area: [],
            date_published: "2022-03-02T23:29:22",
            media: [],
            citation: [52],
            dateCreated: "2023-11-29T14:24:19.000Z",
          },
          {
            identifier: 57,
            category: "Dataset",
            name: "TheBritishLibrary/blbooksgenre",
            description:
              "This dataset contains metadata for resources belonging to the British Library’s digitised printed books (18th-19th century) collection (bl.uk/collection-guides/digitised-printed-books).\nThis metadata has been extracted from British Library catalogue records.\nThe metadata held within our main catalogue is updated regularly.\nThis metadata dataset should be considered a snapshot of this metadata.",
            platform: "huggingface",
            platform_resource_identifier: "621ffdd236468d709f181d90",
            keywords: [
              "source_datasets:original",
              "annotations_creators:expert-generated",
              "language:en",
              "size_categories:10k<n<100k",
              "region:us",
              "task_categories:text-classification",
              "size_categories:1k<n<10k",
              "language_creators:expert-generated",
              "task_ids:topic-classification",
              "task_categories:fill-mask",
              "task_ids:language-modeling",
              "task_ids:masked-language-modeling",
              "task_categories:text-generation",
              "language:fr",
              "multilinguality:multilingual",
              "language_creators:crowdsourced",
              "language:de",
              "license:cc0-1.0",
              "language:nl",
              "task_ids:multi-label-classification",
            ],
            sameAs:
              "https://huggingface.co/datasets/TheBritishLibrary/blbooksgenre",
            license: "cc0-1.0",
            scientific_domain: [],
            research_area: [],
            date_published: "2022-03-02T23:29:22",
            media: [],
            citation: [],
            dateCreated: "2023-11-29T14:24:19.000Z",
          },
          {
            identifier: 115,
            category: "Dataset",
            name: "anneal",
            description:
              "**Author**: Unknown. Donated by David Sterling and Wray Buntine  \n\n**Source**: [UCI](https://archive.ics.uci.edu/ml/datasets/Annealing) - 1990  \n\n**Please cite**: [UCI](https://archive.ics.uci.edu/ml/citation_policy.html)  \n\n\n\nThe original Annealing dataset from UCI. The exact meaning of the features and classes is largely unknown. Annealing, in metallurgy and materials science, is a heat treatment that alters the physical and sometimes chemical properties of a material to increase its ductility and reduce its hardness, making it more workable. It involves heating a material to above its recrystallization temperature, maintaining a suitable temperature, and then cooling. (Wikipedia)\n\n\n\n### Attribute Information:\n\n     1. family:          --,GB,GK,GS,TN,ZA,ZF,ZH,ZM,ZS\n\n     2. product-type:    C, H, G\n\n     3. steel:           -,R,A,U,K,M,S,W,V\n\n     4. carbon:          continuous\n\n     5. hardness:        continuous\n\n     6. temper_rolling:  -,T\n\n     7. condition:       -,S,A,X\n\n     8. formability:     -,1,2,3,4,5\n\n     9. strength:        continuous\n\n    10. non-ageing:      -,N\n\n    11. surface-finish:  P,M,-\n\n    12. surface-quality: -,D,E,F,G\n\n    13. enamelability:   -,1,2,3,4,5\n\n    14. bc:              Y,-\n\n    15. bf:              Y,-\n\n    16. bt:              Y,-\n\n    17. bw/me:           B,M,-\n\n    18. bl:              Y,-\n\n    19. m:               Y,-\n\n    20. chrom:           C,-\n\n    21. phos:            P,-\n\n    22. cbond:           Y,-\n\n    23. marvi:           Y,-\n\n    24. exptl:           Y,-\n\n    25. ferro:           Y,-\n\n    26. corr:            Y,-\n\n    27. blue/bright/varn/clean:          B,R,V,C,-\n\n    28. lustre:          Y,-\n\n    29. jurofm:          Y,-\n\n    30. s:               Y,-\n\n    31. p:               Y,-\n\n    32. shape:           [...]",
            platform: "openml",
            platform_resource_identifier: "2",
            keywords: [
              "study_14",
              "study_37",
              "test",
              "study_1",
              "study_34",
              "study_41",
              "study_76",
              "study_70",
              "uci",
              "manufacturing",
            ],
            sameAs: "https://www.openml.org/api/v1/json/data/2",
            license: "public",
            scientific_domain: [],
            research_area: [],
            date_published: "2014-04-06T23:19:24",
            media: [],
            version: "1",
            citation: [],
            dateCreated: "2023-11-29T14:25:05.000Z",
          }
        ]),
          setTimeout(() => (this.isLoading = false), 3000);
        console.error("Error get assets", error);
      },
    });
    this.subscriptions.add(subscribe);
  }

  private getAssetsSize(category: AssetCategory): void {
    this.generalAssetService.setAssetCategory(category);
    const subscribe = this.generalAssetService.countAssets().subscribe({
      next: (size: number) => (this.assetsSize = size),
      error: (error: any) => {
        this.assetsSize = 0;
        console.error("Error get assets size", error);
      },
    });
    this.subscriptions.add(subscribe);
  }

  private getFilters(): void {
    const subscribe = this.filtersStateService.assetCategorySelected$
      .pipe(
        switchMap((category: AssetCategory) => {
          if (!this.isValidAssetCategory(this.categorySelected)) {
            this.categorySelected = AssetCategory.Dataset;
            this.filtersStateService.setAssetCategorySelected(
              AssetCategory.Dataset
            );
          } else {
            this.categorySelected = category;
          }
          return this.filtersStateService.platformSelected$;
        }),
        switchMap((platform: string) => {
          this.platformSelected = platform;
          return combineLatest([
            this.filtersStateService.searchQuery$,
            this.filtersStateService.isEnhancedSerach$,
          ]);
        }),
        debounceTime(300),
        switchMap(([searchQuery, isEnhanced]) => {
          if (searchQuery !== "") {
            if (isEnhanced) {
              this.enhancedSearch(searchQuery);
            } else {
              this.basicSearch();
            }
          } else if (!isEnhanced) {
            this.getAssets();
            this.getAssetsSize(this.categorySelected);
          }
          return of(null);
        })
      )
      .subscribe(() => {});
    this.subscriptions.add(subscribe);
  }

  public handlePageEvent(e: PageEvent) {
    this.offset = e.pageIndex * e.pageSize;
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
    if (!this.isEnhancedSearch) {
      this.getAssets();
    } else if (this.searchQueryValue) {
      this.enhancedSearch(this.searchQueryValue);
    }
  }

  isPaginationDisabled() {
    if (this.isEnhancedSearch && !this.searchQueryValue) {
      return true;
    }

    return false;
  }

  initSpinner() {
    this.spinnerService.show("Initializing enhanced search...");
  }

  private enhancedSearch(query: string): void {
    const categorySelected = this.sanitizeAssetCategory(this.categorySelected);

    if (this.enhancedSearchSubscription) {
      this.enhancedSearchSubscription.unsubscribe();
    }

    this.generalAssetService.setAssetCategory(this.categorySelected);
    this.enhancedSearchSubscription = this.generalAssetService
      .getAssetsByEnhancedSearch(query, categorySelected, this.pageSize)
      .pipe(
        switchMap((locationHeader) => {
          return interval(2000).pipe(
            switchMap(() =>
              this.generalAssetService.checkEnhancedSearchStatus(locationHeader)
            ),
            scan(
              (attempts: any, response: any) => {
                this.spinnerService.updateMessage(`Search in progress...`);

                return {
                  attempts: attempts.attempts + 1,
                  response: response,
                };
              },
              { attempts: 0, response: null }
            ),
            map((data: any) => ({
              ...data.response,
              _attemptNumber: data.attempts,
            })),
            takeWhile(
              (response) =>
                response.status === "In_progress" &&
                response._attemptNumber < MAX_ATTEMPTS,
              true
            )
          );
        }),
        filter(
          (response) =>
            response.status === "Completed" && !!response.result_doc_ids
        ),
        switchMap((response) => {
          if (
            response.status === "In_progress" &&
            response._attemptNumber >= MAX_ATTEMPTS
          ) {
            this.spinnerService.updateMessage(
              "Search is taking longer than expected..."
            );

            return throwError(
              () =>
                new Error(`Attemps limit exceded (${MAX_ATTEMPTS * 2} seconds)`)
            );
          }

          if (response.status === "Completed" && !response.result_doc_ids) {
            this.spinnerService.updateMessage("No results found.");
            return of({ result_doc_ids: [] });
          }

          if (response.status === "Completed" && response.result_doc_ids) {
            this.spinnerService.updateMessage("Loading results...");
            return of(response);
          }

          return throwError(() => new Error(response.status));
        }),
        take(1),
        switchMap((response) => {
          if (response.result_doc_ids && response.result_doc_ids.length > 0) {
            return this.generalAssetService.getMultipleAssets(
              response.result_doc_ids
            );
          }

          return of([]);
        }),
        finalize(() => {
          this.spinnerService.hide();
        })
      )
      .subscribe({
        next: (assets: any[]) => {
          this.assets = assets;
          this.assetsSize = assets.length;
          this.spinnerService.hide();
        },
        error: (error: any) => {
          this.assets = [];
          this.spinnerService.hide();
          throwError(() => new Error(error));
        },
      });

    this.subscriptions.add(this.enhancedSearchSubscription);
  }

  sanitizeAssetCategory(category: AssetCategory): string {
    this.initSpinner();

    if (category in assetCategoryMapping) {
      return assetCategoryMapping[category];
    }

    this.spinnerService.hide();
    return "";
  }

  protected displayMode(mode: number): void {
    this.displayModeValue = mode;
  }

  ngOnDestroy(): void {
    this.spinnerService.hide();
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }

    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
