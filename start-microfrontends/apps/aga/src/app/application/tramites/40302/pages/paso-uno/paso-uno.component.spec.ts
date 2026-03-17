import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { DatosDelTramiteService } from '../../services/datos-del-tramite.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DatosComponent', () => {
    let componente: PasoUnoComponent;
    let fixture: ComponentFixture<PasoUnoComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [PasoUnoComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
        imports: [
          require('@angular/common/http/testing').HttpClientTestingModule
        ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(PasoUnoComponent);
      componente = fixture.componentInstance;
      fixture.detectChanges();
    });
  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería tener el índice inicial en 1', () => {
    expect(componente.indice).toBe(1);
  });

  it('debería actualizar el índice al llamar seleccionaTab', () => {
    const NUEVO_INDICE = 3;
    componente.seleccionaTab(NUEVO_INDICE);
    expect(componente.indice).toBe(NUEVO_INDICE);
  });
});
describe('PasoUnoComponent - Cobertura Completa', () => {
  let componente: PasoUnoComponent;
  let fixture: any;
  let mockDatosDelTramiteService: any;
  let mockConsultaQuery: any;
  let destroyNotifier$: Subject<void>;

  beforeEach(async () => {
    mockDatosDelTramiteService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ foo: 'bar' })),
      actualizarEstadoFormulario: jest.fn()
    };
    mockConsultaQuery = {
      selectConsultaioState$: of({ update: true })
    };
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DatosDelTramiteService, useValue: mockDatosDelTramiteService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ],
      imports: [
        require('@angular/common/http/testing').HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    componente = fixture.componentInstance;
    destroyNotifier$ = (componente as any).destroyNotifier$;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería tener el índice inicial en 1', () => {
    expect(componente.indice).toBe(1);
  });

  it('debería actualizar el índice al llamar seleccionaTab', () => {
    componente.seleccionaTab(5);
    expect(componente.indice).toBe(5);
  });

  it('debería suscribirse a selectConsultaioState$ y llamar guardarDatosFormulario si update es true', () => {
    const guardarSpy = jest.spyOn(componente as any, 'guardarDatosFormulario');
    componente.consultaState = { update: false } as any;
    componente.ngOnInit();
    expect(componente.consultaState.update).toBe(true);
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('debería poner esDatosRespuesta en true si update es false', () => {
    mockConsultaQuery.selectConsultaioState$ = of({ update: false });
    fixture = TestBed.createComponent(PasoUnoComponent);
    componente = fixture.componentInstance;
    componente.ngOnInit();
    expect(componente.esDatosRespuesta).toBe(true);
  });

  it('guardarDatosFormulario debería llamar actualizarEstadoFormulario si resp existe', () => {
    const spy = jest.spyOn(mockDatosDelTramiteService, 'actualizarEstadoFormulario');
    (componente as any).guardarDatosFormulario();
    expect(componente.esDatosRespuesta).toBe(true);
    expect(spy).toHaveBeenCalledWith({ foo: 'bar' });
  });

  

  it('ngOnDestroy debería llamar next y complete en destroyNotifier$', () => {
    const nextSpy = jest.spyOn(destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(destroyNotifier$, 'complete');
    componente.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería limpiar recursos correctamente al destruir el componente', () => {
    const nextSpy = jest.spyOn((componente as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((componente as any).destroyNotifier$, 'complete');
    componente.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('debería asignar consultaState correctamente desde el observable', () => {
    componente.ngOnInit();
    expect(componente.consultaState).toBeDefined();
    expect(typeof componente.consultaState.update).toBe('boolean');
  });
});
