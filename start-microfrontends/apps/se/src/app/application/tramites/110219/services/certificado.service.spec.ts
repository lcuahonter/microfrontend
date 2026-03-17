import { TestBed } from '@angular/core/testing';
import { CertificadoService } from './certificado.service';
import { Tramite110219Store } from '../estados/Tramite110219.store';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('CertificadoService', () => {
  let service: CertificadoService;
  let httpMock: any;
  let storeMock: any;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    };
    storeMock = {
      setNumeroCertificado: jest.fn(),
      setPais: jest.fn(),
      setTratado: jest.fn(),
      setFechaInicial: jest.fn(),
      setFechaFinal: jest.fn(),
      setMotivoCancelacion: jest.fn(),
      setCertificadoDeorigen: jest.fn(),
      setFechaExpedicion: jest.fn(),
      setFechaVencimiento: jest.fn(),
      setBloque: jest.fn(),
      setAcuerdo: jest.fn(),
      setObservaciones: jest.fn(),
      setNombre: jest.fn(),
      setPrimerApellido: jest.fn(),
      setSegundoApellido: jest.fn(),
      setRegistroFiscal: jest.fn(),
      setRazonSocial: jest.fn(),
      setCalle: jest.fn(),
      setNumeroLetra: jest.fn(),
      setTelefono: jest.fn(),
      setCiudad: jest.fn(),
      setFax: jest.fn(),
      setCorreoElectronico: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpMock },
        { provide: Tramite110219Store, useValue: storeMock }
      ]
    });
    service = TestBed.inject(CertificadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all store setters in actualizarEstadoFormulario', () => {
    const datos: any = {
      numeroCertificado: 'NC',
      pais: [{ id: 1, descripcion: 'MX' }],
      tratado: [{ id: 2, descripcion: 'TLC' }],
      fechaInicial: '2024-01-01',
      fechaFinal: '2024-12-31',
      motivoCancelacion: 'motivo',
      certificadoDeOrigen: 'cert',
      fechaExpedicion: '2024-01-01',
      fechaVencimiento: '2024-12-31',
      bloque: 'bloque',
      acuerdo: 'acuerdo',
      observaciones: 'obs',
      nombre: 'nombre',
      primerApellido: 'apellido1',
      segundoApellido: 'apellido2',
      registroFiscal: 'reg123',
      razonSocial: 'razon',
      calle: 'calle',
      numeroLetra: '12A',
      telefono: 1234567890,
      ciudad: 1,
      fax: 1234567890,
      correoElectronico: 'test@email.com'
    };
    service.actualizarEstadoFormulario(datos);
    expect(storeMock.setNumeroCertificado).toHaveBeenCalledWith(datos.numeroCertificado);
    expect(storeMock.setPais).toHaveBeenCalledWith(datos.pais);
    expect(storeMock.setTratado).toHaveBeenCalledWith(datos.tratado);
    expect(storeMock.setFechaInicial).toHaveBeenCalledWith(datos.fechaInicial);
    expect(storeMock.setFechaFinal).toHaveBeenCalledWith(datos.fechaFinal);
    expect(storeMock.setMotivoCancelacion).toHaveBeenCalledWith(datos.motivoCancelacion);
    expect(storeMock.setCertificadoDeorigen).toHaveBeenCalledWith(datos.certificadoDeOrigen);
    expect(storeMock.setFechaExpedicion).toHaveBeenCalledWith(datos.fechaExpedicion);
    expect(storeMock.setFechaVencimiento).toHaveBeenCalledWith(datos.fechaVencimiento);
    expect(storeMock.setBloque).toHaveBeenCalledWith(datos.bloque);
    expect(storeMock.setAcuerdo).toHaveBeenCalledWith(datos.acuerdo);
    expect(storeMock.setObservaciones).toHaveBeenCalledWith(datos.observaciones);
    expect(storeMock.setNombre).toHaveBeenCalledWith(datos.nombre);
    expect(storeMock.setPrimerApellido).toHaveBeenCalledWith(datos.primerApellido);
    expect(storeMock.setSegundoApellido).toHaveBeenCalledWith(datos.segundoApellido);
    expect(storeMock.setRegistroFiscal).toHaveBeenCalledWith(datos.registroFiscal);
    expect(storeMock.setRazonSocial).toHaveBeenCalledWith(datos.razonSocial);
    expect(storeMock.setCalle).toHaveBeenCalledWith(datos.calle);
    expect(storeMock.setNumeroLetra).toHaveBeenCalledWith(datos.numeroLetra);
    expect(storeMock.setTelefono).toHaveBeenCalledWith(datos.telefono);
    expect(storeMock.setCiudad).toHaveBeenCalledWith(datos.ciudad);
    expect(storeMock.setFax).toHaveBeenCalledWith(datos.fax);
    expect(storeMock.setCorreoElectronico).toHaveBeenCalledWith(datos.correoElectronico);
  });

  it('should call http.get for getRegistroTomaMuestrasMercanciasData', () => {
    httpMock.get.mockReturnValue(of({}));
    service.getRegistroTomaMuestrasMercanciasData().subscribe(res => {
      expect(res).toEqual({});
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110219/registro_toma_muestras_mercancias.json');
  });

  it('should call http.get for getTratadoData', () => {
    httpMock.get.mockReturnValue(of([]));
    service.getTratadoData().subscribe(res => {
      expect(res).toEqual([]);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110219/tratado.json');
  });

  it('should call http.get for getSolicitudesTabla and handle success', () => {
    httpMock.get.mockReturnValue(of([]));
    service.getSolicitudesTabla().subscribe(res => {
      expect(res).toEqual([]);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110219/mercanciaTable.json');
  });

  it('should call http.get for getSolicitudesTabla and handle error', () => {
    httpMock.get.mockReturnValue(throwError(() => new Error('fail')));
    service.getSolicitudesTabla().subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });

  it('should call http.get for getMercanciaCertificadoTabla and handle success', () => {
    httpMock.get.mockReturnValue(of([]));
    service.getMercanciaCertificadoTabla().subscribe(res => {
      expect(res).toEqual([]);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/110219/mercanciaCertificado.json');
  });

  it('should call http.get for getMercanciaCertificadoTabla and handle error', () => {
    httpMock.get.mockReturnValue(throwError(() => new Error('fail')));
    service.getMercanciaCertificadoTabla().subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
});