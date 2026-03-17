import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { Service130302Service } from '../../services/service130302.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

class MockSolicitanteComponent {
  obtenerTipoPersona = jest.fn();
}

class MockService130302Service {
  getRegistroTomaMuestrasMercanciasData = jest.fn(() => of({}));
  actualizarEstadoFormulario = jest.fn();
}

class MockConsultaioQuery {
  selectConsultaioState$ = of({ update: false });
}

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let consultaQuery: MockConsultaioQuery;
  let service130302Service: MockService130302Service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      providers: [
        { provide: Service130302Service, useClass: MockService130302Service },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    consultaQuery = TestBed.inject(ConsultaioQuery) as any;
    service130302Service = TestBed.inject(Service130302Service) as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false', () => {
    // Arrange
    (consultaQuery as any).selectConsultaioState$ = of({ update: false });
    // Act
    component.ngOnInit();
    // Assert
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormulario if consultaState.update is true', () => {
    (consultaQuery as any).selectConsultaioState$ = of({ update: true });
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('should set indice and change it with seleccionaTab', () => {
    expect(component.indice).toBe(1);
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should call obtenerTipoPersona with MORAL_NACIONAL on ngAfterViewInit', () => {
    const solicitante = { obtenerTipoPersona: jest.fn() };
    component.solicitante = solicitante as any;
    component.ngAfterViewInit();
    expect(solicitante.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
  });

  it('guardarDatosFormulario should set esDatosRespuesta and call actualizarEstadoFormulario if resp', () => {
    const actualizarSpy = jest.spyOn(service130302Service, 'actualizarEstadoFormulario');
    component['service130302Service'] = service130302Service as any;
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(actualizarSpy).toHaveBeenCalled();
  });

  it('guardarDatosFormulario should not call actualizarEstadoFormulario if resp is falsy', () => {
    // Return undefined which is falsy and compatible with the type
    service130302Service.getRegistroTomaMuestrasMercanciasData = jest.fn(() => of(undefined as any));
    const actualizarSpy = jest.spyOn(service130302Service, 'actualizarEstadoFormulario');
    component['service130302Service'] = service130302Service as any;
    component.guardarDatosFormulario();
    expect(actualizarSpy).not.toHaveBeenCalled();
  });

  it('guardarDatosFormulario should call actualizarEstadoFormulario if resp is truthy', () => {
    const mockResponse = { saldoDisponible: '1000', fechaPago: '2025-01-01' };
    service130302Service.getRegistroTomaMuestrasMercanciasData = jest.fn(() => of(mockResponse as any));
    const actualizarSpy = jest.spyOn(service130302Service, 'actualizarEstadoFormulario');
    component['service130302Service'] = service130302Service as any;
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(actualizarSpy).toHaveBeenCalledWith(mockResponse);
  });

  it('should clean up destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
