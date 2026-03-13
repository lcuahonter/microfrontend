import { Solicitud260401Service } from './service260401.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import {
  DatosDelSolicituteSeccionState,
  DatosDelSolicituteSeccionStateStore
} from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import {
  PermisoImportacionBiologicaState,
  PermisoImportacionBiologicaStore
} from '../../../shared/estados/permiso-importacion-biologica.store';
import { DatosDelSolicituteSeccionQuery } from '../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { TercerosRelacionadosQuery } from '../../../shared/estados/queries/terceros-relacionados.query';
import { PermisoImportacionBiologicaQuery } from '../../../shared/estados/permiso-importacion-biologica.query';
import { HttpCoreService } from '@libs/shared/data-access-user/src';


jest.mock('@angular/common/http');

describe('Solicitud260401Service', () => {
  let service: Solicitud260401Service;
  let httpMock: jest.Mocked<HttpClient>;
  let datosStoreMock: jest.Mocked<DatosDelSolicituteSeccionStateStore>;
  let permisoStoreMock: jest.Mocked<PermisoImportacionBiologicaStore>;
  let datosQueryMock: jest.Mocked<DatosDelSolicituteSeccionQuery>;
  let relacionadosQueryMock: jest.Mocked<TercerosRelacionadosQuery>;
  let pagoDerechosQueryMock: jest.Mocked<PermisoImportacionBiologicaQuery>;
  let httpCoreServiceMock: jest.Mocked<HttpCoreService>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    } as any;

    datosStoreMock = {
      setEstablecimientoDenominacionRazonSocial: jest.fn(),
      setEstablecimientoCorreoElectronico: jest.fn(),
      setEstablecimientoDomicilioCodigoPostal: jest.fn(),
      setEstablecimientoDomicilioEstado: jest.fn(),
      setEstablecimientoMunicipioYAlcaldia: jest.fn(),
      setEstablecimientoDomicilioLocalidad: jest.fn(),
      setEstablecimientoDomicilioColonia: jest.fn(),
      setEstablecimientoDomicilioCalle: jest.fn(),
      setEstablecimientoDomicilioLada: jest.fn(),
      setEstablecimientoDomicilioTelefono: jest.fn(),
      setRfcDelProfesionalResponsable: jest.fn(),
      setNombreDelProfesionalResponsable: jest.fn(),
      setRepresentanteRfc: jest.fn(),
      setRepresentanteNombre: jest.fn(),
      setRepresentanteApellidos: jest.fn(),
      setInformacionConfidencial: jest.fn(),
      setAduanaDeSalida: jest.fn(),
      setRegimenAlQueSeDestinaraLaMercancía: jest.fn(),
      setNoDeLicenciaSanitariaObservaciones: jest.fn(),
      setNoDeLicenciaSanitaria: jest.fn()
    } as any;

    permisoStoreMock = {
      setClaveDeReferncia: jest.fn(),
      setCadenaDeLaDependencia: jest.fn(),
      setLlaveDePago: jest.fn(),
      setFechaDePago: jest.fn(),
      setImporteDePago: jest.fn(),
      setBanco: jest.fn()
    } as any;
    datosQueryMock = {} as any;
    relacionadosQueryMock = {} as any;
    pagoDerechosQueryMock = {} as any;
    httpCoreServiceMock = {} as any;

    service = new Solicitud260401Service(
      httpMock,
      datosStoreMock,
      permisoStoreMock,
      datosQueryMock,
      relacionadosQueryMock,
      pagoDerechosQueryMock,
      httpCoreServiceMock
    );
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('actualizarEstadoFormulario', () => {
    it('debe llamar a todos los setters en tramite260401Store con los valores correctos', () => {
      const datos: DatosDelSolicituteSeccionState = {
        establecimientoDenominacionRazonSocial: 'razon',
        establecimientoCorreoElectronico: 'correo',
        establecimientoDomicilioCodigoPostal: 'cp',
        establecimientoDomicilioEstado: 'estado',
        establecimientoMunicipioYAlcaldia: 'municipio',
        establecimientoDomicilioLocalidad: 'localidad',
        establecimientoDomicilioColonia: 'colonia',
        establecimientoDomicilioCalle: 'calle',
        establecimientoDomicilioLada: 'lada',
        establecimientoDomicilioTelefono: 'telefono',
        rfcDelProfesionalResponsable: 'rfc',
        nombreDelProfesionalResponsable: 'nombre',
        representanteRfc: 'reprfc',
        representanteNombre: 'repnombre',
        apellidoMaterno: 'materno',
        apellidoPaterno: 'paterno',
        informacionConfidencialRadio: true,
        aduanaDeSalida: 'aduana',
        regimenAlQueSeDestinaraLaMercancía: 'regimen',
        noDeLicenciaSanitariaObservaciones: 'obs',
        noDeLicenciaSanitaria: 'lic'
      } as any;

      service.actualizarEstadoFormulario(datos);

      expect(datosStoreMock.setEstablecimientoDenominacionRazonSocial).toHaveBeenCalledWith('razon');
      expect(datosStoreMock.setEstablecimientoCorreoElectronico).toHaveBeenCalledWith('correo');
      expect(datosStoreMock.setEstablecimientoDomicilioCodigoPostal).toHaveBeenCalledWith('cp');
      expect(datosStoreMock.setEstablecimientoDomicilioEstado).toHaveBeenCalledWith('estado');
      expect(datosStoreMock.setEstablecimientoMunicipioYAlcaldia).toHaveBeenCalledWith('municipio');
      expect(datosStoreMock.setEstablecimientoDomicilioLocalidad).toHaveBeenCalledWith('localidad');
      expect(datosStoreMock.setEstablecimientoDomicilioColonia).toHaveBeenCalledWith('colonia');
      expect(datosStoreMock.setEstablecimientoDomicilioCalle).toHaveBeenCalledWith('calle');
      expect(datosStoreMock.setEstablecimientoDomicilioLada).toHaveBeenCalledWith('lada');
      expect(datosStoreMock.setEstablecimientoDomicilioTelefono).toHaveBeenCalledWith('telefono');
      expect(datosStoreMock.setRfcDelProfesionalResponsable).toHaveBeenCalledWith('rfc');
      expect(datosStoreMock.setNombreDelProfesionalResponsable).toHaveBeenCalledWith('nombre');
      expect(datosStoreMock.setRepresentanteRfc).toHaveBeenCalledWith('reprfc');
      expect(datosStoreMock.setRepresentanteNombre).toHaveBeenCalledWith('repnombre');
      expect(datosStoreMock.setRepresentanteApellidos).toHaveBeenCalledWith('materno', 'paterno');
      expect(datosStoreMock.setInformacionConfidencial).toHaveBeenCalledWith(true);
      expect(datosStoreMock.setAduanaDeSalida).toHaveBeenCalledWith('aduana');
      expect(datosStoreMock.setRegimenAlQueSeDestinaraLaMercancía).toHaveBeenCalledWith('regimen');
      expect(datosStoreMock.setNoDeLicenciaSanitariaObservaciones).toHaveBeenCalledWith('obs');
      expect(datosStoreMock.setNoDeLicenciaSanitaria).toHaveBeenCalledWith('lic');
    });
  });

  describe('actualizarPagoDerechosFormulario', () => {
    it('debe llamar a todos los setters en tramite260401 con los valores correctos y setBanco si existe', () => {
      const datos: PermisoImportacionBiologicaState = {
        setClaveDeReferncia: 'clave',
        setCadenaDeLaDependencia: 'cadena',
        setLlaveDePago: 'llave',
        setFechaDePago: 'fecha',
        setImporteDePago: 123,
        setBanco: 'banco'
      } as any;

      service.actualizarPagoDerechosFormulario(datos);

      expect(permisoStoreMock.setClaveDeReferncia).toHaveBeenCalledWith('clave');
      expect(permisoStoreMock.setCadenaDeLaDependencia).toHaveBeenCalledWith('cadena');
      expect(permisoStoreMock.setLlaveDePago).toHaveBeenCalledWith('llave');
      expect(permisoStoreMock.setFechaDePago).toHaveBeenCalledWith('fecha');
      expect(permisoStoreMock.setImporteDePago).toHaveBeenCalledWith(123);
      expect(permisoStoreMock.setBanco).toHaveBeenCalledWith('banco');
    });

    it('no debe llamar a setBanco si setBanco es falsy', () => {
      const datos: PermisoImportacionBiologicaState = {
        setClaveDeReferncia: 'clave',
        setCadenaDeLaDependencia: 'cadena',
        setLlaveDePago: 'llave',
        setFechaDePago: 'fecha',
        setImporteDePago: 123,
        setBanco: undefined
      } as any;

      service.actualizarPagoDerechosFormulario(datos);

      expect(permisoStoreMock.setBanco).not.toHaveBeenCalled();
    });
  });

  describe('getRegistroTomaMuestrasMercanciasData', () => {
    it('debe llamar a http.get con la URL correcta y retornar su observable', done => {
      const mockResponse: DatosDelSolicituteSeccionState = { foo: 'bar' } as any;
      httpMock.get.mockReturnValue(of(mockResponse));

      service.getRegistroTomaMuestrasMercanciasData().subscribe(res => {
        expect(res).toEqual(mockResponse);
        expect(httpMock.get).toHaveBeenCalledWith('assets/json/260401/territorio-nacional-solicitud.json');
        done();
      });
    });
  });

  describe('getPagoDerechos', () => {
    it('debe llamar a http.get con la URL correcta y retornar su observable', done => {
      const mockResponse: PermisoImportacionBiologicaState = { foo: 'bar' } as any;
      httpMock.get.mockReturnValue(of(mockResponse));

      service.getPagoDerechos().subscribe(res => {
        expect(res).toEqual(mockResponse);
        expect(httpMock.get).toHaveBeenCalledWith('assets/json/260401/pagoDerechos.json');
        done();
      });
    });
  });
});