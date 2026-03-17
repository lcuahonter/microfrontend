import { TestBed } from '@angular/core/testing';

import { ImportacionPlafestService } from './importacion-plafest.service';
import { HttpClientModule } from '@angular/common/http';

describe('ImportacionPlafestService', () => {
  let service: ImportacionPlafestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(ImportacionPlafestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
