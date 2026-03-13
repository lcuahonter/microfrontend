jest.mock('@libs/shared/theme/assets/json/250101/banco.json', () => ({
  __esModule: true,
  default: {
    banco: [
      { id: 1, descripcion: 'Banco 1' },
      { id: 2, descripcion: 'Banco 2' }
    ],
  }
}), { virtual: true });
jest.mock('@libs/shared/theme/assets/json/250101/pago-formdatos.json', () => ({
  __esModule: true,
  default: {
    formData: {
      clave: 'mockClave',
      dependencia: 'mockDependencia',
      importe: '1234',
    }
  }
}), { virtual: true });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PagoDeDerechos250101Component } from './pago-de-derechos250101.component';
import { Tramite250101Store } from '../../estados/tramite250101.store';
import { Tramite250101Query } from '../../estados/tramite250101.query';
import { CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite250101State } from '../../estados/tramite250101.store';


// ✅ Mock data for solicitud state
const mockSolicitudState: Tramite250101State = {
  clave: 'mockClave',
  dependencia: 'mockDependencia',
  banco: 'MockBank1',
  llave: '9876',
  fecha: '2025-04-10',
  importe: '1234',
  revisados: "yes",
  tipoAduana: null,
  tipoInspectoria: null,
  tipoMunicipio: null,
  destinatarioDenominacion: '',
  destinatarioPais: null,
  destinatarioEstado: null,
  destinatarioCodigoPostal: '',
  destinatarioDomicilio: '',
  agenteAduanalNombre: '',
  agenteAduanalPrimerApellido: '',
  agenteAduanalSegundoApellido: '',
  agenteAduanalPatente: '',
  destinatarioRowData: [],
  agenteAduanalRowData: [],
  medio: '',
  identificacion: '',
  economico: '',
  placa: '',
  numero: '',
  fechas: '',
  requisito: '',
  descripcion: '',
  fraccion: '',
  arancelaria: '',
  cantidad: '',
  medida: '',
  genero: '',
  especie: '',
  comun: '',
  origen: '',
  procedencia: ''
};

describe('PagoDeDerechos250101Component', () => {
  let component: PagoDeDerechos250101Component;
  let fixture: ComponentFixture<PagoDeDerechos250101Component>;
  let tramite250101Store: Tramite250101Store;

  const tramite250101StoreMock = {
    setClave: jest.fn(),
    setDependencia: jest.fn(),
    setBanco: jest.fn(),
    setLlave: jest.fn(),
    setFecha: jest.fn(),
    setImporte: jest.fn(),
    setRevisados: jest.fn(),
  };

  const tramite250101QueryMock = {
    selectSolicitud$: of(mockSolicitudState),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        PagoDeDerechos250101Component,
        TituloComponent,
        CatalogoSelectComponent,
      ],
      providers: [
        FormBuilder,
        { provide: Tramite250101Store, useValue: tramite250101StoreMock },
        { provide: Tramite250101Query, useValue: tramite250101QueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoDeDerechos250101Component);
    component = fixture.componentInstance;
    tramite250101Store = TestBed.inject(Tramite250101Store);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores de solicitudState y establecer valores fijos desde pago.formData', () => {
    const mockSolicitudState = {
      clave: 'solClave',
      dependencia: 'solDep',
      banco: 'solBanco',
      llave: 'solLlave',
      fecha: '2024-01-01',
      importe: '9999',
      revisados: true
    };
    // @ts-ignore: acceso privado para prueba
    component.solicitudState = mockSolicitudState;
    // @ts-ignore: acceso privado para prueba
    component['fb'] = new FormBuilder();

    component['inicializarFormulario']();

    expect(component.pagoDerechosForm.controls['clave'].value).toBe('mockClave');
    expect(component.pagoDerechosForm.controls['dependencia'].value).toBe('mockDependencia');
    expect(component.pagoDerechosForm.controls['banco'].value).toBe('MockBank1');
    expect(component.pagoDerechosForm.controls['llave'].value).toBe('9876');
    expect(component.pagoDerechosForm.controls['fecha'].value).toBe('2025-04-10');
    expect(component.pagoDerechosForm.controls['importe'].value).toBe('1234');
    expect(component.pagoDerechosForm.controls['revisados'].value).toBe('yes');
  });

  it('debería deshabilitar los campos clave, dependencia e importe', () => {
    expect(component.pagoDerechosForm.controls['clave'].disabled).toBe(true);
    expect(component.pagoDerechosForm.controls['dependencia'].disabled).toBe(true);
    expect(component.pagoDerechosForm.controls['importe'].disabled).toBe(true);
  });

  it('debería llamar al método setClave del store al actualizar clave', () => {
    component.pagoDerechosForm.controls['clave'].setValue('newClave');
    component.setValoresStore(component.pagoDerechosForm, 'clave', 'setClave');
    expect(tramite250101Store.setClave).toHaveBeenCalledWith('newClave');
  });

  it('debería llamar al método setDependencia del store al actualizar dependencia', () => {
    component.pagoDerechosForm.controls['dependencia'].setValue('newDep');
    component.setValoresStore(component.pagoDerechosForm, 'dependencia', 'setDependencia');
    expect(tramite250101Store.setDependencia).toHaveBeenCalledWith('newDep');
  });

  it('debería llamar al método setBanco del store al actualizar banco', () => {
    component.pagoDerechosForm.controls['banco'].setValue('OtherBank');
    component.setValoresStore(component.pagoDerechosForm, 'banco', 'setBanco');
    expect(tramite250101Store.setBanco).toHaveBeenCalledWith('OtherBank');
  });

  it('debería llamar al método setLlave del store al actualizar llave', () => {
    component.pagoDerechosForm.controls['llave'].setValue('1111');
    component.setValoresStore(component.pagoDerechosForm, 'llave', 'setLlave');
    expect(tramite250101Store.setLlave).toHaveBeenCalledWith('1111');
  });

  it('debería llamar al método setFecha del store al actualizar fecha', () => {
    component.pagoDerechosForm.controls['fecha'].setValue('2025-05-01');
    component.setValoresStore(component.pagoDerechosForm, 'fecha', 'setFecha');
    expect(tramite250101Store.setFecha).toHaveBeenCalledWith('2025-05-01');
  });

  it('debería llamar al método setImporte del store al actualizar importe', () => {
    component.pagoDerechosForm.controls['importe'].setValue('5678');
    component.setValoresStore(component.pagoDerechosForm, 'importe', 'setImporte');
    expect(tramite250101Store.setImporte).toHaveBeenCalledWith('5678');
  });

  it('debería llamar al método setRevisados del store al actualizar revisados', () => {
    component.pagoDerechosForm.controls['revisados'].setValue(false);
    component.setValoresStore(component.pagoDerechosForm, 'revisados', 'setRevisados');
    expect(tramite250101Store.setRevisados).toHaveBeenCalledWith(false);
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  
  it('debería retornar inmediatamente si pagoDerechosForm es undefined', () => {
    component.pagoDerechosForm = undefined as any;
    expect(() => component.inicializarEstadoFormulario()).not.toThrow();
  });

 it('debería llamar a guardarDatosFormulario si esFormularioSoloLectura es true', () => {
  component.pagoDerechosForm = component['fb'].group({
    clave: [''],
    dependencia: [''],
    banco: [''],
    llave: [''],
    fecha: [''],
    importe: [''],
    revisados: ['']
  });
  component.esFormularioSoloLectura = true;
  const spy = jest.spyOn(component, 'guardarDatosFormulario');
  component.inicializarEstadoFormulario();
  expect(spy).toHaveBeenCalled();
});

  it('debería habilitar el formulario y deshabilitar controles específicos si esFormularioSoloLectura es falso', () => {
    component.pagoDerechosForm = component['fb'].group({
      clave: [''],
      dependencia: [''],
      banco: [''],
      llave: [''],
      fecha: [''],
      importe: [''],
      revisados: ['']
    });
    component.esFormularioSoloLectura = false;
    component.pagoDerechosForm.disable();
    component.inicializarEstadoFormulario();
    expect(component.pagoDerechosForm.enabled).toBe(true);
    expect(component.pagoDerechosForm.get('clave')?.disabled).toBe(true);
    expect(component.pagoDerechosForm.get('dependencia')?.disabled).toBe(true);
    expect(component.pagoDerechosForm.get('importe')?.disabled).toBe(true);
  });
});
