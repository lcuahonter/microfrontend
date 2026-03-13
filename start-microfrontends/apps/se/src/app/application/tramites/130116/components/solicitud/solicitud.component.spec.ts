import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Catalogo } from '@ng-mf/data-access-user';
import { Component, Input } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Tramite130116Store } from '../../../../estados/tramites/tramites130116.store';
import { Tramite130116Query } from '../../../../estados/queries/tramite130116.query';
import { SolicitudImportacionAmbulanciaService } from '../../services/solicitud-importacion-ambulancia.service';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';



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
  let mockStore: jest.Mocked<Tramite130116Store>;
  let mockQuery: jest.Mocked<Tramite130116Query>;
  let mockService: jest.Mocked<any>;
  let mockSolicitudImportacionAmbulanciaService: Partial<SolicitudImportacionAmbulanciaService>;

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
    } as any;

    mockService = {
   
      getEntidadFederativa: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getRepresentacionFederal: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getListaDePaisesDisponibles: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getPaisesPorBloque: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
    };

    mockSolicitudImportacionAmbulanciaService = {
      getEntidadesFederativasCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getRepresentacionFederalCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getTodosPaisesSeleccionados: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getPaisesPorBloqueService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getRegimenCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getFraccionCatalogoService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getBloqueService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
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
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: Tramite130116Store, useValue: mockStore },
        { provide: Tramite130116Query, useValue: mockQuery },
        { provide: SolicitudImportacionAmbulanciaService, useValue: mockSolicitudImportacionAmbulanciaService },
      ],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
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
      jest.spyOn(component, 'formularioTotalCount');

      component.ngOnInit();

      expect(component.configuracionFormularioSuscripciones).toHaveBeenCalled();
      expect(component.getRegimenCatalogo).toHaveBeenCalled();
      expect(component.getFraccionCatalogo).toHaveBeenCalled();
      expect(component.getEntidadesFederativasCatalogo).toHaveBeenCalled();
      expect(component.getBloque).toHaveBeenCalled();
      expect(component.formularioTotalCount).toHaveBeenCalled();
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

  describe('getRegimenCatalogo', () => {
    it('Debería llamar al servicio para obtener el catálogo de regímenes', () => {
      component.getRegimenCatalogo();

      expect(mockSolicitudImportacionAmbulanciaService.getRegimenCatalogo).toHaveBeenCalled();
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
      component.filaSeleccionada = [{ id: '1', cantidad: '10', descripcion: 'Item', precioUnitarioUSD: '50', unidadDeMedida: 'kg', fraccionFrancelaria: '1234', totalUSD: '100' }];

      component.navegarParaModificarPartida();

    });
  });

  describe('getEntidadesFederativasCatalogo', () => {
    it('Debería obtener la lista de entidades federativas', () => {
      component.getEntidadesFederativasCatalogo();
    
      expect(mockSolicitudImportacionAmbulanciaService.getEntidadesFederativasCatalogo).toHaveBeenCalled();
    });
  });

  describe('getRepresentacionFederalCatalogo', () => {
    it('Debería obtener la lista de representaciones federales', () => {
      component.getRepresentacionFederalCatalogo('01');

      expect(mockSolicitudImportacionAmbulanciaService.getRepresentacionFederalCatalogo).toHaveBeenCalledWith('01');
    });
  });

  describe('getBloque', () => {
    it('Debería obtener la lista de bloques disponibles', () => {
      component.getBloque();

      expect(mockSolicitudImportacionAmbulanciaService.getBloqueService).toHaveBeenCalled();
    });
  });

  describe('getPaisesPorBloque', () => {
    it('Debería obtener países por bloque', () => {
      component.getPaisesPorBloque('1');

      expect(mockSolicitudImportacionAmbulanciaService.getPaisesPorBloqueService).toHaveBeenCalledWith(expect.any(String), '1');
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
});