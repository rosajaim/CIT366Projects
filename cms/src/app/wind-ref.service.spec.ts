import { TestBed, inject } from '@angular/core/testing';

import { WindRefService } from './wind-ref.service';

describe('WindRefService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindRefService]
    });
  });

  it('should be created', inject([WindRefService], (service: WindRefService) => {
    expect(service).toBeTruthy();
  }));
});
