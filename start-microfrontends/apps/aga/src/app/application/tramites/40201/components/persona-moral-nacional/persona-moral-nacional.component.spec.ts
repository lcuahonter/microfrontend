import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonaMoralNacionalComponent } from './persona-moral-nacional.component';
import { Tramite40201Store } from '../../../../core/estados/tramites/tramite40201.store';
import { Tramite40201Query } from '../../../../core/queries/tramite40201.query';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { PersonaMoralNacionalForm } from '../../models/transportacion-maritima.model';
import { TransportacionMaritima40201State } from '../../../../core/estados/tramites/tramite40201.store';
import { CONFIGURACION_PARA_PMN_ENCABEZADO_DE_TABLA, TEXTOS } from '../../constantes/transportacion-maritima.enum';
import { By } from '@angular/platform-browser';

describe('PersonaMoralNacionalComponent', () => {
  let component: PersonaMoralNacionalComponent;
  let fixture: ComponentFixture<PersonaMoralNacionalComponent>;
  let mockTramite40201Store: jest.Mocked<Tramite40201Store>;
  let mockTramite40201Query: jest.Mocked<Tramite40201Query>;
  let mockTransportacionMaritimaService: jest.Mocked<TransportacionMaritimaService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let formBuilder: FormBuilder;

  const mockState: TransportacionMaritima40201State = {
    buscarRfcPMN: 'ABCD123456789',
    rfcPMN: 'ABCD123456789',
    denominacionPMN: 'Empresa Nacional SA',
    correoPMN: 'contacto@empresa.com',
    paisPMN: '1',
    codigoPostalPMN: '12345',
    estadoPMN: '2',
    municipioPMN: '3',
    localidadPMN: 'Ciudad',
    coloniaPMN: '4',
    callePMN: 'Calle Principal',
    numeroExteriorPMN: '123',
    numeroInteriorPMN: 'A1',
    nombreDirectorGeneral: 'Juan',
    apellidoPaternoDirectorGeneral: 'Pérez',
    apellidoMaternoDirectorGeneral: 'Gómez',
    personaMoralNacionalTabla: [],
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
    numeroInteriorPFN: '',
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
      buscarRfcPMN: '',
      rfcPMN: 'ABCD123456789',
      denominacionPMN: 'Empresa Nacional SA',
      correoPMN: 'contacto@empresa.com',
      paisPMN: '1',
      codigoPostalPMN: '12345',
      estadoPMN: '2',
      municipioPMN: '3',
      localidadPMN: 'Ciudad',
      coloniaPMN: '4',
      callePMN: 'Calle Principal',
      numeroExteriorPMN: '123',
      numeroInteriorPMN: 'A1',
      nombreDirectorGeneral: null,
      apellidoPaternoDirectorGeneral: null,
      apellidoMaternoDirectorGeneral: null
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
      buscarContribuyentePMN: jest.fn().mockReturnValue(of(mockContribuyenteResponse)),
      obtenerBuscarEmpresaCaat: jest.fn(),
      buscarContribuyentePFN: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
      getRegistroTomaMuestrasMercanciasData: jest.fn()
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: new BehaviorSubject({ readonly: false })
    } as any;

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PersonaMoralNacionalComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite40201Store, useValue: mockTramite40201Store },
        { provide: Tramite40201Query, useValue: mockTramite40201Query },
        { provide: TransportacionMaritimaService, useValue: mockTransportacionMaritimaService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaMoralNacionalComponent);
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
      expect(component.personaMoralNacionalTabla).toEqual(mockState.personaMoralNacionalTabla);
    });
  }));

  it('should create the personaMoralForm with correct controls', () => {
    component.crearAgregarPMNForm();
    const form = component.personaMoralForm;
    expect(form).toBeDefined();
    expect(form.get('buscarRfcPMN')).toBeDefined();
    expect(form.get('rfcPMN')).toBeDefined();
    expect(form.get('denominacionPMN')).toBeDefined();
    expect(form.get('correoPMN')).toBeDefined();
    expect(form.get('paisPMN')).toBeDefined();
    expect(form.get('codigoPostalPMN')).toBeDefined();
    expect(form.get('estadoPMN')).toBeDefined();
    expect(form.get('municipioPMN')).toBeDefined();
    expect(form.get('localidadPMN')).toBeDefined();
    expect(form.get('coloniaPMN')).toBeDefined();
    expect(form.get('callePMN')).toBeDefined();
    expect(form.get('numeroExteriorPMN')).toBeDefined();
    expect(form.get('numeroInteriorPMN')).toBeDefined();
    expect(form.get('nombreDirectorGeneral')).toBeDefined();
    expect(form.get('apellidoPaternoDirectorGeneral')).toBeDefined();
    expect(form.get('apellidoMaternoDirectorGeneral')).toBeDefined();
  });

  it('should initialize form with state values', () => {
    component.transportacionMaritimaState = mockState;
    component.ngOnInit(); 
    fixture.detectChanges();
    const expectedFormValue = {
      buscarRfcPMN: 'ABCD123456789',
      paisPMN: '1',
      estadoPMN: '2',
      municipioPMN: '3',
      coloniaPMN: '4',
      nombreDirectorGeneral: 'Juan',
      apellidoPaternoDirectorGeneral: 'Pérez',
      apellidoMaternoDirectorGeneral: 'Gómez'
    };
    expect(component.personaMoralForm.value).toMatchObject(expectedFormValue);
    expect(component.personaMoralForm.get('rfcPMN')?.disabled).toBeTruthy();
    expect(component.personaMoralForm.get('denominacionPMN')?.disabled).toBeTruthy();
    expect(component.personaMoralForm.get('correoPMN')?.disabled).toBeTruthy();
    expect(component.personaMoralForm.get('codigoPostalPMN')?.disabled).toBeTruthy();
    expect(component.personaMoralForm.get('localidadPMN')?.disabled).toBeTruthy();
    expect(component.personaMoralForm.get('callePMN')?.disabled).toBeTruthy();
    expect(component.personaMoralForm.get('numeroExteriorPMN')?.disabled).toBeTruthy();
    expect(component.personaMoralForm.get('numeroInteriorPMN')?.disabled).toBeTruthy();
  });

  it('should disable form when esFormularioSoloLectura is true', waitForAsync(() => {
    jest.spyOn(component, 'inicializaCatalogos').mockImplementation(() => {
      component.pais = mockCatalogos.pais;
      component.estado = mockCatalogos.estado;
      component.municipio = mockCatalogos.municipio;
      component.colonia = mockCatalogos.colonia;
    });
    component.esFormularioSoloLectura = true;
    component.ngOnInit();
    fixture.detectChanges();
  }));

  it('should enable form when esFormularioSoloLectura is false', waitForAsync(() => {
    jest.spyOn(component, 'inicializaCatalogos').mockImplementation(() => {
      component.pais = mockCatalogos.pais;
      component.estado = mockCatalogos.estado;
      component.municipio = mockCatalogos.municipio;
      component.colonia = mockCatalogos.colonia;
    });
    component.esFormularioSoloLectura = false;
    component.ngOnInit(); 
    fixture.detectChanges();
  }));

  it('should add a new PMN to the table and update store', () => {
    jest.spyOn(component, 'inicializaCatalogos').mockImplementation(() => {
      component.pais = mockCatalogos.pais;
      component.estado = mockCatalogos.estado;
      component.municipio = mockCatalogos.municipio;
      component.colonia = mockCatalogos.colonia;
    });
    component.inicializaCatalogos();

    component.personaMoralForm = formBuilder.group({
      buscarRfcPMN: 'ABCD123456789',
      rfcPMN: 'ABCD123456789',
      denominacionPMN: 'Empresa Nacional SA',
      correoPMN: 'contacto@empresa.com',
      paisPMN: 1,
      codigoPostalPMN: '12345',
      estadoPMN: 2,
      municipioPMN: 3,
      localidadPMN: 'Ciudad',
      coloniaPMN: 4,
      callePMN: 'Calle Principal',
      numeroExteriorPMN: '123',
      numeroInteriorPMN: 'A1',
      nombreDirectorGeneral: 'Juan',
      apellidoPaternoDirectorGeneral: 'Pérez',
      apellidoMaternoDirectorGeneral: 'Gómez'
    });

    const formData: PersonaMoralNacionalForm = component.personaMoralForm.value;
    component.agregarPMN(formData);

    const expectedTableEntry = {
      denominacionPMN: 'Empresa Nacional SA',
      rfcPMN: 'ABCD123456789',
      correoPMN: 'contacto@empresa.com',
      localidadPMN: 'Ciudad',
      callePMN: 'Calle Principal',
      coloniaPMN: 'Roma Norte',
      paisPMN: 'México',
      estadoPMN: 'Ciudad de México',
      municipioPMN: 'Cuauhtémoc',
      nombreDirectorGeneral: 'Juan Pérez Gómez',
      domicilioPMN: 'Calle Principal 123 Roma Norte Ciudad de México Cuauhtémoc México 12345'
    };

    expect(component.personaMoralNacionalTabla).toContainEqual(expectedTableEntry);
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledTimes(2);
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenNthCalledWith(1, {
      personaMoralNacionalTabla: [expectedTableEntry]
    });
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenNthCalledWith(2, {
      buscarRfcPMN: null,
      rfcPMN: null,
      denominacionPMN: null,
      correoPMN: null,
      paisPMN: null,
      codigoPostalPMN: null,
      estadoPMN: null,
      municipioPMN: null,
      localidadPMN: null,
      coloniaPMN: null,
      callePMN: null,
      numeroExteriorPMN: null,
      numeroInteriorPMN: null,
      nombreDirectorGeneral: null,
      apellidoPaternoDirectorGeneral: null,
      apellidoMaternoDirectorGeneral: null
    });
    expect(component.personaMoralForm.pristine).toBeTruthy();
  });

  it('should not call buscarContribuyente if RFC is empty', () => {
    component.crearAgregarPMNForm();
    component.buscarContribuyente('');
    expect(mockTransportacionMaritimaService.buscarContribuyentePMN).not.toHaveBeenCalled();
  });

  it('should reset form and update store on limpiarDatosPMN', () => {
    component.personaMoralForm = formBuilder.group({
      buscarRfcPMN: 'ABCD123456789',
      rfcPMN: 'ABCD123456789',
      denominacionPMN: 'Empresa Nacional SA',
      correoPMN: 'contacto@empresa.com',
      paisPMN: '1',
      codigoPostalPMN: '12345',
      estadoPMN: '2',
      municipioPMN: '3',
      localidadPMN: 'Ciudad',
      coloniaPMN: '4',
      callePMN: 'Calle Principal',
      numeroExteriorPMN: '123',
      numeroInteriorPMN: 'A1',
      nombreDirectorGeneral: 'Juan',
      apellidoPaternoDirectorGeneral: 'Pérez',
      apellidoMaternoDirectorGeneral: 'Gómez'
    });

    jest.spyOn(component, 'actualizarFormularioState');
    component.limpiarDatosPMN();

    expect(component.personaMoralForm.pristine).toBeTruthy();
    expect(component.personaMoralForm.value).toEqual({
      buscarRfcPMN: null,
      rfcPMN: null,
      denominacionPMN: null,
      correoPMN: null,
      paisPMN: null,
      codigoPostalPMN: null,
      estadoPMN: null,
      municipioPMN: null,
      localidadPMN: null,
      coloniaPMN: null,
      callePMN: null,
      numeroExteriorPMN: null,
      numeroInteriorPMN: null,
      nombreDirectorGeneral: null,
      apellidoPaternoDirectorGeneral: null,
      apellidoMaternoDirectorGeneral: null
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
    component.personaMoralForm = formBuilder.group({
      buscarRfcPMN: 'ABCD123456789',
      rfcPMN: 'ABCD123456789',
      denominacionPMN: 'Empresa Nacional SA',
      correoPMN: 'contacto@empresa.com',
      paisPMN: '1',
      codigoPostalPMN: '12345',
      estadoPMN: '2',
      municipioPMN: '3',
      localidadPMN: 'Ciudad',
      coloniaPMN: '4',
      callePMN: 'Calle Principal',
      numeroExteriorPMN: '123',
      numeroInteriorPMN: 'A1',
      nombreDirectorGeneral: 'Juan',
      apellidoPaternoDirectorGeneral: 'Pérez',
      apellidoMaternoDirectorGeneral: 'Gómez'
    });

    component.actualizarFormularioState();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith(component.personaMoralForm.value);
  });

  it('should update store with field value on setValoresStore', () => {
    const form = formBuilder.group({
      buscarRfcPMN: 'ABCD123456789'
    });
    component.setValoresStore(form, 'buscarRfcPMN');
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ buscarRfcPMN: 'ABCD123456789' });
  });

  it('should update store on paisSeleccion', () => {
    component.personaMoralForm = formBuilder.group({
      paisPMN: '1'
    });
    component.paisSeleccion();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ paisPMN: '1' });
  });

  it('should update store on estadoSeleccion', () => {
    component.personaMoralForm = formBuilder.group({
      estadoPMN: '2'
    });
    component.estadoSeleccion();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ estadoPMN: '2' });
  });

  it('should update store on municipioSeleccion', () => {
    component.personaMoralForm = formBuilder.group({
      municipioPMN: '3'
    });
    component.municipioSeleccion();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ municipioPMN: '3' });
  });

  it('should update store on coloniaSeleccion', () => {
    component.personaMoralForm = formBuilder.group({
      coloniaPMN: '4'
    });
    component.coloniaSeleccion();
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ coloniaPMN: '4' });
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
    const form = component.personaMoralForm;

    form.patchValue({
      buscarRfcPMN: '',
      rfcPMN: '',
      denominacionPMN: '',
      correoPMN: '',
      paisPMN: '',
      codigoPostalPMN: '',
      estadoPMN: '',
      municipioPMN: '',
      localidadPMN: '',
      coloniaPMN: '',
      callePMN: '',
      numeroExteriorPMN: '',
      numeroInteriorPMN: '',
      nombreDirectorGeneral: '',
      apellidoPaternoDirectorGeneral: '',
      apellidoMaternoDirectorGeneral: ''
    });
    expect(form.valid).toBeFalsy();
    form.get('denominacionPMN')?.enable();
    form.get('correoPMN')?.enable();
    form.get('codigoPostalPMN')?.enable();
    form.get('localidadPMN')?.enable();
    form.get('callePMN')?.enable();
    form.get('numeroExteriorPMN')?.enable();
    form.get('numeroInteriorPMN')?.enable();

    form.patchValue({
      buscarRfcPMN: 'A'.repeat(14),
      rfcPMN: 'A'.repeat(14),
      denominacionPMN: 'A'.repeat(101),
      correoPMN: 'A'.repeat(101),
      codigoPostalPMN: 'A'.repeat(6),
      localidadPMN: 'A'.repeat(51),
      callePMN: 'A'.repeat(51),
      numeroExteriorPMN: 'A'.repeat(11),
      numeroInteriorPMN: 'A'.repeat(11),
      nombreDirectorGeneral: 'A'.repeat(51),
      apellidoPaternoDirectorGeneral: 'A'.repeat(51),
      apellidoMaternoDirectorGeneral: 'A'.repeat(51)
    });
  });
});