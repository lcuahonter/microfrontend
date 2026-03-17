import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { SolicitudDeReporteComponent } from './solicitud-de-reporte.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { SolicitudService } from '../../services/registro-solicitud-anual.service';
import { Solicitud150101Query } from '../../estados/solicitud150101.query';
import { Solicitud150101Store } from '../../estados/solicitud150101.store';
import { WizardService } from '@libs/shared/data-access-user/src';

describe('SolicitudDeReporteComponent', () => {
  let fixture: ComponentFixture<SolicitudDeReporteComponent>;
  let component: SolicitudDeReporteComponent;
  const mockSolicitudService = {
    getAllState: jest.fn().mockReturnValue(of({ idProgramaCompuesto: '121681,2011-7018' })),
    guardarDatosPost: jest.fn().mockReturnValue(of({ codigo: '00', mensaje: 'Success', datos: { id_solicitud: 10 } })),
    buildReporteAnual: jest.fn().mockReturnValue({ test: true })
  };
  const toastrMock = {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn()
  };
  const mockWizardService = {
    cambio_indice: jest.fn()
  };

  const mockStore = {
    setIdSolicitud: jest.fn()
  };

  const mockQuery = {
    seleccionarSolicitud$: of({ idProgramaCompuesto: '121681,2011-7018' })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [
        SolicitudDeReporteComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: ToastrService, useValue: toastrMock },
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: Solicitud150101Query, useValue: mockQuery },
        { provide: Solicitud150101Store, useValue: mockStore },
        { provide: WizardService, useValue: mockWizardService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudDeReporteComponent);
    component = fixture.componentInstance;
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;
     component.pasoUnoComponent = {
      validarTodosLosFormularios: jest.fn(() => 0)
    } as any;
  });

  afterEach(() => {
    if (component) {
      jest.restoreAllMocks();
    }
    fixture.destroy();
  });

  it('should run #constructor()', () => {
    expect(component).toBeTruthy();
  });

  it('should reset validation flags when alCambiarPestana is called', () => {
    component.esFormaValido = true;
    component.esFormaValidoDos = true;
    component.esFormaValidoTres = true;
    component.esFormaValidoCuatro = true;
    component.alCambiarPestana();
    expect(component.esFormaValido).toBe(false);
    expect(component.esFormaValidoDos).toBe(false);
    expect(component.esFormaValidoTres).toBe(false);
    expect(component.esFormaValidoCuatro).toBe(false);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should set esFormaValido when validarTodosLosFormularios returns 1', () => {
    component.pasoUnoComponent = { validarTodosLosFormularios: jest.fn(() => 1) } as any;
    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(component.esFormaValido).toBe(true);
    expect(component.esFormaValidoDos).toBe(false);
  });

  it('should set esFormaValidoDos when validarTodosLosFormularios returns 2', () => {
    component.pasoUnoComponent = { validarTodosLosFormularios: jest.fn(() => 2) } as any;
    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(component.esFormaValidoDos).toBe(true);
    expect(component.esFormaValido).toBe(false);
  });

  it('should navigate forward when shouldNavigate$ returns true', (done) => {
    jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(true));
    component.indice = 1;
    component.getValorIndice({ accion: 'cont', valor: 1 });
    setTimeout(() => {
      expect(component.indice).toBe(2);
      expect(component.wizardService.cambio_indice).toHaveBeenCalledWith(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      done();
    });
  });

  it('should navigate backward when accion=ant', () => {
    component.indice = 3;
    component.getValorIndice({ accion: 'ant', valor: 3 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should set solicitudState on ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitudState).toBeDefined();
    expect(component.solicitudState.idProgramaCompuesto).toBe('121681,2011-7018');
  });

  it('should build correct payload and call guardarDatosPost in guardar()', async () => {
    const mockData: any = {
      idProgramaCompuesto: '121681,2011-7018',
      reporteAnualFechaInicio: '2024-01-01',
      reporteAnualFechaFin: '2024-12-31',
      modalidad: 'Normal'
    };
    await component.guardar(mockData);
    expect(mockSolicitudService.buildReporteAnual).toHaveBeenCalledWith(mockData);
    expect(mockSolicitudService.guardarDatosPost).toHaveBeenCalled();
    expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(10);
  });

  it('should show toastr success when shouldNavigate$ receives codigo=00', (done) => {
    jest.spyOn(mockSolicitudService, 'getAllState').mockReturnValue(of({}));
    jest.spyOn(mockSolicitudService, 'guardarDatosPost').mockReturnValue(
      of({ codigo: '00', mensaje: 'Guardado OK', datos: { id_solicitud: 11 } })
    );

    (component as any).shouldNavigate$().subscribe((result: boolean) => {
      expect(result).toBe(true);
      expect(toastrMock.success).toHaveBeenCalledWith('Guardado OK');
      done();
    });
  });

  it('should show toastr error when shouldNavigate$ receives codigo != 00', (done) => {
    jest.spyOn(mockSolicitudService, 'getAllState').mockReturnValue(of({}));
    jest.spyOn(mockSolicitudService, 'guardarDatosPost').mockReturnValue(
      of({ codigo: '99', mensaje: 'Error', datos: {} })
    );

    (component as any).shouldNavigate$().subscribe((result: boolean) => {
      expect(result).toBe(false);
      expect(toastrMock.error).toHaveBeenCalledWith('Error');
      done();
    });
  });

});
