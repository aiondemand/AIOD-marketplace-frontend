import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from './footer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let httpClient: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterComponent ],
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule for testing HTTP requests     
    
    })
    .compileComponents();
 
    fixture = TestBed.createComponent( FooterComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
