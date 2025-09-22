import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from './core/services/app-config/app-config.service';
import { getCookie, setCookie } from './shared/utils/theme.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ai4-dashboard';

  constructor(
    private titleService: Title,
    private appConfigService: AppConfigService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.appConfigService.title);

    const themeCookie = getCookie('theme');
    const savedThemeLS = localStorage.getItem('theme');

    if (themeCookie) {
      document.documentElement.setAttribute('data-theme', themeCookie);
    } else if (savedThemeLS) {
      document.documentElement.setAttribute('data-theme', savedThemeLS);
      setCookie('theme', savedThemeLS);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      setCookie('theme', 'dark');
    }
  }
}
