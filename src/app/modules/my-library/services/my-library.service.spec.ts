import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MyLibraryService } from './my-library.service';
import { AuthService } from '@app/core/services/auth/auth.service';

describe('MyLibraryService', () => {
  let service: MyLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { 
          provide: AuthService, 
          useValue: { getToken: jest.fn() } // Mock solo lo necesario
        }
      ]
    });
    service = TestBed.inject(MyLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
