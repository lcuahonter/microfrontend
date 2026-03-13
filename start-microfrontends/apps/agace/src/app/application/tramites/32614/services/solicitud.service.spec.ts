import { TestBed } from '@angular/core/testing';
import { SolicitudService } from './solicitud.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError, Observable } from 'rxjs';
import { Solicitud32614Store } from '../estados/solicitud32614.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolicitudService', () => {
  let service: SolicitudService;
  let httpClientSpy: jest.Mocked<HttpClient>;
  let storeSpy: jest.Mocked<Solicitud32614Store>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(()=> of())
    } as any;

    storeSpy = {
      actualizar190: jest.fn(), actualizar191: jest.fn(), actualizar199: jest.fn(), actualizar2034: jest.fn(),
      actualizar236: jest.fn(), actualizar237: jest.fn(), actualizar238: jest.fn(), actualizar239: jest.fn(),
      actualizar240: jest.fn(), actualizar243: jest.fn(), actualizar244: jest.fn(), actualizar245: jest.fn(),
      actualizar246: jest.fn(), actualizar247: jest.fn(), actualizar248: jest.fn(), actualizar249: jest.fn(),
      actualizar250: jest.fn(), actualizar251: jest.fn(), actualizarIdPersonaSolicitud: jest.fn(),
      actualizarRfcTercero: jest.fn(), actualizarRfc: jest.fn(), actualizarNombre: jest.fn(),
      actualizarApellidoPaterno: jest.fn(), actualizarApellidoMaterno: jest.fn(),
      actualizarTelefono: jest.fn(), actualizarCorreoElectronico: jest.fn(),
      actualizarEnlaceRfcTercero: jest.fn(), actualizarEnlaceRfc: jest.fn(),
      actualizarEnlaceNombre: jest.fn(), actualizarEnlaceApellidoPaterno: jest.fn(),
      actualizarEnlaceApellidoMaterno: jest.fn(), actualizarEnlaceCiudadEstado: jest.fn(),
      actualizarEnlaceCargo: jest.fn(), actualizarEnlaceTelefono: jest.fn(),
      actualizarEnlaceCorreoElectronico: jest.fn(), actualizarEnlaceSuplente: jest.fn(),
      actualizar2089: jest.fn(), actualizar2090: jest.fn(), actualizar2091: jest.fn(), actualizar2042: jest.fn(),
      actualizar2043: jest.fn(), actualizar2044: jest.fn(), actualizarFechaInicioComercio: jest.fn(),
      actualizarFechaPago: jest.fn(), actualizarMonto: jest.fn(), actualizarOperacionesBancarias: jest.fn(),
      actualizarLlavePago: jest.fn(), actualizarTransportistaRFC: jest.fn(),
      actualizarTransportistaRFCModifTrans: jest.fn(), actualizarTransportistaRazonSocial: jest.fn(),
      actualizarTransportistaDomicilio: jest.fn(), actualizarTransportistaCaat: jest.fn(),
      actualizarTransportistaIdDomicilio: jest.fn(), actualizarTransportistaIdRFC: jest.fn(),
      actualizarTransportistaIdRazonSocial: jest.fn(), actualizarTransportistaIdCaat: jest.fn(),
      actualizarMiembroCaracterDe: jest.fn(), actualizarMiembroTributarMexico: jest.fn(),
      actualizarMiembroNacionalidad: jest.fn(), actualizarMiembroRFC: jest.fn(),
      actualizarMiembroRegistroFederal: jest.fn(), actualizarMiembroNombreCompleto: jest.fn(),
      actualizarMiembroTipoPersonaMuestra: jest.fn(), actualizarMiembroNombre: jest.fn(),
      actualizarMiembroApellidoPaterno: jest.fn(), actualizarMiembroApellidoMaterno: jest.fn(),
      actualizarMiembroNombreEmpresa: jest.fn(), actualizarSubcontrataRFCBusqueda: jest.fn(),
      actualizarSubcontrataRFC: jest.fn(), actualizarSubcontrataRazonSocial: jest.fn(),
      actualizarSubcontrataEmpleados: jest.fn(), actualizarSubcontrataBimestre: jest.fn(),
      actualizarPrincipales: jest.fn(), actualizarMunicipio: jest.fn(), actualizarTipoDeInstalacion: jest.fn(),
      actualizarEntidadFederativa: jest.fn(), actualizarRegistroSESAT: jest.fn(), actualizarDescripcion: jest.fn(),
      actualizarCodigoPostal: jest.fn(), actualizarProcesoProductivo: jest.fn(), actualizarGoceDelInmueble: jest.fn(),
      actualizarEmpresa: jest.fn(), actualizarComercioExterior: jest.fn(), actualizarMutuo: jest.fn(),
      actualizarCatseleccionados: jest.fn(), actualizarServicio: jest.fn(), actualizarEmpleados: jest.fn(),
      actualizarBimestre: jest.fn(), actualizarIndiqueTodos: jest.fn(), actualizarFile1: jest.fn(), actualizarFile2: jest.fn(),
      actualizarIdentificacion: jest.fn(), actualizarLugarDeRadicacion: jest.fn(), actualizarCheckbox1: jest.fn(),
      actualizarCheckbox2: jest.fn(), actualizarCheckbox3: jest.fn(), actualizarActualmente2: jest.fn(), actualizarActualmente1: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SolicitudService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Solicitud32614Store, useValue: storeSpy }
      ]
    });
    service = TestBed.inject(SolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('conseguirRecibirNotificaciones should call http.get with correct URL', (done) => {
    const mockData = [{ id: 1, nombre: 'Notificación' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirRecibirNotificaciones().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/32614/recibir-notificaciones.json');
      done();
    });
  });

  it('conseguirEnlaceOperativoDatos should call http.get with correct URL', (done) => {
    const mockData = [{ id: 1, nombre: 'Operativo' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirEnlaceOperativoDatos().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/32614/enlace-operativo-datos.json');
      done();
    });
  });

  it('conseguirRepresentanteLegalDatos should call http.get with correct URL', (done) => {
    const mockData = { id: 1, nombre: 'Legal' };
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirRepresentanteLegalDatos().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/32614/representante-legal-datos.json');
      done();
    });
  });

  it('conseguirOpcionDeRadio should call http.get with correct URL', (done) => {
    const mockData = { opciones: [] };
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirOpcionDeRadio().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/32614/solicitud-radio-lista.json');
      done();
    });
  });

  it('conseguirTransportistasLista should call http.get with correct URL', (done) => {
    const mockData = [{ id: 1, nombre: 'Transportista' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirTransportistasLista().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/32614/transportistas-lista.json');
      done();
    });
  });

  it('conseguirSolicitudCatologoSelectLista should call http.get with correct URL', (done) => {
    const mockData = { catalogos: [] };
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirSolicitudCatologoSelectLista().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/32614/solicitud-catologo-select-lista.json');
      done();
    });
  });

  it('conseguirSeccionSubcontratados should call http.get with correct URL', (done) => {
    const mockData = { subcontratados: [] };
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirSeccionSubcontratados().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/32614/seccion-subcontratados.json');
      done();
    });
  });

  it('conseguirInventarios should call http.get with correct URL', (done) => {
    const mockData = [{ id: 1, nombre: 'Inventario' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirInventarios().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/32614/inventarios-datos.json');
      done();
    });
  });

  it('guardarDatosFormulario should call http.get with correct URL', (done) => {
    const mockData = { idPersonaSolicitud: 1 };
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.guardarDatosFormulario().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/32614/guardar-datos-formulario.json');
      done();
    });
  });

  it('actualizarEstadoFormulario should call all store update methods with correct values', () => {
    const resp: any = {
      190: 'a', 191: 'b', 199: 'c', 2034: 'd', 236: 'e', 237: 'f', 238: 'g', 239: 'h',
      240: 'i', 243: 'j', 244: 'k', 245: 'l', 246: 'm', 247: 'n', 248: 'o', 249: 'p',
      250: 'q', 251: 'r', idPersonaSolicitud: 1, rfcTercero: 'rfcT', rfc: 'rfc',
      nombre: 'nombre', apellidoPaterno: 'ap', apellidoMaterno: 'am', telefono: 'tel',
      correoElectronico: 'correo', agregarEnlaceRfcTercero: 'ert', agregarEnlaceRfc: 'er',
      agregarEnlaceNombre: 'en', agregarEnlaceApellidoPaterno: 'eap', agregarEnlaceApellidoMaterno: 'eam',
      agregarEnlaceCiudadEstado: 'ece', agregarEnlaceCargo: 'ec', agregarEnlaceTelefono: 'et',
      agregarEnlaceCorreoElectronico: 'ece2', agregarEnlaceSuplente: 'es', 2089: 's2089',
      2090: 's2090', 2091: 's2091', 2042: 's2042', 2043: 's2043', 2044: 's2044',
      fechaInicioComercio: 'fic', fechaPago: 'fp', monto: 'monto', operacionesBancarias: 'ob',
      llavePago: 'lp', transportistaRFC: 'trfc', transportistaRFCModifTrans: 'trfcm',
      transportistaRazonSocial: 'trs', transportistaDomicilio: 'td', transportistaCaat: 'tc',
      transportistaIdDomicilio: 'tid', transportistaIdRFC: 'tir', transportistaIdRazonSocial: 'tirs',
      transportistaIdCaat: 'tic', miembroCaracterDe: 'mcd', miembroTributarMexico: 'mtm',
      miembroNacionalidad: 'mn', miembroRfc: 'mr', miembroRegistroFederal: 'mrf',
      miembroNombreCompleto: 'mnc', miembroTipoPersonaMuestra: 'mtpm', miembroNombre: 'mn2',
      miembroApellidoPaterno: 'map', miembroApellidoMaterno: 'mam', miembroNombreEmpresa: 'mne',
      subcontrataRFCBusqueda: 'srb', subcontrataRFC: 'sr', subcontrataRazonSocial: 'srs',
      subcontrataEmpleados: 'se', subcontrataBimestre: 'sb', principales: 'p', municipio: 'mun',
      tipoDeInstalacion: 'tdi', entidadFederativa: 'ef', registroSESAT: 'rs', descripcion: 'desc',
      codigoPostal: 'cp', procesoProductivo: 'pp', goceDelInmueble: 'gdi', empresa: 'emp',
      comercioExterior: 'ce', mutuo: 'mut', catseleccionados: 'cat', servicio: 'serv',
      empleados: 'emp2', bimestre: 'bim', indiqueTodos: 'it', file1: 'f1', file2: 'f2',
      identificacion: 'id', lugarDeRadicacion: 'lr', checkbox1: true, checkbox2: false,
      checkbox3: true, actualmente2: 'act2', actualmente1: 'act1'
    };
    service.actualizarEstadoFormulario(resp);
    expect(storeSpy.actualizar190).toHaveBeenCalledWith('a');
    expect(storeSpy.actualizar191).toHaveBeenCalledWith('b');
    expect(storeSpy.actualizar199).toHaveBeenCalledWith('c');
    expect(storeSpy.actualizar2034).toHaveBeenCalledWith('d');
    expect(storeSpy.actualizar236).toHaveBeenCalledWith('e');
    expect(storeSpy.actualizar237).toHaveBeenCalledWith('f');
    expect(storeSpy.actualizar238).toHaveBeenCalledWith('g');
    expect(storeSpy.actualizar239).toHaveBeenCalledWith('h');
    expect(storeSpy.actualizar240).toHaveBeenCalledWith('i');
    expect(storeSpy.actualizar243).toHaveBeenCalledWith('j');
    expect(storeSpy.actualizar244).toHaveBeenCalledWith('k');
    expect(storeSpy.actualizar245).toHaveBeenCalledWith('l');
    expect(storeSpy.actualizar246).toHaveBeenCalledWith('m');
    expect(storeSpy.actualizar247).toHaveBeenCalledWith('n');
    expect(storeSpy.actualizar248).toHaveBeenCalledWith('o');
    expect(storeSpy.actualizar249).toHaveBeenCalledWith('p');
    expect(storeSpy.actualizar250).toHaveBeenCalledWith('q');
    expect(storeSpy.actualizar251).toHaveBeenCalledWith('r');
    expect(storeSpy.actualizarIdPersonaSolicitud).toHaveBeenCalledWith(1);
    expect(storeSpy.actualizarRfcTercero).toHaveBeenCalledWith('rfcT');
    expect(storeSpy.actualizarRfc).toHaveBeenCalledWith('rfc');
    expect(storeSpy.actualizarNombre).toHaveBeenCalledWith('nombre');
    expect(storeSpy.actualizarApellidoPaterno).toHaveBeenCalledWith('ap');
    expect(storeSpy.actualizarApellidoMaterno).toHaveBeenCalledWith('am');
    expect(storeSpy.actualizarTelefono).toHaveBeenCalledWith('tel');
    expect(storeSpy.actualizarCorreoElectronico).toHaveBeenCalledWith('correo');
    expect(storeSpy.actualizarEnlaceRfcTercero).toHaveBeenCalledWith('ert');
    expect(storeSpy.actualizarEnlaceRfc).toHaveBeenCalledWith('er');
    expect(storeSpy.actualizarEnlaceNombre).toHaveBeenCalledWith('en');
    expect(storeSpy.actualizarEnlaceApellidoPaterno).toHaveBeenCalledWith('eap');
    expect(storeSpy.actualizarEnlaceApellidoMaterno).toHaveBeenCalledWith('eam');
    expect(storeSpy.actualizarEnlaceCiudadEstado).toHaveBeenCalledWith('ece');
    expect(storeSpy.actualizarEnlaceCargo).toHaveBeenCalledWith('ec');
    expect(storeSpy.actualizarEnlaceTelefono).toHaveBeenCalledWith('et');
    expect(storeSpy.actualizarEnlaceCorreoElectronico).toHaveBeenCalledWith('ece2');
    expect(storeSpy.actualizarEnlaceSuplente).toHaveBeenCalledWith('es');
    expect(storeSpy.actualizar2089).toHaveBeenCalledWith('s2089');
    expect(storeSpy.actualizar2090).toHaveBeenCalledWith('s2090');
    expect(storeSpy.actualizar2091).toHaveBeenCalledWith('s2091');
    expect(storeSpy.actualizar2042).toHaveBeenCalledWith('s2042');
    expect(storeSpy.actualizar2043).toHaveBeenCalledWith('s2043');
    expect(storeSpy.actualizar2044).toHaveBeenCalledWith('s2044');
    expect(storeSpy.actualizarFechaInicioComercio).toHaveBeenCalledWith('fic');
    expect(storeSpy.actualizarFechaPago).toHaveBeenCalledWith('fp');
    expect(storeSpy.actualizarMonto).toHaveBeenCalledWith('monto');
    expect(storeSpy.actualizarOperacionesBancarias).toHaveBeenCalledWith('ob');
    expect(storeSpy.actualizarLlavePago).toHaveBeenCalledWith('lp');
    expect(storeSpy.actualizarTransportistaRFC).toHaveBeenCalledWith('trfc');
    expect(storeSpy.actualizarTransportistaRFCModifTrans).toHaveBeenCalledWith('trfcm');
    expect(storeSpy.actualizarTransportistaRazonSocial).toHaveBeenCalledWith('trs');
    expect(storeSpy.actualizarTransportistaDomicilio).toHaveBeenCalledWith('td');
    expect(storeSpy.actualizarTransportistaCaat).toHaveBeenCalledWith('tc');
    expect(storeSpy.actualizarTransportistaIdDomicilio).toHaveBeenCalledWith('tid');
    expect(storeSpy.actualizarTransportistaIdRFC).toHaveBeenCalledWith('tir');
    expect(storeSpy.actualizarTransportistaIdRazonSocial).toHaveBeenCalledWith('tirs');
    expect(storeSpy.actualizarTransportistaIdCaat).toHaveBeenCalledWith('tic');
    expect(storeSpy.actualizarMiembroCaracterDe).toHaveBeenCalledWith('mcd');
    expect(storeSpy.actualizarMiembroTributarMexico).toHaveBeenCalledWith('mtm');
    expect(storeSpy.actualizarMiembroNacionalidad).toHaveBeenCalledWith('mn');
    expect(storeSpy.actualizarMiembroRFC).toHaveBeenCalledWith('mr');
    expect(storeSpy.actualizarMiembroRegistroFederal).toHaveBeenCalledWith('mrf');
    expect(storeSpy.actualizarMiembroNombreCompleto).toHaveBeenCalledWith('mnc');
    expect(storeSpy.actualizarMiembroTipoPersonaMuestra).toHaveBeenCalledWith('mtpm');
    expect(storeSpy.actualizarMiembroNombre).toHaveBeenCalledWith('mn2');
    expect(storeSpy.actualizarMiembroApellidoPaterno).toHaveBeenCalledWith('map');
    expect(storeSpy.actualizarMiembroApellidoMaterno).toHaveBeenCalledWith('mam');
    expect(storeSpy.actualizarMiembroNombreEmpresa).toHaveBeenCalledWith('mne');
    expect(storeSpy.actualizarSubcontrataRFCBusqueda).toHaveBeenCalledWith('srb');
    expect(storeSpy.actualizarSubcontrataRFC).toHaveBeenCalledWith('sr');
    expect(storeSpy.actualizarSubcontrataRazonSocial).toHaveBeenCalledWith('srs');
    expect(storeSpy.actualizarSubcontrataEmpleados).toHaveBeenCalledWith('se');
    expect(storeSpy.actualizarSubcontrataBimestre).toHaveBeenCalledWith('sb');
    expect(storeSpy.actualizarPrincipales).toHaveBeenCalledWith('p');
    expect(storeSpy.actualizarMunicipio).toHaveBeenCalledWith('mun');
    expect(storeSpy.actualizarTipoDeInstalacion).toHaveBeenCalledWith('tdi');
    expect(storeSpy.actualizarEntidadFederativa).toHaveBeenCalledWith('ef');
    expect(storeSpy.actualizarRegistroSESAT).toHaveBeenCalledWith('rs');
    expect(storeSpy.actualizarDescripcion).toHaveBeenCalledWith('desc');
    expect(storeSpy.actualizarCodigoPostal).toHaveBeenCalledWith('cp');
    expect(storeSpy.actualizarProcesoProductivo).toHaveBeenCalledWith('pp');
    expect(storeSpy.actualizarGoceDelInmueble).toHaveBeenCalledWith('gdi');
    expect(storeSpy.actualizarEmpresa).toHaveBeenCalledWith('emp');
    expect(storeSpy.actualizarComercioExterior).toHaveBeenCalledWith('ce');
    expect(storeSpy.actualizarMutuo).toHaveBeenCalledWith('mut');
    expect(storeSpy.actualizarCatseleccionados).toHaveBeenCalledWith('cat');
    expect(storeSpy.actualizarServicio).toHaveBeenCalledWith('serv');
    expect(storeSpy.actualizarEmpleados).toHaveBeenCalledWith('emp2');
    expect(storeSpy.actualizarBimestre).toHaveBeenCalledWith('bim');
    expect(storeSpy.actualizarIndiqueTodos).toHaveBeenCalledWith('it');
    expect(storeSpy.actualizarFile1).toHaveBeenCalledWith('f1');
    expect(storeSpy.actualizarFile2).toHaveBeenCalledWith('f2');
    expect(storeSpy.actualizarIdentificacion).toHaveBeenCalledWith('id');
    expect(storeSpy.actualizarLugarDeRadicacion).toHaveBeenCalledWith('lr');
    expect(storeSpy.actualizarCheckbox1).toHaveBeenCalledWith(true);
    expect(storeSpy.actualizarCheckbox2).toHaveBeenCalledWith(false);
    expect(storeSpy.actualizarCheckbox3).toHaveBeenCalledWith(true);
    expect(storeSpy.actualizarActualmente2).toHaveBeenCalledWith('act2');
    expect(storeSpy.actualizarActualmente1).toHaveBeenCalledWith('act1');
  });

  describe('Error handling tests', () => {
    it('should handle HTTP errors in conseguirRecibirNotificaciones', (done) => {
      const errorResponse = new Error('HTTP Error');
      httpClientSpy.get.mockReturnValue(throwError(errorResponse));
      
      service.conseguirRecibirNotificaciones().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBe(errorResponse);
          expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/32614/recibir-notificaciones.json');
          done();
        }
      });
    });

    it('should handle HTTP errors in conseguirEnlaceOperativoDatos', (done) => {
      const errorResponse = new Error('Network Error');
      httpClientSpy.get.mockReturnValue(throwError(errorResponse));
      
      service.conseguirEnlaceOperativoDatos().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBe(errorResponse);
          expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/32614/enlace-operativo-datos.json');
          done();
        }
      });
    });

    it('should handle HTTP errors in guardarDatosFormulario', (done) => {
      const errorResponse = new Error('File not found');
      httpClientSpy.get.mockReturnValue(throwError(errorResponse));
      
      service.guardarDatosFormulario().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error).toBe(errorResponse);
          expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/32614/guardar-datos-formulario.json');
          done();
        }
      });
    });
  });

  describe('Service dependencies', () => {
    it('should be injected with HttpClient', () => {
      expect(service['http']).toBeDefined();
    });

    it('should be injected with Solicitud32614Store', () => {
      expect(service.solicitud32614Store).toBeDefined();
    });
  });

  describe('Observable behavior tests', () => {
    it('should return Observable for conseguirRecibirNotificaciones', () => {
      const mockData = [{ id: 1, nombre: 'Test' }];
      httpClientSpy.get.mockReturnValue(of(mockData));
      
      const result = service.conseguirRecibirNotificaciones();
      expect(result).toBeInstanceOf(Observable);
    });

    it('should return Observable for conseguirEnlaceOperativoDatos', () => {
      const mockData = [{ id: 1, nombre: 'Test' }];
      httpClientSpy.get.mockReturnValue(of(mockData));
      
      const result = service.conseguirEnlaceOperativoDatos();
      expect(result).toBeInstanceOf(Observable);
    });

    it('should return Observable for guardarDatosFormulario', () => {
      const mockData = { idPersonaSolicitud: 1 };
      httpClientSpy.get.mockReturnValue(of(mockData));
      
      const result = service.guardarDatosFormulario();
      expect(result).toBeInstanceOf(Observable);
    });
  });

  describe('actualizarEstadoFormulario edge cases', () => {
    it('should handle empty response object', () => {
      const resp: any = {};
      expect(() => service.actualizarEstadoFormulario(resp)).not.toThrow();
    });

    it('should handle null values in response', () => {
      const resp: any = {
        190: null,
        191: null,
        idPersonaSolicitud: null,
        nombre: null
      };
      
      expect(() => service.actualizarEstadoFormulario(resp)).not.toThrow();
      expect(storeSpy.actualizar190).toHaveBeenCalledWith(null);
      expect(storeSpy.actualizar191).toHaveBeenCalledWith(null);
      expect(storeSpy.actualizarIdPersonaSolicitud).toHaveBeenCalledWith(null);
      expect(storeSpy.actualizarNombre).toHaveBeenCalledWith(null);
    });

    it('should handle undefined values in response', () => {
      const resp: any = {
        190: undefined,
        191: undefined,
        idPersonaSolicitud: undefined
      };
      
      expect(() => service.actualizarEstadoFormulario(resp)).not.toThrow();
      expect(storeSpy.actualizar190).toHaveBeenCalledWith(undefined);
      expect(storeSpy.actualizar191).toHaveBeenCalledWith(undefined);
      expect(storeSpy.actualizarIdPersonaSolicitud).toHaveBeenCalledWith(undefined);
    });
  });

  describe('HTTP method call verification', () => {
    it('should call http.get exactly once for each method', () => {
      const mockData = {};
      httpClientSpy.get.mockReturnValue(of(mockData));

      service.conseguirRecibirNotificaciones().subscribe();
      service.conseguirEnlaceOperativoDatos().subscribe();
      service.conseguirRepresentanteLegalDatos().subscribe();
      service.conseguirOpcionDeRadio().subscribe();
      service.conseguirTransportistasLista().subscribe();
      service.conseguirSolicitudCatologoSelectLista().subscribe();
      service.conseguirSeccionSubcontratados().subscribe();
      service.conseguirInventarios().subscribe();
      service.guardarDatosFormulario().subscribe();

      expect(httpClientSpy.get).toHaveBeenCalledTimes(9);
    });
  });
});