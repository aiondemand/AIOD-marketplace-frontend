import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericComponent } from './generic.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('DatasetComponent', () => {
  let component: GenericComponent;
  let fixture: ComponentFixture<GenericComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
    fixture = TestBed.createComponent(GenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
