// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { AggregarComplimentosComponent } from './aggregar-complimentos.component';
import { Tramite80101Store } from '../../estados/tramite80101.store';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { DatosComplimentos, SociaoAccionistas } from '../../../../shared/models/complimentos.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

@Injectable()
class MockTramite80101Store {
  setDatosComplimentos = jest.fn();
  aggregarTablaDatosComplimentos = jest.fn();
  aggregarTablaDatosComplimentosExtranjera = jest.fn();
  eliminarTablaDatosComplimentos = jest.fn();
  eliminarTablaDatosComplimentosExtranjera = jest.fn();
}

@Injectable()
class MockTramite80101Query {
  selectTablaDatosComplimentos$ = of([]);
  selectTablaDatosComplimentosExtranjera$ = of([]);
  selectDatosComplimento$ = of({} as DatosComplimentos);
}

describe('AggregarComplimentosComponent', () => {
  let component: AggregarComplimentosComponent;
  let fixture: ComponentFixture<AggregarComplimentosComponent>;
  let mockStore: MockTramite80101Store;
  let mockQuery: MockTramite80101Query;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggregarComplimentosComponent, HttpClientTestingModule],
      providers: [
        { provide: Tramite80101Store, useClass: MockTramite80101Store },
        { provide: Tramite80101Query, useClass: MockTramite80101Query },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AggregarComplimentosComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Tramite80101Store) as any;
    mockQuery = TestBed.inject(Tramite80101Query) as any;
    
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize observables in constructor', () => {
    expect(component.tablaDatosComplimentos$).toBeDefined();
    expect(component.tablaDatosComplimentosExtranjera$).toBeDefined();
  });

  it('should subscribe to selectDatosComplimento$ and update datosComplimentos', () => {
    const mockDatos: DatosComplimentos = { id: 1, nombre: 'Test' } as any;
    mockQuery.selectDatosComplimento$ = of(mockDatos);
    
    const newComponent = new AggregarComplimentosComponent(mockStore as any, mockQuery as any);
    
    expect(newComponent.datosComplimentos).toEqual(mockDatos);
  });

  it('should call setDatosComplimentos when modifierComplimentos is invoked', () => {
    const mockComplimentos: DatosComplimentos = { id: 1, nombre: 'Test' } as any;
    
    component.modifierComplimentos(mockComplimentos);
    
    expect(mockStore.setDatosComplimentos).toHaveBeenCalledWith(mockComplimentos);
  });

  describe('accionistasAgregados', () => {
    beforeEach(() => {
      component.sociaoAccionistas = [];
      component.sociaoAccionistasExtranjera = [];
    });

    it('should add to national table when RFC exists and not duplicate', () => {
      const mockAccionista: SociaoAccionistas = { 
        rfc: 'RFC123456789', 
        nombre: 'Test Nacional' 
      } as any;
      
      component.accionistasAgregados(mockAccionista);
      
      expect(mockStore.aggregarTablaDatosComplimentos).toHaveBeenCalledWith(mockAccionista);
      expect(mockStore.aggregarTablaDatosComplimentosExtranjera).not.toHaveBeenCalled();
    });

    it('should add to foreign table when no RFC and not duplicate', () => {
      const mockAccionista: SociaoAccionistas = { 
        taxId: 'TAX123', 
        nombre: 'Test Extranjero' 
      } as any;
      
      component.accionistasAgregados(mockAccionista);
      
      expect(mockStore.aggregarTablaDatosComplimentosExtranjera).toHaveBeenCalledWith(mockAccionista);
      expect(mockStore.aggregarTablaDatosComplimentos).not.toHaveBeenCalled();
    });

    it('should show notification when duplicate taxId exists', () => {
      const existingAccionista: SociaoAccionistas = { 
        taxId: 'TAX123', 
        nombre: 'Existing Foreign' 
      } as any;
      component.sociaoAccionistasExtranjera = [existingAccionista];
      
      jest.spyOn(component, 'abrirPlantasModal');
      
      component.accionistasAgregados(existingAccionista);
      
      expect(component.abrirPlantasModal).toHaveBeenCalled();
    });
  });

  describe('accionistasEliminados', () => {
    it('should remove accionistas and update store', () => {
      const accionista1: SociaoAccionistas = { rfc: 'RFC1', nombre: 'Test1' } as any;
      const accionista2: SociaoAccionistas = { rfc: 'RFC2', nombre: 'Test2' } as any;
      const accionista3: SociaoAccionistas = { rfc: 'RFC3', nombre: 'Test3' } as any;
      
      component.sociaoAccionistas = [accionista1, accionista2, accionista3];
      
      component.accionistasEliminados([accionista1, accionista3]);
      
      expect(component.sociaoAccionistas).toEqual([accionista2]);
      expect(mockStore.eliminarTablaDatosComplimentos).toHaveBeenCalledWith([accionista2]);
    });
  });

  describe('accionistasExtranjerosEliminado', () => {
    it('should remove foreign accionistas and update store', () => {
      const accionista1: SociaoAccionistas = { taxId: 'TAX1', nombre: 'Test1' } as any;
      const accionista2: SociaoAccionistas = { taxId: 'TAX2', nombre: 'Test2' } as any;
      const accionista3: SociaoAccionistas = { taxId: 'TAX3', nombre: 'Test3' } as any;
      
      component.sociaoAccionistasExtranjera = [accionista1, accionista2, accionista3];
      
      component.accionistasExtranjerosEliminado([accionista1, accionista3]);
      
      expect(component.sociaoAccionistasExtranjera).toEqual([accionista2]);
      expect(mockStore.eliminarTablaDatosComplimentosExtranjera).toHaveBeenCalledWith([accionista2]);
    });
  });

  describe('notification methods', () => {
    it('should configure notification when abrirPlantasModal is called', () => {
      component.abrirPlantasModal();
      
      expect(component.plantasNotificacion).toEqual({
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Los datos ya existen',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      });
    });

    it('should close notification when closePlantasModal is called', () => {
      component.plantasNotificacion = { cerrar: true } as any;
      
      component.closePlantasModal();
      
      expect(component.plantasNotificacion.cerrar).toBe(false);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyNotifier$ subject', () => {
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Input properties', () => {
    it('should have formularioDeshabilitado input with default value false', () => {
      expect(component.formularioDeshabilitado).toBe(false);
    });

    it('should accept formularioDeshabilitado input changes', () => {
      component.formularioDeshabilitado = true;
      expect(component.formularioDeshabilitado).toBe(true);
    });
  });

  describe('Observable subscriptions', () => {
    it('should update sociaoAccionistas when tablaDatosComplimentos$ emits', () => {
      const mockData: SociaoAccionistas[] = [
        { rfc: 'RFC1', nombre: 'Test1' } as any,
        { rfc: 'RFC2', nombre: 'Test2' } as any
      ];
      
      mockQuery.selectTablaDatosComplimentos$ = of(mockData);
      
      const newComponent = new AggregarComplimentosComponent(mockStore as any, mockQuery as any);
      
      expect(newComponent.sociaoAccionistas).toEqual(mockData);
    });

    it('should update sociaoAccionistasExtranjera when tablaDatosComplimentosExtranjera$ emits', () => {
      const mockData: SociaoAccionistas[] = [
        { taxId: 'TAX1', nombre: 'Test1' } as any,
        { taxId: 'TAX2', nombre: 'Test2' } as any
      ];
      
      mockQuery.selectTablaDatosComplimentosExtranjera$ = of(mockData);
      
      const newComponent = new AggregarComplimentosComponent(mockStore as any, mockQuery as any);
      
      expect(newComponent.sociaoAccionistasExtranjera).toEqual(mockData);
    });
  });
});