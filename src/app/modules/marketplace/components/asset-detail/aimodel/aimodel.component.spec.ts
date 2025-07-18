import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AimodelComponent } from './aimodel.component';

describe('AimodelComponent', () => {
  let component: AimodelComponent;
  let fixture: ComponentFixture<AimodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AimodelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AimodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
