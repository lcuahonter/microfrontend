import { TestBed } from '@angular/core/testing';
import { RetirosCofeprisService } from './retiros-cofepris.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Tramite261702Store } from '../../../estados/tramites/tramite261702.store';
import { RetirosCofepris261702State } from '../../../estados/tramites/tramite261702.store';

describe('RetirosCofeprisService', () => {
  let service: RetirosCofeprisService;
  let httpMock: jest.Mocked<HttpClient>;
  let tramite261702StoreMock: jest.Mocked<Tramite261702Store>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
    } as any;

    tramite261702StoreMock = {
      setDynamicFieldValue: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        RetirosCofeprisService,
        { provide: HttpClient, useValue: httpMock },
        { provide: Tramite261702Store, useValue: tramite261702StoreMock },
      ],
    });

    service = TestBed.inject(RetirosCofeprisService);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener los datos de importación definitiva correctamente', (done) => {
    const mockData: RetirosCofepris261702State = { campo: 'valor' } as any;
    httpMock.get.mockReturnValue(of(mockData));

    service.getImportacionDefinitivaData().subscribe((data) => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/261702/registro_toma_muestras_mercancias.json');
      done();
    });
  });

  it('debe actualizar el estado del formulario llamando al store', () => {
    service.actualizarEstadoFormulario('campoTest', 123);
    expect(tramite261702StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('campoTest', 123);
  });
});