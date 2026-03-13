import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { ModificatNoticeService } from '../../services/modificat-notice.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let modificatNoticeServiceMock: any;
  let consultaQueryMock: any;

  beforeEach(async () => {
    modificatNoticeServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of(null)), // Always return observable
      actualizarEstadoFormulario: jest.fn(),
    };

    consultaQueryMock = {
      selectConsultaioState$: of({ update: true }),
    };

    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      providers: [
        { provide: ModificatNoticeService, useValue: modificatNoticeServiceMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    // Always mock before detectChanges to avoid undefined.pipe error
    modificatNoticeServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(null));
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe llamar guardarDatosFormulario si update es true', () => {
    modificatNoticeServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of({}));
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.consultaState = { update: true } as any;
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

it('guardarDatosFormulario debe actualizar el estado y llamar actualizarEstadoFormulario', () => {
    const mockResp = { nombre: 'Prueba' };
    modificatNoticeServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(mockResp));
    component.guardarDatosFormulario();
    expect(modificatNoticeServiceMock.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
    expect(modificatNoticeServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResp);
  });

  it('guardarDatosFormulario no debe llamar actualizarEstadoFormulario si resp es falsy', () => {
    modificatNoticeServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(null));
    component.guardarDatosFormulario();
    expect(modificatNoticeServiceMock.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('ngAfterViewInit debe llamar obtenerTipoPersona en el componente SolicitanteComponent', () => {
    component.solicitante = { obtenerTipoPersona: jest.fn() } as any;
    component.ngAfterViewInit();
    expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalled();
  });

  it('seleccionaTab debe cambiar el índice', () => {
    component.indice = 1;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('ngOnDestroy debe limpiar el subject destroyNotifier$', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  // Additional coverage for branches/statements
  it('guardarDatosFormulario should handle observable error gracefully', () => {
    modificatNoticeServiceMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue({
      pipe: () => ({
        subscribe: (success: any, error: any) => error && error(new Error('fail'))
      })
    });
    expect(() => component.guardarDatosFormulario()).not.toThrow();
  });

  it('ngOnInit should not fail if consultaState is undefined', () => {
    component.consultaState = undefined as any;
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('ngAfterViewInit should not fail if solicitante is undefined', () => {
    component.solicitante = undefined as any;
    expect(() => component.ngAfterViewInit()).not.toThrow();
  });
});