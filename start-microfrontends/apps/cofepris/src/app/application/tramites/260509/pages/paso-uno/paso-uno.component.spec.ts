import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { DatosDomicilioLegalService } from '../../../../shared/services/datos-domicilio-legal.service';
import { PagoBancoService } from '../../../../shared/services/pago-banco.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite260509Store } from '../../../../estados/tramites/260509/tramite260509.store';
import { Tramite260509Query } from '../../../../estados/queries/260509/tramite260509.query';
import { Shared2605Service } from '../../../../shared/services/shared2605/shared2605.service';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { Subject, of } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let datosDomicilioLegalService: any;
  let pagoBancoService: any;
  let consultaQuery: any;
  let store: any;
  let query: any;
  let sharedSvc: any;
  let state: Record<string, unknown>;

  beforeEach(async () => {
    datosDomicilioLegalService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({})),
      actualizarEstadoFormulario: jest.fn(),
    };
    pagoBancoService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({})),
      actualizarEstadoFormulario: jest.fn(),
    };
    consultaQuery = {
      selectConsultaioState$: of({ update: true }),
    };
    store = {};
    query = {
      getValue: jest.fn().mockReturnValue({
        formValidity: {
          datosEstablecimiento: true,
          domicilioEstablecimiento: true,
          manifiestos: true,
          representanteLegal: true,
          fabricanteTablaValid: true,
          formuladorTablaValid: true,
          proveedorTablaValid: true,
        },
      }),
    };
    sharedSvc = {
      getAllState: jest.fn().mockReturnValue(of({
        claveDeReferencia: 'ref',
        cadenaDependencia: 'dep',
        banco: 'banco',
        llaveDePago: 'llave',
        fechaPago: 'fecha',
        importePago: 'importe',
      })),
    };
    state = {
            claveDeReferencia: '',
      cadenaDependencia: '',
      banco: '',
      llaveDePago: '',
      fechaPago: '',
      importePago: '',
    };
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: DatosDomicilioLegalService, useValue: datosDomicilioLegalService },
        { provide: PagoBancoService, useValue: pagoBancoService },
        { provide: ConsultaioQuery, useValue: consultaQuery },
        { provide: Tramite260509Store, useValue: store },
        { provide: Tramite260509Query, useValue: query },
        { provide: Shared2605Service, useValue: sharedSvc },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    // Mock child components
    component.solicitante = { obtenerTipoPersona: jest.fn() } as any;
    component.datosSolicitudComponent = {} as any;
    component.tercerosRelacionadosFabricanteComponent = {} as any;
    component.pagoDerechosComponent = { markTouched: jest.fn() } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtenerTipoPersona in ngAfterViewInit', () => {
    component.solicitante.obtenerTipoPersona = jest.fn();
    component.ngAfterViewInit();
    expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
  });

  it('should set indice when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should subscribe and call guardarDatosFormulario in ngOnInit if update is true', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta true in ngOnInit if update is false', () => {
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call actualizarEstadoFormulario in guardarDatosFormulario', () => {
    component.guardarDatosFormulario();
    expect(datosDomicilioLegalService.actualizarEstadoFormulario).toHaveBeenCalled();
    expect(pagoBancoService.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should validate formularios and return true', () => {
    expect(component.validarFormularios()).toBe(true);
  });

  it('should validate formularios and return false if any validity is false', () => {
    query.getValue.mockReturnValue({ formValidity: { datosEstablecimiento: false } });
    expect(component.validarFormularios()).toBe(false);
  });

  it('should validate pago derechos and return true', () => {
    state = {
      claveDeReferencia: 'ref',
      cadenaDependencia: 'dep',
      banco: 'banco',
      llaveDePago: 'llave',
      fechaPago: 'fecha',
      importePago: 'importe',
    };
    //component.sharedSvc = sharedSvc;
    expect(component.validarPagoDerechos()).toBe(true);
  });

  it('should call markTouched and return false if pago derechos is invalid', () => {
  state = {
      claveDeReferencia: '',
      cadenaDependencia: '',
      banco: '',
      llaveDePago: '',
      fechaPago: '',
      importePago: '',
    };
    //component.sharedSvc = sharedSvc;
    expect(component.validarPagoDerechos()).toBe(false);
    expect(component.pagoDerechosComponent.markTouched).toHaveBeenCalled();
  });

  it('should not throw if pagoDerechosComponent is missing in validarPagoDerechos', () => {
    state = {
      claveDeReferencia: '',
      cadenaDependencia: '',
      banco: '',
      llaveDePago: '',
      fechaPago: '',
      importePago: '',
    };
    component.pagoDerechosComponent = undefined as any;
    expect(() => component.validarPagoDerechos()).not.toThrow();
  });

  it('should not throw if destroyNotifier$ is missing in ngOnDestroy', () => {
    const original = component.destroyNotifier$;
    component.destroyNotifier$ = undefined as any;
    expect(() => component.ngOnDestroy()).not.toThrow();
    component.destroyNotifier$ = original;
  });
});
