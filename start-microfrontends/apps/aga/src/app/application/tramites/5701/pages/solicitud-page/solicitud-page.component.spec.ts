import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { GuardaSolicitudService } from '../../../../core/services/5701/guardar/guarda-solicitud.service';
import { SeccionLibQuery, SeccionLibStore, TercerosQuery } from '@ng-mf/data-access-user';
import { Tramite5701Query } from '../../../../core/queries/tramite5701.query';
import { of, Subject } from 'rxjs';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let mockGuardaSolicitudService: any;
  let mockSeccionLibQuery: any;
  let mockSeccionLibStore: any;
  let mockTramite5701Query: any;
  let mockTercerosQuery: any;

  beforeEach(async () => {
    mockGuardaSolicitudService = {
      postSolicitud: jest.fn().mockReturnValue(of({ datos: { id_solicitud: 123 } }))
    };
    mockSeccionLibQuery = {
      selectSeccionState$: of({}),
    };
    mockSeccionLibStore = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn(),
    };
    mockTramite5701Query = {
      selectSolicitud$: of({
        personasResponsablesDespacho: [],
        pedimentos: [],
        transporteArriboDatos: [],
        transporte: [],
        selectRangoDias: [],
        idSolicitud: 0,
        RFCImportadorExportador: 'RFC123',
        nombre: 'Empresa',
        industriaAutomotriz: false,
        descripcionIndustrialAutomotriz: '',
        programa: '',
        descripcionProgramaFomento: '',
        checkIMMEX: false,
        descripcionImmex: '',
        descripcionNumeroRegistro: '',
        tipoEmpresaCertificada: '',
        socioComercial: '',
        idSocioComercial: '',
        certificacionOEA: false,
        revision: false,
        aduanaDespacho: 850,
        idSeccionDespacho: '1',
        lda: false,
        autorizacionLDA: '',
        dd: false,
        autorizacionDDEX: '',
        descripcionTipoDespacho: '',
        nombreRecinto: '',
        domicilioDespacho: '',
        especifique: '',
        fechaInicio: '',
        fechaFinal: '',
        horaInicio: '',
        horaFinal: '',
        tipoOperacion: '',
        encargoConferido: false,
        relacionSociedad: false,
        tipoSolicitud: '',
        descripcionTipoSolicitud: '',
        patente: { patente: '1234' },
        lineaCaptura: '',
        monto: '0',
        paisOrigen: 1,
        descripcionGenerica: '',
        justificacion: '',
        paisProcedencia: 1,
        tipoTransporteArriboSalida: '1',
        tipoTransporte: '1'
      }),
    };
    mockTercerosQuery = {
      selectTerceros$: of({
        terceros: [
          { correo: 'test@mail.com', nombre: 'Persona' }
        ]
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [SolicitudPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: GuardaSolicitudService, useValue: mockGuardaSolicitudService },
        { provide: SeccionLibQuery, useValue: mockSeccionLibQuery },
        { provide: SeccionLibStore, useValue: mockSeccionLibStore },
        { provide: Tramite5701Query, useValue: mockTramite5701Query },
        { provide: TercerosQuery, useValue: mockTercerosQuery },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      indiceActual: 0
    } as any as WizardComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select a tab and update indice', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should emit cargarArchivosEvento on onClickCargaArchivos', () => {
    jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(component.cargarArchivosEvento.emit).toHaveBeenCalled();
  });

  it('should emit regresarSeccionCargarDocumentoEvento on anteriorSeccionCargarDocumento', () => {
    jest.spyOn(component.regresarSeccionCargarDocumentoEvento, 'emit');
    component.anteriorSeccionCargarDocumento();
    expect(component.regresarSeccionCargarDocumentoEvento.emit).toHaveBeenCalled();
  });

  it('should update activarBotonCargaArchivos on manejaEventoCargaDocumentos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('should update seccionCargarDocumentos on cargaRealizada', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('obtenerPersonasNotificacion should return correct list', () => {
    component.tercerosState = { terceros: [{ correo: 'a@b.com', nombre: 'Test' }] } as any;
    const result = component.obtenerPersonasNotificacion();
    expect(result[0].correo_electronico).toBe('a@b.com');
    expect(result[0].nombreTercero).toBe('Test');
  });

  it('obtenerResponsablesDespacho should return correct list', () => {
    component.solicitudState = { personasResponsablesDespacho: [{ gafeteRespoDespacho: '1', nombre: 'A', primerApellido: 'B', segundoApellido: 'C' }] } as any;
    const result = component.obtenerResponsablesDespacho();
    expect(result[0].gafete).toBe('1');
    expect(result[0].nombre).toBe('A');
  });

  it('obtenerPedimentosLista should return correct list', () => {
    component.solicitudState = { pedimentos: [{ patente: '1', pedimento: 2, aduana: 3, tipoPedimento: 4, numero: '5', comprobanteValor: '6', estadoPedimento: '7', subEstadoPedimento: '8', pedimentoValidado: 'SI' }] } as any;
    const result = component.obtenerPedimentosLista();
    expect(result[0].patente).toBe('1');
    expect(result[0].bln_valido_pedimento).toBe(true);
  });

  it('obtenerFechasSevex should return correct list', () => {
    component.solicitudState = { selectRangoDias: ['2024-01-01'], horaInicio: '08:00', horaFinal: '18:00' } as any;
    const result = component.obtenerFechasSevex();
    expect(result[0].fecha).toBe('2024-01-01');
    expect(result[0].hora_inicio_svex).toBe('08:00');
  });

  it('construyeSolicitudPayload should return a valid payload', () => {
    component.solicitudState = {
      idSolicitud: 0,
      RFCImportadorExportador: 'RFC',
      nombre: 'Empresa',
      industriaAutomotriz: false,
      descripcionIndustrialAutomotriz: '',
      programa: '',
      descripcionProgramaFomento: '',
      checkIMMEX: false,
      descripcionImmex: '',
      descripcionNumeroRegistro: '',
      tipoEmpresaCertificada: '',
      socioComercial: '',
      idSocioComercial: '',
      certificacionOEA: false,
      revision: false,
      aduanaDespacho: 850,
      idSeccionDespacho: '1',
      lda: false,
      autorizacionLDA: '',
      dd: false,
      autorizacionDDEX: '',
      descripcionTipoDespacho: '',
      nombreRecinto: '',
      domicilioDespacho: '',
      especifique: '',
      fechaInicio: '',
      fechaFinal: '',
      horaInicio: '',
      horaFinal: '',
      tipoOperacion: '',
      encargoConferido: false,
      relacionSociedad: false,
      tipoSolicitud: '',
      descripcionTipoSolicitud: '',
      patente: { patente: '1234' },
      lineaCaptura: '',
      monto: '0',
      paisOrigen: 1,
      descripcionGenerica: '',
      justificacion: '',
      paisProcedencia: 1,
      personasResponsablesDespacho: [],
      pedimentos: [],
      transporteArriboDatos: [],
      transporte: [],
      selectRangoDias: [],
      tipoTransporteArriboSalida: '1',
      tipoTransporte: '1'
    } as any;
    component.tercerosState = { terceros: [] } as any;
    const payload = component.construyeSolicitudPayload();
    expect(payload.id_tipo_tramite).toBeDefined();
    expect(payload.datos_tramite.importador_exportador.rfc).toBe('RFC');
  });

  it('enviaSolicitudRequest should set folioTemporal and return true', (done) => {
    component.solicitudState = {
      idSolicitud: 0,
      RFCImportadorExportador: 'RFC',
      nombre: 'Empresa',
      industriaAutomotriz: false,
      descripcionIndustrialAutomotriz: '',
      programa: '',
      descripcionProgramaFomento: '',
      checkIMMEX: false,
      descripcionImmex: '',
      descripcionNumeroRegistro: '',
      tipoEmpresaCertificada: '',
      socioComercial: '',
      idSocioComercial: '',
      certificacionOEA: false,
      revision: false,
      aduanaDespacho: 850,
      idSeccionDespacho: '1',
      lda: false,
      autorizacionLDA: '',
      dd: false,
      autorizacionDDEX: '',
      descripcionTipoDespacho: '',
      nombreRecinto: '',
      domicilioDespacho: '',
      especifique: '',
      fechaInicio: '',
      fechaFinal: '',
      horaInicio: '',
      horaFinal: '',
      tipoOperacion: '',
      encargoConferido: false,
      relacionSociedad: false,
      tipoSolicitud: '',
      descripcionTipoSolicitud: '',
      patente: { patente: '1234' },
      lineaCaptura: '',
      monto: '0',
      paisOrigen: 1,
      descripcionGenerica: '',
      justificacion: '',
      paisProcedencia: 1,
      personasResponsablesDespacho: [],
      pedimentos: [],
      transporteArriboDatos: [],
      transporte: [],
      selectRangoDias: [],
      tipoTransporteArriboSalida: '1',
      tipoTransporte: '1'
    } as any;
    component.tercerosState = { terceros: [] } as any;
    component['enviaSolicitudRequest']().subscribe(result => {
      expect(result).toBe(true);
      expect(component.folioTemporal).toBe(123);
      done();
    });
  });

  it('getValorIndice should call enviaSolicitudRequest and handle success', () => {
    component.indice = 1;
    // Asegúrate de que solicitudState tenga todas las propiedades de tipo array inicializadas
    component.solicitudState = {
      personasResponsablesDespacho: [],
      pedimentos: [],
      transporteArriboDatos: [],
      transporte: [],
      selectRangoDias: [],
      idSolicitud: 0,
      RFCImportadorExportador: 'RFC',
      nombre: 'Empresa',
      industriaAutomotriz: false,
      descripcionIndustrialAutomotriz: '',
      programa: '',
      descripcionProgramaFomento: '',
      checkIMMEX: false,
      descripcionImmex: '',
      descripcionNumeroRegistro: '',
      tipoEmpresaCertificada: '',
      socioComercial: '',
      idSocioComercial: '',
      certificacionOEA: false,
      revision: false,
      aduanaDespacho: 850,
      idSeccionDespacho: '1',
      lda: false,
      autorizacionLDA: '',
      dd: false,
      autorizacionDDEX: '',
      descripcionTipoDespacho: '',
      nombreRecinto: '',
      domicilioDespacho: '',
      especifique: '',
      fechaInicio: '',
      fechaFinal: '',
      horaInicio: '',
      horaFinal: '',
      tipoOperacion: '',
      encargoConferido: false,
      relacionSociedad: false,
      tipoSolicitud: '',
      descripcionTipoSolicitud: '',
      patente: { patente: '1234' },
      lineaCaptura: '',
      monto: '0',
      paisOrigen: 1,
      descripcionGenerica: '',
      justificacion: '',
      paisProcedencia: 1,
      tipoTransporteArriboSalida: '1',
      tipoTransporte: '1'
    } as any;
    (component as any).enviaSolicitudRequest = jest.fn().mockReturnValue(of(true));
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('getValorIndice should update indice and call wizardComponent methods for non-step-1', () => {
    component.indice = 2;
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.getValorIndice({ accion: 'cont', valor: 3 });
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    component.getValorIndice({ accion: 'back', valor: 2 });
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });
});