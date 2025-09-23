import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericComponent} from './generic.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatasetComponent', () => {
  let component: GenericComponent;
  let fixture: ComponentFixture<GenericComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
    httpClient = TestBed.inject(HttpClient);
    fixture = TestBed.createComponent(GenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
