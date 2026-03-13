import { TestBed } from '@angular/core/testing';
import { EstablecimientoService } from './establecimiento.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('EstablecimientoService', () => {
  let service: EstablecimientoService;
  let httpMock: any;
  let tramiteStoreMock: any;
  let tramiteStoreDataMock: any;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    };

    tramiteStoreMock = {
      setEstablecimientoCorreoElectronico: jest.fn(),
      setEstablecimientoDomicilioCodigoPostal: jest.fn(),
      setIdeGenerica1: jest.fn(),
      setObservaciones: jest.fn(),
      setEstablecimientoRFCResponsableSanitario: jest.fn(),
      setEstablecimientoRazonSocial: jest.fn(),
      setEstablecimientoEstados: jest.fn(),
      setDescripcionMunicipio: jest.fn(),
      setLocalidad: jest.fn(),
      setColonias: jest.fn(),
      setCalle: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setScian: jest.fn(),
      setEstablishomentoColonias: jest.fn(),
      setNoLicenciaSanitaria: jest.fn(),
      setAvisoCheckbox: jest.fn(),
      setLicenciaSanitaria: jest.fn(),
      setRegimen: jest.fn(),
      setAduanasEntradas: jest.fn(),
      setDescripcionScian: jest.fn(),
      setRepresentanteApellidos: jest.fn()
    };

    tramiteStoreDataMock = {
      setRepresentanteRfc: jest.fn(),
      setRepresentanteNombre: jest.fn(),
      setRepresentanteApellidos: jest.fn()
    };

    service = new EstablecimientoService(
      httpMock as any,
      tramiteStoreMock as any,
      tramiteStoreDataMock as any
    );
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener los datos del catálogo SCIAN', () => {
    const mockResponse = [{ id: 1, descripcion: 'SCIAN' }];
    httpMock.get.mockReturnValue(of(mockResponse));
    service.getSciandata().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260401/scianda.json');
  });

  it('debería obtener los datos de justificación', () => {
    const mockResponse = [{ id: 1, nombre: 'Justificación' }];
    httpMock.get.mockReturnValue(of(mockResponse));
    service.getJustificationData().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/cofepris/justificacion.json');
  });

  it('debería obtener los datos de estado', () => {
    const mockResponse = [{ id: 1, descripcion: 'Estado' }];
    httpMock.get.mockReturnValue(of(mockResponse));
    service.getEstadodata().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260401/scianda.json');
  });

  it('debería obtener los datos de pago de derechos', () => {
    const mockResponse = { pago: true };
    httpMock.get.mockReturnValue(of(mockResponse));
    service.getPagoDerechos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260909/serviciosExtraordinarios260909.json');
  });

  it('debería obtener los datos de estado de derechos', () => {
    const mockResponse = { test: 'estadoDerechos' };
    httpMock.get.mockReturnValue(of(mockResponse));
    service.getEstadoDerechos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260909/serviciosExtraordinarios.json');
  });

  it('debería actualizar el estado del formulario llamando todos los métodos del store', () => {
    const datos = {
      establecimientoCorreoElectronico: 'correo@mail.com',
      establecimientoDomicilioCodigoPostal: '12345',
      ideGenerica1: 'GEN1',
      observaciones: 'Obs',
      establecimientoRFCResponsableSanitario: 'RFC',
      establecimientoRazonSocial: 'Razon',
      establecimientoEstados: 'Estado',
      descripcionMunicipio: 'Municipio',
      localidad: 'Localidad',
      colonias: 'Colonia',
      calle: 'Calle',
      lada: '33',
      telefono: '1234567',
      scian: 'SCIAN',
      establishomentoColonias: 'ColoniaEst',
      noLicenciaSanitaria: 'Licencia',
      avisoCheckbox: true,
      licenciaSanitaria: 'LicSan',
      regimen: 'Regimen',
      aduanasEntradas: 'Aduana',
      descripcionScian: 'DescScian',
      apellidoMaterno: 'Materno',
      apellidoPaterno: 'Paterno'
    };
    service.actualizarEstadoFormulario(datos as any);

    expect(tramiteStoreMock.setEstablecimientoCorreoElectronico).toHaveBeenCalledWith(datos.establecimientoCorreoElectronico);
    expect(tramiteStoreMock.setEstablecimientoDomicilioCodigoPostal).toHaveBeenCalledWith(datos.establecimientoDomicilioCodigoPostal);
    expect(tramiteStoreMock.setIdeGenerica1).toHaveBeenCalledWith(datos.ideGenerica1);
    expect(tramiteStoreMock.setObservaciones).toHaveBeenCalledWith(datos.observaciones);
    expect(tramiteStoreMock.setEstablecimientoRFCResponsableSanitario).toHaveBeenCalledWith(datos.establecimientoRFCResponsableSanitario);
    expect(tramiteStoreMock.setEstablecimientoRazonSocial).toHaveBeenCalledWith(datos.establecimientoRazonSocial);
    expect(tramiteStoreMock.setEstablecimientoEstados).toHaveBeenCalledWith(datos.establecimientoEstados);
    expect(tramiteStoreMock.setDescripcionMunicipio).toHaveBeenCalledWith(datos.descripcionMunicipio);
    expect(tramiteStoreMock.setLocalidad).toHaveBeenCalledWith(datos.localidad);
    expect(tramiteStoreMock.setColonias).toHaveBeenCalledWith(datos.colonias);
    expect(tramiteStoreMock.setCalle).toHaveBeenCalledWith(datos.calle);
    expect(tramiteStoreMock.setLada).toHaveBeenCalledWith(datos.lada);
    expect(tramiteStoreMock.setTelefono).toHaveBeenCalledWith(datos.telefono);
    expect(tramiteStoreMock.setScian).toHaveBeenCalledWith(datos.scian);
    expect(tramiteStoreMock.setEstablishomentoColonias).toHaveBeenCalledWith(datos.establishomentoColonias);
    expect(tramiteStoreMock.setNoLicenciaSanitaria).toHaveBeenCalledWith(datos.noLicenciaSanitaria);
    expect(tramiteStoreMock.setAvisoCheckbox).toHaveBeenCalledWith(datos.avisoCheckbox);
    expect(tramiteStoreMock.setLicenciaSanitaria).toHaveBeenCalledWith(datos.licenciaSanitaria);
    expect(tramiteStoreMock.setRegimen).toHaveBeenCalledWith(datos.regimen);
    expect(tramiteStoreMock.setAduanasEntradas).toHaveBeenCalledWith(datos.aduanasEntradas);
    expect(tramiteStoreMock.setDescripcionScian).toHaveBeenCalledWith(datos.descripcionScian);
    expect(tramiteStoreMock.setRepresentanteApellidos).toHaveBeenCalledWith(datos.apellidoMaterno, datos.apellidoPaterno);
  });

  it('debería actualizar el formulario llamando los métodos del store de datos', () => {
    const datos = {
      representanteRfc: 'RFC',
      representanteNombre: 'Nombre',
      apellidoPaterno: 'Paterno',
      apellidoMaterno: 'Materno'
    };
    service.actualizarFormulario(datos as any);
    expect(tramiteStoreDataMock.setRepresentanteRfc).toHaveBeenCalledWith(datos.representanteRfc);
    expect(tramiteStoreDataMock.setRepresentanteNombre).toHaveBeenCalledWith(datos.representanteNombre);
    expect(tramiteStoreDataMock.setRepresentanteApellidos).toHaveBeenCalledWith(datos.apellidoPaterno, datos.apellidoMaterno);
  });
});