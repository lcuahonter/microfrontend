import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DesistimientoService } from './desistimiento.service';
import { DesistimientoStore } from '../estados/tramite220404.store';
import { DesistimientoForm } from '../modelos/desistimiento.model';

describe('DesistimientoService', () => {
  let service: DesistimientoService;
  let httpMock: HttpTestingController;
  let desistimientoStoreMock: Partial<DesistimientoStore>;

  beforeEach(() => {
    desistimientoStoreMock = {
      update: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DesistimientoService,
        { provide: DesistimientoStore, useValue: desistimientoStoreMock },
      ],
    });

    service = TestBed.inject(DesistimientoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDesistimientoSolicitud', () => {
    it('should fetch desistimiento data from the correct URL', () => {
      const mockResponse: DesistimientoForm = {
        folio: 'FT123456',
        tipoDeSolicitud: 'Cambio de modalidad',
        descripcion: 'Descripción del desistimiento',
      };

      service.getDesistimientoSolicitud().subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/assets/json/220404/desistimiento.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('guardarFormularioDesistimiento', () => {
    it('should update the store with the provided data', () => {
      const mockData: Partial<DesistimientoForm> = {
        folio: 'FT123456',
        descripcion: 'Updated description',
      };

      service.guardarFormularioDesistimiento(mockData);

      expect(desistimientoStoreMock.update).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('actualizarEstadoFormulario', () => {
    it('should update the store with the provided data', () => {
      const mockData: Partial<DesistimientoForm> = {
        tipoDeSolicitud: 'Nuevo tipo de solicitud',
      };

      service.actualizarEstadoFormulario(mockData);

      expect(desistimientoStoreMock.update).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('getRegistroTomaMuestrasMercanciasData', () => {
    it('should fetch registro toma muestras data from the correct URL', () => {
      const mockResponse: DesistimientoForm = {
        folio: 'FT654321',
        tipoDeSolicitud: 'Toma de muestras',
        descripcion: 'Descripción de la toma de muestras',
      };

      service.getRegistroTomaMuestrasMercanciasData().subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/assets/json/220404/descripcion.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});