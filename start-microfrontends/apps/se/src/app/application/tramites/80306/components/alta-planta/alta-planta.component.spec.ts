import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AltaPlantaComponent } from './alta-planta.component';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of as observableOf } from 'rxjs';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { Tramite80306Store } from '../../../../estados/tramites/tramite80306.store';
import { Tramite80306Query } from '../../../../estados/queries/tramite80306.query';

@Injectable()
class MockModificacionSolicitudeService {}

@Injectable()
class MockTramite80306Store {
  setFormValida = function() {};
}

@Injectable()
class MockTramite80306Query {
  selectEstado$ = observableOf({
    id: {}
  });
  selectBuscarDomicilios$ = {};
  selectAltaPlanta$ = {};
  selectDomicilios$ = {};
}

@Injectable()
class MockToastrService {
  success(message?: string, title?: string): void {}
  error(message?: string, title?: string): void {}
  info(message?: string, title?: string): void {}
  warning(message?: string, title?: string): void {}
}

describe('AltaPlantaComponent', () => {
  let fixture: ComponentFixture<AltaPlantaComponent>;
  let component: { ngOnDestroy: () => void; formulario: { get?: any; }; formularioControl: any; cargarEstados: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; modificionService: { obtenerListaEstado?: any; }; store: { setaltaPlanta?: any; aggregarDomicilios?: any; eliminarDomicilios?: any; setEstado?: any; }; seleccionarDomicilios: (arg0: {}) => void; domiciliosSeleccionados: string[]; aplicarAccion: () => void; eliminarPlantas: () => void; tipoEstadoSeleccion: (arg0: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, AltaPlantaComponent ],
      declarations: [        
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: ImmerModificacionService, useClass: MockModificacionSolicitudeService },
        ToastrService,
        { provide: Tramite80306Store, useClass: MockTramite80306Store },
        { provide: Tramite80306Query, useClass: MockTramite80306Query }
      ]
    }).overrideComponent(AltaPlantaComponent, {

      set: { providers: [{ provide: ImmerModificacionService, useClass: MockModificacionSolicitudeService },
{ provide: ToastrService, useClass: MockToastrService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(AltaPlantaComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #formularioControl', async () => {
    component.formulario = component.formulario || {};
    component.formulario.get = jest.fn();
    const formularioControl = component.formularioControl;
    expect(component.formulario.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.cargarEstados = jest.fn();
    component.ngOnInit();
    expect(component.cargarEstados).toHaveBeenCalled();
  });

  it('should run #cargarEstados()', async () => {
    component.modificionService = component.modificionService || {};
    component.modificionService.obtenerListaEstado = jest.fn().mockReturnValue(observableOf({}));
    component.store = component.store || {};
    component.store.setaltaPlanta = jest.fn();
    component.cargarEstados();
    expect(component.modificionService.obtenerListaEstado).toHaveBeenCalled();
    expect(component.store.setaltaPlanta).toHaveBeenCalled();
  });

  it('should run #seleccionarDomicilios()', async () => {

    component.seleccionarDomicilios({});

  });

  it('should run #aplicarAccion()', async () => {
    component.domiciliosSeleccionados = component.domiciliosSeleccionados || {};
    if (component.domiciliosSeleccionados) {
      component.domiciliosSeleccionados[0] = '0';
    }
    component.store = component.store || {};
    component.store.aggregarDomicilios = jest.fn();
    component.aplicarAccion();
    expect(component.store.aggregarDomicilios).toHaveBeenCalled();
  });

  it('should run #eliminarPlantas()', async () => {
    component.domiciliosSeleccionados = component.domiciliosSeleccionados || {};
    if (component.domiciliosSeleccionados) {
      component.domiciliosSeleccionados[0] = '0';
    }
    component.store = component.store || {};
    component.store.eliminarDomicilios = jest.fn();
    component.eliminarPlantas();
    expect(component.store.eliminarDomicilios).toHaveBeenCalled();
  });

  it('should run #tipoEstadoSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setEstado = jest.fn();
    component.tipoEstadoSeleccion({});
    expect(component.store.setEstado).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});