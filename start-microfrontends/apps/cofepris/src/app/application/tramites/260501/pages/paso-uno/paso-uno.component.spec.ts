import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { DatosDomicilioLegalService } from '../../../../shared/services/datos-domicilio-legal.service';
import { PagoBancoService } from '../../../../shared/services/pago-banco.service';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { Tramite260501Store } from '../../../../shared/estados/stores/260501/tramite260509.store';
import { Tramite260501Query } from '../../../../shared/estados/queries/260501/tramite260501.query';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockConsultaioQuery: any;
  let mockDatosDomicilioLegalService: any;
  let mockPagoBancoService: any;
  let mockStore: any;
  let mockQuery: any;

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

    mockStore = {
      setFormValidity: jest.fn()
    };

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

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: DatosDomicilioLegalService, useValue: mockDatosDomicilioLegalService },
        { provide: PagoBancoService, useValue: mockPagoBancoService },
        { provide: Tramite260501Store, useValue: mockStore },
        { provide: Tramite260501Query, useValue: mockQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
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
    mockConsultaioQuery.selectConsultaioState$ = of({ update: true });
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
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

  it('should set fabricanteTablaValid on fabricante event', () => {
    component.tercerosRelacionadosComponent = { markTouched: jest.fn() } as any;
    component.onTableValidEvent('fabricante');
    expect(mockStore.setFormValidity).toHaveBeenCalledWith('fabricanteTablaValid', true);
    expect(component.tercerosRelacionadosComponent.markTouched).toHaveBeenCalled();
  });

  it('should set formuladorTablaValid on formulador event', () => {
    component.tercerosRelacionadosComponent = { markTouched: jest.fn() } as any;
    component.onTableValidEvent('formulador');
    expect(mockStore.setFormValidity).toHaveBeenCalledWith('formuladorTablaValid', true);
  });

  it('should set proveedorTablaValid on proveedor event', () => {
    component.tercerosRelacionadosComponent = { markTouched: jest.fn() } as any;
    component.onTableValidEvent('proveedor');
    expect(mockStore.setFormValidity).toHaveBeenCalledWith('proveedorTablaValid', true);
  });

  it('should call store.setFormValidity for datosEstabelicimientoFormValidityChange', () => {
    component.datosEstabelicimientoFormValidityChange(true);
    expect(mockStore.setFormValidity).toHaveBeenCalledWith('datosEstablecimiento', true);
  });

  it('should call store.setFormValidity for domicilioFormValidityChange', () => {
    component.domicilioFormValidityChange(true);
    expect(mockStore.setFormValidity).toHaveBeenCalledWith('domicilioEstablecimiento', true);
  });

  it('should call store.setFormValidity for manifiestosFormValidityChange', () => {
    component.manifiestosFormValidityChange(true);
    expect(mockStore.setFormValidity).toHaveBeenCalledWith('manifiestos', true);
  });

  it('should call store.setFormValidity for representanteLegalFormValidityChange', () => {
    component.representanteLegalFormValidityChange(true);
    expect(mockStore.setFormValidity).toHaveBeenCalledWith('representanteLegal', true);
  });

  it('validarFormularios should return true when all form fields are valid', () => {
    mockQuery.getValue = jest.fn().mockReturnValue({
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
    const result = component.validarFormularios();
    expect(result).toBe(true);
  });
});