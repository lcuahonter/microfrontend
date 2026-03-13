jest.mock('@libs/shared/theme/assets/json/221601/zoosanitario.json', () => ({
  __esModule: true,
  default: {
    exportador: [
      {
        nombreDenominacionORazonSocial: 'dfdfsd',
        telefono: '---',
        correoElectronico: '---',
        domicilio: 'dfgdfgfd',
        pais: 'BELICE'
      }
    ],
    destinatario: [
      {
        nombreDenominacionORazonSocial: 'ADVICS MANUFACTURING MEXICO S DE R.L. DE C.V.',
        telefono: '555-3456789',
        correoElectronico: 'nose@gmail.com',
        calle: 'Av. Cazcanes',
        numeroExterior: '2210',
        numeroInterior: '',
        pais: 'MEXICO (ESTADOS UNIDOS MEXICANOS)',
        colonia: 'COLINAS DE LAGOS',
        municipioOAlcaldia: 'LAGOS DE MORENO',
        entidadFederativa: 'JALISCO',
        codigoPostal: '47515'
      }
    ],
    pais: [
      { id: 'MEX', descripcion: 'MÉXICO' }
    ],
    estado: [
      { id: 'JAL', descripcion: 'Jalisco' },
      { id: 'CDMX', descripcion: 'Ciudad de México' }
    ],
    municipio: [
      { id: 'LAGOS', descripcion: 'Lagos de Moreno' }
    ],
    colonia: [
      { id: 'COLINAS', descripcion: 'Colinas de Lagos' }
    ]
  }
}), { virtual: true });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { of, Subject } from 'rxjs';
import { TercerosComponent } from './terceros.component';
import { TituloComponent, TablaDinamicaComponent, AlertComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import realizar from '@libs/shared/theme/assets/json/221601/zoosanitario.json';
import { MENSAJE_TABLA_OBLIGATORIA } from '@libs/shared/data-access-user/src/core/models/221601/zoosanitario.model';
import { Tramite221601Store } from '../../../../estados/tramites/tramite221601.store';
import { Tramite221601Query } from '../../../../estados/queries/tramite221601.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Component } from '@angular/core';

// Mock the ModalComponent
@Component({
  selector: 'app-modal',
  template: '<div>Mock Modal</div>',
  standalone: true
})
class MockModalComponent {}

const mockExportador = realizar.exportador;
const mockDestinatario = realizar.destinatario;

describe('TercerosComponent', () => {
  let component: TercerosComponent;
  let fixture: ComponentFixture<TercerosComponent>;
  let mockTramite221601Store: any;
  let mockTramite221601Query: any;
  let mockConsultaioQuery: any;
  let mockChangeDetectorRef: any;
  let mockValidacionesService: any;

  const mockSolicitudState = {
    tipoPersona: 'fisica',
    nombre: 'Test Name',
    primerApellido: 'Test Apellido',
    segundoApellido: 'Test Segundo',
    social: 'Test Social',
    pais: 'MEX',
    codigo: '12345',
    estado: 'JAL',
    municipio: 'LAGOS',
    colonia: 'COLINAS',
    calle: 'Test Calle',
    exterior: '123',
    interior: 'A',
    lada: '33',
    telefono: '1234567890',
    correoElectronico: 'test@test.com',
    tif: 'TIF123'
  };

  beforeEach(async () => {
    mockTramite221601Store = {
      update: jest.fn(),
      setTipoPersona: jest.fn(),
      setNombre: jest.fn()
    };

    mockTramite221601Query = {
      selectSolicitud$: of(mockSolicitudState)
    };

    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    mockChangeDetectorRef = {
      detectChanges: jest.fn()
    };

    mockValidacionesService = {
      validarFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TercerosComponent, TituloComponent, TablaDinamicaComponent, AlertComponent, ReactiveFormsModule, MockModalComponent],
      providers: [
        FormBuilder,
        { provide: Tramite221601Store, useValue: mockTramite221601Store },
        { provide: Tramite221601Query, useValue: mockTramite221601Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
        { provide: ValidacionesFormularioService, useValue: mockValidacionesService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct TEXTOS value', () => {
    expect(component.TEXTOS).toBe(MENSAJE_TABLA_OBLIGATORIA);
  });

  it('should initialize exportador list correctly', () => {
    expect(component.exportador).toEqual(mockExportador);

  });

it('should correctly handle tipoPersona change', () => {
  // Mock datosPersonales with enable/disable methods
  component.datosPersonales = {
    enable: jest.fn(),
    disable: jest.fn()
  } as any;

  component.handleTipoPersonaChange('fisica');
  expect(component.showFisicaRow).toBe(true);
  expect(component.showMoralRow).toBe(false);
  expect(component.showPlantaRow).toBe(false);
  expect(component.datosPersonales.enable).toHaveBeenCalled();

  component.handleTipoPersonaChange('moral');
  expect(component.showFisicaRow).toBe(false);
  expect(component.showMoralRow).toBe(true);
  expect(component.showPlantaRow).toBe(false);
  expect(component.datosPersonales.enable).toHaveBeenCalled();

  component.handleTipoPersonaChange('planta');
  expect(component.showPlantaRow).toBe(true);
  expect(component.showFisicaRow).toBe(false);
  expect(component.showMoralRow).toBe(true);
  expect(component.datosPersonales.disable).toHaveBeenCalled();
});
it('should toggle showtercerosModal when cancelarDestinatario or tercerosAgregar is called', () => {
  component.showtercerosModal = false;

  component.tercerosAgregar();
  expect(component.showtercerosModal).toBe(true);

  component.cancelarDestinatario();
  expect(component.showtercerosModal).toBe(false);
});
  it('should have the correct configuracionTabla for exportador', () => {
    expect(component.configuracionTabla.length).toBe(5);
    expect(component.configuracionTabla[0].encabezado).toBe('Nombre/denominación o razón social');
    expect(component.configuracionTabla[1].encabezado).toBe('Teléfono');
    expect(component.configuracionTabla[2].encabezado).toBe('Correo electrónico');
    expect(component.configuracionTabla[3].encabezado).toBe('Domicilio');
  });

  it('should have the correct configuracionTablaDatos for destinatario', () => {
    expect(component.configuracionTablaDatos.length).toBe(11);
    expect(component.configuracionTablaDatos[0].encabezado).toBe('Nombre/denominación o razón social');
    expect(component.configuracionTablaDatos[1].encabezado).toBe('Teléfono');
    expect(component.configuracionTablaDatos[2].encabezado).toBe('Correo electrónico');
    expect(component.configuracionTablaDatos[3].encabezado).toBe('Calle');
    expect(component.configuracionTablaDatos[4].encabezado).toBe('Número exterior');
  });

  it('should display the exportador table correctly', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('.exportador-table-row');
    expect(tableRows.length).toBe(0); 
  });

  it('should display the destinatario table correctly', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('.destinatario-table-row');
    expect(tableRows.length).toBe(0); 
  });

  // Test ngOnInit lifecycle method
  it('should call inicializarCertificadoFormulario on ngOnInit', () => {
    const spy = jest.spyOn(component, 'inicializarCertificadoFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  // Test ngOnDestroy lifecycle method
  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  // Test inicializarCertificadoFormulario method
  it('should call guardarDatosFormulario when esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    
    component.inicializarCertificadoFormulario();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario when esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    const spy = jest.spyOn(component, 'inicializarFormulario');
    
    component.inicializarCertificadoFormulario();
    
    expect(spy).toHaveBeenCalled();
  });

  // Test guardarDatosFormulario method
  it('should disable forms when esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    
    // Spy on inicializarFormulario to avoid form recreation
    const inicializarSpy = jest.spyOn(component, 'inicializarFormulario');
    
    component.guardarDatosFormulario();
    
    expect(inicializarSpy).toHaveBeenCalled();
    // After guardarDatosFormulario, forms should be disabled when esFormularioSoloLectura is true
    expect(component.tipoPersonaForm.disabled).toBe(true);
    expect(component.datosPersonales.disabled).toBe(true);
  });

  it('should enable forms when esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = false;
    
    // Spy on inicializarFormulario to avoid form recreation
    const inicializarSpy = jest.spyOn(component, 'inicializarFormulario');
    
    component.guardarDatosFormulario();
    
    expect(inicializarSpy).toHaveBeenCalled();
    // After guardarDatosFormulario, forms should be enabled when esFormularioSoloLectura is false
    expect(component.tipoPersonaForm.disabled).toBe(false);
    expect(component.datosPersonales.disabled).toBe(false);
  });

  // Test updateStoreWithFormData method
  it('should update store with form data in updateStoreWithFormData', () => {
    component.inicializarFormulario();
    
    component.updateStoreWithFormData();
    
    expect(mockTramite221601Store.update).toHaveBeenCalledWith(
      expect.objectContaining({
        pais: component.datosPersonales.get('pais')?.value
      })
    );
  });

  // Test setValoresStore method
  it('should call store method with form value in setValoresStore', () => {
    component.inicializarFormulario();
    const testValue = 'testValue';
    component.datosPersonales.get('nombre')?.setValue(testValue);
    
    component.setValoresStore(component.datosPersonales, 'nombre', 'setNombre');
    
    expect(mockTramite221601Store.setNombre).toHaveBeenCalledWith(testValue);
  });

  // Test guardarDestinatario method  
  it('should add destinatario and close modal in guardarDestinatario', () => {
    component.inicializarFormulario();
    component.showtercerosModal = true;
    
    // Set form values
    component.datosPersonales.patchValue({
      nombre: 'Test Name',
      telefono: '1234567890',
      correoElectronico: 'test@test.com',
      calle: 'Test Street',
      exterior: '123',
      interior: 'A',
      colonia: 'Test Colony',
      municipio: 'Test Municipality',
      estado: 'Test State',
      codigo: '12345'
    });
    
    const initialLength = component.destinatario.length;
    
    component.guardarDestinatario();
    
    expect(component.destinatario.length).toBe(initialLength + 1);
    expect(component.showtercerosModal).toBe(false);
    expect(component.destinatario[component.destinatario.length - 1]).toEqual(
      expect.objectContaining({
        nombreDenominacionORazonSocial: 'Test Name',
        telefono: '1234567890',
        correoElectronico: 'test@test.com'
      })
    );
  });

 // Test onExportadorSeleccionado method
  it('should update exportadorSeleccionado in onExportadorSeleccionado', () => {
    const testExportadores = [mockExportador[0]];
    
    component.onExportadorSeleccionado(testExportadores);
    
    expect(component.exportadorSeleccionado).toEqual(testExportadores);
  });

  // Test limpiarBusquedaTif method
  it('should clear TIF search fields in limpiarBusquedaTif', () => {
    component.nombreEstablecimientoTif = 'Test Name';
    component.numeroEstablecimientoTif = 'Test Number';
    
    component.limpiarBusquedaTif();
    
    expect(component.nombreEstablecimientoTif).toBe('');
    expect(component.numeroEstablecimientoTif).toBe('');
  });

  // Test abrirBuscarTercerosModal method
  it('should open modal and reset form in abrirBuscarTercerosModal', () => {
    component.inicializarFormulario();
    const resetSpy = jest.spyOn(component.buscarTercerosForm, 'reset');
    
    component.abrirBuscarTercerosModal();
    
    expect(component.showBuscarTercerosModal).toBe(true);
    expect(resetSpy).toHaveBeenCalledWith({
      tipoPersonaBuscar: 'fisica',
      pais: component.paisCatalogo[0].id,
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      razonSocial: '',
      correoElectronico: '',
      entidadFederativa: ''
    });
  });

  // Test cerrarBuscarTercerosModal method
  it('should close search modal in cerrarBuscarTercerosModal', () => {
    component.showBuscarTercerosModal = true;
    
    component.cerrarBuscarTercerosModal();
    
    expect(component.showBuscarTercerosModal).toBe(false);
  });

  // Test limpiarBuscarTerceros method
  it('should reset search form in limpiarBuscarTerceros', () => {
    component.inicializarFormulario();
    const resetSpy = jest.spyOn(component.buscarTercerosForm, 'reset');
    
    component.limpiarBuscarTerceros();
    
    expect(resetSpy).toHaveBeenCalledWith({
      tipoPersonaBuscar: 'fisica',
      pais: component.paisCatalogo[0].id,
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      razonSocial: '',
      correoElectronico: '',
      entidadFederativa: ''
    });
  });

  // Test catalog properties
  it('should initialize catalog properties correctly', () => {
    expect(component.paisCatalogo).toEqual(realizar.pais);
    expect(component.estadoCatalogo).toEqual(realizar.estado);
    expect(component.municipioCatalogo).toEqual(realizar.municipio);
    expect(component.coloniaCatalogo).toEqual(realizar.colonia);
  });

  // Test form initialization
  it('should initialize forms with correct validators', () => {
    component.inicializarFormulario();
    
    // Clear the form values to test required validation
    component.tipoPersonaForm.get('tipoPersona')?.setValue('');
    component.datosPersonales.get('nombre')?.setValue('');
    component.datosPersonales.get('primerApellido')?.setValue('');
    component.datosPersonales.get('social')?.setValue('');
    
    // Mark as touched to trigger validation
    component.tipoPersonaForm.get('tipoPersona')?.markAsTouched();
    component.datosPersonales.get('nombre')?.markAsTouched();
    component.datosPersonales.get('primerApellido')?.markAsTouched();
    component.datosPersonales.get('social')?.markAsTouched();
    
    expect(component.tipoPersonaForm.get('tipoPersona')?.hasError('required')).toBe(true);
    expect(component.datosPersonales.get('nombre')?.hasError('required')).toBe(true);
    expect(component.datosPersonales.get('primerApellido')?.hasError('required')).toBe(true);
    expect(component.datosPersonales.get('social')?.hasError('required')).toBe(true);
  });

  // Test form value changes subscription
  it('should handle tipoPersona form value changes', () => {
    component.inicializarFormulario();
    const handleSpy = jest.spyOn(component, 'handleTipoPersonaChange');
    
    component.tipoPersonaForm.get('tipoPersona')?.setValue('moral');
    
    expect(handleSpy).toHaveBeenCalledWith('moral');
  });

  
  // Test default property values
  it('should initialize default property values correctly', () => {
    expect(component.showtercerosModal).toBe(false);
    expect(component.showBuscarTercerosModal).toBe(false);
    expect(component.showFisicaRow).toBe(true);
    expect(component.showMoralRow).toBe(true);
    expect(component.showPlantaRow).toBe(false);
    expect(component.esFormularioSoloLectura).toBe(false);
    expect(component.nombreEstablecimientoTif).toBe('');
    expect(component.numeroEstablecimientoTif).toBe('');
    expect(component.exportadorSeleccionado).toEqual([]);
    expect(component.destinatario).toEqual([]);
  });

  // Test guardarDestinatario with social (moral person)
  it('should add destinatario with social name when nombre is not available', () => {
    component.inicializarFormulario();
    component.showtercerosModal = true;
    
    // Set form values with social instead of nombre
    component.datosPersonales.patchValue({
      nombre: '',
      social: 'Test Company',
      telefono: '1234567890',
      correoElectronico: 'test@company.com',
      calle: 'Business Street',
      exterior: '456',
      interior: 'B',
      colonia: 'Business Colony',
      municipio: 'Business Municipality',
      estado: 'Business State',
      codigo: '54321'
    });
    
    const initialLength = component.destinatario.length;
    
    component.guardarDestinatario();
    
    expect(component.destinatario.length).toBe(initialLength + 1);
    expect(component.destinatario[component.destinatario.length - 1].nombreDenominacionORazonSocial).toBe('Test Company');
  });

  // Test pais catalog lookup in guardarDestinatario
  it('should lookup pais description in guardarDestinatario', () => {
    component.inicializarFormulario();
    
    // Mock the pais catalog with a specific item (using number for id as expected by the type)
    component.paisCatalogo = [{ id: 1, descripcion: 'MÉXICO' }];
    component.datosPersonales.get('pais')?.setValue(1);
    component.datosPersonales.patchValue({
      nombre: 'Test Name',
      telefono: '1234567890',
      correoElectronico: 'test@test.com',
      calle: 'Test Street',
      exterior: '123'
    });
    
    component.guardarDestinatario();
    
    const lastDestinatario = component.destinatario[component.destinatario.length - 1];
    expect(lastDestinatario.pais).toBe('MÉXICO');
  });

  // Test edge cases for handleTipoPersonaChange
  it('should handle unknown tipoPersona value', () => {
    component.datosPersonales = {
      enable: jest.fn(),
      disable: jest.fn()
    } as any;

    component.handleTipoPersonaChange('unknown');
    
    // Should not change any flags for unknown type
    expect(component.showFisicaRow).toBe(true); // Default value
    expect(component.showMoralRow).toBe(true); // Default value
    expect(component.showPlantaRow).toBe(false); // Default value
  });

  // Test multiple consecutive calls to tercerosAgregar
  it('should toggle modal state correctly with multiple calls to tercerosAgregar', () => {
    expect(component.showtercerosModal).toBe(false);
    
    component.tercerosAgregar();
    expect(component.showtercerosModal).toBe(true);
    
    component.tercerosAgregar();
    expect(component.showtercerosModal).toBe(false);
  });

  // Test multiple consecutive calls to cancelarDestinatario
  it('should toggle modal state correctly with multiple calls to cancelarDestinatario', () => {
    component.showtercerosModal = true;
    
    component.cancelarDestinatario();
    expect(component.showtercerosModal).toBe(false);
    
    component.cancelarDestinatario();
    expect(component.showtercerosModal).toBe(true);
  });

  // Test form state after limpiarDatosFormulario
  it('should clear all form fields in limpiarDatosFormulario', () => {
    component.inicializarFormulario();
    
    // Set some values first
    component.datosPersonales.patchValue({
      nombre: 'Test Name',
      primerApellido: 'Test Apellido',
      correoElectronico: 'test@test.com'
    });
    
    component.limpiarDatosFormulario();
    
    expect(component.datosPersonales.get('nombre')?.value).toBeNull();
    expect(component.datosPersonales.get('primerApellido')?.value).toBeNull();
    expect(component.datosPersonales.get('correoElectronico')?.value).toBeNull();
  });

  // Test checkbox property
  it('should have correct checkbox configuration', () => {
    expect(component.checkbox).toBeDefined();
  });

  // Test empty exportador selection
  it('should handle empty exportador selection', () => {
    component.onExportadorSeleccionado([]);
    expect(component.exportadorSeleccionado).toEqual([]);
  });

  // Test setValoresStore with undefined form field
  it('should handle setValoresStore with undefined form field', () => {
    component.inicializarFormulario();
    
    component.setValoresStore(component.datosPersonales, 'nonexistentField', 'setNombre');
    
    expect(mockTramite221601Store.setNombre).toHaveBeenCalledWith(undefined);
  });

  // Test subscription cleanup on destroy
  it('should properly clean up subscriptions on destroy', () => {
    const destroyNotifier$ = component['destroyNotifier$'];
    const nextSpy = jest.spyOn(destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(destroyNotifier$, 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalledWith();
    expect(completeSpy).toHaveBeenCalled();
  });

  // Test form validation with maxLength validators
  it('should validate maxLength constraints', () => {
    component.inicializarFormulario();
    
    // Test maxLength validation for nombre (200 chars)
    const longName = 'a'.repeat(201);
    component.datosPersonales.get('nombre')?.setValue(longName);
    expect(component.datosPersonales.get('nombre')?.hasError('maxlength')).toBe(true);
    
    // Test maxLength validation for social (250 chars)
    const longSocial = 'a'.repeat(251);
    component.datosPersonales.get('social')?.setValue(longSocial);
    expect(component.datosPersonales.get('social')?.hasError('maxlength')).toBe(true);
    
    // Test maxLength validation for calle (100 chars)
    const longCalle = 'a'.repeat(101);
    component.datosPersonales.get('calle')?.setValue(longCalle);
    expect(component.datosPersonales.get('calle')?.hasError('maxlength')).toBe(true);
  });

  // Test form initialization with existing state values
  it('should initialize forms with existing state values', () => {
    // The component should use the mockSolicitudState values
    component.inicializarFormulario();
    
    expect(component.datosPersonales.get('nombre')?.value).toBe(mockSolicitudState.nombre);
    expect(component.datosPersonales.get('primerApellido')?.value).toBe(mockSolicitudState.primerApellido);
    expect(component.datosPersonales.get('correoElectronico')?.value).toBe(mockSolicitudState.correoElectronico);
    expect(component.tipoPersonaForm.get('tipoPersona')?.value).toBe(mockSolicitudState.tipoPersona);
  });

  // Test guardarDestinatario with missing pais in catalog
  it('should handle missing pais in catalog during guardarDestinatario', () => {
    component.inicializarFormulario();
    
    // Set a pais id that doesn't exist in catalog
    component.datosPersonales.get('pais')?.setValue(999);
    component.datosPersonales.patchValue({
      nombre: 'Test Name',
      telefono: '1234567890',
      correoElectronico: 'test@test.com',
      calle: 'Test Street',
      exterior: '123'
    });
    
    component.guardarDestinatario();
    
    const lastDestinatario = component.destinatario[component.destinatario.length - 1];
    expect(lastDestinatario.pais).toBeUndefined();
  });

  // Test component initialization with subscription
  it('should initialize with tramite221601Query subscription', () => {
    // Verify that the component received the mock state through subscription
    expect(component.solicitudState).toEqual(mockSolicitudState);
  });

  // Test updateStoreWithFormData with different pais values
  it('should update store with different pais values', () => {
    component.inicializarFormulario();
    
    const newPaisValue = 'USA';
    component.datosPersonales.get('pais')?.setValue(newPaisValue);
    
    component.updateStoreWithFormData();
    
    expect(mockTramite221601Store.update).toHaveBeenCalledWith(
      expect.objectContaining({
        pais: newPaisValue
      })
    );
  });

  // Test buscarTercerosForm default values
  it('should initialize buscarTercerosForm with default values', () => {
    component.inicializarFormulario();
    
    expect(component.buscarTercerosForm.get('tipoPersonaBuscar')?.value).toBe('fisica');
    expect(component.buscarTercerosForm.get('pais')?.value).toBe(component.paisCatalogo[0].id);
    expect(component.buscarTercerosForm.get('nombre')?.value).toBe('');
  });

  // Test multiple destinations added
  it('should handle multiple destinations correctly', () => {
    component.inicializarFormulario();
    
    // Add first destination
    component.datosPersonales.patchValue({
      nombre: 'Destination 1',
      telefono: '1111111111',
      correoElectronico: 'dest1@test.com',
      calle: 'Street 1',
      exterior: '1'
    });
    component.guardarDestinatario();
    
    // Add second destination
    component.datosPersonales.patchValue({
      nombre: 'Destination 2',
      telefono: '2222222222',
      correoElectronico: 'dest2@test.com',
      calle: 'Street 2',
      exterior: '2'
    });
    component.guardarDestinatario();
    
    expect(component.destinatario.length).toBe(2);
    expect(component.destinatario[0].nombreDenominacionORazonSocial).toBe('Destination 1');
    expect(component.destinatario[1].nombreDenominacionORazonSocial).toBe('Destination 2');
  });

});
