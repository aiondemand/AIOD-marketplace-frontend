import { Component, OnDestroy, OnInit } from '@angular/core';
import { AssetCategory } from '@app/shared/models/asset-category.model';
import { ParamsReqAsset } from '@app/shared/interfaces/asset-service.interface';
import { AssetModel } from '@app/shared/models/asset.model';
import { Subject, Subscription, combineLatest, debounceTime, filter, finalize, interval, map, of, scan, switchMap, take, takeUntil, takeWhile, throwError } from 'rxjs';
import { FiltersStateService } from '@app/shared/services/sidenav/filters-state.service';
import { PageEvent } from '@angular/material/paginator';
import { ParamsReqSearchAsset } from "@app/shared/interfaces/search-service.interface";
import { GeneralAssetService } from '../../services/assets-services/general-asset.service';
import { ElasticSearchService } from '../../services/elastic-search/elastic-search.service';
import { SearchModel } from '@app/shared/models/search.model';
import { SpinnerService } from '@app/shared/services/spinner/spinner.service';
import { hasQuotes } from '../../utils/common.utils';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PlatformService } from '../../services/common-services/platform.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { MatSidenav } from '@angular/material/sidenav';


const MAX_ATTEMPTS = 15;

const assetCategoryMapping = {
	[AssetCategory.AIModel]: 'ml_models',
	[AssetCategory.Dataset]: 'datasets',
	[AssetCategory.Experiment]: 'experiments',
	[AssetCategory['Educational resource']]: 'educational_resources',
	[AssetCategory['Service']]: 'services',
}

@Component({
	selector: 'app-assets-list',
	templateUrl: './assets-list.component.html',
	styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription = new Subscription();
	private enhancedSearchSubscription?: Subscription;

	public isLoading = false;
	public assets: AssetModel[] | any[]  = [];
	private categorySelected!: AssetCategory;
	private platformSelected!: string;
	public isEnhancedSearch: boolean = false;
	public searchQueryValue: string = '';

	public assetsSize = 0; /* number of assets found */
	public pageSize = 15; /* assets per page */
	public offset = 0;
	public pageSizeOptions = [15, 20, 50, 100];
	public currentPage = 1;

	destroy$ = new Subject<any>();
  




	assetCategories !: any;
    selectedCategory: AssetCategory = AssetCategory.Dataset;
    selectedPlatform!: string;
    searchFormGroup!: FormGroup;

    isFiltersVisible = false;
    isFilterLibraryVisible = false;

    private subscription: Subscription | undefined;

	platforms: any = [];















	constructor(
		private fb: FormBuilder,
        private router: Router,
        private filtersService: FiltersStateService,
        private platformService: PlatformService,
		protected authService: AuthService,

		private generalAssetService: GeneralAssetService,
		private filtersStateService: FiltersStateService,
		private searchService: ElasticSearchService,
		private spinnerService: SpinnerService,
	) { }

	ngOnInit(): void {
		this.initializeForm();
		this.assetCategories = Object.values(AssetCategory);
        this.getPlatforms();
        this.toggleFilterPanel();
        this.subscription?.add(this.subscriptionAssetCategory());



		this.getFilters();
		this.filtersStateService.isEnhancedSerach$.pipe(takeUntil(this.destroy$)).subscribe({ next: (value) => {
			this.isEnhancedSearch = value;
		}})

		this.filtersStateService.searchQuery$.pipe(takeUntil(this.destroy$)).subscribe({ next: (value) => {
			this.searchQueryValue = value;
		}})


	}


	initializeForm() {
        this.searchFormGroup = this.fb.group({
            search: '',
            enhancedSearch: [false]
        });
    }
   



    searchAssets() {
        const isEnhancedSearch2 = this.searchFormGroup.get('enhancedSearch')?.value;
        this.filtersService.setEnhancedSearch(isEnhancedSearch2);

        var query = this.searchFormGroup.get('search')?.value;
        this.filtersService.setSearchQuery(query);
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

    isEnhancedSearchF() {
        return !this.searchFormGroup.get('search')?.value && this.filtersService.isEnhancedSerach;
    }
   

    onRadioTypeChange() {
        this.filtersService.setAssetCategorySelected(this.selectedCategory);
    }

    onSelectPlatformChange() {
        this.filtersService.setPlatformSelected(this.selectedPlatform);
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


	private basicSearch(): void {
		this.isLoading = true;

		var query = this.filtersStateService.searchQuery;
		var platformsSelected = [];


		if(!!this.filtersStateService.platformSelected) {
			platformsSelected.push(this.filtersStateService.platformSelected);
		}

		const params: ParamsReqSearchAsset = {
			searchQuery: query,
			limit: this.pageSize,
			page: this.currentPage,
			platforms: platformsSelected
		}
  
		if (hasQuotes(query)) {
			params.exact_match = true
		}

		const subscribe = this.searchService.getAssetBySearch(params, this.categorySelected).subscribe({

			next: (resp: SearchModel) => {
				this.isLoading = false;
				this.assets = resp.resources;
				this.assetsSize = resp.totalHits;
			},
			error: (error: any) => {
				setTimeout(() => (this.isLoading = false), 5000);
				console.error('Error get assets', error)
			}
		})
		this.subscriptions.add(subscribe);
	}

	private isValidAssetCategory(category: any): boolean {
		return Object.values(AssetCategory).includes(category);
	}


	private getAssets(): void {
		this.isLoading = true;
		const parms: ParamsReqAsset = { offset: this.offset, limit: this.pageSize }
		this.generalAssetService.setAssetCategory(this.categorySelected);

		const serviceObs = !!this.platformSelected ?
			this.generalAssetService.getAssetsByPlatform(this.platformSelected, parms) :
			this.generalAssetService.getAssets(parms);

		const subscribe = serviceObs.subscribe({
			next: (assets: AssetModel[]) => {
				this.isLoading = false;
				this.assets = assets;
				console.log(this.assets)
			},
			error: (error: any) => {
				this.assets = [
					{
						"identifier": 24,
						"category": "Dataset",
						"name": "bigIR/ar_cov19",
						"description": "ArCOV-19 is an Arabic COVID-19 Twitter dataset that covers the period from 27th of January till 30th of April 2020. ArCOV-19 is designed to enable research under several domains including natural language processing, information retrieval, and social computing, among others",
						"platform": "huggingface",
						"platform_resource_identifier": "621ffdd236468d709f181d6f",
						"keywords": [
							"source_datasets:original",
							"region:us",
							"language_creators:found",
							"multilinguality:monolingual",
							"language:ar",
							"annotations_creators:no-annotation",
							"size_categories:1m<n<10m",
							"task_categories:other",
							"arxiv:2004.05861",
							"data-mining"
						],
						"sameAs": "https://huggingface.co/datasets/bigIR/ar_cov19",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2022-03-02T23:29:22",
						"media": [],
						"citation": [
							23
						],
						"dateCreated": "2023-11-29T14:23:59.000Z"
					},
					{
						"identifier": 42,
						"category": "Dataset",
						"name": "facebook/babi_qa",
						"description": "The (20) QA bAbI tasks are a set of proxy tasks that evaluate reading\ncomprehension via question answering. Our tasks measure understanding\nin several ways: whether a system is able to answer questions via chaining facts,\nsimple induction, deduction and many more. The tasks are designed to be prerequisites\nfor any system that aims to be capable of conversing with a human.\nThe aim is to classify these tasks into skill sets,so that researchers\ncan identify (and then rectify)the failings of their systems.",
						"platform": "huggingface",
						"platform_resource_identifier": "621ffdd236468d709f181d81",
						"keywords": [
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
							"license:cc-by-3.0"
						],
						"sameAs": "https://huggingface.co/datasets/facebook/babi_qa",
						"license": "cc-by-3.0",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2022-03-02T23:29:22",
						"media": [],
						"citation": [
							41
						],
						"dateCreated": "2023-11-29T14:24:10.000Z"
					},
					{
						"identifier": 56,
						"category": "Dataset",
						"name": "TheBritishLibrary/blbooks",
						"description": "A dataset comprising of text created by OCR from the 49,455 digitised books, equating to 65,227 volumes (25+ million pages), published between c. 1510 - c. 1900.\nThe books cover a wide range of subject areas including philosophy, history, poetry and literature.",
						"platform": "huggingface",
						"platform_resource_identifier": "621ffdd236468d709f181d8f",
						"keywords": [
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
							"digital-humanities-research"
						],
						"sameAs": "https://huggingface.co/datasets/TheBritishLibrary/blbooks",
						"license": "cc0-1.0",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2022-03-02T23:29:22",
						"media": [],
						"citation": [
							52
						],
						"dateCreated": "2023-11-29T14:24:19.000Z"
					},
					{
						"identifier": 57,
						"category": "Dataset",
						"name": "TheBritishLibrary/blbooksgenre",
						"description": "This dataset contains metadata for resources belonging to the British Library’s digitised printed books (18th-19th century) collection (bl.uk/collection-guides/digitised-printed-books).\nThis metadata has been extracted from British Library catalogue records.\nThe metadata held within our main catalogue is updated regularly.\nThis metadata dataset should be considered a snapshot of this metadata.",
						"platform": "huggingface",
						"platform_resource_identifier": "621ffdd236468d709f181d90",
						"keywords": [
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
							"task_ids:multi-label-classification"
						],
						"sameAs": "https://huggingface.co/datasets/TheBritishLibrary/blbooksgenre",
						"license": "cc0-1.0",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2022-03-02T23:29:22",
						"media": [],
						"citation": [],
						"dateCreated": "2023-11-29T14:24:19.000Z"
					},
					{
						"identifier": 115,
						"category": "Dataset",
						"name": "anneal",
						"description": "**Author**: Unknown. Donated by David Sterling and Wray Buntine  \n\n**Source**: [UCI](https://archive.ics.uci.edu/ml/datasets/Annealing) - 1990  \n\n**Please cite**: [UCI](https://archive.ics.uci.edu/ml/citation_policy.html)  \n\n\n\nThe original Annealing dataset from UCI. The exact meaning of the features and classes is largely unknown. Annealing, in metallurgy and materials science, is a heat treatment that alters the physical and sometimes chemical properties of a material to increase its ductility and reduce its hardness, making it more workable. It involves heating a material to above its recrystallization temperature, maintaining a suitable temperature, and then cooling. (Wikipedia)\n\n\n\n### Attribute Information:\n\n     1. family:          --,GB,GK,GS,TN,ZA,ZF,ZH,ZM,ZS\n\n     2. product-type:    C, H, G\n\n     3. steel:           -,R,A,U,K,M,S,W,V\n\n     4. carbon:          continuous\n\n     5. hardness:        continuous\n\n     6. temper_rolling:  -,T\n\n     7. condition:       -,S,A,X\n\n     8. formability:     -,1,2,3,4,5\n\n     9. strength:        continuous\n\n    10. non-ageing:      -,N\n\n    11. surface-finish:  P,M,-\n\n    12. surface-quality: -,D,E,F,G\n\n    13. enamelability:   -,1,2,3,4,5\n\n    14. bc:              Y,-\n\n    15. bf:              Y,-\n\n    16. bt:              Y,-\n\n    17. bw/me:           B,M,-\n\n    18. bl:              Y,-\n\n    19. m:               Y,-\n\n    20. chrom:           C,-\n\n    21. phos:            P,-\n\n    22. cbond:           Y,-\n\n    23. marvi:           Y,-\n\n    24. exptl:           Y,-\n\n    25. ferro:           Y,-\n\n    26. corr:            Y,-\n\n    27. blue/bright/varn/clean:          B,R,V,C,-\n\n    28. lustre:          Y,-\n\n    29. jurofm:          Y,-\n\n    30. s:               Y,-\n\n    31. p:               Y,-\n\n    32. shape:           [...]",
						"platform": "openml",
						"platform_resource_identifier": "2",
						"keywords": [
							"study_14",
							"study_37",
							"test",
							"study_1",
							"study_34",
							"study_41",
							"study_76",
							"study_70",
							"uci",
							"manufacturing"
						],
						"sameAs": "https://www.openml.org/api/v1/json/data/2",
						"license": "public",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2014-04-06T23:19:24",
						"media": [],
						"version": "1",
						"citation": [],
						"dateCreated": "2023-11-29T14:25:05.000Z"
					},
					{
						"identifier": 117,
						"category": "Dataset",
						"name": "kr-vs-kp",
						"description": "Author: Alen Shapiro\nSource: [UCI](https://archive.ics.uci.edu/ml/datasets/Chess+(King-Rook+vs.+King-Pawn))\nPlease cite: [UCI citation policy](https://archive.ics.uci.edu/ml/citation_policy.html)\n\n1. Title: Chess End-Game -- King+Rook versus King+Pawn on a7\n(usually abbreviated KRKPA7). The pawn on a7 means it is one square\naway from queening. It is the King+Rook's side (white) to move.\n\n2. Sources:\n(a) Database originally generated and described by Alen Shapiro.\n(b) Donor/Coder: Rob Holte (holte@uottawa.bitnet). The database\nwas supplied to Holte by Peter Clark of the Turing Institute\nin Glasgow (pete@turing.ac.uk).\n(c) Date: 1 August 1989\n\n3. Past Usage:\n- Alen D. Shapiro (1983,1987), \"Structured Induction in Expert Systems\",\nAddison-Wesley. This book is based on Shapiro's Ph.D. thesis (1983)\nat the University of Edinburgh entitled \"The Role of Structured\nInduction in Expert Systems\".\n- Stephen Muggleton (1987), \"Structuring Knowledge by Asking Questions\",\npp.218-229 in \"Progress in Machine Learning\", edited by I. Bratko\nand Nada Lavrac, Sigma Press, Wilmslow, England SK9 5BB.\n- Robert C. Holte, Liane Acker, and Bruce W. Porter (1989),\n\"Concept Learning and the Problem of Small Disjuncts\",\nProceedings of IJCAI. Also available as technical report AI89-106,\nComputer Sciences Department, University of Texas at Austin,\nAustin, Texas 78712.\n\n4. Relevant Information:\nThe dataset format is described below. Note: the format of this\ndatabase was modified on 2/26/90 to conform with the format of all\nthe other databases in the UCI repository of machine learning databases.\n\n5. Number of Instances: 3196 total\n\n6. Number of Attributes: 36\n\n7. Attribute Summaries:\nClasses (2): -- White-can-win (\"won\") and White-cannot-win (\"nowin\").\nI believe that White is deemed to be unable  [...]",
						"platform": "openml",
						"platform_resource_identifier": "3",
						"keywords": [
							"study_14",
							"study_37",
							"study_1",
							"study_34",
							"study_41",
							"study_70",
							"uci",
							"mythbusting_1",
							"openml100",
							"study_218",
							"study_20",
							"openml-cc18",
							"study_52",
							"study_99",
							"study_144",
							"study_50",
							"study_15",
							"machine learning",
							"study_123",
							"mathematics",
							"study_7",
							"study_98"
						],
						"sameAs": "https://www.openml.org/api/v1/json/data/3",
						"license": "public",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2014-04-06T23:19:28",
						"media": [],
						"version": "1",
						"citation": [],
						"dateCreated": "2023-11-29T14:25:05.000Z"
					},
					{
						"identifier": 119,
						"category": "Dataset",
						"name": "labor",
						"description": "**Author**: Unknown\n**Source**: Collective Barganing Review, Labour Canada\n**Please cite**: https://archive.ics.uci.edu/ml/citation_policy.html\n\nDate: Tue, 15 Nov 88 15:44:08 EST\n From: stan <stan@csi2.UofO.EDU>\n To: aha@ICS.UCI.EDU\n \n 1. Title: Final settlements in labor negotitions in Canadian industry\n \n 2. Source Information\n    -- Creators: Collective Barganing Review, montly publication,\n       Labour Canada, Industrial Relations Information Service,\n         Ottawa, Ontario, K1A 0J2, Canada, (819) 997-3117\n         The data includes all collective agreements reached\n         in the business and personal services sector for locals\n         with at least 500 members (teachers, nurses, university\n         staff, police, etc) in Canada in 87 and first quarter of 88.   \n    -- Donor: Stan Matwin, Computer Science Dept, University of Ottawa,\n                 34 Somerset East, K1N 9B4, (stan@uotcsi2.bitnet)\n    -- Date: November 1988\n  \n 3. Past Usage:\n    -- testing concept learning software, in particular\n       an experimental method to learn two-tiered concept descriptions.\n       The data was used to learn the description of an acceptable\n       and unacceptable contract.\n       The unacceptable contracts were either obtained by interviewing\n       experts, or by inventing near misses.\n       Examples of use are described in:\n         Bergadano, F., Matwin, S., Michalski, R.,\n         Zhang, J., Measuring Quality of Concept Descriptions, \n         Procs. of the 3rd European Working Sessions on Learning,\n         Glasgow, October 1988.\n         Bergadano, F., Matwin, S., Michalski, R., Zhang, J.,\n         Representing and Acquiring Imprecise and Context-dependent\n         Concepts in Knowledge-based Systems, Procs. of ISMIS'88,\n         North Holland, 1988.\n 4 [...]",
						"platform": "openml",
						"platform_resource_identifier": "4",
						"keywords": [
							"test",
							"study_1",
							"study_41",
							"uci",
							"mythbusting_1",
							"study_20",
							"study_15",
							"education",
							"economics"
						],
						"sameAs": "https://www.openml.org/api/v1/json/data/4",
						"license": "public",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2014-04-06T23:19:30",
						"media": [],
						"version": "1",
						"citation": [],
						"dateCreated": "2023-11-29T14:25:06.000Z"
					},
					{
						"identifier": 121,
						"category": "Dataset",
						"name": "arrhythmia",
						"description": "**Author**: H. Altay Guvenir, Burak Acar, Haldun Muderrisoglu  \n**Source**: [UCI](https://archive.ics.uci.edu/ml/datasets/arrhythmia)   \n**Please cite**: [UCI](https://archive.ics.uci.edu/ml/citation_policy.html)\n\n**Cardiac Arrhythmia Database**  \nThe aim is to determine the type of arrhythmia from the ECG recordings. This database contains 279 attributes, 206 of which are linear valued and the rest are nominal. \n\nConcerning the study of H. Altay Guvenir: \"The aim is to distinguish between the presence and absence of cardiac arrhythmia and to classify it in one of the 16 groups. Class 01 refers to 'normal' ECG classes, 02 to 15 refers to different classes of arrhythmia and class 16 refers to the rest of unclassified ones. For the time being, there exists a computer program that makes such a classification. However, there are differences between the cardiologist's and the program's classification. Taking the cardiologist's as a gold standard we aim to minimize this difference by means of machine learning tools.\n \nThe names and id numbers of the patients were recently removed from the database.\n \n### Attribute Information  \n \n       1 Age: Age in years , linear\n       2 Sex: Sex (0 = male; 1 = female) , nominal\n       3 Height: Height in centimeters , linear\n       4 Weight: Weight in kilograms , linear\n       5 QRS duration: Average of QRS duration in msec., linear\n       6 P-R interval: Average duration between onset of P and Q waves\n         in msec., linear\n       7 Q-T interval: Average duration between onset of Q and offset\n         of T waves in msec., linear\n       8 T interval: Average duration of T wave in msec., linear\n       9 P interval: Average duration of P wave in msec., linear\n      Vector angles in degrees on front plane of:, linear\n      10 QRS\n   [...]",
						"platform": "openml",
						"platform_resource_identifier": "5",
						"keywords": [
							"study_1",
							"study_41",
							"study_76",
							"uci",
							"machine learning",
							"study_93",
							"medicine",
							"sport"
						],
						"sameAs": "https://www.openml.org/api/v1/json/data/5",
						"license": "public",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2014-04-06T23:19:36",
						"media": [],
						"version": "1",
						"citation": [],
						"dateCreated": "2023-11-29T14:25:07.000Z"
					},
					{
						"identifier": 124,
						"category": "Dataset",
						"name": "letter",
						"description": "**Author**: David J. Slate  \n**Source**: [UCI](https://archive.ics.uci.edu/ml/datasets/Letter+Recognition) - 01-01-1991  \n**Please cite**: P. W. Frey and D. J. Slate. \"Letter Recognition Using Holland-style Adaptive Classifiers\". Machine Learning 6(2), 1991  \n\n1. TITLE: \n  Letter Image Recognition Data \n \n    The objective is to identify each of a large number of black-and-white\n    rectangular pixel displays as one of the 26 capital letters in the English\n    alphabet.  The character images were based on 20 different fonts and each\n    letter within these 20 fonts was randomly distorted to produce a file of\n    20,000 unique stimuli.  Each stimulus was converted into 16 primitive\n    numerical attributes (statistical moments and edge counts) which were then\n    scaled to fit into a range of integer values from 0 through 15.  We\n    typically train on the first 16000 items and then use the resulting model\n    to predict the letter category for the remaining 4000.  See the article\n    cited above for more details.",
						"platform": "openml",
						"platform_resource_identifier": "6",
						"keywords": [
							"study_14",
							"study_37",
							"study_1",
							"study_34",
							"study_41",
							"study_76",
							"study_70",
							"uci",
							"openml100",
							"openml-cc18",
							"study_99",
							"machine learning",
							"study_123",
							"study_7",
							"study_98",
							"images",
							"azurepilot1",
							"azurepilot"
						],
						"sameAs": "https://www.openml.org/api/v1/json/data/6",
						"license": "public",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2014-04-06T23:19:41",
						"media": [],
						"version": "1",
						"citation": [],
						"dateCreated": "2023-11-29T14:25:08.000Z"
					},
					{
						"identifier": 125,
						"category": "Dataset",
						"name": "audiology",
						"description": "**Author**: Professor Jergen at Baylor College of Medicine\n**Source**: [UCI](https://archive.ics.uci.edu/ml/datasets/Audiology+(Standardized))\n**Please cite**: Bareiss, E. Ray, & Porter, Bruce (1987). Protos: An Exemplar-Based Learning Apprentice. In the Proceedings of the 4th International Workshop on Machine Learning, 12-23, Irvine, CA: Morgan Kaufmann\n\n**Audiology Database**\nThis database is a standardized version of the original audiology database (see audiology.* in this directory). The non-standard set of attributes have been converted to a standard set of attributes according to the rules that follow.\n\n* Each property that appears anywhere in the original .data or .test file has been represented as a separate attribute in this file.\n\n* A property such as age_gt_60 is represented as a boolean attribute with values f and t.\n\n* In most cases, a property of the form x(y) is represented as a discrete attribute x() whose possible values are the various y's; air() is an example. There are two exceptions:\n** when only one value of y appears anywhere, e.g. static(normal). In this case, x_y appears as a boolean attribute.\n** when one case can have two or more values of x, e.g. history(..). All possible values of history are treated as separate boolean attributes.\n\n* Since boolean attributes only appear as positive conditions, each boolean attribute is assumed to be false unless noted as true. The value of multi-value discrete attributes taken as unknown (\"?\") unless a value is specified.\n\n* The original case identifications, p1 to p200 in the .data file and t1 to t26 in the .test file, have been added as a unique identifier attribute.\n\n[Note: in the original .data file, p165 has a repeated specification of o_ar_c(normal); p166 has repeated specification of speech(nor [...]",
						"platform": "openml",
						"platform_resource_identifier": "7",
						"keywords": [
							"study_1",
							"study_41",
							"study_76",
							"uci",
							"machine learning",
							"medicine"
						],
						"sameAs": "https://www.openml.org/api/v1/json/data/7",
						"license": "public",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2014-04-06T23:19:44",
						"media": [],
						"version": "1",
						"citation": [],
						"dateCreated": "2023-11-29T14:25:08.000Z"
					},
					{
						"identifier": 126,
						"category": "Dataset",
						"name": "liver-disorders",
						"description": "**Author**: BUPA Medical Research Ltd. Donor: Richard S. Forsyth   \n**Source**: [UCI](https://archive.ics.uci.edu/ml/datasets/Liver+Disorders) - 5/15/1990  \n**Please cite**: \n\n**BUPA liver disorders**\n \nThe first 5 variables are all blood tests which are thought to be sensitive to liver disorders that might arise from excessive alcohol consumption.  Each line in the dataset constitutes the record of a single male individual. \n\n**Important note:** The 7th field (selector) has been widely misinterpreted in the past as a dependent variable representing presence or absence of a liver disorder. This is incorrect [1]. The 7th field was created by BUPA researchers as a train/test selector. It is not suitable as a dependent variable for classification. The dataset does not contain any variable representing presence or absence of a liver disorder. Researchers who wish to use this dataset as a classification benchmark should follow the method used in experiments by the donor (Forsyth & Rada, 1986, Machine learning: applications in expert systems and information retrieval) and others (e.g. Turney, 1995, Cost-sensitive classification: Empirical evaluation of a hybrid genetic decision tree induction algorithm), who used the 6th field (drinks), after dichotomising, as a dependent variable for classification. Because of widespread misinterpretation in the past, researchers should take care to state their method clearly.\n \n**Attribute information**  \n    1. mcv mean corpuscular volume  \n    2. alkphos alkaline phosphotase  \n    3. sgpt alanine aminotransferase  \n    4. sgot  aspartate aminotransferase  \n    5. gammagt gamma-glutamyl transpeptidase  \n    6. drinks number of half-pint equivalents of alcoholic beverages drunk per day  \n    7. selector field created by the BUPA resea [...]",
						"platform": "openml",
						"platform_resource_identifier": "8",
						"keywords": [
							"uci",
							"study_50",
							"medicine",
							"health",
							"study_88",
							"study_127"
						],
						"sameAs": "https://www.openml.org/api/v1/json/data/8",
						"license": "public",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2014-04-06T23:19:46",
						"media": [],
						"version": "1",
						"citation": [],
						"dateCreated": "2023-11-29T14:25:09.000Z"
					},
					{
						"identifier": 128,
						"category": "Dataset",
						"name": "autos",
						"description": "**Author**: Jeffrey C. Schlimmer (Jeffrey.Schlimmer@a.gp.cs.cmu.edu)   \n**Source**: [UCI](https://archive.ics.uci.edu/ml/datasets/Automobile) - 1987  \n**Please cite**:   \n\n**1985 Auto Imports Database**  \nThis data set consists of three types of entities: (a) the specification of an auto in terms of various characteristics, (b) its assigned insurance risk rating, (c) its normalized losses in use as compared to other cars.  The second rating corresponds to the degree to which the auto is more risky than its price indicates. Cars are initially assigned a risk factor symbol associated with its price.   Then, if it is more risky (or less), this symbol is adjusted by moving it up (or down) the scale.  Actuarians call this process \"symboling\".  A value of +3 indicates that the auto is risky, -3 that it is probably pretty safe.\n \nThe third factor is the relative average loss payment per insured vehicle year.  This value is normalized for all autos within a particular size classification (two-door small, station wagons, sports/speciality, etc...), and represents the average loss per car per year.\n \nSeveral of the attributes in the database could be used as a \"class\" attribute.\n\nSources:  \n1) 1985 Model Import Car and Truck Specifications, 1985 Ward's Automotive Yearbook.\n2) Personal Auto Manuals, Insurance Services Office, 160 Water Street, New York, NY 10038 \n3) Insurance Collision Report, Insurance Institute for Highway Safety, Watergate 600, Washington, DC 20037\n \nPast Usage:  \nKibler,~D., Aha,~D.~W., & Albert,~M. (1989).  Instance-based prediction of real-valued attributes.  {it Computational Intelligence}, {it 5}, 51--57.\n\n \nAttribute Information:\n>\n   1. symboling:                -3, -2, -1, 0, 1, 2, 3.\n   2. normalized-losses:        continuous from 65 to 256.\n   3 [...]",
						"platform": "openml",
						"platform_resource_identifier": "9",
						"keywords": [
							"study_1",
							"study_41",
							"study_76",
							"uci",
							"manufacturing",
							"machine learning"
						],
						"sameAs": "https://www.openml.org/api/v1/json/data/9",
						"license": "public",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2014-04-06T23:19:49",
						"media": [],
						"version": "1",
						"citation": [],
						"dateCreated": "2023-11-29T14:25:09.000Z"
					},
					{
						"identifier": 129,
						"category": "Dataset",
						"name": "lymph",
						"description": "**Author**:   \n**Source**: Unknown -   \n**Please cite**:   \n\nCitation Request:\n    This lymphography domain was obtained from the University Medical Centre,\n    Institute of Oncology, Ljubljana, Yugoslavia.  Thanks go to M. Zwitter and \n    M. Soklic for providing the data.  Please include this citation if you plan\n    to use this database.\n \n 1. Title: Lymphography Domain\n \n 2. Sources: \n     (a) See Above.\n     (b) Donors: Igor Kononenko, \n                 University E.Kardelj\n                 Faculty for electrical engineering\n                 Trzaska 25\n                 61000 Ljubljana (tel.: (38)(+61) 265-161\n \n                 Bojan Cestnik\n                 Jozef Stefan Institute\n                 Jamova 39\n                 61000 Ljubljana\n                 Yugoslavia (tel.: (38)(+61) 214-399 ext.287) \n    (c) Date: November 1988\n \n 3. Past Usage: (sveral)\n     1. Cestnik,G., Konenenko,I, & Bratko,I. (1987). Assistant-86: A\n        Knowledge-Elicitation Tool for Sophisticated Users.  In I.Bratko\n        & N.Lavrac (Eds.) Progress in Machine Learning, 31-45, Sigma Press.\n        -- Assistant-86: 76% accuracy\n     2. Clark,P. & Niblett,T. (1987). Induction in Noisy Domains.  In\n        I.Bratko & N.Lavrac (Eds.) Progress in Machine Learning, 11-30,\n        Sigma Press.\n        -- Simple Bayes: 83% accuracy\n        -- CN2 (99% threshold): 82%\n     3. Michalski,R., Mozetic,I. Hong,J., & Lavrac,N. (1986).  The Multi-Purpose\n        Incremental Learning System AQ15 and its Testing Applications to Three\n        Medical Domains.  In Proceedings of the Fifth National Conference on\n        Artificial Intelligence, 1041-1045. Philadelphia, PA: Morgan Kaufmann.\n        -- Experts: 85% accuracy (estimate)\n        -- AQ15: 80-82%\n \n 4. Relevant Information:\n      This is on [...]",
						"platform": "openml",
						"platform_resource_identifier": "10",
						"keywords": [
							"study_1",
							"study_41",
							"uci",
							"machine learning",
							"study_7",
							"medicine",
							"study_88"
						],
						"sameAs": "https://www.openml.org/api/v1/json/data/10",
						"license": "public",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2014-04-06T23:19:52",
						"media": [],
						"version": "1",
						"citation": [],
						"dateCreated": "2023-11-29T14:25:10.000Z"
					},
					{
						"identifier": 130,
						"category": "Dataset",
						"name": "balance-scale",
						"description": "**Author**: Siegler, R. S. (donated by Tim Hume)  \n**Source**: [UCI](http://archive.ics.uci.edu/ml/datasets/balance+scale) - 1994  \n**Please cite**: [UCI](https://archive.ics.uci.edu/ml/citation_policy.html)   \n\n**Balance Scale Weight & Distance Database**  \nThis data set was generated to model psychological experimental results.  Each example is classified as having the balance scale tip to the right, tip to the left, or be balanced. The attributes are the left weight, the left distance, the right weight, and the right distance. The correct way to find the class is the greater of (left-distance * left-weight) and (right-distance * right-weight). If they are equal, it is balanced.\n\n### Attribute description  \nThe attributes are the left weight, the left distance, the right weight, and the right distance.\n\n### Relevant papers  \nShultz, T., Mareschal, D., & Schmidt, W. (1994). Modeling Cognitive Development on Balance Scale Phenomena. Machine Learning, Vol. 16, pp. 59-88.",
						"platform": "openml",
						"platform_resource_identifier": "11",
						"keywords": [
							"study_14",
							"study_37",
							"study_1",
							"study_34",
							"study_41",
							"study_70",
							"uci",
							"openml100",
							"openml-cc18",
							"study_52",
							"study_99",
							"study_50",
							"machine learning",
							"study_123",
							"study_7",
							"study_98",
							"study_135",
							"artificial",
							"shark-tutorial-demo-tag"
						],
						"sameAs": "https://www.openml.org/api/v1/json/data/11",
						"license": "public",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2014-04-06T23:19:55",
						"media": [],
						"version": "1",
						"citation": [],
						"dateCreated": "2023-11-29T14:25:10.000Z"
					},
					{
						"identifier": 132,
						"category": "Dataset",
						"name": "mfeat-factors",
						"description": "**Author**: Robert P.W. Duin, Department of Applied Physics, Delft University of Technology  \n**Source**: [UCI](https://archive.ics.uci.edu/ml/datasets/Multiple+Features) - 1998  \n**Please cite**: [UCI](https://archive.ics.uci.edu/ml/citation_policy.html)   \n\n**Multiple Features Dataset: Factors**  \nOne of a set of 6 datasets describing features of handwritten numerals (0 - 9) extracted from a collection of Dutch utility maps. Corresponding patterns in different datasets correspond to the same original character. 200 instances per class (for a total of 2,000 instances) have been digitized in binary images. \n\n### Attribute Information  \nThe attributes represent 216 profile correlations. No more information is known.\n\n### Relevant Papers  \nA slightly different version of the database is used in  \nM. van Breukelen, R.P.W. Duin, D.M.J. Tax, and J.E. den Hartog, Handwritten digit recognition by combined classifiers, Kybernetika, vol. 34, no. 4, 1998, 381-386.\n \nThe database as is is used in:  \nA.K. Jain, R.P.W. Duin, J. Mao, Statistical Pattern Recognition: A Review, IEEE Transactions on Pattern Analysis and Machine Intelligence archive, Volume 22 Issue 1, January 2000",
						"platform": "openml",
						"platform_resource_identifier": "12",
						"keywords": [
							"study_14",
							"study_37",
							"study_1",
							"study_34",
							"study_41",
							"study_76",
							"study_70",
							"uci",
							"openml100",
							"study_218",
							"openml-cc18",
							"study_99",
							"study_50",
							"machine learning",
							"study_123",
							"study_7",
							"study_98",
							"images"
						],
						"sameAs": "https://www.openml.org/api/v1/json/data/12",
						"license": "public",
						"scientific_domain": [],
						"research_area": [],
						"date_published": "2014-04-06T23:20:04",
						"media": [],
						"version": "1",
						"citation": [],
						"dateCreated": "2023-11-29T14:25:12.000Z"
					}
				
				],
					
			
				setTimeout(() => (this.isLoading = false), 3000);
				console.error('Error get assets', error)
			}
		});
		this.subscriptions.add(subscribe);

	}

	private getAssetsSize(category: AssetCategory): void {
		this.generalAssetService.setAssetCategory(category);
		const subscribe = this.generalAssetService.countAssets().subscribe({
			next: (size: number) => this.assetsSize = size,
			error: (error: any) => {
				this.assetsSize = 0;
				console.error('Error get assets size', error)
			}
		})
		this.subscriptions.add(subscribe);
	}

	private getFilters(): void {
		const subscribe = this.filtersStateService.assetCategorySelected$.pipe(
			switchMap((category: AssetCategory) => {
				if (!this.isValidAssetCategory(this.categorySelected)) {
					this.categorySelected = AssetCategory.Dataset
					this.filtersStateService.setAssetCategorySelected(AssetCategory.Dataset)
				} else {
					this.categorySelected = category;
				}
				return this.filtersStateService.platformSelected$;
			}),
			switchMap((platform: string) => {
				this.platformSelected = platform;
				return combineLatest([
					this.filtersStateService.searchQuery$,
					this.filtersStateService.isEnhancedSerach$
				]);
			}),
			debounceTime(300),
			switchMap(([searchQuery, isEnhanced]) => {
				if (searchQuery !== '') {
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
		).subscribe(() => { });
		this.subscriptions.add(subscribe);
	}

	public handlePageEvent(e: PageEvent) {
		this.offset = e.pageIndex * e.pageSize;
		this.pageSize = e.pageSize;
		this.currentPage = e.pageIndex;
		if (!this.isEnhancedSearch) {
			this.getAssets();
		} else if (this.searchQueryValue){
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
		this.spinnerService.show('Initializing enhanced search...');
	}

	private enhancedSearch(query: string): void {
		const categorySelected = this.sanitizeAssetCategory(this.categorySelected);
		
		if (this.enhancedSearchSubscription) {
			this.enhancedSearchSubscription.unsubscribe();
		}

		this.generalAssetService.setAssetCategory(this.categorySelected);
		this.enhancedSearchSubscription = this.generalAssetService.getAssetsByEnhancedSearch(query, categorySelected, this.pageSize)
			.pipe(
				switchMap(locationHeader => {
					return interval(2000).pipe(
						switchMap(() => this.generalAssetService.checkEnhancedSearchStatus(locationHeader)),
						scan((attempts: any, response: any) => {
							this.spinnerService.updateMessage(`Search in progress...`);

							return {
								attempts: attempts.attempts + 1,
								response: response
							};
						}, { attempts: 0, response: null }),
						map((data: any) => ({
							...data.response,
							_attemptNumber: data.attempts
						})),
						takeWhile(response => response.status === 'In_progress' && response._attemptNumber < MAX_ATTEMPTS, true)
					);
				}),
				filter(response => response.status === 'Completed' && !!response.result_doc_ids),
				switchMap(response => {
					if (response.status === 'In_progress' && response._attemptNumber >= MAX_ATTEMPTS) {
						this.spinnerService.updateMessage('Search is taking longer than expected...');

						return throwError(() => new Error(`Attemps limit exceded (${MAX_ATTEMPTS * 2} seconds)`));
					}
					
					if (response.status === 'Completed' && !response.result_doc_ids) {
						this.spinnerService.updateMessage('No results found.');
						return of({ result_doc_ids: [] });
					}
					
					if (response.status === 'Completed' && response.result_doc_ids) {
						this.spinnerService.updateMessage('Loading results...');
						return of(response);
					}
					
					return throwError(() => new Error(response.status));
				}),
				take(1),
				switchMap(response => {
					if (response.result_doc_ids && response.result_doc_ids.length > 0) {
						return this.generalAssetService.getMultipleAssets(response.result_doc_ids);
					}

					return of([]);
				}),
				finalize(() => {
					this.spinnerService.hide();
				})
			).subscribe({
				next: (assets: any[]) => {
					this.assets = assets;
					this.assetsSize = assets.length;
					this.spinnerService.hide();
				},
				error: (error: any) => {
					this.assets = [];
					this.spinnerService.hide();
					throwError(() => new Error(error));
				}
			});

		this.subscriptions.add(this.enhancedSearchSubscription);
	}

	sanitizeAssetCategory(category: AssetCategory): string {
		this.initSpinner();

		if (category in assetCategoryMapping) {
			return assetCategoryMapping[category];
		}

		this.spinnerService.hide();
		return '';
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
