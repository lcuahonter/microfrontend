import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';

import { PasoUnoComponent } from './paso-uno.component';
import { BtnContinuarComponent, SolicitanteComponent, ConsultaioQuery, ConsultaioState } from '@libs/shared/data-access-user/src';
import { SolicitudService } from '../../services/solicitud.service';
import { GuardarDatosFormulario } from '../../models/solicitud.model';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockConsultaQuery: jest.Mocked<ConsultaioQuery>;
  let mockSolicitudService: jest.Mocked<SolicitudService>;
  let mockConsultaState: ConsultaioState;

  beforeEach(async () => {
    // Create mock objects
    mockConsultaState = {
      update: false,
      // Add other properties as needed for ConsultaioState
    } as ConsultaioState;

    mockConsultaQuery = {
      selectConsultaioState$: of(mockConsultaState)
    } as any;

    mockSolicitudService = {
      guardarDatosFormulario: jest.fn().mockReturnValue(of({} as GuardarDatosFormulario)),
      actualizarEstadoFormulario: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        CommonModule,
        SolicitanteComponent,
        BtnContinuarComponent,
        HttpClientTestingModule,
        PasoUnoComponent
      ],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
        { provide: SolicitudService, useValue: mockSolicitudService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.esDatosRespuesta).toBe(false);
    expect(component['destroyNotifier$']).toBeInstanceOf(Subject);
  });

  describe('ngOnInit', () => {
    it('should subscribe to consultaQuery and set esDatosRespuesta to true when update is false', () => {
      mockConsultaState.update = false;
      mockConsultaQuery.selectConsultaioState$ = of(mockConsultaState);
      
      component.ngOnInit();
      
      expect(component.consultaState).toEqual(mockConsultaState);
      expect(component.esDatosRespuesta).toBe(true);
      expect(mockSolicitudService.guardarDatosFormulario).not.toHaveBeenCalled();
    });

    it('should call guardarDatosFormulario when consultaState.update is true', () => {
      mockConsultaState.update = true;
      mockConsultaQuery.selectConsultaioState$ = of(mockConsultaState);
      jest.spyOn(component, 'guardarDatosFormulario');
      
      component.ngOnInit();
      
      expect(component.consultaState).toEqual(mockConsultaState);
      expect(component.guardarDatosFormulario).toHaveBeenCalled();
    });
  });

  describe('guardarDatosFormulario', () => {
    it('should call solicitudService.guardarDatosFormulario and update state on success', () => {
      const mockResponse: GuardarDatosFormulario = { /* add mock properties */ } as GuardarDatosFormulario;
      mockSolicitudService.guardarDatosFormulario.mockReturnValue(of(mockResponse));
      
      component.guardarDatosFormulario();
      
      expect(mockSolicitudService.guardarDatosFormulario).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(true);
      expect(mockSolicitudService.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResponse);
    });

    it('should not update state when response is falsy', () => {
      mockSolicitudService.guardarDatosFormulario.mockReturnValue(of(null as any));
      component.esDatosRespuesta = false;
      
      component.guardarDatosFormulario();
      
      expect(mockSolicitudService.guardarDatosFormulario).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(false);
      expect(mockSolicitudService.actualizarEstadoFormulario).not.toHaveBeenCalled();
    });
  });

  describe('seleccionaTab', () => {
    it('should update indice when seleccionaTab is called', () => {
      component.indice = 1;
      expect(component.indice).toBe(1);

      component.seleccionaTab(2);
      expect(component.indice).toBe(2);

      component.seleccionaTab(3);
      expect(component.indice).toBe(3);

      component.seleccionaTab(4);
      expect(component.indice).toBe(4);
    });

    it('should handle negative indices', () => {
      component.seleccionaTab(-1);
      expect(component.indice).toBe(-1);
    });

    it('should handle zero index', () => {
      component.seleccionaTab(0);
      expect(component.indice).toBe(0);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete the destroyNotifier$ subject', () => {
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('integration tests', () => {
    it('should properly clean up subscriptions on destroy', () => {
      component.ngOnInit();
      const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      
      component.ngOnDestroy();
      
      expect(destroyNotifierSpy).toHaveBeenCalled();
    });

    it('should handle error scenarios in guardarDatosFormulario', () => {
      const mockSubject = new Subject<GuardarDatosFormulario>();
      mockSolicitudService.guardarDatosFormulario.mockReturnValue(
        mockSubject.asObservable()
      );
      
      expect(() => component.guardarDatosFormulario()).not.toThrow();
    });
  });
});
