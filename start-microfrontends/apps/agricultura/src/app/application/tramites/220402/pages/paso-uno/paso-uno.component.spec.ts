import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { CapturaSolicitudeService } from '../../services/captura-solicitud.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TransporteComponent } from '../../components/transporte/transporte.component';
import { PagoDeDerechoComponent } from '../../components/pago-de-derecho/pago-de-derecho.component';
import { AgregarDestinatarioComponent } from '../../components/agregar-destinatario/agregar-destinatario.component';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { provideHttpClient } from '@angular/common/http';


describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockCapturaSolicitudeService: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockCapturaSolicitudeService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ update: true })),
      actualizarEstadoFormulario: jest.fn(),
    };

    mockConsultaioQuery = {
      selectConsultaioState$: of({ update: true }),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent,
        AgregarDestinatarioComponent,
        PagoDeDerechoComponent,
        TransporteComponent
      ],
      imports: [SolicitanteComponent, SolicitudComponent],
      providers: [
        provideHttpClient(),
        { provide: CapturaSolicitudeService, useValue: mockCapturaSolicitudeService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize consultaDatos on ngOnInit', () => {
    expect(component.consultaDatos).toEqual({ update: true });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormulario when consultaDatos.update is true', () => {
    const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should update the store with data from guardarDatosFormulario', () => {
    component.guardarDatosFormulario();
    expect(mockCapturaSolicitudeService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(mockCapturaSolicitudeService.actualizarEstadoFormulario).toHaveBeenCalledWith({ update: true });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should emit destroyNotifier$ on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

  it('should update the tab index when seleccionaTab is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  // --- Cobertura adicional en español ---
  it('debe validar correctamente el formulario principal cuando el solicitante es válido', () => {
    component.indice = 1;
    component.solicitante = { form: { invalid: false, markAllAsTouched: jest.fn() } } as any;
    expect(component.validarFormularios()).toBe(true);
  });

  it('debe marcar como tocado y retornar falso si el formulario del solicitante es inválido', () => {
    component.indice = 1;
    const mockForm = { invalid: true, markAllAsTouched: jest.fn() };
    component.solicitante = { form: mockForm } as any;
    expect(component.validarFormularios()).toBe(false);
    expect(mockForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('debe retornar verdadero si el índice no es 1 o el solicitante no existe', () => {
    component.indice = 2;
    component.solicitante = undefined as any;
    expect(component.validarFormularios()).toBe(true);
  });

  it('debe validar todos los formularios y retornar verdadero si todos son válidos', () => {
    component.formGroupTab1 = { valid: true, controls: {}, markAllAsTouched: jest.fn() } as any;
    component.formGroupTab2 = { valid: true, controls: {}, markAllAsTouched: jest.fn() } as any;
    component.solicitudComp = { form: { valid: true, markAllAsTouched: jest.fn() } } as any;
    component.transporteComp = { transporteForm: { valid: true, markAllAsTouched: jest.fn() }, mostrarErrores: jest.fn() } as any;
    component.pagoDerechoComp = { FormSolicitud: { valid: true, markAllAsTouched: jest.fn() }, mostrarErrores: jest.fn() } as any;
    component.destinatarioComp = { destinatarioForm: { valid: true, markAllAsTouched: jest.fn() }, mostrarErrores: jest.fn() } as any;
    expect(component.validarTodosLosFormularios()).toBe(true);
  });

  it('debe retornar falso si algún formulario principal es inválido', () => {
    component.formGroupTab1 = { valid: false, controls: { campo1: { markAsTouched: jest.fn() } }, markAllAsTouched: jest.fn() } as any;
    component.formGroupTab2 = { valid: true, controls: {}, markAllAsTouched: jest.fn() } as any;
    expect(component.validarTodosLosFormularios()).toBe(false);
  });

  it('debe retornar falso si algún formulario hijo es inválido', () => {
    component.formGroupTab1 = { valid: true, controls: {}, markAllAsTouched: jest.fn() } as any;
    component.formGroupTab2 = { valid: true, controls: {}, markAllAsTouched: jest.fn() } as any;
    component.solicitudComp = { form: { valid: false, markAllAsTouched: jest.fn() } } as any;
    expect(component.validarTodosLosFormularios()).toBe(false);
  });

  it('debe retornar verdadero si los formularios son undefined', () => {
    component.formGroupTab1 = undefined as any;
    component.formGroupTab2 = undefined as any;
    component.solicitudComp = undefined as any;
    component.transporteComp = undefined as any;
    component.pagoDerechoComp = undefined as any;
    component.destinatarioComp = undefined as any;
    expect(component.validarTodosLosFormularios()).toBe(true);
  });

  it('debe retornar la validez total de los formularios con obtenerValidacionTotalFormularios', () => {
    const resultado = PasoUnoComponent.obtenerValidacionTotalFormularios();
    expect(resultado).toEqual({ tab1Valid: true, tab2Valid: true });
  });
});