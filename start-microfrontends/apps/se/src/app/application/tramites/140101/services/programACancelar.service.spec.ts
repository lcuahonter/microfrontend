import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProgramaACancelarService } from './programACancelar.service';
import { ProgramaACancelar } from '../../../shared/models/programa-cancelar.model';
import { Tramite140101Store } from '../../../estados/tramites/tramite140101.store';

describe('ProgramaACancelarService', () => {
  let service: ProgramaACancelarService;
  let httpMock: HttpTestingController;
  let tramiteStoreMock: any;

  beforeEach(() => {
    tramiteStoreMock = {
      setConfirmar: jest.fn(),
      setSolicitudObservaciones: jest.fn(),
      setPrograma: jest.fn(),
      setRadioSelection: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Tramite140101Store, useValue: tramiteStoreMock },
        ProgramaACancelarService,
      ]
    });

    service = TestBed.inject(ProgramaACancelarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener getProgramaDatos y retornar Programa140101State', () => {
    const mockResponse = {
      programaACancelar: {},
      solicitudObservaciones: '',
      confirmar: false,
      radio: 0,
      datos: [],
    };
    service.getProgramaDatos().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/140101/programa-cancelar.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debe llamar a los métodos del store con los valores correctos en setDatosFormulario', () => {
    const datos = {
      confirmar: true,
      solicitudObservaciones: 'Obs',
      programaACancelar: { folioPrograma: '123' },
      radio: 2
    };
    service.setDatosFormulario(datos as any);

    expect(tramiteStoreMock.setConfirmar).toHaveBeenCalledWith(true);
    expect(tramiteStoreMock.setSolicitudObservaciones).toHaveBeenCalledWith('Obs');
    expect(tramiteStoreMock.setPrograma).toHaveBeenCalledWith({ folioPrograma: '123' });
    expect(tramiteStoreMock.setRadioSelection).toHaveBeenCalledWith(2);
  });
});