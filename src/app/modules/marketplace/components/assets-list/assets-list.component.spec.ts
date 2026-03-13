import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsListComponent } from './assets-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '@app/core/services/auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('AssetsListComponent', () => {
  let component: AssetsListComponent;
  let fixture: ComponentFixture<AssetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetsListComponent],
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule for testing HTTP requests
      providers: [
        {
          provide: AuthService,
          useValue: {
            getToken: jest.fn(),
            userProfileSubject: new BehaviorSubject<any>({}), // <-- Mock real
            isAuthActiveUser: jest.fn().mockReturnValue(false),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ category: 'DATASET', id: 1 }),
            params: of({ id: 1 }),
            snapshot: { paramMap: { get: () => null } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
