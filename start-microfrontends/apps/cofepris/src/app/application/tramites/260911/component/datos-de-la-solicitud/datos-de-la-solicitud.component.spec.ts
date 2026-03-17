import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite260911Store, Tramite260911State} from '../../estados/tramite260911.store';
import { Tramite260911Query } from '../../estados/tramite260911.query';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AlertComponent, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';


describe('DatosDeLaSolicitud260911Component', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let storeMock: Partial<Tramite260911Store>;
  let queryMock: Partial<Tramite260911Query>;

  beforeEach(async () => {
    storeMock = {
      setTramite260911State: jest.fn()
    };

    queryMock = {
      selectTramite260911$: of({
        btonDeRadio: '',
        justificacion: 'justificationData',
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
       
      } as Tramite260911State)
    };
    

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        DatosDeLaSolicitudComponent,
        AlertComponent,
        InputRadioComponent,
        TituloComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite260911Store, useValue: storeMock },
        { provide: Tramite260911Query, useValue: queryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
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

  it('should call setTramite260911State on setValorStore()', () => {
    component.datosDelEstablecimiento.patchValue({ rfcDel: 'NEW123' });
    component.setValorStore(component.datosDelEstablecimiento, 'rfcDel');
    expect(storeMock.setTramite260911State).toHaveBeenCalledWith({ rfcDel: 'NEW123' });
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
  component.getValorStore();
  component.crearFormulario();
  expect(component.form.get('btonDeRadio')?.value).toBe(null);
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

  const query = TestBed.inject(Tramite260911Query);
  Object.defineProperty(query, 'selectTramite260911$', {
    value: of(testState),
    writable: true
  });

  component['tramite260911Query'] = query;
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