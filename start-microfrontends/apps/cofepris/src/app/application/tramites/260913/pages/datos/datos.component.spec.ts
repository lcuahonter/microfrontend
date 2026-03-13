import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { of, Subject } from 'rxjs';
import { EstablecimientoService } from '../../../../shared/services/establecimiento.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Component } from '@angular/core';


@Component({selector: 'solicitante', template: ''})
class MockSolicitanteComponent {}
describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let mockEstablecimientoService: any;
  let mockConsultaQuery: any;

  beforeEach(async () => {
    mockEstablecimientoService = {
      obtenerSolicitudDatos: jest.fn(),
      actualizarEstadoFormulario: jest.fn()
    };

    mockConsultaQuery = {
      selectConsultaioState$: of({ update: false })
    };

    await TestBed.configureTestingModule({
      declarations: [DatosComponent, MockSolicitanteComponent],
      providers: [
        { provide: EstablecimientoService, useValue: mockEstablecimientoService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar y suscribirse a selectConsultaioState$ con update=false', () => {
    component.consultaState = undefined as any;
    component.esDatosRespuesta = false;
    mockConsultaQuery.selectConsultaioState$ = of({ update: false });
    component.ngOnInit();
    expect(component.consultaState).toEqual({ update: false });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería llamar a guardarDatosFormulario si update=true', () => {
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    mockConsultaQuery.selectConsultaioState$ = of({ update: true });
    component.ngOnInit();
    expect(component.consultaState).toEqual({ update: true });
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('guardarDatosFormulario debe actualizar estado si hay respuesta', () => {
    const mockResp = { test: 'valor' };
    mockEstablecimientoService.obtenerSolicitudDatos.mockReturnValue(of(mockResp));
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockEstablecimientoService.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResp);
  });

  it('guardarDatosFormulario no debe actualizar estado si no hay respuesta', () => {
    mockEstablecimientoService.obtenerSolicitudDatos.mockReturnValue(of(null));
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(false);
    expect(mockEstablecimientoService.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('debería cambiar el índice con seleccionaTab', () => {
    component.indice = 1;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debería limpiar destroyNotifier$ en ngOnDestroy', () => {
    const spyNext = jest.spyOn<any, any>(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn<any, any>(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});