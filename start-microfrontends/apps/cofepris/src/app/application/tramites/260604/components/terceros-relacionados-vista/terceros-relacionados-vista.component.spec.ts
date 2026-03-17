// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, of, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TercerosRelacionadosVistaComponent } from './terceros-relacionados-vista.component';
import { TercerosRelacionadosFebService } from '../../../../shared/services/shared2606/tereceros-relacionados-feb.service';
import { Tramite260604Store } from '../../estados/tramite260604Store.store';
import { Tramite260604Query } from '../../estados/tramite260604Query.query';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

@Injectable()
class MockTercerosRelacionadosFebService {
    obtenerFacturadores(idProcedimiento: number): Observable<any> {
        return observableOf({});
    }
}

@Injectable()
class MockTramite260604Store {
    updateFacturadorTablaDatos(data: any): void {} 
        return;
    }


@Injectable()
class MockTramite260604Query {
    getFacturadorTablaDatos$(): Observable<any> {
        return observableOf({});
    }
}


describe('TercerosRelacionadosVistaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,HttpClientTestingModule,TercerosRelacionadosVistaComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: TercerosRelacionadosFebService, useClass: MockTercerosRelacionadosFebService },
        { provide: Tramite260604Store, useClass: MockTramite260604Store },
        { provide: Tramite260604Query, useClass: MockTramite260604Query },
         {
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: '123' }),
          queryParams: of({}),
          snapshot: { paramMap: { get: () => '123' } },
        },
      },
      ]
    }).overrideComponent(TercerosRelacionadosVistaComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TercerosRelacionadosVistaComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getFacturadorTablaDatos$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #facturadorEventoModificar()', async () => {

    component.facturadorEventoModificar({});

  });

  it('should run #validarContenedor()', async () => {
    component.TercerosRelacionadosComponent = component.TercerosRelacionadosComponent || {};
    component.TercerosRelacionadosComponent.formularioSolicitudValidacion = jest.fn();
    component.validarContenedor();
    expect(component.TercerosRelacionadosComponent.formularioSolicitudValidacion).toHaveBeenCalled();
  });

  it('should run #addFacturadores()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateFacturadorTablaDatos = jest.fn();
    component.addFacturadores({});
    expect(component.tramiteStore.updateFacturadorTablaDatos).toHaveBeenCalled();
  });


  it('should emit and complete destroy$ on ngOnDestroy', () => {
    const destroy$ = (component as any).destroy$;
    const nextSpy = jest.spyOn(destroy$, 'next').mockImplementation(() => {});
    const completeSpy = jest.spyOn(destroy$, 'complete').mockImplementation(() => {});
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

});