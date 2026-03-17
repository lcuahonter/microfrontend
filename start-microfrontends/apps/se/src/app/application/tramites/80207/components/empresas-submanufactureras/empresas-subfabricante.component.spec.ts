// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { EmpresasSubFabricanteComponent } from './empresas-subfabricante.component';
import { FormBuilder } from '@angular/forms';
import { SubfabricanteService } from '../../servicios/servicios-subfabricante.service';
import { Tramites80207Queries } from '../../estados/tramite80207.query';
import { Tramites80207Store } from '../../estados/tramite80207.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockSubfabricanteService {}


@Injectable()
class MockTramites80207Queries {}

@Injectable()
class MockTramites80207Store {}

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

describe('EmpresasSubFabricanteComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,EmpresasSubFabricanteComponent,HttpClientTestingModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: SubfabricanteService, useClass: MockSubfabricanteService },
        { provide: Tramites80207Queries, useClass: MockTramites80207Queries },
        { provide: Tramites80207Store, useClass: MockTramites80207Store }
      ]
    }).overrideComponent(EmpresasSubFabricanteComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(EmpresasSubFabricanteComponent);
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
    component.obtenerDatosDeRegistro = jest.fn();
    component.obtenerDatosDelAlmacen = jest.fn();
    component.obtenerListaEstado = jest.fn();
    component.ngOnInit();
    expect(component.obtenerDatosDeRegistro).toHaveBeenCalled();
    expect(component.obtenerDatosDelAlmacen).toHaveBeenCalled();
    expect(component.obtenerListaEstado).toHaveBeenCalled();
  });


});