import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { Tramite300105Store } from '../../estados/tramite300105.store';
import { Tramite300105Query } from '../../estados/tramite300105.query';
import { AutorizacionDeRayosXService } from '../../services/autorizacion-de-rayos-x.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { TituloComponent } from "@ng-mf/data-access-user";

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;
  let mockTramite300105Store: jest.Mocked<Tramite300105Store>;
  let mockTramite300105Query: jest.Mocked<Tramite300105Query>;
  let mockAutorizacionDeRayosXService: jest.Mocked<AutorizacionDeRayosXService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let formBuilder: FormBuilder;

  // Mock data
  const mockTramiteState = {
    claveDeReferencia: 'REF123',
    cadenaDependencia: 'CADENA123',
    banco: 'BANCO_TEST',
    llaveDePago: 'LLAVE123',
    fechaPago: '2023-12-01',
    importePago: 1000
  };

  const mockBancoData: Catalogo[] = [
    { id: 1, descripcion: 'Banco Test 1' },
    { id: 2, descripcion: 'Banco Test 2' }
  ];

  const mockConsultaioState = {
    readonly: false
  };

  beforeEach(async () => {
    // Create mocks with all necessary methods
    mockTramite300105Store = {
      setllaveDePago: jest.fn(),
      establecerDatos: jest.fn()
    } as any;

    mockTramite300105Query = {
      selectTramite300105$: new BehaviorSubject(mockTramiteState)
    } as any;

    mockAutorizacionDeRayosXService = {
      getBancoData: jest.fn().mockReturnValue(of(mockBancoData))
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: new BehaviorSubject(mockConsultaioState)
    } as any;
    await TestBed.configureTestingModule({
      declarations: [PagoDeDerechosComponent],
      imports: [ReactiveFormsModule,TituloComponent],
      providers: [
        FormBuilder,
        { provide: Tramite300105Store, useValue: mockTramite300105Store },
        { provide: Tramite300105Query, useValue: mockTramite300105Query },
        { provide: AutorizacionDeRayosXService, useValue: mockAutorizacionDeRayosXService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).overrideComponent(PagoDeDerechosComponent, {
      set: {
        template: '<div></div>'
      }
    }).compileComponents();


    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.bancoCatalogo).toEqual({
        labelNombre: 'Banco',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: mockBancoData
      });
    });

    it('should call fetchBancoData in constructor', () => {
      const spy = jest.spyOn(PagoDeDerechosComponent.prototype, 'fetchBancoData');
      // Create new instance to test constructor
      const newComponent = new PagoDeDerechosComponent(
        formBuilder,
        mockTramite300105Store,
        mockTramite300105Query,
        mockAutorizacionDeRayosXService,
        mockConsultaioQuery
      );
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should subscribe to consultaioQuery state in constructor', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
      
      // Test with readonly true
      const readonlyState = { readonly: true };
      (mockConsultaioQuery.selectConsultaioState$ as BehaviorSubject<any>).next(readonlyState);
      
      // Create new component to test constructor subscription
      const newComponent = new PagoDeDerechosComponent(
        formBuilder,
        mockTramite300105Store,
        mockTramite300105Query,
        mockAutorizacionDeRayosXService,
        mockConsultaioQuery
      );
      
      expect(newComponent.esFormularioSoloLectura).toBe(true);
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should subscribe to tramite300105Query and set solicitudState', () => {
      component.ngOnInit();
      expect(component.solicitudState).toEqual(mockTramiteState);
    });

    it('should create formSolicitud with correct structure and values', () => {
      component.ngOnInit();
      
      expect(component.formSolicitud).toBeDefined();
      expect(component.formSolicitud.get('datosImportadorExportador')).toBeDefined();
      
      const datosForm = component.formSolicitud.get('datosImportadorExportador');
      expect(datosForm?.get('claveDeReferencia')?.value).toBe(mockTramiteState.claveDeReferencia);
      expect(datosForm?.get('cadenaDependencia')?.value).toBe(mockTramiteState.cadenaDependencia);
      expect(datosForm?.get('banco')?.value).toBe(mockTramiteState.banco);
      expect(datosForm?.get('llaveDePago')?.value).toBe(mockTramiteState.llaveDePago);
      expect(datosForm?.get('fechaPago')?.value).toBe(mockTramiteState.fechaPago);
      expect(datosForm?.get('importePago')?.value).toBe(mockTramiteState.importePago);
    });

    it('should disable form when esFormularioSoloLectura is true', () => {
      component.esFormularioSoloLectura = true;
      component.ngOnInit();
      
      expect(component.formSolicitud.disabled).toBe(true);
    });

    it('should enable form when esFormularioSoloLectura is false', () => {
      component.esFormularioSoloLectura = false;
      component.ngOnInit();
      
      expect(component.formSolicitud.enabled).toBe(true);
    });

    it('should handle undefined solicitudState values', () => {
      (mockTramite300105Query.selectTramite300105$ as BehaviorSubject<any>).next(undefined as any);
      component.ngOnInit();
      
      const datosForm = component.formSolicitud.get('datosImportadorExportador');
      expect(datosForm?.get('cadenaDependencia')?.value).toBeNull();
    });
  });

  describe('fetchBancoData', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call autorizacionDeRayosXService.getBancoData and update bancoCatalogo', () => {
      component.fetchBancoData();
      
      expect(mockAutorizacionDeRayosXService.getBancoData).toHaveBeenCalled();
      expect(component.bancoCatalogo.catalogos).toEqual(mockBancoData);
    });

    it('should handle empty banco data', () => {
      mockAutorizacionDeRayosXService.getBancoData.mockReturnValue(of([]));
      component.fetchBancoData();
      
      expect(component.bancoCatalogo.catalogos).toEqual([]);
    });

    it('should handle service error gracefully', () => {
      const error = new Error('Service error');
      mockAutorizacionDeRayosXService.getBancoData.mockReturnValue(of(error as any));
      
      expect(() => component.fetchBancoData()).not.toThrow();
    });
  });

  describe('manejarCambioLlavePago', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.ngOnInit();
    });

    it('should convert llaveDePago to uppercase and update store', () => {
      const testValue = 'test123';
      component.datosImportadorExportador.get('llaveDePago')?.setValue(testValue);
      
      component.manejarCambioLlavePago();
      
      expect(component.datosImportadorExportador.get('llaveDePago')?.value).toBe('TEST123');
      expect(mockTramite300105Store.setllaveDePago).toHaveBeenCalledWith('TEST123');
    });

    it('should handle empty llaveDePago value', () => {
      component.datosImportadorExportador.get('llaveDePago')?.setValue('');
      
      component.manejarCambioLlavePago();
      
      expect(component.datosImportadorExportador.get('llaveDePago')?.value).toBe('');
      expect(mockTramite300105Store.setllaveDePago).toHaveBeenCalledWith('');
    });

  
    it('should handle special characters in llaveDePago', () => {
      const testValue = 'test@123#';
      component.datosImportadorExportador.get('llaveDePago')?.setValue(testValue);
      
      component.manejarCambioLlavePago();
      
      expect(component.datosImportadorExportador.get('llaveDePago')?.value).toBe('TEST@123#');
      expect(mockTramite300105Store.setllaveDePago).toHaveBeenCalledWith('TEST@123#');
    });
  });

  describe('setValoresStore', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.ngOnInit();
    });

    it('should update store with form field value', () => {
      const testValue = 'testValue';
      const campo = 'banco';
      component.datosImportadorExportador.get(campo)?.setValue(testValue);
      
      component.setValoresStore(component.datosImportadorExportador, campo);
      
      expect(mockTramite300105Store.establecerDatos).toHaveBeenCalledWith({ [campo]: testValue });
    });

    it('should handle null form field value', () => {
      const campo = 'banco';
      component.datosImportadorExportador.get(campo)?.setValue(null);
      
      component.setValoresStore(component.datosImportadorExportador, campo);
      
      expect(mockTramite300105Store.establecerDatos).toHaveBeenCalledWith({ [campo]: null });
    });

    it('should handle undefined form field', () => {
      const campo = 'nonExistentField';
      
      component.setValoresStore(component.datosImportadorExportador, campo);
      
      expect(mockTramite300105Store.establecerDatos).toHaveBeenCalledWith({ [campo]: undefined });
    });

    it('should work with different field types', () => {
      const numericValue = 1000;
      const campo = 'importePago';
      component.datosImportadorExportador.get(campo)?.setValue(numericValue);
      
      component.setValoresStore(component.datosImportadorExportador, campo);
      
      expect(mockTramite300105Store.establecerDatos).toHaveBeenCalledWith({ [campo]: numericValue });
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      fixture.detectChanges();
    })

  describe('datosImportadorExportador getter', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.ngOnInit();
    });

    it('should return the datosImportadorExportador FormGroup', () => {
      const result = component.datosImportadorExportador;
      
      expect(result).toBeDefined();
      expect(result.get('claveDeReferencia')).toBeDefined();
      expect(result.get('cadenaDependencia')).toBeDefined();
      expect(result.get('banco')).toBeDefined();
      expect(result.get('llaveDePago')).toBeDefined();
      expect(result.get('fechaPago')).toBeDefined();
      expect(result.get('importePago')).toBeDefined();
    });

    it('should return the same instance when called multiple times', () => {
      const result1 = component.datosImportadorExportador;
      const result2 = component.datosImportadorExportador;
      
      expect(result1).toBe(result2);
    });
  });

  describe('Component Properties', () => {
    it('should have INPUT_FECHA_CONFIG property', () => {
      expect(component.INPUT_FECHA_CONFIG).toBeDefined();
    });

    it('should initialize bancoCatalogo with correct default structure', () => {
      expect(component.bancoCatalogo.labelNombre).toBe('Banco');
      expect(component.bancoCatalogo.required).toBe(true);
      expect(component.bancoCatalogo.primerOpcion).toBe('Selecciona un valor');
      expect(component.bancoCatalogo.catalogos).toEqual(mockBancoData);
    });

    it('should have esFormularioSoloLectura default to false', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
    });
  });

  describe('Observable Subscriptions', () => {
    it('should handle tramite300105Query state changes', () => {
      fixture.detectChanges();
      component.ngOnInit();
      
      const newState = {
        ...mockTramiteState,
        claveDeReferencia: 'NEW_REF'
      };
      
      (mockTramite300105Query.selectTramite300105$ as BehaviorSubject<any>).next(newState);
      
      expect(component.solicitudState).toEqual(newState);
    });

    it('should handle consultaioQuery state changes', () => {
      const newState = { readonly: true };
      (mockConsultaioQuery.selectConsultaioState$ as BehaviorSubject<any>).next(newState);
      
      // Create new component to test constructor subscription
      const newComponent = new PagoDeDerechosComponent(
        formBuilder,
        mockTramite300105Store,
        mockTramite300105Query,
        mockAutorizacionDeRayosXService,
        mockConsultaioQuery
      );
      
      expect(newComponent.esFormularioSoloLectura).toBe(true);
    });
  });

    it('should handle missing form controls gracefully', () => {
      component.formSolicitud = formBuilder.group({
        datosImportadorExportador: formBuilder.group({})
      });
      
      expect(() => component.manejarCambioLlavePago()).not.toThrow();
      expect(() => component.setValoresStore(component.datosImportadorExportador, 'nonExistent')).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should work with real form interactions', () => {
      fixture.detectChanges();
      component.ngOnInit();
      
      // Simulate user input
      const llavePagoControl = component.datosImportadorExportador.get('llaveDePago');
      llavePagoControl?.setValue('user_input');
      
      // Trigger change handler
      component.manejarCambioLlavePago();
      
      // Verify the entire flow
      expect(llavePagoControl?.value).toBe('USER_INPUT');
      expect(mockTramite300105Store.setllaveDePago).toHaveBeenCalledWith('USER_INPUT');
    });

    it('should handle complete lifecycle', () => {
      // Component creation and initialization
      fixture.detectChanges();
      expect(component).toBeTruthy();
      
      // ngOnInit
      component.ngOnInit();
      expect(component.formSolicitud).toBeDefined();
      expect(component.solicitudState).toEqual(mockTramiteState);
      
      // Method calls
      component.fetchBancoData();
      expect(mockAutorizacionDeRayosXService.getBancoData).toHaveBeenCalled();
      
      component.manejarCambioLlavePago();
      component.setValoresStore(component.datosImportadorExportador, 'banco');
      
      // Cleanup
      component.ngOnDestroy();
    });
  });
});
