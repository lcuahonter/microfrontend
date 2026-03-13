import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { CancelacionDeAutorizacionesComponent } from './cancelacion-de-autorizaciones.component';
import { CancelacionesService } from '../../services/cancelaciones.service';
import { CancelacionesStore } from '../../estados/cancelaciones.store';
import { CancelacionesQuery } from '../../estados/cancelaciones.query';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

jest.mock('../../services/cancelaciones.service');
jest.mock('../../estados/cancelaciones.store');
jest.mock('../../estados/cancelaciones.query');

describe('CancelacionDeAutorizacionesComponent', () => {
  let component: CancelacionDeAutorizacionesComponent;
  let fixture: ComponentFixture<CancelacionDeAutorizacionesComponent>;
  let cancelacionesService: jest.Mocked<CancelacionesService>;
  let cancelacionesStore: jest.Mocked<CancelacionesStore>;
  let cancelacionesQuery: jest.Mocked<CancelacionesQuery>;
  const consultaioQueryMock = {
    selectConsultaioState$: of({ readonly: true }),
  };

  beforeEach(async () => {
    cancelacionesQuery = {
      rfcIngresado$: of('RFC123456789'),
      motivoCancelacion$: of('Motivo de cancelación'),
    } as unknown as jest.Mocked<CancelacionesQuery>;

    cancelacionesService = {
      getCancelacionDeAutorizaciones: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<CancelacionesService>;

    cancelacionesStore = {
      setRfcIngresado: jest.fn(),
      setMotivoCancelacion: jest.fn(),
    } as unknown as jest.Mocked<CancelacionesStore>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CancelacionDeAutorizacionesComponent, HttpClientModule],
      providers: [
        { provide: CancelacionesService, useValue: cancelacionesService },
        { provide: CancelacionesStore, useValue: cancelacionesStore },
        { provide: CancelacionesQuery, useValue: cancelacionesQuery },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelacionDeAutorizacionesComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario en ngOnInit', () => {
    component.ngOnInit();
    expect(component.cancelacionForm).toBeDefined();
    expect(component.cancelacionForm.get('rfcIngresado')).toBeDefined();
    expect(component.cancelacionForm.get('motivoCancelacion')).toBeDefined();
  });

  it('debe actualizar el estado del formulario con los valores de los observables', () => {
    component.ngOnInit();
    component.actualizarEstado();
    expect(component.cancelacionForm.get('rfcIngresado')?.value).toBe('RFC123456789');
    expect(component.cancelacionForm.get('motivoCancelacion')?.value).toBe('Motivo de cancelación');
  });

  it('debe llamar a setRfcIngresado en updateRfcIngresado', () => {
    component.ngOnInit();
    component.cancelacionForm.get('rfcIngresado')?.setValue('RFC123456789');
    component.updateRfcIngresado();
    expect(cancelacionesStore.setRfcIngresado).toHaveBeenCalledWith('RFC123456789');
  });

  it('debe llamar a setMotivoCancelacion en updateMotivoCancelacion', () => {
    component.ngOnInit();
    component.cancelacionForm.get('motivoCancelacion')?.setValue('Motivo de cancelación');
    component.updateMotivoCancelacion();
    expect(cancelacionesStore.setMotivoCancelacion).toHaveBeenCalledWith('Motivo de cancelación');
  });

  it('debe alternar mostrarContenido en alternarContenido', () => {
    component.mostrarContenido = false;
    component.alternarContenido();
    expect(component.mostrarContenido).toBeTruthy();
    component.alternarContenido();
    expect(component.mostrarContenido).toBeFalsy();
  });

  it('debe obtener datos de cancelación desde el servicio', () => {
    component.ngOnInit();
    component.getCancelacioneServiceData();
    expect(cancelacionesService.getCancelacionDeAutorizaciones).toHaveBeenCalled();
    expect(component.cancelacionData).toEqual([]);
  });

  it('debe completar destroy$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debe llamar guardarDatosFormulario cuando readonly es true en inicializarEstadoFormulario', () => {
    component.esFormularioSoloLectura = true;
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    const updateSpy = jest.spyOn(component, 'actualizarEstado');

    component.inicializarEstadoFormulario();

    expect(guardarSpy).toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalledTimes(2);
  });

  it('debe llamar solo actualizarEstado cuando readonly es false en inicializarEstadoFormulario', () => {
    component.esFormularioSoloLectura = false;
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    const updateSpy = jest.spyOn(component, 'actualizarEstado');

    component.inicializarEstadoFormulario();

    expect(updateSpy).toHaveBeenCalled();
    expect(guardarSpy).not.toHaveBeenCalled();
  }); 
});
