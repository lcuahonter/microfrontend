import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { DatosDomicilioLegalService } from '../../../../shared/services/datos-domicilio-legal.service';
import { PagoBancoService } from '../../../../shared/services/pago-banco.service';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { Shared2605Service } from '../../../../shared/services/shared2605/shared2605.service';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockConsultaioQuery: any;
  let mockDatosDomicilioLegalService: any;
  let mockPagoBancoService: any;

  let mockSharedSvc: any;
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
    mockSharedSvc = {
      getAllState: jest.fn().mockReturnValue(of({ foo: 'bar' }))
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: DatosDomicilioLegalService, useValue: mockDatosDomicilioLegalService },
        { provide: PagoBancoService, useValue: mockPagoBancoService },
        { provide: Shared2605Service, useValue: mockSharedSvc },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    // Directly assign mockSharedSvc for tests that use component['sharedSvc']
    component['sharedSvc'] = mockSharedSvc;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set indice and call seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should set esDatosRespuesta to true if update is false', () => {
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormulario if update is true', () => {
    // Arrange
    mockConsultaioQuery.selectConsultaioState$ = of({ update: true });
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    // Act
    component.ngOnInit();
    // Assert
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('guardarDatosFormulario should update esDatosRespuesta and call actualizarEstadoFormulario', () => {
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockDatosDomicilioLegalService.actualizarEstadoFormulario).toHaveBeenCalledWith({ test: 'data' });
    expect(mockPagoBancoService.actualizarEstadoFormulario).toHaveBeenCalledWith({ test: 'data' });
  });

  it('should call obtenerTipoPersona in ngAfterViewInit', () => {
    component.solicitante = {
      obtenerTipoPersona: jest.fn(),
    } as any;
    component.ngAfterViewInit();
    expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should set state from getAllState', () => {
    const mockSharedSvc = {
      getAllState: jest.fn().mockReturnValue(of({ foo: 'bar' }))
    };
    component['sharedSvc'] = mockSharedSvc as any;
    component.getAllState();
    // Simulate observable emission
    expect(component['state']).toEqual({ foo: 'bar' });
  });

  describe('validarFormularios', () => {
    let mockQuery: any;
    let mockPagoDerechosComponent: any;
    beforeEach(() => {
      mockQuery = {
        getValue: jest.fn().mockReturnValue({
          formValidity: {
            datosEstablecimiento: true,
            domicilioEstablecimiento: true,
            manifiestos: true,
            representanteLegal: true,
            fabricanteTablaValid: true,
            formuladorTablaValid: true,
            proveedorTablaValid: true,
          }
        })
      };
      component['query'] = mockQuery;
      mockPagoDerechosComponent = { markTouched: jest.fn() };
      component['pagoDerechosComponent'] = mockPagoDerechosComponent;
      // Mock getAllState to do nothing so state is not overwritten
      jest.spyOn(component, 'getAllState').mockImplementation(() => {});
    });

    it('should return true when all validities are true and payment fields are filled', () => {
      component['state'] = {
        claveDeReferencia: 'x',
        cadenaDependencia: 'x',
        banco: 'x',
        llaveDePago: 'x',
        fechaPago: 'x',
        importePago: 'x',
      };
      expect(component.validarFormularios()).toBe(true);
      expect(mockPagoDerechosComponent.markTouched).not.toHaveBeenCalled();
    });

    it('should return false and call markTouched when payment fields are empty', () => {
      // Set all validity flags to true so only payment fields matter
      mockQuery.getValue.mockReturnValue({
        formValidity: {
          datosEstablecimiento: true,
          domicilioEstablecimiento: true,
          manifiestos: true,
          representanteLegal: true,
          fabricanteTablaValid: true,
          formuladorTablaValid: true,
          proveedorTablaValid: true,
        }
      });
      component['state'] = {
        claveDeReferencia: '',
        cadenaDependencia: '',
        banco: '',
        llaveDePago: '',
        fechaPago: '',
        importePago: '',
      };
      expect(component.validarFormularios()).toBe(false);
      expect(mockPagoDerechosComponent.markTouched).toHaveBeenCalled();
    });

    it('should return false if datos de la solicitud validity is false', () => {
      mockQuery.getValue.mockReturnValue({
        formValidity: {
          datosEstablecimiento: false,
          domicilioEstablecimiento: true,
          manifiestos: true,
          representanteLegal: true,
          fabricanteTablaValid: true,
          formuladorTablaValid: true,
          proveedorTablaValid: true,
        }
      });
      component['state'] = {
        claveDeReferencia: 'x',
        cadenaDependencia: 'x',
        banco: 'x',
        llaveDePago: 'x',
        fechaPago: 'x',
        importePago: 'x',
      };
      expect(component.validarFormularios()).toBe(false);
    });

    it('should return false if terceros validity is false', () => {
      mockQuery.getValue.mockReturnValue({
        formValidity: {
          datosEstablecimiento: true,
          domicilioEstablecimiento: true,
          manifiestos: true,
          representanteLegal: true,
          fabricanteTablaValid: false,
          formuladorTablaValid: true,
          proveedorTablaValid: true,
        }
      });
      component['state'] = {
        claveDeReferencia: 'x',
        cadenaDependencia: 'x',
        banco: 'x',
        llaveDePago: 'x',
        fechaPago: 'x',
        importePago: 'x',
      };
      expect(component.validarFormularios()).toBe(false);
    });
  });
});