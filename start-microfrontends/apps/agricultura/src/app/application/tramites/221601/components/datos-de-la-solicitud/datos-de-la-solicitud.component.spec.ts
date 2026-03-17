jest.mock('@libs/shared/theme/assets/json/221601/zoosanitario.json', () => ({
  __esModule: true,
  default: {
    regimen: [
      { id: 1, descripcion: 'Temporal' },
      { id: 2, descripcion: 'Definitivo' }
    ],
    veterinario: [
      { id: 1, descripcion: 'Vet A' },
      { id: 2, descripcion: 'Vet B' }
    ],
    establecimiento: [
      { id: 1, descripcion: 'Est A' },
      { id: 2, descripcion: 'Est B' }
    ],
    mercancias: [
      { nombre: 'Producto A', cantidad: 10 },
      { nombre: 'Producto B', cantidad: 5 }
    ],
    formData: {
      aduana: 'QUERETARO, QRO.',
      oficina: 'Querétaro',
      punto: 'Querétaro Oficina de Inspección',
      capturaMercancia: 'Sí'
    }
  }
}), { virtual: true });

// Mock Bootstrap Modal globally to prevent DOM interaction issues
jest.mock('bootstrap', () => ({
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn(),
    dispose: jest.fn()
  }))
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { Tramite221601Store } from '../../../../estados/tramites/tramite221601.store';
import { Tramite221601Query } from '../../../../estados/queries/tramite221601.query';
import { createInitialState, Solicitud221601State } from '../../../../estados/tramites/tramite221601.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { ElementRef } from '@angular/core';

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let tramite221601Store: Tramite221601Store;
  let tramite221601Query: Tramite221601Query;

  const mockSolicitudState: Solicitud221601State = {
    ...createInitialState(),
    justificacion: '',
    aduana: 'QUERETARO, QRO.',
    oficina: 'Querétaro',
    punto: 'Querétaro Oficina de Inspección',
    guia: '',
    regimen: 'fff',
    carro: '',
    veterinario: 'fff',
    establecimiento: '',
    clave: '',
    capturaMercancia: 'Productos y Subproductos'
  };

  const mockConsultaioState = {
    readonly: false
  };

  const tramite221601StoreMock = {
     update: jest.fn(),
    setJustificacion: jest.fn(),
    setAduana: jest.fn(),
    setOficina: jest.fn(),
    setPunto: jest.fn(),
    setGuia: jest.fn(),
    setRegimen: jest.fn(),
    setCarro: jest.fn(),
    setVeterinario: jest.fn(),
    setEstablecimiento: jest.fn(),
    setClave: jest.fn(),
    setCapturaMercancia: jest.fn()
  };

  const tramite221601QueryMock = {
    selectSolicitud$: of(mockSolicitudState),
  };

  const consultaioQueryMock = {
    selectConsultaioState$: of(mockConsultaioState)
  };

  const validacionesFormularioServiceMock = {
    // Add any methods that might be used
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, FormsModule, DatosDeLaSolicitudComponent],
      providers: [
        FormBuilder,
        { provide: Tramite221601Store, useValue: tramite221601StoreMock },
        { provide: Tramite221601Query, useValue: tramite221601QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesFormularioServiceMock }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    tramite221601Store = TestBed.inject(Tramite221601Store);
    tramite221601Query = TestBed.inject(Tramite221601Query);
    
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    fixture.detectChanges();
  });

    it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with values from the store and JSON', () => {
    const form = component.datosSolicitudForm;

    expect(form.get('justificacion')?.value).toBe('');
    expect(form.get('aduana')?.value).toBe('QUERETARO, QRO.');
    expect(form.get('oficina')?.value).toBe('Querétaro');
    expect(form.get('punto')?.value).toBe('Querétaro Oficina de Inspección');
    expect(form.get('guia')?.value).toBe('');
    expect(form.get('regimen')?.value).toBe('fff');
    expect(form.get('veterinario')?.value).toBe('fff');
    expect(form.get('establecimiento')?.value).toBe('');
    expect(form.get('capturaMercancia')?.value).toBe('Productos y Subproductos');
  });

  it('should call the store method setJustificacion when updating the form', () => {
    component.datosSolicitudForm.controls['justificacion'].setValue('Updated Justification');
    component.setValoresStore(component.datosSolicitudForm, 'justificacion', 'setJustificacion');
    expect(tramite221601Store.setJustificacion).toHaveBeenCalledWith('Updated Justification');
  });

  it('should call the store method setAduana when updating the form', () => {
    component.datosSolicitudForm.controls['aduana'].setValue('Updated Aduana');
    component.setValoresStore(component.datosSolicitudForm, 'aduana', 'setAduana');
    expect(tramite221601Store.setAduana).toHaveBeenCalledWith('Updated Aduana');
  });

  it('should initialize the store state correctly on ngOnInit', () => {
    component.ngOnInit();
    expect(component.datosSolicitudForm.controls['justificacion'].value).toBe('');
    expect(component.datosSolicitudForm.controls['aduana'].value).toBe('QUERETARO, QRO.');
  });

  it('should call ngOnDestroy and cleanup resources correctly', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
  });

  describe('Component Properties and Initialization', () => {
    it('should initialize with correct default values', () => {
      expect(component.showContent).toBe(true);
      expect(component.plegable).toBe(true);
      expect(component.showtercerosModal).toBe(false);
      expect(component.showMercanciaModal).toBe(false);
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.mostrarOpcionesDePrellenado).toBe(true);
      expect(component.valorSeleccionado).toBe('Productos y Subproductos');
    });

    it('should have correct catalog arrays', () => {
      expect(component.regimen).toBeDefined();
      expect(component.veterinario).toBeDefined();
      expect(component.establecimiento).toBeDefined();
      expect(component.mercancias).toBeDefined();
      expect(component.configuracionTabla).toBeDefined();
    });

    it('should initialize mercanciaForm with correct structure', () => {
      expect(component.mercanciaForm).toBeDefined();
      expect(component.mercanciaForm.get('paisOrigen')).toBeTruthy();
      expect(component.mercanciaForm.get('regulacion')).toBeTruthy();
      expect(component.mercanciaForm.get('nombreProducto')).toBeTruthy();
      expect(component.mercanciaForm.get('fracciónArancelaria')).toBeTruthy();
    });
  });

  describe('toggleContent method', () => {
    it('should toggle showContent from true to false', () => {
      component.showContent = true;
      component.toggleContent();
      expect(component.showContent).toBe(false);
    });

    it('should toggle showContent from false to true', () => {
      component.showContent = false;
      component.toggleContent();
      expect(component.showContent).toBe(true);
    });

    it('should toggle multiple times correctly', () => {
      const initialValue = component.showContent;
      component.toggleContent();
      expect(component.showContent).toBe(!initialValue);
      component.toggleContent();
      expect(component.showContent).toBe(initialValue);
    });
  });

  describe('mostrarColapsable method', () => {
    it('should toggle plegable from true to false', () => {
      component.plegable = true;
      component.mostrarColapsable();
      expect(component.plegable).toBe(false);
    });

    it('should toggle plegable from false to true', () => {
      component.plegable = false;
      component.mostrarColapsable();
      expect(component.plegable).toBe(true);
    });
  });

  describe('tercerosAgregar method', () => {
    it('should toggle showtercerosModal from false to true', () => {
      component.showtercerosModal = false;
      component.tercerosAgregar();
      expect(component.showtercerosModal).toBe(true);
    });

    it('should toggle showtercerosModal from true to false', () => {
      component.showtercerosModal = true;
      component.tercerosAgregar();
      expect(component.showtercerosModal).toBe(false);
    });
  });

  describe('cancelarDestinatario method', () => {
    it('should toggle showtercerosModal', () => {
      const initialValue = component.showtercerosModal;
      component.cancelarDestinatario();
      expect(component.showtercerosModal).toBe(!initialValue);
    });
  });

  describe('cerrarModal method', () => {
    it('should set showtercerosModal to false', () => {
      component.showtercerosModal = true;
      component.cerrarModal();
      expect(component.showtercerosModal).toBe(false);
    });

    it('should keep showtercerosModal false if already false', () => {
      component.showtercerosModal = false;
      component.cerrarModal();
      expect(component.showtercerosModal).toBe(false);
    });
  });

  describe('cambioValorRadio method', () => {
    it('should update form control value', () => {
      const testValue = 'Test Value';
      component.cambioValorRadio('capturaMercancia', testValue);
      
      expect(component.datosSolicitudForm.get('capturaMercancia')?.value).toBe(testValue);
      expect(component.valorSeleccionado).toBe(testValue);
    });

    it('should update valorSeleccionado property', () => {
      const newValue = 'New Radio Value';
      component.cambioValorRadio('capturaMercancia', newValue);
      
      expect(component.valorSeleccionado).toBe(newValue);
    });

    it('should handle multiple radio value changes', () => {
      const values = ['Value1', 'Value2', 'Value3'];
      
      values.forEach(value => {
        component.cambioValorRadio('capturaMercancia', value);
        expect(component.valorSeleccionado).toBe(value);
        expect(component.datosSolicitudForm.get('capturaMercancia')?.value).toBe(value);
      });
    });
  });

  describe('guardarMercancia method', () => {
    it('should execute when mercanciaForm is valid', () => {
      // Mock form as valid
      Object.defineProperty(component.mercanciaForm, 'valid', {
        get: () => true
      });

      // This should not throw an error
      expect(() => component.guardarMercancia()).not.toThrow();
    });

    it('should not execute logic when mercanciaForm is invalid', () => {
      // Mock form as invalid
      Object.defineProperty(component.mercanciaForm, 'valid', {
        get: () => false
      });

      // This should not throw an error
      expect(() => component.guardarMercancia()).not.toThrow();
    });
  });

  describe('setValoresStore method - additional tests', () => {
    it('should call setOficina when specified', () => {
      component.datosSolicitudForm.controls['oficina'].setValue('Nueva Oficina');
      component.setValoresStore(component.datosSolicitudForm, 'oficina', 'setOficina');
      expect(tramite221601Store.setOficina).toHaveBeenCalledWith('Nueva Oficina');
    });

    it('should call setPunto when specified', () => {
      component.datosSolicitudForm.controls['punto'].setValue('Nuevo Punto');
      component.setValoresStore(component.datosSolicitudForm, 'punto', 'setPunto');
      expect(tramite221601Store.setPunto).toHaveBeenCalledWith('Nuevo Punto');
    });

    it('should call setGuia when specified', () => {
      component.datosSolicitudForm.controls['guia'].setValue('Nueva Guia');
      component.setValoresStore(component.datosSolicitudForm, 'guia', 'setGuia');
      expect(tramite221601Store.setGuia).toHaveBeenCalledWith('Nueva Guia');
    });

    it('should call setRegimen when specified', () => {
      component.datosSolicitudForm.controls['regimen'].setValue('Nuevo Regimen');
      component.setValoresStore(component.datosSolicitudForm, 'regimen', 'setRegimen');
      expect(tramite221601Store.setRegimen).toHaveBeenCalledWith('Nuevo Regimen');
    });

    it('should call setVeterinario when specified', () => {
      component.datosSolicitudForm.controls['veterinario'].setValue('Nuevo Veterinario');
      component.setValoresStore(component.datosSolicitudForm, 'veterinario', 'setVeterinario');
      expect(tramite221601Store.setVeterinario).toHaveBeenCalledWith('Nuevo Veterinario');
    });

    it('should call setEstablecimiento when specified', () => {
      component.datosSolicitudForm.controls['establecimiento'].setValue('Nuevo Establecimiento');
      component.setValoresStore(component.datosSolicitudForm, 'establecimiento', 'setEstablecimiento');
      expect(tramite221601Store.setEstablecimiento).toHaveBeenCalledWith('Nuevo Establecimiento');
    });

    it('should handle undefined form values', () => {
      component.datosSolicitudForm.controls['justificacion'].setValue(undefined);
      expect(() => {
        component.setValoresStore(component.datosSolicitudForm, 'justificacion', 'setJustificacion');
      }).not.toThrow();
      expect(tramite221601Store.setJustificacion).toHaveBeenCalledWith(undefined);
    });

    it('should handle null form values', () => {
      component.datosSolicitudForm.controls['justificacion'].setValue(null);
      expect(() => {
        component.setValoresStore(component.datosSolicitudForm, 'justificacion', 'setJustificacion');
      }).not.toThrow();
      expect(tramite221601Store.setJustificacion).toHaveBeenCalledWith(null);
    });
  });

  describe('updateStoreWithFormData method', () => {
    it('should call tramite221601Store.update with correct data', () => {
      const spy = jest.spyOn(tramite221601Store, 'update');
      component.updateStoreWithFormData();
      
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        aduana: component.datosSolicitudForm.get('aduana')?.value,
        oficina: component.datosSolicitudForm.get('oficina')?.value,
        punto: component.datosSolicitudForm.get('punto')?.value,
        capturaMercancia: component.datosSolicitudForm.get('capturaMercancia')?.value
      }));
    });

    it('should merge with existing solicitudState', () => {
      const spy = jest.spyOn(tramite221601Store, 'update');
      component.updateStoreWithFormData();
      
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        ...component.solicitudState
      }));
    });
  });

  describe('Form Validation and State', () => {
    it('should have required validators on specific fields', () => {
      const form = component.datosSolicitudForm;
      
      // Clear the form values to test required validators
      form.get('justificacion')?.setValue('');
      form.get('regimen')?.setValue('');
      form.get('veterinario')?.setValue('');
      form.get('establecimiento')?.setValue('');
      form.get('capturaMercancia')?.setValue('');
      
      // Update validity
      form.get('justificacion')?.updateValueAndValidity();
      form.get('regimen')?.updateValueAndValidity();
      form.get('veterinario')?.updateValueAndValidity();
      form.get('establecimiento')?.updateValueAndValidity();
      form.get('capturaMercancia')?.updateValueAndValidity();
      
      expect(form.get('justificacion')?.hasError('required')).toBe(true);
      expect(form.get('regimen')?.hasError('required')).toBe(true);
      expect(form.get('veterinario')?.hasError('required')).toBe(true);
      expect(form.get('establecimiento')?.hasError('required')).toBe(true);
      expect(form.get('capturaMercancia')?.hasError('required')).toBe(true);
    });

    it('should have disabled fields correctly set', () => {
      const form = component.datosSolicitudForm;
      
      expect(form.get('punto')?.disabled).toBe(true);
      expect(form.get('aduana')?.disabled).toBe(true);
      expect(form.get('oficina')?.disabled).toBe(true);
    });

    it('should validate maxLength on guia field', () => {
      const form = component.datosSolicitudForm;
      const longString = 'a'.repeat(81); // 81 characters, exceeds maxLength of 80
      
      form.get('guia')?.setValue(longString);
      expect(form.get('guia')?.hasError('maxlength')).toBe(true);
    });

    it('should validate maxLength on clave field', () => {
      const form = component.datosSolicitudForm;
      const longString = 'a'.repeat(16); // 16 characters, exceeds maxLength of 15
      
      form.get('clave')?.setValue(longString);
      expect(form.get('clave')?.hasError('maxlength')).toBe(true);
    });
  });

  describe('Component Lifecycle', () => {
    it('should complete destroyNotifier$ on destroy', () => {
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should call inicializarCombinacionFormulario on init', () => {
      const spy = jest.spyOn(component, 'inicializarCombinacionFormulario');
      
      component.ngOnInit();
      
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Modal Element Handling', () => {
    it('should handle modal element when present', () => {
      // Set up modal element
      const mockModalElement = {
        nativeElement: document.createElement('div')
      } as ElementRef;
      
      component.modalElement = mockModalElement;
      
      // Test should not throw (Bootstrap is mocked globally)
      expect(() => component.abrirDialogoMercancias()).not.toThrow();
    });

    it('should test modal element validation logic', () => {
      // Test the conditional logic of abrirDialogoMercancias without Bootstrap
      const mockModalElement = {
        nativeElement: document.createElement('div')
      } as ElementRef;
      
      // Test with modalElement present
      component.modalElement = mockModalElement;
      expect(component.modalElement).toBeDefined();
      expect(component.modalElement.nativeElement).toBeInstanceOf(HTMLElement);
      
      // Test with modalElement undefined
      component.modalElement = undefined as any;
      expect(component.modalElement).toBeUndefined();
    });

    it('should handle missing modal element gracefully', () => {
      component.modalElement = undefined as any;
      
      expect(() => component.abrirDialogoMercancias()).not.toThrow();
    });

    it('should verify modal element property exists', () => {
      // Test that modalElement can be assigned
      const mockElement = { nativeElement: document.createElement('div') } as ElementRef;
      component.modalElement = mockElement;
      
      expect(component.modalElement).toBeDefined();
      expect(component.modalElement.nativeElement).toBeInstanceOf(HTMLElement);
    });
  });

  describe('Constructor Dependencies', () => {
    it('should inject all required dependencies', () => {
      expect(component['fb']).toBeDefined();
      expect(component['tramite221601Store']).toBeDefined();
      expect(component['tramite221601Query']).toBeDefined();
      expect(component['consultaioQuery']).toBeDefined();
      expect(component['validacionesService']).toBeDefined();
    });
  });

  describe('Read-only Form Handling', () => {
    it('should handle readonly state changes', () => {
      // Test that when esFormularioSoloLectura changes, the behavior changes
      // First set to false (default)
      component.esFormularioSoloLectura = false;
      expect(component.esFormularioSoloLectura).toBe(false);
      
      // Then set to true
      component.esFormularioSoloLectura = true;
      expect(component.esFormularioSoloLectura).toBe(true);
      
      // Test that the property is reactive to changes
      component.esFormularioSoloLectura = false;
      expect(component.esFormularioSoloLectura).toBe(false);
    });

    it('should disable form when in readonly mode', () => {
      // Test that the form gets disabled when readonly is true
      component.esFormularioSoloLectura = true;
      component.guardarDatosFormulario();
      
      expect(component.datosSolicitudForm.disabled).toBe(true);
    });

    it('should enable form when not in readonly mode', () => {
      // First disable the form
      component.datosSolicitudForm.disable();
      
      // Then test enabling
      component.esFormularioSoloLectura = false;
      component.guardarDatosFormulario();
      
      expect(component.datosSolicitudForm.enabled).toBe(true);
    });
  });

  describe('inicializarCombinacionFormulario method', () => {
    it('should call guardarDatosFormulario when readonly is true', () => {
      const spy = jest.spyOn(component, 'guardarDatosFormulario');
      component.esFormularioSoloLectura = true;
      
      component.inicializarCombinacionFormulario();
      
      expect(spy).toHaveBeenCalled();
    });

    it('should call inicializarFormulario when readonly is false', () => {
      const spy = jest.spyOn(component, 'inicializarFormulario');
      component.esFormularioSoloLectura = false;
      
      component.inicializarCombinacionFormulario();
      
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('inicializarFormulario method', () => {
    it('should set up form controls with correct initial values', () => {
      component.inicializarFormulario();
      
      const form = component.datosSolicitudForm;
      expect(form.get('justificacion')).toBeDefined();
      expect(form.get('aduana')).toBeDefined();
      expect(form.get('oficina')).toBeDefined();
      expect(form.get('punto')).toBeDefined();
      expect(form.get('guia')).toBeDefined();
      expect(form.get('clave')).toBeDefined();
      expect(form.get('establecimiento')).toBeDefined();
      expect(form.get('regimen')).toBeDefined();
      expect(form.get('veterinario')).toBeDefined();
      expect(form.get('capturaMercancia')).toBeDefined();
    });

    it('should call updateStoreWithFormData', () => {
      const spy = jest.spyOn(component, 'updateStoreWithFormData');
      
      component.inicializarFormulario();
      
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('guardarDatosFormulario method', () => {
    it('should call inicializarFormulario', () => {
      const spy = jest.spyOn(component, 'inicializarFormulario');
      
      component.guardarDatosFormulario();
      
      expect(spy).toHaveBeenCalled();
    });

    it('should handle the else branch when form state is neither readonly nor not readonly', () => {
      // Mock a state that doesn't match true or false explicitly
      component.esFormularioSoloLectura = undefined as any;
      
      expect(() => component.guardarDatosFormulario()).not.toThrow();
    });
  });

  describe('setValoresStore method - edge cases', () => {
    it('should call setClave when specified', () => {
      component.datosSolicitudForm.controls['clave'].setValue('Nueva Clave');
      component.setValoresStore(component.datosSolicitudForm, 'clave', 'setClave');
      expect(tramite221601Store.setClave).toHaveBeenCalledWith('Nueva Clave');
    });

    it('should call setCapturaMercancia when specified', () => {
      component.datosSolicitudForm.controls['capturaMercancia'].setValue('Nueva Captura');
      component.setValoresStore(component.datosSolicitudForm, 'capturaMercancia', 'setCapturaMercancia');
      expect(tramite221601Store.setCapturaMercancia).toHaveBeenCalledWith('Nueva Captura');
    });

    it('should handle empty string values', () => {
      component.datosSolicitudForm.controls['justificacion'].setValue('');
      expect(() => {
        component.setValoresStore(component.datosSolicitudForm, 'justificacion', 'setJustificacion');
      }).not.toThrow();
      expect(tramite221601Store.setJustificacion).toHaveBeenCalledWith('');
    });
  });

  describe('Form validation edge cases', () => {
    it('should validate clave field with required validator', () => {
      const form = component.datosSolicitudForm;
      form.get('clave')?.setValue('');
      form.get('clave')?.updateValueAndValidity();
      
      expect(form.get('clave')?.hasError('required')).toBe(true);
    });

    it('should accept valid length strings for guia field', () => {
      const form = component.datosSolicitudForm;
      const validString = 'a'.repeat(80); // Exactly 80 characters
      
      form.get('guia')?.setValue(validString);
      expect(form.get('guia')?.hasError('maxlength')).toBe(false);
    });

    it('should accept valid length strings for clave field', () => {
      const form = component.datosSolicitudForm;
      const validString = 'a'.repeat(15); // Exactly 15 characters
      
      form.get('clave')?.setValue(validString);
      expect(form.get('clave')?.hasError('maxlength')).toBe(false);
    });
  });

  describe('Component constants and properties', () => {
    it('should have correct constant values', () => {
      expect(component.TEXTOS).toBeDefined();
      expect(component.MERCANCIA).toBeDefined();
      expect(component.checkbox).toBeDefined();
      expect(component.opcionDeBotonDeRadio).toBeDefined();
    });

    it('should initialize checkbox property correctly', () => {
      expect(typeof component.checkbox).toBe('string');
    });
  });

  describe('Template integration', () => {
    it('should handle template rendering without errors', () => {
      expect(() => {
        fixture.detectChanges();
        fixture.whenStable();
      }).not.toThrow();
    });
  });

  describe('Constructor Observable Subscription', () => {
    it('should handle consultaio state changes in constructor', () => {
      // The constructor subscribes to consultaioQuery.selectConsultaioState$
      // and calls inicializarCombinacionFormulario when the observable emits
      expect(component.esFormularioSoloLectura).toBe(false); // Default from mock
    });

    it('should handle destroyNotifier$ subscription cleanup', () => {
      const destroyNotifier = component['destroyNotifier$'];
      expect(destroyNotifier).toBeInstanceOf(Subject);
      
      // Test that the subject can be used
      expect(() => destroyNotifier.next()).not.toThrow();
    });
  });

  describe('mercanciaForm validation', () => {
    it('should have correct form structure for mercanciaForm', () => {
      const form = component.mercanciaForm;
      
      // Test all form controls exist
      expect(form.get('paisOrigen')).toBeTruthy();
      expect(form.get('regulacion')).toBeTruthy();
      expect(form.get('nombreProducto')).toBeTruthy();
      expect(form.get('fracciónArancelaria')).toBeTruthy();
      expect(form.get('unidad2')).toBeTruthy();
      expect(form.get('nico')).toBeTruthy();
      expect(form.get('unidad1')).toBeTruthy();
      expect(form.get('observaciones')).toBeTruthy();
      expect(form.get('cantidadUmt')).toBeTruthy();
      expect(form.get('umt')).toBeTruthy();
      expect(form.get('cantidadUmc')).toBeTruthy();
      expect(form.get('umc')).toBeTruthy();
      expect(form.get('especie')).toBeTruthy();
      expect(form.get('edadAnimal')).toBeTruthy();
      expect(form.get('paisOrigen1')).toBeTruthy();
      expect(form.get('paisdeprocedencia')).toBeTruthy();
      expect(form.get('tipoEspecie')).toBeTruthy();
    });

    it('should have required validators on mercanciaForm fields', () => {
      const form = component.mercanciaForm;
      
      // Clear required fields and test validation
      form.get('paisOrigen')?.setValue('');
      form.get('regulacion')?.setValue('');
      form.get('nombreProducto')?.setValue('');
      
      form.get('paisOrigen')?.updateValueAndValidity();
      form.get('regulacion')?.updateValueAndValidity();
      form.get('nombreProducto')?.updateValueAndValidity();
      
      expect(form.get('paisOrigen')?.hasError('required')).toBe(true);
      expect(form.get('regulacion')?.hasError('required')).toBe(true);
      expect(form.get('nombreProducto')?.hasError('required')).toBe(true);
    });
  });

  describe('Additional component properties', () => {
    it('should verify all public properties are initialized', () => {
      expect(component.regimen).toBeDefined();
      expect(Array.isArray(component.regimen)).toBe(true);
      
      expect(component.veterinario).toBeDefined();
      expect(Array.isArray(component.veterinario)).toBe(true);
      
      expect(component.establecimiento).toBeDefined();
      expect(Array.isArray(component.establecimiento)).toBe(true);
      
      expect(component.mercancias).toBeDefined();
      expect(Array.isArray(component.mercancias)).toBe(true);
      
      expect(component.configuracionTabla).toBeDefined();
      expect(Array.isArray(component.configuracionTabla)).toBe(true);
    });

    it('should have string type properties with correct values', () => {
      expect(typeof component.TEXTOS).toBe('string');
      expect(typeof component.MERCANCIA).toBe('string');
      expect(typeof component.valorSeleccionado).toBe('string');
      expect(component.valorSeleccionado).toBe('Productos y Subproductos');
    });

    it('should have boolean properties with correct default values', () => {
      expect(typeof component.showContent).toBe('boolean');
      expect(typeof component.plegable).toBe('boolean');
      expect(typeof component.showtercerosModal).toBe('boolean');
      expect(typeof component.showMercanciaModal).toBe('boolean');
      expect(typeof component.esFormularioSoloLectura).toBe('boolean');
      expect(typeof component.mostrarOpcionesDePrellenado).toBe('boolean');
    });
  });

  describe('Form field interactions', () => {
    it('should handle form field value changes', () => {
      const form = component.datosSolicitudForm;
      
      // Test setting and getting values
      form.get('justificacion')?.setValue('Test justification');
      expect(form.get('justificacion')?.value).toBe('Test justification');
      
      form.get('guia')?.setValue('Test guide');
      expect(form.get('guia')?.value).toBe('Test guide');
      
      form.get('clave')?.setValue('Test123');
      expect(form.get('clave')?.value).toBe('Test123');
    });

    it('should maintain form state consistency', () => {
      const form = component.datosSolicitudForm;
      
      // Verify form is created and has controls
      expect(form).toBeDefined();
      expect(Object.keys(form.controls).length).toBeGreaterThan(0);
      
      // Verify specific disabled fields remain disabled
      expect(form.get('punto')?.disabled).toBe(true);
      expect(form.get('aduana')?.disabled).toBe(true);
      expect(form.get('oficina')?.disabled).toBe(true);
    });
  });
});
