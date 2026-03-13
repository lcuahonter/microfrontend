import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InformeAnualProgramaService } from './informe-anual-programa.service';
import { Solicitud150103Store } from '../estados/solicitud150103.store';
import { Solicitud150103Query } from '../estados/solicitud150103.query';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';
import { Solicitud150103State } from '../estados/solicitud150103.store';

describe('InformeAnualProgramaService', () => {
  let service: InformeAnualProgramaService;
  let httpMock: HttpTestingController;
  let mockStore: Partial<Solicitud150103Store>;
  let mockQuery: Partial<Solicitud150103Query>;
  let mockHttpCoreService: Partial<HttpCoreService>;

  beforeEach(() => {
    mockStore = {
      actualizarFolioPrograma: jest.fn(),
      actualizarModalidad: jest.fn(),
      actualizarTipoPrograma: jest.fn(),
      actualizarEstatus: jest.fn(),
      actualizarVentasTotales: jest.fn(),
      actualizarTotalExportaciones: jest.fn()
    };
    mockQuery = {
      seleccionarSolicitud$: of({} as Solicitud150103State)
    };
    mockHttpCoreService = {
      post: jest.fn().mockImplementation(<T>() => of({ success: true } as T))
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InformeAnualProgramaService,
        { provide: Solicitud150103Store, useValue: mockStore },
        { provide: Solicitud150103Query, useValue: mockQuery },
        { provide: HttpCoreService, useValue: mockHttpCoreService }
      ],
    });

    service = TestBed.inject(InformeAnualProgramaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch registro data', () => {
    const mockData: Solicitud150103State = { folioPrograma: '123', modalidad: '', tipoPrograma: '', estatus: '', ventasTotales: '100', totalExportaciones: '50', saldo: '10', porcentajeExportacion: '5', totalImportaciones: '20' } as any;
    service.getRegistroData().subscribe((data) => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/150103/registro.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should call guardarDatosPost and return response', () => {
    const body = { test: 'value' };
    (mockHttpCoreService.post as jest.Mock).mockReturnValueOnce(of({ success: true }));
    service.guardarDatosPost(body).subscribe((resp) => {
      expect(resp).toEqual({ success: true });
    });
    expect(mockHttpCoreService.post).toHaveBeenCalled();
  });

  it('should build datos reporte correctly', () => {
    const state: Solicitud150103State = {
      saldo: '10',
      porcentajeExportacion: '5',
      ventasTotales: '100',
      totalExportaciones: '50',
      totalImportaciones: '20',
      folioPrograma: '', modalidad: '', tipoPrograma: '', estatus: ''
    } as any;
    const result = service.buildDatosReporte(state);
    expect(result).toEqual({
      saldo: '10',
      porcentaje: '5',
      ventasTotales: 100,
      totalExportaciones: 50,
      totalImportaciones: 20,
      totalPersonalAdmin1: 0,
      totalPersonalAdmin2: 0,
      totalPersonalObrero1: 0,
      totalPersonalObrero2: 0
    });
  });

  it('should get all state as observable', (done) => {
    service.getAllState().subscribe((data) => {
      expect(data).toEqual({} as Solicitud150103State);
      done();
    });
  });

  it('should fetch programas reporte', () => {
    const mockResponse = { programas: [] };
    service.obtenerProgramasReporte('RFC123').subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne((req) => req.url.includes('RFC123'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should update estado formulario', () => {
    const datos: Solicitud150103State = {
      folioPrograma: '1', modalidad: 'A', tipoPrograma: 'B', estatus: 'C', ventasTotales: '100', totalExportaciones: '50', saldo: '10', porcentajeExportacion: '5', totalImportaciones: '20'
    } as any;
    service.actualizarEstadoFormulario(datos);
    expect(mockStore.actualizarFolioPrograma).toHaveBeenCalledWith('1');
    expect(mockStore.actualizarModalidad).toHaveBeenCalledWith('A');
    expect(mockStore.actualizarTipoPrograma).toHaveBeenCalledWith('B');
    expect(mockStore.actualizarEstatus).toHaveBeenCalledWith('C');
    expect(mockStore.actualizarVentasTotales).toHaveBeenCalledWith('100');
    expect(mockStore.actualizarTotalExportaciones).toHaveBeenCalledWith('50');
  });
});
