import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationComponent } from './publication.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PublicationComponent', () => {
  let component: PublicationComponent;
  let fixture: ComponentFixture<PublicationComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicationComponent],
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule for testing HTTP requests
    }).compileComponents();

    fixture = TestBed.createComponent(PublicationComponent);
    httpClient = TestBed.inject(HttpClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
