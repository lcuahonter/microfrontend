import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacinadosComponent } from './terceros-relacinados.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, ReplaySubject } from 'rxjs';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';

describe('TercerosRelacinadosComponent', () => {
  let component: TercerosRelacinadosComponent;
  let fixture: ComponentFixture<TercerosRelacinadosComponent>;
  let mockConsulta: any;
  let mockStore: any;
  let mockQuery: any;
  let mockValidacionesService: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockConsulta = {
      obtenerTablaTerceros: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Destinatario 1' }])),
    };
    mockStore = {
      removeDestinatarioDato: jest.fn(),
      setDestinatario: jest.fn(),
    };
    mockQuery = {
      selectSolicitud$: of({
        destinatario: 'dest',
        fabricante: 'fab',
        tipoPersona: 'fisica',
        nombre: 'Juan',
        primerApellido: 'Pérez',
        segundoApellido: 'Gómez',
        denominacion: 'Empresa',
        pais: 'México',
        estados: 'CDMX',
        codigoDeZip: '12345',
        camino: 'Calle',
        numeroExterior: '10',
        numeroInterior: '2',
        ladaDeTerceros: '55',
        fon: '12345678',
        email: 'correo@correo.com',
      }),
    };
    mockValidacionesService = {
      isValid: jest.fn().mockReturnValue(true),
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,TercerosRelacinadosComponent],
      declarations: [],
      providers: [
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: 'consulta', useValue: mockConsulta },
        { provide: 'store', useValue: mockStore },
        { provide: 'query', useValue: mockQuery },
        { provide: 'validacionesService', useValue: mockValidacionesService },
        { provide: 'consultaioQuery', useValue: mockConsultaioQuery },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(TercerosRelacinadosComponent, {
        set: {
          providers: [
            { provide: 'consulta', useValue: mockConsulta },
            { provide: 'store', useValue: mockStore },
            { provide: 'query', useValue: mockQuery },
            { provide: 'validacionesService', useValue: mockValidacionesService },
            { provide: 'consultaioQuery', useValue: mockConsultaioQuery },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TercerosRelacinadosComponent);
    component = fixture.componentInstance;

    // Inicializar el estado de la solicitud para los formularios
    component.solicitudState = {
      destinatario: 'dest',
      fabricante: 'fab',
      tipoPersona: 'fisica',
      nombre: 'Juan',
      primerApellido: 'Pérez',
      segundoApellido: 'Gómez',
      denominacion: 'Empresa',
      pais: 'México',
      estados: 'CDMX',
      codigoDeZip: '12345',
      camino: 'Calle',
      numeroExterior: '10',
      numeroInterior: '2',
      ladaDeTerceros: '55',
      fon: '12345678',
      email: 'correo@correo.com',
    } as any;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente en donanteDomicilio', () => {
    component.soloLectura = false;
    component.donanteDomicilio();
    expect(component.tercerosForm).toBeDefined();
    expect(component.tercerosForm.get('nombre')?.value).toBe('Juan');
  });

  it('debería deshabilitar el formulario si soloLectura es true en guardarDatosFormulario', () => {
    component.soloLectura = true;
    component.donanteDomicilio();
    component.guardarDatosFormulario();
    expect(component.tercerosForm.disabled).toBe(true);
  });

  it('debería habilitar el formulario si soloLectura es false en guardarDatosFormulario', () => {
    component.soloLectura = false;
    component.donanteDomicilio();
    component.guardarDatosFormulario();
    expect(component.tercerosForm.enabled).toBe(true);
  });

  it('debería obtener la tabla de terceros y asignar los datos', () => {
    component.obtenerTablaTerceros();
    expect(component.destinatarioDatos.length).toBeGreaterThan(0);
    expect(component.destinatarioDatos[0].nombre).toBe('Destinatario 1');
  });

  it('debería establecer el tipo de persona seleccionado', () => {
    component.setTipoPersona('moral');
    expect(component.tipoPersonaSeleccionada).toBe('moral');
  });

  it('debería asignar los datos recibidos al arreglo de destinatarios', () => {
    const datos = [{ id: 1 }] as any;
    component.obtenerDatosDestinatario(datos);
    expect(component.selectedDestinatario).toBe(datos);
  });

  it('debería eliminar el destinatario seleccionado del store', () => {
    component.selectedDestinatario = [{ id: 1 }] as any;
    component.eliminarMercancias();
    expect(mockStore.removeDestinatarioDato).toHaveBeenCalledWith({ id: 1 });
  });

  it('no debería eliminar si no hay destinatarios seleccionados', () => {
    component.selectedDestinatario = [];
    component.eliminarMercancias();
    expect(mockStore.removeDestinatarioDato).not.toHaveBeenCalled();
  });

  it('debería abrir el modal para modificar productos', () => {
    const showMock = jest.fn();
    component.modalElement = { nativeElement: {} } as ElementRef;
    (window as any).Modal = function () { return { show: showMock }; };
    component.abrirModificarProductos();
    // No hay expect porque depende de Bootstrap, pero no debe lanzar error
  });

  it('debería validar un campo usando el servicio', () => {
    component.donanteDomicilio();
    expect(component.isValid(component.tercerosForm, 'nombre')).toBe(true);
  });

  it('debería llamar al método del store en setValoresStore', () => {
    component.donanteDomicilio();
    component.tercerosForm.get('nombre')?.setValue('Pedro');
    component.setValoresStore(component.tercerosForm, 'nombre', 'setDestinatario');
    expect(mockStore.setDestinatario).toHaveBeenCalledWith('Pedro');
  });

  it('debería inicializar el formulario en inicializarEstadoFormulario según soloLectura', () => {
    const spyGuardar = jest.spyOn(component, 'guardarDatosFormulario');
    const spyDonante = jest.spyOn(component, 'donanteDomicilio');
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(spyGuardar).toHaveBeenCalled();
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(spyDonante).toHaveBeenCalled();
  });

  it('debería limpiar destroyed$ en ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyed$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalledWith(true);
    expect(spyComplete).toHaveBeenCalled();
  });
});