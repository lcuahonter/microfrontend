// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output, InjectionToken } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';

import { Component } from '@angular/core';
import { PasoDosComponent } from './paso-dos.component';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockRouter {
  navigate() {};
}

describe('PasoDosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, PasoDosComponent, ToastrModule.forRoot(), HttpClientTestingModule ],
      declarations: [
        
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: new InjectionToken('ToastConfig'), useValue: {} }
      ]
    }).overrideComponent(PasoDosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.debugElement.componentInstance;
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