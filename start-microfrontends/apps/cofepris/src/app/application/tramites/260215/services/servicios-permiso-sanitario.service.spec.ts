import { ServiciosPermisoSanitarioService } from './servicios-permiso-sanitario.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Tramite260215Store } from '../estados/tramites/tramite260215.store';
import { Solicitud260215State } from '../estados/tramites/tramite260215.store';

describe('ServiciosPermisoSanitarioService', () => {
  let service: ServiciosPermisoSanitarioService;
  let httpMock: jest.Mocked<HttpClient>;
  let storeMock: jest.Mocked<Tramite260215Store>;
  let httpCoreServiceMock: any;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    } as any;
    storeMock = {
      setClaveDeReferencia: jest.fn(),
      setCadenaDependencia: jest.fn(),
      setBanco: jest.fn(),
      setllaveDePago: jest.fn(),
      setFechaPago: jest.fn(),
      setImportePago: jest.fn(),
      setRfcDel: jest.fn(),
      setDenominacion: jest.fn(),
      setCorreo: jest.fn(),
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setMuncipio: jest.fn(),
      setLocalidad: jest.fn(),
      setColonia: jest.fn(),
      setCalle: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setClaveScianModal: jest.fn(),
      setClaveDescripcionModal: jest.fn(),
      setAvisoCheckbox: jest.fn(),
      setLicenciaSanitaria: jest.fn(),
      setRegimen: jest.fn(),
      setAduanasEntradas: jest.fn(),
      setNumeroPermiso: jest.fn(),
      setClasificacion: jest.fn(),
      setEspecificar: jest.fn(),
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
      setCumplimiento: jest.fn(),
      setRfc: jest.fn(),
      setNombre: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
    } as any;
    httpCoreServiceMock = { /* add methods if needed */ };
    service = new ServiciosPermisoSanitarioService(httpMock, storeMock, httpCoreServiceMock);
  });

  it('debe obtener los datos del banco', (done) => {
    const datos = [{ id: 1, nombre: 'Banco' }];
    httpMock.get.mockReturnValue(of(datos));
    service.getBancoData().subscribe(res => {
      expect(res).toEqual(datos);
      done();
    });
    expect(httpMock.get).toHaveBeenCalledWith('./assets/json/260215/banco-options.json');
  });

  it('debe obtener los datos de derechos', (done) => {
    const datos = { clave: 'valor' };
    httpMock.get.mockReturnValue(of(datos));
    service.getDatos().subscribe(res => {
      expect(res).toEqual(datos);
      done();
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260215/derechos.json');
  });

  it('debe manejar error al obtener datos de derechos', (done) => {
    httpMock.get.mockReturnValue(throwError(() => 'error'));
    service.getDatos().subscribe({
      error: (err) => {
        expect(err).toBe('error');
        done();
      }
    });
  });

  it('debe obtener los datos del proveedor', (done) => {
    const datos = { proveedor: 'test' };
    httpMock.get.mockReturnValue(of(datos));
    service.getProveedordata().subscribe(res => {
      expect(res).toEqual(datos);
      done();
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260215/proveedor.json');
  });

  it('debe manejar error al obtener datos del proveedor', (done) => {
    httpMock.get.mockReturnValue(throwError(() => 'error'));
    service.getProveedordata().subscribe({
      error: (err) => {
        expect(err).toBe('error');
        done();
      }
    });
  });

  it('debe obtener los datos de localidad', (done) => {
    const datos = { localidad: 'test' };
    httpMock.get.mockReturnValue(of(datos));
    service.getLocalidaddata().subscribe(res => {
      expect(res).toEqual(datos);
      done();
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260215/estadolocalidad.json');
  });

  it('debe manejar error al obtener datos de localidad', (done) => {
    httpMock.get.mockReturnValue(throwError(() => 'error'));
    service.getLocalidaddata().subscribe({
      error: (err) => {
        expect(err).toBe('error');
        done();
      }
    });
  });

  it('debe obtener los datos de terceros relacionados', (done) => {
    const datos = [{ id: 2 }];
    httpMock.get.mockReturnValue(of(datos));
    service.getData().subscribe(res => {
      expect(res).toEqual(datos);
      done();
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260215/terceros-relacionados.json');
  });

  it('debe obtener la lista de estados', (done) => {
    const datos = { estados: [] };
    httpMock.get.mockReturnValue(of(datos));
    service.getObtenerEstadoList().subscribe(res => {
      expect(res).toEqual(datos);
      done();
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260215/seleccion.json');
  });

  it('debe obtener los datos de la tabla', (done) => {
    const datos = { tabla: [] };
    httpMock.get.mockReturnValue(of(datos));
    service.getObtenerTablaDatos().subscribe(res => {
      expect(res).toEqual(datos);
      done();
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260215/tablaDatos.json');
  });

  it('debe obtener los datos de mercancías', (done) => {
    const datos = { mercancias: [] };
    httpMock.get.mockReturnValue(of(datos));
    service.getObtenerMercanciasDatos().subscribe(res => {
      expect(res).toEqual(datos);
      done();
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260215/mercanciasDatos.json');
  });

  // it('debe actualizar el estado del trámite 260215', () => {
  //   const datos: Solicitud260215State = {
  //     claveDeReferencia: 'ref',
  //     cadenaDependencia: 'dep',
  //     banco: 'banco',
  //     llaveDePago: 'llave',
  //     fechaPago: '2024-01-01',
  //     importePago: '100',
  //     rfcDel: 'RFC',
  //     denominacion: 'denom',
  //     correo: 'correo@test.com',
  //     codigoPostal: '12345',
  //     estado: 'estado',
  //     muncipio: 'municipio',
  //     localidad: 'localidad',
  //     colonia: 'colonia',
  //     calle: 'calle',
  //     lada: 'lada',
  //     telefono: 'tel',
  //     claveScianModal: 'scian',
  //     claveDescripcionModal: 'desc',
  //     avisoCheckbox: true,
  //     licenciaSanitaria: 'lic',
  //     regimen: 'reg',
  //     aduanasEntradas: 'aduana',
  //     clasificacion: 'clas',
  //     especificar: 'esp',
  //     denominacionEspecifica: 'espec',
  //     denominacionDistintiva: 'dist',
  //     denominacionComun: 'comun',
  //     tipoDeProducto: 'tipo',
  //     estadoFisico: 'fisico',
  //     fraccionArancelaria: 'frac',
  //     descripcionFraccion: 'descFrac',
  //     cantidadUMT: '1',
  //     UMT: 'umt',
  //     cantidadUMC: '2',
  //     UMC: 'umc',
  //     presentacion: 'pres',
  //     numeroRegistro: 'regNum',
  //     fechaCaducidad: '2024-12-31',
  //     cumplimiento: 'cumple',
  //     rfc: 'rfc2',
  //     nombre: 'nombre',
  //     apellidoPaterno: 'paterno',
  //     apellidoMaterno: 'materno',
  //     opcionConfigDatos: [],
  //     proveedorTablaModificaDatos: [],
  //     facturadorTablaModificaDatos: [],
  //     fabricanteTablaModificaDatos: [],
  //    // domicilioTablaModificaDatos: '',
  //     // productoTablaModificaDatos: '',
  //     // mercanciaTablaModificaDatos: '',
  //     // registroSanitarioTablaModificaDatos: '',
  //     // permisoSanitarioTablaModificaDatos: '',
  //     // documentoTablaModificaDatos: '',
  //     // observacionesTablaModificaDatos: '',
  //     // fechaRegistroTablaModificaDatos: '',
  //     // usuarioRegistroTablaModificaDatos: '',
  //     // estatusTablaModificaDatos: ''
  //   };
  //   service.actualizarEstadoTramite260215(datos);
  //   expect(storeMock.setClaveDeReferencia).toHaveBeenCalledWith('ref');
  //   expect(storeMock.setCadenaDependencia).toHaveBeenCalledWith('dep');
  //   expect(storeMock.setBanco).toHaveBeenCalledWith('banco');
  //   // ...se pueden agregar más expects para los demás setters si se desea cobertura total...
  // });

  it('debe obtener los datos del registro de toma de muestras de mercancías', (done) => {
    const datos = { claveDeReferencia: 'ref' } as Solicitud260215State;
    httpMock.get.mockReturnValue(of(datos));
    service.getRegistroTomaMuestrasMercanciasData().subscribe(res => {
      expect(res).toEqual(datos);
      done();
    });
    expect(httpMock.get).toHaveBeenCalledWith('assets/json/260215/registro_toma_muestras_mercancias.json');
  });
});
