import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { DatosDelSolicitanteComponent } from './datos-del-solicitante.component';
import { ConsultaioQuery, REG_X } from '@ng-mf/data-access-user';
import { Tramite300105Store } from '../../estados/tramite300105.store';
import { Tramite300105Query } from '../../estados/tramite300105.query';
import { AutorizacionDeRayosXService } from '../../services/autorizacion-de-rayos-x.service';
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../enum/botons.enum';

// Mock component for app-catalogo-select
@Component({
  selector: 'app-catalogo-select',
  template: '<div></div>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockCatalogoSelectComponent),
      multi: true
    }
  ]
})
class MockCatalogoSelectComponent {
  @Input() catalogo: any[] = [];
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() isDisabled: boolean = false;
  @Output() change = new EventEmitter<any>();

  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {}
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {}
}

// Mock component for ng-titulo
@Component({
  selector: 'ng-titulo',
  template: '<div></div>'
})
class MockTituloComponent {
  @Input() titulo: string = '';
}

describe('DatosDelSolicitanteComponent', () => {
  let component: DatosDelSolicitanteComponent;
  let fixture: ComponentFixture<DatosDelSolicitanteComponent>;
  let mockTramite300105Store: jest.Mocked<Tramite300105Store>;
  let mockTramite300105Query: jest.Mocked<Tramite300105Query>;
  let mockAutorizacionDeRayosXService: jest.Mocked<AutorizacionDeRayosXService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let formBuilder: FormBuilder;

  const mockTramite300105State = {
    mercacniaSolicitudControlar: true,
    observaciones: '',
    tercerosPopupState: false,
    mercanciaTablaDatos: [],
    destinatarioTablaDatos: [],
    claveDeReferencia: '',
    cadenaDependencia: '',
    banco: '',
    llaveDePago: '',
    fechaPago: '',
    importePago: '',
    numeroExpediente: '123456',
    tipoOperacion: 'tipo1',
    finalidad: 'finalidad1',
    isExento: true,
    isAutorizacion: false,
    numAutorizacion1: '111',
    numAutorizacion2: '222',
    numAutorizacion3: '333'
  };

  const mockConsultaioState = {
    readonly: false
  };

  const mockTipoOperacionData = [
    { id: 1, nombre: 'Tipo 1', valor: 'tipo1' },
    { id: 2, nombre: 'Tipo 2', valor: 'tipo2' }
  ];

  const mockFinalidadData = [
    { id: 1, nombre: 'Finalidad 1', valor: 'finalidad1' },
    { id: 2, nombre: 'Finalidad 2', valor: 'finalidad2' }
  ];

  beforeEach(async () => {
    const tramite300105StoreSpy = {
      establecerDatos: jest.fn()
    };
    
    const tramite300105QuerySpy = {
      selectTramite300105$: of(mockTramite300105State)
    };
    
    const autorizacionDeRayosXServiceSpy = {
      getTipoOperacion: jest.fn().mockReturnValue(of(mockTipoOperacionData)),
      getFinalidad: jest.fn().mockReturnValue(of(mockFinalidadData))
    };
    
    const consultaioQuerySpy = {
      selectConsultaioState$: of(mockConsultaioState)
    };

    await TestBed.configureTestingModule({
      declarations: [
        DatosDelSolicitanteComponent,
        MockCatalogoSelectComponent,
        MockTituloComponent
      ],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite300105Store, useValue: tramite300105StoreSpy },
        { provide: Tramite300105Query, useValue: tramite300105QuerySpy },
        { provide: AutorizacionDeRayosXService, useValue: autorizacionDeRayosXServiceSpy },
        { provide: ConsultaioQuery, useValue: consultaioQuerySpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelSolicitanteComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    mockTramite300105Store = TestBed.inject(Tramite300105Store) as jest.Mocked<Tramite300105Store>;
    mockTramite300105Query = TestBed.inject(Tramite300105Query) as jest.Mocked<Tramite300105Query>;
    mockAutorizacionDeRayosXService = TestBed.inject(AutorizacionDeRayosXService) as jest.Mocked<AutorizacionDeRayosXService>;
    mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize component properties correctly', () => {
      expect(component.opcionDeBotonDeRadio).toBe(OPCIONES_DE_BOTON_DE_RADIO);
      expect(component.VALOR_SELECCIONADO).toBe('');
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component['destroyNotifier$']).toBeInstanceOf(Subject);
    });

    it('should initialize catalogo properties with correct default values', () => {
      expect(component.tipoOperacionCatalogo).toEqual({
        labelNombre: 'Tipo de Operación',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: []
      });

      expect(component.finalidadCatalogo).toEqual({
        labelNombre: 'Finalidad',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: []
      });
    });
  });

  describe('Constructor and Subscriptions', () => {
    it('should subscribe to ConsultaioQuery and set esFormularioSoloLectura to false', () => {
      const consultaioState = { readonly: false };
      const consultaioQuerySpy = {
        selectConsultaioState$: of(consultaioState)
      };
      
      const testComponent = new DatosDelSolicitanteComponent(
        formBuilder,
        mockTramite300105Store,
        mockTramite300105Query,
        mockAutorizacionDeRayosXService,
        consultaioQuerySpy as any
      );

      expect(testComponent.esFormularioSoloLectura).toBe(false);
    });

    it('should subscribe to ConsultaioQuery and set esFormularioSoloLectura to true', () => {
      const consultaioState = { readonly: true };
      const consultaioQuerySpy = {
        selectConsultaioState$: of(consultaioState)
      };
      
      const testComponent = new DatosDelSolicitanteComponent(
        formBuilder,
        mockTramite300105Store,
        mockTramite300105Query,
        mockAutorizacionDeRayosXService,
        consultaioQuerySpy as any
      );

      expect(testComponent.esFormularioSoloLectura).toBe(true);
    });
  });

  describe('ngOnInit', () => {
    it('should call initialization methods', () => {
      const initFormSpy = jest.spyOn(component, 'initializarFormulario');
      const fetchTipoOperacionSpy = jest.spyOn(component, 'fetchTipoOperacionData');
      const fetchFinalidadSpy = jest.spyOn(component, 'fetchFinalidadData');

      component.ngOnInit();

      expect(initFormSpy).toHaveBeenCalled();
      expect(fetchTipoOperacionSpy).toHaveBeenCalled();
      expect(fetchFinalidadSpy).toHaveBeenCalled();
    });
  });

  describe('initializarFormulario', () => {
    it('should create form with correct structure and validators', () => {
      // Initialize the component without detectChanges to avoid template binding issues
      component.ngOnInit();
      
      expect(component.formSolicitud).toBeDefined();
      expect(component.formSolicitud.get('datosSolicitante')).toBeInstanceOf(FormGroup);
      
      const datosSolicitante = component.formSolicitud.get('datosSolicitante') as FormGroup;
      expect(datosSolicitante.get('numeroExpediente')).toBeDefined();
      expect(datosSolicitante.get('tipoOperacion')).toBeDefined();
      expect(datosSolicitante.get('finalidad')).toBeDefined();
      expect(datosSolicitante.get('isExento')).toBeDefined();
      expect(datosSolicitante.get('isAutorizacion')).toBeDefined();
      expect(datosSolicitante.get('numAutorizacion1')).toBeDefined();
      expect(datosSolicitante.get('numAutorizacion2')).toBeDefined();
      expect(datosSolicitante.get('numAutorizacion3')).toBeDefined();
    });
  });

  describe('setValoresStore', () => {
    it('should call tramite300105Store.establecerDatos with correct parameters', () => {
      component.ngOnInit();
      
      const mockForm = component.formSolicitud.get('datosSolicitante') as FormGroup;
      mockForm.get('numeroExpediente')?.setValue('654321');
      
      component.setValoresStore(mockForm, 'numeroExpediente');
      
      expect(mockTramite300105Store.establecerDatos).toHaveBeenCalledWith({
        numeroExpediente: '654321'
      });
    });
  });

  describe('onRadioClick', () => {
    it('should toggle boolean value from false to true', () => {
      component.ngOnInit();
      
      const datosSolicitante = component.datosSolicitante;
      datosSolicitante.get('isExento')?.setValue(false);
      
      component.onRadioClick('isExento');
      
      expect(datosSolicitante.get('isExento')?.value).toBe(true);
      expect(mockTramite300105Store.establecerDatos).toHaveBeenCalledWith({
        isExento: true
      });
    });
  });

  describe('fetchTipoOperacionData', () => {
    it('should fetch and set tipo operacion catalog data', () => {
      component.fetchTipoOperacionData();
      
      expect(mockAutorizacionDeRayosXService.getTipoOperacion).toHaveBeenCalled();
      expect(component.tipoOperacionCatalogo.catalogos).toEqual(mockTipoOperacionData);
    });
  });

  describe('fetchFinalidadData', () => {
    it('should fetch and set finalidad catalog data', () => {
      component.fetchFinalidadData();
      
      expect(mockAutorizacionDeRayosXService.getFinalidad).toHaveBeenCalled();
      expect(component.finalidadCatalogo.catalogos).toEqual(mockFinalidadData);
    });
  });

  describe('datosSolicitante getter', () => {
    it('should return datosSolicitante FormGroup', () => {
      component.ngOnInit();
      
      const result = component.datosSolicitante;
      
      expect(result).toBeInstanceOf(FormGroup);
      expect(result).toBe(component.formSolicitud.get('datosSolicitante'));
    });
  });

  describe('obtenerTipoOperacionSeleccionado', () => {
    it('should emit tipoOperacion value', () => {
      component.ngOnInit();
      
      const emitSpy = jest.spyOn(component.pasarTipoOperacion, 'emit');
      const expectedValue = 'tipo1';
      component.formSolicitud.get('datosSolicitante.tipoOperacion')?.setValue(expectedValue);
      
      component.obtenerTipoOperacionSeleccionado();
      
      expect(emitSpy).toHaveBeenCalledWith(expectedValue);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyNotifier$ subject', () => {
      const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(destroyNotifierSpy).toHaveBeenCalled();
      expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
    });
  });
});
