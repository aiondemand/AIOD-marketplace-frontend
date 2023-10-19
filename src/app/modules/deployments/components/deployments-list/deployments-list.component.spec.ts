import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentsListComponent } from './deployments-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { RouterTestingModule } from '@angular/router/testing';
import {
    BrowserAnimationsModule,
    NoopAnimationsModule,
} from '@angular/platform-browser/animations';

const mockedConfigService: any = {};

describe('DeploymentsListComponent', () => {
    let component: DeploymentsListComponent;
    let fixture: ComponentFixture<DeploymentsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeploymentsListComponent],
            imports: [
                SharedModule,
                RouterTestingModule,
                NoopAnimationsModule,
                HttpClientTestingModule,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DeploymentsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
