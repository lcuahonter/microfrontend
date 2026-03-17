import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonaFisicaNacionalComponent } from './persona-fisica-nacional.component';
import { Tramite40201Store } from '../../../../core/estados/tramites/tramite40201.store';
import { Tramite40201Query } from '../../../../core/queries/tramite40201.query';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { AlertComponent, CatalogoSelectComponent, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { BehaviorSubject, of } from 'rxjs';
import { PersonaFisicaNacionalForm} from '../../models/transportacion-maritima.model';
import { TransportacionMaritima40201State } from '../../../../core/estados/tramites/tramite40201.store';
import { CONFIGURACION_PARA_ENCABEZADO_DE_TABLA, TEXTOS } from '../../constantes/transportacion-maritima.enum';
import { By } from '@angular/platform-browser';

describe('PersonaFisicaNacionalComponent', () => {
  let component: PersonaFisicaNacionalComponent;
  let fixture: ComponentFixture<PersonaFisicaNacionalComponent>;
  let mockTramite40201Store: jest.Mocked<Tramite40201Store>;
  let mockTramite40201Query: jest.Mocked<Tramite40201Query>;
  let mockTransportacionMaritimaService: jest.Mocked<TransportacionMaritimaService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let formBuilder: FormBuilder;

  const mockState: TransportacionMaritima40201State = {
    buscarRfcPFN: 'ABCD123456XYZ',
    rfcPFN: 'ABCD123456XYZ',
    nombrePFN: 'Juan',
    apellidoPaternoPFN: 'Pérez',
    apellidoMaternoPFN: 'Gómez',
    paisPFN: '1',
    codigoPostalPFN: '12345',
    estadoPFN: '2',
    municipioPFN: '3',
    localidadPFN: 'Ciudad',
    coloniaPFN: '4',
    callePFN: 'Calle Principal',
    numeroExteriorPFN: '123',
    numeroInteriorPFN: 'A1',
    personaFisicaNacionalTabla: []
  };
const mockCatalogos = {
  pais: [{ id: 1, descripcion: 'México' }],
  estado: [{ id: 2, descripcion: 'Ciudad de México' }],
  municipio: [{ id: 3, descripcion: 'Cuauhtémoc' }],
  colonia: [{ id: 4, descripcion: 'Roma Norte' }]
};

  const mockContribuyenteResponse = {
    data: [{
      rfcPFN: 'ABCD123456XYZ',
      nombrePFN: 'Juan',
      apellidoPaternoPFN: 'Pérez',
      apellidoMaternoPFN: 'Gómez',
      paisPFN: '1',
      codigoPostalPFN: '12345',
      estadoPFN: '2',
      municipioPFN: '3',
      localidadPFN: 'Ciudad',
      coloniaPFN: '4',
      callePFN: 'Calle Principal',
      numeroExteriorPFN: '123',
      numeroInteriorPFN: 'A1'
    }]
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
      getPaisCatalogo: jest.fn().mockReturnValue(of({ data: mockCatalogos.pais })),
      getEstadoCatalogo: jest.fn().mockReturnValue(of({ data: mockCatalogos.estado })),
      getMunicipioCatalogo: jest.fn().mockReturnValue(of({ data: mockCatalogos.municipio })),
      getColoniaCatalogo: jest.fn().mockReturnValue(of({ data: mockCatalogos.colonia })),
      buscarContribuyentePFN: jest.fn().mockReturnValue(of(mockContribuyenteResponse))
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: new BehaviorSubject({ readonly: false })
    } as any;

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PersonaFisicaNacionalComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite40201Store, useValue: mockTramite40201Store },
        { provide: Tramite40201Query, useValue: mockTramite40201Query },
        { provide: TransportacionMaritimaService, useValue: mockTransportacionMaritimaService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaFisicaNacionalComponent);
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
      expect(mockTransportacionMaritimaService.getEstadoCatalogo).toHaveBeenCalled();
      expect(mockTransportacionMaritimaService.getMunicipioCatalogo).toHaveBeenCalled();
      expect(mockTransportacionMaritimaService.getColoniaCatalogo).toHaveBeenCalled();
      expect(component.pais).toEqual(mockCatalogos.pais);
      expect(component.estado).toEqual(mockCatalogos.estado);
      expect(component.municipio).toEqual(mockCatalogos.municipio);
      expect(component.colonia).toEqual(mockCatalogos.colonia);
    });
  }));

  it('should initialize form and subscribe to state changes on ngOnInit', waitForAsync(() => {
    jest.spyOn(component, 'inicializarEstadoFormulario');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
      expect(component.transportacionMaritimaState).toEqual(mockState);
      expect(component.personaFisicaNacionalTabla).toEqual(mockState.personaFisicaNacionalTabla);
    });
  }));

  it('should create the personaFisicaForm with correct controls', () => {
    component.crearAgregarPFNForm();
    const form = component.personaFisicaForm;
    expect(form).toBeDefined();
    expect(form.get('buscarRfcPFN')).toBeDefined();
    expect(form.get('rfcPFN')).toBeDefined();
    expect(form.get('nombrePFN')).toBeDefined();
    expect(form.get('apellidoPaternoPFN')).toBeDefined();
    expect(form.get('apellidoMaternoPFN')).toBeDefined();
    expect(form.get('paisPFN')).toBeDefined();
    expect(form.get('codigoPostalPFN')).toBeDefined();
    expect(form.get('estadoPFN')).toBeDefined();
    expect(form.get('municipioPFN')).toBeDefined();
    expect(form.get('localidadPFN')).toBeDefined();
    expect(form.get('coloniaPFN')).toBeDefined();
    expect(form.get('callePFN')).toBeDefined();
    expect(form.get('numeroExteriorPFN')).toBeDefined();
    expect(form.get('numeroInteriorPFN')).toBeDefined();
  });

  it('should initialize form with state values', () => {
    component.transportacionMaritimaState = mockState;
    component.crearAgregarPFNForm();
    const expectedFormValue = {
      buscarRfcPFN: 'ABCD123456XYZ',
      paisPFN: '1',
      estadoPFN: '2',
      municipioPFN: '3',
      coloniaPFN: '4'
    };
    expect(component.personaFisicaForm.value).toEqual(expectedFormValue);
  });

  it('should disable form when esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.crearAgregarPFNForm();
  });

  it('should enable form when esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.crearAgregarPFNForm();
  });

it('should add a new PFN to the table and update store', () => {
  jest.spyOn(component, 'inicializaCatalogos').mockImplementation(() => {
    component.pais = mockCatalogos.pais as any;
    component.estado = mockCatalogos.estado as any;
    component.municipio = mockCatalogos.municipio as any;
    component.colonia = mockCatalogos.colonia as any;
  });
  component.inicializaCatalogos();

 
  component.personaFisicaForm = formBuilder.group({
    buscarRfcPFN: 'ABCD123456XYZ',
    rfcPFN: 'ABCD123456XYZ',
    nombrePFN: 'Juan',
    apellidoPaternoPFN: 'Pérez',
    apellidoMaternoPFN: 'Gómez',
    paisPFN: '1',
    codigoPostalPFN: '12345',
    estadoPFN: '2',
    municipioPFN: '3',
    localidadPFN: 'Ciudad',
    coloniaPFN: '4',
    callePFN: 'Calle Principal',
    numeroExteriorPFN: '123',
    numeroInteriorPFN: 'A1'
  });

  const formData: PersonaFisicaNacionalForm = component.personaFisicaForm.value;
  component.agregarPFN(formData);

 
  expect(mockTramite40201Store.setTramite40201State).toHaveBeenNthCalledWith(2, {
    buscarRfcPFN: null,
    rfcPFN: null,
    nombrePFN: null,
    apellidoPaternoPFN: null,
    apellidoMaternoPFN: null,
    paisPFN: null,
    codigoPostalPFN: null,
    estadoPFN: null,
    municipioPFN: null,
    localidadPFN: null,
    coloniaPFN: null,
    callePFN: null,
    numeroExteriorPFN: null,
    numeroInteriorPFN: null
  });

  expect(component.personaFisicaForm.pristine).toBeTruthy();
});

  it('should search contribuyente by RFC and update form', waitForAsync(() => {
    component.crearAgregarPFNForm();
    component.buscarContribuyente('ABCD123456XYZ');
    fixture.whenStable().then(() => {
      expect(mockTransportacionMaritimaService.buscarContribuyentePFN).toHaveBeenCalled();
      expect(component.personaFisicaForm.value).toEqual({
        buscarRfcPFN: '',
        paisPFN: '1',
        estadoPFN: '2',
        municipioPFN: '3',
        coloniaPFN: '4'
      });
      expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith(component.personaFisicaForm.value);
    });
  }));

  it('should not call buscarContribuyente if RFC is empty', () => {
    component.crearAgregarPFNForm();
    component.buscarContribuyente('');
    expect(mockTransportacionMaritimaService.buscarContribuyentePFN).not.toHaveBeenCalled();
  });

  it('should reset form and update store on limpiarDatosPFN', () => {
    component.personaFisicaForm = formBuilder.group({
      buscarRfcPFN: 'ABCD123456XYZ',
      rfcPFN: 'ABCD123456XYZ',
      nombrePFN: 'Juan',
      apellidoPaternoPFN: 'Pérez',
      apellidoMaternoPFN: 'Gómez',
      paisPFN: '1',
      codigoPostalPFN: '12345',
      estadoPFN: '2',
      municipioPFN: '3',
      localidadPFN: 'Ciudad',
      coloniaPFN: '4',
      callePFN: 'Calle Principal',
      numeroExteriorPFN: '123',
      numeroInteriorPFN: 'A1'
    });

    jest.spyOn(component, 'actualizarFormularioState');
    component.limpiarDatosPFN();

    expect(component.personaFisicaForm.pristine).toBeTruthy();
    expect(component.personaFisicaForm.value).toEqual({
      buscarRfcPFN: null,
      rfcPFN: null,
      nombrePFN: null,
      apellidoPaternoPFN: null,
      apellidoMaternoPFN: null,
      paisPFN: null,
      codigoPostalPFN: null,
      estadoPFN: null,
      municipioPFN: null,
      localidadPFN: null,
      coloniaPFN: null,
      callePFN: null,
      numeroExteriorPFN: null,
      numeroInteriorPFN: null
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
    component.personaFisicaForm = formBuilder.group({
      buscarRfcPFN: 'ABCD123456XYZ',
      rfcPFN: 'ABCD123456XYZ',
      nombrePFN: 'Juan',
      apellidoPaternoPFN: 'Pérez',
      apellidoMaternoPFN: 'Gómez',
      paisPFN: '1',
      codigoPostalPFN: '12345',
      estadoPFN: '2',
      municipioPFN: '3',
      localidadPFN: 'Ciudad',
      coloniaPFN: '4',
      callePFN: 'Calle Principal',
      numeroExteriorPFN: '123',
      numeroInteriorPFN: 'A1'
    });

    component.actualizarFormularioState();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith(component.personaFisicaForm.value);
  });

  it('should update store with field value on setValoresStore', () => {
    const form = formBuilder.group({
      buscarRfcPFN: 'ABCD123456XYZ'
    });
    component.setValoresStore(form, 'buscarRfcPFN');
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ buscarRfcPFN: 'ABCD123456XYZ' });
  });

  it('should unsubscribe from observables on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destruirNotificador$'], 'next');
    const completeSpy = jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should validate form fields', () => {
    component.crearAgregarPFNForm();
    const form = component.personaFisicaForm;

    form.patchValue({
      buscarRfcPFN: '',
      rfcPFN: '',
      nombrePFN: '',
      apellidoPaternoPFN: '',
      apellidoMaternoPFN: '',
      paisPFN: '',
      codigoPostalPFN: '',
      estadoPFN: '',
      municipioPFN: '',
      localidadPFN: '',
      coloniaPFN: '',
      callePFN: '',
      numeroExteriorPFN: '',
      numeroInteriorPFN: ''
    });
    expect(form.valid).toBeFalsy();
    expect(form.get('buscarRfcPFN')?.hasError('required')).toBeTruthy();

    form.patchValue({
      buscarRfcPFN: 'A'.repeat(16)
    });
    expect(form.get('buscarRfcPFN')?.hasError('maxlength')).toBeTruthy();
  });

  it('should update store on paisSeleccion', () => {
    component.personaFisicaForm = formBuilder.group({
      paisPFN: '1'
    });
    component.paisSeleccion();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ paisPFE: '1' });
  });

  it('should update store on estadoSeleccion', () => {
    component.personaFisicaForm = formBuilder.group({
      estadoPFN: '2'
    });
    component.estadoSeleccion();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ estadoPFN: '2' });
  });

  it('should update store on municipioSeleccion', () => {
    component.personaFisicaForm = formBuilder.group({
      municipioPFN: '3'
    });
    component.municipioSeleccion();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ municipioPFN: '3' });
  });

  it('should update store on coloniaSeleccion', () => {
    component.personaFisicaForm = formBuilder.group({
      coloniaPFN: '4'
    });
    component.coloniaSeleccion();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ coloniaPFN: '4' });
  });
});