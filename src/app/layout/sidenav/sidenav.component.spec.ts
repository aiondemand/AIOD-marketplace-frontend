import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateModule } from '@ngx-translate/core';

const mockedConfigService: any = {};
const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
};
const mockedMediaQueryList: MediaQueryList = {
    matches: true,
    media: 'test',
    onchange: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    removeEventListener: jest.fn(),
};
const mockedMediaMatcher: any = {
    matchMedia: jest.fn().mockReturnValue(mockedMediaQueryList),
};

describe('SidenavComponent', () => {
    let component: SidenavComponent;
    let fixture: ComponentFixture<SidenavComponent>;
    let appConfigService: AppConfigService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SidenavComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
                { provide: AuthService, useValue: mockedAuthService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidenavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
