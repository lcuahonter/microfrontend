import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { SectoresMercanciasService } from '../../../../shared/services/sectores-mercancias.service';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockConsultaioQuery: any;
  let mockDatosDomicilioLegalService: any;
  let mockPagoBancoService: any;

  beforeEach(async () => {
    mockConsultaioQuery = {
      selectConsultaioState$: of({ update: false }),
    };
    mockDatosDomicilioLegalService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ test: 'data' })),
      actualizarEstadoFormulario: jest.fn(),
    };
    mockPagoBancoService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ test: 'data' })),
      actualizarEstadoFormulario: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: SectoresMercanciasService, useValue: mockPagoBancoService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('Debería establecer el índice y llamar a seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('Debería establecer esDatosRespuesta como true si update es false', () => {
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('Debería llamar a guardarDatosFormulario si update es true', () => {
    // Arrange
    mockConsultaioQuery.selectConsultaioState$ = of({ update: true });
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    // Act
    component.ngOnInit();
    // Assert
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('guardarDatosFormulario debería actualizar esDatosRespuesta y llamar a actualizarEstadoFormulario', () => {
  component.guardarDatosFormulario();
  expect(component.esDatosRespuesta).toBe(true);
  expect(mockPagoBancoService.actualizarEstadoFormulario).toHaveBeenCalledWith({ test: 'data' });
});


  it('debería llamar a obtenerTipoPersona en ngAfterViewInit', () => {
    component.solicitante = {
      obtenerTipoPersona: jest.fn(),
    } as any;
    component.ngAfterViewInit();
    expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
  });

  it('debería completar destroyNotifier$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});