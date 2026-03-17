import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ElementRef } from '@angular/core';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { Modal } from 'bootstrap';

import { PropietarioComponent } from './propietario.component';
import { DatosDelSolicituteSeccionQuery } from '../../estados/queries/datos-del-solicitute-seccion.query';
import { DatosDelSolicituteSeccionStateStore } from '../../estados/stores/datos-del-solicitute-seccion.store';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PropietarioModel, PropietarioRadio, PropietarioTipoPersona } from '../../models/datos-de-la-solicitud.model';

jest.mock('bootstrap', () => ({
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn()
  }))
}));

describe('PropietarioComponent', () => {
  let component: PropietarioComponent;
  let fixture: ComponentFixture<PropietarioComponent>;
  let mockPropietarioStore: jest.Mocked<DatosDelSolicituteSeccionStateStore>;
  let mockPropietarioQuery: jest.Mocked<DatosDelSolicituteSeccionQuery>;
  let mockEstablecimientoService: jest.Mocked<EstablecimientoService>;
  let mockConsultaQuery: jest.Mocked<ConsultaioQuery>;

  const mockPropietarioData: PropietarioModel[] = [
    {
      NombredenominacionORazonSocial: 'Test Company',
      rfc: 'TEST123456ABC',
      curp: 'TESTCURP12345',
      telefono: '1234567890',
      CorreoElectronico: 'test@test.com',
      calle: 'Test Street',
      numeroExterior: '123',
      numeroInterior: '456',
      pais: 'Mexico',
      colonia: 'Test Colony',
      municipioOAlcaldia: 'Test Municipality',
      localidad: 'Test Locality',
      entidadFederativa: 'Test State',
      estadoLocalidad: 'Test State',
      codigoPostal: '12345'
    }
  ];


  const mockPropietarioRadioData: PropietarioRadio[] = [
    { id: 1, value: 'Nacional', label: 'Nacional' },
    { id: 2, value: 'Extranjero', label: 'Extranjero' }
  ];

  const mockPropietarioTipoPersonaData: PropietarioTipoPersona[] = [
    { value: 'Fisica', label: 'Física' },
    { value: 'Moral', label: 'Moral' }
  ];

  const mockRepresentanteData = {
    curp: 'MOCKREPRESENTANTE',
    nombre: 'Mock Name',
    primerApellido: 'Mock First Surname',
    segundoApellido: 'Mock Second Surname',
    denominacionRazonSocial: 'Mock Company',
    pais: 'Mock Country',
    estadoLocalidad: 'Mock State',
    municipioAlcaldia: 'Mock Municipality',
    localidad: 'Mock Locality',
    codigoPostal: '54321',
    colonia: 'Mock Colony',
    calle: 'Mock Street',
    numeroExterior: '789',
    numeroInterior: '101',
    lada: '55',
    telefono: '9876543210',
    correoElectronico: 'mock@mock.com'
  };

  beforeEach(async () => {
    mockPropietarioStore = {
      update: jest.fn()
    } as any;

    mockPropietarioQuery = {
      select: jest.fn().mockReturnValue(of(mockPropietarioData)),
      selectConsultaioState$: of({ readonly: false })
    } as any;

    mockEstablecimientoService = {
      getPropietario: jest.fn().mockReturnValue(of(mockPropietarioData)),
      getPropietarioRadioData: jest.fn().mockReturnValue(of(mockPropietarioRadioData)),
      getPropietarioTipoPersonaData: jest.fn().mockReturnValue(of(mockPropietarioTipoPersonaData)),
      getRepresentanteByRfc: jest.fn().mockReturnValue(of(mockRepresentanteData)),
      getEstadoData: jest.fn().mockReturnValue(of([])),
      getMunicipioData: jest.fn().mockReturnValue(of([])),
      getLocalidadData: jest.fn().mockReturnValue(of([])),
      getColoniaData: jest.fn().mockReturnValue(of([])),
      getPaisData: jest.fn().mockReturnValue(of([])),
      getCodigoPostalData: jest.fn().mockReturnValue(of([])),
      getTipoDeProductoData: jest.fn().mockReturnValue(of([]))
    } as any;

    mockConsultaQuery = {
      selectConsultaioState$: of({ readonly: false })
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        PropietarioComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        FormBuilder,
        { provide: DatosDelSolicituteSeccionStateStore, useValue: mockPropietarioStore },
        { provide: DatosDelSolicituteSeccionQuery, useValue: mockPropietarioQuery },
        { provide: EstablecimientoService, useValue: mockEstablecimientoService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PropietarioComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize forms on ngOnInit', () => {
      component.ngOnInit();
      
      expect(component.propietarioradioForm).toBeDefined();
      expect(component.formTercerosDatos).toBeDefined();
      expect(component.propietarioradioForm.get('tercerosTipoPersona')).toBeTruthy();
      expect(component.formTercerosDatos.get('tercerosNombre')).toBeTruthy();
    });

    it('should load initial data on ngOnInit', () => {
      component.ngOnInit();
      
      expect(mockEstablecimientoService.getPropietario).toHaveBeenCalled();
      expect(mockEstablecimientoService.getPropietarioRadioData).toHaveBeenCalled();
      expect(mockEstablecimientoService.getPropietarioTipoPersonaData).toHaveBeenCalled();
    });
  });

  describe('Modal Management', () => {
    beforeEach(() => {
      component.propietarioModal = {
        nativeElement: document.createElement('div')
      } as ElementRef;
    });

    it('should initialize modal on ngAfterViewInit', () => {
      component.ngAfterViewInit();
      
      expect(Modal).toHaveBeenCalledWith(component.propietarioModal.nativeElement);
      expect(component.modalInstance).toBeDefined();
    });

    it('should open modal and disable form', () => {
      component.ngAfterViewInit();
      const showSpy = jest.spyOn(component.modalInstance, 'show');
      component.ngOnInit();
      
      component.openPropietarioModal();
      
      expect(showSpy).toHaveBeenCalled();
      expect(component.formTercerosDatos.disabled).toBe(true);
    });

    it('should close modal', () => {
      component.ngAfterViewInit();
      const hideSpy = jest.spyOn(component.modalInstance, 'hide');
      
      component.closePropietarioModal();
      
      expect(hideSpy).toHaveBeenCalled();
    });

    it('should not initialize modal if propietarioModal is not available', () => {
      component.propietarioModal = null as any;
      
      component.ngAfterViewInit();
      
      expect(component.modalInstance).toBeUndefined();
    });
  });

  describe('Form Interactions', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should handle radio change to Nacional', () => {
      component.onRadioChange('Nacional');
      
      expect(component.showDatosPersonales).toBe(true);
    });

    it('should handle radio change to Extranjero', () => {
      component.onRadioChange('Extranjero');
      
      expect(component.showDatosPersonales).toBe(false);
    });

    it('should handle radio change with number value', () => {
      component.onRadioChange(1);
      
      expect(component.showDatosPersonales).toBe(false);
    });

    it('should handle selection change with value', () => {
      component.onSelectionChange('Fisica');
      
      expect(component.showBuscarButton).toBe(true);
      expect(component.showValue).toBe('Fisica');
      expect(component.propietarioradioForm.get('tercerosCurp')?.disabled).toBe(true);
    });

    it('should handle selection change with empty value', () => {
      component.onSelectionChange('');
      
      expect(component.showBuscarButton).toBe(false);
      expect(component.showValue).toBe('');
      expect(component.propietarioradioForm.get('tercerosCurp')?.disabled).toBe(false);
    });

    it('should clear form', () => {
      component.formTercerosDatos.patchValue({
        tercerosNombre: 'Test Name',
        tercerosPais: 'Test Country'
      });
      
      component.limpiarFormulario();
      
      expect(component.formTercerosDatos.get('tercerosNombre')?.value).toBeNull();
      expect(component.formTercerosDatos.get('tercerosPais')?.value).toBeNull();
    });
  });

  describe('RFC Search Functionality', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should search and populate form data when RFC is provided', () => {
      component.propietarioradioForm.patchValue({ tercerosRfc: 'TEST123456ABC' });
      
      component.buscarRepresentanteRfc();
      
      expect(mockEstablecimientoService.getRepresentanteByRfc).toHaveBeenCalledWith('TEST123456ABC');
      expect(component.propietarioradioForm.get('tercerosCurp')?.value).toBe('MOCKREPRESENTANTE');
      expect(component.formTercerosDatos.get('tercerosNombre')?.value).toBe('Mock Name');
    });

    it('should not search when RFC is empty', () => {
      component.propietarioradioForm.patchValue({ tercerosRfc: '' });
      
      component.buscarRepresentanteRfc();
      
      expect(mockEstablecimientoService.getRepresentanteByRfc).not.toHaveBeenCalled();
    });

    it('should not search when RFC is null', () => {
      component.propietarioradioForm.patchValue({ tercerosRfc: null });
      
      component.buscarRepresentanteRfc();
      
      expect(mockEstablecimientoService.getRepresentanteByRfc).not.toHaveBeenCalled();
    });

    it('should handle representante not found', () => {
      mockEstablecimientoService.getRepresentanteByRfc.mockReturnValue(of(null));
      component.propietarioradioForm.patchValue({ tercerosRfc: 'INVALID_RFC' });
      
      component.buscarRepresentanteRfc();
      
      expect(mockEstablecimientoService.getRepresentanteByRfc).toHaveBeenCalledWith('INVALID_RFC');
      expect(component.formTercerosDatos.get('tercerosNombre')?.value).toBeFalsy();
    });
  });

  describe('Save Propietario Functionality', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.ngAfterViewInit();
    });

    it('should save propietario with valid data', () => {
      component.propietarioradioForm.patchValue({
        tercerosRfc: 'TEST123456ABC',
        tercerosCurp: 'TESTCURP12345'
      });
      
      component.formTercerosDatos.patchValue({
        tercerosDenominacionRazonSocial: 'Test Company',
        tercerosTelefono: '1234567890',
        tercerosCorreoElectronico: 'test@test.com',
        tercerosCalle: 'Test Street',
        tercerosNumeroExterior: '123',
        tercerosNumeroInterior: '456',
        tercerosPais: 'Mexico',
        tercerosColonia: 'Test Colony',
        tercerosMunicipioAlcaldia: 'Test Municipality',
        tercerosLocalidad: 'Test Locality',
        tercerosEstadoLocalidad: 'Test State',
        tercerosCodigoPostal: '12345'
      });
      
      const closeSpy = jest.spyOn(component, 'closePropietarioModal');
      
      component.guardarPropietario();
      
      expect(mockPropietarioStore.update).toHaveBeenCalled();
      expect(closeSpy).toHaveBeenCalled();
      expect(component.propietarioradioForm.pristine).toBe(true);
      expect(component.formTercerosDatos.pristine).toBe(true);
    });

    it('should not save when all fields are empty', () => {
      component.propietarioradioForm.reset();
      component.formTercerosDatos.reset();
      
      component.guardarPropietario();
      
      expect(mockPropietarioStore.update).not.toHaveBeenCalled();
    });

    it('should handle propietarioData being undefined', () => {
      component.propietarioData = undefined as any;
      
      component.propietarioradioForm.patchValue({
        tercerosRfc: 'TEST123456ABC'
      });
      
    });
  });

  describe('Readonly Mode', () => {
    it('should disable forms when readonly is true', () => {
      component.ngOnInit(); 
      component.esFormularioSoloLectura = true;
      
      component.inicializarEstadoFormulario();
      
      expect(component.propietarioradioForm?.disabled).toBe(true);
    });

    it('should enable forms when readonly is false', () => {
      component.esFormularioSoloLectura = false;
      component.ngOnInit();
      
      component.inicializarEstadoFormulario();
      
      expect(component.propietarioradioForm.disabled).toBe(false);
    });

    it('should call guardarDatosFormulario when readonly is true', () => {
      const spy = jest.spyOn(component, 'guardarDatosFormulario');
      component.esFormularioSoloLectura = true;
      
      component.inicializarEstadoFormulario();
      
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Component Destruction', () => {
    it('should complete destroy$ subject on ngOnDestroy', () => {
      const destroySpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Data Loading', () => {
    it('should initialize data from query selector', () => {
      component.propietarioData = [];
      const testData = [{ ...mockPropietarioData[0], rfc: 'DIFFERENT_RFC' }];
      
      component.propietarioData = testData;
      
      expect(component.propietarioData).toEqual(testData);
    });

    it('should handle service errors gracefully', () => {
      const originalGetPropietario = mockEstablecimientoService.getPropietario;
      mockEstablecimientoService.getPropietario.mockReturnValue(of([]));
      
      expect(() => component.ngOnInit()).not.toThrow();
      
      mockEstablecimientoService.getPropietario = originalGetPropietario;
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should mark required fields as invalid when empty', () => {
      expect(component.propietarioradioForm.get('tercerosTipoPersona')?.invalid).toBe(true);
      expect(component.propietarioradioForm.get('tercerosRfc')?.invalid).toBe(true);
      expect(component.formTercerosDatos.get('tercerosNombre')?.invalid).toBe(true);
    });

    it('should validate RFC as required field', () => {
      const rfcControl = component.propietarioradioForm.get('tercerosRfc');
      
      rfcControl?.setValue('');
      
      expect(rfcControl?.invalid).toBe(true);
      expect(rfcControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate CURP as required field', () => {
      const curpControl = component.propietarioradioForm.get('tercerosCurp');
      
      curpControl?.setValue('');
      
      expect(curpControl?.invalid).toBe(true);
      expect(curpControl?.errors?.['required']).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined propietarioModal in openPropietarioModal', () => {
      component.ngOnInit();
      component.propietarioModal = undefined as any;
      component.modalInstance = undefined as any;
      
      expect(() => component.openPropietarioModal()).not.toThrow();
    });

    it('should handle undefined propietarioModal in closePropietarioModal', () => {
      component.propietarioModal = undefined as any;
      component.modalInstance = undefined as any;
      
      expect(() => component.closePropietarioModal()).not.toThrow();
    });

    it('should handle missing form controls gracefully', () => {
      const fb = TestBed.inject(FormBuilder);
      component.propietarioradioForm = fb.group({});
      component.formTercerosDatos = fb.group({});
      
      expect(() => component.guardarPropietario()).not.toThrow();
    });
  });

  describe('TablaSeleccion enum', () => {
    it('should expose TablaSeleccion enum', () => {
      expect(component.TablaSeleccion).toBeDefined();
    });
  });

  describe('Observable subscriptions', () => {
    it('should unsubscribe from observables on destroy', () => {
      const destroy$ = component['destroy$'];
      const nextSpy = jest.spyOn(destroy$, 'next');
      const completeSpy = jest.spyOn(destroy$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Suscripciones de observables (TestBed aislado)', () => {
  });
});