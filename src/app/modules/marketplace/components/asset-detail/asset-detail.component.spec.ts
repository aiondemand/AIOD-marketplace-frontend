import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssetDetailComponent } from './asset-detail.component';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';

describe('AssetDetailComponent', () => {
  let component: AssetDetailComponent;
  let fixture: ComponentFixture<AssetDetailComponent>;
  let httpClient: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetDetailComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ category: 'DATASET', id: 1 }),
            params: of({}),
            snapshot: { paramMap: { get: () => null } },
          },
        },
        {
          provide: AuthService,
          useValue: {
            getToken: jest.fn(),
            userProfileSubject: new BehaviorSubject<any>({}), // <-- Mock real
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AssetDetailComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
