import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import {
  Solicitud221603State,
  Tramite221603Store,
} from '../../estados/tramite221603.store';
import { Tramite221603Query } from '../../estados/tramite221603.query';
import { SanidadService } from '../../service/sanidad.service';
import {
  CatalogoSelectComponent,
  InputRadioComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';

const mockSolicitudState: Solicitud221603State = {
  justificacion: 'Test Justification',
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
  clave: '454000554',
  dependencia: '0001840646CAIM',
  banco: 'BBVA',
  llave: '1234',
  fecha: '2025-04-07',
  importe: '1281',
  exento: '1',
};

const mockFormularioDatos = {
  clave: '123456789',
  dependencia: 'DEPENDENCIA_TEST',
  importe: '1500',
};

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;
  let tramite221603Store: Tramite221603Store;
  let tramite221603Query: Tramite221603Query;
  let sanidadService: SanidadService;

  const tramite221603StoreMock = {
    setExentoDePago: jest.fn(),
    setClave: jest.fn(),
    setDependencia: jest.fn(),
    setBanco: jest.fn(),
    setLlave: jest.fn(),
    setFecha: jest.fn(),
    setImporte: jest.fn(),
  };

  const tramite221603QueryMock = {
    selectSolicitud$: of(mockSolicitudState),
  };

  const sanidadServiceMock = {
    inicializaPagoDeDerechosDatosCatalogos: jest.fn(),
    obtenerFormularioDatos: jest.fn().mockReturnValue(of(mockFormularioDatos)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagoDeDerechosComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TituloComponent,
        InputRadioComponent,
        CatalogoSelectComponent,
      ],
      providers: [
        FormBuilder,
        { provide: Tramite221603Store, useValue: tramite221603StoreMock },
        { provide: Tramite221603Query, useValue: tramite221603QueryMock },
        { provide: SanidadService, useValue: sanidadServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
    tramite221603Store = TestBed.inject(Tramite221603Store);
    tramite221603Query = TestBed.inject(Tramite221603Query);
    sanidadService = TestBed.inject(SanidadService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with values from solicitudState and formularioDatos', () => {
    component.ngOnInit();

    expect(component.pagoDerechosForm.controls['clave'].value).toBe(
      mockFormularioDatos.clave
    );
    expect(component.pagoDerechosForm.controls['dependencia'].value).toBe(
      mockFormularioDatos.dependencia
    );
    expect(component.pagoDerechosForm.controls['importe'].value).toBe(
      mockFormularioDatos.importe
    );
    expect(component.pagoDerechosForm.controls['banco'].value).toBe(
      mockSolicitudState.banco
    );
    expect(component.pagoDerechosForm.controls['llave'].value).toBe(
      mockSolicitudState.llave
    );
    expect(component.pagoDerechosForm.controls['fecha'].value).toBe(
      mockSolicitudState.fecha
    );
  });

  it('should disable clave, dependencia, and importe fields', () => {
    component.ngOnInit();
    expect(component.pagoDerechosForm.controls['clave'].disabled).toBe(true);
    expect(component.pagoDerechosForm.controls['dependencia'].disabled).toBe(
      true
    );
    expect(component.pagoDerechosForm.controls['importe'].disabled).toBe(true);
  });

  it('should call the store method setExentoDePago when updating exentoDePago', () => {
    component.actualizarExento('0');
    expect(tramite221603Store.setExentoDePago).toHaveBeenCalledWith('0');
  });

  it('should clear and disable form controls when exentoDePago is set to 1', () => {
    component.actualizarExento('1');
    expect(component.pagoDerechosForm.controls['clave'].value).toBe('');
    expect(component.pagoDerechosForm.controls['clave'].disabled).toBe(true);
    expect(component.pagoDerechosForm.controls['dependencia'].value).toBe('');
    expect(component.pagoDerechosForm.controls['dependencia'].disabled).toBe(
      true
    );
    expect(component.pagoDerechosForm.controls['banco'].value).toBe(0);
    expect(component.disableBanco).toBe(true);
    expect(component.pagoDerechosForm.controls['llave'].value).toBe('');
    expect(component.pagoDerechosForm.controls['llave'].disabled).toBe(true);
    expect(component.pagoDerechosForm.controls['fecha'].value).toBe('');
    expect(component.pagoDerechosForm.controls['fecha'].disabled).toBe(true);
    expect(component.pagoDerechosForm.controls['importe'].value).toBe('');
    expect(component.pagoDerechosForm.controls['importe'].disabled).toBe(true);
  });

  it('should call the store method setClave when updating the form', () => {
    component.pagoDerechosForm.controls['clave'].setValue('555555555');
    component.setValoresStore('clave', 'setClave');
    expect(tramite221603Store.setClave).toHaveBeenCalledWith('555555555');
  });

  it('should call the store method setDependencia when updating the form', () => {
    component.pagoDerechosForm.controls['dependencia'].setValue(
      '0000000000XYZ'
    );
    component.setValoresStore('dependencia', 'setDependencia');
    expect(tramite221603Store.setDependencia).toHaveBeenCalledWith(
      '0000000000XYZ'
    );
  });

  it('should call the store method setBanco when updating the form', () => {
    component.pagoDerechosForm.controls['banco'].setValue('Banorte');
    component.setValoresStore('banco', 'setBanco');
    expect(tramite221603Store.setBanco).toHaveBeenCalledWith('Banorte');
  });

  it('should call the store method setLlave when updating the form', () => {
    component.pagoDerechosForm.controls['llave'].setValue('5678');
    component.setValoresStore('llave', 'setLlave');
    expect(tramite221603Store.setLlave).toHaveBeenCalledWith('5678');
  });

  it('should call the store method setFecha when updating the form', () => {
    component.pagoDerechosForm.controls['fecha'].setValue('2025-04-08');
    component.setValoresStore('fecha', 'setFecha');
    expect(tramite221603Store.setFecha).toHaveBeenCalledWith('2025-04-08');
  });

  it('should call the store method setImporte when updating the form', () => {
    component.pagoDerechosForm.controls['importe'].setValue('1500');
    component.setValoresStore('importe', 'setImporte');
    expect(tramite221603Store.setImporte).toHaveBeenCalledWith('1500');
  });

  it('should call ngOnDestroy and clean up resources', () => {
    const destroyNotifierSpy = jest.spyOn(
      component['destroyNotifier$'],
      'next'
    );
    const destroyNotifierCompleteSpy = jest.spyOn(
      component['destroyNotifier$'],
      'complete'
    );
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

  it('should disable fecha, llave, and exentoDePago when esFormularioSoloLectura is true', () => {
    component.pagoDerechosForm = component['formBuilder'].group({
      fecha: ['test'],
      llave: ['test'],
      exentoDePago: ['test'],
    });
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.pagoDerechosForm.get('fecha')?.disabled).toBe(true);
    expect(component.pagoDerechosForm.get('llave')?.disabled).toBe(true);
    expect(component.pagoDerechosForm.get('exentoDePago')?.disabled).toBe(true);
  });

  it('should enable fecha, llave, and exentoDePago when esFormularioSoloLectura is false', () => {
    component.pagoDerechosForm = component['formBuilder'].group({
      fecha: ['test'],
      llave: ['test'],
      exentoDePago: ['test'],
    });
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.pagoDerechosForm.get('fecha')?.enabled).toBe(true);
    expect(component.pagoDerechosForm.get('llave')?.enabled).toBe(true);
    expect(component.pagoDerechosForm.get('exentoDePago')?.enabled).toBe(true);
  });

  it('should set and disable clave, dependencia, and importe in actualizarControlesDelFormulario', () => {
    component.pagoDerechosForm = component['formBuilder'].group({
      clave: [''],
      dependencia: [''],
      importe: [''],
    });
    component.formularioDatos = {
      clave: 'CLAVE_TEST',
      dependencia: 'DEP_TEST',
      importe: '999',
    } as any;
    component.actualizarControlesDelFormulario();
    expect(component.pagoDerechosForm.get('clave')?.value).toBe('CLAVE_TEST');
    expect(component.pagoDerechosForm.get('clave')?.disabled).toBe(true);
    expect(component.pagoDerechosForm.get('dependencia')?.value).toBe(
      'DEP_TEST'
    );
    expect(component.pagoDerechosForm.get('dependencia')?.disabled).toBe(true);
    expect(component.pagoDerechosForm.get('importe')?.value).toBe('999');
    expect(component.pagoDerechosForm.get('importe')?.disabled).toBe(true);
  });
});
