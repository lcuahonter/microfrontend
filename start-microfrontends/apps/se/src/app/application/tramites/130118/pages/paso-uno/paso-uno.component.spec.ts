import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { PeximService } from '../../services/pexim.service';
import { of, Subject } from 'rxjs';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  let mockConsultaQuery: Partial<ConsultaioQuery>;
  let mockPeximService: Partial<PeximService>;

  beforeEach(async () => {
    mockConsultaQuery = {
      selectConsultaioState$: of({ update: false } as ConsultaioState),
    };

    mockPeximService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of(null)),
      actualizarEstadoFormulario: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent, SolicitudComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
        { provide: PeximService, useValue: mockPeximService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debería suscribirse al estado y asignar consultaState', () => {
      component.ngOnInit();
      expect(component.consultaState).toEqual({ update: false });
      expect(component.esDatosRespuesta).toBe(true);
    });

    it('debería llamar guardarDatosFormularios si consultaState.update es true', () => {
      (mockConsultaQuery.selectConsultaioState$ as any) = of({ update: true });
      const spyGuardarDatos = jest.spyOn(component, 'guardarDatosFormularios');

      component.ngOnInit();

      expect(component.consultaState.update).toBe(true);
      expect(spyGuardarDatos).toHaveBeenCalled();
    });
  });

  describe('guardarDatosFormularios', () => {
    it('debería actualizar esDatosRespuesta y llamar actualizarEstadoFormulario si resp es válido', () => {
      const mockResp = { some: 'data' };
      (mockPeximService.getRegistroTomaMuestrasMercanciasData as jest.Mock).mockReturnValue(of(mockResp));

      component.guardarDatosFormularios();

      expect(mockPeximService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(true);
      expect(mockPeximService.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResp);
    });

    it('no debería actualizar si resp es null', () => {
      (mockPeximService.getRegistroTomaMuestrasMercanciasData as jest.Mock).mockReturnValue(of(null));

      component.guardarDatosFormularios();

      expect(component.esDatosRespuesta).toBe(false);
      expect(mockPeximService.actualizarEstadoFormulario).not.toHaveBeenCalled();
    });
  });

  describe('seleccionaTab', () => {
    it('debería cambiar el índice de pestaña', () => {
      component.seleccionaTab(3);
      expect(component.indice).toBe(3);
    });
  });

  describe('ngOnDestroy', () => {
    it('debería completar el destroyNotifier$', () => {
      const spyNext = jest.spyOn(component.destroyNotifier$, 'next');
      const spyComplete = jest.spyOn(component.destroyNotifier$, 'complete');

      component.ngOnDestroy();

      expect(spyNext).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    });
  });
});
