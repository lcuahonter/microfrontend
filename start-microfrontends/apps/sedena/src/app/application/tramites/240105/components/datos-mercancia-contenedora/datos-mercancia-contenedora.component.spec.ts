import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosMercanciaContenedoraComponent } from './datos-mercancia-contenedora.component';
import { Tramite240105Store } from '../../estados/tramite240105Store.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { of } from 'rxjs';

@Injectable()
class MockTramite240105Store {}

describe('DatosMercanciaContenedoraComponent', () => {
  let component: DatosMercanciaContenedoraComponent;
  let fixture: ComponentFixture<DatosMercanciaContenedoraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DatosMercanciaContenedoraComponent, HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240105Store, useClass: MockTramite240105Store },
           {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // Mock params as an observable
            queryParams: of({}), // Mock queryParams if needed
            data: of({}), // Mock data as an observable
          },
        },
        {
          provide: DatosSolicitudService,
          useValue: {
            obtenerFraccionesCatalogo: jest.fn().mockReturnValue(of([])), // Mock the method to return an observable
            obtenerUMCCatalogo: jest.fn().mockReturnValue(of([])), // Mock the method to return an observable
            obtenerMonedaCatalogo: jest.fn().mockReturnValue(of([])), // Mock the method to return an observable
          },
        },
      ]
    }).overrideComponent(DatosMercanciaContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosMercanciaContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });
});