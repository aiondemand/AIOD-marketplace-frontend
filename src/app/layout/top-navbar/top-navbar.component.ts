import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatMenuTrigger, _MatMenuBase } from '@angular/material/menu';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { NavigationService } from '@app/core/services/navigation/navigation.service';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss'],
})
export class TopNavbarComponent implements OnInit, OnDestroy {
  constructor(
    private readonly authService: AuthService,
    private ren: Renderer2,
    private sidenavService: SidenavService,
    protected appConfigService: AppConfigService,
    private router: Router,
    private navigationService: NavigationService,
  ) {}
  protected sideBarUser = false;
  protected environment = environment;
  userProfile?: UserProfile;
  preferredUsername?: string; // Added to store preferred_username
  isMatMenuOpen = false;
  enteredButton = false;
  cartItems = 0;
  protected mobileOpened = false;
  private widthSmallDevice = 768;
  protected menuItems: any[] = [];
  private navSub?: Subscription;

  ngOnInit() {
    if (window.innerWidth >= this.widthSmallDevice) {
      this.mobileOpened = true;
    }

    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkMediaQuery.addEventListener('change', (event) => {
      if (event.matches) {
        this.toggleThemeTo('dark');
      } else {
        this.toggleThemeTo('light');
      }
    });

    // Fetch user profile and extract preferred_username
    if (this.authService.isAuthenticated()) {
      const profile = this.authService.getProfile();
      this.userProfile = {
        name: profile.name,
        email: '', // Placeholder, replace with actual email if available
        identifier: '', // Placeholder, replace with actual identifier if available
        isAuthorized: true,
      };
      this.preferredUsername = profile.name; // Assuming name corresponds to preferred_username
    }

    // Load navigation and build hierarchical menu
    this.navSub = this.navigationService
      .getNavigation()
      .subscribe((items: any[]) => {
        this.menuItems = this.buildMenu(items || []);
      });
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
  }

  private buildMenu(items: any[]): any[] {
    // Ensure every item has an id. If API provides id use it, otherwise assign a synthetic one.
    items = items.map((it, idx) => ({ id: it.id ?? idx + 1, ...it }));

    const map = new Map<number, any>();
    items.forEach((it) => {
      map.set(it.id, { ...it, children: [] });
    });

    const roots: any[] = [];
    items.forEach((it) => {
      if (!it.parent || it.parent === 0) {
        roots.push(map.get(it.id));
      } else if (map.has(it.parent)) {
        map.get(it.parent).children.push(map.get(it.id));
      } else {
        // If parent not found, try to attach to a root that matches title (best-effort fallback), otherwise push as root
        const fallback = roots.find((r) => r.title === it.parentTitle || false);
        if (fallback) {
          fallback.children.push(map.get(it.id));
        } else {
          roots.push(map.get(it.id));
        }
      }
    });

    return roots;
  }

  toggleThemeTo(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  menuEnter() {
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

  toggleSubmenu(item: any, event: Event) {
    // On small devices we want to toggle submenu visibility instead of navigating immediately
    if (
      window.innerWidth < this.widthSmallDevice &&
      item.children &&
      item.children.length
    ) {
      event.preventDefault();
      item.open = !item.open;
    }
  }
}
