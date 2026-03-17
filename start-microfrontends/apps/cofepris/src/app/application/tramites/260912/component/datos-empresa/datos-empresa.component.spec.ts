import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosEmpresaComponent } from './datos-empresa.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite260912Store, Tramites260912State} from '../../estados/tramite-260912.store';
import { Tramite260912Query } from '../../estados/tramite-260912.query';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AlertComponent, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';

describe('DatosEmpresaComponent', () => {
  let component: DatosEmpresaComponent;
  let fixture: ComponentFixture<DatosEmpresaComponent>;
  let storeMock: Partial<Tramite260912Store>;
  let queryMock: Partial<Tramite260912Query>;

  beforeEach(async () => {
    storeMock = {
      setTramite260912State: jest.fn()
    };

    queryMock = {
      selectTramite260912$: of({
        btonDeRadio: '',
        justificacion: '',
        rfcDel: 'RFC123',
        denominacion: 'Empresa S.A.',
        correo: 'correo@test.com',
        codigoPostal: '',
        estado: null,
        municipioOAlcaldia: '',
        localidad: '',
        colonias: '',
        calle: '',
        lada: '',
        telefono: '',
        avisoCheckbox: '',
        regimen: null,
        aduanasEntradas: null,
        aifaCheckbox: '',
        manifests: '',
        acuerdoPublico: '',
        rfc: '',
        claveDeReferencia: '',
        cadenaPagoDependencia: '',
        clave: '',
        llaveDePago: '',
        fecPago: '',
        impPago: '',
       
      } as Tramites260912State)
    };
    

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        DatosEmpresaComponent,
        AlertComponent,
        InputRadioComponent,
        TituloComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite260912Store, useValue: storeMock },
        { provide: Tramite260912Query, useValue: queryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
    expect(component.form).toBeDefined();
    expect(component.datosDelEstablecimiento).toBeDefined();
  });

  it('should toggle colapsable state', () => {
    const initial = component.colapsable;
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(!initial);
  });

  it('should enable disabled form controls', () => {
    component.datosDelEstablecimiento.get('rfcDel')?.disable();
    component.datosDelEstablecimiento.get('correo')?.disable();
    component.toggleFormControls();
    expect(component.datosDelEstablecimiento.get('rfcDel')?.enabled).toBe(false);
    expect(component.datosDelEstablecimiento.get('correo')?.enabled).toBe(false);
  });

  it('should call setTramite260912State on setValorStore()', () => {
    component.datosDelEstablecimiento.patchValue({ rfcDel: 'NEW123' });
    component.setValorStore(component.datosDelEstablecimiento, 'rfcDel');
    expect(storeMock.setTramite260912State).toHaveBeenCalledWith({ rfcDel: 'NEW123' });
  });

  it('should set estadoSeleccionado from store', () => {
    expect(Object.keys(component.estadoSeleccionado)).toEqual(
      expect.arrayContaining(['rfcDel', 'denominacion', 'correo'])
    );
  });

  it('should destroy subscriptions on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

it('should create form and datosDelEstablecimiento with initial values from estadoSeleccionado', () => {
  component.getValorStore(); // Ensure estadoSeleccionado is set from the mock store
  component.crearFormulario();
  expect(component.form.get('btonDeRadio')?.value).toBe('');
  expect(component.form.get('justificacion')?.value).toBe('justificationData');
  expect(component.datosDelEstablecimiento.get('rfcDel')?.value).toBe('RFC123');
  expect(component.datosDelEstablecimiento.get('denominacion')?.value).toBe('Empresa S.A.');
  expect(component.datosDelEstablecimiento.get('correo')?.value).toBe('correo@test.com');
});

it('should update estadoSeleccionado when getValorStore is called', () => {
  const testState = {
    btonDeRadio: 'radio2',
    justificacion: 'justificacion2',
    rfcDel: 'RFCY',
    denominacion: 'Empresa Y',
    correo: 'correo@y.com'
  } as any;

  const query = TestBed.inject(Tramite260912Query);
  Object.defineProperty(query, 'selectTramite260912$', {
    value: of(testState),
    writable: true
  });

  component['tramite260912Query'] = query;
  component.getValorStore();

  expect(component.estadoSeleccionado).toEqual(testState);
});

  it('should disable controls when esFormularioSoloLectura is true', () => {
  component.form = component['fb'].group({
    btonDeRadio: ['radio1'],
    justificacion: ['test']
  });
  component.datosDelEstablecimiento = component['fb'].group({
    rfcDel: ['RFCX'],
    denominacion: ['Empresa X'],
    correo: ['correo@x.com']
  });
  component.esFormularioSoloLectura = true;
  component.inicializarEstadoFormulario();
  expect(component.form.get('btonDeRadio')?.disabled).toBe(true);
  expect(component.form.get('justificacion')?.disabled).toBe(true);
  expect(component.datosDelEstablecimiento.get('rfcDel')?.disabled).toBe(true);
  expect(component.datosDelEstablecimiento.get('denominacion')?.disabled).toBe(true);
  expect(component.datosDelEstablecimiento.get('correo')?.disabled).toBe(true);
});
});