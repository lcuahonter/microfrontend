// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SubProductosContenedoraComponent } from './sub-productos-contenedora.component';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { FitosanitarioQuery } from '../../queries/fitosanitario.query';
import { FitosanitarioStore } from '../../estados/fitosanitario.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockAgriculturaApiService {
  obtenerProductoRespuestaPorUrl = function() {
    return observableOf({});
  };
}

@Injectable()
class MockFitosanitarioQuery {}

@Injectable()
class MockFitosanitarioStore {}

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

describe('SubProductosContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, SubProductosContenedoraComponent, HttpClientTestingModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AgriculturaApiService, useClass: MockAgriculturaApiService },
        { provide: FitosanitarioQuery, useClass: MockFitosanitarioQuery },
        { provide: FitosanitarioStore, useClass: MockFitosanitarioStore }
      ]
    }).overrideComponent(SubProductosContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SubProductosContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #agregarDatosFormulario()', async () => {
    component.fitosanitarioStore = component.fitosanitarioStore || {};
    component.fitosanitarioStore.update = jest.fn().mockReturnValue([
      {
        "tablaDatos": {}
      }
    ]);
    component.agregarDatosFormulario({
      formulario: {
        tipoRequisito: {},
        requisito: {},
        fraccionArancelaria: {},
        descripcionFraccion: {},
        nico: {},
        descripcionNico: {},
        descripcion: {},
        cantidadUMT: {},
        umc: {},
        cantidadUMC: {},
        uso: {},
        paisDeProcedencia: {}
      }
    });
    expect(component.fitosanitarioStore.update).toHaveBeenCalled();
  });

});