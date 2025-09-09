import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '@app/core/services/auth/auth.service';

import { BookmarkService } from './bookmark.service';
import { BehaviorSubject } from 'rxjs';

describe('BookmarkService', () => {
  let service: BookmarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],

      providers: [
        {
          provide: AuthService,
          useValue: {
            getToken: jest.fn(),
            userProfileSubject: new BehaviorSubject<any>({}), // <-- Mock real
          },
        },
      ],
    });
    service = TestBed.inject(BookmarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
