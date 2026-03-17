import { EconomicoService } from './economico.service';
import { Tramite32606Store } from '../state/Tramite32606.store';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Solicitud32606State, Catalogo } from '../state/Tramite32606.store';
import { Domicillio, EntidadFederativa, Querella, RecibirNotificaciones } from '../models/adace.model';

describe('EconomicoService', () => {
  let service: EconomicoService;
  let httpMock: jest.Mocked<HttpClient>;
  let storeMock: jest.Mocked<Tramite32606Store>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    } as any;

    storeMock = {
      setTipoRadio01: jest.fn(),
      setTipoRadio02: jest.fn(),
      setTipoRadio03: jest.fn(),
      setTipoRadio04: jest.fn(),
      setTipoRadio05: jest.fn(),
      setTipoRadio06: jest.fn(),
      setTipoRadio07: jest.fn(),
      setTipoRadio08: jest.fn(),
      setTipoRadio09: jest.fn(),
      setTipoRadio10: jest.fn(),
      setTipoRadio11: jest.fn(),
      setTipoRadio12: jest.fn(),
      setTipoRadio13: jest.fn(),
      setTipoRadio14: jest.fn(),
      setTipoRadio15: jest.fn(),
      setTipoRadio16: jest.fn(),
      setTipoRadio17: jest.fn(),
      setTipoRadio18: jest.fn(),
      setTipoRadio19: jest.fn(),
      setTipoRadio20: jest.fn(),
      setTipoRadio21: jest.fn(),
      setTipoRadio22: jest.fn(),
      setTipoRadio23: jest.fn(),
      setTipoRadio24: jest.fn(),
      setTipoRadio25: jest.fn(),
      setTipoRadio26: jest.fn(),
      setTipoRadio27: jest.fn(),
      setTipoRadio28: jest.fn(),
      setTipoRadio29: jest.fn(),
      setTipoRadio30: jest.fn(),
      setTipoRadio31: jest.fn(),
      setTipoRadio32: jest.fn(),
      setTipoRadio33: jest.fn(),
      setTipoRadio34: jest.fn(),
      setSectorProductivo: jest.fn(),
      setServicio: jest.fn(),
      setDomicilio: jest.fn(),
      setBiomestre: jest.fn(),
      setNumeroEmpleados: jest.fn(),
      setDomicillio: jest.fn(),
      setFile1: jest.fn(),
      setFile2: jest.fn(),
      setActualmente: jest.fn(),
      setActualmente2: jest.fn(),
      setSistemaIdentificacion: jest.fn(),
      setLugarRadicacion: jest.fn(),
      setSistemaControlInventarios: jest.fn(),
      setRfcTercero: jest.fn(),
      setRfc: jest.fn(),
      setNombre: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
      setTelefono: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setMonto: jest.fn(),
      setOperacionesBancarias: jest.fn(),
      setLlavePago: jest.fn(),
      setModalidad: jest.fn(),
      setFechaRegistro: jest.fn(),
      setNumeroAutorizacion: jest.fn(),
      setRadioAutorizo: jest.fn(),
      setRadioClasificacion: jest.fn(),
      setCaracter: jest.fn(),
      setNacionalidad: jest.fn(),
      setFechaInicio: jest.fn(),
      setFechaPago: jest.fn(),
      setEntidadFederativa: jest.fn(),
      setMunicipio: jest.fn(),
      setTipoDeInstalacion: jest.fn(),
      setRegistroSESAT: jest.fn(),
      setDescripcion: jest.fn(),
      setCodigoPostal: jest.fn()
    } as any;

    service = new EconomicoService(httpMock, storeMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('actualizarEstadoFormulario should call all store setters', () => {
    const datos: Solicitud32606State = {
      tipoRadio01: '1', tipoRadio02: '2', tipoRadio03: '3', tipoRadio04: '4', tipoRadio05: '5',
      tipoRadio06: '6', tipoRadio07: '7', tipoRadio08: '8', tipoRadio09: '9', tipoRadio10: '10',
      tipoRadio11: '11', tipoRadio12: '12', tipoRadio13: '13', tipoRadio14: '14', tipoRadio15: '15',
      tipoRadio16: '16', tipoRadio17: '17', tipoRadio18: '18', tipoRadio19: '19', tipoRadio20: '20',
      tipoRadio21: '21', tipoRadio22: '22', tipoRadio23: '23', tipoRadio24: '24', tipoRadio25: '25',
      tipoRadio26: '26', tipoRadio27: '27', tipoRadio28: '28', tipoRadio29: '29', tipoRadio30: '30',
      tipoRadio31: '31', tipoRadio32: '32', tipoRadio33: '33', tipoRadio34: '34',
      sectorProductivo: 'sector', servicio: 'servicio', domicilio: 'dom', biomestre: 'bio',
      numeroEmpleados: '10', domicillio: 'domicillio', file1: 'file1', file2: 'file2',
      actualmente: 'actual', actualmente2: 'actual2', sistemaIdentificacion: 'id', lugarRadicacion: 'lugar',
      sistemaControlInventarios: true, rfcTercero: 'rfcT', rfc: 'rfc', nombre: 'nombre', apellidoPaterno: 'ap',
      apellidoMaterno: 'am', telefono: 'tel', correoElectronico: 'mail', monto: 'monto',
      operacionesBancarias: 'op', llavePago: 'llave', modalidad: 'mod', fechaRegistro: 'fecha',
      numeroAutorizacion: 'num', radioAutorizo: 'aut', radioClasificacion: 'clas', caracter: 'car',
      nacionalidad: 'nac', fechaInicio: 'inicio', fechaPago: 'pago', entidadFederativa: 'entidad',
      municipio: 'mun', tipoDeInstalacion: 'tipo', registroSESAT: 'reg', descripcion: 'desc', codigoPostal: 'cp'
    };
    service.actualizarEstadoFormulario(datos);
    Object.keys(datos).forEach(key => {
      const setter = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      if (typeof (storeMock as any)[setter] === 'function') {
        expect((storeMock as any)[setter]).toHaveBeenCalledWith((datos as any)[key]);
      }
    });
  });

  it('getRegistroTomaMuestrasMercanciasData should call http.get and return observable', (done) => {
    const mockData = { tipoRadio01: '1' } as Solicitud32606State;
    httpMock.get.mockReturnValue(of(mockData));
    service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32606/registro_toma_muestras_mercancias.json');
      done();
    });
  });

  it('obtenerSectorProductivo should call http.get and return observable', (done) => {
    const mockData: Catalogo[] = [{ id: 1, descripcion: 'A' }];
    httpMock.get.mockReturnValue(of(mockData));
    service.obtenerSectorProductivo().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32606/sector-productivo.json');
      done();
    });
  });

  it('obtenerServicio should call http.get and return observable', (done) => {
    const mockData: Catalogo[] = [{ id: 2, descripcion: 'B' }];
    httpMock.get.mockReturnValue(of(mockData));
    service.obtenerServicio().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32606/servicio.json');
      done();
    });
  });

  it('obtenerBimestre should call http.get and return observable', (done) => {
    const mockData: Catalogo[] = [{ id: 3, descripcion: 'C' }];
    httpMock.get.mockReturnValue(of(mockData));
    service.obtenerBimestre().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32606/bimestre.json');
      done();
    });
  });

  it('obtenerDomicillio should call http.get and return observable', (done) => {
    const mockData: Catalogo[] = [{ id: 4, descripcion: 'D' }];
    httpMock.get.mockReturnValue(of(mockData));
    service.obtenerDomicillio().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32606/domicillio.json');
      done();
    });
  });

  it('personasNotificaciones should call http.get and return observable', (done) => {
    const mockData: RecibirNotificaciones[] = [{ rfc: 'rfc', curp: 'curp', nombre: 'nombre', apellidoPaterno: 'ap', apellidoMaterno: 'am' }];
    httpMock.get.mockReturnValue(of(mockData));
    service.personasNotificaciones().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32606/personas.json');
      done();
    });
  });

  it('obtenerEntidad should call http.get and return observable', (done) => {
    const mockData: Catalogo[] = [{ id: 5, descripcion: 'E' }];
    httpMock.get.mockReturnValue(of(mockData));
    service.obtenerEntidad().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32606/entidad.json');
      done();
    });
  });

  it('obtenerCaracter should call http.get and return observable', (done) => {
    const mockData: Catalogo[] = [{ id: 6, descripcion: 'F' }];
    httpMock.get.mockReturnValue(of(mockData));
    service.obtenerCaracter().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32606/caracter.json');
      done();
    });
  });

  it('obtenerNacionalidad should call http.get and return observable', (done) => {
    const mockData: Catalogo[] = [{ id: 7, descripcion: 'G' }];
    httpMock.get.mockReturnValue(of(mockData));
    service.obtenerNacionalidad().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32606/nacionalidad.json');
      done();
    });
  });

  it('obtenerTablaEntidad should call http.get and handle errors', (done) => {
    const mockData: EntidadFederativa[] = [{
      entidadFederativa: 'CDMX',
      municipioDelegacion: 'Benito Juárez',
      direccion: 'Av. Insurgentes Sur 123',
      codigoPostal: '03100',
      registroSESAT: 'ABC123'
    }];
    httpMock.get.mockReturnValue(of(mockData));
    service.obtenerTablaEntidad().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32606/entidad-tabla.json');
      done();
    });
  });

  it('obtenerTablaEntidad should handle http error', (done) => {
    httpMock.get.mockReturnValue(throwError(() => new Error('error')));
    service.obtenerTablaEntidad().subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        done();
      }
    });
  });

  it('obtenerTablaDomicillio should call http.get and handle errors', (done) => {
    const mockData: Domicillio[] = [{
      instalacionPrincipal: 'principal',
      tipoInstalacion: 'industrial',
      entidadFederativa: 'CDMX',
      municipioDelegacion: 'Benito Juárez',
      direccion: 'Av. Insurgentes Sur 123',
      codigoPostal: '03100',
      registroSESAT: 'ABC123',
      procesoProductivo: 'manufactura',
      acreditaInmueble: 'escritura',
      operacionesCExt: 'importación',
      instalacionCtpat: 'sí',
      instalacionPerfil: 'general',
      instalacionPerfilRFE: 'estratégico',
      instalacionPerfilAuto: 'automotriz',
      instalacionPerfilFerro: 'ferroviario',
      instalacionPerfilRf: 'fiscal',
      instalacionPerfilMensajeria: 'mensajería'
    }];
    httpMock.get.mockReturnValue(of(mockData));
    service.obtenerTablaDomicillio().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32606/domicillio-tabla.json');
      done();
    });
  });

  it('obtenerTablaDomicillio should handle http error', (done) => {
    httpMock.get.mockReturnValue(throwError(() => new Error('error')));
    service.obtenerTablaDomicillio().subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        done();
      }
    });
  });

  it('obtenerTablaQuerella should call http.get and handle errors', (done) => {
    const mockData: Querella[] = [{
      sistemaIdentificacion: 'X',
      lugarRadicacion: 'Y',
      indiqueSiCuenta: true
    }];
    httpMock.get.mockReturnValue(of(mockData));
    service.obtenerTablaQuerella().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/32606/querella-tabla.json');
      done();
    });
  });

  it('obtenerTablaQuerella should handle http error', (done) => {
    httpMock.get.mockReturnValue(throwError(() => new Error('error')));
    service.obtenerTablaQuerella().subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        done();
      }
    });
  });
});