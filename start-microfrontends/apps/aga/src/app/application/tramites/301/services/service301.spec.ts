import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tramite301Store } from '../../../core/estados/tramites/tramite301.store';
import { Solicitud301State } from '../../../core/estados/tramites/tramite301.store';
import { Solocitud301Service } from './service301.service';

describe('Solocitud301Service', () => {
  let service: Solocitud301Service;
  let httpMock: HttpTestingController;
  let storeMock: jest.Mocked<Tramite301Store>;

  const mockState: Solicitud301State = {
    linea: 'Linea A',
    lineaCheckbox: 'true',
    nombreQuimico: 'Ácido Clorhídrico',
    nombreComercial: 'Reactivo HCl',
    numeroCAS: '7647-01-0',
    acondicionamiento: 'Botella',
    estadoFisico: 'Líquido',
    fraccionArancelaria: '1234.56.78',
    descripcionFraccion: 'Sustancia química',
    nico: '01',
    descripcionNico: 'Descripción Nico',
    mercancia: 'Mercancia ejemplo',
    folio: 'FOL123',
    registro: 'REG456',
    pagoDerechosTabla: [],
  };

  beforeEach(() => {
    const tramite301StoreMock = {
      setRegistro: jest.fn(),
      setMercancia: jest.fn(),
      setFolio: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setDescripcionFraccion: jest.fn(),
      setNico: jest.fn(),
      setDescripcionNico: jest.fn(),
      setNombreQuimico: jest.fn(),
      setNombreComercial: jest.fn(),
      setNumeroCAS: jest.fn(),
      setEstadoFisico: jest.fn(),
      setAcondicionamiento: jest.fn(),
      setLinea: jest.fn(),
      setLineaCheckbox: jest.fn(),
    } as unknown as jest.Mocked<Tramite301Store>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        Solocitud301Service,
        { provide: Tramite301Store, useValue: tramite301StoreMock }
      ]
    });

    service = TestBed.inject(Solocitud301Service);
    httpMock = TestBed.inject(HttpTestingController);
    storeMock = TestBed.inject(Tramite301Store) as jest.Mocked<Tramite301Store>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getRegistroTomaMuestrasMercanciasData', () => {
    it('should return data from JSON', () => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe((data: Solicitud301State) => {
        expect(data).toEqual(mockState);
      });

      const req = httpMock.expectOne('assets/json/301/registro_toma_muestras_mercancias.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockState);
    });
  });

  describe('actualizarEstadoFormulario', () => {
    it('should call all Tramite301Store setters with correct values', () => {
      service.actualizarEstadoFormulario(mockState);

      expect(storeMock.setRegistro).toHaveBeenCalledWith('REG456');
      expect(storeMock.setMercancia).toHaveBeenCalledWith('Mercancia ejemplo');
      expect(storeMock.setFolio).toHaveBeenCalledWith('FOL123');
      expect(storeMock.setFraccionArancelaria).toHaveBeenCalledWith('1234.56.78');
      expect(storeMock.setDescripcionFraccion).toHaveBeenCalledWith('Sustancia química');
      expect(storeMock.setNico).toHaveBeenCalledWith('01');
      expect(storeMock.setDescripcionNico).toHaveBeenCalledWith('Descripción Nico');
      expect(storeMock.setNombreQuimico).toHaveBeenCalledWith('Ácido Clorhídrico');
      expect(storeMock.setNombreComercial).toHaveBeenCalledWith('Reactivo HCl');
      expect(storeMock.setNumeroCAS).toHaveBeenCalledWith('7647-01-0');
      expect(storeMock.setEstadoFisico).toHaveBeenCalledWith('Líquido');
      expect(storeMock.setAcondicionamiento).toHaveBeenCalledWith('Botella');
      expect(storeMock.setLinea).toHaveBeenCalledWith('Linea A');
      expect(storeMock.setLineaCheckbox).toHaveBeenCalledWith('true');
    });
  });
});
