import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExportadorAutorizadoService } from './exportador-autorizado.service';
import { Tramite110102Store } from '../estados/store/tramite110102.store';
import { Tramite110102State } from '../estados/store/tramite110102.store';

describe('ExportadorAutorizadoService', () => {
  let service: ExportadorAutorizadoService;
  let httpMock: HttpTestingController;
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      update: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ExportadorAutorizadoService,
        { provide: Tramite110102Store, useValue: mockStore }
      ]
    });

    service = TestBed.inject(ExportadorAutorizadoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerRegistro debe realizar una solicitud HTTP GET y retornar los datos esperados', () => {
    const mockResponse: Tramite110102State = {
      cveRegistroProductor: '123456',
      claveUnidadAdministrativa: 'RF1',
      claveEntidadFederativa: '01',
      protestoDecirVerdad: true,
      solicitaSeparacionContable: false,
      solicitaExportadorAutorizado: true,
      condicionExportador: 'COND',
      solicitaExportadorAutorizadoJPN: false,
      condicionExportadorJPN: 'CONDJPN'
    };

    service.obtenerRegistro().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('./assets/json/110102/registro.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('actualizarRegistro debe llamar al método update del store con los datos proporcionados', () => {
    const mockRegistro: Tramite110102State = {
      cveRegistroProductor: '123456',
      claveUnidadAdministrativa: 'RF1',
      claveEntidadFederativa: '01',
      protestoDecirVerdad: true,
      solicitaSeparacionContable: false,
      solicitaExportadorAutorizado: true,
      condicionExportador: 'COND',
      solicitaExportadorAutorizadoJPN: false,
      condicionExportadorJPN: 'CONDJPN'
    };

    service.actualizarRegistro(mockRegistro);
    expect(mockStore.update).toHaveBeenCalledWith({
      cveRegistroProductor: '123456',
      claveUnidadAdministrativa: 'RF1',
      claveEntidadFederativa: '01',
      protestoDecirVerdad: true,
      solicitaSeparacionContable: false,
      solicitaExportadorAutorizado: true,
      condicionExportador: 'COND',
      solicitaExportadorAutorizadoJPN: false,
      condicionExportadorJPN: 'CONDJPN'
    });
  });
});