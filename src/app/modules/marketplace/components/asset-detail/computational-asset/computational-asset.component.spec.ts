import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputationalAssetComponent } from './computational-asset.component';

describe('ComputationalAssetComponent', () => {
  let component: ComputationalAssetComponent;
  let fixture: ComponentFixture<ComputationalAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComputationalAssetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComputationalAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
