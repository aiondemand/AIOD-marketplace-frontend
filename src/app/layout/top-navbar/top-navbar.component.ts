import { Component, Renderer2 } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatMenuTrigger, _MatMenuBase } from '@angular/material/menu';
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
    private sidenavService: SidenavService,
    protected appConfigService: AppConfigService,
    private router: Router,
  ) {}
  protected sideBarUser = false;
  protected environment = environment;
  userProfile?: UserProfile;
  isMatMenuOpen = false;
  enteredButton = false;
  cartItems = 0;
  protected mobileOpened = false;
  private widthSmallDevice = 768;

  ngOnInit() {
    if (window.innerWidth >= this.widthSmallDevice) {
      this.mobileOpened = true;
    }
  }

  login() {
    this.authService.login(window.location.pathname);
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  menuenter() {
    this.isMatMenuOpen = true;
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

  buttonEnter(trigger: MatMenuTrigger) {
    setTimeout(() => {
      if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        trigger.openMenu();
        this.ren.removeClass(
          (trigger.menu as _MatMenuBase)._allItems.first['_elementRef']
            .nativeElement,
          'cdk-focused',
        );
        this.ren.removeClass(
          (trigger.menu as _MatMenuBase)._allItems.first['_elementRef']
            .nativeElement,
          'cdk-program-focused',
        );
      } else {
        this.enteredButton = true;
      }
    }, 50);
  }

  buttonLeave(trigger: MatMenuTrigger, button: MatButton) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(
          button['_elementRef'].nativeElement,
          'cdk-focused',
        );
        this.ren.removeClass(
          button['_elementRef'].nativeElement,
          'cdk-program-focused',
        );
      }
      if (!this.isMatMenuOpen) {
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
        this.enteredButton = false;
      }
    }, 100);
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

  openMobileMenu() {
    this.mobileOpened = !this.mobileOpened;
  }
}
