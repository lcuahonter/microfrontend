import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { DatosModificacionesComponent } from './datos-modificaciones.component';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

describe('DatosModificacionesComponent', () => {
  let fixture;
  let component !: DatosModificacionesComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,HttpClientTestingModule ],
      declarations: [ ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ToastrModule ],
      providers: [
        FormBuilder,
         provideToastr({
                  positionClass: 'toast-top-right',
                }),
      ]
    }).overrideComponent(DatosModificacionesComponent, {
    }).compileComponents();
    fixture = TestBed.createComponent(DatosModificacionesComponent);
    component = fixture.debugElement.componentInstance;
    component.modificionService = component.modificionService || {};
    component.modificionService.obtenerDatosGenerales = jest.fn().mockReturnValue(observableOf({}));
  });


  it('debería ejecutar #constructor()', () => {
    expect(component).toBeTruthy();
  });

  it('debe ejecutar #cargarDatos()', () => {
    component.modificionService = component.modificionService || {};
    component.modificionService.obtenerDatosGenerales = jest.fn().mockReturnValue(observableOf({}));
    component.cargarDatos();
    expect(component.modificionService.obtenerDatosGenerales).toHaveBeenCalled();
  });

});