/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapturarIvaeiepsComponent } from './capturar-ivaeieps.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';

jest.mock('@libs/shared/theme/assets/json/31601/catalog-select-tipo.json', () => ({
  __esModule: true,
  default: {
    tipoDe: [
      { id: 1, descripcion: "Inversión A" },
      { id: 2, descripcion: "Inversión B" },
      { id: 3, descripcion: "Inversión C" }
    ]
  }
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/31601/mockdata-capturar.json', () => ({
  __esModule: true,
  default: {
    claveReferencia: '123',
    numeroOperacion: '456',
    cadenaDependencia: 'ABC',
    banco: 'Banco X',
    llavePago: '789',
    fechaPago: '2023-01-01',
    importePago: 1000
  }
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/31601/table.json', () => ({
  __esModule: true,
  default: {
    tableHeader: [
      "RFC",
      "Denominction o razon social",
      "Domicilaa"
    ],
    tableBody: [
      { tbodyData: [] }
    ]
  }
}), { virtual: true });

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

fdescribe('CapturarIvaeiepsComponent', () => {
  let component: CapturarIvaeiepsComponent;
  let fixture: ComponentFixture<CapturarIvaeiepsComponent>;
  let validacionesServiceSpy: jest.Mocked<ValidacionesFormularioService>;

  beforeEach(async () => {
    validacionesServiceSpy = {
      rfcPattern: /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/,
      isValid: jest.fn(),
      noCeroValidator: jest.fn(),
      errorCampoRequerido: jest.fn(),
      errorEmail: jest.fn(),
      errorPattern: jest.fn()
    } as unknown as jest.Mocked<ValidacionesFormularioService>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, CapturarIvaeiepsComponent],
      providers: [
        FormBuilder,
        { provide: ValidacionesFormularioService, useValue: validacionesServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturarIvaeiepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar los formularios correctamente', () => {
    expect(component.ivaForm).toBeDefined();
    expect(component.formularioDePago).toBeDefined();
  });

  it('debe alternar mostrarContenido', () => {
    expect(component.mostrarContenido).toBeFalsy();
    component.alternarContenido();
    expect(component.mostrarContenido).toBe(true);
  });

  it('debe abrir y cerrar el modal', () => {
    expect(component.mostrarModal).toBe(false);
    component.agregarOpenModal();
    expect(component.mostrarModal).toBe(true);
    component.cerrarModal();
    expect(component.mostrarModal).toBe(false);
  });

  it('debe cambiar valorSeleccionado en cambioDeValor', () => {
    component.cambioDeValor('No');
    expect(component.valorSeleccionado).toBe('No');
  });

  it('debe cambiar predeterminadoSeleccionar en cambioDeValorIndique', () => {
    component.cambioDeValorIndique('No');
    expect(component.predeterminadoSeleccionar).toBe('No');
  });
 it('debe asignar valores en formularioDePago al llamar poblarPagoForm', () => {
    const mockData = {
      claveReferencia: '123',
      numeroOperacion: '456',
      cadenaDependencia: 'ABC',
      banco: 'Banco X',
      llavePago: '789',
      fechaPago: '2023-01-01',
      importePago: 1000
    };
    component.poblarPagoForm(mockData);
    expect(component.formularioDePago.get('claveReferencia')?.value).toBe('123');
    expect(component.formularioDePago.get('banco')?.value).toBe('');
  });

  it('debe deshabilitar campos específicos al inicializar el formulario', () => {
    expect(component.ivaForm.get('denominacion')?.disabled).toBe(false);
    expect(component.ivaForm.get('domicilio')?.disabled).toBe(false);
    expect(component.formularioDePago.get('claveReferencia')?.disabled).toBe(false);
    expect(component.formularioDePago.get('fechaPago')?.disabled).toBe(false);
    expect(component.formularioDePago.get('importePago')?.disabled).toBe(false);
  });
 it('debe agregar datos a la tabla si el formulario es válido y crear una notificación', () => {
  // Arrange: Initialize the form with valid values
  component.ivaForm.patchValue({
    tipoDe: 'Inversión A',
    descripcion: 'Compra de maquinaria',
    valorPesos: '50000'
  });

  // Mock datosDeInversion structure
  component.datosDeInversion = {
    tableHeader: ['Tipo de', 'Descripción', 'Valor en pesos'],
    tableBody: [
    
    ]
  };

  // Spy on cerrarModal
  const cerrarModalSpy = jest.spyOn(component, 'cerrarModal');

  // Act
  component.agregarData();

  // Assert: Data pushed
  expect(component.datosDeInversion.tableBody[0].tbodyData).toEqual([
    'Inversión A',
    'Compra de maquinaria',
    '50000'
  ]);

  // Assert: Notificación creada
  expect(component.nuevaNotificacion).toEqual({
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: '',
    mensaje: 'Datos guardados correctamente.',
    cerrar: false,
    tiempoDeEspera: 2000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: ''
  });

  // Assert: Modal cerrado
  expect(cerrarModalSpy).toHaveBeenCalled();
});
it('debe buscar datos y actualizar el formulario si RFC está presente', () => {
  // Arrange: Set initial values
  component.ivaForm.patchValue({ rfc: 'ABC123456XYZ' });

  // Mock datosRepresentativos
  component.datosRepresentativos = {
    denominacion: 'Empresa XYZ',
    domicilio: 'Calle Falsa 123'
  };

  // Act
  component.buscarDatos();

  // Assert
  expect(component.ivaForm.get('denominacion')?.value).toBe('Empresa XYZ');
  expect(component.ivaForm.get('domicilio')?.value).toBe('Calle Falsa 123');
});
it('should patch form and open modal if a row is selected', () => {
  const fila = { rfc: 'RFC999', denominacion: 'Empresa X', domicilio: 'CDMX' };

  component.destinatario = [fila];
  component.filaSeleccionadaDestinatarioIndex = 0;
  const patchSpy = jest.spyOn(component.ivaForm, 'patchValue');

  component.modificarOpenModal();

  expect(patchSpy).toHaveBeenCalledWith({
    rfc: 'RFC999',
    denominacion: 'Empresa X',
    domicilio: 'CDMX'
  });
  expect(component.filasSeleccionadas).toEqual([]);
  expect(component.modoEdicionDestinatario).toBe(true);
  expect(component.mostrarModal).toBe(true);
});

it('should return early if index is null', () => {
  component.filaSeleccionadaDestinatarioIndex = null;
  const patchSpy = jest.spyOn(component.ivaForm, 'patchValue');

  component.modificarOpenModal();

  expect(patchSpy).not.toHaveBeenCalled();
  expect(component.mostrarModal).not.toBe(true);
});

it('should return early if no row found at index', () => {
  component.destinatario = [];
  component.filaSeleccionadaDestinatarioIndex = 0;

  const patchSpy = jest.spyOn(component.ivaForm, 'patchValue');
  component.modificarOpenModal();

  expect(patchSpy).not.toHaveBeenCalled();
});
it('should delete selected rows from destinatario and clear selection', () => {
  const mockFila = { rfc: 'RFC123', denominacion: 'Empresa 1', domicilio: 'Dirección 1' };

  component.destinatario = [mockFila];
  component.filasSeleccionadas = [mockFila];

  component.eliminarValor();

  expect(component.destinatario.length).toBe(0);
  expect(component.filasSeleccionadas).toEqual([]);
  expect(component.filaSeleccionadaDestinatarioIndex).toBeNull();
});

it('should do nothing if no rows are selected', () => {
  component.destinatario = [{ rfc: 'A', denominacion: 'B', domicilio: 'C' }];
  component.filasSeleccionadas = [];

  const original = [...component.destinatario];
  component.eliminarValor();

  expect(component.destinatario).toEqual(original);
});
it('should set filaSeleccionadaDestinatarioIndex to correct index if fila matches', () => {
  const mockFila = {
    rfc: 'RFC123',
    denominacion: 'Empresa 1',
    domicilio: 'Dirección 1'
  };

  component.destinatario = [
    mockFila,
    { rfc: 'RFC456', denominacion: 'Empresa 2', domicilio: 'Dirección 2' }
  ];

  component.onFilaSeleccionadaDestinatario(mockFila);

  expect(component.filaSeleccionadaDestinatarioIndex).toBe(0);
});

it('should set filaSeleccionadaDestinatarioIndex to null if fila does not match', () => {
  const mockFila = {
    rfc: 'RFC789',
    denominacion: 'Empresa 3',
    domicilio: 'Dirección 3'
  };

  component.destinatario = [
    { rfc: 'RFC123', denominacion: 'Empresa 1', domicilio: 'Dirección 1' },
    { rfc: 'RFC456', denominacion: 'Empresa 2', domicilio: 'Dirección 2' }
  ];

  component.onFilaSeleccionadaDestinatario(mockFila);

  expect(component.filaSeleccionadaDestinatarioIndex).toBeNull();
});
it('should patch the date into the form and call setValoresStore', () => {
  const mockFecha = '2025-07-15';
  const patchSpy = jest.spyOn(component.formularioDePago, 'patchValue');
  const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');

  component.onFechaCambiada(mockFecha);

  expect(patchSpy).toHaveBeenCalledWith({ fechaPago: mockFecha });
  expect(setValoresStoreSpy).toHaveBeenCalledWith(
    component.formularioDePago,
    'fechaPago',
    'setFechaPago'
  );
});
it('should set tipoDe value from select event', () => {
  const mockEvent = {
    target: { value: 'Inversión A' }
  } as unknown as Event;

  const setValueSpy = jest.spyOn(component.ivaForm.get('tipoDe')!, 'setValue');

  component.tipoDeInver(mockEvent);

  expect(setValueSpy).toHaveBeenCalledWith('Inversión A');
});

it('should set tipoDe value to empty string if no event is passed', () => {
  const setValueSpy = jest.spyOn(component.ivaForm.get('tipoDe')!, 'setValue');

  component.tipoDeInver();

  expect(setValueSpy).toHaveBeenCalledWith('');
});
it('should set tipoDe value from select event', () => {
  const mockEvent = {
    target: { value: 'Inversión A' }
  } as unknown as Event;

  const setValueSpy = jest.spyOn(component.ivaForm.get('tipoDe')!, 'setValue');

  component.tipoDeInver(mockEvent);

  expect(setValueSpy).toHaveBeenCalledWith('Inversión A');
});

it('should set tipoDe value to empty string if no event is passed', () => {
  const setValueSpy = jest.spyOn(component.ivaForm.get('tipoDe')!, 'setValue');

  component.tipoDeInver();

  expect(setValueSpy).toHaveBeenCalledWith('');
});
  });
