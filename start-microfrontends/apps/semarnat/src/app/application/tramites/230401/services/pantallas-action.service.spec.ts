import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PantallasActionService } from './pantallas-action.service';
import { TestBed } from '@angular/core/testing';

describe('PantallasActionService', () => {
  let service: PantallasActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(PantallasActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
