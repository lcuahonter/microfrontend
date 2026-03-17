import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TIPO_PERSONA } from '@ng-mf/data-access-user';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let solicitudServiceMock: any;
  let consultaQueryMock: any;

  beforeEach(async () => {
    solicitudServiceMock = {
      obtenerDatos: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
    };

    consultaQueryMock = {
      selectConsultaioState$: of({ update: true }),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],  
      imports: [SolicitanteComponent],   
      providers: [
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;

    component.solicitante = {
      obtenerTipoPersona: jest.fn(),
    } as any;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería suscribirse al estado de consulta en ngOnInit y llamar guardarDatosFormulario si update es true', () => {
    const spyGuardarDatos = jest.spyOn(component, 'guardarDatosFormulario').mockImplementation(() => {});

    component.ngOnInit();

    expect(spyGuardarDatos).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(false);
  });

  it('debería establecer esDatosRespuesta en true si update es falso', () => {
    consultaQueryMock.selectConsultaioState$ = of({ update: false });
    component = TestBed.createComponent(PasoUnoComponent).componentInstance;

    component.ngOnInit();

    expect(component.esDatosRespuesta).toBe(true);
  });

  it('guardarDatosFormulario debe llamar obtenerDatos y actualizarEstadoFormulario y setear esDatosRespuesta en true', () => {
    const mockResponse = { data: 'respuesta' };
    solicitudServiceMock.obtenerDatos.mockReturnValue(of(mockResponse));

    component.guardarDatosFormulario();

    expect(solicitudServiceMock.obtenerDatos).toHaveBeenCalled();
    solicitudServiceMock.obtenerDatos().subscribe(() => {
      expect(component.esDatosRespuesta).toBe(true);
      expect(solicitudServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResponse);
    });
  });

  it('ngAfterViewInit debe inicializar persona, domicilioFiscal y llamar obtenerTipoPersona con MORAL_NACIONAL', () => {
    component.ngAfterViewInit();

    expect(component.persona.length).toBeGreaterThan(0);
    expect(component.domicilioFiscal.length).toBeGreaterThan(0);
    expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
  });

  it('seleccionaTab debe cambiar el índice de la pestaña', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('ngOnDestroy debe emitir y completar destroyNotifier$', () => {
    const spyNext = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
