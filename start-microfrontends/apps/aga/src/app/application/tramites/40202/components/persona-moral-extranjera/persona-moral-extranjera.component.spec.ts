import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonaMoralExtranjeraComponent } from './persona-moral-extranjera.component';
import { Tramite40201Store } from '../../../../core/estados/tramites/tramite40201.store';
import { Tramite40201Query } from '../../../../core/queries/tramite40201.query';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { PersonaMoralExtranjeraForm} from '../../models/transportacion-maritima.model';
import { TransportacionMaritima40201State } from '../../../../core/estados/tramites/tramite40201.store';
import { CONFIGURACION_PARA_PME_ENCABEZADO_DE_TABLA, TEXTOS } from '../../constantes/transportacion-maritima.enum';
import { By } from '@angular/platform-browser';

describe('PersonaMoralExtranjeraComponent', () => {
  let component: PersonaMoralExtranjeraComponent;
  let fixture: ComponentFixture<PersonaMoralExtranjeraComponent>;
  let mockTramite40201Store: jest.Mocked<Tramite40201Store>;
  let mockTramite40201Query: jest.Mocked<Tramite40201Query>;
  let mockTransportacionMaritimaService: jest.Mocked<TransportacionMaritimaService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let formBuilder: FormBuilder;

  const mockState: TransportacionMaritima40201State = {
    denominacionPME: 'Empresa Extranjera SA',
    correoPME: 'contacto@empresa.com',
    paisPME: '1',
    codigoPostalPME: '12345',
    ciudadPME: 'Ciudad Extranjera',
    estadoPME: 'Estado Extranjero',
    callePME: 'Calle Principal',
    numeroExteriorPME: '123',
    numeroInteriorPME: 'A1',
    nombreDG: 'Juan',
    apellidoPaternoDG: 'Pérez',
    apellidoMaternoDG: 'Gómez',
    personaMoralExtranjeraTabla: [],
    buscarRfcPFN: '',
    rfcPFN: '',
    nombrePFN: '',
    apellidoPaternoPFN: '',
    apellidoMaternoPFN: '',
    paisPFN: '',
  };

  const mockCatalogos = {
    pais: [{ id: 1, descripcion: 'País Extranjero' }]
  };

  beforeEach(waitForAsync(() => {
    mockTramite40201Store = {
      setTramite40201State: jest.fn(),
      update: jest.fn()
    } as any;

    mockTramite40201Query = {
      selectSeccionState$: new BehaviorSubject(mockState)
    } as any;

    mockTransportacionMaritimaService = {
      getPaisCatalogo: jest.fn().mockReturnValue(of({ data: mockCatalogos.pais }))
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: new BehaviorSubject({ readonly: false })
    } as any;

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PersonaMoralExtranjeraComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite40201Store, useValue: mockTramite40201Store },
        { provide: Tramite40201Query, useValue: mockTramite40201Query },
        { provide: TransportacionMaritimaService, useValue: mockTransportacionMaritimaService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaMoralExtranjeraComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize catalogs on ngOnInit', waitForAsync(() => {
    jest.spyOn(component, 'inicializaCatalogos');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.inicializaCatalogos).toHaveBeenCalled();
      expect(mockTransportacionMaritimaService.getPaisCatalogo).toHaveBeenCalled();
      expect(component.pais).toEqual(mockCatalogos.pais);
    });
  }));

  it('should initialize form and subscribe to state changes on ngOnInit', waitForAsync(() => {
    jest.spyOn(component, 'inicializarEstadoFormulario');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
      expect(component.transportacionMaritimaState).toEqual(mockState);
      expect(component.personaMoralExtranjeraTabla).toEqual(mockState.personaMoralExtranjeraTabla);
    });
  }));

  it('should create the personaMoralExtranjeraForm with correct controls', () => {
    component.crearAgregarPMNForm();
    const form = component.personaMoralExtranjeraForm;
    expect(form).toBeDefined();
    expect(form.get('denominacionPME')).toBeDefined();
    expect(form.get('correoPME')).toBeDefined();
    expect(form.get('paisPME')).toBeDefined();
    expect(form.get('codigoPostalPME')).toBeDefined();
    expect(form.get('ciudadPME')).toBeDefined();
    expect(form.get('estadoPME')).toBeDefined();
    expect(form.get('callePME')).toBeDefined();
    expect(form.get('numeroExteriorPME')).toBeDefined();
    expect(form.get('numeroInteriorPME')).toBeDefined();
    expect(form.get('nombreDG')).toBeDefined();
    expect(form.get('apellidoPaternoDG')).toBeDefined();
    expect(form.get('apellidoMaternoDG')).toBeDefined();
  });

  it('should initialize form with state values', () => {
    component.transportacionMaritimaState = mockState;
    component.crearAgregarPMNForm();
    const expectedFormValue = {
      denominacionPME: 'Empresa Extranjera SA',
      correoPME: 'contacto@empresa.com',
      paisPME: '1',
      codigoPostalPME: '12345',
      ciudadPME: 'Ciudad Extranjera',
      estadoPME: 'Estado Extranjero',
      callePME: 'Calle Principal',
      numeroExteriorPME: '123',
      numeroInteriorPME: 'A1',
      nombreDG: 'Juan',
      apellidoPaternoDG: 'Pérez',
      apellidoMaternoDG: 'Gómez'
    };
    expect(component.personaMoralExtranjeraForm.value).toEqual(expectedFormValue);
  });

  it('should disable form when esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.crearAgregarPMNForm();
  });

  it('should enable form when esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.crearAgregarPMNForm();
  });

  it('should add a new PME to the table and update store', () => {

    jest.spyOn(component, 'inicializaCatalogos').mockImplementation(() => {
      component.pais = mockCatalogos.pais;
    });
    component.inicializaCatalogos();

    component.personaMoralExtranjeraForm = formBuilder.group({
      denominacionPME: 'Empresa Extranjera SA',
      correoPME: 'contacto@empresa.com',
      paisPME: '1',
      codigoPostalPME: '12345',
      ciudadPME: 'Ciudad Extranjera',
      estadoPME: 'Estado Extranjero',
      callePME: 'Calle Principal',
      numeroExteriorPME: '123',
      numeroInteriorPME: 'A1',
      nombreDG: 'Juan',
      apellidoPaternoDG: 'Pérez',
      apellidoMaternoDG: 'Gómez'
    });

    const formData: PersonaMoralExtranjeraForm = component.personaMoralExtranjeraForm.value;
    component.agregarPME(formData);

    const expectedTableEntry = {
      denominacionPME: 'Empresa Extranjera SA',
      correoPME: 'contacto@empresa.com',
      paisPME: 'País Extranjero',
      codigoPostalPME: '12345',
      estadoPME: 'Estado Extranjero',
      nombreDG: 'Juan Pérez Gómez',
      domicilioPME: 'Calle Principal 123 Estado Extranjero País Extranjero 12345'
    };

    expect(component.personaMoralExtranjeraTabla).toContainEqual(expectedTableEntry);
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({
      personaMoralExtranjeraTabla: [expectedTableEntry]
    });
    expect(component.personaMoralExtranjeraForm.pristine).toBeTruthy();
  });

  it('should update store with form values on actualizarFormularioState', () => {
    component.personaMoralExtranjeraForm = formBuilder.group({
      denominacionPME: 'Empresa Extranjera SA',
      correoPME: 'contacto@empresa.com',
      paisPME: '1',
      codigoPostalPME: '12345',
      ciudadPME: 'Ciudad Extranjera',
      estadoPME: 'Estado Extranjero',
      callePME: 'Calle Principal',
      numeroExteriorPME: '123',
      numeroInteriorPME: 'A1',
      nombreDG: 'Juan',
      apellidoPaternoDG: 'Pérez',
      apellidoMaternoDG: 'Gómez'
    });

    component.actualizarFormularioState();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith(component.personaMoralExtranjeraForm.value);
  });

  it('should reset form and update store on limpiarDatosPME', () => {
    component.personaMoralExtranjeraForm = formBuilder.group({
      denominacionPME: 'Empresa Extranjera SA',
      correoPME: 'contacto@empresa.com',
      paisPME: '1',
      codigoPostalPME: '12345',
      ciudadPME: 'Ciudad Extranjera',
      estadoPME: 'Estado Extranjero',
      callePME: 'Calle Principal',
      numeroExteriorPME: '123',
      numeroInteriorPME: 'A1',
      nombreDG: 'Juan',
      apellidoPaternoDG: 'Pérez',
      apellidoMaternoDG: 'Gómez'
    });

    jest.spyOn(component, 'actualizarFormularioState');
    component.limpiarDatosPME();

    expect(component.personaMoralExtranjeraForm.pristine).toBeTruthy();
    expect(component.personaMoralExtranjeraForm.value).toEqual({
      denominacionPME: null,
      correoPME: null,
      paisPME: null,
      codigoPostalPME: null,
      ciudadPME: null,
      estadoPME: null,
      callePME: null,
      numeroExteriorPME: null,
      numeroInteriorPME: null,
      nombreDG: null,
      apellidoPaternoDG: null,
      apellidoMaternoDG: null
    });
    expect(component.actualizarFormularioState).toHaveBeenCalled();
  });

  it('should close modal when cerrarModal is called', () => {
    const mockElement = { click: jest.fn() };
    component.closeModal = { nativeElement: mockElement } as any;
    component.cerrarModal();
    expect(mockElement.click).toHaveBeenCalled();
  });

  it('should update store with field value on setValoresStore', () => {
    const form = formBuilder.group({
      denominacionPME: 'Empresa Extranjera SA'
    });
    component.setValoresStore(form, 'denominacionPME');
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ denominacionPME: 'Empresa Extranjera SA' });
  });

  it('should update store on paisSeleccion', () => {
    component.personaMoralExtranjeraForm = formBuilder.group({
      paisPME: '1'
    });
    component.paisSeleccion();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ paisPME: '1' });
  });

  it('should unsubscribe from observables on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destruirNotificador$'], 'next');
    const completeSpy = jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should validate form fields', () => {
    component.crearAgregarPMNForm();
    const form = component.personaMoralExtranjeraForm;

    form.patchValue({
      denominacionPME: '',
      correoPME: '',
      paisPME: '',
      codigoPostalPME: '',
      ciudadPME: '',
      estadoPME: '',
      callePME: '',
      numeroExteriorPME: '',
      numeroInteriorPME: '',
      nombreDG: '',
      apellidoPaternoDG: '',
      apellidoMaternoDG: ''
    });
    expect(form.valid).toBeFalsy();
    expect(form.get('denominacionPME')?.hasError('required')).toBeTruthy();
    expect(form.get('correoPME')?.hasError('required')).toBeTruthy();
    expect(form.get('codigoPostalPME')?.hasError('required')).toBeTruthy();
    expect(form.get('ciudadPME')?.hasError('required')).toBeTruthy();
    expect(form.get('estadoPME')?.hasError('required')).toBeTruthy();
    expect(form.get('callePME')?.hasError('required')).toBeTruthy();
    expect(form.get('numeroExteriorPME')?.hasError('required')).toBeTruthy();
    expect(form.get('nombreDG')?.hasError('required')).toBeTruthy();
    expect(form.get('apellidoPaternoDG')?.hasError('required')).toBeTruthy();

    form.patchValue({
      denominacionPME: 'A'.repeat(255),
      correoPME: 'A'.repeat(321),
      codigoPostalPME: 'A'.repeat(13),
      ciudadPME: 'A'.repeat(101),
      estadoPME: 'A'.repeat(201),
      callePME: 'A'.repeat(101),
      numeroExteriorPME: 'A'.repeat(56),
      numeroInteriorPME: 'A'.repeat(56),
      nombreDG: 'A'.repeat(29),
      apellidoPaternoDG: 'A'.repeat(21),
      apellidoMaternoDG: 'A'.repeat(21)
    });
    expect(form.get('denominacionPME')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('correoPME')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('codigoPostalPME')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('ciudadPME')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('estadoPME')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('callePME')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('numeroExteriorPME')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('numeroInteriorPME')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('nombreDG')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('apellidoPaternoDG')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('apellidoMaternoDG')?.hasError('maxlength')).toBeTruthy();
  });
});