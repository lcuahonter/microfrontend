import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Datos270201Component } from './datos-270201.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('Datos270201Component', () => {
  let component: Datos270201Component;
  let fixture: ComponentFixture<Datos270201Component>;
  let mockConsultaQuery: any;
  let mockSolicitudService: any;

  beforeEach(async () => {
  mockConsultaQuery = {
      selectConsultaioState$: of({ update: true })
    };
    mockSolicitudService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ some: 'data' })),
      actualizarEstadoFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [Datos270201Component],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
         { provide: ConsultaioQuery, useValue: mockConsultaQuery },
        { provide: SolicitudService, useValue: mockSolicitudService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Datos270201Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have "indice" initialized to 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should change "indice" when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);

    component.seleccionaTab(5);
    expect(component.indice).toBe(5);
  });

    it('should call guardarDatosFormulario if consultaState.update is true in ngOnInit', () => {
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    mockConsultaQuery.selectConsultaioState$ = of({ update: true });
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false in ngOnInit', () => {
    mockConsultaQuery.selectConsultaioState$ = of({ update: false });
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should set esDatosRespuesta and call actualizarEstadoFormulario in guardarDatosFormulario', () => {
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockSolicitudService.actualizarEstadoFormulario).toHaveBeenCalledWith({ some: 'data' });
  });

  it('should not call actualizarEstadoFormulario if guardarDatosFormulario gets falsy response', () => {
    mockSolicitudService.actualizarEstadoFormulario.mockClear();
    mockSolicitudService.getRegistroTomaMuestrasMercanciasData.mockReturnValueOnce(of(null));
    component.guardarDatosFormulario();
    expect(mockSolicitudService.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});
