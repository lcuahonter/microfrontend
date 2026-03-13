import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoPagesComponent } from './paso-uno-pages.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ModificacionPermisoMeds } from '../../services/modificacion-permiso-meds.service';
import { of, Subject } from 'rxjs';


// Mock para TIPO_PERSONA
const TIPO_PERSONA = { MORAL_NACIONAL: 'MORAL_NACIONAL' };

describe('PasoUnoComponent', () => {
  let component: PasoUnoPagesComponent;
  let fixture: ComponentFixture<PasoUnoPagesComponent>;
  let consultaQueryMock: any;
  let servicioMock: any;

  beforeEach(async () => {
    consultaQueryMock = {
      selectConsultaioState$: of({ update: false })
    };
    servicioMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ registro: true })),
      getPagoDerechos: jest.fn().mockReturnValue(of({ permiso: true })),
      actualizarEstadoFormulario: jest.fn(),
      actualizarPagoDerechosFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoPagesComponent],
      imports: [ require('@angular/common/http/testing').HttpClientTestingModule],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: ModificacionPermisoMeds, useValue: servicioMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoPagesComponent);
    component = fixture.componentInstance;
    // Mock global para TIPO_PERSONA si es necesario
    (globalThis as any).TIPO_PERSONA = TIPO_PERSONA;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar y suscribirse a selectConsultaioState$ con update=false', () => {
    component.consultaState = undefined as any;
    component.esDatosRespuesta = false;
    consultaQueryMock.selectConsultaioState$ = of({ update: false });
    component.ngOnInit();
    expect(component.consultaState).toEqual({ update: false });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería llamar guardarDatosFormulario si update=true', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario').mockImplementation();
    consultaQueryMock.selectConsultaioState$ = of({ update: true });
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('guardarDatosFormulario no debe actualizar si no hay datos', (done) => {
    servicioMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(null));
    servicioMock.getPagoDerechos.mockReturnValue(of(null));
    const actualizarEstadoSpy = jest.spyOn(servicioMock, 'actualizarEstadoFormulario');
    const actualizarPagoSpy = jest.spyOn(servicioMock, 'actualizarPagoDerechosFormulario');
    component.guardarDatosFormulario();
    setTimeout(() => {
      expect(actualizarEstadoSpy).not.toHaveBeenCalled();
      expect(actualizarPagoSpy).not.toHaveBeenCalled();
      done();
    }, 0);
  });

  it('debería cambiar el índice con seleccionaTab', () => {
    component.indice = 1;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debería limpiar destroyNotifier$ en ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
  
it('guardarDatosFormulario debe actualizar estado y pago si hay datos', (done) => {
  servicioMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of({ registro: true }));
  servicioMock.getPagoDerechos.mockReturnValue(of({ permiso: true }));
  const actualizarEstadoSpy = jest.spyOn(servicioMock, 'actualizarEstadoFormulario');
  const actualizarPagoSpy = jest.spyOn(servicioMock, 'actualizarPagoDerechosFormulario');
  component.guardarDatosFormulario();
  setTimeout(() => {
    expect(actualizarEstadoSpy).toHaveBeenCalledWith({ registro: true });
    expect(actualizarPagoSpy).toHaveBeenCalledWith({ permiso: true });
    expect(component.esDatosRespuesta).toBe(true);
    done();
  }, 0);
});

it('collectFormValues debe recopilar y actualizar todos los datos del formulario', () => {
  // Mocks de componentes hijos y sus valores
  component.solicitanteComponent = { form: { value: { nombre: 'Juan' } } } as any;
  component.datosSolicitudComponents = [{ 
    domicilioEstablecimiento: { value: 'domicilio' },
    solicitudEstablecimientoForm: { value: 'solicitud' },
    scianForm: { value: 'scian' },
    formMercancias: { value: 'mercancias' }
  }] as any;
  component.tercerosRelacionadosComponents = [{
    agregarFacturadorFormGroup: { value: 'facturador' },
    agregarFabricanteFormGroup: { value: 'fabricante' },
    agregarDestinatarioFormGroup: { value: 'destinatario' },
    agregarProveedorFormGroup: { value: 'proveedor' }
  }] as any;
  component.pagoDeDerechosComponents = [{ pagoDerechos: { value: 'pago' } }] as any;
  component.tramitesAsociadosComponents = [{
    acuseTablaDatos: [{
      id: 1,
      folioTramite: 'folio',
      tipoTramite: 'tipo',
      estatus: 'estatus',
      fechaAltaDeRegistro: 'fecha'
    }]
  }] as any;

  const formDataServiceSpy = jest.spyOn(component['formDataService'], 'updateFormData');

  const result = component.collectFormValues();

  expect(result.solicitante).toEqual({ nombre: 'Juan' });
  expect(result.datosSolicitud).toHaveLength(1);
  expect(result.tercerosRelacionados).toHaveLength(1);
  expect(result.pagoDeDerechos).toHaveLength(1);
  expect(result.tramitesAsociados).toHaveLength(1);

  // Verifica que updateFormData se llamó para cada sección
  expect(formDataServiceSpy).toHaveBeenCalledWith('solicitanteData', { nombre: 'Juan' });
  expect(formDataServiceSpy).toHaveBeenCalledWith('completeForm', expect.any(Array));
  expect(formDataServiceSpy).toHaveBeenCalledWith('tercerosRelacionados', expect.any(Array));
  expect(formDataServiceSpy).toHaveBeenCalledWith('pagoDeDerechos', expect.any(Array));
  expect(formDataServiceSpy).toHaveBeenCalledWith('tramitesAsociados', expect.any(Array));
});
});