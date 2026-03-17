import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { ProgramaACancelarService } from '../../services/programACancelar.service';
import { ConsultaioQuery, ConsultaioStore } from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  selector: 'solicitante',
  template: '<div>Mock Solicitante</div>'
})
class MockSolicitanteComponent {}

@Component({
  selector: 'app-programa-a-cancelar',
  template: '<div>Mock ProgramaACancelar</div>'
})
class MockProgramaACancelarComponent {
  radioId: number | null = 1;
  isFormValido = jest.fn().mockReturnValue(true);
}

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let consultaQueryMock: any;
  let consultaStoreMock: any;
  let programaServiceMock: any;

  beforeEach(async () => {
    consultaQueryMock = {
      selectConsultaioState$: of({
        readonly: true,
        update: false
      })
    };
    consultaStoreMock = {};
    programaServiceMock = {
      getProgramaDatos: jest.fn().mockReturnValue(of({ testData: 'test' })),
      setDatosFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [
        DatosComponent,
        MockSolicitanteComponent,
        MockProgramaACancelarComponent
      ],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: ConsultaioStore, useValue: consultaStoreMock },
        { provide: ProgramaACancelarService, useValue: programaServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe establecer consultaState, esFormularioSoloLectura y esDatosRespuesta en ngOnInit cuando update es false', () => {
    component.ngOnInit();
    expect(component.consultaState).toBeDefined();
    expect(component.esFormularioSoloLectura).toBe(true);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe llamar a programaService.getProgramaDatos y setDatosFormulario en guardarDatosFormulario', () => {
    const resp = { test: 'valor' };
    programaServiceMock.getProgramaDatos.mockReturnValue(of(resp));
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(programaServiceMock.getProgramaDatos).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
    expect(programaServiceMock.setDatosFormulario).toHaveBeenCalledWith(resp);
  });

  it('debe establecer el índice cuando se llama a seleccionaTab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('debe completar destroyNotifier$ al llamar ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  describe('ngOnInit scenarios', () => {
    it('debe llamar a guardarDatosFormulario cuando update es true', fakeAsync(() => {
      consultaQueryMock.selectConsultaioState$ = of({
        readonly: false,
        update: true
      });
      
      const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
      
      component.ngOnInit();
      tick();
      
      expect(component.consultaState.update).toBe(true);
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(guardarSpy).toHaveBeenCalled();
    }));

    it('debe establecer esDatosRespuesta cuando update es false', fakeAsync(() => {
      consultaQueryMock.selectConsultaioState$ = of({
        readonly: true,
        update: false
      });
      
      component.ngOnInit();
      tick();
      
      expect(component.consultaState.update).toBe(false);
      expect(component.esFormularioSoloLectura).toBe(true);
      expect(component.esDatosRespuesta).toBe(true);
    }));
  });

  describe('guardarDatosFormulario scenarios', () => {
    it('debe manejar respuesta null del servicio', fakeAsync(() => {
      programaServiceMock.getProgramaDatos.mockReturnValue(of(null));
      component.esDatosRespuesta = false;
      
      component.guardarDatosFormulario();
      tick();
      
      expect(programaServiceMock.getProgramaDatos).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(false); // No debe cambiar si resp es null
      expect(programaServiceMock.setDatosFormulario).not.toHaveBeenCalled();
    }));

    it('debe manejar respuesta undefined del servicio', fakeAsync(() => {
      programaServiceMock.getProgramaDatos.mockReturnValue(of(undefined));
      component.esDatosRespuesta = false;
      
      component.guardarDatosFormulario();
      tick();
      
      expect(programaServiceMock.getProgramaDatos).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(false);
      expect(programaServiceMock.setDatosFormulario).not.toHaveBeenCalled();
    }));

  });

  describe('validarFormularios', () => {
    it('debe retornar true cuando programaACancelarComponent es undefined', () => {
      component.programaACancelarComponent = undefined;
      
      const result = component.validarFormularios();
      
      expect(result).toBe(true);
    });

    it('debe retornar false y establecer formFieldValidado cuando isFormValido es false', () => {
      component.programaACancelarComponent = {
        isFormValido: jest.fn().mockReturnValue(false),
        radioId: 1
      } as any;
      
      const result = component.validarFormularios();
      
      expect(result).toBe(false);
      expect(component.formFieldValidado).toBe(false);
    });

    it('debe retornar true pero formFieldValidado false cuando radioId es null', () => {
      component.programaACancelarComponent = {
        isFormValido: jest.fn().mockReturnValue(true),
        radioId: null
      } as any;
      
      const result = component.validarFormularios();
      
      expect(result).toBe(true);
      expect(component.formFieldValidado).toBe(false);
    });

    it('debe retornar true pero formFieldValidado false cuando radioId es undefined', () => {
      component.programaACancelarComponent = {
        isFormValido: jest.fn().mockReturnValue(true),
        radioId: undefined
      } as any;
      
      const result = component.validarFormularios();
      
      expect(result).toBe(true);
      expect(component.formFieldValidado).toBe(false);
    });

    it('debe retornar true pero formFieldValidado false cuando radioId es -1', () => {
      component.programaACancelarComponent = {
        isFormValido: jest.fn().mockReturnValue(true),
        radioId: -1
      } as any;
      
      const result = component.validarFormularios();
      
      expect(result).toBe(true);
      expect(component.formFieldValidado).toBe(false);
    });

    it('debe retornar true cuando el formulario es válido y radioId es válido', () => {
      component.programaACancelarComponent = {
        isFormValido: jest.fn().mockReturnValue(true),
        radioId: 1
      } as any;
      
      const result = component.validarFormularios();
      
      expect(result).toBe(true);
      expect(component.formFieldValidado).toBe(true);
    });

    it('debe retornar true cuando el formulario es válido y radioId es 0', () => {
      component.programaACancelarComponent = {
        isFormValido: jest.fn().mockReturnValue(true),
        radioId: 0
      } as any;
      
      const result = component.validarFormularios();
      
      expect(result).toBe(true);
      expect(component.formFieldValidado).toBe(true);
    });

    it('debe manejar cuando isFormValido retorna null', () => {
      component.programaACancelarComponent = {
        isFormValido: jest.fn().mockReturnValue(null),
        radioId: 1
      } as any;
      
      const result = component.validarFormularios();
      
      expect(result).toBe(true);
      expect(component.formFieldValidado).toBe(true);
    });

    it('debe manejar cuando isFormValido retorna undefined', () => {
      component.programaACancelarComponent = {
        isFormValido: jest.fn().mockReturnValue(undefined),
        radioId: 1
      } as any;
      
      const result = component.validarFormularios();
      
      expect(result).toBe(true);
      expect(component.formFieldValidado).toBe(true);
    });
  });

  describe('propiedades del componente', () => {
    it('debe tener valores iniciales correctos', () => {
      expect(component.indice).toBe(1);
      expect(component.esDatosRespuesta).toBe(false);
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.formFieldValidado).toBe(true);
    });

    it('debe tener destroyNotifier$ como Subject', () => {
      expect((component as any).destroyNotifier$).toBeInstanceOf(Subject);
    });
  });

  describe('edge cases', () => {
    it('debe manejar múltiples selecciones de tab', () => {
      component.seleccionaTab(2);
      expect(component.indice).toBe(2);
      
      component.seleccionaTab(1);
      expect(component.indice).toBe(1);
      
      component.seleccionaTab(3);
      expect(component.indice).toBe(3);
    });

    it('debe manejar tab con valor negativo', () => {
      component.seleccionaTab(-1);
      expect(component.indice).toBe(-1);
    });

    it('debe manejar tab con valor cero', () => {
      component.seleccionaTab(0);
      expect(component.indice).toBe(0);
    });
  });
});
