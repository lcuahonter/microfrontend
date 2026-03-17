import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder } from '@angular/forms';
import { Solicitud6102Store } from '../../estados/solicitud6102.store';
import { Solicitud6102Query } from '../../estados/solicitud6102.query';
import { JuntaTecnicaRegistroService } from '../../service/junta-tecnica-registro.service';
import { of as observableOf } from 'rxjs';


@Injectable()
class MockSolicitud6102Store {}

@Injectable()
class MockSolicitud6102Query {}

@Injectable()
class MockJuntaTecnicaRegistroService {}

describe('SolicitudComponent', () => {
  let fixture: ComponentFixture<SolicitudComponent>;
  let component: { ngOnDestroy: () => void; query: { seleccionarSolicitud$?: any; }; inicializarFormulario: jest.Mock<any, any, any> | (() => void); cargarContenedoresOpciones: jest.Mock<any, any, any> | (() => void); cargarAduanaOpciones: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; destroyNotifier$: { next?: any; complete?: any; }; fb: { group?: any; }; solicitudState: { contenedores?: any; aduana?: any; observaciones?: any; }; juntaTecnicaRegistroService: { getOptionLista?: any; }; contenedores: { catalogos?: any; }; aduana: { catalogos?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, SolicitudComponent ],
      declarations: [       
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Solicitud6102Store, useClass: MockSolicitud6102Store },
        { provide: Solicitud6102Query, useClass: MockSolicitud6102Query },
        { provide: JuntaTecnicaRegistroService, useClass: MockJuntaTecnicaRegistroService }
      ]
    }).overrideComponent(SolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.query = component.query || {};
    component.query.seleccionarSolicitud$ = observableOf({});
    component.inicializarFormulario = jest.fn();
    component.cargarContenedoresOpciones = jest.fn();
    component.cargarAduanaOpciones = jest.fn();
    component.ngOnInit();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

  it('should run #cargarContenedoresOpciones()', async () => {
    component.juntaTecnicaRegistroService = component.juntaTecnicaRegistroService || {};
    component.juntaTecnicaRegistroService.getOptionLista = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.contenedores = component.contenedores || {};
    component.contenedores.catalogos = 'catalogos';
    component.cargarContenedoresOpciones();
  });

  it('should run #cargarAduanaOpciones()', async () => {
    component.juntaTecnicaRegistroService = component.juntaTecnicaRegistroService || {};
    component.juntaTecnicaRegistroService.getOptionLista = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.aduana = component.aduana || {};
    component.aduana.catalogos = 'catalogos';
    component.cargarAduanaOpciones();
  });

});