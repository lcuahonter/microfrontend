import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosGeneralesSociosComponent } from './datos-generales-socios.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Tramite120602Store } from '../../estados/tramite-120602.store';
import { Tramite120602Query } from '../../estados/tramite-120602.query';
import { DatosEmpresaService } from '../../services/datos-empresa.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosGeneralesSociosComponent', () => {
  let component: DatosGeneralesSociosComponent;
  let fixture: ComponentFixture<DatosGeneralesSociosComponent>;
  let storeMock: any;
  let queryMock: any;

  beforeEach(async () => {
    storeMock = {
      setNacionalidad: jest.fn(),
      setPersona: jest.fn(),
      setCadenaDependencia: jest.fn(),
    };

    queryMock = {
      selectNacionalidad$: of('MX'),
      selectPersona$: of('FISICA'),
      selectCadenaDependencia$: of('cadena'),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, DatosGeneralesSociosComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: Tramite120602Store, useValue: storeMock },
        { provide: Tramite120602Query, useValue: queryMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosGeneralesSociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

it('should initialize FormSolicitud with default or observable values', () => {
  expect(component.FormSolicitud).toBeDefined();
  expect(component.FormSolicitud.get('datosGeneralesSocios.nacionalidad')?.value).toBe('MX'); // Updated to match observable value
  expect(component.FormSolicitud.get('datosGeneralesSocios.persona')?.value).toBe('FISICA'); // Updated to match observable value
  expect(component.FormSolicitud.get('datosGeneralesSocios.cadenaDependencia')?.value).toBe('cadena'); // Updated to match observable value
});

  it('should update values from observables', () => {
    component.ngOnInit(); // Ensure subscriptions are triggered
    expect(component.FormSolicitud.get('datosGeneralesSocios.nacionalidad')?.value).toBe('MX');
    expect(component.FormSolicitud.get('datosGeneralesSocios.persona')?.value).toBe('FISICA');
    expect(component.FormSolicitud.get('datosGeneralesSocios.cadenaDependencia')?.value).toBe('cadena');
  });

  it('should call store.setNacionalidad on enCambioNacionalidad', () => {
    component.FormSolicitud.get('datosGeneralesSocios.nacionalidad')?.setValue('MX');
    component.enCambioNacionalidad('MX');
    expect(storeMock.setNacionalidad).toHaveBeenCalledWith('MX');
  });

  it('should call store.setPersona on enCambioPersona', () => {
    component.FormSolicitud.get('datosGeneralesSocios.persona')?.setValue('FISICA');
    component.enCambioPersona('FISICA');
    expect(storeMock.setPersona).toHaveBeenCalledWith('FISICA');
  });

  it('should call store.setCadenaDependencia on enCambioCadenaDependencia', () => {
    component.FormSolicitud.get('datosGeneralesSocios.cadenaDependencia')?.setValue('cadena');
    component.enCambioCadenaDependencia();
    expect(storeMock.setCadenaDependencia).toHaveBeenCalledWith('cadena');
  });

  it('should disable fields when esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.FormSolicitud.get('datosGeneralesSocios.nacionalidad')?.disabled).toBe(true);
    expect(component.FormSolicitud.get('datosGeneralesSocios.persona')?.disabled).toBe(true);
    expect(component.FormSolicitud.get('datosGeneralesSocios.cadenaDependencia')?.disabled).toBe(true);
  });

  it('should enable fields when esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.FormSolicitud.get('datosGeneralesSocios.nacionalidad')?.enabled).toBe(true);
    expect(component.FormSolicitud.get('datosGeneralesSocios.persona')?.enabled).toBe(true);
    expect(component.FormSolicitud.get('datosGeneralesSocios.cadenaDependencia')?.enabled).toBe(true);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});