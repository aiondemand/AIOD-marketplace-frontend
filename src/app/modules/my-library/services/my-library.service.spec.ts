import { TestBed } from '@angular/core/testing';

import { MyLibraryService } from './my-library.service';

describe('MyLibraryService', () => {
  let service: MyLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
