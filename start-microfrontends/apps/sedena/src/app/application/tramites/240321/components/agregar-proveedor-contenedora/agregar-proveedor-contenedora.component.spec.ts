// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  Injectable,
  Input,
  NO_ERRORS_SCHEMA,
  Pipe,
  PipeTransform
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { AgregarProveedorContenedoraComponent } from './agregar-proveedor-contenedora.component';
import { Tramite240321Query } from '../../estados/tramite240321Query.query';
import { Tramite240321Store } from '../../estados/tramite240321Store.store';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

@Injectable()
class MockTramite240321Store {}

@Injectable()
class MockTramite240321Query {}

@Injectable()
class datosSolicitudService {}  

describe('AgregarProveedorContenedoraComponent', () => {
  let component;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule,AgregarProveedorContenedoraComponent,HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Tramite240321Store, useClass: MockTramite240321Store },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { url: 'url', params: {}, queryParams: {}, data: {} },
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        },
        { provide: Tramite240321Query, useClass: MockTramite240321Query },
        ConsultaioQuery,DatosSolicitudService
      ]
    })
      .overrideComponent(AgregarProveedorContenedoraComponent, {})
      .compileComponents();

    fixture = TestBed.createComponent(AgregarProveedorContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #updateProveedorTablaDatos()', async () => {
    component.tramite240321Store = component.tramite240321Store || {};
    component.tramite240321Store.updateProveedorTablaDatos = jest.fn();
    component.updateProveedorTablaDatos({});
    expect(component.tramite240321Store.updateProveedorTablaDatos).toHaveBeenCalled();
  });

  it('should run #actualizaExistenteEnProveedorDatos()', async () => {
    component.tramite240321Store = component.tramite240321Store || {};
    component.tramite240321Store.actualizaExistenteEnProveedorDatos = jest.fn();
    component.actualizaExistenteEnProveedorDatos({});
    expect(component.tramite240321Store.actualizaExistenteEnProveedorDatos).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.route = component.route || {};
    component.route.queryParams = observableOf({});
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getProveedorTablaDatos$ = observableOf({});
    component.ngOnInit();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.ngAfterViewInit();
  });

  it('should run #ngOnDestroy()', async () => {
    component.unsubscribe$ = component.unsubscribe$ || {};
    component.unsubscribe$.next = jest.fn();
    component.unsubscribe$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
