import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { ImportacionExportacionPetroleoComponent } from './importacion-exportacion-petroleo.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { PermisoPetroleoService } from '../../services/permiso-petroleo.service';
import { Tramite130302Store } from '../../estados/tramite130302.store';
import { Tramite130302Query } from '../../estados/queries/tramite130302.query';
import { FormBuilder } from '@angular/forms';

// Mocks for dependencies
const mockService = {
  getSolicitante: jest.fn().mockReturnValue(of({
    saldoDisponible: 100,
    prorrogaDel: '2024-01-01',
    prorrogaAl: '2024-12-31'
  })),
  obtenerTabla: jest.fn().mockReturnValue(of([]))
};

const mockTramite130302Store = {
  setDynamicFieldValue: jest.fn(),
  setprorrogaAl: jest.fn(),
  setprorrogaDel: jest.fn()
};

const mockTramite130302Query = {
  selectExportarIlustraciones$: of({
    motivoJustificacion: 'Justificación',
    otrasDeclaraciones: 'Declaraciones'
  })
};

const mockConsultaioQuery = {
  selectConsultaioState$: of({ readonly: false })
};

function createComponent(overrides: any = {}) {
  return new ImportacionExportacionPetroleoComponent(
    new FormBuilder(),
    overrides.service || mockService,
    overrides.tramite130302Store || mockTramite130302Store,
    overrides.tramite130302Query || mockTramite130302Query,
    overrides.consultaioQuery || mockConsultaioQuery
  );
}

describe('ImportacionExportacionPetroleoComponent', () => {
  let component: ImportacionExportacionPetroleoComponent;
  let fixture: ComponentFixture<ImportacionExportacionPetroleoComponent>;
  let permisoPetroleoServiceMock: any;
  let tramite130302StoreMock: any;
  let tramite130302QueryMock: any;
 tramite130302StoreMock = {
      setprorrogaAl: jest.fn(),
      setprorrogaDel: jest.fn(),
      setfechaPago: jest.fn(),
      setDynamicFieldValue: jest.fn(),
    };
  beforeEach(async () => {
    permisoPetroleoServiceMock = {
      obtenerTabla: jest.fn().mockReturnValue(of([{ fetchaSolicitud: '2023-01-01', fetchaInicial: '2023-01-02', fetchaFinal: '2023-01-03' }])),
      getSolicitante: jest.fn().mockReturnValue(of({ saldoDisponible: 100, prorrogaDel: '2023-01-01', prorrogaAl: '2023-12-31' })),
    };

    tramite130302StoreMock = {
      setprorrogaAl: jest.fn(),
      setDynamicFieldValue: jest.fn(),
    };

    tramite130302QueryMock = {
      selectExportarIlustraciones$: of({
        motivoJustificacion: 'Test Justification',
        otrasDeclaraciones: 'Test Declarations',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ImportacionExportacionPetroleoComponent],
      providers: [
        { provide: PermisoPetroleoService, useValue: permisoPetroleoServiceMock },
        { provide: Tramite130302Store, useValue: tramite130302StoreMock },
        { provide: Tramite130302Query, useValue: tramite130302QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportacionExportacionPetroleoComponent);
    component = fixture.componentInstance;

   component.form = new FormGroup({
      saldoDisponible: new FormControl(''),
      prorrogaDel: new FormControl(''),
      prorrogaAl: new FormControl(''),
      fechaPago: new FormControl(''),
      motivoJustificacion: new FormControl(''),
    });

    fixture.detectChanges();
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

 test('should initialize the form and load data on ngOnInit', () => {
  // Arrange: component is already created and form is set up in beforeEach
  component.ngOnInit();

  // saldoDisponible is set by loadAsignacionData, which uses the mock service
  expect(component.form.get('saldoDisponible')?.value).toBe(100);

  // motivoJustificacion is set by configurarGrupoForm, which uses the mock query
  expect(component.form.get('motivoJustificacion')?.value).toBe('Test Justification');

  // tercerosProd is set by loadMercancias, which uses the mock service
  expect(component.tercerosProd.length).toBe(1);
  expect(component.tercerosProd[0].fetchaSolicitud).toBe('2023-01-01');
});
 

  test('should load mercancias data on loadMercancias', () => {
    component.loadMercancias();
    expect(component.tercerosProd.length).toBe(1);
    expect(component.tercerosProd[0].fetchaSolicitud).toBe('2023-01-01');
  });

  test('should call setDynamicFieldValue on establecerCambioDeValor', () => {
    const event = { campo: 'testField', valor: 'testValue' };
    component.establecerCambioDeValor(event);
    expect(tramite130302StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('testField', 'testValue');
  });

  test('should set values in the store on setValoresStore', () => {
    const form = new FormGroup({
      testField: new FormControl('testValue'),
    });
    const metodoNombre = 'setprorrogaAl';
    component.setValoresStore(form, 'testField', metodoNombre as keyof Tramite130302Store);
    expect(tramite130302StoreMock[metodoNombre]).toHaveBeenCalledWith('testValue');
  });

  test('should clean up subscriptions on ngOnDestroy', () => {
  const comp = createComponent();
  const destroySpy = jest.spyOn(comp['destroyed$'], 'next');
  const completeSpy = jest.spyOn(comp['destroyed$'], 'complete');
  comp.ngOnDestroy();
  expect(destroySpy).toHaveBeenCalled();
  expect(completeSpy).toHaveBeenCalled();
});

 test('should handle empty data gracefully in loadMercancias', () => {
  permisoPetroleoServiceMock.obtenerTabla.mockReturnValue(of([]));
  component.loadMercancias();
  expect(component.tercerosProd.length).toBe(0);
});

test('should handle empty data gracefully in loadAsignacionData', () => {
  permisoPetroleoServiceMock.getSolicitante.mockReturnValue(of({}));
  component.loadAsignacionData();
  expect(component.form.get('prorrogaAl')?.value).toBeNull();
});



  it('should initialize form and call load methods on ngOnInit', () => {
    const comp = createComponent();
    const configSpy = jest.spyOn(comp, 'configurarGrupoForm');
    const loadMercanciasSpy = jest.spyOn(comp, 'loadMercancias');
    const loadAsignacionDataSpy = jest.spyOn(comp, 'loadAsignacionData');
    comp.ngOnInit();
    expect(configSpy).toHaveBeenCalled();
    expect(loadMercanciasSpy).toHaveBeenCalled();
    expect(loadAsignacionDataSpy).toHaveBeenCalled();
  });

  it('should configure form and enable/disable based on readonly', () => {
    const comp = createComponent();
    comp.esFormularioSoloLectura = false;
    comp.configurarGrupoForm();
    expect(comp.form.enabled).toBe(true);

    comp.esFormularioSoloLectura = true;
    comp.configurarGrupoForm();
    expect(comp.form.disabled).toBe(true);
  });

 
  it('should set tercerosProd in loadMercancias', () => {
    const comp = createComponent();
    const productos = [{ id: 1 }, { id: 2 }];
    mockService.obtenerTabla.mockReturnValueOnce(of(productos));
    comp.loadMercancias();
    expect(comp.tercerosProd).toBe(productos);
  });

  it('should call setDynamicFieldValue in establecerCambioDeValor', () => {
    const comp = createComponent();
    comp.establecerCambioDeValor({ campo: 'foo', valor: 'bar' });
    expect(mockTramite130302Store.setDynamicFieldValue).toHaveBeenCalledWith('foo', 'bar');
  });

  

  it('should call tramite130302Store method in setValoresStore', () => {
    const comp = createComponent();
    const form = new FormBuilder().group({ prorrogaAl: ['2022-01-01'] });
    comp.setValoresStore(form, 'prorrogaAl', 'setprorrogaAl');
    expect(mockTramite130302Store.setprorrogaAl).toHaveBeenCalledWith('2022-01-01');
  });

 

it('should patch fechaPago and call setValoresStore in oncambioFechaPago', () => {
  const comp = createComponent();
  comp.form = new FormBuilder().group({ fechaPago: [''] });
  const spy = jest.spyOn(comp, 'setValoresStore');
  comp.oncambioFechaPago('2022-03-03');
  expect(comp.form.get('fechaPago')?.value).toBe('2022-03-03');
  expect(spy).toHaveBeenCalledWith(comp.form, 'prorrogaAl', 'setprorrogaAl');
});

  it('should return ninoFormGroup getter', () => {
    const comp = createComponent();
    const fg = new FormGroup({});
    comp.forma = new FormGroup({ ninoFormGroup: fg });
    expect(comp.ninoFormGroup).toBe(fg);
  });

  it('should clean up destroyed$ on ngOnDestroy', () => {
    const comp = createComponent();
    const nextSpy = jest.spyOn(comp['destroyed$'], 'next');
    const completeSpy = jest.spyOn(comp['destroyed$'], 'complete');
    comp.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

 
});
