import { MediaMatcher } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { environment } from 'src/environments/environment';
import { SpinnerService } from '@app/shared/services/spinner/spinner.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) public sidenav!: MatSidenav;
  protected isMenuCollapsed = true;
  protected isResourcesOpened = true;
  protected isToolsOpened = false;
  protected isCommunityOpened = false;
  protected isMediaOpened = false;

  constructor(
    private _formBuilder: FormBuilder,
    protected authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private sidenavService: SidenavService,
    private appConfigService: AppConfigService,
    public spinnerService: SpinnerService,
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 992px)');
    this._mobileQueryListener = () => {
      this.isMenuCollapsed = this.mobileQuery.matches;
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.options = this._formBuilder.group({
      bottom: 0,
      fixed: false,
      top: 0,
    });
  }

  protected environment = environment;

  options: any;

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

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  login() {
    return;
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  toggleCollapse() {
    this.isMenuCollapsed = !this.isMenuCollapsed;

    this.changeDetectorRef.detectChanges();

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      this.changeDetectorRef.detectChanges();
    }, 50);

    setTimeout(() => {
      this.changeDetectorRef.detectChanges();
    }, 350);
  }

  ngOnInit(): void {
    this.acknowledgments = this.appConfigService.acknowledgments;
    this.projectName = this.appConfigService.projectName;
    this.projectUrl = this.appConfigService.projectUrl;

    // Set initial collapse state based on screen size
    this.isMenuCollapsed = this.mobileQuery.matches;
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
