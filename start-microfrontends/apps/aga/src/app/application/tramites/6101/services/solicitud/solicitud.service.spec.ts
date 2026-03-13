import { TestBed } from '@angular/core/testing';
import { SolicitudService } from './solicitud.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Solicitud6101Store } from '../../estados/solicitud6101.store';
import { GuardarDatosFormulario, SolicitudCatologo } from '../../models/solicitud.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

jest.mock('@angular/common/http');
jest.mock('../../estados/solicitud6101.store');

describe('SolicitudService', () => {
  let service: SolicitudService;
  let httpClientMock: jest.Mocked<HttpClient>;
  let storeMock: jest.Mocked<Solicitud6101Store>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(()=> of())
    } as any;

    storeMock = {
      actualizarAduanaAux: jest.fn(()=> of()),
      actualizarCapitulo: jest.fn(()=> of()),
      actualizarCapituloII: jest.fn(()=> of()),
      actualizarCapituloIII: jest.fn(()=> of()),
      actualizarDescDetalladaMercancia: jest.fn(()=> of()),
      actualizarFraccionI: jest.fn(()=> of()),
      actualizarFraccionII: jest.fn(()=> of()),
      actualizarFraccionIII: jest.fn(()=> of()),
      actualizarJuntaTecnicaDerivada: jest.fn(()=> of()),
      actualizarManifiestosSeleccionados: jest.fn(()=> of()),
      actualizarNombreComercialMercancia: jest.fn(()=> of()),
      actualizarNumeroPedimento: jest.fn(()=> of()),
      actualizarPartida: jest.fn(()=> of()),
      actualizarPartidaII: jest.fn(()=> of()),
      actualizarPartidaIII: jest.fn(()=> of()),
      actualizarSubdivision: jest.fn(()=> of()),
      actualizarSubdivisionII: jest.fn(()=> of()),
      actualizarSubdivisionIII: jest.fn(()=> of()),
      actualizarSubpartida: jest.fn(()=> of()),
      actualizarSubpartidaII: jest.fn(()=> of()),
      actualizarSubpartidaIII: jest.fn(()=> of())
    } as any;

    TestBed.configureTestingModule({
      imports:[ HttpClientTestingModule],
      providers: [
        SolicitudService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: Solicitud6101Store, useValue: storeMock }
      ]
    });

    service = TestBed.inject(SolicitudService);
  });

  describe('conseguirSolicitudCatologo', () => {
    it('should return expected catalogo (Observable)', (done) => {
      const mockCatalogo: SolicitudCatologo = {} as any;
      httpClientMock.get.mockReturnValue(of(mockCatalogo));

      service.conseguirSolicitudCatologo().subscribe({
        next: (result) => {
          expect(result).toEqual(mockCatalogo);
          expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/6101/solicitud-catalogo.json');
          done();
        },
        error: done.fail
      });
    });

    it('should handle error and propagate it', (done) => {
      const errorResponse = { status: 404, message: 'Not Found' };
      httpClientMock.get.mockReturnValue(throwError(() => errorResponse));

      service.conseguirSolicitudCatologo().subscribe({
        next: () => done.fail('expected error'),
        error: (error) => {
          expect(error).toBe(errorResponse);
          done();
        }
      });
    });
  });

  describe('guardarDatosFormulario', () => {
    it('should return expected datos formulario (Observable)', (done) => {
      const mockDatos: GuardarDatosFormulario = {} as any;
      httpClientMock.get.mockReturnValue(of(mockDatos));

      service.guardarDatosFormulario().subscribe({
        next: (result) => {
          expect(result).toEqual(mockDatos);
          expect(httpClientMock.get).toHaveBeenCalledWith('assets/json/6101/solicitud-datos.json');
          done();
        },
        error: done.fail
      });
    });
  });

  describe('actualizarEstadoFormulario', () => {
    it('should call all store update methods with correct values', () => {
      const mockRespuesta: GuardarDatosFormulario = {
        aduanaAux: 'aduana',
        capitulo: 'cap1',
        capituloII: 'cap2',
        capituloIII: 'cap3',
        descDetalladaMercancia: 'desc',
        fraccionI: 'f1',
        fraccionII: 'f2',
        fraccionIII: 'f3',
        juntaTecnicaDerivada: 'junta',
        manifiestosSeleccionados: ['m1', 'm2'],
        nombreComercialMercancia: 'nombre',
        numeroPedimento: 'num',
        partida: 'p1',
        partidaII: 'p2',
        partidaIII: 'p3',
        subdivision: 's1',
        subdivisionII: 's2',
        subdivisionIII: 's3',
        subpartida: 'sp1',
        subpartidaII: 'sp2',
        subpartidaIII: 'sp3'
      } as any;

      service.actualizarEstadoFormulario(mockRespuesta);

      expect(storeMock.actualizarAduanaAux).toHaveBeenCalledWith('aduana');
      expect(storeMock.actualizarCapitulo).toHaveBeenCalledWith('cap1');
      expect(storeMock.actualizarCapituloII).toHaveBeenCalledWith('cap2');
      expect(storeMock.actualizarCapituloIII).toHaveBeenCalledWith('cap3');
      expect(storeMock.actualizarDescDetalladaMercancia).toHaveBeenCalledWith('desc');
      expect(storeMock.actualizarFraccionI).toHaveBeenCalledWith('f1');
      expect(storeMock.actualizarFraccionII).toHaveBeenCalledWith('f2');
      expect(storeMock.actualizarFraccionIII).toHaveBeenCalledWith('f3');
      expect(storeMock.actualizarJuntaTecnicaDerivada).toHaveBeenCalledWith('junta');
      expect(storeMock.actualizarManifiestosSeleccionados).toHaveBeenCalledWith(['m1', 'm2']);
      expect(storeMock.actualizarNombreComercialMercancia).toHaveBeenCalledWith('nombre');
      expect(storeMock.actualizarNumeroPedimento).toHaveBeenCalledWith('num');
      expect(storeMock.actualizarPartida).toHaveBeenCalledWith('p1');
      expect(storeMock.actualizarPartidaII).toHaveBeenCalledWith('p2');
      expect(storeMock.actualizarPartidaIII).toHaveBeenCalledWith('p3');
      expect(storeMock.actualizarSubdivision).toHaveBeenCalledWith('s1');
      expect(storeMock.actualizarSubdivisionII).toHaveBeenCalledWith('s2');
      expect(storeMock.actualizarSubdivisionIII).toHaveBeenCalledWith('s3');
      expect(storeMock.actualizarSubpartida).toHaveBeenCalledWith('sp1');
      expect(storeMock.actualizarSubpartidaII).toHaveBeenCalledWith('sp2');
      expect(storeMock.actualizarSubpartidaIII).toHaveBeenCalledWith('sp3');
    });
  });
});