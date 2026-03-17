// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ImportacionDeVehiculosUsadosComponent } from './importacion-de-vehiculos-usados.component';
import { ImportacionDeVehiculosService } from '../../services/importacion-de-vehiculos.service';
import { Tramite130111Store } from '../../../../estados/tramites/tramites130111.store';
import { Tramite130111Query } from '../../../../estados/queries/tramite130111.query';
import { ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockImportacionDeVehiculosService {
  getAllState() {
    return observableOf({});
  }
  guardarDatosPost() {
    return observableOf({});
  }
  buildMercancia() {}
  buildProductor() {}
  buildSolicitante() {}
  buildRepresentacionFederal() {}
  buildEntidadesFederativas() {}
}

@Injectable()
class MockTramite130111Store {
  setIdSolicitud() {}
  resetStore() {}
}

@Injectable()
class MockTramite130111Query {
  selectSolicitud$ = observableOf({});
}
  const mockToastr = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  }

describe('ImportacionDeVehiculosUsadosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,HttpClientTestingModule ],
      declarations: [
        ImportacionDeVehiculosUsadosComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ImportacionDeVehiculosService, useClass: MockImportacionDeVehiculosService },
        { provide: Tramite130111Store, useClass: MockTramite130111Store },
        { provide: Tramite130111Query, useClass: MockTramite130111Query },
                { provide: ToastrService, useValue: mockToastr }

      ]
    }).overrideComponent(ImportacionDeVehiculosUsadosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ImportacionDeVehiculosUsadosComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #anterior()', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.atras = jest.fn();
    component.wizardComponent.indiceActual = 'indiceActual';
    component.datosPasos = component.datosPasos || {};
    component.datosPasos.indice = 'indice';
    component.anterior();
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should run #getValorIndice()', async () => {
    component.datosPasos = component.datosPasos || {};
    component.datosPasos.indice = 'indice';
    component.pasoUnoComponent = component.pasoUnoComponent || {};
    component.pasoUnoComponent.solicitudComponent = 'solicitudComponent';
    component.obtenerDatosDelStore = jest.fn();
    component.pasosSolicitar = component.pasosSolicitar || {};
    component.pasoNavegarPor = jest.fn();
    component.getValorIndice({
      accion: {},
      valor: {}
    });
  });

  it('should run #obtenerDatosDelStore()', async () => {
    component.importacionDeVehiculosService = component.importacionDeVehiculosService || {};
    component.importacionDeVehiculosService.getAllState = jest.fn().mockReturnValue(observableOf({}));
    component.guardar = jest.fn();
    component.obtenerDatosDelStore({});
    expect(component.importacionDeVehiculosService.getAllState).toHaveBeenCalled();
    expect(component.guardar).toHaveBeenCalled();
  });

  it('should run #guardar()', async () => {
    component.importacionDeVehiculosService = component.importacionDeVehiculosService || {};
    component.importacionDeVehiculosService.buildMercancia = jest.fn();
    component.importacionDeVehiculosService.buildProductor = jest.fn();
    component.importacionDeVehiculosService.buildSolicitante = jest.fn();
    component.importacionDeVehiculosService.buildRepresentacionFederal = jest.fn();
    component.importacionDeVehiculosService.buildEntidadesFederativas = jest.fn();
    component.importacionDeVehiculosService.guardarDatosPost = jest.fn().mockReturnValue(observableOf({}));
    component.tramite130111Store = component.tramite130111Store || {};
    component.tramite130111Store.setIdSolicitud = jest.fn();
    component.pasoNavegarPor = jest.fn();
    component.guardar({
      mostrarPartidas: {
        0: {
          idSolicitud: {}
        },
        length: {}
      },
      regimen: {},
      clasificacion: {},
      fechasSeleccionadas: {}
    });
    expect(component.importacionDeVehiculosService.buildMercancia).toHaveBeenCalled();
    expect(component.importacionDeVehiculosService.buildProductor).toHaveBeenCalled();
    expect(component.importacionDeVehiculosService.buildSolicitante).toHaveBeenCalled();
    expect(component.importacionDeVehiculosService.buildRepresentacionFederal).toHaveBeenCalled();
    expect(component.importacionDeVehiculosService.buildEntidadesFederativas).toHaveBeenCalled();
    expect(component.importacionDeVehiculosService.guardarDatosPost).toHaveBeenCalled();
  });

 it('should call pasoNavegarPor for valid step navigation', () => {
    const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
    component.indice = 2;
    component.pasosSolicitar = [{ id: 1 }, { id: 2 }, { id: 3 }] as any;
    jest.spyOn(component, 'pasoNavegarPor').mockImplementation();

    component.getValorIndice(accionBoton);

    expect(component.pasoNavegarPor).toHaveBeenCalledWith(accionBoton);
  });

  it('should run #siguiente()', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.indiceActual = 'indiceActual';
    component.datosPasos = component.datosPasos || {};
    component.datosPasos.indice = 'indice';
    component.siguiente();
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should run #onClickCargaArchivos()', async () => {
    component.cargarArchivosEvento = component.cargarArchivosEvento || {};
    component.cargarArchivosEvento.emit = jest.fn();
    component.onClickCargaArchivos();
    expect(component.cargarArchivosEvento.emit).toHaveBeenCalled();
  });

  it('should run #manejaEventoCargaDocumentos()', async () => {

    component.manejaEventoCargaDocumentos({});

  });

  it('should run #cargaRealizada()', async () => {

    component.cargaRealizada({});

  });

  it('should run #onCargaEnProgreso()', async () => {

    component.onCargaEnProgreso({});

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.tramite130111Store = component.tramite130111Store || {};
    component.tramite130111Store.resetStore = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyed$.next).toHaveBeenCalled();
    expect(component.destroyed$.complete).toHaveBeenCalled();
    expect(component.tramite130111Store.resetStore).toHaveBeenCalled();
  });

  describe('obtenerDatosDelStore', () => {
    it('should call importacionDeVehiculosService.getAllState and guardar with the returned data', () => {
      const mockData = { test: 'value' };
      component.importacionDeVehiculosService = {
        getAllState: jest.fn().mockReturnValue(observableOf(mockData))
      } as any;
      component.guardar = jest.fn();

      component.obtenerDatosDelStore();

      expect(component.importacionDeVehiculosService.getAllState).toHaveBeenCalled();
      expect(component.guardar).toHaveBeenCalledWith(mockData);
    });

    it('should handle observable completion', (done) => {
      const mockData = { test: 'value' };
      component.importacionDeVehiculosService = {
        getAllState: jest.fn().mockReturnValue(observableOf(mockData))
      } as any;
      component.guardar = jest.fn(() => { done(); });

      component.obtenerDatosDelStore();
    });

    describe('pasoNavegarPor', () => {
      beforeEach(() => {
        component.wizardComponent = {
          siguiente: jest.fn(),
          atras: jest.fn()
        };
        component.datosPasos = { indice: 0 };
        component.folioTemporal = 123;
      });

      it('should set indice and datosPasos.indice to e.valor', () => {
        const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
        component.pasoNavegarPor(accionBoton);
        expect(component.indice).toBe(2);
        expect(component.datosPasos.indice).toBe(2);
      });

      it('should call wizardComponent.siguiente and set alertaNotificacion for accion "cont" and valid valor', () => {
        const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
        component.pasoNavegarPor(accionBoton);
        expect(component.wizardComponent.siguiente).toHaveBeenCalled();
        expect(component.alertaNotificacion).toBeDefined();
        expect(component.alertaNotificacion.tipoNotificacion).toBe('banner');
        expect(component.alertaNotificacion.categoria).toBe('success');
      });

      it('should call wizardComponent.atras for accion not "cont" and valid valor', () => {
        const accionBoton: AccionBoton = { valor: 2, accion: 'ant' };
        component.pasoNavegarPor(accionBoton);
        expect(component.wizardComponent.atras).toHaveBeenCalled();
      });

      it('should not call wizardComponent.siguiente or atras for valor out of range', () => {
        const accionBoton: AccionBoton = { valor: 0, accion: 'cont' };
        component.pasoNavegarPor(accionBoton);
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();

        const accionBoton2: AccionBoton = { valor: 5, accion: 'cont' };
        component.pasoNavegarPor(accionBoton2);
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();
      });

      it('should set alertaNotificacion only for accion "cont" and valor in range', () => {
        const accionBoton: AccionBoton = { valor: 2, accion: 'cont' };
        component.pasoNavegarPor(accionBoton);
        expect(component.alertaNotificacion).toBeDefined();

        const accionBoton2: AccionBoton = { valor: 2, accion: 'ant' };
        component.pasoNavegarPor(accionBoton2);
        expect(component.alertaNotificacion).toBeDefined();
      });
    });
  });

});