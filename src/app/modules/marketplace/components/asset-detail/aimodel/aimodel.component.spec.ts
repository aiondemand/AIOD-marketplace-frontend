import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AimodelComponent } from './aimodel.component';

describe('AimodelComponent', () => {
  let component: AimodelComponent;
  let fixture: ComponentFixture<AimodelComponent>;
  let httpClient: HttpClient;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AimodelComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
    httpClient=TestBed.inject(HttpClient);
    fixture = TestBed.createComponent(AimodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
