import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite110217Store } from '../../../../estados/tramites/tramite110217.store';
import { Tramite110217Query } from '../../../../estados/queries/tramite110217.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { DestinatariosComponent } from './destinatario.component';

describe('Destinatario110217Component', () => {
  let component: DestinatariosComponent;
  let fixture: ComponentFixture<DestinatariosComponent>;
  let store: Tramite110217Store;
  let query: Tramite110217Query;
  let consultaioQuery: ConsultaioQuery;

  beforeEach(async () => {
    store = { 
      actualizarEstado: jest.fn(),
      setGrupoReceptor: jest.fn(),
      setGrupoDeDirecciones: jest.fn(),
      setGrupoRepresentativo: jest.fn(),
      setGrupoDeTransporte: jest.fn()
    } as any;
    
    query = { 
      selectSolicitud$: of({
        grupoReceptor: {},
        grupoDeDirecciones: {},
        grupoRepresentativo: {},
        grupoDeTransporte: {}
      })
    } as any;
    
    consultaioQuery = { 
      selectConsultaioState$: of({
        procedureId: '',
        parameter: '',
        department: '',
        folioTramite: '',
        tipoDeTramite: '',
        estadoDeTramite: '',
        readonly: false,
        create: false,
        update: false,
        consultaioSolicitante: null,
        action_id: '',
        current_user: '',
        id_solicitud: '',
        nombre_pagina: ''
      })
    } as any;

    await TestBed.configureTestingModule({
      imports: [DestinatariosComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        { provide: Tramite110217Store, useValue: store },
        { provide: Tramite110217Query, useValue: query },
        { provide: ConsultaioQuery, useValue: consultaioQuery },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DestinatariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.formDestinatarioValues).toBeDefined();
    expect(component.destroyNotifier$).toBeInstanceOf(Subject);
    expect(component.soloLectura).toBe(false);
  });

  it('should set soloLectura based on consultaDatos', () => {
    expect(component.soloLectura).toBe(false);
    component.ngOnInit();
    expect(component.soloLectura).toBe(false);
  });

  it('should handle setValoresStoreDatosDestinatario', () => {
    const event = {
      formGroupName: 'test',
      campo: 'test',
      valor: 'testValue',
      storeStateName: 'setGrupoReceptor'
    };
    component.setValoresStoreDatosDestinatario(event);
    expect(store.setGrupoReceptor).toHaveBeenCalledWith('testValue');
  });

  it('should handle setValoresStoreDestinatario', () => {
    const event = {
      formGroupName: 'test',
      campo: 'test',
      valor: 'testValue',
      storeStateName: 'setGrupoDeDirecciones'
    };
    component.setValoresStoreDestinatario(event);
    expect(store.setGrupoDeDirecciones).toHaveBeenCalledWith('testValue');
  });

  it('should handle setValoresStoreRepresentante', () => {
    const event = {
      formGroupName: 'test',
      campo: 'test',
      VALOR: 'testValue',
      METODO_NOMBRE: 'setGrupoRepresentativo'
    };
    component.setValoresStoreRepresentante(event);
    expect(store.setGrupoRepresentativo).toHaveBeenCalledWith('testValue');
  });

  it('should handle setValoresStoreTransporte', () => {
    const event = {
      formGroupName: 'test',
      campo: 'test',
      valor: 'testValue',
      storeStateName: 'setGrupoDeTransporte'
    };
    component.setValoresStoreTransporte(event);
    expect(store.setGrupoDeTransporte).toHaveBeenCalledWith('testValue');
  });

  it('should return false for validateAllForms when child forms are invalid', () => {
    const result = component.validateAllForms();
    expect(result).toBe(false);
  });

  it('should call markAllAsTouched on all child forms when they exist', () => {
    component.datosDelDestinatarioRef = {
      formDatosDelDestinatario: { markAllAsTouched: jest.fn() }
    } as any;
    component.destinatarioRef = {
      formDestinatario: { markAllAsTouched: jest.fn() }
    } as any;
    component.representanteRef = {
      form: { markAllAsTouched: jest.fn() }
    } as any;
    component.transporteRef = {
      formTransporte: { markAllAsTouched: jest.fn() }
    } as any;

    component.markAllFormsAsTouched();

    expect(component.datosDelDestinatarioRef.formDatosDelDestinatario.markAllAsTouched).toHaveBeenCalled();
    expect(component.destinatarioRef.formDestinatario.markAllAsTouched).toHaveBeenCalled();
    expect(component.representanteRef.form.markAllAsTouched).toHaveBeenCalled();
    expect(component.transporteRef.formTransporte.markAllAsTouched).toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});