// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { TramiteCofeprisStore } from '../../../../estados/tramite.store';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideToastr, ToastrService } from 'ngx-toastr';

@Injectable()
class MockRouter {
  navigate() {};
}

@Injectable()
class MockTramiteCofeprisStore {}

describe('PasoTresComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule ],
    
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
        ServiciosPantallaService,
        { provide: TramiteCofeprisStore, useClass: MockTramiteCofeprisStore },
         provideToastr({
                  positionClass: 'toast-top-right',
                }),
                ToastrService
      ]
    }).overrideComponent(PasoTresComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #obtieneFirma()', async () => {
    component.serviciosExtraordinariosServices = component.serviciosExtraordinariosServices || {};
    component.serviciosExtraordinariosServices.obtenerTramite = jest.fn().mockReturnValue(observableOf({}));
    component.TramiteCofeprisStore = component.TramiteCofeprisStore || {};
    component.TramiteCofeprisStore.establecerTramite = jest.fn();
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.obtieneFirma({});
    expect(component.serviciosExtraordinariosServices.obtenerTramite).toHaveBeenCalled();
 
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyed$.next).toHaveBeenCalled();
  });

});