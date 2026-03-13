import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { Tramite250103Store } from '../../estados/tramite250103.store';
import { Tramite250103Query } from '../../estados/tramite250103.query';
import { CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite250103State } from '../../estados/tramite250103.store';

jest.mock('@libs/shared/theme/assets/json/250103/banco.json', () => ({
  banco: ['MockBank1', 'MockBank2'],
}));

jest.mock('@libs/shared/theme/assets/json/250103/pago-formdatos.json', () => ({
  formData: {
    clave: 'mockClave',
    dependencia: 'mockDependencia',
    importe: '1234',
  },
}));

const MOCK_SOLICITUD_STATE: Tramite250103State = {
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
  procedencia: '',
  tipoMovimiento: 'mockMovimiento',
  destinariociudad: 'mockCiudad',
  productos: [],
  detalles: [],
};

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;
  let tramite250103Store: Tramite250103Store;

  const TRAMITE250103_STORE_MOCK = {
    setClave: jest.fn(),
    setDependencia: jest.fn(),
    setBanco: jest.fn(),
    setLlave: jest.fn(),
    setFecha: jest.fn(),
    setImporte: jest.fn(),
    setRevisados: jest.fn(),
  };

  const TRAMITE250103_QUERY_MOCK = {
    selectSolicitud$: of(MOCK_SOLICITUD_STATE),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        PagoDeDerechosComponent,
        TituloComponent,
        CatalogoSelectComponent,
      ],
      providers: [
        FormBuilder,
        { provide: Tramite250103Store, useValue: TRAMITE250103_STORE_MOCK },
        { provide: Tramite250103Query, useValue: TRAMITE250103_QUERY_MOCK },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
    tramite250103Store = TestBed.inject(Tramite250103Store);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with values from store and set fixed values from JSON', () => {
    expect(component.pagoDerechosForm.controls['clave'].value).toBe('mockClave');
    expect(component.pagoDerechosForm.controls['dependencia'].value).toBe('mockDependencia');
    expect(component.pagoDerechosForm.controls['banco'].value).toBe('MockBank1');
    expect(component.pagoDerechosForm.controls['llave'].value).toBe('9876');
    expect(component.pagoDerechosForm.controls['fecha'].value).toBe('2025-04-10');
    expect(component.pagoDerechosForm.controls['importe'].value).toBe('1234');
    expect(component.pagoDerechosForm.controls['revisados'].value).toBe('yes');
  });

  it('should disable clave, dependencia and importe fields', () => {
    expect(component.pagoDerechosForm.controls['clave'].disabled).toBe(true);
    expect(component.pagoDerechosForm.controls['dependencia'].disabled).toBe(true);
    expect(component.pagoDerechosForm.controls['importe'].disabled).toBe(true);
  });

  it('should call setClave store method when updating clave', () => {
    component.pagoDerechosForm.controls['clave'].setValue('newClave');
    component.setValoresStore(component.pagoDerechosForm, 'clave');
  });

  it('should call setDependencia store method when updating dependencia', () => {
    component.pagoDerechosForm.controls['dependencia'].setValue('newDep');
    component.setValoresStore(component.pagoDerechosForm, 'dependencia');
  });

  it('should call setBanco store method when updating banco', () => {
    component.pagoDerechosForm.controls['banco'].setValue('OtherBank');
    component.setValoresStore(component.pagoDerechosForm, 'banco',);
  });

  it('should call setLlave store method when updating llave', () => {
    component.pagoDerechosForm.controls['llave'].setValue('1111');
    component.setValoresStore(component.pagoDerechosForm, 'llave');
  });

  it('should call setFecha store method when updating fecha', () => {
    component.pagoDerechosForm.controls['fecha'].setValue('2025-05-01');
    component.setValoresStore(component.pagoDerechosForm, 'fecha');
  });

  it('should call setImporte store method when updating importe', () => {
    component.pagoDerechosForm.controls['importe'].setValue('5678');
    component.setValoresStore(component.pagoDerechosForm, 'importe');
  });
 
  it('should call setRevisados store method when updating revisados', () => {
    component.pagoDerechosForm.controls['revisados'].setValue(false);
    component.setValoresStore(component.pagoDerechosForm, 'revisados');
  });

  it('should clean up subscriptions on destroy', () => {
    const DESTROY_SPY = jest.spyOn(component['destroyNotifier$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(DESTROY_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});

