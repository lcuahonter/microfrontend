import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SolicitudeService } from './solicitude.service';
import { SolicitudStore } from '../estados/solicitud.store';
import {
  EnlaceOperativo,
  Inventarios,
  RecibirNotificaciones,
  RepresentanteLegal,
  SeccionSubcontratados,
  SolicitudCatologoSelectLista,
  SolicitudRadioLista
} from '../models/solicitud.model';

describe('SolicitudeService', () => {
  let service: SolicitudeService;
  let httpMock: HttpTestingController;
  let solicitudStore: SolicitudStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SolicitudeService,
        { provide: SolicitudStore, useValue: {} }
      ]
    });
    service = TestBed.inject(SolicitudeService);
    httpMock = TestBed.inject(HttpTestingController);
    solicitudStore = TestBed.inject(SolicitudStore);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('conseguirInventarios should return Inventarios[]', () => {
    const mockData: Inventarios[] = [{} as Inventarios];
    service.conseguirInventarios().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/32605/inventarios-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('conseguirSolicitudCatologoSelectLista should return SolicitudCatologoSelectLista', () => {
    const mockData: SolicitudCatologoSelectLista = {} as SolicitudCatologoSelectLista;
    service.conseguirSolicitudCatologoSelectLista().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/32605/solicitud-catologo-select-lista.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('conseguirOpcionDeRadio should return SolicitudRadioLista', () => {
    const mockData: SolicitudRadioLista = {} as SolicitudRadioLista;
    service.conseguirOpcionDeRadio().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/32605/solicitud-radio-lista.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('conseguirSeccionSubcontratados should return SeccionSubcontratados', () => {
    const mockData: SeccionSubcontratados = {} as SeccionSubcontratados;
    service.conseguirSeccionSubcontratados().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/32605/seccion-subcontratados.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('conseguirRecibirNotificaciones should return RecibirNotificaciones[]', () => {
    const mockData: RecibirNotificaciones[] = [{} as RecibirNotificaciones];
    service.conseguirRecibirNotificaciones().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/32605/recibir-notificaciones.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('conseguirEnlaceOperativoDatos should return EnlaceOperativo[]', () => {
    const mockData: EnlaceOperativo[] = [{} as EnlaceOperativo];
    service.conseguirEnlaceOperativoDatos().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/32605/enlace-operativo-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('conseguirRepresentanteLegalDatos should return RepresentanteLegal', () => {
    const mockData: RepresentanteLegal = {} as RepresentanteLegal;
    service.conseguirRepresentanteLegalDatos().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/32605/representante-legal-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});