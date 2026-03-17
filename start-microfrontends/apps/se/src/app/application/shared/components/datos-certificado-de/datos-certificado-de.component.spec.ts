import { ComponentFixture, TestBed } from '@angular/core/testing';


import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ToastrService, provideToastr } from 'ngx-toastr';
import { DatosCertificadoDeComponent } from './datos-certificado-de.component';

describe('DatosCertificadoDeComponent', () => {
  let component: DatosCertificadoDeComponent;
  let fixture: ComponentFixture<DatosCertificadoDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        FormBuilder,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DatosCertificadoDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #formularioControl', async () => {
    component.formDatosCertificado = component.formDatosCertificado || {};
    component.formDatosCertificado.get = jest.fn();
    const formularioControl = component.formularioControl;
    expect(component.formDatosCertificado.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.formDatosCertificado = component.formDatosCertificado || {};
    component.formDatosCertificadoEvent = component.formDatosCertificadoEvent || {};
    component.formDatosCertificadoEvent.emit = jest.fn();
    component.ngOnInit();
  });

  it('should run #idiomaSeleccion()', async () => {
    component.idiomaSeleccionEvent = component.idiomaSeleccionEvent || {};
    component.idiomaSeleccionEvent.emit = jest.fn();
    component.idiomaSeleccion({id: 1, descripcion: 'someValue'});
    expect(component.idiomaSeleccionEvent.emit).toHaveBeenCalled();
  });

  it('should run #entidadFederativaSeleccion()', async () => {
    component.entidadFederativaSeleccionEvent = component.entidadFederativaSeleccionEvent || {};
    component.entidadFederativaSeleccionEvent.emit = jest.fn();
    component.entidadFederativaSeleccion({id: 1, descripcion: 'someValue'});
    expect(component.entidadFederativaSeleccionEvent.emit).toHaveBeenCalled();
  });

  it('should run #representacionFederalSeleccion()', async () => {
    component.representacionFederalSeleccionEvent = component.representacionFederalSeleccionEvent || {};
    component.representacionFederalSeleccionEvent.emit = jest.fn();
    component.representacionFederalSeleccion({id: 1, descripcion: 'someValue'});
    expect(component.representacionFederalSeleccionEvent.emit).toHaveBeenCalled();
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
