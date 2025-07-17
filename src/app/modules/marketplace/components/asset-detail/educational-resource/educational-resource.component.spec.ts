import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalResourceComponent } from './educational-resource.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EducationalResourceComponent', () => {
  let component: EducationalResourceComponent;
  let fixture: ComponentFixture<EducationalResourceComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalResourceComponent,],
      imports: [HttpClientTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationalResourceComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
