// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf,Subject, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { RegistroPageComponent } from './registro-page.component';
import { AmpliacionServiciosQuery } from '../../estados/tramite90302.query';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';

@Injectable()
class MockAmpliacionServiciosQuery {
  FormaValida$ = observableOf({});
}

@Injectable()
class MockAmpliacionServiciosService {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('RegistroPageComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule],
      declarations: [
        RegistroPageComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AmpliacionServiciosQuery, useClass: MockAmpliacionServiciosQuery },
        SeccionLibStore,
        { provide: AmpliacionServiciosService, useClass: MockAmpliacionServiciosService }
      ]
    }).overrideComponent(RegistroPageComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(RegistroPageComponent);
    component = fixture.debugElement.componentInstance;
    component.destroyNotifier$= new Subject<void>();
  });

  afterEach(() => {
    fixture.destroy(); 
    TestBed.resetTestingModule(); 
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #getValorIndice()', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      valor: {},
      accion: {}
    });
    
  });

  

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    
  });

});