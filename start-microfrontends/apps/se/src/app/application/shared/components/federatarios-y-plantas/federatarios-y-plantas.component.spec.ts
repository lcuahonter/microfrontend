// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Pipe,
  PipeTransform,
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Directive,
  Input,
  Output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { FederatariosYPlantasComponent } from './federatarios-y-plantas.component';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
class MockRouter {
  navigate() {}
}

describe('FederatariosYPlantasComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { url: 'url', params: {}, queryParams: {}, data: {} },
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({}),
          },
        },
      ],
    })
      .overrideComponent(FederatariosYPlantasComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(FederatariosYPlantasComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #initFederatariosFormGroup()', async () => {
    component.initFederatariosFormGroup();
  });

  it('should run #irAAcciones()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.irAAcciones({});
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #aggregarDatos()', async () => {
    component.datosFormaFedratario = component.datosFormaFedratario || {};
    component.datosFormaFedratario.emit = jest.fn();
    component.federatariosFormGroup = component.federatariosFormGroup || {};
    component.federatariosFormGroup.value = 'value';
    component.aggregarDatos();
    expect(component.datosFormaFedratario.emit).toHaveBeenCalled();
  });
});
