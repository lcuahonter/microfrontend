import { TestBed } from '@angular/core/testing';
import { ModificacionPermisoSanitario } from './modificacion-permiso-sanitario.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ModificacionPermisoSanitario', () => {
  let service: ModificacionPermisoSanitario;
  let httpMock: any;
  let tramiteStoreMock: any;
  let tramite260402Mock: any;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    };

    tramiteStoreMock = {
      setIdeGenerica: jest.fn(),
      setEstablecimientoRFCResponsableSanitario: jest.fn(),
      setEstablecimientoRazonSocial: jest.fn(),
      setEstablecimientoCorreoElectronico: jest.fn(),
      setEstablecimientoDomicilioCodigoPostal: jest.fn(),
      setEstablecimientoEstados: jest.fn(),
      setDescripcionMunicipio: jest.fn(),
      setLocalidad: jest.fn(),
      setEstablishomentoColonias: jest.fn(),
      setCalle: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setRfcDelProfesionalResponsable: jest.fn(),
      setNombreDelProfesionalResponsable: jest.fn(),
      setRepresentanteRfc: jest.fn(),
      setRepresentanteNombre: jest.fn(),
      setRepresentanteApellidos: jest.fn(),
      setInformacionConfidencial: jest.fn(),
      setAduanasEntradas: jest.fn(),
      setRegimen: jest.fn(),
      setNoDeLicenciaSanitariaObservaciones: jest.fn(),
      setNoLicenciaSanitaria: jest.fn(),
      setManifests: jest.fn()
    };

    tramite260402Mock = {
      setClaveDeReferncia: jest.fn(),
      setCadenaDeLaDependencia: jest.fn(),
      setLlaveDePago: jest.fn(),
      setFechaDePago: jest.fn(),
      setImporteDePago: jest.fn(),
      setBanco: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpMock }
      ]
    });

    service = new ModificacionPermisoSanitario(
      httpMock as any,
      tramiteStoreMock as any,
      tramite260402Mock as any
    );
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería actualizar el estado del formulario llamando todos los métodos del store', () => {
    const datos = {
      ideGenerica: 1,
      establecimientoRFCResponsableSanitario: 'RFC',
      establecimientoRazonSocial: 'Razon',
      establecimientoCorreoElectronico: 'correo@mail.com',
      establecimientoDomicilioCodigoPostal: '12345',
      establecimientoEstados: 'Estado',
      descripcionMunicipio: 'Municipio',
      localidad: 'Localidad',
      establishomentoColonias: 'Colonia',
      calle: 'Calle',
      lada: '33',
      telefono: '1234567',
      rfcDelProfesionalResponsable: 'RFCRESP',
      nombreDelProfesionalResponsable: 'Nombre Resp',
      representanteRfc: 'RFCR',
      representanteNombre: 'Nombre Rep',
      apellidoMaterno: 'Materno',
      apellidoPaterno: 'Paterno',
      informacionConfidencialRadio: true,
      aduanasEntradas: 'Aduana',
      regimen: 'Regimen',
      noDeLicenciaSanitariaObservaciones: 'Obs',
      noLicenciaSanitaria: 'Licencia',
      manifests: []
    };
    service.actualizarEstadoFormulario(datos as any);

    expect(tramiteStoreMock.setIdeGenerica).toHaveBeenCalledWith(datos.ideGenerica);
    expect(tramiteStoreMock.setEstablecimientoRFCResponsableSanitario).toHaveBeenCalledWith(datos.establecimientoRFCResponsableSanitario);
    expect(tramiteStoreMock.setEstablecimientoRazonSocial).toHaveBeenCalledWith(datos.establecimientoRazonSocial);
    expect(tramiteStoreMock.setEstablecimientoCorreoElectronico).toHaveBeenCalledWith(datos.establecimientoCorreoElectronico);
    expect(tramiteStoreMock.setEstablecimientoDomicilioCodigoPostal).toHaveBeenCalledWith(datos.establecimientoDomicilioCodigoPostal);
    expect(tramiteStoreMock.setEstablecimientoEstados).toHaveBeenCalledWith(datos.establecimientoEstados);
    expect(tramiteStoreMock.setDescripcionMunicipio).toHaveBeenCalledWith(datos.descripcionMunicipio);
    expect(tramiteStoreMock.setLocalidad).toHaveBeenCalledWith(datos.localidad);
    expect(tramiteStoreMock.setEstablishomentoColonias).toHaveBeenCalledWith(datos.establishomentoColonias);
    expect(tramiteStoreMock.setCalle).toHaveBeenCalledWith(datos.calle);
    expect(tramiteStoreMock.setLada).toHaveBeenCalledWith(datos.lada);
    expect(tramiteStoreMock.setTelefono).toHaveBeenCalledWith(datos.telefono);
    expect(tramiteStoreMock.setRfcDelProfesionalResponsable).toHaveBeenCalledWith(datos.rfcDelProfesionalResponsable);
    expect(tramiteStoreMock.setNombreDelProfesionalResponsable).toHaveBeenCalledWith(datos.nombreDelProfesionalResponsable);
    expect(tramiteStoreMock.setRepresentanteRfc).toHaveBeenCalledWith(datos.representanteRfc);
    expect(tramiteStoreMock.setRepresentanteNombre).toHaveBeenCalledWith(datos.representanteNombre);
    expect(tramiteStoreMock.setRepresentanteApellidos).toHaveBeenCalledWith(datos.apellidoMaterno, datos.apellidoPaterno);
    expect(tramiteStoreMock.setInformacionConfidencial).toHaveBeenCalledWith(datos.informacionConfidencialRadio);
    expect(tramiteStoreMock.setAduanasEntradas).toHaveBeenCalledWith(datos.aduanasEntradas);
    expect(tramiteStoreMock.setRegimen).toHaveBeenCalledWith(datos.regimen);
    expect(tramiteStoreMock.setNoDeLicenciaSanitariaObservaciones).toHaveBeenCalledWith(datos.noDeLicenciaSanitariaObservaciones);
    expect(tramiteStoreMock.setNoLicenciaSanitaria).toHaveBeenCalledWith(datos.noLicenciaSanitaria);
    expect(tramiteStoreMock.setManifests).toHaveBeenCalledWith(datos.manifests);
  });

  it('debería actualizar el pago de derechos y llamar los métodos del store', () => {
    const datos = {
      setClaveDeReferncia: 'clave',
      setCadenaDeLaDependencia: 'cadena',
      setLlaveDePago: 'llave',
      setFechaDePago: 'fecha',
      setImporteDePago: 100,
      setBanco: 'BANCO'
    };
    service.actualizarPagoDerechosFormulario(datos as any);

    expect(tramite260402Mock.setClaveDeReferncia).toHaveBeenCalledWith(datos.setClaveDeReferncia);
    expect(tramite260402Mock.setCadenaDeLaDependencia).toHaveBeenCalledWith(datos.setCadenaDeLaDependencia);
    expect(tramite260402Mock.setLlaveDePago).toHaveBeenCalledWith(datos.setLlaveDePago);
    expect(tramite260402Mock.setFechaDePago).toHaveBeenCalledWith(datos.setFechaDePago);
    expect(tramite260402Mock.setImporteDePago).toHaveBeenCalledWith(datos.setImporteDePago);
    expect(tramite260402Mock.setBanco).toHaveBeenCalledWith(datos.setBanco);
  });

  it('debería NO llamar setBanco si no existe setBanco en los datos', () => {
    const datos = {
      setClaveDeReferncia: 'clave',
      setCadenaDeLaDependencia: 'cadena',
      setLlaveDePago: 'llave',
      setFechaDePago: 'fecha',
      setImporteDePago: 100
      // setBanco no está definido
    };
    service.actualizarPagoDerechosFormulario(datos as any);

    expect(tramite260402Mock.setBanco).not.toHaveBeenCalled();
  });

  it('debería obtener los datos de registro de toma de muestras', () => {
    const mockResponse = { test: 'data' };
    httpMock.get.mockReturnValue(of(mockResponse));
    service.getRegistroTomaMuestrasMercanciasData().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260905/serviciosExtraordinarios.json');
  });

  it('debería obtener los datos de pago de derechos', () => {
    const mockResponse = { test: 'data' };
    httpMock.get.mockReturnValue(of(mockResponse));
    service.getPagoDerechos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260905/pagoDerechos.json');
  });
});