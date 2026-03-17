import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { Tramite250102Store } from '../../estados/tramite250102.store';
import { Tramite250102Query } from '../../estados/tramite250102.query';
import { CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite250102State } from '../../estados/tramite250102.store';

jest.mock('@libs/shared/theme/assets/json/250102/banco.json', () => ({
  __esModule: true,
  default: {
    banco: [{ id: 1, descripcion: 'MockBank1' }, { id: 2, descripcion: 'MockBank2' }]
  }
}));

jest.mock('@libs/shared/theme/assets/json/250102/pago-formdatos.json', () => ({
  __esModule: true,
  default: {
    formData: {
      clave: 'mockClave',
      dependencia: 'mockDependencia',
      importe: '1234',
    },
  },
}));

const MOCK_SOLICITUD_STATE: Tramite250102State = {
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
  let tramite250102Store: Tramite250102Store;

  const TRAMITE250102_STORE_MOCK = {
    setClave: jest.fn(),
    setDependencia: jest.fn(),
    setBanco: jest.fn(),
    setLlave: jest.fn(),
    setFecha: jest.fn(),
    setImporte: jest.fn(),
    setRevisados: jest.fn(),
  };

const TRAMITE250102_QUERY_MOCK = {
  selectSolicitud$: of(MOCK_SOLICITUD_STATE),
  selectTramiteState$: of(MOCK_SOLICITUD_STATE), // <-- Add this line
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
        { provide: Tramite250102Store, useValue: TRAMITE250102_STORE_MOCK },
        { provide: Tramite250102Query, useValue: TRAMITE250102_QUERY_MOCK },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
    tramite250102Store = TestBed.inject(Tramite250102Store);
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


it('should clean up subscriptions on destroy', () => {
    const DESTROY_SPY = jest.spyOn(component['destroyNotifier$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(DESTROY_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});

