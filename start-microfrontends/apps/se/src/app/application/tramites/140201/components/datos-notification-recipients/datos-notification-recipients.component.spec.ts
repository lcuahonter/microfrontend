import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosNotificationRecipientsComponent } from './datos-notification-recipients.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CancelacionesService } from '../../services/cancelaciones.service';
import { CancelacionesStore } from '../../estados/cancelaciones.store';
import { CancelacionesQuery } from '../../estados/cancelaciones.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DatosNotificationRecipientsComponent', () => {
  let component: DatosNotificationRecipientsComponent;
  let fixture: ComponentFixture<DatosNotificationRecipientsComponent>;
  let cancelacionServiceMock: any;
  let cancelacionesStoreMock: any;
  let cancelacionesQueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    cancelacionServiceMock = {
      getInfo: jest.fn().mockReturnValue(of({ apellidoMaterno: 'Rodríguez' })),
      getEntidades: jest.fn().mockReturnValue(of([])),
      getColonia: jest.fn().mockReturnValue(of([])),
      getmunicipio: jest.fn().mockReturnValue(of([])),     
      getLocalidad: jest.fn().mockReturnValue(of([])),      
      getCancelacionDeAutorizaciones: jest.fn().mockReturnValue(of([])), 
    };
    cancelacionesStoreMock = {
      setNombre: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setCorreoElectronico: jest.fn()
    };
    cancelacionesQueryMock = {
      nombre$: of('Juan'),
      apellidoPaterno$: of('Pérez'),
      correoElectronico$: of('juan@mail.com')
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosNotificationRecipientsComponent],
      providers: [
        FormBuilder,
        { provide: CancelacionesService, useValue: cancelacionServiceMock },
        { provide: CancelacionesStore, useValue: cancelacionesStoreMock },
        { provide: CancelacionesQuery, useValue: cancelacionesQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosNotificationRecipientsComponent);
    component = fixture.componentInstance;
    component.entidadFederativa$ = of([]);
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario en ngOnInit', () => {
    expect(component.formularioDeNotificacionesForm).toBeDefined();
    expect(component.formularioDeNotificacionesForm.get('nombre')).toBeDefined();
    expect(component.formularioDeNotificacionesForm.get('apellidoPaterno')).toBeDefined();
    expect(component.formularioDeNotificacionesForm.get('apellidoMaterno')).toBeDefined();
    expect(component.formularioDeNotificacionesForm.get('correoElectronico')).toBeDefined();
  });

  it('debe actualizar apellidoMaterno desde el servicio en infoDeCarga', () => {
    component.formularioDeNotificacionesForm.patchValue({ apellidoMaterno: '' });
    component.infoDeCarga();
    expect(cancelacionServiceMock.getInfo).toHaveBeenCalled();
    expect(component.formularioDeNotificacionesForm.get('apellidoMaterno')?.value).toBe('Rodríguez');
  });

  it('debe actualizar nombre, apellidoPaterno y correoElectronico desde los observables en estadoActualizacion', () => {
    component.formularioDeNotificacionesForm.patchValue({
      nombre: '',
      apellidoPaterno: '',
      correoElectronico: ''
    });
    component.estadoActualizacion();
    expect(component.formularioDeNotificacionesForm.get('nombre')?.value).toBe('Juan');
    expect(component.formularioDeNotificacionesForm.get('apellidoPaterno')?.value).toBe('Pérez');
    expect(component.formularioDeNotificacionesForm.get('correoElectronico')?.value).toBe('juan@mail.com');
  });

  it('debe llamar setNombre en updateNombre', () => {
    component.formularioDeNotificacionesForm.get('nombre')?.setValue('NuevoNombre');
    component.updateNombre();
    expect(cancelacionesStoreMock.setNombre).toHaveBeenCalledWith('NuevoNombre');
  });

  it('debe llamar setApellidoPaterno en updateApellidoPaterno', () => {
    component.formularioDeNotificacionesForm.get('apellidoPaterno')?.setValue('NuevoApellido');
    component.updateApellidoPaterno();
    expect(cancelacionesStoreMock.setApellidoPaterno).toHaveBeenCalledWith('NuevoApellido');
  });

  it('debe llamar setCorreoElectronico en updateCorreoElectronico', () => {
    component.formularioDeNotificacionesForm.get('correoElectronico')?.setValue('nuevo@mail.com');
    component.updateCorreoElectronico();
    expect(cancelacionesStoreMock.setCorreoElectronico).toHaveBeenCalledWith('nuevo@mail.com');
  });

  it('debe deshabilitar el formulario si esFormularioSoloLectura es true en guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.formularioDeNotificacionesForm.disabled).toBe(true);
  });

  it('debe habilitar el formulario si esFormularioSoloLectura es false en guardarDatosFormulario', () => {
    component.entidadFederativa$ = of([]);
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.formularioDeNotificacionesForm.enabled).toBe(true);
  });

  it('debe limpiar las suscripciones en ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});