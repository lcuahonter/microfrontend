// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of as observableOf } from 'rxjs';

import { PasoUnoComponent } from './paso-uno.component';
import { Tramite6402Store } from '../../estados/tramite6402.store';
import { Tramite6402Query } from '../../estados/tramite6402.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { AutorizacionImportacionService } from '../../services/autorizacion-importacion.service';

@Injectable()
class MockTramite6402Store {}

@Injectable()
class MockTramite6402Query {}

@Injectable()
class MockAutorizacionImportacionService {
  getDatosConsulta() {
    return observableOf({
      success: true,
      datos: {
        solicitudFormulario: {} // minimal mock, can be filled in test if needed
      }
    });
  }
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PasoUnoComponent, FormsModule, ReactiveFormsModule],
      declarations: [TranslatePipe, PhoneNumberPipe, SafeHtmlPipe, MyCustomDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Tramite6402Store, useClass: MockTramite6402Store },
        { provide: Tramite6402Query, useClass: MockTramite6402Query },
        ConsultaioQuery,
        { provide: AutorizacionImportacionService, useClass: MockAutorizacionImportacionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function () {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    const spy = jest.spyOn(component, 'fetchGetDatosConsulta');

    component.tramiteQuery = { selectSolicitud$: observableOf({ pestanaActiva: 1 }) };
    component.consultaioQuery = { selectConsultaioState$: observableOf({ update: true }) };

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('should run #fetchGetDatosConsulta()', async () => {
    const mockForm = {
      cveAduana: '01',
      cveSeccionAduanal: '02',
      cveRecintoFiscalizado: '03',
      cveTipoDocumento: '04',
      estadoTipoDocumento: 'active',
      aduana: 'Some Aduana',
      patente: '123',
      pedimento: '456',
      folioImportacionTemporal: 'TEMP001',
      folioFormatoOficial: 'OFF123',
      checkProrroga: true,
      folioOficialProrroga: 'PRORROGA1',
      fechaImportacionTemporal: '2023-01-01',
      fechaVencimiento: '2023-12-31',
      descMercancia: 'Some goods',
      marca: 'BrandX',
      modelo: 'ModelY',
      numeroSerie: 'SN789',
      tipo: 'TypeZ',
      cveMedioTrasporte: 'AIR',
      guiaMaster: 'GM001',
      guiaBl: 'GB001',
      numeroBl: 'NB001',
      rfcEmpresaTransportista: 'RFC123456789',
      estadoMedioTransporte: 'Good',
      cartaPorte: 'CP001',
      cvePaisProcedencia: 'MX',
      guiaHouse: 'GH001',
      numeroBuque: 'NBQ123',
      numeroEquipo: 'EQ123',
      fechaCartaPorte: '2023-01-15',
      tipContenedor: 'ContainerX',
      tranporteMarca: 'TransBrand',
      tranporteModelo: 'TransModel',
      tranportePlaca: 'ABC-123',
      observaciones: 'No issues',
      conDestino: true,
      cveTipoDestino: 'DEST001',
      cveTipoDocumentoReemplazada: 'REP001',
      numeroActaDescruccion: 'ACT001',
      cveAduanaDestino: 'ADUDEST',
      cvePatenteDestino: 'PATDEST',
      cvePedimentoDestino: 'PEDDEST',
      folioVucemRetorno: 'VUCEM123',
      folioFormatoOficialDestino: 'OFFDEST123',
      fechaDescruccionDestino: '2024-01-01',
      estadoTipoDocumentoDestino: 'inactive',
      autoridadPresentoAvisoDestruccion: 'AUTH001',
    };

    component.autorizacionImportacionService.getDatosConsulta = jest.fn().mockReturnValue(
      observableOf({
        success: true,
        datos: { solicitudFormulario: mockForm }
      })
    );

    // mock all store methods
    component.store = {};
    Object.keys(mockForm).forEach((key) => {
      const methodName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
      component.store[methodName] = jest.fn();
    });

    component.fetchGetDatosConsulta();

    expect(component.autorizacionImportacionService.getDatosConsulta).toHaveBeenCalled();
    Object.keys(mockForm).forEach((key) => {
      const methodName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
      expect(component.store[methodName]).toHaveBeenCalledWith(mockForm[key]);
    });
  });

  it('should run #seleccionaTab()', async () => {
    component.store = {
      setPestanaActiva: jest.fn()
    };
    component.seleccionaTab({}, {});
    expect(component.store.setPestanaActiva).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = {
      next: jest.fn(),
      complete: jest.fn()
    };
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });
});
