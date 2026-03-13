// paso-uno.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CancelarSolicitudService } from '../../service/cancelar-solicitud.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let queryStub: Partial<ConsultaioQuery>;
  let cancelarServiceStub: Partial<CancelarSolicitudService>;

  beforeEach(async () => {
    // Stub ConsultaioQuery to emit a sync state with update=false
    queryStub = {
      selectConsultaioState$: of({ update: false } as any),
    };

    // Stub CancelarSolicitudService with spies on both methods
    cancelarServiceStub = {
      getRegistroTomaMuestrasMercanciasData: jest
        .fn()
        .mockReturnValue(of({ some: 'data' })),
      actualizarEstadoFormulario: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: queryStub },
        { provide: CancelarSolicitudService, useValue: cancelarServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA], // ignore child component tags in template
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // runs constructor logic & ngOnInit
  });

  it('should create and set consultaState & esDatosRespuesta (update=false)', () => {
    expect(component).toBeTruthy();
    expect(component.consultaState).toEqual({ update: false });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('seleccionaTab should update indice and emit pestanaCambiado', () => {
    const emitSpy = jest.spyOn(component.pestanaCambiado, 'emit');
    component.seleccionaTab(5);
    expect(component.indice).toBe(5);
    expect(emitSpy).toHaveBeenCalledWith(5);
  });

  it('isFormValid should reflect child.formCancelorSolicitud.valid via getter override', () => {
    const mockForm: any = {};
    let backingValid = true;
    Object.defineProperty(mockForm, 'valid', {
      get: () => backingValid,
      configurable: true,
    });
    component.cancelarSolicitudComponent = {
      formCancelorSolicitud: mockForm,
    } as any;
    expect(component.isFormValid()).toBe(true);

    backingValid = false;
    expect(component.isFormValid()).toBe(false);
  });

  it('guardarDatosFormulario calls service, sets esDatosRespuesta, and calls actualizarEstadoFormulario', () => {
    // reset flags
    component.esDatosRespuesta = false;

    // prepare a different response
    const mockResp = { id: 123 };
    (
      cancelarServiceStub.getRegistroTomaMuestrasMercanciasData as jest.Mock
    ).mockReturnValue(of(mockResp));

    component.guardarDatosFormulario();

    expect(
      cancelarServiceStub.getRegistroTomaMuestrasMercanciasData
    ).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
    expect(cancelarServiceStub.actualizarEstadoFormulario).toHaveBeenCalledWith(
      mockResp
    );
  });

  it('ngOnDestroy should call next() and complete() on destroyNotifier$', () => {
    const notifier = (component as any).destroyNotifier$;
    const nextSpy = jest.spyOn(notifier, 'next');
    const completeSpy = jest.spyOn(notifier, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
