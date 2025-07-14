import { TestBed } from '@angular/core/testing';

import { ElasticSearchService } from './elastic-search.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ElasticSearchService', () => {
  let service: ElasticSearchService;
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(ElasticSearchService);
    httpClient= TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
