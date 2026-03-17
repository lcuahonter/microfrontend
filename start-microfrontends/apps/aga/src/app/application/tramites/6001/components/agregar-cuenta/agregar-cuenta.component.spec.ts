import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarCuentaComponent } from './agregar-cuenta.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RegistroCuentasBancariasService } from '../../services/registro-cuentas-bancarias.service';
import { Tramite6001Store } from '../../estados/tramite6001.store';
import { Tramite6001Query } from '../../estados/tramite6001.query';
import { of, Subject } from 'rxjs';

describe('AgregarCuentaComponent', () => {
  let component: AgregarCuentaComponent;
  let fixture: ComponentFixture<AgregarCuentaComponent>;
  let registroCuentasBancariasService: RegistroCuentasBancariasService;
  let tramite6001Store: Tramite6001Store;
  let tramite6001Query: Tramite6001Query;

  const mockAgregarCuentaState = {
    titularDeLaCuenta: 'John Doe',
    tipoDePersona: 'Física',
    rfc: 'TEST123456789',
    numeroDeCuenta: '1234567890',
    paisDondeRadica: 'México',
    institucion: 'Banco Test',
    estado: 'Activo',
    sucursal: 'Sucursal Test',
    numeroDePlaza: '12345',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarCuentaComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: RegistroCuentasBancariasService,
          useValue: {
            getTipoDePersonaDatos: jest.fn().mockReturnValue(of({ data: ['Física', 'Moral'] })),
            getPaisDondeRadicaDatos: jest.fn().mockReturnValue(of({ data: ['México', 'USA'] })),
            getInstitucionDatos: jest.fn().mockReturnValue(of({ data: ['Banco Test', 'Banco Demo'] })),
            getEstadoDatos: jest.fn().mockReturnValue(of({ data: ['Activo', 'Inactivo'] })),
            cambiarComponente: jest.fn(),
          },
        },
        {
          provide: Tramite6001Store,
          useValue: {
            setTitularDeLaCuenta: jest.fn(),
            setTipoDePersona: jest.fn(),
            setRfc: jest.fn(),
            setNumeroDeCuenta: jest.fn(),
            setPaisDondeRadica: jest.fn(),
            setInstitucion: jest.fn(),
            setEstado: jest.fn(),
            setSucursal: jest.fn(),
            setNumeroDePlaza: jest.fn(),
          },
        },
        {
          provide: Tramite6001Query,
          useValue: {
            agregarCuenta$: of(mockAgregarCuentaState),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarCuentaComponent);
    component = fixture.componentInstance;
    registroCuentasBancariasService = TestBed.inject(RegistroCuentasBancariasService);
    tramite6001Store = TestBed.inject(Tramite6001Store);
    tramite6001Query = TestBed.inject(Tramite6001Query);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on component creation', () => {
    expect(component.agregarCuentaForm).toBeDefined();
    expect(component.agregarCuentaForm.get('titularDeLaCuenta')?.value).toBe(mockAgregarCuentaState.titularDeLaCuenta);
    expect(component.agregarCuentaForm.get('rfc')?.value).toBe(mockAgregarCuentaState.rfc);
  });

  it('should call getTipoDePersona and set tipoDePersona', () => {
    component.getTipoDePersona();
    expect(registroCuentasBancariasService.getTipoDePersonaDatos).toHaveBeenCalled();
    expect(component.tipoDePersona).toEqual(['Física', 'Moral']);
  });

  it('should call getPaisDondeRadica and set paisDondeRadica', () => {
    component.getPaisDondeRadica();
    expect(registroCuentasBancariasService.getPaisDondeRadicaDatos).toHaveBeenCalled();
    expect(component.paisDondeRadica).toEqual(['México', 'USA']);
  });

  it('should call getInstitucion and set institucion', () => {
    component.getInstitucion();
    expect(registroCuentasBancariasService.getInstitucionDatos).toHaveBeenCalled();
    expect(component.institucion).toEqual(['Banco Test', 'Banco Demo']);
  });

  it('should call getEstado and set estado', () => {
    component.getEstado();
    expect(registroCuentasBancariasService.getEstadoDatos).toHaveBeenCalled();
    expect(component.estado).toEqual(['Activo', 'Inactivo']);
  });

  it('should set valores in the store using setValoresStore', () => {
    const spy = jest.spyOn(tramite6001Store, 'setRfc');
    component.setValoresStore(component.agregarCuentaForm, 'rfc', 'setRfc');
    expect(spy).toHaveBeenCalledWith(mockAgregarCuentaState.rfc);
  });

  it('should call cambiarComponente on guardar', () => {
    component.guardar();
    expect(registroCuentasBancariasService.cambiarComponente).toHaveBeenCalledWith('DatosGenerales');
  });

  it('should clean up subscriptions on component destroy', () => {
    const spyNext = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});