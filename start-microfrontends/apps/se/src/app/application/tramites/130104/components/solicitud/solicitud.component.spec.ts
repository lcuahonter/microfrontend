import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { Catalogo, ConsultaioQuery } from '@ng-mf/data-access-user';
import { ProductoOpción } from '../../../../shared/constantes/vehiculos-adaptados.enum';
import { Component, Input } from '@angular/core';
import { ImportacionOtrosVehiculosUsadosService } from '../../services/importacion-otros-vehiculos-usados.service';
import { Tramite130104Store, Tramite130104State } from '../../../../estados/tramites/tramite130104.store';
import { Tramite130104Query } from '../../../../estados/queries/tramite130104.query';
import { MostrarPartidas } from '@libs/shared/data-access-user/src';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';

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
  let mockStore: jest.Mocked<Tramite130104Store>;
  let mockQuery: jest.Mocked<Tramite130104Query>;
  let mockService: jest.Mocked<any>;
  let mockImportacionOtrosVehiculosUsadosService: Partial<ImportacionOtrosVehiculosUsadosService>;

  const MOCK_PRODUCTO_OPTIONS: ProductoOpción[] = [
    { label: 'Nuevo', value: 'Nuevo' },
    { label: 'Usado', value: 'Usado' },
  ];
  const MOCK_CATALOGO: Catalogo[] = [
    { id: 1, descripcion: 'Option 1' },
    { id: 2, descripcion: 'Option 2' },
  ];
  beforeEach(async () => {
    const mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    mockStore = {
      actualizarEstado: jest.fn()
    } as any;

    mockQuery = {
      mostrarTabla$: of(false),
      selectSolicitud$: of({
        solicitud: 'Initial',
        regimen: '01',
        clasificacion: '01',
        producto: 'Nuevo',
        descripcion: 'Test description',
        fraccion: '87012101',
        cantidad: '10',
        valorFacturaUSD: '1000',
        unidadMedida: '6',
        cantidadPartidasDeLaMercancia: '10',
        valorPartidaUSDPartidasDeLaMercancia: '1000',
        descripcionPartidasDeLaMercancia: 'Test description',
        bloque: '',
        usoEspecifico: 'Test uso',
        justificacionImportacionExportacion: 'Test justification',
        observaciones: 'Test observations',
        entidad: 'DGO',
        representacion: '1016',
        tableBodyData: []
      } as unknown as Tramite130104State)
    } as any;

    mockImportacionOtrosVehiculosUsadosService = {
      getMostrarPartidasService: jest.fn().mockReturnValue(of({
        codigo: '00',
        datos: [{ id: 1, descripcion: 'Test partida', cantidad: 5, valorUSD: 1000 }]
      } as unknown as BaseResponse<MostrarPartidas[]>)),
      getEntidadesFederativasCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getRegimenCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getFraccionCatalogoService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getBloqueService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getPaisesPorBloqueService: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getRepresentacionFederalCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getClasificacionRegimenCatalogo: jest.fn().mockReturnValue(of(MOCK_CATALOGO)),
      getUMTService: jest.fn().mockReturnValue(of(MOCK_CATALOGO))
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
      imports: [ReactiveFormsModule, HttpClientModule],
      providers: [
        FormBuilder,
        { provide: Tramite130104Store, useValue: mockStore },
        { provide: Tramite130104Query, useValue: mockQuery },
        { provide: ImportacionOtrosVehiculosUsadosService, useValue: mockImportacionOtrosVehiculosUsadosService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
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
      jest.spyOn(component, 'getMostrarPartidas');
      jest.spyOn(component, 'configuracionFormularioSuscripciones');
      jest.spyOn(component, 'getRegimenCatalogo');
      jest.spyOn(component, 'getFraccionCatalogo');
      jest.spyOn(component, 'getEntidadesFederativasCatalogo');
      jest.spyOn(component, 'getBloque');

      component.ngOnInit();

      expect(component.getMostrarPartidas).toHaveBeenCalled();
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
      component.inicializarFormularios();      expect(component.formDelTramite).toBeDefined();
      expect(component.mercanciaForm).toBeDefined();
      expect(component.partidasDelaMercanciaForm).toBeDefined();
      expect(component.paisForm).toBeDefined();
      expect(component.frmRepresentacionForm).toBeDefined();
      expect(component.modificarPartidasDelaMercanciaForm).toBeDefined();
      expect(component.formForTotalCount).toBeDefined();

      expect(component.formDelTramite.get('solicitud')).toBeDefined();
      expect(component.mercanciaForm.get('producto')?.value).toBe(null);
      expect(component.partidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')).toBeDefined();
      expect(component.paisForm.get('bloque')).toBeDefined();
      expect(component.frmRepresentacionForm.get('entidad')).toBeDefined();
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

      // Mock the seccionState
      component['seccionState'] = {
        cantidadPartidasDeLaMercancia: '10',
        descripcionPartidasDeLaMercancia: 'Test description',
        valorPartidaUSDPartidasDeLaMercancia: '100',
        fraccion: '87012101',
        descripcion: 'Test',
        unidadMedida: '6'
      } as any;
      
      component.unidadCatalogo = [{ id: 1, clave: '6', descripcion: 'Pieza' }];
      component.tableBodyData = [];

      component.validarYEnviarFormulario();

      expect(component.mostrarTabla).toBe(true);
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({ mostrarTabla: true });
    });

    it('should update tableBodyData when form is valid', () => {
      component.partidasDelaMercanciaForm = TestBed.inject(FormBuilder).group({
        cantidadPartidasDeLaMercancia: ['10'],
        descripcionPartidasDeLaMercancia: ['Test'],
        valorPartidaUSDPartidasDeLaMercancia: ['100'],
      });

      component['seccionState'] = {
        cantidadPartidasDeLaMercancia: '10',
        descripcionPartidasDeLaMercancia: 'Test description',
        valorPartidaUSDPartidasDeLaMercancia: '100',
        fraccion: '87012101',
        descripcion: 'Test',
        unidadMedida: '6'
      } as any;

      component.unidadCatalogo = [{ id: 1, clave: '6', descripcion: 'Pieza' }];
      component.tableBodyData = [];

      component.validarYEnviarFormulario();

      expect(component.tableBodyData.length).toBe(1);
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({ tableBodyData: component.tableBodyData });
    });
  });

  describe('navegarParaModificarPartida', () => {
    it('Debería actualizar el estado y mostrarTabla si hay fila seleccionada', () => {
      component.filaSeleccionada = [{
        cantidad: '10', descripcion: 'Item', precioUnitarioUSD: '50', unidadDeMedida: 'kg', fraccionFrancelaria: '1234', totalUSD: '100',
        id: ''
      }];

      component.navegarParaModificarPartida();

      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({mostrarTabla:true});
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({filaSeleccionada:component.filaSeleccionada});
    });
  });
  describe('fetchEntidadFederativa', () => {
    it('Debería obtener la lista de entidades federativas', () => {
      component.getEntidadesFederativasCatalogo(); 
    
      expect(mockImportacionOtrosVehiculosUsadosService.getEntidadesFederativasCatalogo).toHaveBeenCalled(); 
      expect(component.entidadFederativa).toEqual(MOCK_CATALOGO);
    });
  });

  describe('fetchRepresentacionFederal', () => {
    it('Debería obtener la lista de representaciones federales', () => {
      component.getRepresentacionFederalCatalogo('DGO');

      expect(mockImportacionOtrosVehiculosUsadosService.getRepresentacionFederalCatalogo).toHaveBeenCalled();
      expect(component.representacionFederal).toEqual(MOCK_CATALOGO);
    });
  });

  describe('getMostrarPartidas', () => {
    it('should fetch mostrar partidas and update store when response is successful', () => {
      component.getMostrarPartidas();

      expect(mockImportacionOtrosVehiculosUsadosService.getMostrarPartidasService).toHaveBeenCalledWith(202859165);
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({ mostrarPartidas: expect.any(Array) });
    });
  });

  describe('getPaisesPorBloque', () => {
    it('Debería obtener países por bloque', () => {
      component.getPaisesPorBloque('1');

      expect(mockImportacionOtrosVehiculosUsadosService.getPaisesPorBloqueService).toHaveBeenCalledWith('130104', '1');
      expect(component.paisesPorBloque).toEqual(MOCK_CATALOGO);
    });
  });

  describe('getBloque', () => {
    it('should fetch bloques and assign to elementosDeBloque', () => {
      component.getBloque();

      expect(mockImportacionOtrosVehiculosUsadosService.getBloqueService).toHaveBeenCalledWith('130104');
      expect(component.elementosDeBloque).toEqual(MOCK_CATALOGO);
    });
  });

  describe('getFraccionCatalogo', () => {
    it('should fetch fraccion catalog and process descriptions', () => {
      const mockFracciones = [
        { id: 1, clave: '8701', descripcion: 'Vehiculos' }
      ];
      mockImportacionOtrosVehiculosUsadosService.getFraccionCatalogoService = jest.fn().mockReturnValue(of(mockFracciones));

      component.getFraccionCatalogo();

      expect(mockImportacionOtrosVehiculosUsadosService.getFraccionCatalogoService).toHaveBeenCalledWith('130104');
      expect(component.fraccionCatalogo[0].descripcion).toBe('8701 - Vehiculos');
    });
  });

  describe('getUnidadesMedidaTarifaria', () => {
    it('should fetch unidades medida tarifaria and set form value', () => {
      const mockUMT = [{ id: 1, clave: '6', descripcion: 'Pieza' }];
      mockImportacionOtrosVehiculosUsadosService.getUMTService = jest.fn().mockReturnValue(of(mockUMT));

      component.getUnidadesMedidaTarifaria('87012101');

      expect(mockImportacionOtrosVehiculosUsadosService.getUMTService).toHaveBeenCalledWith('130104', '87012101');
      expect(component.unidadCatalogo).toEqual(mockUMT);
    });
  });
  describe('enCambioDeBloque', () => {
    it('Debería llamar a getPaisesPorBloque con el bloqueId', () => {
      jest.spyOn(component, 'getPaisesPorBloque');

      component.enCambioDeBloque(2);

      expect(component.getPaisesPorBloque).toHaveBeenCalledWith('2');
    });
  });

  describe('manejarlaFilaSeleccionada', () => {
    it('should handle row selection and update store', () => {
      const mockRows = [mockPartidasdelaTable];
      
      component.manejarlaFilaSeleccionada(mockRows as any);

      expect(component.filaSeleccionada).toEqual(mockRows);
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({ filaSeleccionada: mockRows });
    });

    it('should handle empty selection', () => {
      component.manejarlaFilaSeleccionada([]);

      expect(component.filaSeleccionada).toEqual([]);
    });
  });

  describe('validarFormulario', () => {
    beforeEach(() => {
      component.inicializarFormularios();
    });

    it('should return false and mark forms as touched when forms are invalid', () => {
      // Make forms invalid
      component.formDelTramite.get('solicitud')?.setValue('');
      component.mercanciaForm.get('descripcion')?.setValue('');
      component.paisForm.get('usoEspecifico')?.setValue('');
      component.frmRepresentacionForm.get('entidad')?.setValue('');
      component.filaSeleccionada = [];

      const result = component.validarFormulario();

      expect(result).toBe(false);
      expect(component.isInvalidaPartidas).toBe(true);
    });

    it('should return true when all forms are valid and rows selected', () => {
      // Make forms valid
      component.formDelTramite.patchValue({
        solicitud: 'TISOL.I',
        regimen: '01',
        clasificacion: '01'
      });
      component.mercanciaForm.patchValue({
        descripcion: 'Valid description text',
        fraccion: '87012101',
        cantidad: '10',
        valorFacturaUSD: '1000',
        unidadMedida: '6'
      });
      component.paisForm.patchValue({
        usoEspecifico: 'Valid uso',
        justificacionImportacionExportacion: 'Valid justification'
      });
      component.frmRepresentacionForm.patchValue({
        entidad: 'DGO',
        representacion: '1016'
      });
      component.filaSeleccionada = [mockPartidasdelaTable as any];

      const result = component.validarFormulario();

      expect(result).toBe(true);
      expect(component.isInvalidaPartidas).toBe(false);
    });
  });

  describe('calcularImporteUnitario', () => {
    it('should calculate unit import correctly', () => {
      const result = component.calcularImporteUnitario('10', '1000');
      expect(result).toBe('100.000');
    });

    it('should return 0 when cantidad is 0', () => {
      const result = component.calcularImporteUnitario('0', '1000');
      expect(result).toBe('0');
    });
  });

  describe('disabledModificar', () => {
    it('should return true when no rows selected', () => {
      component.filaSeleccionada = [];
      expect(component.disabledModificar()).toBe(true);
    });

    it('should return false when rows are selected', () => {
      component.filaSeleccionada = [mockPartidasdelaTable as any];
      expect(component.disabledModificar()).toBe(false);
    });
  });
 
  describe('configuracionFormularioSuscripciones', () => {
    it('should configure form subscriptions and update forms with state values', () => {
      const mockState = {
        cantidadPartidasDeLaMercancia: '15',
        valorPartidaUSDPartidasDeLaMercancia: '2000',
        descripcionPartidasDeLaMercancia: 'Updated description',
        solicitud: 'TISOL.I',
        regimen: '02',
        clasificacion: '02',
        producto: 'Usado',
        descripcion: 'Updated product description',
        fraccion: '87012102',
        cantidad: '15',
        valorFacturaUSD: '2000',
        unidadMedida: '7',
        bloque: 'BLQ002',
        usoEspecifico: 'Updated uso',
        justificacionImportacionExportacion: 'Updated justification',
        observaciones: 'Updated observations',
        entidad: 'CDMX',
        representacion: '1017'
      } as Tramite130104State;

      mockQuery.selectSolicitud$ = of(mockState);
      
      jest.spyOn(component.partidasDelaMercanciaForm, 'patchValue');
      jest.spyOn(component.formDelTramite, 'patchValue');
      jest.spyOn(component.mercanciaForm, 'patchValue');
      jest.spyOn(component.paisForm, 'patchValue');
      jest.spyOn(component.frmRepresentacionForm, 'patchValue');

      component.configuracionFormularioSuscripciones();

      expect(component.partidasDelaMercanciaForm.patchValue).toHaveBeenCalledWith({
        cantidadPartidasDeLaMercancia: '15',
        valorPartidaUSDPartidasDeLaMercancia: '2000',
        descripcionPartidasDeLaMercancia: 'Updated description'
      });
      expect(component.formDelTramite.patchValue).toHaveBeenCalledWith({
        solicitud: 'TISOL.I',
        regimen: '02',
        clasificacion: '02'
      });
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

    it('should call getClasificacionRegimenCatalogo when campo is regimen', () => {
      component.formDelTramite = TestBed.inject(FormBuilder).group({
        regimen: ['01'], 
      });
      jest.spyOn(component, 'getClasificacionRegimenCatalogo');
  
      component.setValoresStore({
        form: component.formDelTramite,
        campo: 'regimen'
      });
  
      expect(component.getClasificacionRegimenCatalogo).toHaveBeenCalledWith('01');
    });

    it('should call getUnidadesMedidaTarifaria when campo is fraccion', () => {
      component.mercanciaForm = TestBed.inject(FormBuilder).group({
        fraccion: ['87012101'], 
      });
      jest.spyOn(component, 'getUnidadesMedidaTarifaria');
  
      component.setValoresStore({
        form: component.mercanciaForm,
        campo: 'fraccion'
      });
  
      expect(component.getUnidadesMedidaTarifaria).toHaveBeenCalledWith('87012101');
    });

    it('should call getRepresentacionFederalCatalogo when campo is entidad', () => {
      component.frmRepresentacionForm = TestBed.inject(FormBuilder).group({
        entidad: ['DGO'], 
      });
      jest.spyOn(component, 'getRepresentacionFederalCatalogo');
  
      component.setValoresStore({
        form: component.frmRepresentacionForm,
        campo: 'entidad'
      });
  
      expect(component.getRepresentacionFederalCatalogo).toHaveBeenCalledWith('DGO');
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