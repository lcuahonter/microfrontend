import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonaFisicaExtranjeraComponent } from './persona-fisica-extranjera.component';
import { Tramite40201Store } from '../../../../core/estados/tramites/tramite40201.store';
import { Tramite40201Query } from '../../../../core/queries/tramite40201.query';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { PersonaFisicaExtranjeraForm } from '../../models/transportacion-maritima.model';
import { TransportacionMaritima40201State} from '../../../../core/estados/tramites/tramite40201.store'


describe('PersonaFisicaExtranjeraComponent', () => {
  let component: PersonaFisicaExtranjeraComponent;
  let fixture: ComponentFixture<PersonaFisicaExtranjeraComponent>;
  let mockTramite40201Store: jest.Mocked<Tramite40201Store>;
  let mockTramite40201Query: jest.Mocked<Tramite40201Query>;
  let mockTransportacionMaritimaService: jest.Mocked<TransportacionMaritimaService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let formBuilder: FormBuilder;

  const mockState: Partial<TransportacionMaritima40201State> = {
    seguroNumero: '12345678901',
    nombrePFE: 'John',
    apellidoPaternoPFE: 'Doe',
    apellidoMaternoPFE: 'Smith',
    correoPFE: 'john.doe@example.com',
    paisPFE: '1',
    codigoPostalPFE: '12345',
    ciudadPFE: 'New York',
    estadoPFE: 'NY',
    callePFE: 'Main St',
    numeroExteriorPFE: '123',
    numeroInteriorPFE: 'Apt 4',
    personaFisicaExtranjeraTabla: []
  };

  const mockCatalogo = [
    { id: 1, descripcion: 'USA' },
    { id: 2, descripcion: 'Canada' }
  ];

  beforeEach(waitForAsync(() => {
    mockTramite40201Store = {
      setTramite40201State: jest.fn(),
      update: jest.fn()
    } as any;

    mockTramite40201Query = {
      selectSeccionState$: new BehaviorSubject(mockState)
    } as any;

    mockTransportacionMaritimaService = {
      getPaisCatalogo: jest.fn().mockReturnValue(of({ data: mockCatalogo }))
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: new BehaviorSubject({ readonly: false })
    } as any;

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PersonaFisicaExtranjeraComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite40201Store, useValue: mockTramite40201Store },
        { provide: Tramite40201Query, useValue: mockTramite40201Query },
        { provide: TransportacionMaritimaService, useValue: mockTransportacionMaritimaService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaFisicaExtranjeraComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize catalogs on ngOnInit', () => {
    jest.spyOn(component, 'inicializaCatalogos');
    component.ngOnInit();
    expect(component.inicializaCatalogos).toHaveBeenCalled();
    expect(mockTransportacionMaritimaService.getPaisCatalogo).toHaveBeenCalled();
    expect(component.pais).toEqual(mockCatalogo);
  });

  it('should initialize form and subscribe to state changes on ngOnInit', () => {
    jest.spyOn(component, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
    expect(component.transportacionMaritimaState).toEqual(mockState);
    expect(component.personaFisicaExtranjeraTabla).toEqual(mockState.personaFisicaExtranjeraTabla);
  });

  it('should create the personaFisicaExtranjeraForm with correct controls', () => {
    component.crearAgregarPFEForm();
    const form = component.personaFisicaExtranjeraForm;
    expect(form).toBeDefined();
    expect(form.get('seguroNumero')).toBeDefined();
    expect(form.get('nombrePFE')).toBeDefined();
    expect(form.get('apellidoPaternoPFE')).toBeDefined();
    expect(form.get('apellidoMaternoPFE')).toBeDefined();
    expect(form.get('correoPFE')).toBeDefined();
    expect(form.get('paisPFE')).toBeDefined();
    expect(form.get('codigoPostalPFE')).toBeDefined();
    expect(form.get('ciudadPFE')).toBeDefined();
    expect(form.get('estadoPFE')).toBeDefined();
    expect(form.get('callePFE')).toBeDefined();
    expect(form.get('numeroExteriorPFE')).toBeDefined();
    expect(form.get('numeroInteriorPFE')).toBeDefined();
  });

  it('should initialize form with state values', () => {
    component.transportacionMaritimaState = mockState as TransportacionMaritima40201State;
    component.crearAgregarPFEForm();
    const expectedFormValue = {
      seguroNumero: '12345678901',
      nombrePFE: 'John',
      apellidoPaternoPFE: 'Doe',
      apellidoMaternoPFE: 'Smith',
      correoPFE: 'john.doe@example.com',
      paisPFE: '1',
      codigoPostalPFE: '12345',
      ciudadPFE: 'New York',
      estadoPFE: 'NY',
      callePFE: 'Main St',
      numeroExteriorPFE: '123',
      numeroInteriorPFE: 'Apt 4'
    };
    expect(component.personaFisicaExtranjeraForm.value).toEqual(expectedFormValue);
  });



  it('should add a new PFE to the table and update store', () => {
    component.pais = mockCatalogo;
    component.personaFisicaExtranjeraForm = formBuilder.group({
      seguroNumero: '12345678901',
      nombrePFE: 'John',
      apellidoPaternoPFE: 'Doe',
      apellidoMaternoPFE: 'Smith',
      correoPFE: 'john.doe@example.com',
      paisPFE: '1',
      codigoPostalPFE: '12345',
      ciudadPFE: 'New York',
      estadoPFE: 'NY',
      callePFE: 'Main St',
      numeroExteriorPFE: '123',
      numeroInteriorPFE: 'Apt 4'
    });

    const formData: PersonaFisicaExtranjeraForm = component.personaFisicaExtranjeraForm.value;
    component.agregarPFE(formData);

    const expectedTableEntry = {
      nombrePFE: 'John Doe Smith',
      seguroNumero: '12345678901',
      estadoPFE: 'NY',
      correoPFE: 'john.doe@example.com',
      paisPFE: 'USA',
      domicilioPFE: 'Main St 123 New York NY USA 12345'
    };

    expect(component.personaFisicaExtranjeraTabla).toContainEqual(expectedTableEntry);
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({
      personaFisicaExtranjeraTabla: [expectedTableEntry]
    });
    expect(component.personaFisicaExtranjeraForm.pristine).toBeTruthy();
  });

  it('should reset form and update store on limpiarDatosPFE', () => {
    component.personaFisicaExtranjeraForm = formBuilder.group({
      seguroNumero: '12345678901',
      nombrePFE: 'John',
      apellidoPaternoPFE: 'Doe',
      apellidoMaternoPFE: 'Smith',
      correoPFE: 'john.doe@example.com',
      paisPFE: '1',
      codigoPostalPFE: '12345',
      ciudadPFE: 'New York',
      estadoPFE: 'NY',
      callePFE: 'Main St',
      numeroExteriorPFE: '123',
      numeroInteriorPFE: 'Apt 4'
    });

    jest.spyOn(component, 'actualizarFormularioState');
    component.limpiarDatosPFE();

    expect(component.personaFisicaExtranjeraForm.pristine).toBeTruthy();
    expect(component.personaFisicaExtranjeraForm.value).toEqual({
      seguroNumero: null,
      nombrePFE: null,
      apellidoPaternoPFE: null,
      apellidoMaternoPFE: null,
      correoPFE: null,
      paisPFE: null,
      codigoPostalPFE: null,
      ciudadPFE: null,
      estadoPFE: null,
      callePFE: null,
      numeroExteriorPFE: null,
      numeroInteriorPFE: null
    });
    expect(component.actualizarFormularioState).toHaveBeenCalled();
  });

  it('should close modal when cerrarModal is called', () => {
    const mockElement = { click: jest.fn() };
    component.closeModal = { nativeElement: mockElement } as any;
    component.cerrarModal();
    expect(mockElement.click).toHaveBeenCalled();
  });

  it('should update store with form values on actualizarFormularioState', () => {
    component.personaFisicaExtranjeraForm = formBuilder.group({
      seguroNumero: '12345678901',
      nombrePFE: 'John',
      apellidoPaternoPFE: 'Doe',
      apellidoMaternoPFE: 'Smith',
      correoPFE: 'john.doe@example.com',
      paisPFE: '1',
      codigoPostalPFE: '12345',
      ciudadPFE: 'New York',
      estadoPFE: 'NY',
      callePFE: 'Main St',
      numeroExteriorPFE: '123',
      numeroInteriorPFE: 'Apt 4'
    });

    component.actualizarFormularioState();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith(component.personaFisicaExtranjeraForm.value);
  });

  it('should update store with field value on setValoresStore', () => {
    const form = formBuilder.group({
      seguroNumero: '12345678901'
    });
    component.setValoresStore(form, 'seguroNumero');
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ seguroNumero: '12345678901' });
  });

  it('should unsubscribe from observables on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destruirNotificador$'], 'next');
    const completeSpy = jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should validate form fields', () => {
    component.crearAgregarPFEForm();
    const form = component.personaFisicaExtranjeraForm;

    form.patchValue({
      seguroNumero: '',
      nombrePFE: '',
      apellidoPaternoPFE: '',
      apellidoMaternoPFE: '',
      correoPFE: '',
      paisPFE: '',
      codigoPostalPFE: '',
      ciudadPFE: '',
      estadoPFE: '',
      callePFE: '',
      numeroExteriorPFE: ''
    });
    expect(form.valid).toBeFalsy();
    expect(form.get('seguroNumero')?.hasError('required')).toBeTruthy();

    form.patchValue({
      seguroNumero: '123456789012',
      nombrePFE: 'a'.repeat(201)
    });
    expect(form.get('seguroNumero')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('nombrePFE')?.hasError('maxlength')).toBeTruthy();
  });

  it('should initialize paisSeleccion and update store on form value change', () => {
    component.personaFisicaExtranjeraForm = formBuilder.group({
      paisPFE: '1'
    });
    component.paisSeleccion();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ paisPFE: '1' });
  });
});