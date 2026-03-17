import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { TercerosRelacionadoComponent } from './tercerosRelacionado.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Componente TercerosRelacionado', () => {
  let component: TercerosRelacionadoComponent;
  let fixture: ComponentFixture<TercerosRelacionadoComponent>;

 
  let mockService: any;
  let mockExportacionStore: any;
  let mockExportacionQuery: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockService = {
      obtenerRadio: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Fisica' }])),
      obtenerTabla: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Prod' }])),
      obtenerDatosLocalidad: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Loc' }])),
    };
    mockExportacionStore = {
      setTipoPersona: jest.fn(),
      setNombre: jest.fn(),
      setApellidoPrimer: jest.fn(),
      setApellidoSegundo: jest.fn(),
      setDenominacionRazonSocial: jest.fn(),
      setEstadoLocalidad: jest.fn(),
      setCodPostal1: jest.fn(),
      setCalle: jest.fn(),
      setNumExterior: jest.fn(),
      setNumInterior: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setCorreoElectronico: jest.fn(),
    };
    mockExportacionQuery = {
      selectSolicitud$: of({
        tipoPersona: 'fisica',
        nombre: 'Juan',
        apellidoPrimer: 'Perez',
        apellidoSegundo: 'Gomez',
        denominacionRazonSocial: 'Empresa',
        estadoLocalidad: 'Estado',
        codPostal1: '12345',
        calle: 'Calle',
        numExterior: '10',
        numInterior: '2',
        lada: '55',
        telefono: '1234567890',
        correoElectronico: 'test@mail.com'
      })
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TercerosRelacionadoComponent,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: 'ExportacionService', useValue: mockService },
        { provide: 'ExportacionStore', useValue: mockExportacionStore },
        { provide: 'ExportacionQuery', useValue: mockExportacionQuery },
        { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery },
      ],
    })
      .overrideComponent(TercerosRelacionadoComponent, {
        set: {
          providers: [
            { provide: FormBuilder, useValue: new FormBuilder() },
            { provide: 'ExportacionService', useValue: mockService },
            { provide: 'ExportacionStore', useValue: mockExportacionStore },
            { provide: 'ExportacionQuery', useValue: mockExportacionQuery },
            { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery },
          ]
        }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TercerosRelacionadoComponent);
    component = fixture.componentInstance;
    // Patch the injected services
    (component as any).service = mockService;
    (component as any).exportacionStore = mockExportacionStore;
    (component as any).exportacionQuery = mockExportacionQuery;
    (component as any).consultaioQuery = mockConsultaioQuery;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar y llamar todos los métodos de carga en ngOnInit', () => {
    const loadMercanciasSpy = jest.spyOn(component, 'loadMercancias');
    const loadLocalidadSpy = jest.spyOn(component, 'loadLocalidad');
    const getFacturatorSpy = jest.spyOn(component, 'getFacturator');
    const cargarRadioSpy = jest.spyOn(component, 'cargarRadio');
    const inicializarEstadoFormularioSpy = jest.spyOn(component, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(loadMercanciasSpy).toHaveBeenCalled();
    expect(loadLocalidadSpy).toHaveBeenCalled();
    expect(getFacturatorSpy).toHaveBeenCalled();
    expect(cargarRadioSpy).toHaveBeenCalled();
    expect(inicializarEstadoFormularioSpy).toHaveBeenCalled();
  });

  it('debería llamar a guardarDatosFormulario si esFormularioSoloLectura es true en inicializarEstadoFormulario', () => {
    component.esFormularioSoloLectura = true;
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('debería llamar a getFacturator si esFormularioSoloLectura es false en inicializarEstadoFormulario', () => {
    component.esFormularioSoloLectura = false;
    const getFacturatorSpy = jest.spyOn(component, 'getFacturator');
    component.inicializarEstadoFormulario();
    expect(getFacturatorSpy).toHaveBeenCalled();
  });

  it('guardarDatosFormulario deshabilita el formulario si esFormularioSoloLectura es true', () => {
    component.getFacturator = jest.fn(() => {
      component.facturatorForm = new FormBuilder().group({ test: [''] });
      component.facturatorForm.enable();
    }) as any;
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.facturatorForm.disabled).toBe(true);
  });

  it('guardarDatosFormulario habilita el formulario si esFormularioSoloLectura es false', () => {
    component.getFacturator = jest.fn(() => {
      component.facturatorForm = new FormBuilder().group({ test: [''] });
      component.facturatorForm.disable();
    }) as any;
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.facturatorForm.enabled).toBe(true);
  });

  it('guardarDatosFormulario no hace nada si esFormularioSoloLectura no es ni true ni false', () => {
    component.getFacturator = jest.fn(() => {
      component.facturatorForm = new FormBuilder().group({ test: [''] });
      component.facturatorForm.enable();
    }) as any;
    (component as any).esFormularioSoloLectura = undefined;
    component.guardarDatosFormulario();
    expect(component.facturatorForm.enabled).toBe(true);
  });

  it('debería establecer tipoPersonaOptions en cargarRadio', () => {
    component.tipoPersonaOptions = [];
    component.cargarRadio();
    expect(component.tipoPersonaOptions.length).toBeGreaterThan(0);
  });

  it('debería establecer tercerosProd en loadMercancias', () => {
    component.tercerosProd = [];
    component.loadMercancias();
    expect(component.tercerosProd.length).toBeGreaterThan(0);
  });

  it('debería establecer localidadList en loadLocalidad', () => {
    component.localidadList = [];
    component.loadLocalidad();
    expect(component.localidadList.length).toBeGreaterThan(0);
  });

  it('debería abrir el modal y llamar a getFacturator en abrirModalfacurator', () => {
    component.getFacturator = jest.fn();
    component.abrirModalfacurator();
    expect(component.modal).toBe('show');
    expect(component.getFacturator).toHaveBeenCalled();
  });

  it('debería inicializar facturatorForm en getFacturator', () => {
    component.getFacturator();
    expect(component.facturatorForm).toBeDefined();
    expect(component.facturatorForm.get('nombre')).toBeDefined();
  });

  it('debería establecer fisica y moral correctamente en inputChecked', () => {
    component.inputChecked('fisica');
    expect(component.fisica).toBe(true);
    expect(component.moral).toBe(false);
    component.inputChecked('moral');
    expect(component.fisica).toBe(false);
    expect(component.moral).toBe(true);
  });

  it('debería llamar a inputChecked en cambiarRadioFisica', () => {
    const spy = jest.spyOn(component, 'inputChecked');
    component.cambiarRadioFisica('fisica');
    expect(spy).toHaveBeenCalledWith('fisica');
  });

  it('debería completar destroyed$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
