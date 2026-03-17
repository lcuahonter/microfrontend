import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { DatosComplimentariaComponent } from './datos-complimentaria.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';


describe('DatosComplimentariaComponent', () => {
  // ...existing code...
  it('debe manejar error en obtenerComplimentaria si datos no es válido', () => {
    mockService.obtenerSocioAccionista80308 = jest.fn().mockReturnValue(observableOf({ datos: null }));
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(false);
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.buscarIdSolicitud = [1];
    c.obtenerComplimentaria();
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it('debe manejar obtenerComplimentaria con datos vacíos', () => {
    mockService.obtenerSocioAccionista80308 = jest.fn().mockReturnValue(observableOf({ datos: [] }));
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(false);
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.buscarIdSolicitud = [1];
    c.obtenerComplimentaria();
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it('debe llamar setDatosSocios si los datos de complimentaria son válidos y esValidArray true', () => {
    mockService.obtenerSocioAccionista80308 = jest.fn().mockReturnValue(observableOf({ datos: [{ a: 1 }] }));
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'doDeepCopy').mockImplementation((d) => d);
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.buscarIdSolicitud = [1];
    c.obtenerComplimentaria();
    expect(mockStore.setDatosSocios).toHaveBeenCalled();
  });

  it('debe ejecutar obtenerFederetarios con datos válidos', () => {
    mockService.obtenerBuscarNotarios = jest.fn().mockReturnValue(observableOf({ datos: [{ b: 2 }] }));
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.buscarIdSolicitud = [1];
    c.obtenerFederetarios();
    // No error expected
    expect(mockService.obtenerBuscarNotarios).toHaveBeenCalled();
  });

  it('debe ejecutar obtenerOperacions con datos válidos', () => {
    mockService.obtenerOperacions = jest.fn().mockReturnValue(observableOf({ datos: [{ c: 3 }] }));
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
  // ...existing code...
  // Remove all duplicate test cases and ensure all tests are inside the describe block, after beforeEach, and before the closing bracket.
  // Fix ngOnDestroy test: do not assign undefined, use a valid Subject mock.
    c.buscarIdSolicitud = [1];
    c.obtenerOperacions();
    // No error expected
    expect(mockService.obtenerOperacions).toHaveBeenCalled();
  });

  it('debería ejecutar ngOnDestroy con destroyNotifier$ mock', () => {
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.destroyNotifier$ = { next: jest.fn(), unsubscribe: jest.fn() } as any;
    expect(() => c.ngOnDestroy()).not.toThrow();
    expect(c.destroyNotifier$.next).toHaveBeenCalled();
    expect(c.destroyNotifier$.unsubscribe).toHaveBeenCalled();
  });

  it('debe manejar obtenerComplimentaria cuando esValidObject es false', () => {
    mockService.obtenerSocioAccionista80308 = jest.fn().mockReturnValue(observableOf({ datos: [{ a: 1 }] }));
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(false);
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.buscarIdSolicitud = [1];
    c.obtenerComplimentaria();
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it('debe manejar obtenerComplimentaria cuando esValidArray es false', () => {
    mockService.obtenerSocioAccionista80308 = jest.fn().mockReturnValue(observableOf({ datos: [{ a: 1 }] }));
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(false);
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.buscarIdSolicitud = [1];
    c.obtenerComplimentaria();
    expect(mockToastr.error).toHaveBeenCalled();
  });
  let fixture;
  let component!: DatosComplimentariaComponent;

  let mockService: any;
  let mockToastr: any;
  let mockSolicitanteQuery: any;
  let mockStore: any;
  let mockTramiteStore: any;
  beforeEach(() => {
    mockService = {
      obtenerSocioAccionista80308: jest.fn().mockReturnValue(observableOf({})),
      obtenerBuscarNotarios: jest.fn().mockReturnValue(observableOf({})),
      obtenerOperacions: jest.fn().mockReturnValue(observableOf({})),
      obtenerBuscaSolicitudId: jest.fn().mockReturnValue(observableOf({ datos: { buscaIdSolicitud: '1' } })),
      obtenerDatosCertificacionSat: jest.fn().mockReturnValue(observableOf({ datos: { certificacionSAT: {} } })),
    };
    mockToastr = { error: jest.fn() };
    mockSolicitanteQuery = { selectSeccionState$: observableOf({}) };
    mockStore = { setDatosSocios: jest.fn(), setDatosOperaciones: jest.fn() };
    mockTramiteStore = { setCertificacionSAT: jest.fn() };
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, ToastrModule, HttpClientTestingModule ],
      declarations: [ ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        provideToastr({ positionClass: 'toast-top-right' }),
      ]
    }).overrideComponent(DatosComplimentariaComponent, {}).compileComponents();
    fixture = TestBed.createComponent(DatosComplimentariaComponent);
    component = fixture.debugElement.componentInstance;
    component.modificionService = mockService;
    component.toastr = mockToastr;
    component.solicitanteQuery = mockSolicitanteQuery;
    component.tramiteStore = mockTramiteStore;
    component.buscarIdSolicitud = [1];
  });

    it('debe manejar error en obtenerComplimentaria', () => {
      mockService.obtenerSocioAccionista80308 = jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (_s: any, e: any) => e() }) });
      const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
      c.buscarIdSolicitud = [1];
      c.obtenerComplimentaria();
      expect(mockToastr.error).toHaveBeenCalled();
    });

    it('debe llamar setDatosSocios si los datos de complimentaria son válidos', () => {
  mockService.obtenerSocioAccionista80308 = jest.fn().mockReturnValue(observableOf({ datos: [{ a: 1 }] }));
  jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
  jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(true);
  jest.spyOn(require('@libs/shared/data-access-user/src'), 'doDeepCopy').mockImplementation((d) => d);
  const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
  c.buscarIdSolicitud = [1];
  c.obtenerComplimentaria();
  expect(mockStore.setDatosSocios).toHaveBeenCalled();
    });

    it('debe manejar error en obtenerFederetarios', () => {
      mockService.obtenerBuscarNotarios = jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (_s: any, e: any) => e() }) });
      const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
      c.buscarIdSolicitud = [1];
      c.obtenerFederetarios();
      expect(mockToastr.error).toHaveBeenCalled();
    });

    it('debe manejar error en obtenerOperacions', () => {
      mockService.obtenerOperacions = jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (_s: any, e: any) => e() }) });
      const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
      c.buscarIdSolicitud = [1];
      c.obtenerOperacions();
      expect(mockToastr.error).toHaveBeenCalled();
    });

    it('debería limpiar subscriptions en ngOnDestroy', () => {
  component.destroyNotifier$ = { next: jest.fn(), unsubscribe: jest.fn() } as any;
  component.ngOnDestroy();
  expect(component.destroyNotifier$.next).toHaveBeenCalled();
  expect(component.destroyNotifier$.unsubscribe).toHaveBeenCalled();
    });

  it('debería ejecutar #constructor()', () => {
  const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
  expect(c).toBeTruthy();
  });
  it('debe ejecutar #obtenerComplimentaria()', () => {
  component.modificionService.obtenerSocioAccionista80308 = jest.fn();
  component.obtenerComplimentaria();
  expect(component.modificionService.obtenerSocioAccionista80308).toHaveBeenCalled();
  });

  it('debe ejecutar #obtenerFederetarios()', () => {
  component.modificionService.obtenerBuscarNotarios = jest.fn();
  component.obtenerFederetarios();
  expect(component.modificionService.obtenerBuscarNotarios).toHaveBeenCalled();
  });

  it('debería ejecutar #obtenerOperacions()', () => {
  component.modificionService.obtenerOperacions = jest.fn();
  component.obtenerOperacions();
  expect(component.modificionService.obtenerOperacions).toHaveBeenCalled();
  });

  it('debe manejar error en obtenerComplimentaria si datos no es válido', () => {
    mockService.obtenerSocioAccionista80308 = jest.fn().mockReturnValue(observableOf({ datos: null }));
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(false);
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.buscarIdSolicitud = [1];
    c.obtenerComplimentaria();
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it('debe manejar obtenerComplimentaria con datos vacíos', () => {
    mockService.obtenerSocioAccionista80308 = jest.fn().mockReturnValue(observableOf({ datos: [] }));
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(false);
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.buscarIdSolicitud = [1];
    c.obtenerComplimentaria();
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it('debe llamar setDatosSocios si los datos de complimentaria son válidos y esValidArray true', () => {
    mockService.obtenerSocioAccionista80308 = jest.fn().mockReturnValue(observableOf({ datos: [{ a: 1 }] }));
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'doDeepCopy').mockImplementation((d) => d);
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.buscarIdSolicitud = [1];
    c.obtenerComplimentaria();
    expect(mockStore.setDatosSocios).toHaveBeenCalled();
  });

  it('debe ejecutar obtenerFederetarios con datos válidos', () => {
    mockService.obtenerBuscarNotarios = jest.fn().mockReturnValue(observableOf({ datos: [{ b: 2 }] }));
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.buscarIdSolicitud = [1];
    c.obtenerFederetarios();
    // No error expected
    expect(mockService.obtenerBuscarNotarios).toHaveBeenCalled();
  });

  it('debe ejecutar obtenerOperacions con datos válidos', () => {
    mockService.obtenerOperacions = jest.fn().mockReturnValue(observableOf({ datos: [{ c: 3 }] }));
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.buscarIdSolicitud = [1];
    c.obtenerOperacions();
    // No error expected
    expect(mockService.obtenerOperacions).toHaveBeenCalled();
  });

  it('debería ejecutar ngOnDestroy con destroyNotifier$ mock', () => {
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.destroyNotifier$ = { next: jest.fn(), unsubscribe: jest.fn() } as any;
    expect(() => c.ngOnDestroy()).not.toThrow();
    expect(c.destroyNotifier$.next).toHaveBeenCalled();
    expect(c.destroyNotifier$.unsubscribe).toHaveBeenCalled();
  });

  it('debe manejar obtenerComplimentaria cuando esValidObject es false', () => {
    mockService.obtenerSocioAccionista80308 = jest.fn().mockReturnValue(observableOf({ datos: [{ a: 1 }] }));
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(false);
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.buscarIdSolicitud = [1];
    c.obtenerComplimentaria();
    expect(mockToastr.error).toHaveBeenCalled();
  });

  it('debe manejar obtenerComplimentaria cuando esValidArray es false', () => {
    mockService.obtenerSocioAccionista80308 = jest.fn().mockReturnValue(observableOf({ datos: [{ a: 1 }] }));
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidObject').mockReturnValue(true);
    jest.spyOn(require('@libs/shared/data-access-user/src'), 'esValidArray').mockReturnValue(false);
    const c = new DatosComplimentariaComponent(mockService, mockToastr, mockSolicitanteQuery, mockTramiteStore);
    c.buscarIdSolicitud = [1];
    c.obtenerComplimentaria();
    expect(mockToastr.error).toHaveBeenCalled();
  });
});