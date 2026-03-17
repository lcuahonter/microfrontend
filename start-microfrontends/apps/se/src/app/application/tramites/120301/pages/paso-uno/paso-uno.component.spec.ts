import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { of, Subject } from 'rxjs';
import { ConsultaioQuery, ConsultaioStore, ConsultaioState } from '@ng-mf/data-access-user';
import { ElegibilidadDeTextilesStore } from '../../estados/elegibilidad-de-textiles.store';
import { ElegibilidadTextilesService } from '../../services/elegibilidad-textiles/elegibilidad-textiles.service';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let consultaQueryMock: Partial<ConsultaioQuery>;
  let consultaStoreMock: Partial<ConsultaioStore>;
  let elegibilidadDeTextilesStoreMock: Partial<ElegibilidadDeTextilesStore>;
  let elegibilidadTextilesServiceMock: Partial<ElegibilidadTextilesService>;

  beforeEach(async () => {
    consultaQueryMock = {
      selectConsultaioState$: of({ update: true, readonly: false } as ConsultaioState)
    };
    consultaStoreMock = {};
    elegibilidadDeTextilesStoreMock = {
      setTextilesState: jest.fn()
    };
    elegibilidadTextilesServiceMock = {
      getPrefillDatos: jest.fn().mockReturnValue(of({})),
      actualizarEstadoFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [],
      declarations: [PasoUnoComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: ConsultaioStore, useValue: consultaStoreMock },
        { provide: ElegibilidadDeTextilesStore, useValue: elegibilidadDeTextilesStoreMock },
        { provide: ElegibilidadTextilesService, useValue: elegibilidadTextilesServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe establecer el índice cuando se llama a seleccionaTab', () => {
      (component as any)['ElegibilidadDeTextilesStore'] = {
        setPestanaActiva: jest.fn()
      } as any;
      component.seleccionaTab(3);
      expect(component.indice).toBe(3);
      expect((component as any)['ElegibilidadDeTextilesStore'].setPestanaActiva).toHaveBeenCalledWith(3);
  });

  it('debe establecer mostrarOtraPestana en true cuando se llama a onMostrarTabs con true', () => {
    component.mostrarOtraPestana = false;
    component.onMostrarTabs(true);
    expect(component.mostrarOtraPestana).toBe(true);
  });

  it('no debe cambiar mostrarOtraPestana cuando se llama a onMostrarTabs con false', () => {
    component.mostrarOtraPestana = false;
    component.onMostrarTabs(false);
    expect(component.mostrarOtraPestana).toBe(false);
  });

  it('debe llamar a guardarDatosFormulario y establecer formularioDeshabilitado en false si consultaState.update es true', () => {
    const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.consultaState = { update: true, readonly: false } as ConsultaioState;
    component.formularioDeshabilitado = true;
    component.ngOnInit();
    expect(component.formularioDeshabilitado).toBe(false);
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('debe establecer formularioDeshabilitado en true si consultaState.readonly es true', () => {
    (consultaQueryMock as any).selectConsultaioState$ = of({ update: false, readonly: true } as ConsultaioState);
    component.formularioDeshabilitado = false;
    component.ngOnInit();
    expect(component.formularioDeshabilitado).toBe(true);
  });

  it('debe llamar a getPrefillDatos cuando se llama a guardarDatosFormulario', () => {
    component.guardarDatosFormulario();
    expect(elegibilidadTextilesServiceMock.getPrefillDatos).toHaveBeenCalled();
  });

  it('debe completar destroyNotifier$ en ngOnDestroy', () => {
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});