import { TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { of, Subject } from 'rxjs';
import { Tramite260101Query } from '../../estados/tramite260101Query.query';
import {
  Tramite260101State,
  Tramite260101Store,
} from '../../estados/tramite260101Store.store';
import {
  ConsultaioQuery,
  ConsultaioState,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import { ImportacionProductosService } from '../../services/importacion-productos.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { ActivatedRoute } from '@angular/router';
import { TABLA_OPCION_DATA } from '../../../../shared/constantes/datos-solicitud.enum';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: any;
  let tramite260101QueryMock: any;
  let tramite260101StoreMock: any;
  let consultaQueryMock: any;
  let importacionProductosServiceMock: any;

  const consultaioStateMock: ConsultaioState = {
    procedureId: '260101',
    update: true,
    readonly: false,
  } as any;

  beforeEach(async () => {
    tramite260101QueryMock = {
      getTabSeleccionado$: of(2),
      selectTramiteState$: of({
        destinatarioFinalTablaDatos: [],
        facturadorTablaDatos: [],
        proveedorTablaDatos: [],
        fabricanteTablaDatos: [],
        destinatarioFinalTablaModificaDatos: [],
        facturadorTablaModificaDatos: [],
        proveedorTablaModificaDatos: [],
        fabricanteTablaModificaDatos: [],
        datosSolicitudFormState: {
          rfcSanitario: '',
          denominacionRazon: '',
          correoElectronico: '',
          codigoPostal: '',
          estado: '',
          municipioAlcaldia: '',
          localidad: '',
          colonia: '',
          calle: '',
          lada: '',
          telefono: '',
          aviso: '',
          licenciaSanitaria: '',
          regimen: '',
          adunasDeEntradas: '',
          aeropuerto: false,
          publico: 'si',
          representanteRfc: '',
          representanteNombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          manifesto: false,
        },
        mercanciaForm: {
          clasificacionProducto: '',
          especificarClasificacionProducto: '',
          denominacionEspecificaProducto: '',
          denominacionDistintiva: '',
          denominacionComun: '',
          tipoProducto: '',
          formaFarmaceutica: '',
          estadoFisico: '',
          fraccionArancelaria: '',
          descripcionFraccion: '',
          cantidadUmtValor: '',
          cantidadUmt: '',
          cantidadUmcValor: '',
          cantidadUmc: '',
          presentacion: '',
          numeroRegistroSanitario: '',
          fechaCaducidad: '',
          paisDeOriginDatos: [],
          paisDeProcedenciaDatos: [],
        },
        opcionConfigDatos: TABLA_OPCION_DATA,
        scianConfigDatos: [],
        tablaMercanciasConfigDatos: [],
        seleccionadoopcionDatos: [],
        seleccionadoScianDatos: [],
        seleccionadoTablaMercanciasDatos: [],
        opcionesColapsableState: false,
        pagoDerechos: {
          claveReferencia: '',
          cadenaDependencia: '',
          estado: '',
          llavePago: '',
          fechaPago: '',
          importePago: '',
        },
        tabSeleccionado: 1,
      } as Tramite260101State),
    };
    tramite260101StoreMock = {
      update: jest.fn(),
      updateTabSeleccionado: jest.fn(),
    };
    consultaQueryMock = {
      selectConsultaioState$: of(consultaioStateMock),
    };
    importacionProductosServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest
        .fn()
        .mockReturnValue(of({ test: 'data' })),
    };

    await TestBed.configureTestingModule({
      imports: [
        PasoUnoComponent,
        CommonModule,
        SolicitanteComponent,
        ContenedorDeDatosSolicitudComponent,
        TercerosRelacionadosVistaComponent,
        PagoDeDerechosContenedoraComponent,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: Tramite260101Query, useValue: tramite260101QueryMock },
        { provide: Tramite260101Store, useValue: tramite260101StoreMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        {
          provide: ImportacionProductosService,
          useValue: importacionProductosServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
            snapshot: { paramMap: new Map([['id', '123']]) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    component.consultaState = consultaioStateMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to selectConsultaioState$ and set consultaState and formularioDeshabilitado', () => {
    expect(component.consultaState).toEqual(consultaioStateMock);
    expect(component.formularioDeshabilitado).toBe(false);
  });

  it('should set esDatosRespuesta to true and call guardarDatosFormulario if consultaState matches in ngOnInit', () => {
    const guardarDatosFormularioSpy = jest.spyOn(
      component,
      'guardarDatosFormulario'
    );
    component.consultaState = {
      procedureId: '260101',
      update: true,
      readonly: false,
    } as any;
    component.ngOnInit();
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true if consultaState does not match in ngOnInit', () => {
    component.consultaState = {
      procedureId: 'other',
      update: false,
      readonly: false,
    } as any;
    component.esDatosRespuesta = false;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should update indice when getTabSeleccionado$ emits', () => {
    component.indice = 1;
    component.ngOnInit();
    expect(component.indice).toBe(2);
  });

  it('guardarDatosFormulario should set esDatosRespuesta and call actualizarEstadoFormulario', () => {
    const actualizarEstadoFormularioSpy = jest.spyOn(
      component,
      'actualizarEstadoFormulario'
    );
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(actualizarEstadoFormularioSpy).toHaveBeenCalledWith({
      test: 'data',
    });
  });

  it('actualizarEstadoFormulario should call tramite260101Store.update', () => {
    const datos = { foo: 'bar' } as any;
    component.actualizarEstadoFormulario(datos);
    expect(tramite260101StoreMock.update).toHaveBeenCalled();
  });

  it('getRegistroTomaMuestrasMercanciasData should call importacionProductosService.getRegistroTomaMuestrasMercanciasData', () => {
    component.getRegistroTomaMuestrasMercanciasData();
    expect(
      importacionProductosServiceMock.getRegistroTomaMuestrasMercanciasData
    ).toHaveBeenCalled();
  });

  it('seleccionaTab should call tramite260101Store.updateTabSeleccionado', () => {
    component.seleccionaTab(3);
    expect(tramite260101StoreMock.updateTabSeleccionado).toHaveBeenCalledWith(
      3
    );
  });

  describe('validarPasoUno', () => {
    it('should return true if contenedorDeDatosSolicitudComponent.validarContenedor returns true', () => {
      component.contenedorDeDatosSolicitudComponent = {
        validarContenedor: () => true,
      } as any;
      expect(component.validarPasoUno()).toBe(true);
    });

    it('should return false if contenedorDeDatosSolicitudComponent is undefined', () => {
      component.contenedorDeDatosSolicitudComponent = undefined as any;
      expect(component.validarPasoUno()).toBe(false);
    });

    it('should return false if validarContenedor returns false', () => {
      component.contenedorDeDatosSolicitudComponent = {
        validarContenedor: () => false,
      } as any;
      expect(component.validarPasoUno()).toBe(false);
    });
  });

  it('ngOnDestroy should complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(
      (component as any).destroyNotifier$,
      'complete'
    );
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
