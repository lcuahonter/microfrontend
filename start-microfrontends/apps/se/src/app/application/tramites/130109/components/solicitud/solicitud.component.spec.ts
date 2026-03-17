import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { Catalogo } from '@ng-mf/data-access-user';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { Component, Input } from '@angular/core';
import { Tramite130109Query } from '../../../../estados/queries/tramite130109.query';
import { Tramite130109Store } from '../../../../estados/tramites/tramites130109.store';
import { VehiculosUsadosAdaptadosService } from '../../services/vehiculos-usados-adaptados.service';

@Component({ selector: 'app-partidas-de-la-mercancia', template: '' })
class PartidasDeLaMercanciaStubComponent {}

@Component({ selector: 'app-datos-del-tramite', template: '' })
class DatosDelTramiteStubComponent {}

@Component({ selector: 'app-datos-de-la-mercancia', template: '' })
class DatosDeLaMercanciaStubComponent {}

@Component({ selector: 'app-pais-procendencia', template: '' })
class PaisProcendenciaStubComponent {
  @Input() fechas: any[] = [];
  @Input() fechasSeleccionadas: any[] = [];
}

@Component({ selector: 'app-representacion', template: '' })
class RepresentacionStubComponent {}

const mockPartidasdelaTable = {
  cantidad :"10",
  unidadDeMedida :"kg",
  fraccionFrancelaria :"1234",
  descripcion:"Item",
  precioUnitarioUSD :"50",
  totalUSD:"100",
};

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let mockStore: jest.Mocked<Tramite130109Store>;
  let mockQuery: jest.Mocked<Tramite130109Query>;
  let mockService: jest.Mocked<any>;
  let mockVehiculosUsadosAdaptadosService: Partial<VehiculosUsadosAdaptadosService>;

  const MOCK_PRODUCTO_OPTIONS: ProductoOpción[] = [
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
      getEntidadFederativa: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getRepresentacionFederal: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getListaDePaisesDisponibles: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getPaisesPorBloque: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    };
    jest.spyOn(mockService, 'getEntidadFederativa');

    await TestBed.configureTestingModule({
      declarations: [
        SolicitudComponent,
        PartidasDeLaMercanciaStubComponent,
        DatosDelTramiteStubComponent,
        DatosDeLaMercanciaStubComponent,
        PaisProcendenciaStubComponent,
        RepresentacionStubComponent,
      ],
      imports: [ReactiveFormsModule,HttpClientModule],
      providers: [
        FormBuilder,
        { provide: Tramite130109Store, useValue: mockStore },
        { provide: Tramite130109Query, useValue: mockQuery },
        { provide: VehiculosUsadosAdaptadosService, useValue: mockVehiculosUsadosAdaptadosService },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    mockVehiculosUsadosAdaptadosService = {
      getRegimenCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getClasificacionRegimenCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getPaisesPorBloqueService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getFraccionCatalogoService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getEntidadesFederativasCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getBloqueService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    };
  
    await TestBed.configureTestingModule({
      declarations: [SolicitudComponent],
      providers: [
        { provide: VehiculosUsadosAdaptadosService, useValue: mockVehiculosUsadosAdaptadosService },
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
      jest.spyOn(component, 'inicializarFormularios');

      component.ngOnInit();

      expect(component.formForTotalCount).toHaveBeenCalled();
      expect(component.entidadFederativa).toHaveBeenCalled();
      expect(component.representacionFederal).toHaveBeenCalled();
    });

    it('Debería actualizar mostrarTabla según la consulta', () => {
      const MONSTER_TABLA_SUBJECT = new Subject<boolean>();
      mockQuery.mostrarTabla$ = MONSTER_TABLA_SUBJECT.asObservable();

      component.ngOnInit();
      MONSTER_TABLA_SUBJECT.next(true);

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
      expect(component.mercanciaForm.get('producto')?.value).toBe(null);
      expect(component.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')).toBeDefined();
      expect(component.paisForm.get('bloque')).toBeDefined();
      expect(component.frmRepresentacionForm.get('entidad')).toBeDefined();
    });
  });

  describe('opcionesDeBusqueda', () => {
    it('Debería obtener las opciones de solicitud y producto', () => { 
      mockStore.actualizarEstado({ solicitud: 'Nuevo', defaultSelect: 'Inicial' });     
      expect(mockStore.actualizarEstado).toHaveBeenNthCalledWith(1, {
        solicitud: 'Nuevo',
        defaultSelect: 'Inicial',
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

    it('No debe establecer mostrarTabla si el formulario es inválido', () => {
      component.mercanciaForm = TestBed.inject(FormBuilder).group({
        cantidad: ['', [Validators.required]],
        valorFacturaUSD: ['', Validators.required],
        fraccion: ['', Validators.required],
        unidadMedida: ['', Validators.required],
        descripcion: ['', Validators.required],
      });
      component.partidasDelaMercanciaForm = TestBed.inject(FormBuilder).group({
        cantidadPartidasDeLaMercancia: ['', [Validators.required]],
        descripcionPartidasDeLaMercancia: ['', Validators.required],
        valorPartidaUSDPartidasDeLaMercancia: ['', Validators.required],
      });
      component.validarYEnviarFormulario();
      expect(component.mostrarTabla).toBeFalsy();
    });
  });

  describe('Formulario de mercancia', () => {
    it('Debe marcar el formulario como inválido si falta un campo requerido', () => {
      component.mercanciaForm = TestBed.inject(FormBuilder).group({
        cantidad: ['', [Validators.required]],
        valorFacturaUSD: ['100', Validators.required],
        fraccion: ['1234', Validators.required],
        unidadMedida: ['1', Validators.required],
        descripcion: ['desc', Validators.required],
      });
      expect(component.mercanciaForm.valid).toBe(false);
    });

    it('Debe marcar el formulario como válido si todos los campos están completos', () => {
      component.mercanciaForm = TestBed.inject(FormBuilder).group({
        cantidad: ['10', [Validators.required]],
        valorFacturaUSD: ['100', Validators.required],
        fraccion: ['1234', Validators.required],
        unidadMedida: ['1', Validators.required],
        descripcion: ['desc', Validators.required],
      });
      expect(component.mercanciaForm.valid).toBe(true);
    });
  });

  describe('partidasDelaMercanciaForm', () => {
    it('Debe marcar el formulario como inválido si valorPartidaUSDPartidasDeLaMercancia es vacío', () => {
      component.partidasDelaMercanciaForm = TestBed.inject(FormBuilder).group({
        cantidadPartidasDeLaMercancia: ['10', [Validators.required]],
        descripcionPartidasDeLaMercancia: ['Test', Validators.required],
        valorPartidaUSDPartidasDeLaMercancia: ['', Validators.required],
      });
      expect(component.partidasDelaMercanciaForm.valid).toBe(false);
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

    it('No debe actualizar el store si el campo no existe en el formulario', () => {
      const spy = jest.spyOn(mockStore, 'actualizarEstado');
      component.mercanciaForm = TestBed.inject(FormBuilder).group({
        producto: ['Nuevo'],
      });
      component.setValoresStore({
        form: component.mercanciaForm,
        campo: 'noExiste',
      });
      expect(spy).toHaveBeenCalledWith({ noExiste: undefined });
    });
  });

  describe('enCambioDeBloque', () => {
    it('Debería llamar a fetchPaisesPorBloque con el bloqueId', () => {

      component.enCambioDeBloque(2);

      expect(component.getPaisesPorBloque).toHaveBeenCalledWith(2);
    });
  });
 
  describe('navegarParaModificarPartida', () => {
    it('Debería actualizar el estado y mostrarTabla si hay fila seleccionada', () => {
      component.filaSeleccionada = [{ id:'1', cantidad: '10', descripcion: 'Item', precioUnitarioUSD: '50', unidadDeMedida: 'kg', fraccionFrancelaria: '1234', totalUSD: '100' }];

      component.navegarParaModificarPartida();

      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({mostrarTabla:true});
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({filaSeleccionada:component.filaSeleccionada});
    });
  });

  describe('ngOnDestroy', () => {
    it('Debería completar el tema destruido$', () => {
      const DESTROY_SPY = jest.spyOn(component['destroyed$'], 'next');
      const COMPLETE_SPY = jest.spyOn(component['destroyed$'], 'complete');

      component.ngOnDestroy();

      expect(DESTROY_SPY).toHaveBeenCalled();
      expect(COMPLETE_SPY).toHaveBeenCalled();
    });
  });
});