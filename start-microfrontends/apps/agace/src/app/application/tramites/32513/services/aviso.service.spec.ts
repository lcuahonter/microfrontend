import { AvisoService } from './aviso.service';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

describe('AvisoService', () => {
  let service: AvisoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(AvisoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
