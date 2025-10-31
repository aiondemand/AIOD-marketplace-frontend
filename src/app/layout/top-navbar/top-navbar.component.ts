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
import { EXTERNAL_LINKS } from '@app/shared/constants/external-links';

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
  protected externalLinks = EXTERNAL_LINKS;
  userProfile?: UserProfile;
  preferredUsername?: string;
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

    this.navSub = new Subscription();
    const authSub = this.authService.userProfileSubject.subscribe((profile) => {
      if (this.authService.isAuthenticated()) {
        this.userProfile = {
          name: profile.name || '',
          email: profile.email || '',
          identifier: profile.identifier || '',
          isAuthorized: profile.isAuthorized || false,
          preferred_username: profile.preferred_username || '',
        };
        this.preferredUsername = profile.preferred_username || '';
        localStorage.removeItem('loginPrompted');
      }
    });
    this.navSub.add(authSub);

    const navigationSub = this.navigationService
      .getNavigation()
      .subscribe((items: any[]) => {
        this.menuItems = items || [];
      });
    this.navSub.add(navigationSub);
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
  }

  private buildMenu(items: any[]): any[] {
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
    const fullPath = window.location.pathname + window.location.search;
    this.authService.login(fullPath);
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
    if (
      window.innerWidth < this.widthSmallDevice &&
      item.children &&
      item.children.length
    ) {
      event.preventDefault();
      item.open = !item.open;
    }
  }

  onClickContribute() {
    window.location.href = environment.MCEConfig.mceUrl;
  }
}
