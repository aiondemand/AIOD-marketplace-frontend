import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatMenuTrigger } from '@angular/material/menu';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss'],
})
export class TopNavbarComponent {
  constructor(
    private readonly authService: AuthService,
    private ren: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private sidenavService: SidenavService,
    protected appConfigService: AppConfigService,
    private router: Router,
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 1366px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    authService.userProfileSubject.subscribe((profile) => {
      this.userProfile = profile;
    });
  }
  protected sideBarUser = false;
  private _mobileQueryListener: () => void;
  protected environment = environment;
  mobileQuery: MediaQueryList;
  userProfile?: UserProfile;
  isMatMenuOpen = false;
  enteredButton = false;
  cartItems = 0;

  login() {
    this.authService.login(window.location.pathname);
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  menuLeave(trigger: MatMenuTrigger, button: MatButton) {
    setTimeout(() => {
      if (!this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        this.ren.removeClass(
          button['_elementRef'].nativeElement,
          'cdk-focused',
        );
        this.ren.removeClass(
          button['_elementRef'].nativeElement,
          'cdk-program-focused',
        );
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80);
  }

  isAuthorized() {
    return this.userProfile?.isAuthorized;
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }
}
