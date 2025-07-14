import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AssetsListComponent } from './assets-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AssetsListComponent', () => {
  let component: AssetsListComponent;
  let fixture: ComponentFixture<AssetsListComponent>;
  let httpClient: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsListComponent ],
      imports: [HttpClientTestingModule] // Import HttpClientTestingModule for testing HTTP requests
      
    })
    .compileComponents();
 
    fixture = TestBed.createComponent(AssetsListComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
