import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from './core/services/app-config/app-config.service';
import { AuthService } from './core/services/auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ai4-dashboard';
  constructor(
    private titleService: Title,
    private appConfigService: AppConfigService,
    public authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.titleService.setTitle(this.appConfigService.title);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    window.addEventListener('aiod-start-login', this.handleLoginRequest);
    window.addEventListener('aiod-start-logout', this.handleLogoutRequest);
  }
  handleLoginRequest = (): void => {
    this.authService.login();
  };
  handleLogoutRequest = (): void => {
    this.authService.logout();
  };
  ngOnDestroy(): void {
    window.removeEventListener('aiod-start-login', this.handleLoginRequest);
    window.removeEventListener('aiod-start-logout', this.handleLogoutRequest);
  }
  login(): void {
    this.authService.login();
  }
  logout(): void {
    this.authService.logout();
  }
}
