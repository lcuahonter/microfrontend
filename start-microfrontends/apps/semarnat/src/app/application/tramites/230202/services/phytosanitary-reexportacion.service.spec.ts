import { TestBed } from '@angular/core/testing';
import { PhytosanitaryReexportacionService } from './phytosanitary-reexportacion.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PhytosanitaryReexportacionService', () => {
  let service: PhytosanitaryReexportacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Provide a mock HTTP client
      providers: [PhytosanitaryReexportacionService],
    });
    service = TestBed.inject(PhytosanitaryReexportacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
