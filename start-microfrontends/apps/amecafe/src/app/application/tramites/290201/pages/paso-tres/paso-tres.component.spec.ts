
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Directive, Injectable, Input, NO_ERRORS_SCHEMA, Output, Pipe, PipeTransform } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoTresComponent } from './paso-tres.component';
import { Router } from '@angular/router';
import { InjectionToken } from '@angular/core';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
@Injectable()
class MockRouter {
  navigate() {};
}
const MOCK_TOAST_CONFIG = new InjectionToken('ToastConfig');


describe('PasoTresComponent', () => {
  let fixture: ComponentFixture<PasoTresComponent>;
  let component: { ngOnDestroy: () => void; router: { navigate?: any; }; obtieneFirma: (arg0: {}) => void; };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,PasoTresComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        provideHttpClient(),
        { provide: Router, useClass: MockRouter },
        { provide: MOCK_TOAST_CONFIG, useValue: {},ToastrService },
        provideToastr({
          positionClass: 'toast-top-right',
        }), 
      ],
    }).overrideComponent(PasoTresComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    if (component.ngOnDestroy) {
      component.ngOnDestroy(); 
    }
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #obtieneFirma()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.obtieneFirma({});
    expect(component.router.navigate).toHaveBeenCalled();
  });

});