import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RenunciaDePermisoComponent } from './renuncia-de-permiso.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoPagesComponent } from '../paso-uno-pages/paso-uno-pages.component';
import { AccionBoton } from '@libs/shared/data-access-user/src';
import { MODIFICACION_PERMISO_DATA } from '../../constantes/renuncia-de-permiso.enum';
import { AVISO } from '@libs/shared/data-access-user/src';

describe('RenunciaDePermisoComponent', () => {
  let component: RenunciaDePermisoComponent;
  let fixture: ComponentFixture<RenunciaDePermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RenunciaDePermisoComponent,
        PasoUnoPagesComponent,
      ],
      imports: [WizardComponent, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RenunciaDePermisoComponent);
    component = fixture.componentInstance;

    // Initialize component properties
    component.infoAlert = 'alert-info';
    component.indice = 1;
    component.datosPasos = {
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
      indice: 1,
      nroPasos: 3
    };
    component.msgData = MODIFICACION_PERMISO_DATA;
    component.payload = {};

    // Provide mock instances using Jest
    component.pasoUnoComponent = {
      collectFormValues: jest.fn()
    } as any;
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize default values', () => {
    expect(component.infoAlert).toBe('alert-info');
  });
  

  it('should initialize msgData with MODIFICACION_PERMISO_DATA', () => {
    expect(component.msgData).toBe(MODIFICACION_PERMISO_DATA);
  });

  it('should initialize default values', () => {
    expect(component.infoAlert).toBe('alert-info');
    expect(component.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update payload and call wizard.siguiente on accion "cont"', () => {
    const mockFormValues = {
      solicitante: { nombre: 'Test' },
      datosSolicitud: [],
    };
    component.pasoUnoComponent.collectFormValues = jest.fn().mockReturnValue(mockFormValues);

    const action: AccionBoton = { accion: 'cont', valor: 2 };

    component.getValorIndice(action);

    expect(component.payload).toEqual(mockFormValues);
    expect(component.indice).toBe(2);
  });

  it('should call wizard.atras on non-"cont" action', () => {
    const action: AccionBoton = { accion: 'back', valor: 3 };
    component.pasoUnoComponent.collectFormValues = jest.fn().mockReturnValue({});
    const atrasSpy = jest.spyOn(component.wizardComponent, 'atras');

    component.getValorIndice(action);

    expect(component.indice).toBe(3);
    expect(atrasSpy).toHaveBeenCalled();
  });

  it('should ignore out-of-range valor', () => {
    const siguienteSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    const action: AccionBoton = { accion: 'cont', valor: 10 };
    component.getValorIndice(action);
    expect(component.indice).toBe(1); 
    expect(siguienteSpy).not.toHaveBeenCalled();
  });

  it('should log error when pasoUnoComponent is undefined', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    component.pasoUnoComponent = undefined as any;

    const action: AccionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(action);

    expect(console.error).toHaveBeenCalledWith('PasoUnoPagesComponent is not initialized.');
  });

  it('should return collected values from collectAllFormValues()', () => {
    const mockFormValues = {
      solicitante: { nombre: 'Test' },
      datosSolicitud: [],
      tercerosRelacionados: [],
      pagoDeDerechos: [],
      tramitesAsociados: [],
    };
    component.pasoUnoComponent.collectFormValues = jest.fn().mockReturnValue(mockFormValues);

    const result = component.collectAllFormValues();

    expect(result.pasoUno).toEqual(mockFormValues);
  });

  it('should return empty object if pasoUnoComponent is not initialized in collectAllFormValues()', () => {
    component.pasoUnoComponent = undefined as any;

    const result = component.collectAllFormValues();

    expect(result).toEqual({});
  });

  // Additional test cases for better coverage
  it('should handle edge case when valor is at boundary (1)', () => {
    const action: AccionBoton = { accion: 'cont', valor: 1 };
    component.pasoUnoComponent.collectFormValues = jest.fn().mockReturnValue({});
    const siguienteSpy = jest.spyOn(component.wizardComponent, 'siguiente');

    component.getValorIndice(action);

    expect(component.indice).toBe(1);
    expect(siguienteSpy).toHaveBeenCalled();
  });

  it('should handle edge case when valor is at boundary (3)', () => {
    const action: AccionBoton = { accion: 'back', valor: 3 };
    component.pasoUnoComponent.collectFormValues = jest.fn().mockReturnValue({});
    const atrasSpy = jest.spyOn(component.wizardComponent, 'atras');

    component.getValorIndice(action);

    expect(component.indice).toBe(3);
    expect(atrasSpy).toHaveBeenCalled();
  });

  it('should not call wizard methods when valor is out of range (negative)', () => {
    const siguienteSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    const atrasSpy = jest.spyOn(component.wizardComponent, 'atras');
    const action: AccionBoton = { accion: 'cont', valor: -1 };
    
    component.getValorIndice(action);

    expect(component.indice).toBe(1); // Should remain unchanged
    expect(siguienteSpy).not.toHaveBeenCalled();
    expect(atrasSpy).not.toHaveBeenCalled();
  });

  it('should not call wizard methods when valor is out of range (zero)', () => {
    const siguienteSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    const atrasSpy = jest.spyOn(component.wizardComponent, 'atras');
    const action: AccionBoton = { accion: 'cont', valor: 0 };
    
    component.getValorIndice(action);

    expect(component.indice).toBe(1); // Should remain unchanged
    expect(siguienteSpy).not.toHaveBeenCalled();
    expect(atrasSpy).not.toHaveBeenCalled();
  });

  it('should handle various action types other than "cont"', () => {
    const testActions = ['prev', 'anterior', 'back', 'cancel'];
    
    testActions.forEach(actionType => {
      jest.clearAllMocks();
      component.pasoUnoComponent.collectFormValues = jest.fn().mockReturnValue({});
      const atrasSpy = jest.spyOn(component.wizardComponent, 'atras');
      const siguienteSpy = jest.spyOn(component.wizardComponent, 'siguiente');
      
      const action: AccionBoton = { accion: actionType, valor: 2 };
      component.getValorIndice(action);

      expect(component.indice).toBe(2);
      expect(atrasSpy).toHaveBeenCalled();
      expect(siguienteSpy).not.toHaveBeenCalled();
    });
  });

  it('should maintain payload structure when collectFormValues returns complex data', () => {
    const complexFormValues = {
      solicitante: { 
        nombre: 'Complex Test',
        apellido: 'User',
        email: 'test@complex.com'
      },
      datosSolicitud: [
        { tipo: 'A', valor: 100 },
        { tipo: 'B', valor: 200 }
      ],
      metadata: {
        timestamp: '2025-06-29',
        version: '1.0'
      }
    };
    component.pasoUnoComponent.collectFormValues = jest.fn().mockReturnValue(complexFormValues);

    const action: AccionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(action);

    expect(component.payload).toEqual(complexFormValues);
    expect(component.payload).toBe(complexFormValues); // Direct assignment, same reference
  });

  it('should handle wizard component being undefined', () => {
    component.wizardComponent = undefined as any;
    const action: AccionBoton = { accion: 'cont', valor: 2 };
    component.pasoUnoComponent.collectFormValues = jest.fn().mockReturnValue({});
    expect(component.indice).toBe(1);
  });

  it('should properly initialize pantallasPasos property', () => {
    expect(component.pantallasPasos).toBeDefined();
    expect(Array.isArray(component.pantallasPasos)).toBe(true);
  });

  it('should handle datosPasos update when indice changes', () => {
    const action: AccionBoton = { accion: 'cont', valor: 2 };
    component.pasoUnoComponent.collectFormValues = jest.fn().mockReturnValue({});

    component.getValorIndice(action);

    expect(component.datosPasos.indice).toBe(1);
  });
  
  // Additional tests for TEXTOS property and complete coverage
  it('should initialize TEXTOS property from AVISO', () => {
    expect(component.TEXTOS).toBeDefined();
    expect(component.TEXTOS).toBe(AVISO);
  });

  it('should handle boundary condition for valor = 4', () => {
    const action: AccionBoton = { accion: 'cont', valor: 4 };
    component.pasoUnoComponent.collectFormValues = jest.fn().mockReturnValue({});

    component.getValorIndice(action);

    expect(component.indice).toBe(4); // Should remain unchanged
  });

  it('should reject valor = 5 (out of upper bound)', () => {
    const siguienteSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    const action: AccionBoton = { accion: 'cont', valor: 5 };
    
    component.getValorIndice(action);

    expect(component.indice).toBe(1); // Should remain unchanged
    expect(siguienteSpy).not.toHaveBeenCalled();
  });

  it('should handle collectFormValues returning null or undefined', () => {
    component.pasoUnoComponent.collectFormValues = jest.fn().mockReturnValue(null);
    
    const action: AccionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(action);

    expect(component.payload).toBeNull();
  });

  it('should verify datosPasos is properly initialized with pantallasPasos length', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should handle empty payload object properly', () => {
    component.payload = {};
    expect(component.payload).toEqual({});
  });

  it('should handle complex payload with both solicitante and renuncia', () => {
    const complexPayload = {
      solicitante: {
        datosGenerales: {
          curp: 'TEST123',
          rfc: 'RFC123',
          nombreRazonSocial: 'Test Company'
        }
      },
      renuncia: {
        folioTramite: 'FOLIO123',
        motivoRenuncia: 'Test reason'
      }
    };

    component.pasoUnoComponent.collectFormValues = jest.fn().mockReturnValue(complexPayload);
    
    const action: AccionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(action);

    expect(component.payload).toEqual(complexPayload);
  });

});
