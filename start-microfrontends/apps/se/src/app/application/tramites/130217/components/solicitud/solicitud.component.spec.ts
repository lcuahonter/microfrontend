import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ControlPermisosPreviosExportacionService } from '../../services/control-permisos-previos-exportacion.service';
import { of, Subject } from 'rxjs';
import { Catalogo } from '@ng-mf/data-access-user';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { Component, Input } from '@angular/core';
import { Tramite130217Query } from '../../../../estados/queries/tramite130217.query';
import { Tramite130217Store } from '../../../../estados/tramites/tramite130217.store';

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
  let mockStore: jest.Mocked<Tramite130217Store>;
  let mockQuery: jest.Mocked<Tramite130217Query>;
  let mockService: jest.Mocked<any>;
  let mockControlPermisosPreviosExportacionService: Partial<ControlPermisosPreviosExportacionService>;

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
        { provide: Tramite130217Store, useValue: mockStore },
        { provide: Tramite130217Query, useValue: mockQuery },
        { provide: ControlPermisosPreviosExportacionService, useValue: mockControlPermisosPreviosExportacionService },
      ],
    }).compileComponents();
  });
  beforeEach(async () => {
    mockControlPermisosPreviosExportacionService = {
      getBloqueService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getPaisesPorBloqueService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getEntidadesFederativasCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getRepresentacionFederalCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getTodosPaisesSeleccionados: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getSolicitudeOptions: jest.fn().mockReturnValue(
        of({
          options: MOCK_PRODUCTO_OPTIONS,
          defaultSelect: 'Inicial',
        })
      ),
      getRegimenCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getClasificacionRegimenCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getFraccionCatalogoService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getUMTService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    };
  
    await TestBed.configureTestingModule({
      declarations: [SolicitudComponent],
      providers: [
        { provide: ControlPermisosPreviosExportacionService, useValue: mockControlPermisosPreviosExportacionService },
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
      jest.spyOn(component, 'configuracionFormularioSuscripciones');
      jest.spyOn(component, 'getRegimenCatalogo');
      jest.spyOn(component, 'getFraccionCatalogo');
      jest.spyOn(component, 'getEntidadesFederativasCatalogo');
      jest.spyOn(component, 'getBloque');

      component.ngOnInit();

      expect(component.configuracionFormularioSuscripciones).toHaveBeenCalled();
      expect(component.getRegimenCatalogo).toHaveBeenCalled();
      expect(component.getFraccionCatalogo).toHaveBeenCalled();
      expect(component.getEntidadesFederativasCatalogo).toHaveBeenCalled();
      expect(component.getBloque).toHaveBeenCalled();
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
    it('El componente debe tener opcionesSolicitud configuradas', () => {
      expect(component.opcionesSolicitud).toBeDefined();
      expect(component.opcionesSolicitud.length).toBeGreaterThan(0);
    });

    it('El componente debe tener productoOpciones configuradas', () => {
      expect(component.productoOpciones).toBeDefined();
      expect(component.productoOpciones.length).toBeGreaterThan(0);
    });
  });


  describe('validarYEnviarFormulario', () => {
    it('Debería establecer mostrarTabla en verdadero y marcar el formulario como tocado si no es válido', () => {
      component.partidasDelaMercanciaForm = TestBed.inject(FormBuilder).group({
        cantidadPartidasDeLaMercancia: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        descripcionPartidasDeLaMercancia: ['', Validators.required],
        valorPartidaUSDPartidasDeLaMercancia: ['', Validators.required],
      });
      jest.spyOn(component.partidasDelaMercanciaForm, 'markAllAsTouched');

      component.validarYEnviarFormulario();

      expect(component.partidasDelaMercanciaForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('Debe establecer mostrarTabla como verdadero si el formulario es válido', () => {
      component.partidasDelaMercanciaForm = TestBed.inject(FormBuilder).group({
        cantidadPartidasDeLaMercancia: ['10', [Validators.required, Validators.pattern('^[0-9]+$')]],
        descripcionPartidasDeLaMercancia: ['Test', Validators.required],
        valorPartidaUSDPartidasDeLaMercancia: ['100', Validators.required],
      });

      component.validarYEnviarFormulario();

      expect(component.mostrarTabla).toBe(true);
    });
  });
  describe('navegarParaModificarPartida', () => {
    it('Debería actualizar el estado y mostrarTabla si hay fila seleccionada', () => {
      component.filaSeleccionada = [{ 
        id: '1',
        cantidad: '10', 
        descripcion: 'Item', 
        precioUnitarioUSD: '50', 
        unidadDeMedida: 'kg', 
        fraccionFrancelaria: '1234', 
        totalUSD: '100' 
      }];

      component.navegarParaModificarPartida();

      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({mostrarTabla:true});
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({filaSeleccionada:component.filaSeleccionada});
    });
  });
  describe('getEntidadesFederativasCatalogo', () => {
    it('Debería obtener la lista de entidades federativas', () => {
      component.getEntidadesFederativasCatalogo(); 
    
      expect(mockControlPermisosPreviosExportacionService.getEntidadesFederativasCatalogo).toHaveBeenCalled(); 
      expect(component.entidadFederativa).toEqual(MOCK_CATALOGO);
    });
  });

  describe('getRepresentacionFederalCatalogo', () => {
    it('Debería obtener la lista de representaciones federales', () => {
      component.getRepresentacionFederalCatalogo('DGO');

      expect(mockControlPermisosPreviosExportacionService.getRepresentacionFederalCatalogo).toHaveBeenCalled();
      expect(component.representacionFederal).toEqual(MOCK_CATALOGO);
    });
  });

  describe('getBloque', () => {
    it('Debería obtener la lista de bloques disponibles', () => {
      component.getBloque();

      expect(mockControlPermisosPreviosExportacionService.getBloqueService).toHaveBeenCalled();
      expect(component.elementosDeBloque).toEqual(MOCK_CATALOGO);
    });
  });

  describe('getPaisesPorBloque', () => {
    it('Debería obtener países por bloque', () => {
      component.getPaisesPorBloque('1');

      expect(mockControlPermisosPreviosExportacionService.getPaisesPorBloqueService).toHaveBeenCalledWith('130217', '1');
      expect(component.paisesPorBloque).toEqual(MOCK_CATALOGO);
    });
  });
  describe('enCambioDeBloque', () => {
    it('Debería llamar a getPaisesPorBloque con el bloqueId', () => {
      jest.spyOn(component, 'getPaisesPorBloque');

      component.enCambioDeBloque(2);

      expect(component.getPaisesPorBloque).toHaveBeenCalledWith('2');
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
  describe('ngOnDestroy', () => {
    it('Debería completar el tema destruido$', () => {
      const DESTROY_SPY = jest.spyOn(component['destroyed$'], 'next');
      const COMPLETE_SPY = jest.spyOn(component['destroyed$'], 'complete');

      component.ngOnDestroy();

      expect(DESTROY_SPY).toHaveBeenCalled();
      expect(COMPLETE_SPY).toHaveBeenCalled();
    });
  });

  describe('calcularImporteUnitario', () => {
    it('Debería calcular correctamente el importe unitario', () => {
      const result = component.calcularImporteUnitario('10', '100');
      expect(result).toBe('10.000');
    });

    it('Debería retornar "0" cuando cantidadPartidas es 0', () => {
      const result = component.calcularImporteUnitario('0', '100');
      expect(result).toBe('0');
    });

    it('Debería manejar valores no numéricos', () => {
      const result = component.calcularImporteUnitario('', '100');
      expect(result).toBe('0');
    });
  });

  describe('validarFormulario', () => {
    beforeEach(() => {
      component.inicializarFormularios();
    });

    it('Debería retornar false cuando los formularios son inválidos', () => {
      const result = component.validarFormulario();
      expect(result).toBe(false);
    });

    it('Debería retornar false cuando no hay partidas en la tabla', () => {
      component.tableBodyData = [];
      const result = component.validarFormulario();
      expect(result).toBe(false);
      expect(component.isInvalidaPartidas).toBe(true);
    });

    it('Debería establecer isInvalidaPartidas en false cuando hay partidas', () => {
      component.tableBodyData = [{ 
        id: '1',
        cantidad: '10', 
        descripcion: 'Item', 
        precioUnitarioUSD: '50', 
        unidadDeMedida: 'kg', 
        fraccionFrancelaria: '1234', 
        totalUSD: '100' 
      }];
      component.validarFormulario();
      expect(component.isInvalidaPartidas).toBe(false);
    });
  });

  describe('disabledModificar', () => {
    it('Debería retornar true cuando no hay filas seleccionadas', () => {
      component.filaSeleccionada = [];
      const result = component.disabledModificar();
      expect(result).toBe(true);
    });

    it('Debería retornar false cuando hay filas seleccionadas', () => {
      component.filaSeleccionada = [{ 
        id: '1',
        cantidad: '10', 
        descripcion: 'Item', 
        precioUnitarioUSD: '50', 
        unidadDeMedida: 'kg', 
        fraccionFrancelaria: '1234', 
        totalUSD: '100' 
      }];
      const result = component.disabledModificar();
      expect(result).toBe(false);
    });
  });

  describe('manejarlaFilaSeleccionada', () => {
    it('Debería actualizar filaSeleccionada con las filas proporcionadas', () => {
      const filas = [{ 
        id: '1',
        cantidad: '10', 
        descripcion: 'Item', 
        precioUnitarioUSD: '50', 
        unidadDeMedida: 'kg', 
        fraccionFrancelaria: '1234', 
        totalUSD: '100' 
      }];

      component.manejarlaFilaSeleccionada(filas);

      expect(component.filaSeleccionada).toEqual(filas);
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({filaSeleccionada: filas});
    });

    it('Debería establecer filaSeleccionada como array vacío cuando no hay filas', () => {
      component.manejarlaFilaSeleccionada([]);
      expect(component.filaSeleccionada).toEqual([]);
    });
  });

  describe('todosPaisesSeleccionados', () => {
    it('Debería obtener todos los países cuando evento es true', () => {
      component.todosPaisesSeleccionados(true);

      expect(mockControlPermisosPreviosExportacionService.getTodosPaisesSeleccionados).toHaveBeenCalledWith('130217');
      expect(component.paisesPorBloque).toEqual(MOCK_CATALOGO);
    });

    it('No debería hacer nada cuando evento es false', () => {
      component.todosPaisesSeleccionados(false);

      expect(mockControlPermisosPreviosExportacionService.getTodosPaisesSeleccionados).not.toHaveBeenCalled();
    });
  });

  describe('fechasSeleccionadas', () => {
    it('Debería actualizar el estado con las fechas seleccionadas', () => {
      const fechas = ['2024-01-01', '2024-01-02'];
      component.fechasSeleccionadas(fechas);

      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({ fechasSeleccionadas: fechas });
    });
  });

  describe('Component Properties', () => {
    it('Debería tener las propiedades iniciales correctas', () => {
      expect(component.mostrarTabla).toBe(false);
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.isInvalidaPartidas).toBe(false);
      expect(component.idProcedimiento).toBe(130217);
      expect(component.tableBodyData).toEqual([]);
      expect(component.filaSeleccionada).toEqual([]);
    });

    it('Debería tener los textos configurados', () => {
      expect(component.TEXTOS).toBeDefined();
    });

    it('Debería tener las opciones de producto configuradas', () => {
      expect(component.productoOpciones).toBeDefined();
      expect(Array.isArray(component.productoOpciones)).toBe(true);
    });
  });
});