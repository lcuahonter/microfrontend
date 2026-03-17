// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideToastr } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { ToastrModuled } from 'ngx-toastr';
import { Component } from '@angular/core';
import { MercanciasModalComponent } from './mercancias-modal.component';
import { FormBuilder } from '@angular/forms';
import { Tramite110204Store } from '../../estados/tramite110204.store';
import { Tramite110204Query } from '../../estados/tramite110204.query';
import { CertificadosOrigenGridService } from '../../services/certificadosOrigenGrid.service';
import { ToastrService } from 'ngx-toastr';
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite110204Query {
  formMercancia$ = observableOf({});
  selectFactura$ = {};
  selectUmc$ = {};
}

@Injectable()
class MockTramite110204Store {}

describe('MercanciasModalComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
  TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ToastrService,
                provideToastr({
                  positionClass: 'toast-top-right',
                }),
        FormBuilder,
        CertificadosOrigenGridService,
        { provide: Tramite110204Store, useClass: MockTramite110204Store },
        { provide: Tramite110204Query, useClass: MockTramite110204Query },
        SeccionLibQuery,
        SeccionLibStore
      ]
    }).overrideComponent(MercanciasModalComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(MercanciasModalComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      valueChanges: observableOf({})
    });
    component.parchearValoresDelFormulario = jest.fn();
    component.store = component.store || {};
    component.store.setFormMercancia = jest.fn();
    component.ngOnInit();
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.parchearValoresDelFormulario).toHaveBeenCalled();
    expect(component.store.setFormMercancia).toHaveBeenCalled();
  });

  it('should run #parchearValoresDelFormulario()', async () => {
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.patchValue = jest.fn();
  });

  it('should run #tipoFacturasSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setFactura = jest.fn();
    component.tipoFacturasSeleccion({});
    expect(component.store.setFactura).toHaveBeenCalled();
  });

  it('should run #tipoUmcSeleccion()', async () => {
    component.store = component.store || {};
    component.store.setUmc = jest.fn();
    component.tipoUmcSeleccion({});
    expect(component.store.setUmc).toHaveBeenCalled();
  });

  it('should run #activarModal()', async () => {
    component.guardarClicado = component.guardarClicado || {};
    component.guardarClicado.emit = jest.fn();
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.value = 'value';
    component.mercanciaForm.markAllAsTouched = jest.fn();
    component.activarModal();
    expect(component.mercanciaForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should run #cerrarModal()', async () => {
    component.cerrarClicado = component.cerrarClicado || {};
    component.cerrarClicado.emit = jest.fn();
    component.cerrarModal();
    expect(component.cerrarClicado.emit).toHaveBeenCalled();
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