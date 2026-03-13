import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosGeneralesComponent } from './datos-generales.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RegistroCuentasBancariasService } from '../../services/registro-cuentas-bancarias.service';
import { of } from 'rxjs';

describe('DatosGeneralesComponent', () => {
  let component: DatosGeneralesComponent;
  let fixture: ComponentFixture<DatosGeneralesComponent>;
  let registroCuentasBancariasService: RegistroCuentasBancariasService;

  const mockSolicitudesTabla = [
    {
      movimiento: 'Alta',
      cuenta: 'John Doe',
      rfc: 'TEST123456789',
      persona: 'Física',
      numeroDeCuenta: '1234567890',
      sucursal: 'Sucursal Test',
      institucionDeCredito: 'Banco Test',
      numero: '12345',
      radicaCuenta: 'México',
      estado: 'Activo',
      domicilio: 'Domicilio Test',
    },
  ];

  const mockSociedadTabla = [
    { id: 1, nombre: 'Sociedad Test 1' },
    { id: 2, nombre: 'Sociedad Test 2' },
  ];

  const mockFormDatosGenerales = {
    aduanaAdicional: 'Aduana Test',
    nombre: 'Nombre Test',
    federalDeContribuyentes: 'RFC123456',
    tipoDePersona: 'Física',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosGeneralesComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: RegistroCuentasBancariasService,
          useValue: {
            getSolicitudesTabla: jest.fn().mockReturnValue(of(mockSolicitudesTabla)),
            obtenerDatosDeFormularioDeAPI: jest.fn().mockReturnValue(
              of({ data: [mockFormDatosGenerales] })
            ),
            getSociedadTablaDatos: jest.fn().mockReturnValue(of({ data: mockSociedadTabla })),
            cambiarComponente: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesComponent);
    component = fixture.componentInstance;
    registroCuentasBancariasService = TestBed.inject(RegistroCuentasBancariasService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on component creation', () => {
    expect(component.formDatosGenerales).toBeDefined();
    expect(component.formDatosGenerales.get('aduanaAdicional')?.value).toBe('Aduana Test');
    expect(component.formDatosGenerales.get('nombre')?.value).toBe('Nombre Test');
    expect(component.formDatosGenerales.get('federalDeContribuyentes')?.value).toBe('RFC123456');
    expect(component.formDatosGenerales.get('tipoDePersona')?.value).toBe('Física');
  });

  it('should call getSolicitudesTabla and set registroDeSolicitudesTablaDatos', () => {
    component.getSolicitudesTabla();
    expect(registroCuentasBancariasService.getSolicitudesTabla).toHaveBeenCalled();
    expect(component.registroDeSolicitudesTablaDatos).toEqual(mockSolicitudesTabla);
  });

  it('should call obtenerDatosDeFormularioDeAPI and set form values', () => {
    component.obtenerFormDatosGeneralesDatos();
    expect(registroCuentasBancariasService.obtenerDatosDeFormularioDeAPI).toHaveBeenCalled();
    expect(component.formDatosGenerales.get('aduanaAdicional')?.value).toBe(
      mockFormDatosGenerales.aduanaAdicional
    );
    expect(component.formDatosGenerales.get('nombre')?.value).toBe(mockFormDatosGenerales.nombre);
    expect(component.formDatosGenerales.get('federalDeContribuyentes')?.value).toBe(
      mockFormDatosGenerales.federalDeContribuyentes
    );
    expect(component.formDatosGenerales.get('tipoDePersona')?.value).toBe(
      mockFormDatosGenerales.tipoDePersona
    );
  });

  it('should call getSociedadTabla and set sociedadDatos', () => {
    component.getSociedadTabla();
    expect(registroCuentasBancariasService.getSociedadTablaDatos).toHaveBeenCalled();
    expect(component.sociedadDatos).toEqual(mockSociedadTabla);
  });

  it('should call cambiarComponente on altaDeCuenta', () => {
    component.altaDeCuenta();
    expect(registroCuentasBancariasService.cambiarComponente).toHaveBeenCalledWith('AgregarCuenta');
  });

  it('should create a deep copy of an object', () => {
    const obj = { key: 'value' };
    const copy = component.deepCopy(obj);
    expect(copy).toEqual(obj);
    expect(copy).not.toBe(obj); // Ensure it's a deep copy
  });

  it('should verify if a value is an object', () => {
    expect(component.isObject({})).toBe(true);
    expect(component.isObject(null)).toBe(false);
    expect(component.isObject([])).toBe(true);
    expect(component.isObject('string')).toBe(false);
  });

  it('should verify if a value is a valid array', () => {
    expect(component.isValidArray([1, 2, 3])).toBe(true);
    expect(component.isValidArray([])).toBe(false);
    expect(component.isValidArray(null)).toBe(false);
    expect(component.isValidArray('string')).toBe(false);
  });

  it('should set confirmarNotificacion when eliminarRegistroSolicitud is called', () => {
    component.eliminarRegistroSolicitud();
    expect(component.confirmarNotificacion).toEqual({
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Aviso',
      mensaje: 'Seleccione una solicitud.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    });
  });

  it('should set confirmarNotificacion when editarRegistroSolicitud is called', () => {
    component.editarRegistroSolicitud();
    expect(component.confirmarNotificacion).toEqual({
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Mensaje',
      mensaje: 'Seleccione una solicitud.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    });
  });

  it('should set sociedadNotificacion when bajaDeCuentas is called', () => {
    component.bajaDeCuentas();
    expect(component.sociedadNotificacion).toEqual({
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Error',
      mensaje: 'Seleccione un renglón.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    });
  });

  it('should set sociedadNotificacion and call cambiarComponente when altaDeCuenta is called', () => {
    component.altaDeCuenta();
    expect(component.sociedadNotificacion).toEqual({
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Error',
      mensaje: 'Seleccione una sociedad.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    });
    expect(registroCuentasBancariasService.cambiarComponente).toHaveBeenCalledWith('AgregarCuenta');
  });

  it('should initialize configuracionTabla with correct headers and order', () => {
    expect(component.configuracionTabla.length).toBe(11);
    expect(component.configuracionTabla[0].encabezado).toBe('Tipo movimiento');
    expect(component.configuracionTabla[10].encabezado).toBe('Domicilio extranjero');
    expect(component.configuracionTabla[0].orden).toBe(1);
    expect(component.configuracionTabla[10].orden).toBe(11);
  });

  it('should initialize selectedRowIndex as null', () => {
    expect(component.selectedRowIndex).toBeNull();
  });

  it('should create formDatosGenerales with disabled controls', () => {
    component.crearFormDatosGenerales();
    expect(component.formDatosGenerales.get('aduanaAdicional')?.disabled).toBe(true);
    expect(component.formDatosGenerales.get('nombre')?.disabled).toBe(true);
    expect(component.formDatosGenerales.get('federalDeContribuyentes')?.disabled).toBe(true);
    expect(component.formDatosGenerales.get('tipoDePersona')?.disabled).toBe(true);
  });

  it('should call all initialization methods in ngOnInit', () => {
    const crearFormSpy = jest.spyOn(component, 'crearFormDatosGenerales');
    const getSolicitudesSpy = jest.spyOn(component, 'getSolicitudesTabla');
    const getSociedadSpy = jest.spyOn(component, 'getSociedadTabla');
    const obtenerFormSpy = jest.spyOn(component, 'obtenerFormDatosGeneralesDatos');
    component.ngOnInit();
    expect(crearFormSpy).toHaveBeenCalled();
    expect(getSolicitudesSpy).toHaveBeenCalled();
    expect(getSociedadSpy).toHaveBeenCalled();
    expect(obtenerFormSpy).toHaveBeenCalled();
  });
});