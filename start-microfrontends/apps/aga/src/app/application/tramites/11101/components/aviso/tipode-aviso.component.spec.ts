import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { of as observableOf } from 'rxjs';

import { TipodeAvisoComponent } from './tipode-aviso.component';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Tramite11101Query } from '../../estados/tramite11101.query';
import { TramiteFolioService } from '../../service/servicios-extraordinarios.service';
import { Tramite11101Store, Tramitenacionales11101State } from '../../estados/tramite11101.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockConsultaioQuery {
  selectConsultaioState$ = observableOf({
    readonly: false
  } as ConsultaioState);
}

@Injectable()
class MockTramite11101Query {
  selectSeccionState$ = observableOf({
    numeroderegistro: 'test',
    NobmreDenominationRazonSocial: 'Test Company',
    rfctaxid: 'TEST123456789',
    Telefono: '1234567890',
    correoelectronico: 'test@test.com'
  } as Tramitenacionales11101State);
}

@Injectable()
class MockTramiteFolioService {
  getEntidadfederativa() {
    return observableOf({ data: [{ id: 1, nombre: 'Test Estado' }] });
  }
  
  getAlcadilamunicipio() {
    return observableOf({ data: [{ id: 1, nombre: 'Test Municipio' }] });
  }
  
  getColonia() {
    return observableOf({ data: [{ id: 1, nombre: 'Test Colonia' }] });
  }
  
  getFormaParteDePatrimonio() {
    return observableOf({ data: [{ id: 1, nombre: 'Si' }] });
  }
  
  getUnidadmedida() {
    return observableOf({ data: [{ id: 1, nombre: 'Kg' }] });
  }
  
  getMoneda() {
    return observableOf({ data: [{ id: 1, nombre: 'MXN' }] });
  }
  
  getFin() {
    return observableOf({ data: [{ id: 1, nombre: 'Test Fin' }] });
  }
  
  getEstado() {
    return observableOf({ data: [{ id: 1, nombre: 'Activo' }] });
  }
  
  agregar() {
    return observableOf({
      success: true,
      datos: {
        id: 1,
        consecutivo: '0001',
        estado: 'En proceso',
        cantidad: '10',
        formapartadepatrimonia: 'Si'
      }
    });
  }
}

@Injectable()
class MockTramite11101Store {
  setEntidadadfederativa = jest.fn();
  setAlcadilamunicipio = jest.fn();
  setColonia = jest.fn();
  setFormaParteDePatrimonio = jest.fn();
  setUnidadmedida = jest.fn();
  setMoneda = jest.fn();
  setFin = jest.fn();
  setEstado = jest.fn();
  setPersonaFisicaExtranjeraTabla = jest.fn();
}

describe('TipodeAvisoComponent', () => {
  let component: TipodeAvisoComponent;
  let fixture: ComponentFixture<TipodeAvisoComponent>;
  let mockConsultaioQuery: MockConsultaioQuery;
  let mockTramiteService: MockTramiteFolioService;
  let mockStore: MockTramite11101Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TipodeAvisoComponent, HttpClientTestingModule, CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery },
        FormBuilder,
        { provide: Tramite11101Query, useClass: MockTramite11101Query },
        { provide: TramiteFolioService, useClass: MockTramiteFolioService },
        { provide: Tramite11101Store, useClass: MockTramite11101Store }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TipodeAvisoComponent);
    component = fixture.componentInstance;
    mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as any;
    mockTramiteService = TestBed.inject(TramiteFolioService) as any;
    mockStore = TestBed.inject(Tramite11101Store) as any;
  });

  describe('Component Initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.cargaMasiva).toBe(false);
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.isManualSelected).toBe(false);
      expect(component.discripccionDeLaMercanciaForm).toEqual([]);
    });

    it('should call initialization methods on ngOnInit', () => {
      const spyDonanteDomicilio = jest.spyOn(component, 'donanteDomicilio').mockImplementation(() => {});
      const spyInicializaCatalogos = jest.spyOn(component, 'inicializaCatalogos').mockImplementation(() => {});
      
      component.ngOnInit();
      
      expect(spyDonanteDomicilio).toHaveBeenCalled();
      expect(spyInicializaCatalogos).toHaveBeenCalled();
    });
  });

  describe('Form Initialization', () => {
    beforeEach(() => {
      component.solicitudState = {
        numeroderegistro: 'test123',
        NobmreDenominationRazonSocial: 'Test Company',
        rfctaxid: 'RFC123456789',
        Telefono: '1234567890',
        correoelectronico: 'test@example.com',
        entidadadfederativa: 'Test State',
        alcadilamunicipio: 'Test Municipality',
        colonia: 'Test Colony',
        codigopostal: '12345',
        calle: 'Test Street',
        numeroletraexterior: '123',
        numeroletrainterior: 'A',
        entrecalle: 'Between Street',
        ycalle: 'And Street',
        radioDomicilio: 'manual',
        estado: 'Active',
        cantidad: 10,
        formaParteDePatrimonio: 'Si',
        descripcion: 'Test Description',
        valor: 1000,
        unidadmedida: 'Kg',
        fraccionarancelaria: 12345678,
        nico: 123,
        marca: 'Test Brand',
        modelo: 'Test Model',
        numerodeserie: 987654321,
        fin: 'Test Purpose',
        moneda: 'MXN',
        especifique: 'Additional info',
        consecutivo: '001'
      } as any;
    });

    it('should create avisoForm with correct controls and validators', () => {
      component.donanteDomicilio();
      
      expect(component.avisoForm).toBeDefined();
      expect(component.avisoForm.get('numeroderegistro')).toBeDefined();
      expect(component.avisoForm.get('NobmreDenominationRazonSocial')).toBeDefined();
      expect(component.avisoForm.get('correoelectronico')).toBeDefined();
      
      // Test email validator
      const emailControl = component.avisoForm.get('correoelectronico');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.invalid).toBe(true);
      
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.valid).toBe(true);
    });

    it('should create mercanciaForm with correct controls and validators', () => {
      component.donanteDomicilio();
      
      expect(component.mercanciaForm).toBeDefined();
      expect(component.mercanciaForm.get('estado')).toBeDefined();
      expect(component.mercanciaForm.get('cantidad')).toBeDefined();
      expect(component.mercanciaForm.get('descripcion')).toBeDefined();
      
      // Test min validator
      const cantidadControl = component.mercanciaForm.get('cantidad');
      cantidadControl?.setValue(0);
      expect(cantidadControl?.invalid).toBe(true);
      
      cantidadControl?.setValue(5);
      expect(cantidadControl?.valid).toBe(true);
    });
  });

  describe('Form State Management', () => {
    beforeEach(() => {
      component.avisoForm = new FormBuilder().group({
        radioDomicilio: ['manual']
      });
      component.mercanciaForm = new FormBuilder().group({
        estado: ['active']
      });
    });

    it('should disable forms when esFormularioSoloLectura is true', () => {
      component.esFormularioSoloLectura = true;
      const spyAvisoDisable = jest.spyOn(component.avisoForm, 'disable');
      const spyMercanciaDisable = jest.spyOn(component.mercanciaForm, 'disable');
      
      component.inicializarEstadoFormulario();
      
      expect(spyAvisoDisable).toHaveBeenCalled();
      expect(spyMercanciaDisable).toHaveBeenCalled();
    });

    it('should enable forms when esFormularioSoloLectura is false', () => {
      component.esFormularioSoloLectura = false;
      const spyAvisoEnable = jest.spyOn(component.avisoForm, 'enable');
      const spyMercanciaEnable = jest.spyOn(component.mercanciaForm, 'enable');
      
      component.inicializarEstadoFormulario();
      
      expect(spyAvisoEnable).toHaveBeenCalled();
      expect(spyMercanciaEnable).toHaveBeenCalled();
    });

    it('should set manual mode correctly', () => {
      component.setManual();
      expect(component.isManualSelected).toBe(true);
      
      component.avisoForm.get('radioDomicilio')?.setValue('cargamasiva');
      component.setManual();
      expect(component.isManualSelected).toBe(false);
    });
  });

  describe('Selection Handlers', () => {
    beforeEach(() => {
      component.avisoForm = new FormBuilder().group({
        entidadadfederativa: ['test_state'],
        alcadilamunicipio: ['test_municipality'],
        colonia: ['test_colony']
      });
      
      component.mercanciaForm = new FormBuilder().group({
        formapartadepatrimonio: ['Si'],
        unidadmedida: ['Kg'],
        moneda: ['MXN'],
        fin: ['test_purpose'],
        estado: ['active']
      });
    });

    it('should handle entidadadFederativaSeleccion', () => {
      component.entidadadFederativaSeleccion();
      expect(mockStore.setEntidadadfederativa).toHaveBeenCalledWith('test_state');
    });

    it('should handle alcadilamunicipioSeleccion', () => {
      component.alcadilamunicipioSeleccion();
      expect(mockStore.setAlcadilamunicipio).toHaveBeenCalledWith('test_municipality');
    });

    it('should handle coloniaSeleccion', () => {
      component.coloniaSeleccion();
      expect(mockStore.setColonia).toHaveBeenCalledWith('test_colony');
    });

    it('should handle formaParteDePatrimonioSeleccion', () => {
      component.formaParteDePatrimonioSeleccion();
      expect(mockStore.setFormaParteDePatrimonio).toHaveBeenCalledWith('Si');
    });

    it('should handle unidadmedidaSeleccion', () => {
      component.unidadmedidaSeleccion();
      expect(mockStore.setUnidadmedida).toHaveBeenCalledWith('Kg');
    });

    it('should handle monedaSeleccion', () => {
      component.monedaSeleccion();
      expect(mockStore.setMoneda).toHaveBeenCalledWith('MXN');
    });

    it('should handle finSeleccion', () => {
      component.finSeleccion();
      expect(mockStore.setFin).toHaveBeenCalledWith('test_purpose');
    });

    it('should handle estadoSeleccion', () => {
      component.estadoSeleccion();
      expect(mockStore.setEstado).toHaveBeenCalledWith('active');
    });
  });

  describe('Catalog Initialization', () => {
    it('should initialize all catalogs', () => {
      const spyEntidad = jest.spyOn(mockTramiteService, 'getEntidadfederativa');
      const spyAlcaldia = jest.spyOn(mockTramiteService, 'getAlcadilamunicipio');
      const spyColonia = jest.spyOn(mockTramiteService, 'getColonia');
      const spyForma = jest.spyOn(mockTramiteService, 'getFormaParteDePatrimonio');
      const spyUnidad = jest.spyOn(mockTramiteService, 'getUnidadmedida');
      const spyMoneda = jest.spyOn(mockTramiteService, 'getMoneda');
      const spyFin = jest.spyOn(mockTramiteService, 'getFin');
      const spyEstado = jest.spyOn(mockTramiteService, 'getEstado');
      
      component.inicializaCatalogos();
      
      expect(spyEntidad).toHaveBeenCalled();
      expect(spyAlcaldia).toHaveBeenCalled();
      expect(spyColonia).toHaveBeenCalled();
      expect(spyForma).toHaveBeenCalled();
      expect(spyUnidad).toHaveBeenCalled();
      expect(spyMoneda).toHaveBeenCalled();
      expect(spyFin).toHaveBeenCalled();
      expect(spyEstado).toHaveBeenCalled();
    });
  });

  describe('Merchandise Management', () => {
    beforeEach(() => {
      component.mercanciaForm = new FormBuilder().group({
        estado: ['active', Validators.required],
        cantidad: [10, Validators.required],
        descripcion: ['test description', Validators.required]
      });
      component.discripccionDeLaMercanciaForm = [];
    });

    it('should add merchandise when form is valid', () => {
      const spyReset = jest.spyOn(component.mercanciaForm, 'reset');
      const spyMarkUntouched = jest.spyOn(component.mercanciaForm, 'markAsUntouched');
      const spyMarkPristine = jest.spyOn(component.mercanciaForm, 'markAsPristine');
      
      expect(component.discripccionDeLaMercanciaForm).toHaveLength(0);
      component.agregar();
      expect(component.discripccionDeLaMercanciaForm).toHaveLength(1);
      expect(mockStore.setPersonaFisicaExtranjeraTabla).toHaveBeenCalledWith(component.discripccionDeLaMercanciaForm);
      expect(spyReset).toHaveBeenCalled();
      expect(spyMarkUntouched).toHaveBeenCalled();
      expect(spyMarkPristine).toHaveBeenCalled();
    });

    it('should mark all as touched when form is invalid', () => {
      component.mercanciaForm.get('estado')?.setValue('');
      const spyMarkAllAsTouched = jest.spyOn(component.mercanciaForm, 'markAllAsTouched');
      
      component.agregar();
      
      expect(spyMarkAllAsTouched).toHaveBeenCalled();
    });

    it('should handle service response with single object data', () => {
      const singleResponse = {
        success: true,
        datos: {
          id: 1,
          consecutivo: '0001',
          estado: 'En proceso',
          cantidad: '10',
          formapartadepatrimonia: 'Si'
        }
      };
      
      jest.spyOn(mockTramiteService, 'agregar').mockReturnValue(observableOf(singleResponse));
      
      component.agregar();
      
      expect(component.discripccionDeLaMercanciaForm).toHaveLength(1);
    });

    it('should clear merchandise form', () => {
      const spyReset = jest.spyOn(component.mercanciaForm, 'reset');
      
      component.limpiar();
      
      expect(spyReset).toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.mercanciaForm = new FormBuilder().group({
        testField: ['', Validators.required]
      });
    });

    it('should return true for invalid and touched control', () => {
      const control = component.mercanciaForm.get('testField');
      control?.markAsTouched();
      
      expect(component.isInvalid('testField')).toBe(true);
    });

    it('should return true for invalid and dirty control', () => {
      const control = component.mercanciaForm.get('testField');
      control?.markAsDirty();
      
      expect(component.isInvalid('testField')).toBe(true);
    });

    it('should return false for valid control', () => {
      const control = component.mercanciaForm.get('testField');
      control?.setValue('valid value');
      control?.markAsTouched();
      
      expect(component.isInvalid('testField')).toBe(false);
    });

    it('should return false for non-existent control', () => {
      expect(component.isInvalid('nonExistentField')).toBe(false);
    });
  });

});
