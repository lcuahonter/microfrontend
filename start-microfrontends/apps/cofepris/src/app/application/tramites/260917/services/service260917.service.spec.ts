import { Solocitud260917Service } from './service260917.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Tramite260917Store } from '../estados/tramites/tramite260917.store';
import { PagoDerechosStore } from '../../../shared/estados/stores/pago-de-derechos.store';

describe('Solocitud260917Service', () => {
  let service: Solocitud260917Service;
  let httpMock: any;
  let tramiteStoreMock: any;
  let pagoDerechosStoreMock: any;

  beforeEach(() => {
    httpMock = { get: jest.fn() };
    tramiteStoreMock = {
      setRFCResponsableSanitario: jest.fn(),
      setRazonSocial: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setMuncipio: jest.fn(),
      setLocalidad: jest.fn(),
      setColonia: jest.fn(),
      setCalle: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setAvisoCheckbox: jest.fn(),
      setLicenciaSanitaria: jest.fn(),
      setMarcarEnCasoDeQueSea: jest.fn(),
      setRegimen: jest.fn(),
      setAduanasEntradas: jest.fn(),
      setRFCRepresentante: jest.fn(),
      setRazonSocialRepresentante: jest.fn(),
      setApellidoPaternoRepresentante: jest.fn(),
      setApellidoMaternoRepresentante: jest.fn(),
      setAceptaPublicacion: jest.fn(),
      setTipoOperacion: jest.fn(),
      setJustificacion: jest.fn(),
      setAceptaManifiestos: jest.fn(),
    };
    pagoDerechosStoreMock = {
      setCadenaDependencia: jest.fn(),
      setClaveReferencia: jest.fn(),
      setllavePago: jest.fn(),
      setFechaPago: jest.fn(),
      setImportePago: jest.fn(),
      setBanco: jest.fn(),
      setEstado: jest.fn(),
    };

    service = new Solocitud260917Service(
      httpMock as any,
      tramiteStoreMock as any,
      pagoDerechosStoreMock as any
    );
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería exponer las URLs del entorno', () => {
    expect(service.urlServer).toBeDefined();
    expect(service.urlServerCatalogos).toBeDefined();
  });

  it('debería actualizar el estado del formulario correctamente', () => {
    const datos = {
      rfcResponsableSanitario: 'RFC',
      razonSocial: 'RS',
      correoElectronico: 'mail',
      codigoPostal: 'cp',
      estado: 'estado',
      muncipio: 'mun',
      localidad: 'loc',
      colonia: 'col',
      calle: 'calle',
      lada: 'lada',
      telefono: 'tel',
      avisoCheckbox: true,
      licenciaSanitaria: 'lic',
      marcarEnCasoDeQueSea: 'marcar',
      regimen: 'reg',
      aduanasEntradas: 'aduanas',
      rfcRepresentante: 'rfcRep',
      razonSocialRepresentante: 'rsRep',
      apellidoPaternoRepresentante: 'apRep',
      apellidoMaternoRepresentante: 'amRep',
      aceptaPublicacion: true,
      tipoOperacion: 'tipo',
      justificacion: 'just',
      aceptaManifiestos: true,
    };
    service.actualizarEstadoFormulario(datos as any);
    expect(tramiteStoreMock.setRFCResponsableSanitario).toHaveBeenCalledWith('RFC');
    expect(tramiteStoreMock.setRazonSocial).toHaveBeenCalledWith('RS');
    expect(tramiteStoreMock.setCorreoElectronico).toHaveBeenCalledWith('mail');
    expect(tramiteStoreMock.setCodigoPostal).toHaveBeenCalledWith('cp');
    expect(tramiteStoreMock.setEstado).toHaveBeenCalledWith('estado');
    expect(tramiteStoreMock.setMuncipio).toHaveBeenCalledWith('mun');
    expect(tramiteStoreMock.setLocalidad).toHaveBeenCalledWith('loc');
    expect(tramiteStoreMock.setColonia).toHaveBeenCalledWith('col');
    expect(tramiteStoreMock.setCalle).toHaveBeenCalledWith('calle');
    expect(tramiteStoreMock.setLada).toHaveBeenCalledWith('lada');
    expect(tramiteStoreMock.setTelefono).toHaveBeenCalledWith('tel');
    expect(tramiteStoreMock.setAvisoCheckbox).toHaveBeenCalledWith(true);
    expect(tramiteStoreMock.setLicenciaSanitaria).toHaveBeenCalledWith('lic');
    expect(tramiteStoreMock.setMarcarEnCasoDeQueSea).toHaveBeenCalledWith('marcar');
    expect(tramiteStoreMock.setRegimen).toHaveBeenCalledWith('reg');
    expect(tramiteStoreMock.setAduanasEntradas).toHaveBeenCalledWith('aduanas');
    expect(tramiteStoreMock.setRFCRepresentante).toHaveBeenCalledWith('rfcRep');
    expect(tramiteStoreMock.setRazonSocialRepresentante).toHaveBeenCalledWith('rsRep');
    expect(tramiteStoreMock.setApellidoPaternoRepresentante).toHaveBeenCalledWith('apRep');
    expect(tramiteStoreMock.setApellidoMaternoRepresentante).toHaveBeenCalledWith('amRep');
    expect(tramiteStoreMock.setAceptaPublicacion).toHaveBeenCalledWith(true);
    expect(tramiteStoreMock.setTipoOperacion).toHaveBeenCalledWith('tipo');
    expect(tramiteStoreMock.setJustificacion).toHaveBeenCalledWith('just');
    expect(tramiteStoreMock.setAceptaManifiestos).toHaveBeenCalledWith(true);
  });

  it('debería actualizar el pago de derechos correctamente', () => {
    const datos = {
      cadenaDependencia: 'cadena',
      claveReferencia: 'clave',
      llavePago: 'llave',
      fechaPago: 'fecha',
      importePago: 123,
      banco: 'banco',
      estado: 'edo',
    };
    service.actualizarPagoDerechosFormulario(datos as any);
    expect(pagoDerechosStoreMock.setCadenaDependencia).toHaveBeenCalledWith('cadena');
    expect(pagoDerechosStoreMock.setClaveReferencia).toHaveBeenCalledWith('clave');
    expect(pagoDerechosStoreMock.setllavePago).toHaveBeenCalledWith('llave');
    expect(pagoDerechosStoreMock.setFechaPago).toHaveBeenCalledWith('fecha');
    expect(pagoDerechosStoreMock.setImportePago).toHaveBeenCalledWith(123);
    expect(pagoDerechosStoreMock.setBanco).toHaveBeenCalledWith('banco');
    expect(pagoDerechosStoreMock.setEstado).toHaveBeenCalledWith('edo');
  });

  it('debería obtener los datos del registro de toma de muestras de mercancías', () => {
    const mockResponse = { test: 'ok' };
    httpMock.get.mockReturnValue(of(mockResponse));
    service.getRegistroTomaMuestrasMercanciasData().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260917/serviciosExtraordinarios.json');
  });

  it('debería obtener los datos de SCIAN', () => {
    const mockResponse = [{ id: 1 }];
    httpMock.get.mockReturnValue(of(mockResponse));
    service.getScianDatos().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260917/scianDatos.json');
  });

  it('debería obtener los datos de mercancías', () => {
    const mockResponse = [{ id: 2 }];
    httpMock.get.mockReturnValue(of(mockResponse));
    service.getMercanciasDatos().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260917/mercanciasInfo.json');
  });

  it('debería obtener los datos del pago de derechos', () => {
    const mockResponse = { pago: true };
    httpMock.get.mockReturnValue(of(mockResponse));
    service.getPagoDerechos().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260917/pagoDerechos.json');
  });
});