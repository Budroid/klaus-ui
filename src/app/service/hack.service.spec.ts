import { TestBed } from '@angular/core/testing';

import { HackService } from './hack.service';

describe('HackService', () => {
  let service: HackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
