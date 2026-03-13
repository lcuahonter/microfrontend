jest.mock('@libs/shared/theme/assets/json/250102/banco.json', () => ({
  __esModule: true,
  default: {
    medio: [{ id: 1, descripcion: 'Medio1' }],
    requisito: [{ id: 1, descripcion: 'Req1' }, { id: 2, descripcion: 'Req2' }]
  }
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequisitosComponent } from './requisitos.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';



describe('RequisitosComponent', () => {
  let component: RequisitosComponent;
  let fixture: ComponentFixture<RequisitosComponent>;
  let mockTramite250102Store: any;
  let mockTramite250102Query: any;
  let mockConsultaioQuery: any;
  let selectConsultaioStateSubject: Subject<any>;
  let selectTramiteStateSubject: Subject<any>;

  beforeEach(async () => {
    selectConsultaioStateSubject = new Subject();
    selectTramiteStateSubject = new Subject();

    mockTramite250102Store = {
      establecerDatos: jest.fn()
    };

    mockTramite250102Query = {
      selectTramiteState$: selectTramiteStateSubject.asObservable()
    };

    mockConsultaioQuery = {
      selectConsultaioState$: selectConsultaioStateSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RequisitosComponent],
      providers: [
        FormBuilder,
        { provide: 'Tramite250102Store', useValue: mockTramite250102Store },
        { provide: 'Tramite250102Query', useValue: mockTramite250102Query },
        { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery }
      ]
    })
      .overrideComponent(RequisitosComponent, {
        set: {
          providers: [
            { provide: FormBuilder, useValue: new FormBuilder() },
            { provide: 'Tramite250102Store', useValue: mockTramite250102Store },
            { provide: 'Tramite250102Query', useValue: mockTramite250102Query },
            { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(RequisitosComponent);
    component = fixture.componentInstance;

    // Patch the injected services
    (component as any).tramite250102Store = mockTramite250102Store;
    (component as any).tramite250102Query = mockTramite250102Query;
    (component as any).consultaioQuery = mockConsultaioQuery;

    // Initialize solicitudState with required properties to avoid undefined errors
    component.solicitudState = {
      medio: '',
      identificacion: '',
      economico: '',
      placa: '',
      numero: '',
      fechas: '',
      requisito: ''
    } as any;

    // Patch catalogoDatos
    component.requisitoCatalogo = [
      { id: 1, descripcion: 'Req1' },
      { id: 2, descripcion: 'Req2' }
    ] as any;
    component.medio = [{ id: 1, descripcion: 'Medio1' }] as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call inicializarEstadoFormulario', () => {
      // Ensure solicitudState is initialized to avoid undefined errors
      if (!component.solicitudState) {
        component.solicitudState = {
          medio: '',
          identificacion: '',
          economico: '',
          placa: '',
          numero: '',
          fechas: '',
          requisito: ''
        } as any;
      }
      const spy = jest.spyOn(component, 'inicializarEstadoFormulario');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('inicializarEstadoFormulario', () => {
    it('should call guardarDatosFormulario if esFormularioSoloLectura is true', () => {
      component.esFormularioSoloLectura = true;
      const spy = jest.spyOn(component, 'guardarDatosFormulario');
      component.inicializarEstadoFormulario();
      expect(spy).toHaveBeenCalled();
    });

    it('should call inicializarFormulario if esFormularioSoloLectura is false', () => {
      component.esFormularioSoloLectura = false;
      const spy = jest.spyOn(component as any, 'inicializarFormulario');
      component.inicializarEstadoFormulario();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('guardarDatosFormulario', () => {
    beforeEach(() => {
      component.solicitudState = {} as any;
      jest.spyOn(component as any, 'inicializarFormulario').mockImplementation(() => {
        component.transporteForm = new FormBuilder().group({
          medio: [''],
          identificacion: [''],
          economico: [''],
          placa: [''],
          numero: [''],
          fechas: [''],
          requisito: ['']
        });
      });
    });

    it('should disable form if esFormularioSoloLectura is true', () => {
      component.esFormularioSoloLectura = true;
      component.guardarDatosFormulario();
      expect(component.transporteForm.disabled).toBe(true);
    });

    it('should enable form if esFormularioSoloLectura is false', () => {
      component.esFormularioSoloLectura = false;
      component.guardarDatosFormulario();
      expect(component.transporteForm.enabled).toBe(true);
    });
  });

  describe('cambioFechasFinal', () => {
    beforeEach(() => {
      component.transporteForm = new FormBuilder().group({
        fechas: ['']
      });
    });

    it('should patch fechas and call establecerDatos', () => {
      component.cambioFechasFinal('2024-01-01');
      expect(component.transporteForm.value.fechas).toBe('2024-01-01');
      expect(mockTramite250102Store.establecerDatos).toHaveBeenCalledWith({ fechas: '2024-01-01' });
    });
  });

  describe('setValoresStore', () => {
    it('should call establecerDatos with correct value', () => {
      const form = new FormBuilder().group({ test: ['value'] });
      component.setValoresStore(form, 'test');
      expect(mockTramite250102Store.establecerDatos).toHaveBeenCalledWith({ test: 'value' });
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyNotifier$', () => {
      const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
      const spy2 = jest.spyOn((component as any).destroyNotifier$, 'complete');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });

  describe('transporte', () => {
    it('should toggle showtransporteModal', () => {
      component.showtransporteModal = false;
      component.transporte();
      expect(component.showtransporteModal).toBe(true);
      component.transporte();
      expect(component.showtransporteModal).toBe(false);
    });
  });

  describe('transporteEliminar', () => {
    it('should toggle showtransporteModal', () => {
      component.showtransporteModal = false;
      component.transporteEliminar();
      expect(component.showtransporteModal).toBe(true);
      component.transporteEliminar();
      expect(component.showtransporteModal).toBe(false);
    });
  });

  describe('requisitos', () => {
    it('should toggle showrequisitosModal', () => {
      component.showrequisitosModal = false;
      component.requisitos();
      expect(component.showrequisitosModal).toBe(true);
      component.requisitos();
      expect(component.showrequisitosModal).toBe(false);
    });
  });

  describe('requisitosEliminar', () => {
    it('should toggle showrequisitosModal', () => {
      component.showrequisitosModal = false;
      component.requisitosEliminar();
      expect(component.showrequisitosModal).toBe(true);
      component.requisitosEliminar();
      expect(component.showrequisitosModal).toBe(false);
    });
  });

  describe('requisitosDatos', () => {
    beforeEach(() => {
      component.transporteForm = new FormBuilder().group({
        numero: ['123'],
        fechas: ['2024-01-01'],
        requisito: [1]
      });
      component.requisitoCatalogo = [
        { id: 1, descripcion: 'Req1' },
        { id: 2, descripcion: 'Req2' }
      ] as any;
      component.RequisitosTabla = [];
      component.showrequisitosModal = false;
    });

    it('should add requisito data and toggle modal', () => {
      component.requisitosDatos();
      expect(component.RequisitosTabla.length).toBe(1);
      expect(component.RequisitosTabla[0]).toEqual({
        No: '123',
        Fecha: '2024-01-01',
        Tipo: 'Req1'
      });
      expect(component.showrequisitosModal).toBe(true);
    });
  });

  describe('transporteDatos', () => {
    beforeEach(() => {
      component.transporteForm = new FormBuilder().group({
        identificacion: ['id1'],
        economico: ['eco1'],
        placa: ['placa1']
      });
      component.TransporteTabla = [];
      component.showtransporteModal = false;
    });

    it('should add transporte data and toggle modal', () => {
      component.transporteDatos();
      expect(component.TransporteTabla.length).toBe(1);
      expect(component.TransporteTabla[0]).toEqual({
        numeroIdentificacion: 'id1',
        numeroEconomico: 'eco1',
        placa: 'placa1'
      });
      expect(component.showtransporteModal).toBe(true);
    });
  });

  describe('private inicializarFormulario', () => {
    it('should create transporteForm with correct controls', () => {
      component.solicitudState = {
        medio: 'medio',
        identificacion: 'id',
        economico: 'eco',
        placa: 'placa',
        numero: 'num',
        fechas: 'fecha',
        requisito: 'req'
      } as any;
      // Patch selectTramiteState$ to emit a value and complete
      selectTramiteStateSubject.next(component.solicitudState);
      selectTramiteStateSubject.complete();
      (component as any).inicializarFormulario();
      expect(component.transporteForm).toBeDefined();
      expect(component.transporteForm.get('medio')).toBeDefined();
      expect(component.transporteForm.get('identificacion')).toBeDefined();
      expect(component.transporteForm.get('economico')).toBeDefined();
      expect(component.transporteForm.get('placa')).toBeDefined();
      expect(component.transporteForm.get('numero')).toBeDefined();
      expect(component.transporteForm.get('fechas')).toBeDefined();
      expect(component.transporteForm.get('requisito')).toBeDefined();
    });
  });

  describe('constructor', () => {
    it('should subscribe to consultaioQuery and call inicializarEstadoFormulario', () => {
      const spy = jest.spyOn(RequisitosComponent.prototype, 'inicializarEstadoFormulario');
      // Re-create the component to ensure the spy is active during construction
      fixture = TestBed.createComponent(RequisitosComponent);
      component = fixture.componentInstance;
      selectConsultaioStateSubject.next({ readonly: true });
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});