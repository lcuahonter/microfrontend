import { TestBed } from '@angular/core/testing';
import { CertificadosLicenciasService } from './certificados-licencias.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';
import { Tramite260701Store } from '../estados/tramites/tramite260701.store';
import type { Solicitud260701State } from '../estados/tramites/tramite260701.store';

jest.mock('@libs/shared/data-access-user/src/enviroments/enviroment', () => ({
  ENVIRONMENT: { URL_SERVER_JSON_AUXILIAR: 'http://mockserver' },
}));

describe('CertificadosLicenciasService', () => {
  let service: CertificadosLicenciasService;
  let httpMock: jest.Mocked<HttpClient>;
  let storeMock: jest.Mocked<Tramite260701Store>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
    } as any;

    storeMock = {
      setDenominacionORazonSocial: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setMunicipio: jest.fn(),
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
      setNumeroPermiso: jest.fn(),
      setClaveScianModal: jest.fn(),
      setClaveDescripcionModal: jest.fn(),
      setClasificacion: jest.fn(),
      setEspecificarClasificacionProducto: jest.fn(),
      setDenominacionEspecifica: jest.fn(),
      setDenominacionDistintiva: jest.fn(),
      setDenominacionComun: jest.fn(),
      setTipoDeProducto: jest.fn(),
      setEstadoFisico: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setDescripcionFraccion: jest.fn(),
      setCantidadUMT: jest.fn(),
      setUMT: jest.fn(),
      setCantidadUMC: jest.fn(),
      setUMC: jest.fn(),
      setPresentacion: jest.fn(),
      setNumeroRegistro: jest.fn(),
      setFechaCaducidad: jest.fn(),
      setClaveDeLosLotes: jest.fn(),
      setCumplimiento: jest.fn(),
      setClaveDeReferencia: jest.fn(),
      setCadenaDependencia: jest.fn(),
      setBanco: jest.fn(),
      setLlaveDePago: jest.fn(),        
      setFechaPago: jest.fn(),          
      setImportePago: jest.fn(),        
      setRfc: jest.fn(),                
      setNombre: jest.fn(),           
      setApellidoPaterno: jest.fn(),    
      setApellidoMaterno: jest.fn(),    
      setDenominacionSocial: jest.fn(), 
      setTerceroNombre: jest.fn(),      
      setPrimerApellido: jest.fn(),     
      setNacional: jest.fn(),          
      setExtranjero: jest.fn(),         
      setTipoPersona: jest.fn(),        
      setTercerosRelacionadosRfc: jest.fn(), 
      setCurp: jest.fn(),               
      setRazonSocial: jest.fn(),        
      setPais: jest.fn(),               
      setTercerosRelacionadosEstado: jest.fn(), 
      setTercerosRelacionadosMunicipio: jest.fn(), 
      setTercerosRelacionadosLocalidad: jest.fn(), 
      setTercerosRelacionadosColonia: jest.fn(), 
      setTercerosRelacionadosCalle: jest.fn(), 
      setTercerosRelacionadosCodigoPostal: jest.fn(), 
      setNumeroExterior: jest.fn(),     
      setNumeroInterior: jest.fn(),     
      setTercerosRelacionadosLada: jest.fn(), 
      setTercerosRelacionadosTelefono: jest.fn(), 
      setTercerosRelacionadosCorreoElectronico: jest.fn(), 
      setTipoOperacion: jest.fn(),      
      setJustificacion: jest.fn(),     
      setMuncipio: jest.fn(),           
    } as any;

    service = new CertificadosLicenciasService(httpMock, storeMock);
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería tener urlServer desde ENVIRONMENT', () => {
    expect(service.urlServer).toBe('http://mockserver');
  });

  describe('obtenerTramite', () => {
    it('debería llamar a http.get con la url correcta', (done) => {
      const mock = { data: 'ok' } as JSONResponse;
      httpMock.get.mockReturnValue(of(mock));
      service.obtenerTramite(123).subscribe((res) => {
        expect(httpMock.get).toHaveBeenCalledWith('http://mockserver/123');
        expect(res).toBe(mock);
        done();
      });
    });

    it('debería manejar el error de http', (done) => {
      httpMock.get.mockReturnValue(throwError(() => new Error('fail')));
      service.obtenerTramite(1).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(Error);
          done();
        },
      });
    });
  });

  it('getBancoDatos debería llamar a http.get con la ruta correcta', (done) => {
    const mock = { data: [] } as JSONResponse;
    httpMock.get.mockReturnValue(of(mock));
    service.getBancoDatos().subscribe((res) => {
      expect(httpMock.get).toHaveBeenCalledWith(
        './assets/json/260701/banco-catalog.json'
      );
      expect(res).toBe(mock);
      done();
    });
  });

  it('getTramitesAsociados debería llamar a http.get con la ruta correcta', (done) => {
    const mock = { data: [] } as JSONResponse;
    httpMock.get.mockReturnValue(of(mock));
    service.getTramitesAsociados().subscribe((res) => {
      expect(httpMock.get).toHaveBeenCalledWith(
        './assets/json/260701/tramites-asociados-tabla.json'
      );
      expect(res).toBe(mock);
      done();
    });
  });

  it('getDestinatarioDatos debería llamar a http.get con la ruta correcta', (done) => {
    const mock = { data: [] } as JSONResponse;
    httpMock.get.mockReturnValue(of(mock));
    service.getDestinatarioDatos().subscribe((res) => {
      expect(httpMock.get).toHaveBeenCalledWith(
        './assets/json/260701/destinatario-tabla.json'
      );
      expect(res).toBe(mock);
      done();
    });
  });

  it('getFabricanteDatos debería llamar a http.get con la ruta correcta', (done) => {
    const mock = { data: [] } as JSONResponse;
    httpMock.get.mockReturnValue(of(mock));
    service.getFabricanteDatos().subscribe((res) => {
      expect(httpMock.get).toHaveBeenCalledWith(
        './assets/json/260701/fabricante-tabla.json'
      );
      expect(res).toBe(mock);
      done();
    });
  });

  it('getEstadoCatalogo debería llamar a http.get con la ruta correcta', (done) => {
    const mock = { data: [] } as JSONResponse;
    httpMock.get.mockReturnValue(of(mock));
    service.getEstadoCatalogo().subscribe((res) => {
      expect(httpMock.get).toHaveBeenCalledWith(
        './assets/json/260701/estado-catalog.json'
      );
      expect(res).toBe(mock);
      done();
    });
  });

  it('getScianTablaDatos debería llamar a http.get con la ruta correcta', (done) => {
    const mock = { data: [] } as JSONResponse;
    httpMock.get.mockReturnValue(of(mock));
    service.getScianTablaDatos().subscribe((res) => {
      expect(httpMock.get).toHaveBeenCalledWith(
        './assets/json/260701/scian-tabla.json'
      );
      expect(res).toBe(mock);
      done();
    });
  });

  it('getMercanciasTablaDatos debería llamar a http.get con la ruta correcta', (done) => {
    const mock = { data: [] } as JSONResponse;
    httpMock.get.mockReturnValue(of(mock));
    service.getMercanciasTablaDatos().subscribe((res) => {
      expect(httpMock.get).toHaveBeenCalledWith(
        './assets/json/260701/mercancias-tabla.json'
      );
      expect(res).toBe(mock);
      done();
    });
  });

  it('getListaClaveTablaDatos debería llamar a http.get con la ruta correcta', (done) => {
    const mock = { data: [] } as JSONResponse;
    httpMock.get.mockReturnValue(of(mock));
    service.getListaClaveTablaDatos().subscribe((res) => {
      expect(httpMock.get).toHaveBeenCalledWith(
        './assets/json/260701/lista-claves.json'
      );
      expect(res).toBe(mock);
      done();
    });
  });

  it('getConsultaDatos debería llamar a http.get con la ruta correcta', (done) => {
    const mock = { foo: 'bar' } as unknown as Solicitud260701State;
    httpMock.get.mockReturnValue(of(mock));
    service.getConsultaDatos().subscribe((res) => {
      expect(httpMock.get).toHaveBeenCalledWith(
        './assets/json/260701/consulta-datos.json'
      );
      expect(res).toBe(mock);
      done();
    });
  });

  it('getBancoDatos debería manejar el error de http', (done) => {
    httpMock.get.mockReturnValue(throwError(() => new Error('fail')));
    service.getBancoDatos().subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        done();
      },
    });
  });

  it('getTramitesAsociados debería manejar el error de http', (done) => {
    httpMock.get.mockReturnValue(throwError(() => new Error('fail')));
    service.getTramitesAsociados().subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        done();
      },
    });
  });

  it('getDestinatarioDatos debería manejar el error de http', (done) => {
    httpMock.get.mockReturnValue(throwError(() => new Error('fail')));
    service.getDestinatarioDatos().subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        done();
      },
    });
  });

  it('getFabricanteDatos debería manejar el error de http', (done) => {
    httpMock.get.mockReturnValue(throwError(() => new Error('fail')));
    service.getFabricanteDatos().subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        done();
      },
    });
  });

  it('actualizarEstadoFormulario debería llamar a todos los setters del store con los datos correctos', () => {
    const datos: any = {
      denominacionORazonSocial: 'a',
      correoElectronico: 'b',
      codigoPostal: 'c',
      estado: 'd',
      municipio: 'e',
      localidad: 'f',
      colonia: 'g',
      calle: 'h',
      lada: 'i',
      telefono: 'j',
      avisoCheckbox: true,
      licenciaSanitaria: 'k',
      marcarEnCasoDeQueSea: 'l',
      regimen: 'm',
      aduanasEntradas: 'n',
      numeroPermiso: 'o',
      claveScianModal: 'p',
      claveDescripcionModal: 'q',
      clasificacion: 'r',
      especificarClasificacionProducto: 's',
      denominacionEspecifica: 't',
      denominacionDistintiva: 'u',
      denominacionComun: 'v',
      tipoDeProducto: 'w',
      estadoFisico: 'x',
      fraccionArancelaria: 'y',
      descripcionFraccion: 'z',
      cantidadUMT: 1,
      UMT: 'aa',
      cantidadUMC: 2,
      UMC: 'bb',
      presentacion: 'cc',
      numeroRegistro: 'dd',
      fechaCaducidad: 'ee',
      claveDeLosLotes: 'ff',
      cumplimiento: 'gg',
      claveDeReferencia: 'hh',
      cadenaDependencia: 'ii',
      banco: 'jj',
      llaveDePago: 'kk',
      fechaPago: 'll',
      importePago: 123,
      rfc: 'mm',
      nombre: 'nn',
      apellidoPaterno: 'oo',
      apellidoMaterno: 'pp',
      denominacionSocial: 'qq',
      terceroNombre: 'rr',
      primerApellido: 'ss',
      nacional: true,
      extranjero: false,
      tipoPersona: 'tt',
      tercerosRelacionadosRfc: 'uu',
      curp: 'vv',
      razonSocial: 'ww',
      pais: 'xx',
      tercerosRelacionadosEstado: 'yy',
      tercerosRelacionadosMunicipio: 'zz',
      tercerosRelacionadosLocalidad: 'aaa',
      tercerosRelacionadosColonia: 'bbb',
      tercerosRelacionadosCalle: 'ccc',
      tercerosRelacionadosCodigoPostal: 'ddd',
      numeroExterior: 'eee',
      numeroInterior: 'fff',
      tercerosRelacionadosLada: 'ggg',
      tercerosRelacionadosTelefono: 'hhh',
      tercerosRelacionadosCorreoElectronico: 'iii',
      tipoOperacion: 'kkk',
      justificacion: 'lll',
      muncipio: 'mmm', 
    };
    service.actualizarEstadoFormulario(datos);
    expect(storeMock.setDenominacionORazonSocial).toHaveBeenCalledWith('a');
    expect(storeMock.setCorreoElectronico).toHaveBeenCalledWith('b');
    expect(storeMock.setCodigoPostal).toHaveBeenCalledWith('c');
    expect(storeMock.setEstado).toHaveBeenCalledWith('d');
    expect(storeMock.setMunicipio).toHaveBeenCalledWith('e');
    expect(storeMock.setLocalidad).toHaveBeenCalledWith('f');
    expect(storeMock.setColonia).toHaveBeenCalledWith('g');
    expect(storeMock.setCalle).toHaveBeenCalledWith('h');
    expect(storeMock.setLada).toHaveBeenCalledWith('i');
    expect(storeMock.setTelefono).toHaveBeenCalledWith('j');
    expect(storeMock.setAvisoCheckbox).toHaveBeenCalledWith(true);
    expect(storeMock.setLicenciaSanitaria).toHaveBeenCalledWith('k');
    expect(storeMock.setMarcarEnCasoDeQueSea).toHaveBeenCalledWith('l');
    expect(storeMock.setRegimen).toHaveBeenCalledWith('m');
    expect(storeMock.setAduanasEntradas).toHaveBeenCalledWith('n');
    expect(storeMock.setNumeroPermiso).toHaveBeenCalledWith('o');
    expect(storeMock.setClaveScianModal).toHaveBeenCalledWith('p');
    expect(storeMock.setClaveDescripcionModal).toHaveBeenCalledWith('q');
    expect(storeMock.setClasificacion).toHaveBeenCalledWith('r');
    expect(storeMock.setEspecificarClasificacionProducto).toHaveBeenCalledWith('s');
    expect(storeMock.setDenominacionEspecifica).toHaveBeenCalledWith('t');
    expect(storeMock.setDenominacionDistintiva).toHaveBeenCalledWith('u');
    expect(storeMock.setDenominacionComun).toHaveBeenCalledWith('v');
    expect(storeMock.setTipoDeProducto).toHaveBeenCalledWith('w');
    expect(storeMock.setEstadoFisico).toHaveBeenCalledWith('x');
    expect(storeMock.setFraccionArancelaria).toHaveBeenCalledWith('y');
    expect(storeMock.setDescripcionFraccion).toHaveBeenCalledWith('z');
    expect(storeMock.setCantidadUMT).toHaveBeenCalledWith(1);
    expect(storeMock.setUMT).toHaveBeenCalledWith('aa');
    expect(storeMock.setCantidadUMC).toHaveBeenCalledWith(2);
    expect(storeMock.setUMC).toHaveBeenCalledWith('bb');
    expect(storeMock.setPresentacion).toHaveBeenCalledWith('cc');
    expect(storeMock.setNumeroRegistro).toHaveBeenCalledWith('dd');
    expect(storeMock.setFechaCaducidad).toHaveBeenCalledWith('ee');
    expect(storeMock.setClaveDeLosLotes).toHaveBeenCalledWith('ff');
    expect(storeMock.setCumplimiento).toHaveBeenCalledWith('gg');
    expect(storeMock.setClaveDeReferencia).toHaveBeenCalledWith('hh');
    expect(storeMock.setCadenaDependencia).toHaveBeenCalledWith('ii');
    expect(storeMock.setBanco).toHaveBeenCalledWith('jj');
  });
});

export interface JSONResponse {
  data?: any;
  [key: string]: any;
}
