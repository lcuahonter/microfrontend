import { TestBed } from '@angular/core/testing';
import { ImmerModificacionService } from './immer-modificacion.service';
import { provideHttpClient } from '@angular/common/http';

describe('ImmerModificacionService', () => {
  let service: ImmerModificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(ImmerModificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
