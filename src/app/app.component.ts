import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from './core/services/app-config/app-config.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'ai4-dashboard';

    constructor(
        private titleService: Title,
        private appConfigService: AppConfigService
    ) {}

    ngOnInit(): void {
        this.titleService.setTitle(this.appConfigService.title);
    }
}
