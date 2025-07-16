import { MediaMatcher } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
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
export class SidenavComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: true }) public sidenav!: MatSidenav;
  protected isMenuCollapsed = false;
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

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  login() {
    this.authService.login(window.location.pathname);
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  ngOnInit(): void {
    this.acknowledgments = this.appConfigService.acknowledgments;
    this.projectName = this.appConfigService.projectName;
    this.projectUrl = this.appConfigService.projectUrl;
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
