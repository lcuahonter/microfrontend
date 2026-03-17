import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { Solocitud220401Service } from '../../services/service220401.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let solocitud220401ServiceMock: any;
  let consultaQueryMock: any;

  beforeEach(async () => {
    solocitud220401ServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
    };

    consultaQueryMock = {
      selectConsultaioState$: of({ update: true }),
    };

    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      providers: [
        { provide: Solocitud220401Service, useValue: solocitud220401ServiceMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe suscribirse y llamar guardarDatosFormulario si update es true', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.consultaState = { update: true } as any;
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('ngOnInit debe establecer esDatosRespuesta en true si update es false', () => {
    consultaQueryMock.selectConsultaioState$ = of({ update: false });
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('guardarDatosFormulario debe actualizar el estado y llamar actualizarEstadoFormulario', () => {
    const mockResp = { nombre: 'Prueba' };
    solocitud220401ServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(mockResp));
    component.guardarDatosFormulario();
    expect(solocitud220401ServiceMock.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
    expect(solocitud220401ServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResp);
  });

  it('guardarDatosFormulario no debe llamar actualizarEstadoFormulario si resp es falsy', () => {
    solocitud220401ServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(null));
    component.guardarDatosFormulario();
    expect(solocitud220401ServiceMock.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('seleccionaTab debe cambiar el índice', () => {
    component.indice = 1;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('ngOnDestroy debe limpiar el subject destroyNotifier$', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    if (component['destroyNotifier$']) {
      component.ngOnDestroy?.();
      expect(spyNext).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    }
  });
});