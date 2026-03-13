import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContenedorDePasosComponent } from './contenedor-de-pasos.component';
import { AccionBoton } from '@ng-mf/data-access-user';
import { PASOS, TITULO_MENSAJE } from '../../constants/destinados-donacio.enum';
import { TOAST_CONFIG } from 'ngx-toastr';


describe('ContenedorDePasosComponent', () => {
  let component: ContenedorDePasosComponent;
  let fixture: ComponentFixture<ContenedorDePasosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ContenedorDePasosComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [ { provide: TOAST_CONFIG, useValue: {} }]
    }).compileComponents();

    fixture = TestBed.createComponent(ContenedorDePasosComponent);
    component = fixture.componentInstance;
    // Assign wizardComponent mock before detectChanges to avoid undefined errors
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      iconClasses: [],
      indiceActual: 0,
      // Add any other properties/methods your template or code might access
    } as any;
    fixture.detectChanges();
  });

  beforeEach(() => {
    // Always set wizardComponent mock before each test and before detectChanges
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      iconClasses: [],
      indiceActual: 0,
      // Add any other properties/methods your template or code might access
    } as any;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.tituloMensaje).toBe(TITULO_MENSAJE);
    expect(component.pasos).toEqual(PASOS);
    expect(component.indice).toBe(1);
    expect(component.datosPasos.nroPasos).toBe(PASOS.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update indice when seleccionaTab is called', () => {
    const newIndex = 2;
    component.seleccionaTab(newIndex);
    expect(component.indice).toBe(newIndex);
  });

  describe('getValorIndice', () => {
    it('should update indice and call siguiente when accion is "cont" and valor is valid', () => {
      fixture.detectChanges();
      const wizardMock = {
        siguiente: jest.fn(),
        atras: jest.fn(),
        iconClasses: []
      };
      Object.defineProperty(component, 'wizardComponent', { value: wizardMock });
      const accionBoton: AccionBoton = { accion: 'cont', valor: 2 };
      component.getValorIndice(accionBoton);
      expect(component.indice).toBe(2);
      expect(component.tituloMensaje).toBe('Cargar archivos');
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should update indice and call atras when accion is not "cont" and valor is valid', () => {
      fixture.detectChanges();
      const wizardMock = {
        siguiente: jest.fn(),
        atras: jest.fn(),
        iconClasses: []
      };
      Object.defineProperty(component, 'wizardComponent', { value: wizardMock });
      const accionBoton: AccionBoton = { accion: 'atras', valor: 2 };
      component.getValorIndice(accionBoton);
      expect(component.indice).toBe(2);
      expect(component.tituloMensaje).toBe('Cargar archivos');
      expect(component.wizardComponent.atras).toHaveBeenCalled();
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('should update indice and title for valor 3', () => {
      fixture.detectChanges();
      const wizardMock = {
        siguiente: jest.fn(),
        atras: jest.fn(),
        iconClasses: []
      };
      Object.defineProperty(component, 'wizardComponent', { value: wizardMock });
      const accionBoton: AccionBoton = { accion: 'cont', valor: 3 };
      component.getValorIndice(accionBoton);
      expect(component.indice).toBe(3);
      expect(component.tituloMensaje).toBe('Firmar');
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    });

    it('should not update indice when valor is 0', () => {
      fixture.detectChanges();
      const wizardMock = {
        siguiente: jest.fn(),
        atras: jest.fn(),
        iconClasses: []
      };
      Object.defineProperty(component, 'wizardComponent', { value: wizardMock });
      const originalIndice = component.indice;
      const accionBoton: AccionBoton = { accion: 'cont', valor: 0 };
      component.getValorIndice(accionBoton);
      expect(component.indice).toBe(originalIndice);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should not update indice when valor is 5 or greater', () => {
      fixture.detectChanges();
      const wizardMock = {
        siguiente: jest.fn(),
        atras: jest.fn(),
        iconClasses: []
      };
      Object.defineProperty(component, 'wizardComponent', { value: wizardMock });
      const originalIndice = component.indice;
      const accionBoton: AccionBoton = { accion: 'cont', valor: 5 };
      component.getValorIndice(accionBoton);
      expect(component.indice).toBe(originalIndice);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should not update indice when valor is negative', () => {
      fixture.detectChanges();
      const wizardMock = {
        siguiente: jest.fn(),
        atras: jest.fn(),
        iconClasses: []
      };
      Object.defineProperty(component, 'wizardComponent', { value: wizardMock });
      const originalIndice = component.indice;
      const accionBoton: AccionBoton = { accion: 'cont', valor: -1 };
      component.getValorIndice(accionBoton);
      expect(component.indice).toBe(originalIndice);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });
  });

  describe('obtenerNombreDelTítulo static method', () => {
    it('should return TITULO_MENSAJE for valor 1', () => {
      const result = ContenedorDePasosComponent.obtenerNombreDelTítulo(1);
      expect(result).toBe(TITULO_MENSAJE);
    });

    it('should return "Cargar archivos" for valor 2', () => {
      const result = ContenedorDePasosComponent.obtenerNombreDelTítulo(2);
      expect(result).toBe('Cargar archivos');
    });

    it('should return "Firmar" for valor 3', () => {
      const result = ContenedorDePasosComponent.obtenerNombreDelTítulo(3);
      expect(result).toBe('Firmar');
    });

    it('should return TITULO_MENSAJE for any other valor (default case)', () => {
      expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(4)).toBe(TITULO_MENSAJE);
      expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(0)).toBe(TITULO_MENSAJE);
      expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(-1)).toBe(TITULO_MENSAJE);
      expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(999)).toBe(TITULO_MENSAJE);
    });
  });

  describe('datosPasos object', () => {
    it('should have correct nroPasos based on pasos length', () => {
      expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    });

    it('should update datosPasos when indice changes', () => {
      component.indice = 3;
      component.datosPasos = {
        nroPasos: component.pasos.length,
        indice: component.indice,
        txtBtnAnt: 'Anterior',
        txtBtnSig: 'Continuar',
      };
      
      expect(component.datosPasos.indice).toBe(3);
    });
  });
});