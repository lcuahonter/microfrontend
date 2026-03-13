// Must be placed before any imports
jest.mock('@libs/shared/theme/assets/json/221601/zoosanitario.json', () => ({
  __esModule: true,
  default: {
    medio: [
      { id: 1, descripcion: 'Camión' },
      { id: 2, descripcion: 'Tren' }
    ],
    verificacion: [
      { id: 1, descripcion: 'Alta' },
      { id: 2, descripcion: 'Baja' }
    ],
    formData: {
      transporte: '435345',
      empresa: '45453453'
    }
  }
}), { virtual: true });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { MovilizacionComponent } from './movilizacion.component';
import { Tramite221601Store } from '../../../../estados/tramites/tramite221601.store';
import { Tramite221601Query } from '../../../../estados/queries/tramite221601.query';
import { CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Solicitud221601State } from '../../../../estados/tramites/tramite221601.store';
/**
 * Mock data for the solicitud state.
 */
const mockSolicitudState: Solicitud221601State = {
  justificacion: '',
  aduana: '',
  oficina: '',
  punto: '',
  guia: '',
  regimen: '',
  carro: '',
  medio: 'Terrestre',
  transporte: '435345',
  verificacion: 'Alta',
  empresa: '45453453',
  clave: '',
  dependencia: '',
  banco: '',
  llave: '',
  fecha: '',
  importe: '',
  coordenadas: '',
  tipoPersona: '',
  nombre: '',
  primerApellido: '',
  segundoApellido: '',
  social: '',
  pais: '',
  codigo: '',
  estado: '',
  municipio: '',
  colonia: '',
  calle: '',
  exterior: '',
  interior: '',
  lada: '',
  telefono: '',
  correoElectronico: '',
  tif: '',
  claves: '',
  veterinario: '',
  establecimiento: '',
  capturaMercancia: ''
};

describe('MovilizacionComponent', () => {
  let component: MovilizacionComponent;
  let fixture: ComponentFixture<MovilizacionComponent>;
  let tramite221601Store: Tramite221601Store;
  let tramite221601Query: Tramite221601Query;

  const tramite221601StoreMock = {
     update: jest.fn(),
    setMedio: jest.fn(),
    setTransporte: jest.fn(),
    setVerificacion: jest.fn(),
    setEmpresa: jest.fn(),
  };

  const tramite221601QueryMock = {
    selectSolicitud$: of(mockSolicitudState),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, FormsModule,MovilizacionComponent, TituloComponent, CatalogoSelectComponent],
      providers: [
        FormBuilder,
        { provide: Tramite221601Store, useValue: tramite221601StoreMock },
        { provide: Tramite221601Query, useValue: tramite221601QueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovilizacionComponent);
    component = fixture.componentInstance;
    tramite221601Store = TestBed.inject(Tramite221601Store);
    tramite221601Query = TestBed.inject(Tramite221601Query);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with values from the store', () => {
    // Test form initialization with values from the store
    expect(component.MedioForm.controls['medio'].value).toBe('Terrestre');
    expect(component.MedioForm.controls['transporte'].value).toBe('435345');
    expect(component.MedioForm.controls['verificacion'].value).toBe('Alta');
    expect(component.MedioForm.controls['empresa'].value).toBe('45453453');
  });

  it('should call the store method setMedio when updating the form', () => {
    // Simulate form value change and ensure the store method is called
    component.MedioForm.controls['medio'].setValue('Marítimo');
    component.setValoresStore(component.MedioForm, 'medio', 'setMedio');
    expect(tramite221601Store.setMedio).toHaveBeenCalledWith('Marítimo');
  });

  it('should call the store method setTransporte when updating the form', () => {
    component.MedioForm.controls['transporte'].setValue('Barco');
    component.setValoresStore(component.MedioForm, 'transporte', 'setTransporte');
    expect(tramite221601Store.setTransporte).toHaveBeenCalledWith('Barco');
  });

  it('should call the store method setVerificacion when updating the form', () => {
    component.MedioForm.controls['verificacion'].setValue('Baja');
    component.setValoresStore(component.MedioForm, 'verificacion', 'setVerificacion');
    expect(tramite221601Store.setVerificacion).toHaveBeenCalledWith('Baja');
  });

  it('should call the store method setEmpresa when updating the form', () => {
    component.MedioForm.controls['empresa'].setValue('NEW COMPANY');
    component.setValoresStore(component.MedioForm, 'empresa', 'setEmpresa');
    expect(tramite221601Store.setEmpresa).toHaveBeenCalledWith('NEW COMPANY');
  });

  it('should initialize the store state correctly on ngOnInit', () => {
    component.ngOnInit();
    // Ensure that the store values are correctly initialized in the form
    expect(component.MedioForm.controls['medio'].value).toBe(mockSolicitudState.medio);
    expect(component.MedioForm.controls['transporte'].value).toBe(mockSolicitudState.transporte);
    expect(component.MedioForm.controls['verificacion'].value).toBe(mockSolicitudState.verificacion);
    expect(component.MedioForm.controls['empresa'].value).toBe(mockSolicitudState.empresa);
  });

  it('should call ngOnDestroy and clean up resources', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
  });
});
