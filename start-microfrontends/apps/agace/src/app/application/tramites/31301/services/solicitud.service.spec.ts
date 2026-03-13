import { TestBed } from '@angular/core/testing';
import { SolicitudService } from './solicitud.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Solicitud31301Store } from '../estados/solicitud31301.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolicitudService', () => {
  let service: SolicitudService;
  let httpClientSpy: jest.Mocked<HttpClient>;
  let storeSpy: jest.Mocked<Solicitud31301Store>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn()
    } as any;

    storeSpy = {
      actualizarTipoDeEndoso: jest.fn(),
      actualizarTipoDeGarantia: jest.fn(),
      actualizarModalidadDeLaGarantia: jest.fn(),
      actualizarTipoSector: jest.fn(),
      actualizarConcepto: jest.fn(),
      actualizar3500: jest.fn(),
      actualizar3501: jest.fn(),
      actualizar3502: jest.fn(),
      actualizarDatosGeneralesRFC: jest.fn(),
      actualizar3503: jest.fn(),
      actualizar3504: jest.fn(),
      actualizar3505: jest.fn(),
      actualizar3506: jest.fn(),
      actualizar3507: jest.fn(),
      actualizar3508: jest.fn(),
      actualizar3509: jest.fn(),
      actualizar3511: jest.fn(),
      actualizar3512: jest.fn(),
      actualizar3513: jest.fn(),
      actualizarTextoGenerico1: jest.fn(),
      actualizarTextoGenerico2: jest.fn(),
      actualizar3514: jest.fn(),
      actualizar3515: jest.fn(),
      actualizar3516: jest.fn(),
      actualizarTextoGenerico3: jest.fn(),
      actualizar3517: jest.fn(),
      actualizar3518: jest.fn(),
      actualizar3519: jest.fn(),
      actualizar3520: jest.fn(),
      actualizarTipoInversion: jest.fn(),
      actualizarCantidadInversion: jest.fn(),
      actualizarDescInversion: jest.fn(),
      actualizar3521: jest.fn(),
      actualizar3522: jest.fn(),
      actualizarClaveEnumeracionD0: jest.fn(),
      actualizarClaveEnumeracionD1: jest.fn(),
      actualizarClaveEnumeracionD2: jest.fn(),
      actualizarClaveEnumeracionD3: jest.fn(),
      actualizarClaveEnumeracionH: jest.fn(),
      actualizarTextoGenerico4: jest.fn(),
      actualizarTextoGenerico5: jest.fn(),
      actualizar3523: jest.fn(),
      actualizar3528: jest.fn(),
      actualizar3529: jest.fn(),
      actualizarTextoGenerico6: jest.fn(),
      actualizarTextoGenerico7: jest.fn(),
      actualizar3530: jest.fn(),
      actualizar3531: jest.fn(),
      actualizarTextoGenerico9: jest.fn(),
      actualizarTextoGenerico10: jest.fn(),
      actualizarTextoGenerico11: jest.fn(),
      actualizarTextoGenerico12: jest.fn(),
      actualizarTextoGenerico13: jest.fn(),
      actualizarTextoGenerico14: jest.fn(),
      actualizarTextoGenerico15: jest.fn(),
      actualizarTextoGenerico16: jest.fn(),
      actualizarTextoGenerico17: jest.fn(),
      actualizarTextoGenerico18: jest.fn(),
      actualizarTextoGenerico19: jest.fn(),
      actualizarTextoGenerico20: jest.fn(),
      actualizarTextoGenerico21: jest.fn(),
      actualizarTextoGenerico22: jest.fn(),
      actualizarTextoGenerico23: jest.fn(),
      actualizarTextoGenerico24: jest.fn(),
      actualizarAlerta1: jest.fn(),
      actualizarAlerta2: jest.fn(),
      actualizarPolizaDeFianzaActual: jest.fn(),
      actualizarNumeroFolio: jest.fn(),
      actualizarRfcInstitucion: jest.fn(),
      actualizarFechaExpedicion: jest.fn(),
      actualizarFechaInicioVigenciaNo: jest.fn(),
      actualizarFechaFinVigenciaNo: jest.fn(),
      actualizarFechaInicioVigencia: jest.fn(),
      actualizarFechaFinVigencia: jest.fn(),
      actualizarImporteTotal: jest.fn(),
      actualizarRazonSocialAnterior: jest.fn(),
      actualizarRazonSocialActual: jest.fn(),
      actualizarRfc: jest.fn(),
      actualizarCurp: jest.fn(),
      actualizarNombre: jest.fn(),
      actualizarApellidoPaterno: jest.fn(),
      actualizarApellidoMaterno: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SolicitudService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Solicitud31301Store, useValue: storeSpy }
      ]
    });
    service = TestBed.inject(SolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('conseguirRecibirNotificaciones should call http.get with correct URL', done => {
    const mockData = [{ id: 1, nombre: 'Notificación' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirRecibirNotificaciones().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31301/recibir-notificaciones.json');
      done();
    });
  });

  it('conseguirModificacionDenominacionRazonSocial should call http.get with correct URL', done => {
    const mockData = { razon: 'Nueva razón' };
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirModificacionDenominacionRazonSocial().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31301/modificacion-denominacion-razon-social.json');
      done();
    });
  });

  it('conseguirNombreInstitucionCatalogo should call http.get with correct URL', done => {
    const mockData = { items: [] };
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirNombreInstitucionCatalogo().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31301/nombre-institucion-catalogo.json');
      done();
    });
  });

  it('conseguirDatosPorGarantia should call http.get with correct URL', done => {
    const mockData = { garantia: 'test' };
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirDatosPorGarantia().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31301/datos-por-garantia.json');
      done();
    });
  });

  it('conseguirDatosGeneralesOpcionDeRadio should call http.get with correct URL', done => {
    const mockData = { radio: [] };
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirDatosGeneralesOpcionDeRadio().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31301/datos-generales-de-la-solicitud-radio-option.json');
      done();
    });
  });

  it('conseguirDatosGeneralesCatologo should call http.get with correct URL', done => {
    const mockData = { catalogo: [] };
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirDatosGeneralesCatologo().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31301/datos-generales-de-la-solicitud-catologo.json');
      done();
    });
  });

  it('conseguirListaDeSubcontratistas should call http.get with correct URL', done => {
    const mockData = [{ nombre: 'Subcontratista' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirListaDeSubcontratistas().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31301/lista-de-subcontratistas.json');
      done();
    });
  });

  it('conseguirRegimenAduanero should call http.get with correct URL', done => {
    const mockData = ['Regimen1'];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirRegimenAduanero().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31301/regimen-aduanero.json');
      done();
    });
  });

  it('conseguirMiembrosDeLaEmpresa should call http.get with correct URL', done => {
    const mockData = [{ nombre: 'Socio' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirMiembrosDeLaEmpresa().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31301/miembros-de-la-empresa.json');
      done();
    });
  });

  it('conseguirTipoDeInversionDatos should call http.get with correct URL', done => {
    const mockData = [{ tipo: 'Inversion' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirTipoDeInversionDatos().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31301/tipo-de-inversion-datos.json');
      done();
    });
  });

  it('conseguirDomicilios should call http.get with correct URL', done => {
    const mockData = [{ direccion: 'Calle 1' }];
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirDomicilios().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31301/domicilios.json');
      done();
    });
  });

  it('conseguirDatosGeneralesDeLaSolicitudDatos should call http.get with correct URL', done => {
    const mockData = { datos: 'generales' };
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.conseguirDatosGeneralesDeLaSolicitudDatos().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31301/datos-generales-de-la-solicitud-datos.json');
      done();
    });
  });

  it('guardarDatosFormulario should call http.get with correct URL', done => {
    const mockData = { tipoDeEndoso: 'A', tipoDeGarantia: 'B' };
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.guardarDatosFormulario().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/json/31301/solicitud-31301-datos.json');
      done();
    });
  });

  it('actualizarEstadoFormulario should call all store update methods with correct values', () => {
    const resp: any = {
      tipoDeEndoso: 'A',
      tipoDeGarantia: 'B',
      modalidadDeLaGarantia: 'C',
      tipoSector: 'D',
      concepto: 'E',
      '3500': 1,
      '3501': 2,
      '3502': 3,
      datosGeneralesRFC: 'RFC',
      '3503': 4,
      '3504': 5,
      '3505': 6,
      '3506': 7,
      '3507': 8,
      '3508': 9,
      '3509': 10,
      '3511': 11,
      '3512': 12,
      '3513': 13,
      textoGenerico1: 'txt1',
      textoGenerico2: 'txt2',
      '3514': 14,
      '3515': 15,
      '3516': 16,
      textoGenerico3: 'txt3',
      '3517': 17,
      '3518': 18,
      '3519': 19,
      '3520': 20,
      tipoInversion: 'inv',
      cantidadInversion: 100,
      descInversion: 'desc',
      '3521': 21,
      '3522': 22,
      claveEnumeracionD0: 'd0',
      claveEnumeracionD1: 'd1',
      claveEnumeracionD2: 'd2',
      claveEnumeracionD3: 'd3',
      claveEnumeracionH: 'h',
      textoGenerico4: 'txt4',
      textoGenerico5: 'txt5',
      '3523': 23,
      '3528': 28,
      '3529': 29,
      textoGenerico6: 'txt6',
      textoGenerico7: 'txt7',
      '3530': 30,
      '3531': 31,
      textoGenerico9: 'txt9',
      textoGenerico10: 'txt10',
      textoGenerico11: 'txt11',
      textoGenerico12: 'txt12',
      textoGenerico13: 'txt13',
      textoGenerico14: 'txt14',
      textoGenerico15: 'txt15',
      textoGenerico16: 'txt16',
      textoGenerico17: 'txt17',
      textoGenerico18: 'txt18',
      textoGenerico19: 'txt19',
      textoGenerico20: 'txt20',
      textoGenerico21: 'txt21',
      textoGenerico22: 'txt22',
      textoGenerico23: 'txt23',
      textoGenerico24: 'txt24',
      alerta1: 'alerta1',
      alerta2: 'alerta2',
      polizaDeFianzaActual: 'poliza',
      numeroFolio: 'folio',
      rfcInstitucion: 'rfcInst',
      fechaExpedicion: '2024-01-01',
      fechaInicioVigenciaNo: '2024-01-02',
      fechaFinVigenciaNo: '2024-01-03',
      fechaInicioVigencia: '2024-01-04',
      fechaFinVigencia: '2024-01-05',
      importeTotal: 999,
      razonSocialAnterior: 'anterior',
      razonSocialActual: 'actual',
      rfc: 'RFC',
      curp: 'CURP',
      nombre: 'Nombre',
      apellidoPaterno: 'Paterno',
      apellidoMaterno: 'Materno'
    };
    service.actualizarEstadoFormulario(resp);
    expect(storeSpy.actualizarTipoDeEndoso).toHaveBeenCalledWith(resp.tipoDeEndoso);
    expect(storeSpy.actualizarTipoDeGarantia).toHaveBeenCalledWith(resp.tipoDeGarantia);
    expect(storeSpy.actualizarModalidadDeLaGarantia).toHaveBeenCalledWith(resp.modalidadDeLaGarantia);
    expect(storeSpy.actualizarTipoSector).toHaveBeenCalledWith(resp.tipoSector);
    expect(storeSpy.actualizarConcepto).toHaveBeenCalledWith(resp.concepto);
    expect(storeSpy.actualizar3500).toHaveBeenCalledWith(resp['3500']);
    expect(storeSpy.actualizar3501).toHaveBeenCalledWith(resp['3501']);
    expect(storeSpy.actualizar3502).toHaveBeenCalledWith(resp['3502']);
    expect(storeSpy.actualizarDatosGeneralesRFC).toHaveBeenCalledWith(resp.datosGeneralesRFC);
    expect(storeSpy.actualizar3503).toHaveBeenCalledWith(resp['3503']);
    expect(storeSpy.actualizar3504).toHaveBeenCalledWith(resp['3504']);
    expect(storeSpy.actualizar3505).toHaveBeenCalledWith(resp['3505']);
    expect(storeSpy.actualizar3506).toHaveBeenCalledWith(resp['3506']);
    expect(storeSpy.actualizar3507).toHaveBeenCalledWith(resp['3507']);
    expect(storeSpy.actualizar3508).toHaveBeenCalledWith(resp['3508']);
    expect(storeSpy.actualizar3509).toHaveBeenCalledWith(resp['3509']);
    expect(storeSpy.actualizar3511).toHaveBeenCalledWith(resp['3511']);
    expect(storeSpy.actualizar3512).toHaveBeenCalledWith(resp['3512']);
    expect(storeSpy.actualizar3513).toHaveBeenCalledWith(resp['3513']);
    expect(storeSpy.actualizarTextoGenerico1).toHaveBeenCalledWith(resp.textoGenerico1);
    expect(storeSpy.actualizarTextoGenerico2).toHaveBeenCalledWith(resp.textoGenerico2);
    expect(storeSpy.actualizar3514).toHaveBeenCalledWith(resp['3514']);
    expect(storeSpy.actualizar3515).toHaveBeenCalledWith(resp['3515']);
    expect(storeSpy.actualizar3516).toHaveBeenCalledWith(resp['3516']);
    expect(storeSpy.actualizarTextoGenerico3).toHaveBeenCalledWith(resp.textoGenerico3);
    expect(storeSpy.actualizar3517).toHaveBeenCalledWith(resp['3517']);
    expect(storeSpy.actualizar3518).toHaveBeenCalledWith(resp['3518']);
    expect(storeSpy.actualizar3519).toHaveBeenCalledWith(resp['3519']);
    expect(storeSpy.actualizar3520).toHaveBeenCalledWith(resp['3520']);
    expect(storeSpy.actualizarTipoInversion).toHaveBeenCalledWith(resp.tipoInversion);
    expect(storeSpy.actualizarCantidadInversion).toHaveBeenCalledWith(resp.cantidadInversion);
    expect(storeSpy.actualizarDescInversion).toHaveBeenCalledWith(resp.descInversion);
    expect(storeSpy.actualizar3521).toHaveBeenCalledWith(resp['3521']);
    expect(storeSpy.actualizar3522).toHaveBeenCalledWith(resp['3522']);
    expect(storeSpy.actualizarClaveEnumeracionD0).toHaveBeenCalledWith(resp.claveEnumeracionD0);
    expect(storeSpy.actualizarClaveEnumeracionD1).toHaveBeenCalledWith(resp.claveEnumeracionD1);
    expect(storeSpy.actualizarClaveEnumeracionD2).toHaveBeenCalledWith(resp.claveEnumeracionD2);
    expect(storeSpy.actualizarClaveEnumeracionD3).toHaveBeenCalledWith(resp.claveEnumeracionD3);
    expect(storeSpy.actualizarClaveEnumeracionH).toHaveBeenCalledWith(resp.claveEnumeracionH);
    expect(storeSpy.actualizarTextoGenerico4).toHaveBeenCalledWith(resp.textoGenerico4);
    expect(storeSpy.actualizarTextoGenerico5).toHaveBeenCalledWith(resp.textoGenerico5);
    expect(storeSpy.actualizar3523).toHaveBeenCalledWith(resp['3523']);
    expect(storeSpy.actualizar3528).toHaveBeenCalledWith(resp['3528']);
    expect(storeSpy.actualizar3529).toHaveBeenCalledWith(resp['3529']);
    expect(storeSpy.actualizarTextoGenerico6).toHaveBeenCalledWith(resp.textoGenerico6);
    expect(storeSpy.actualizarTextoGenerico7).toHaveBeenCalledWith(resp.textoGenerico7);
    expect(storeSpy.actualizar3530).toHaveBeenCalledWith(resp['3530']);
    expect(storeSpy.actualizar3531).toHaveBeenCalledWith(resp['3531']);
    expect(storeSpy.actualizarTextoGenerico9).toHaveBeenCalledWith(resp.textoGenerico9);
    expect(storeSpy.actualizarTextoGenerico10).toHaveBeenCalledWith(resp.textoGenerico10);
    expect(storeSpy.actualizarTextoGenerico11).toHaveBeenCalledWith(resp.textoGenerico11);
    expect(storeSpy.actualizarTextoGenerico12).toHaveBeenCalledWith(resp.textoGenerico12);
    expect(storeSpy.actualizarTextoGenerico13).toHaveBeenCalledWith(resp.textoGenerico13);
    expect(storeSpy.actualizarTextoGenerico14).toHaveBeenCalledWith(resp.textoGenerico14);
    expect(storeSpy.actualizarTextoGenerico15).toHaveBeenCalledWith(resp.textoGenerico15);
    expect(storeSpy.actualizarTextoGenerico16).toHaveBeenCalledWith(resp.textoGenerico16);
    expect(storeSpy.actualizarTextoGenerico17).toHaveBeenCalledWith(resp.textoGenerico17);
    expect(storeSpy.actualizarTextoGenerico18).toHaveBeenCalledWith(resp.textoGenerico18);
    expect(storeSpy.actualizarTextoGenerico19).toHaveBeenCalledWith(resp.textoGenerico19);
    expect(storeSpy.actualizarTextoGenerico20).toHaveBeenCalledWith(resp.textoGenerico20);
    expect(storeSpy.actualizarTextoGenerico21).toHaveBeenCalledWith(resp.textoGenerico21);
    expect(storeSpy.actualizarTextoGenerico22).toHaveBeenCalledWith(resp.textoGenerico22);
    expect(storeSpy.actualizarTextoGenerico23).toHaveBeenCalledWith(resp.textoGenerico23);
    expect(storeSpy.actualizarTextoGenerico24).toHaveBeenCalledWith(resp.textoGenerico24);
    expect(storeSpy.actualizarAlerta1).toHaveBeenCalledWith(resp.alerta1);
    expect(storeSpy.actualizarAlerta2).toHaveBeenCalledWith(resp.alerta2);
    expect(storeSpy.actualizarPolizaDeFianzaActual).toHaveBeenCalledWith(resp.polizaDeFianzaActual);
    expect(storeSpy.actualizarNumeroFolio).toHaveBeenCalledWith(resp.numeroFolio);
    expect(storeSpy.actualizarRfcInstitucion).toHaveBeenCalledWith(resp.rfcInstitucion);
    expect(storeSpy.actualizarFechaExpedicion).toHaveBeenCalledWith(resp.fechaExpedicion);
    expect(storeSpy.actualizarFechaInicioVigenciaNo).toHaveBeenCalledWith(resp.fechaInicioVigenciaNo);
    expect(storeSpy.actualizarFechaFinVigenciaNo).toHaveBeenCalledWith(resp.fechaFinVigenciaNo);
    expect(storeSpy.actualizarFechaInicioVigencia).toHaveBeenCalledWith(resp.fechaInicioVigencia);
    expect(storeSpy.actualizarFechaFinVigencia).toHaveBeenCalledWith(resp.fechaFinVigencia);
    expect(storeSpy.actualizarImporteTotal).toHaveBeenCalledWith(resp.importeTotal);
    expect(storeSpy.actualizarRazonSocialAnterior).toHaveBeenCalledWith(resp.razonSocialAnterior);
    expect(storeSpy.actualizarRazonSocialActual).toHaveBeenCalledWith(resp.razonSocialActual);
    expect(storeSpy.actualizarRfc).toHaveBeenCalledWith(resp.rfc);
    expect(storeSpy.actualizarCurp).toHaveBeenCalledWith(resp.curp);
    expect(storeSpy.actualizarNombre).toHaveBeenCalledWith(resp.nombre);
    expect(storeSpy.actualizarApellidoPaterno).toHaveBeenCalledWith(resp.apellidoPaterno);
    expect(storeSpy.actualizarApellidoMaterno).toHaveBeenCalledWith(resp.apellidoMaterno);
  });
});