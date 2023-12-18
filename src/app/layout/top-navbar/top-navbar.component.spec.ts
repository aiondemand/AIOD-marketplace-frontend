import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavbarComponent } from './top-navbar.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MediaMatcher } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

const mockedAuthService: any = {
    isAuthenticated: jest.fn(),
    userProfileSubject: of({}),
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

describe('TopNavbarComponent', () => {
    let component: TopNavbarComponent;
    let fixture: ComponentFixture<TopNavbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TopNavbarComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [
                { provide: AuthService, useValue: mockedAuthService },
                { provide: MediaMatcher, useValue: mockedMediaMatcher },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TopNavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
