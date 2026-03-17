import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ExportarIlustracionesService } from './exportar-ilustraciones.service';

describe('ExportarIlustracionesService', () => {
  let service: ExportarIlustracionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ExportarIlustracionesService], 
    });

    service = TestBed.inject(ExportarIlustracionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});