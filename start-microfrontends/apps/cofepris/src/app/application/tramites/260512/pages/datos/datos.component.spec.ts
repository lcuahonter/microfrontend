import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatosComponent', () => {
  let componente: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let servicioSolicitudMock: any;
  let consultaQueryMock: any;

  beforeEach(async () => {
    servicioSolicitudMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ some: 'data' })),
      actualizarEstadoFormulario: jest.fn(),
    };

    consultaQueryMock = {
      selectConsultaioState$: of({ update: false }),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      declarations: [DatosComponent],
      providers: [
        { provide: 'SolicitudService', useValue: servicioSolicitudMock },
        { provide: 'ConsultaioQuery', useValue: consultaQueryMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], 
    })
      .overrideComponent(DatosComponent, {
        set: {
          providers: [
            { provide: 'SolicitudService', useValue: servicioSolicitudMock },
            { provide: 'ConsultaioQuery', useValue: consultaQueryMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    componente = fixture.componentInstance;

    (componente as any).solicitudService = servicioSolicitudMock;
    (componente as any).consultaQuery = consultaQueryMock;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería establecer esDatosRespuesta en true si consultaState.update es false en ngOnInit', () => {
    componente.consultaState = { update: false } as any;
    componente.ngOnInit();
    expect(componente.esDatosRespuesta).toBe(true);
  });

  it('debería establecer esDatosRespuesta y llamar actualizarEstadoFormulario en guardarDatosFormulario', () => {
    componente.esDatosRespuesta = false;
    componente.guardarDatosFormulario();
    expect(componente.esDatosRespuesta).toBe(true);
    expect(servicioSolicitudMock.actualizarEstadoFormulario).toHaveBeenCalledWith({ some: 'data' });
  });

  it('debería actualizar indice cuando se llama seleccionaTab', () => {
    componente.seleccionaTab(5);
    expect(componente.indice).toBe(5);
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const nextSpy = jest.spyOn(componente['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(componente['destroyNotifier$'], 'complete');
    componente.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
