import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { Tramite110217Store } from '../../../../estados/tramites/tramite110217.store';
import { Tramite110217Query } from '../../../../estados/queries/tramite110217.query';
import { CertificadosOrigenService } from '../../services/certificado-origen.service.ts';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

const mockStore = {
  setPestanaActiva: jest.fn(),
  setObservaciones: jest.fn(),
  setIdioma: jest.fn(),
  setEntidadFederativa: jest.fn(),
  setRepresentacionFederal: jest.fn(),
  setGrupoReceptor: jest.fn(),
  setGrupoDeDirecciones: jest.fn(),
  setGrupoRepresentativo: jest.fn(),
  setGrupoDeTransporte: jest.fn(),
  setTercerOperador: jest.fn(),
  setGrupoOperador: jest.fn(),
  setGrupoTratado: jest.fn(),
  setGrupoDeDomicilio: jest.fn(),
  setMercanciaTablaDatos: jest.fn(),
  setMercanciaDisponsiblesTablaDatos: jest.fn(),
  setDatosConfidencialesProductor: jest.fn(),
  setProductorMismoExportador: jest.fn(),
  setProductoresExportador: jest.fn(),
};

const mockTramiteQuery = {
  selectSolicitud$: of({ pestanaActiva: 2 }),
  getValue: jest.fn().mockReturnValue({
    formValidity: {
      certificadoOrigen: true,
      datosCertificado: true,
      datosDestinatario: true,
      domicilioDestinatario: true,
      datosRepresentante: true,
      detallesTransporte: true,
      histProductores: true
    }
  }),
};

const mockConsultaioQuery = {
  selectConsultaioState$: of({ update: true })
};

const mockCertificadosOrigenService = {
  getDatosConsulta: jest.fn().mockReturnValue(
    of({
      success: true,
      datos: {
        observaciones: 'obs',
        idioma: 'es',
        entidadFederativa: 'CDMX',
        representacionFederal: 'RepFed',
        grupoReceptor: 'G1',
        grupoDeDirecciones: 'Dir1',
        grupoRepresentativo: 'Rep',
        grupoDeTransporte: 'Transport',
        tercerOperador: 'Op',
        grupoOperador: 'Operador',
        grupoTratado: 'Tratado',
        grupoDeDomicilio: 'Domicilio',
        mercanciaSeleccionadasTablaDatos: [],
        mercanciaDisponsiblesTablaDatos: [],
        datosConfidencialesProductor: true,
        productorMismoExportador: false,
        productoresExportador: [],
      },
    })
  ),
};

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        PasoUnoComponent
      ],
      providers: [
        provideHttpClient(),
        { provide: 'ToastConfig', useValue: {} },
        { provide: Tramite110217Store, useValue: mockStore },
        { provide: Tramite110217Query, useValue: mockTramiteQuery },
        { provide: CertificadosOrigenService, useValue: mockCertificadosOrigenService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default indice value', () => {
    expect(component.indice).toBeDefined();
  });

  it('should set the active tab to 1 when seleccionaTab(1) is called', () => {
    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });

  it('should set the active tab to 2 when seleccionaTab(2) is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should set the active tab to 3 when seleccionaTab(3) is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should set the active tab to 4 when seleccionaTab(4) is called', () => {
    component.seleccionaTab(4);
    expect(component.indice).toBe(4);
  });

  it('should set the active tab to 5 when seleccionaTab(5) is called', () => {
    component.seleccionaTab(5);
    expect(component.indice).toBe(5);
  });

  it('should have seleccionaTab method', () => {
    expect(typeof component.seleccionaTab).toBe('function');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  describe('validarTodosLosFormularios', () => {
    it('should return true when all forms are valid', () => {
      component.certificadoOrigenComp = { validarFormulario: jest.fn().mockReturnValue(true) } as any;
      component.datosCertificadoComp = { isChildFormValid: jest.fn().mockReturnValue(true) } as any;
      component.destinatarioComp = { validateAllForms: jest.fn().mockReturnValue(true) } as any;
      component.historicoProductoresComp = { validarFormulario: jest.fn().mockReturnValue(true) } as any;
      expect(component.validarTodosLosFormularios()).toBe(true);
    });

    it('should call child validation methods when forms are invalid', () => {
      const mockInvalidQuery = {
        getValue: jest.fn().mockReturnValue({
          formValidity: {
            certificadoOrigen: false,
            datosCertificado: false,
            datosDestinatario: false,
            domicilioDestinatario: false,
            datosRepresentante: false,
            detallesTransporte: false,
            histProductores: false,
          },
        }),
      };
      component.tramiteQuery = mockInvalidQuery as any;
      component.certificadoOrigenComp = { validarFormulario: jest.fn() } as any;
      component.datosCertificadoComp = { isChildFormValid: jest.fn() } as any;
      component.destinatarioComp = { validateAllForms: jest.fn() } as any;
      component.historicoProductoresComp = { validarFormulario: jest.fn() } as any;
      const result = component.validarTodosLosFormularios();
      expect(component.certificadoOrigenComp.validarFormulario).toHaveBeenCalled();
      expect(component.datosCertificadoComp.isChildFormValid).toHaveBeenCalled();
      expect(component.destinatarioComp.validateAllForms).toHaveBeenCalled();
      expect(component.historicoProductoresComp.validarFormulario).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  it('should call fetchGetDatosConsulta and update store when success response received', fakeAsync(() => {
    const spyObservaciones = jest.spyOn(mockStore, 'setObservaciones');
    component.fetchGetDatosConsulta();
    tick();
    expect(mockCertificadosOrigenService.getDatosConsulta).toHaveBeenCalled();
    expect(spyObservaciones).toHaveBeenCalledWith('obs');
    expect(mockStore.setIdioma).toHaveBeenCalledWith('es');
    expect(mockStore.setEntidadFederativa).toHaveBeenCalledWith('CDMX');
  }));

  it('should emit cambioDePestana event when seleccionaTab() is called', () => {
    const spyEmit = jest.spyOn(component.cambioDePestana, 'emit');
    component.seleccionaTab(3);
    expect(spyEmit).toHaveBeenCalled();
  });

  it('should set indice correctly on seleccionaTab()', () => {
    component.ngOnInit();
    component.seleccionaTab(5);
    expect(component.indice).toBe(5);
    expect(mockStore.setPestanaActiva).toHaveBeenCalledWith(5);
  });

  it('should return false when only one of the forms is valid', () => {
    const partialValidQuery = {
      getValue: jest.fn().mockReturnValue({
        formValidity: {
          certificadoOrigen: true,
          datosCertificado: false,
          datosDestinatario: false,
          domicilioDestinatario: false,
          datosRepresentante: false,
          detallesTransporte: false,
          histProductores: true,
        },
      }),
    };

    component.tramiteQuery = partialValidQuery as any;
    const result = component.validarTodosLosFormularios();
    expect(result).toBe(false);
  });
});