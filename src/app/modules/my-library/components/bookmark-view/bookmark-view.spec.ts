import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BookmarkViewComponent } from './bookmark-view';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@app/core/services/auth/auth.service';

describe('BookmarkViewComponent', () => {
  let component: BookmarkViewComponent;
  let fixture: ComponentFixture<BookmarkViewComponent>;
  let httpClient: HttpClient;
  class ActivatedRouteMock {
    queryParams = new Observable((observer) => {
      const urlParams = {
        type: 'mocck',
      };

      observer.next(urlParams);
      observer.complete();
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookmarkViewComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteMock,
        },
        {
          provide: AuthService,
          useValue: {
            getToken: jest.fn(),
            userProfileSubject: new BehaviorSubject<any>({}),
          }, // <-- Mock real}
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookmarkViewComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
