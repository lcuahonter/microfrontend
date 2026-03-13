
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TramitesAsociadosComponent } from './tramites-asociados.component';
import { CorreccionInternaDeLaCofeprisService } from '../../services/correccion-interna-de-la-cofepris.service';
@Injectable()
class MockCorreccionInternaDeLaCofeprisService {}


describe('TramitesAsociadosComponent', () => {
  let fixture: ComponentFixture<TramitesAsociadosComponent>;
  let component: { ngOnDestroy: () => void; getTramitesAsociados: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; correccionService: { getTramitesAsociados?: any; }; destroyed$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,TramitesAsociadosComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: CorreccionInternaDeLaCofeprisService, useClass: MockCorreccionInternaDeLaCofeprisService }
      ]
    }).overrideComponent(TramitesAsociadosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TramitesAsociadosComponent);
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
    component.getTramitesAsociados = jest.fn();
    component.ngOnInit();
    expect(component.getTramitesAsociados).toHaveBeenCalled();
  });

  it('should run #getTramitesAsociados()', async () => {
    component.correccionService = component.correccionService || {};
    component.correccionService.getTramitesAsociados = jest.fn().mockReturnValue(observableOf({}));
    component.getTramitesAsociados();
    expect(component.correccionService.getTramitesAsociados).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyed$.next).toHaveBeenCalled();
    expect(component.destroyed$.complete).toHaveBeenCalled();
  });

});