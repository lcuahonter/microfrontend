import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EstablecimientoService } from './establecimiento.service';
import { DatosSolicitudStore } from '../estados/stores/datos-de-la-solicitud-modificacion.store';
import { PermisoImportacionBiologicaStore } from '../estados/permiso-importacion-biologica.store';
import { AvisocalidadStore } from '../estados/stores/aviso-calidad.store';
import { DatosDomicilioLegalStore } from '../estados/stores/datos-domicilio-legal.store';

describe('EstablecimientoService', () => {
  let service: EstablecimientoService;
  let httpMock: HttpTestingController;

  // Mocks para los stores requeridos en el constructor
  const mockDatosSolicitudStore = { setGenericos: jest.fn(), setObservaciones: jest.fn(), setEstablecimientoRazonSocial: jest.fn(), setEstablecimientoCorreoElectronico: jest.fn(), setEstablecimientoDomicilioCodigoPostal: jest.fn(), setEstablecimientoEstados: jest.fn(), setDescripcionMunicipio: jest.fn(), setLocalidad: jest.fn(), setEstablishomentoColonias: jest.fn(), setCalle: jest.fn(), setLada: jest.fn(), setTelefono: jest.fn(), setAvisoCheckbox: jest.fn(), setNoLicenciaSanitaria: jest.fn(), setRegimen: jest.fn(), setAduanasEntradas: jest.fn(), setAifaCheckbox: jest.fn(), setManifests: jest.fn(), setInformacionConfidencialRadio: jest.fn(), setScian: jest.fn(), setDescripcionScian: jest.fn() };
  const mockPermisoImportacionBiologicaStore = { setClaveDeReferncia: jest.fn(), setCadenaDeLaDependencia: jest.fn(), setLlaveDePago: jest.fn(), setFechaDePago: jest.fn(), setImporteDePago: jest.fn(), setBanco: jest.fn() };
  const mockAvisoCalidadStore = { setRfcDel: jest.fn(), setDenominacionRazonSocial: jest.fn(), setCorreoElectronico: jest.fn() };
  const mockDatosDomicilioLegalStore = { setRfc: jest.fn(), setNombre: jest.fn(), setApellidoPaterno: jest.fn(), setApellidoMaterno: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [require('@angular/common/http/testing').HttpClientTestingModule],
      providers: [
        EstablecimientoService,
        { provide: DatosSolicitudStore, useValue: mockDatosSolicitudStore },
        { provide: PermisoImportacionBiologicaStore, useValue: mockPermisoImportacionBiologicaStore },
        { provide: AvisocalidadStore, useValue: mockAvisoCalidadStore },
        { provide: DatosDomicilioLegalStore, useValue: mockDatosDomicilioLegalStore }
      ]
    });
    service = TestBed.inject(EstablecimientoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener los datos del catálogo de estados', () => {
    service.getEstadoData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Estado' }]);
    });
    const req = httpMock.expectOne('assets/json/260401/establecimiento.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Estado' }]);
  });

  it('debería obtener los datos del catálogo de SCIAN', () => {
    service.getSciandata().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'SCIAN' }]);
    });
    const req = httpMock.expectOne('assets/json/260401/scianda.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'SCIAN' }]);
  });

  it('debería obtener los datos del catálogo de régimen', () => {
    service.getRegimenData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Régimen' }]);
    });
    const req = httpMock.expectOne('assets/json/260401/regimen.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Régimen' }]);
  });

  it('debería obtener los datos del catálogo de aduanas de salida', () => {
    service.getAduanaDeSalidaData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Aduana' }]);
    });
    const req = httpMock.expectOne('assets/json/260401/aduanaDeSalida.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Aduana' }]);
  });

  it('debería obtener los datos del catálogo de tipos de producto', () => {
    service.getTipoDeProductoData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'TipoProducto' }]);
    });
    const req = httpMock.expectOne('assets/json/260401/tipoDeProducto.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'TipoProducto' }]);
  });

  it('debería obtener los datos del catálogo de unidades de medida', () => {
    service.getUnidadDeMedidaData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Unidad' }]);
    });
    const req = httpMock.expectOne('assets/json/260401/unidadDeMedida.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Unidad' }]);
  });

  it('debería obtener los datos del catálogo de usos específicos', () => {
    service.getUsoEspecificoData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Uso' }]);
    });
    const req = httpMock.expectOne('assets/json/260401/usoEspecifico.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Uso' }]);
  });

  it('debería obtener representante por RFC', () => {
    service.getRepresentanteByRfc('RFC1').subscribe(data => {
      expect(data).toEqual({ rfc: 'RFC1' });
    });
    const req = httpMock.expectOne('assets/json/260401/representanteByRfc.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ rfc: 'RFC1' }, { rfc: 'RFC2' }]);
  });

  it('debería obtener null si no encuentra representante por RFC', () => {
    service.getRepresentanteByRfc('NO_EXISTE').subscribe(data => {
      expect(data).toBeNull();
    });
    const req = httpMock.expectOne('assets/json/260401/representanteByRfc.json');
    req.flush([{ rfc: 'RFC1' }]);
  });

  it('debería obtener manifiestos por RFC', () => {
    service.getManifiestosByRfc('RFC1').subscribe(data => {
      expect(data).toEqual({ rfc: 'RFC1' });
    });
    const req = httpMock.expectOne('assets/json/260401/manifiestos.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ rfc: 'RFC1' }, { rfc: 'RFC2' }]);
  });

  it('debería obtener null si no encuentra manifiesto por RFC', () => {
    service.getManifiestosByRfc('NO_EXISTE').subscribe(data => {
      expect(data).toBeNull();
    });
    const req = httpMock.expectOne('assets/json/260401/manifiestos.json');
    req.flush([{ rfc: 'RFC1' }]);
  });

  it('debería obtener los datos del catálogo de propietario radio', () => {
    service.getPropietarioRadioData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Radio' }]);
    });
    const req = httpMock.expectOne('assets/json/260401/propietario.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Radio' }]);
  });

  it('debería obtener los datos del catálogo de tipos de persona para propietarios', () => {
    service.getPropietarioTipoPersonaData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'TipoPersona' }]);
    });
    const req = httpMock.expectOne('assets/json/260401/propietarioTipoPersona.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'TipoPersona' }]);
  });

  it('debería obtener las opciones de radio para información confidencial', () => {
    service.getInformacionConfidencialRadioOptions().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'RadioSiNo' }]);
    });
    const req = httpMock.expectOne('assets/json/260401/radioSiNo.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'RadioSiNo' }]);
  });

  it('debería obtener los datos de justificación', () => {
    service.getJustificationData().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Justificacion' }]);
    });
    const req = httpMock.expectOne('assets/json/cofepris/justificacion.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Justificacion' }]);
  });

  it('debería obtener los datos del establecimiento', () => {
    service.getEstadodata().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Establecimiento' }]);
    });
    const req = httpMock.expectOne('assets/json/260401/scianda.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Establecimiento' }]);
  });

  it('debería obtener la lista de asociados', () => {
    service.enListaDeAsociados().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Asociado' }]);
    });
    const req = httpMock.expectOne('assets/json/cofepris/asociadosJson.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Asociado' }]);
  });

  it('debería obtener los datos del destinatario', () => {
    service.getDestinatarioDatos().subscribe(data => {
      expect(data).toEqual({ ok: true });
    });
    const req = httpMock.expectOne('./assets/json/260701/destinatario-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('debería obtener los datos del fabricante', () => {
    service.getFabricanteDatos().subscribe(data => {
      expect(data).toEqual({ ok: true });
    });
    const req = httpMock.expectOne('./assets/json/260701/fabricante-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });
  });

  it('debería obtener los datos de la tabla SCIAN', () => {
    service.getScianTablaDatos().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'SCIAN' }]);
    });
    const req = httpMock.expectOne('./assets/json/260902/scian-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'SCIAN' }]);
  });

  it('debería obtener los datos de mercancías', () => {
    service.getMercancias().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Mercancia' }]);
    });
    const req = httpMock.expectOne('assets/json/260905/mercancias.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Mercancia' }]);
  });

  it('debería obtener los datos del propietario', () => {
    service.getPropietario().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Propietario' }]);
    });
    const req = httpMock.expectOne('assets/json/260402/propietarioDatos.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Propietario' }]);
  });

  it('debería obtener los datos del producto', () => {
    service.getDatosDelProducto().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'Producto' }]);
    });
    const req = httpMock.expectOne('assets/json/260402/datosDelProducto.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'Producto' }]);
  });

  it('debería obtener los datos de SCIAN', () => {
    service.getScianDatos().subscribe(data => {
      expect(data).toEqual([{ id: 1, nombre: 'SCIAN' }]);
    });
    const req = httpMock.expectOne('assets/json/260402/scianDatos.json');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, nombre: 'SCIAN' }]);
  });

  it('debería obtener los datos iniciales de la solicitud', () => {
    const mockEstadoCombinado = {
      datosSolicitudState: {},
      permisoImportacionBiologicaState: {},
      datosDomicilioLegalState: {},
      solicitudState: {}
    };
    service.obtenerSolicitudDatos().subscribe(data => {
      expect(data).toEqual(mockEstadoCombinado);
    });
    const req = httpMock.expectOne('assets/json/cofepris/datosSolicitud.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockEstadoCombinado);
  });

  it('debería actualizar el estado del formulario', () => {
    const estadoCombinado: any = {
      datosSolicitudState: {
        genericos: 'gen',
        observaciones: 'obs',
        establecimientoRazonSocial: 'razon',
        establecimientoCorreoElectronico: 'correo',
        establecimientoDomicilioCodigoPostal: 'cp',
        establecimientoEstados: 'estados',
        descripcionMunicipio: 'mun',
        localidad: 'loc',
        establishomentoColonias: 'col',
        calle: 'calle',
        lada: 'lada',
        telefono: 'tel',
        avisoCheckbox: true,
        noLicenciaSanitaria: 'lic',
        regimen: 'reg',
        aduanasEntradas: 'aduanas',
        aifaCheckbox: true,
        manifests: [],
        informacionConfidencialRadio: 'radio',
        scian: 'scian',
        descripcionScian: 'desc'
      },
      permisoImportacionBiologicaState: {
        setClaveDeReferncia: 'clave',
        setCadenaDeLaDependencia: 'cadena',
        setLlaveDePago: 'llave',
        setFechaDePago: 'fecha',
        setImporteDePago: 'importe',
        setBanco: 'banco'
      },
      datosDomicilioLegalState: {
        rfc: 'rfc',
        nombre: 'nombre',
        apellidoPaterno: 'paterno',
        apellidoMaterno: 'materno'
      },
      solicitudState: {
        rfcDel: 'rfcDel',
        denominacionRazonSocial: 'denom',
        correoElectronico: 'correo'
      }
    };
    service.actualizarEstadoFormulario(estadoCombinado);
    expect(mockDatosSolicitudStore.setGenericos).toHaveBeenCalledWith('gen');
    expect(mockPermisoImportacionBiologicaStore.setClaveDeReferncia).toHaveBeenCalledWith('clave');
    expect(mockAvisoCalidadStore.setRfcDel).toHaveBeenCalledWith('rfcDel');
    expect(mockDatosDomicilioLegalStore.setRfc).toHaveBeenCalledWith('rfc');
  });
});