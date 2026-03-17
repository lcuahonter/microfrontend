import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { ModificacionPermisoImportacionMedicamentosService } from '../../services/modificacion-permiso-importacion-medicamentos.service';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261103.query';
import { DatosProcedureStore } from '../../../../estados/tramites/tramites261103.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  let mockService: jest.Mocked<ModificacionPermisoImportacionMedicamentosService>;
  let mockQuery: jest.Mocked<DatosProcedureQuery>;
  let mockStore: jest.Mocked<DatosProcedureStore>;
  let mockConsultaQuery: jest.Mocked<ConsultaioQuery>;

  const mockState = { update: false } as any;

  beforeEach(async () => {
    mockService = {
      obtenerTramitesAsociados: jest.fn().mockReturnValue(of([])),
      getRegistroPasoUnoData: jest.fn().mockReturnValue(of({})),
      actualizarEstadoFormulario: jest.fn(),
      inicializaPagoDeDerechosDatosCatalogos: jest.fn(),
      getRegistrarDatos: jest.fn().mockReturnValue(of({}))
    } as any;

    mockQuery = {
      selectProrroga$: of({}) as any
    } as any;

    mockStore = {} as any;

    mockConsultaQuery = {
      selectConsultaioState$: of(mockState)
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        FormBuilder,
        { provide: ModificacionPermisoImportacionMedicamentosService, useValue: mockService },
        { provide: DatosProcedureQuery, useValue: mockQuery },
        { provide: DatosProcedureStore, useValue: mockStore },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set tramiteAsociados on init', () => {
    expect(component.tramiteAsociados).toEqual([]);
  });

  it('should initialize catalog data on init', () => {
    expect(mockService.inicializaPagoDeDerechosDatosCatalogos).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario if consultaState.update is true', () => {
    mockConsultaQuery.selectConsultaioState$ = of({ update: true }) as any;

    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta = true if consultaState.update is false', () => {
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should update indice on seleccionaTab()', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should update form data on guardarDatosFormulario()', () => {
    component.guardarDatosFormulario();
    expect(mockService.getRegistroPasoUnoData).toHaveBeenCalled();
    expect(mockService.actualizarEstadoFormulario).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should complete notificadorDestruccion$ on destroy', () => {
    const completeSpy = jest.spyOn((component as any).notificadorDestruccion$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});
