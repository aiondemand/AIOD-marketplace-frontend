import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalResourceComponent } from './educational-resource.component';

describe('EducationalResourceComponent', () => {
  let component: EducationalResourceComponent;
  let fixture: ComponentFixture<EducationalResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationalResourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationalResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
