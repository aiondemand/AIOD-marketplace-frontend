import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkViewComponent } from './bookmark-view';

describe('BookmarkViewComponent', () => {
  let component: BookmarkViewComponent;
  let fixture: ComponentFixture<BookmarkViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookmarkViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookmarkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
