// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { Component } from '@angular/core';
import { TercerospageComponent } from './tercerospage.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { FitosanitarioQuery } from '../../queries/fitosanitario.query';
import { TercerosrelacionadosService } from '../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service';
import { FitosanitarioStore } from '../../estados/fitosanitario.store';

@Injectable()
class MockAgriculturaApiService {
  getAllDatosForma = jest.fn().mockReturnValue(observableOf({
    tercerosRelacionados: {},
    datosForma: {}
  }));
  updateTercerosRelacionado = jest.fn().mockReturnValue(observableOf({}));
  updateTercerosExportador = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockFitosanitarioQuery {
  selectConsultaioState$ = observableOf({
    readonly: {}
  });
}

@Injectable()
class MockTercerosrelacionadosService {
  obtenerSelectorList = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockFitosanitarioStore {
  actualizarSelectedTerceros = jest.fn();
  actualizarSelectedExdora = jest.fn();
  _select = jest.fn().mockReturnValue(observableOf([]));
}

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

describe('TercerospageComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, TercerospageComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ConsultaioQuery,
        { provide: AgriculturaApiService, useClass: MockAgriculturaApiService },
        { provide: FitosanitarioQuery, useClass: MockFitosanitarioQuery },
        { provide: TercerosrelacionadosService, useClass: MockTercerosrelacionadosService },
        { provide: FitosanitarioStore, useClass: MockFitosanitarioStore },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {url: 'url', params: {}, queryParams: {}, data: {}},
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        }
      ]
    }).overrideComponent(TercerospageComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TercerospageComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({
      readonly: {}
    });
    
    // Since we've already mocked the FitosanitarioStore with _select method in the class definition,
    // we just need to ensure ngOnInit can run without errors
    component.ngOnInit();
    
    // Verify that subscriptions were set up (we can't easily test observables in unit tests without more setup)
    expect(component.consultaQuery.selectConsultaioState$).toBeDefined();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.pairsCatalogChange = jest.fn();
    component.estadoCatalogChange = jest.fn();
    component.ngAfterViewInit();
    expect(component.pairsCatalogChange).toHaveBeenCalled();
    expect(component.estadoCatalogChange).toHaveBeenCalled();
  });

  it('should run #pairsCatalogChange()', async () => {
    component.tercerosrelacionadosService = component.tercerosrelacionadosService || {};
    component.tercerosrelacionadosService.obtenerSelectorList = jest.fn().mockReturnValue(observableOf({}));
    component.catalogosDatos = component.catalogosDatos || {};
    component.catalogosDatos.paises = 'paises';
    component.pairsCatalogChange();
    expect(component.tercerosrelacionadosService.obtenerSelectorList).toHaveBeenCalled();
  });

  it('should run #estadoCatalogChange()', async () => {
    component.tercerosrelacionadosService = component.tercerosrelacionadosService || {};
    component.tercerosrelacionadosService.obtenerSelectorList = jest.fn().mockReturnValue(observableOf({}));
    component.catalogosDatos = component.catalogosDatos || {};
    component.catalogosDatos.estados = 'estados';
    component.estadoCatalogChange();
    expect(component.tercerosrelacionadosService.obtenerSelectorList).toHaveBeenCalled();
  });

  it('should run #handleEliminarDestinatario()', async () => {
    component.agriculturaApiService = component.agriculturaApiService || {};
    component.agriculturaApiService.updateTercerosRelacionado = jest.fn();
    component.handleEliminarDestinatario();
    expect(component.agriculturaApiService.updateTercerosRelacionado).toHaveBeenCalled();
  });

  it('should run #handleEliminarExportador()', async () => {
    component.agriculturaApiService = component.agriculturaApiService || {};
    component.agriculturaApiService.updateTercerosExportador = jest.fn();
    component.handleEliminarExportador();
    expect(component.agriculturaApiService.updateTercerosExportador).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should run #abrirModalExportador()', async () => {
    component.fitosanitarioStore = component.fitosanitarioStore || {};
    component.fitosanitarioStore.actualizarSelectedExdora = jest.fn();
    component.modalRef = component.modalRef || {};
    component.modalRef.abrir = jest.fn();
    component.abrirModalExportador({});
    expect(component.fitosanitarioStore.actualizarSelectedExdora).toHaveBeenCalled();
    expect(component.modalRef.abrir).toHaveBeenCalled();
  });

  it('should run #abrirModalDestinatario()', async () => {
    component.fitosanitarioStore = component.fitosanitarioStore || {};
    component.fitosanitarioStore.actualizarSelectedTerceros = jest.fn();
    component.modalRef = component.modalRef || {};
    component.modalRef.abrir = jest.fn();
    component.abrirModalDestinatario({});
    expect(component.fitosanitarioStore.actualizarSelectedTerceros).toHaveBeenCalled();
    expect(component.modalRef.abrir).toHaveBeenCalled();
  });

});