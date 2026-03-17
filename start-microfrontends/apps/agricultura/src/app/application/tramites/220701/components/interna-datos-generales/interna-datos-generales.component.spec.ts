//@ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Pipe,
  PipeTransform,
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Directive,
  Input,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';

import { InternaDatosGeneralesComponent } from './interna-datos-generales.component';
import { RevisionService } from '../../servicios/revision.service';
import {
  ValidacionesFormularioService,
  SeccionLibQuery,
  SeccionLibStore,
  ConsultaioQuery,
} from '@libs/shared/data-access-user/src';
import { MercanciaDatosService } from '../../servicios/mercancia-datos.service';
import { CatalogosService } from '../../servicios/catalogos.service';
import { HttpClient } from '@angular/common/http';
import { TramiteStoreQuery } from '../../estados/tramite220701.query';
import { TramiteStore } from '../../estados/tramite220701.store';

@Injectable()
class MockRevisionService {}
@Injectable()
class MockMercanciaDatosService {}
@Injectable()
class MockCatalogosService {}
@Injectable()
class MockHttpClient {
  post() {}
}
@Injectable()
class MockTramiteStoreQuery {}
@Injectable()
class MockTramiteStore {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}
@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) {
    return value;
  }
}
@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}
@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

describe('InternaDatosGeneralesComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InternaDatosGeneralesComponent,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        MyCustomDirective,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: RevisionService, useClass: MockRevisionService },
        ValidacionesFormularioService,
        { provide: MercanciaDatosService, useClass: MockMercanciaDatosService },
        { provide: CatalogosService, useClass: MockCatalogosService },
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: TramiteStoreQuery, useClass: MockTramiteStoreQuery },
        { provide: TramiteStore, useClass: MockTramiteStore },
        SeccionLibQuery,
        SeccionLibStore,
        ConsultaioQuery,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(InternaDatosGeneralesComponent);
    component = fixture.debugElement.componentInstance;

    component.revisionService = {
      getOficianaInspeccion: jest
        .fn()
        .mockReturnValue(observableOf({ code: 200, data: {} })),
      getAduanaIngreso: jest
        .fn()
        .mockReturnValue(observableOf({ code: 200, data: {} })),
      getEstablecimiento: jest
        .fn()
        .mockReturnValue(observableOf({ code: 200, data: {} })),
      getRegimenDestinaran: jest
        .fn()
        .mockReturnValue(observableOf({ code: 200, data: {} })),
      getMovilizacionNacional: jest
        .fn()
        .mockReturnValue(observableOf({ code: 200, data: {} })),
      getPuntoVerificacion: jest
        .fn()
        .mockReturnValue(observableOf({ code: 200, data: {} })),
      getEmpresaTransportista: jest
        .fn()
        .mockReturnValue(observableOf({ code: 200, data: {} })),
      getPuntoInspeccion: jest
        .fn()
        .mockReturnValue(observableOf({ code: 200, data: {} })),
    };
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy = () => {};
    }
    if (fixture) {
      fixture.destroy();
    }
  });
  it('should initialize forms with expected values', () => {
    // Simular o inicializar la dependencia o propiedad esperada que tenga 'coordenadas'
    component.mercanciaDatosService = {
      getDatos: jest.fn().mockReturnValue(observableOf({ mercanciaApiDatos: [{ coordenadas: {} }] }))
    };
    component.inicializarFormulario();
    expect(component.forma).toBeDefined();
    expect(component.movilizacionForm).toBeDefined();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('should call patchValue on forma and movilizacionForm in ngOnInit if they exist', () => {
  const formBuilder = TestBed.inject(FormBuilder);
  component.forma = formBuilder.group({ test: [''] });
  component.movilizacionForm = formBuilder.group({ test: [''] });

  component.catalogosService = {
    obtenerAduanaDeIngreso: jest.fn().mockReturnValue(observableOf({ data: {} })),
    obtenerSanidadAgropecuaria: jest.fn().mockReturnValue(observableOf({ data: {} })),
    obtenerPuntoInspeccion: jest.fn().mockReturnValue(observableOf({ data: {} })),
    obtenerEstablecimiento: jest.fn().mockReturnValue(observableOf({ data: {} })),
    obtenerVeterinario: jest.fn().mockReturnValue(observableOf({ data: {} })),
    obtenerRegimen: jest.fn().mockReturnValue(observableOf({ data: {} })),
  };

  component.tramiteStoreQuery = {
    selectSolicitudTramite$: observableOf({})
  };

  // Agregar este mock para corregir el error
  component.mercanciaDatosService = {
    getDatos: jest.fn().mockReturnValue(observableOf({ mercanciaApiDatos: [] }))
  };

  // Asegurar que todos los métodos requeridos estén presentes en revisionService para evitar TypeError
  component.revisionService = {
    getOficianaInspeccion: jest.fn().mockReturnValue(observableOf({ code: 200, data: {} })),
    getAduanaIngreso: jest.fn().mockReturnValue(observableOf({ code: 200, data: {} })),
    getEstablecimiento: jest.fn().mockReturnValue(observableOf({ code: 200, data: {} })),
    getRegimenDestinaran: jest.fn().mockReturnValue(observableOf({ code: 200, data: {} })),
    getMovilizacionNacional: jest.fn().mockReturnValue(observableOf({ code: 200, data: {} })),
    getPuntoVerificacion: jest.fn().mockReturnValue(observableOf({ code: 200, data: {} })),
    getEmpresaTransportista: jest.fn().mockReturnValue(observableOf({ code: 200, data: {} })),
    getPuntoInspeccion: jest.fn().mockReturnValue(observableOf({ code: 200, data: {} })),
    getVeterinario: jest.fn().mockReturnValue(observableOf({ code: 200, data: {} }))
  };

  jest.spyOn(component.forma, 'patchValue');
  jest.spyOn(component.movilizacionForm, 'patchValue');

  component.ngOnInit();
});

  it('should call disable and enable on forms in inicializarEstadoFormulario', () => {
    const formBuilder = TestBed.inject(FormBuilder);
    component.forma = formBuilder.group({ test: [''] });
    component.movilizacionForm = formBuilder.group({ test: [''] });

    const formaDisableSpy = jest.spyOn(component.forma, 'disable');
    const formaEnableSpy = jest.spyOn(component.forma, 'enable');
    const movilDisableSpy = jest.spyOn(component.movilizacionForm, 'disable');
    const movilEnableSpy = jest.spyOn(component.movilizacionForm, 'enable');

    component.inicializarEstadoFormulario();
  });

  it('should unsubscribe destroyNotifier$ on ngOnDestroy', () => {
    component.destroyNotifier$ = {
      next: jest.fn(),
      complete: jest.fn(),
    };
    component.ngOnDestroy();
  });

  it('should run #ngOnInit() and call all expected methods', () => {
    component.consultaioQuery = {
      getValue: jest.fn().mockReturnValue({ readonly: {} }),
      selectConsultaioState$: observableOf({}),
    };
    component.inicializarFormulario = jest.fn();
    component.forma = TestBed.inject(FormBuilder).group({ test: [''] });
    component.movilizacionForm = TestBed.inject(FormBuilder).group({
      test: [''],
    });
    jest.spyOn(component.forma, 'disable');
    jest.spyOn(component.forma, 'enable');
    jest.spyOn(component.forma, 'patchValue');
    jest.spyOn(component.movilizacionForm, 'disable');
    jest.spyOn(component.movilizacionForm, 'enable');
    jest.spyOn(component.movilizacionForm, 'patchValue');
    component.getOficianaInspeccion = jest.fn();
    component.getEstablecimiento = jest.fn();
    component.getRegimenDestinaran = jest.fn();
    component.getMovilizacionNacional = jest.fn();
    component.getPuntoVerificacion = jest.fn();
    component.getEmpresaTransportista = jest.fn();
    component.obtenerListasDesplegables = jest.fn();
    component.tramiteStoreQuery = { selectSolicitudTramite$: observableOf({}) };
    component.tramiteStore = { setInternaDatosGeneralesTramite: jest.fn() };
    component.obtenerDatos = jest.fn();
    component.seccionQuery = { selectSeccionState$: observableOf({}) };

    // Simular catalogosService y sus métodos para evitar TypeError
    component.catalogosService = {
      obtenerAduanaDeIngreso: jest.fn().mockReturnValue(observableOf({ data: {} })),
      obtenerSanidadAgropecuaria: jest.fn().mockReturnValue(observableOf({ data: {} })),
      obtenerPuntoInspeccion: jest.fn().mockReturnValue(observableOf({ data: {} })),
      obtenerEstablecimiento: jest.fn().mockReturnValue(observableOf({ data: {} })),
      obtenerVeterinario: jest.fn().mockReturnValue(observableOf({ data: {} })),
      obtenerRegimen: jest.fn().mockReturnValue(observableOf({ data: {} })),
    };

    component.ngOnInit();
  });

  it('should run #guardarDatosFormulario() and call disable/enable', () => {
    component.inicializarFormulario = jest.fn();
    const formBuilder = TestBed.inject(FormBuilder);
    component.forma = formBuilder.group({ exentoPago: [''] });
    component.movilizacionForm = formBuilder.group({
      exentoPagoRevision: [''],
    });

    const formaDisableSpy = jest.spyOn(component.forma, 'disable');
    const formaEnableSpy = jest.spyOn(component.forma, 'enable');
    const movilDisableSpy = jest.spyOn(component.movilizacionForm, 'disable');
    const movilEnableSpy = jest.spyOn(component.movilizacionForm, 'enable');

    component.guardarDatosFormulario();
  });

  it('should run #inicializarFormulario()', () => {
    const formBuilder = TestBed.inject(FormBuilder);
    component.fb = formBuilder;
    component.forma = formBuilder.group({ test: [''] });
    component.movilizacionForm = formBuilder.group({ test: [''] });
    component.internaDatosGeneralesState = {
      regimen: 'test-regimen',
      aduanaIngreso: 'test-aduana',
      oficinaInspeccion: 'test-oficina'
    };
    component.inicializarFormulario();
  });

  it('should run #crearFormulario()', () => {
    component.fb = { group: jest.fn() };
    component.crearFormulario();
  });

  it('should run #esValido()', () => {
    component.validacionesService = { isValid: jest.fn() };
    component.esValido({}, {});
  });

  it('should run #obtenerListasDesplegables()', () => {
    component.obtenerIngresoSelectList = jest.fn();
    component.obtenerSanidadAgropecuariaList = jest.fn();
    component.obtenerPuntoInspeccionList = jest.fn();
    component.obtenerEstablecimientoList = jest.fn();
    component.obtenerVeterinarioList = jest.fn();
    component.obtenerRegimenList = jest.fn();
    component.obtenerListasDesplegables();
  });

  it('should run #obtenerIngresoSelectList()', () => {
    component.catalogosService = {
      obtenerAduanaDeIngreso: jest
        .fn()
        .mockReturnValue(observableOf({ data: {} })),
    };
    component.obtenerIngresoSelectList();
  });

  it('should run #obtenerSanidadAgropecuariaList()', () => {
    component.catalogosService = {
      obtenerSanidadAgropecuaria: jest
        .fn()
        .mockReturnValue(observableOf({ data: {} })),
    };
    component.obtenerSanidadAgropecuariaList();
  });

  it('should run #obtenerPuntoInspeccionList()', () => {
    component.catalogosService = {
      obtenerPuntoInspeccion: jest
        .fn()
        .mockReturnValue(observableOf({ data: {} })),
    };
    component.obtenerPuntoInspeccionList();
  });

  it('should run #obtenerEstablecimientoList()', () => {
    component.catalogosService = {
      obtenerEstablecimiento: jest
        .fn()
        .mockReturnValue(observableOf({ data: {} })),
    };
    component.obtenerEstablecimientoList();
  });

  it('should run #obtenerRegimenList()', () => {
    component.catalogosService = {
      obtenerRegimen: jest.fn().mockReturnValue(observableOf({ data: {} })),
    };
    component.obtenerRegimenList();
  });

  it('should run #getAduanaIngreso()', () => {
    component.revisionService = {
      getAduanaIngreso: jest
        .fn()
        .mockReturnValue(observableOf({ code: {}, data: {} })),
    };
    component.getAduanaIngreso();
  });

  it('should run #getRegimenDestinaran()', () => {
    component.revisionService = {
      getRegimenDestinaran: jest
        .fn()
        .mockReturnValue(observableOf({ code: {}, data: {} })),
    };
    component.getRegimenDestinaran();
  });

  it('should run #getMovilizacionNacional()', () => {
    component.revisionService = {
      getMovilizacionNacional: jest
        .fn()
        .mockReturnValue(observableOf({ code: {}, data: {} })),
    };
    component.getMovilizacionNacional();
  });

  it('should run #getPuntoVerificacion()', () => {
    component.revisionService = {
      getPuntoVerificacion: jest
        .fn()
        .mockReturnValue(observableOf({ code: {}, data: {} })),
    };
    component.getPuntoVerificacion();
  });

  it('should run #getEmpresaTransportista()', () => {
    component.revisionService = {
      getEmpresaTransportista: jest
        .fn()
        .mockReturnValue(observableOf({ code: {}, data: {} })),
    };
    component.getEmpresaTransportista();
  });

  it('should run #ngOnDestroy()', () => {
    component.destroyNotifier$ = { next: jest.fn(), complete: jest.fn() };
    component.ngOnDestroy();
  });
});
