import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetComponent } from './dataset.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatasetComponent', () => {
  let component: DatasetComponent;
  let fixture: ComponentFixture<DatasetComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetComponent ],
      imports:[HttpClientTestingModule]
    })
    .compileComponents();
    httpClient = TestBed.inject(HttpClient);
    fixture = TestBed.createComponent(DatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
