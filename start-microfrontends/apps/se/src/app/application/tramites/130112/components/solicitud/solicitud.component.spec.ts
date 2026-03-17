import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Catalogo } from '@ng-mf/data-access-user';
import { Component, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ImportacionMaterialDeInvestigacionCientificaService } from '../../services/importacion-material-de-investigacion-cientifica.service';
import { Tramite130112Store } from '../../estados/tramites/tramites130112.store';
import { Tramite130112Query } from '../../estados/queries/tramite130112.query';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { ConsultaioQuery } from '@ng-mf/data-access-user';



@Component({ selector: 'app-partidas-de-la-mercancia', template: '' })
class PartidasDeLaMercanciaStubComponent { }

@Component({ selector: 'app-datos-del-tramite', template: '' })
class DatosDelTramiteStubComponent { }

@Component({ selector: 'app-datos-de-la-mercancia', template: '' })
class DatosDeLaMercanciaStubComponent { }

@Component({ selector: 'app-pais-procendencia', template: '' })
class PaisProcendenciaStubComponent {
  @Input() fechas: any[] = [];
  @Input() fechasSeleccionadas: any[] = [];
}

@Component({ selector: 'app-representacion', template: '' })
class RepresentacionStubComponent { }

/**
 * Unit tests for the `SolicitudComponent`.
 * This suite ensures all public methods, properties, and lifecycle hooks are tested.
 */
describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let mockStore: jest.Mocked<Tramite130112Store>;
  let mockQuery: jest.Mocked<Tramite130112Query>;
  let mockService: jest.Mocked<any>;
  let mockImportacionMaterialDeInvestigacionCientificaService: Partial<ImportacionMaterialDeInvestigacionCientificaService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  const MOCK_PRODUCT_OPTIONS: ProductoOpción[] = [
    { label: 'Nuevo', value: 'Nuevo' },
    { label: 'Usado', value: 'Usado' },
  ];
  const MOCK_CATALOGO: Catalogo[] = [
    { id: 1, descripcion: 'Option 1' },
    { id: 2, descripcion: 'Option 2' },
  ];

  beforeEach(async () => {
    mockStore = {
      actualizarEstado: jest.fn(),
      setMostrarTabla: jest.fn(),
      storeTableValues: jest.fn(),
      updateSolicitud: jest.fn(),
      setDescripcionPartidasDeLaMercancia: jest.fn(),
      setCantidadPartidasDeLaMercancia: jest.fn(),
      setValorPartidaUSDPartidasDeLaMercancia: jest.fn(),
      setregimen: jest.fn(),
      setclasificacion: jest.fn(),
      setProducto: jest.fn(),
      setDescripcion: jest.fn(),
      setCantidad: jest.fn(),
      setValorPartidaUSD: jest.fn(),
      setUnidadMedida: jest.fn(),
      setBloque: jest.fn(),
      setUsoEspecifico: jest.fn(),
      setJustificacionImportacionExportacion: jest.fn(),
      setObservaciones: jest.fn(),
      setEntidad: jest.fn(),
      setRepresentacion: jest.fn(),
    } as any;

    mockQuery = {
      mostrarTabla$: new Subject<boolean>(),
      solicitud$: of(''),
      regimen$: of(''),
      clasificacion$: of(''),
      mercanciaState$: of({
        producto: 'Nuevo',
        descripcion: '',
        fraccion: '',
        cantidad: '',
        valorPartidaUSD: 0,
        unidadMedida: '',
      }),
      selectSolicitud$: of({
        cantidadPartidasDeLaMercancia: '',
        valorPartidaUSDPartidasDeLaMercancia: '',
        descripcionPartidasDeLaMercancia: '',
        bloque: '',
        usoEspecifico: '',
        justificacionImportacionExportacion: '',
        observaciones: '',
        entidad: '',
        representacion: '',
      }),
      select: jest.fn().mockReturnValue(of({})), 
      getValue: jest.fn().mockReturnValue({})
    } as any;

    mockService = {
   
      getRepresentacionFederal: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getListaDePaisesDisponibles: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getPaisesPorBloque: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    };

    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false }),
    } as any;

    mockImportacionMaterialDeInvestigacionCientificaService = {
      getRepresentacionFederal: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getPaisesPorBloque: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getSolicitudeOptions: jest.fn().mockReturnValue(
        of({
          options: MOCK_PRODUCT_OPTIONS,
          defaultSelect: 'Inicial',
        })
      ),
      getProductoOptions: jest.fn().mockReturnValue(
        of({
          options: MOCK_PRODUCT_OPTIONS,
        })
      ),
      getTablaDatos: jest.fn().mockReturnValue(of([{ cantidad: 10, totalUSD: 1000 }])),
      getEntidadesFederativasCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getBloque: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getRegimenes: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getRegimenClasificacion: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getFraccionesArancelarias: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getUMTCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getRepresentacionFederalCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getFraccionDescripcionPartidasDeLaMercanciaService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    };

    await TestBed.configureTestingModule({
      declarations: [
        SolicitudComponent,
        PartidasDeLaMercanciaStubComponent,
        DatosDelTramiteStubComponent,
        DatosDeLaMercanciaStubComponent,
        PaisProcendenciaStubComponent,
        RepresentacionStubComponent,
      ],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: Tramite130112Store, useValue: mockStore },
        { provide: Tramite130112Query, useValue: mockQuery },
        { provide: ImportacionMaterialDeInvestigacionCientificaService, useValue: mockImportacionMaterialDeInvestigacionCientificaService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('Debe inicializar formularios y configurar suscripciones', () => {
      jest.spyOn(component, 'opcionesDeBusqueda');
      jest.spyOn(component, 'fetchEntidadFederativa');
      jest.spyOn(component, 'listaDePaisesDisponibles');
      jest.spyOn(component, 'getRegimenes');
      jest.spyOn(component, 'getFraccionArancelaria');
      jest.spyOn(component, 'getUMTCatalogo');
      jest.spyOn(component, 'enCambioDeBloque');

      component.ngOnInit();

      expect(component.opcionesDeBusqueda).toHaveBeenCalled();
      expect(component.fetchEntidadFederativa).toHaveBeenCalled();
      expect(component.listaDePaisesDisponibles).toHaveBeenCalled();
      expect(component.getRegimenes).toHaveBeenCalled();
      expect(component.getFraccionArancelaria).toHaveBeenCalled();
      expect(component.getUMTCatalogo).toHaveBeenCalled();
      expect(component.enCambioDeBloque).toHaveBeenCalledWith(105);
    });

    it('Debería actualizar mostrarTabla según la consulta', () => {
      const MONSTER_TABLE_SUBJECT = new Subject<boolean>();
      mockQuery.mostrarTabla$ = MONSTER_TABLE_SUBJECT.asObservable();

      component.ngOnInit();
      MONSTER_TABLE_SUBJECT.next(true);

      expect(component.mostrarTabla).toBe(true);
    });

  });

  describe('inicializarFormularios', () => {
    it('debe inicializar todas las formas reactivas', () => {
      component.inicializarFormularios();

      expect(component.formDelTramite).toBeDefined();
      expect(component.mercanciaForm).toBeDefined();
      expect(component.partidasDelaMercanciaForm).toBeDefined();
      expect(component.paisForm).toBeDefined();
      expect(component.frmRepresentacionForm).toBeDefined();

      expect(component.formDelTramite.get('solicitud')).toBeDefined();
      expect(component.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')).toBeDefined();
      expect(component.paisForm.get('bloque')).toBeDefined();
      expect(component.frmRepresentacionForm.get('entidad')).toBeDefined();
    });
  });

  describe('opcionesDeBusqueda', () => {
    it('Debería obtener las opciones de solicitud y producto', () => {
      component.opcionesDeBusqueda();

      expect(mockImportacionMaterialDeInvestigacionCientificaService.getSolicitudeOptions).toHaveBeenCalled();
    
      expect(mockImportacionMaterialDeInvestigacionCientificaService.getProductoOptions).toHaveBeenCalled();
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
        producto: 'Nuevo',
        defaultProducto: 'Nuevo',
      });
    });
  });

describe('validarYEnviarFormulario', () => {
  it('Debe establecer mostrarTabla como verdadero si el formulario es válido', () => {
    component.unidadCatalogo = [{ id: 1, descripcion: 'Pieza' }];
    component.fraccionCatalogo = [{ id: 1234, descripcion: 'Fracción Test' }];

    component.mercanciaForm = TestBed.inject(FormBuilder).group({
      cantidad: ['10', [Validators.required, Validators.pattern('^[0-9]+$')]],
      valorFacturaUSD: ['100', Validators.required],
      fraccion: ['1234', Validators.required],
      unidadMedida: ['1', Validators.required], 
      descripcion: ['desc', Validators.required],
    });

    component.partidasDelaMercanciaForm = TestBed.inject(FormBuilder).group({
      cantidadPartidasDeLaMercancia: ['10', [Validators.required, Validators.pattern('^[0-9]+$')]],
      descripcionPartidasDeLaMercancia: ['Test', Validators.required],
      valorPartidaUSDPartidasDeLaMercancia: ['100', Validators.required],
    });

    component.mercanciaForm.get('fraccion')?.setValue('1234');

    component.validarYEnviarFormulario();

    expect(component.mostrarTabla).toBe(true);
  });


    it('Debe establecer mostrarTabla como verdadero si el formulario es válido', () => {
      component.unidadCatalogo = [{ id: 1, descripcion: 'Pieza' }];
      component.fraccionCatalogo = [{ id: 1234, descripcion: 'Fracción Test' }];

      component.mercanciaForm = TestBed.inject(FormBuilder).group({
        cantidad: ['10', [Validators.required, Validators.pattern('^[0-9]+$')]],
        valorFacturaUSD: ['100', Validators.required],
        fraccion: ['1234', Validators.required],
        unidadMedida: ['1', Validators.required], 
        descripcion: ['desc', Validators.required],
      });

      component.partidasDelaMercanciaForm = TestBed.inject(FormBuilder).group({
        cantidadPartidasDeLaMercancia: ['10', [Validators.required, Validators.pattern('^[0-9]+$')]],
        descripcionPartidasDeLaMercancia: ['Test', Validators.required],
        valorPartidaUSDPartidasDeLaMercancia: ['100', Validators.required],
        fraccionTigiePartidasDeLaMercancia: ['1234', Validators.required],
        fraccionDescripcionPartidasDeLaMercancia: ['Test Description', Validators.required],
      });

      component.mercanciaForm.get('fraccion')?.setValue('1234');
      component.partidasDelaMercanciaForm.get('fraccionDescripcionPartidasDeLaMercancia')?.setValue('Test Description');

      component.validarYEnviarFormulario();

      expect(component.mostrarTabla).toBe(true);
    });
  });

  describe('navegarParaModificarPartida', () => {
    it('Debería actualizar el estado y mostrarTabla si hay fila seleccionada', () => {
      component.filaSeleccionada = [{ id:'1', cantidad: '10', descripcion: 'Item', precioUnitarioUSD: '50', unidadDeMedida: 'kg', fraccionFrancelaria: '1234', totalUSD: '100' }];

      component.navegarParaModificarPartida();

    });
  });

  describe('fetchEntidadFederativa', () => {
    it('Debería obtener la lista de entidades federativas', () => {
      component.fetchEntidadFederativa(); 
    
      expect(component.entidadFederativa).toEqual(MOCK_CATALOGO);
    });
  });

  describe('fetchRepresentacionFederal', () => {
    it('Debería obtener la lista de representaciones federales', () => {
      component.fetchRepresentacionFederal();

      expect(mockImportacionMaterialDeInvestigacionCientificaService.getRepresentacionFederal).toHaveBeenCalled();
      expect(component.representacionFederal).toEqual(MOCK_CATALOGO);
    });
  });

  describe('listaDePaisesDisponibles', () => {
    it('Debería obtener la lista de países disponibles', () => {
      component.listaDePaisesDisponibles();

      expect(component.elementosDeBloque).toEqual(MOCK_CATALOGO);
    });
  });

  describe('fetchPaisesPorBloque', () => {
    it('Debería obtener países por bloque y actualizar selectRangoDias', () => {
      component.fetchPaisesPorBloque(1);

      expect(mockImportacionMaterialDeInvestigacionCientificaService.getPaisesPorBloque).toHaveBeenCalledWith('130112', '1');
      expect(component.paisesPorBloque).toEqual(MOCK_CATALOGO);
      expect(component.selectRangoDias).toEqual(['Option 1', 'Option 2']);
    });
  });

  describe('enCambioDeBloque', () => {
    it('Debería llamar a fetchPaisesPorBloque con el bloqueId', () => {
      jest.spyOn(component, 'fetchPaisesPorBloque');

      component.enCambioDeBloque(2);

      expect(component.fetchPaisesPorBloque).toHaveBeenCalledWith(2);
    });
  });

  describe('setValoresStore', () => {
    it('Debería actualizar el store según el método especificado', () => {
      component.mercanciaForm = TestBed.inject(FormBuilder).group({
        producto: ['Nuevo'], 
      });
  
      component.setValoresStore({
        form: component.mercanciaForm,
        campo: 'producto',
        
      });
  
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({ producto: 'Nuevo' });
    });
  });

 
});
