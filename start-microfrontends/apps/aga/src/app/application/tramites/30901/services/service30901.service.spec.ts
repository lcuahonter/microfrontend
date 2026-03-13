import { TestBed } from '@angular/core/testing';
import { Solocitud30901Service } from './service30901.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import {
  Solicitud30901Store,
  Solicitud30901State,
} from '../estados/tramites30901.store';

describe('Solocitud30901Service', () => {
  let service: Solocitud30901Service;
  let httpClientSpy: { get: jest.Mock };
  let storeSpy: Record<string, jest.Mock>;

  const mockState: Solicitud30901State = {
    opcionDeImportador: 1,
    tomaMuestraDespacho: 'test',
    descMotivoFaltaMuestra: 'motivo',
    comboFraccionConcatenada: 1,
    fraccionConcatenada: 'fraccion',
    comboNicos: 1,
    fracciondescripcion: 'desc',
    nombreQuimico: 'quimico',
    nombreComercial: 'comercial',
    numeroCAS: '123-45-6',
    nicoDescripcion: 'nicoDesc',
    ideGenerica: 1,
    descClobGenerica: 'descClob',
    fechaInicioVigencia: '2024-01-01',
    fechaFinVigencia: '2024-12-31',
    lineaCaptura: 'linea',
    valorPago: 'test',
    pagoDerechosLista: [{ linea: 'pago1', monto: 'pago2' }],
  };

  beforeEach(() => {
    httpClientSpy = { get: jest.fn() };
    storeSpy = {
      setOpcionDeImportador: jest.fn(()=> of()),
      setTomaMuestraDespacho: jest.fn(()=> of()),
      setDescMotivoFaltaMuestra: jest.fn(()=> of()),
      setComboFraccionConcatenada: jest.fn(()=> of()),
      setFraccionConcatenada: jest.fn(()=> of()),
      setComboNicos: jest.fn(()=> of()),
      setFraccionDescripcion: jest.fn(()=> of()),
      setNombreQuimico: jest.fn(()=> of()),
      setNombreComercial: jest.fn(()=> of()),
      setNumeroCAS: jest.fn(()=> of()),
      setNicoDescripcion: jest.fn(()=> of()),
      setIdeGenerica: jest.fn(()=> of()),
      setDescClobGenerica: jest.fn(()=> of()),
      setFechaInicioVigencia: jest.fn(()=> of()),
      setFechaFinVigencia: jest.fn(()=> of()),
      setLineaCaptura: jest.fn(()=> of()),
      setValorPago: jest.fn(()=> of()),
      setPagoDerechosLista: jest.fn(()=> of()),
    };

    TestBed.configureTestingModule({
      providers: [
        Solocitud30901Service,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Solicitud30901Store, useValue: storeSpy },
      ],
    });

    service = TestBed.inject(Solocitud30901Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('actualizarEstadoFormulario', () => {
    it('should update store with provided state', () => {
      service.actualizarEstadoFormulario(mockState);

      expect(storeSpy['setOpcionDeImportador']).toHaveBeenCalledWith(
        mockState.opcionDeImportador
      );
      expect(storeSpy['setTomaMuestraDespacho']).toHaveBeenCalledWith(
        mockState.tomaMuestraDespacho
      );
      expect(storeSpy['setDescMotivoFaltaMuestra']).toHaveBeenCalledWith(
        mockState.descMotivoFaltaMuestra
      );
      expect(storeSpy['setComboFraccionConcatenada']).toHaveBeenCalledWith(
        mockState.comboFraccionConcatenada
      );
      expect(storeSpy['setFraccionConcatenada']).toHaveBeenCalledWith(
        mockState.fraccionConcatenada
      );
      expect(storeSpy['setComboNicos']).toHaveBeenCalledWith(mockState.comboNicos);
      expect(storeSpy['setFraccionDescripcion']).toHaveBeenCalledWith(
        mockState.fracciondescripcion
      );
      expect(storeSpy['setNombreQuimico']).toHaveBeenCalledWith(
        mockState.nombreQuimico
      );
      expect(storeSpy['setNombreComercial']).toHaveBeenCalledWith(
        mockState.nombreComercial
      );
      expect(storeSpy['setNumeroCAS']).toHaveBeenCalledWith(mockState.numeroCAS);
      expect(storeSpy['setNicoDescripcion']).toHaveBeenCalledWith(
        mockState.nicoDescripcion
      );
      expect(storeSpy['setIdeGenerica']).toHaveBeenCalledWith(
        mockState.ideGenerica
      );
      expect(storeSpy['setDescClobGenerica']).toHaveBeenCalledWith(
        mockState.descClobGenerica
      );
      expect(storeSpy['setFechaInicioVigencia']).toHaveBeenCalledWith(
        mockState.fechaInicioVigencia
      );
      expect(storeSpy['setFechaFinVigencia']).toHaveBeenCalledWith(
        mockState.fechaFinVigencia
      );
      expect(storeSpy['setLineaCaptura']).toHaveBeenCalledWith(
        mockState.lineaCaptura
      );
      expect(storeSpy['setValorPago']).toHaveBeenCalledWith(mockState.valorPago);
      expect(storeSpy['setPagoDerechosLista']).toHaveBeenCalledWith(
        mockState.pagoDerechosLista
      );
    });
  });

  describe('getRegistroRenovacionesMuestrasMercanciasData', () => {
    it('should call http.get with correct URL and return Observable', (done) => {
      httpClientSpy.get.mockReturnValue(of(mockState));
      service
        .getRegistroRenovacionesMuestrasMercanciasData()
        .subscribe((data) => {
          expect(data).toEqual(mockState);
          done();
        });
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'assets/json/30901/registro_toma_muestras_mercancias.json'
      );
    });
  });
});
