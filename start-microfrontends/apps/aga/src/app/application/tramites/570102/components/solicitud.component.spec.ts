import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Tramite570102Store } from '../state/Tramite570102.store';
import { Tramite570102Query } from '../state/Tramite570102.query';
import { SolicitudService } from '../service/solicitud.service';
import { ValidacionesFormularioService, ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { of, ReplaySubject } from 'rxjs';

class MockQuery {
  selectSolicitud$ = of({ folio: 'FOLIO', motivoDelDes: 'motivo' });
}
class MockConsultaioQuery {
  selectConsultaioState$ = of({ readonly: false });
}
class MockValidacionesService {
  isValid = jest.fn().mockReturnValue(true);
}

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let mockStore: any;
  let mockValidacionesService: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockStore = {
      setFolio: jest.fn(),
      setMotivoDelDes: jest.fn(),
    };
    mockValidacionesService = new MockValidacionesService();
    mockConsultaioQuery = new MockConsultaioQuery();

    await TestBed.configureTestingModule({
      providers: [
        { provide: Tramite570102Query, useClass: MockQuery },
        { provide: Tramite570102Store, useValue: mockStore },
        { provide: SolicitudService, useValue: {} },
        { provide: ValidacionesFormularioService, useValue: mockValidacionesService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        FormBuilder
      ],
      imports: [ReactiveFormsModule,SolicitudComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    component.solicitudState = { folio: 'FOLIO', motivoDelDes: 'motivo' };
    component.consultaDatos = { procedureId: '',
      parameter: '',
      department: '',
      folioTramite: '',
      tipoDeTramite: '',
      estadoDeTramite:'',
      readonly: true,
      create:true,
      update: true,
      consultaioSolicitante: null,
      action_id: '',
      current_user: '',
      id_solicitud: '',
      nombre_pagina: '',
    };
    component.solicitudForm = new FormBuilder().group({
      folio: ['FOLIO', Validators.required],
      motivoDelDes: ['motivo', Validators.required],
    });
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should update store on setValoresStore call', () => {
    const form = component.solicitudForm;
    form.get('motivoDelDes')?.setValue('Testing motivo');
    component.setValoresStore(form, 'motivoDelDes', 'setMotivoDelDes');
    expect(mockStore.setMotivoDelDes).toHaveBeenCalledWith('Testing motivo');
  });

  it('should handle form submit - valid case', () => {
    const spy = jest.spyOn(component, 'validarDestinatarioFormulario');
    component.solicitudForm.get('motivoDelDes')?.setValue('Desist reason');
    component.validarDestinatarioFormulario();
    expect(spy).toHaveBeenCalled();
    expect(component.solicitudForm.valid).toBe(true);
  });

  it('should handle form submit - invalid case', () => {
    const spy = jest.spyOn(component, 'validarDestinatarioFormulario');
    component.solicitudForm.get('motivoDelDes')?.setValue('');
    component.validarDestinatarioFormulario();
    expect(spy).toHaveBeenCalled();
    expect(component.solicitudForm.invalid).toBe(true);
  });

  it('should call validacionesService.isValid in esValido', () => {
    const form = new FormBuilder().group({ campo: [''] });
    expect(component.esValido(form, 'campo')).toBe(true);
    expect(mockValidacionesService.isValid).toHaveBeenCalledWith(form, 'campo');
  });

  it('should set up solicitudForm in donanteDomicilio', () => {
    component.solicitudState = { folio: 'abc', motivoDelDes: 'mot' };
    component.donanteDomicilio();
    expect(component.solicitudForm).toBeTruthy();
    expect(component.solicitudForm.get('folio')?.value).toBe('abc');
    expect(component.solicitudForm.get('motivoDelDes')?.value).toBe('mot');
  });

  it('should call guardarDatosFormulario if soloLectura is true in inicializarEstadoFormulario', () => {
    component.soloLectura = true;
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('should call donanteDomicilio if soloLectura is false in inicializarEstadoFormulario', () => {
    component.soloLectura = false;
    const donanteSpy = jest.spyOn(component, 'donanteDomicilio');
    component.inicializarEstadoFormulario();
    expect(donanteSpy).toHaveBeenCalled();
  });

 
  it('should complete destroyed$ on ngOnDestroy', () => {
    component.destroyed$ = { next: jest.fn(), complete: jest.fn() } as any;
    const nextSpy = jest.spyOn(component.destroyed$, 'next');
    const completeSpy = jest.spyOn(component.destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});