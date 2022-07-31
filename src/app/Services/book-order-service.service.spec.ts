import { TestBed } from '@angular/core/testing';

import { BookOrderServiceService } from './book-order-service.service';

describe('BookOrderServiceService', () => {
  let service: BookOrderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookOrderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
