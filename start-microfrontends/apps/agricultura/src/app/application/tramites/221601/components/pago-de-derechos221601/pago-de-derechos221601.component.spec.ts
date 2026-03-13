jest.mock('@libs/shared/theme/assets/json/221601/zoosanitario.json', () => ({
  __esModule: true,
  default: {
    banco: [
      { id: 1, descripcion: 'Banco 1' },
      { id: 2, descripcion: 'Banco 2' }
    ],
    formData: {
      claves: '454000554',
      dependencia: '0001840470CAIM',
      importe: '1281'
    }
  }
}), { virtual: true });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PagoDeDerechos221601Component } from './pago-de-derechos221601.component';
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
  medio: '',
  transporte: '',
  verificacion: '',
  empresa: '',
  claves: '454000554',
  dependencia: '0001840470CAIM',
  banco: 'BBVA',
  llave: '1234',
  fecha: '2025-04-07',
  importe: '1281',
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
  clave: '',
  veterinario: '',
  establecimiento: '',
  capturaMercancia: ''
};

describe('PagoDeDerechos221601Component', () => {
  let component: PagoDeDerechos221601Component;
  let fixture: ComponentFixture<PagoDeDerechos221601Component>;
  let tramite221601Store: Tramite221601Store;
  let tramite221601Query: Tramite221601Query;

  const tramite221601StoreMock = {
     update: jest.fn(),
    setClaves: jest.fn(),
    setDependencia: jest.fn(),
    setBanco: jest.fn(),
    setLlave: jest.fn(),
    setFecha: jest.fn(),
    setImporte: jest.fn(),
  };

  const tramite221601QueryMock = {
    selectSolicitud$: of(mockSolicitudState),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, FormsModule,PagoDeDerechos221601Component, TituloComponent, CatalogoSelectComponent],
      providers: [
        FormBuilder,
        { provide: Tramite221601Store, useValue: tramite221601StoreMock },
        { provide: Tramite221601Query, useValue: tramite221601QueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoDeDerechos221601Component);
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
    expect(component.pagoDerechosForm.controls['claves'].value).toBe('454000554');
    expect(component.pagoDerechosForm.controls['dependencia'].value).toBe('0001840470CAIM');
    expect(component.pagoDerechosForm.controls['banco'].value).toBe('BBVA');
    expect(component.pagoDerechosForm.controls['llave'].value).toBe('1234');
    expect(component.pagoDerechosForm.controls['fecha'].value).toBe('2025-04-07');
    expect(component.pagoDerechosForm.controls['importe'].value).toBe('1281');
  });

  it('should disable clave, dependencia, and importe fields', () => {
    expect(component.pagoDerechosForm.controls['claves'].disabled).toBe(true);
    expect(component.pagoDerechosForm.controls['dependencia'].disabled).toBe(true);
    expect(component.pagoDerechosForm.controls['importe'].disabled).toBe(true);
  });

  it('should call the store method setClave when updating the form', () => {
    component.pagoDerechosForm.controls['claves'].setValue('555555555');
    component.setValoresStore(component.pagoDerechosForm, 'claves', 'setClaves');
    expect(tramite221601Store.setClaves).toHaveBeenCalledWith('555555555');
  });

  it('should call the store method setDependencia when updating the form', () => {
    component.pagoDerechosForm.controls['dependencia'].setValue('0000000000XYZ');
    component.setValoresStore(component.pagoDerechosForm, 'dependencia', 'setDependencia');
    expect(tramite221601Store.setDependencia).toHaveBeenCalledWith('0000000000XYZ');
  });

  it('should call the store method setBanco when updating the form', () => {
    component.pagoDerechosForm.controls['banco'].setValue('Banorte');
    component.setValoresStore(component.pagoDerechosForm, 'banco', 'setBanco');
    expect(tramite221601Store.setBanco).toHaveBeenCalledWith('Banorte');
  });

  it('should call the store method setLlave when updating the form', () => {
    component.pagoDerechosForm.controls['llave'].setValue('5678');
    component.setValoresStore(component.pagoDerechosForm, 'llave', 'setLlave');
    expect(tramite221601Store.setLlave).toHaveBeenCalledWith('5678');
  });

  it('should call the store method setFecha when updating the form', () => {
    component.pagoDerechosForm.controls['fecha'].setValue('2025-04-08');
    component.setValoresStore(component.pagoDerechosForm, 'fecha', 'setFecha');
    expect(tramite221601Store.setFecha).toHaveBeenCalledWith('2025-04-08');
  });

  it('should call the store method setImporte when updating the form', () => {
    component.pagoDerechosForm.controls['importe'].setValue('1500');
    component.setValoresStore(component.pagoDerechosForm, 'importe', 'setImporte');
    expect(tramite221601Store.setImporte).toHaveBeenCalledWith('1500');
  });

  it('should initialize the store state correctly on ngOnInit', () => {
    component.ngOnInit();
    // Ensure that the store values are correctly initialized in the form
    expect(component.pagoDerechosForm.controls['claves'].value).toBe(mockSolicitudState.claves);
    expect(component.pagoDerechosForm.controls['dependencia'].value).toBe(mockSolicitudState.dependencia);
    expect(component.pagoDerechosForm.controls['banco'].value).toBe(mockSolicitudState.banco);
    expect(component.pagoDerechosForm.controls['llave'].value).toBe(mockSolicitudState.llave);
    expect(component.pagoDerechosForm.controls['fecha'].value).toBe(mockSolicitudState.fecha);
    expect(component.pagoDerechosForm.controls['importe'].value).toBe(mockSolicitudState.importe);
  });

  it('should call ngOnDestroy and clean up resources', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
  });
  it('should patch fecha and call setFecha on store', () => {
    const nuevoValor = '2025-04-24';

    component.cambioFechaFinal(nuevoValor);

    expect(component.pagoDerechosForm.value.fecha).toBe(nuevoValor);
    expect(tramite221601StoreMock.setFecha).toHaveBeenCalledWith(nuevoValor);
  });
});
