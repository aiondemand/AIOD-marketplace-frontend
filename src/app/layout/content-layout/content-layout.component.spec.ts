import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentLayoutComponent } from './content-layout.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

describe('ContentLayoutComponent', () => {
    let component: ContentLayoutComponent;
    let fixture: ComponentFixture<ContentLayoutComponent>;
    let httpClient: HttpClient;
    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: (query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), // Soporte legacy
                removeListener: jest.fn(),
                addEventListener: jest.fn(), // Soporte moderno
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            }),
        });
    });
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ContentLayoutComponent, SidenavComponent],
            providers: [AuthService, OAuthService, UrlHelperService, OAuthLogger, DateTimeProvider,AppConfigService],
            imports: [HttpClientTestingModule] // <-- Añade esto
        }).compileComponents();

        fixture = TestBed.createComponent(ContentLayoutComponent);
        component = fixture.componentInstance;
        httpClient = TestBed.inject(HttpClient);
      
    });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
