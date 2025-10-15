import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from './core/services/app-config/app-config.service';
import { getCookie, setCookie } from './shared/utils/theme-utils';

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

    const theme = getCookie('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.body.dataset['data-theme'] = theme;
  }

  toggleTheme() {
    const newTheme =
      document.body.dataset['data-theme'] === 'dark' ? 'light' : 'dark';
    document.body.dataset['data-theme'] = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    setCookie('theme', newTheme);
  }
}
