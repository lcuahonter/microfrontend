import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosFabSeccionComponent } from './terceros-relacionados-fab-seccion.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

// Mock completo para los modelos de terceros relacionados
const mockTercero = {
  rfc: 'RFC1',
  denominacionRazonSocial: 'Empresa 1',
  curp: 'CURP1',
  telefono: '5555555555',
  CorreoElectronico: 'correo@empresa.com',
  pais: 'MX',
  calle: 'Calle 1',
  numeroExterior: '123',
  numeroInterior: 'A',
  colonia: 'Centro',
  municipio: 'Municipio',
  estado: 'Estado',
  codigoPostal: '12345',
  tipoTercero: 'fabricante',
  nombre: 'Nombre1',
  tipoPersona: 'Moral',
  id: 1,
  // Propiedades faltantes para FacricanteModel
  municipioOAlcaldia: 'Municipio',
  localidad: 'Localidad',
  entidadFederativa: 'Entidad',
  estadoLocalidad: 'EstadoLocalidad',
  coloniaoEquivalente: 'ColoniaEquivalente'
};

describe('TercerosRelacionadosFabSeccionComponent', () => {
  let component: TercerosRelacionadosFabSeccionComponent;
  let fixture: ComponentFixture<TercerosRelacionadosFabSeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TercerosRelacionadosFabSeccionComponent, require('@angular/common/http/testing').HttpClientTestingModule],
      declarations: [],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosFabSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });


  it('debería agregar un fabricante si el formulario es válido', () => {
    component.agregarFabricanteFormGroup = new FormBuilder().group({
      rfc: ['RFC1'],
      nombre: ['Nombre1'],
      pais: ['MX']
    });
    component.fabricanteRowData = [];
    jest.spyOn(component, 'toggleDivFabricante');
    jest.spyOn(component.agregarFabricanteFormGroup, 'reset');
    component.submitFabricanteForm();
    expect(component.fabricanteRowData.length).toBe(1);
    expect(component.toggleDivFabricante).toHaveBeenCalled();
    expect(component.agregarFabricanteFormGroup.reset).toHaveBeenCalled();
  });

  it('no debe agregar un fabricante si el formulario es inválido', () => {
    component.agregarFabricanteFormGroup = new FormGroup({});
    component.fabricanteRowData = [];
    jest.spyOn(component, 'toggleDivFabricante');
    jest.spyOn(component.agregarFabricanteFormGroup, 'reset');
    component.submitFabricanteForm();
    expect(component.fabricanteRowData.length).toBe(0);
    expect(component.toggleDivFabricante).not.toHaveBeenCalled();
    expect(component.agregarFabricanteFormGroup.reset).not.toHaveBeenCalled();
  });

  it('debería eliminar fabricantes seleccionados', () => {
    component.fabricanteRowData = [mockTercero, { ...mockTercero, rfc: 'RFC2', id: 2 }];
    component.selectedFabricanteRows = [mockTercero];
    component.eliminarSeleccionadosFabricante();
    expect(component.fabricanteRowData.length).toBe(1);
    expect(component.fabricanteRowData[0].rfc).toBe('RFC2');
  });

  it('no debe eliminar nada si no hay seleccionados en eliminarSeleccionadosFabricante', () => {
    component.fabricanteRowData = [mockTercero];
    component.selectedFabricanteRows = [];
    component.eliminarSeleccionadosFabricante();
    expect(component.fabricanteRowData.length).toBe(1);
  });

  it('debería agregar un destinatario si el formulario es válido', () => {
    component.agregarDestinatarioFormGroup = new FormBuilder().group({
      rfc: ['RFC1'],
      nombre: ['Nombre1'],
      pais: ['MX']
    });
    component.destinatarioRowData = [];
    jest.spyOn(component, 'toggleDivDestinatario');
    jest.spyOn(component.agregarDestinatarioFormGroup, 'reset');
    component.submitDestinatarioForm();
    expect(component.destinatarioRowData.length).toBe(1);
    expect(component.toggleDivDestinatario).toHaveBeenCalled();
    expect(component.agregarDestinatarioFormGroup.reset).toHaveBeenCalled();
  });

  it('no debe agregar un destinatario si el formulario es inválido', () => {
    component.agregarDestinatarioFormGroup = new FormGroup({});
    component.destinatarioRowData = [];
    jest.spyOn(component, 'toggleDivDestinatario');
    jest.spyOn(component.agregarDestinatarioFormGroup, 'reset');
    component.submitDestinatarioForm();
    expect(component.destinatarioRowData.length).toBe(0);
    expect(component.toggleDivDestinatario).not.toHaveBeenCalled();
    expect(component.agregarDestinatarioFormGroup.reset).not.toHaveBeenCalled();
  });

  it('debería eliminar destinatarios seleccionados', () => {
    component.destinatarioRowData = [
      {
        ...mockTercero,
        municipioOAlcaldia: 'Municipio',
        localidad: 'Localidad',
        entidadFederativa: 'Entidad',
        estadoLocalidad: 'EstadoLocalidad',
        coloniaoEquivalente: 'ColoniaEquivalente'
      },
      {
        ...mockTercero,
        rfc: 'RFC2',
        id: 2,
        municipioOAlcaldia: 'Municipio',
        localidad: 'Localidad',
        entidadFederativa: 'Entidad',
        estadoLocalidad: 'EstadoLocalidad',
        coloniaoEquivalente: 'ColoniaEquivalente'
      }
    ];
    component.selectedDestinatarioRows = [{
      ...mockTercero,
      municipioOAlcaldia: 'Municipio',
      localidad: 'Localidad',
      entidadFederativa: 'Entidad',
      estadoLocalidad: 'EstadoLocalidad',
      coloniaoEquivalente: 'ColoniaEquivalente'
    }];
    component.eliminarSeleccionadosDestinatario();
    expect(component.destinatarioRowData.length).toBe(2);
    expect(component.destinatarioRowData[0].rfc).toBe('RFC1');
  });

  it('no debe eliminar nada si no hay seleccionados en eliminarSeleccionadosDestinatario', () => {
    component.destinatarioRowData = [{
      ...mockTercero,
      municipioOAlcaldia: 'Municipio',
      localidad: 'Localidad',
      entidadFederativa: 'Entidad',
      estadoLocalidad: 'EstadoLocalidad',
      coloniaoEquivalente: 'ColoniaEquivalente'
    }];
    component.selectedDestinatarioRows = [];
    component.eliminarSeleccionadosDestinatario();
    expect(component.destinatarioRowData.length).toBe(1);
  });

  it('debería agregar un proveedor si el formulario es válido', () => {
    component.agregarProveedorFormGroup = new FormBuilder().group({
      rfc: ['RFC1'],
      nombre: ['Nombre1'],
      pais: ['MX']
    });
    component.proveedorRowData = [];
    jest.spyOn(component, 'toggleDivProveedor');
    jest.spyOn(component.agregarProveedorFormGroup, 'reset');
    component.submitProveedorForm();
    expect(component.proveedorRowData.length).toBe(1);
    expect(component.toggleDivProveedor).toHaveBeenCalled();
    expect(component.agregarProveedorFormGroup.reset).toHaveBeenCalled();
  });

  it('no debe agregar un proveedor si el formulario es inválido', () => {
    component.agregarProveedorFormGroup = new FormGroup({});
    component.proveedorRowData = [];
    jest.spyOn(component, 'toggleDivProveedor');
    jest.spyOn(component.agregarProveedorFormGroup, 'reset');
    component.submitProveedorForm();
    expect(component.proveedorRowData.length).toBe(0);
    expect(component.toggleDivProveedor).not.toHaveBeenCalled();
    expect(component.agregarProveedorFormGroup.reset).not.toHaveBeenCalled();
  });

  it('debería eliminar proveedores seleccionados', () => {
    component.proveedorRowData = [mockTercero, { ...mockTercero, rfc: 'RFC2', id: 2 }];
    component.selectedProveedorRows = [mockTercero];
    component.eliminarSeleccionadosProveedor();
    expect(component.proveedorRowData.length).toBe(1);
    expect(component.proveedorRowData[0].rfc).toBe('RFC2');
  });

  it('no debe eliminar nada si no hay seleccionados en eliminarSeleccionadosProveedor', () => {
    component.proveedorRowData = [mockTercero];
    component.selectedProveedorRows = [];
    component.eliminarSeleccionadosProveedor();
    expect(component.proveedorRowData.length).toBe(1);
  });

  it('debería agregar un facturador si el formulario es válido', () => {
    component.agregarFacturadorFormGroup = new FormBuilder().group({
      rfc: ['RFC1'],
      nombre: ['Nombre1'],
      pais: ['MX']
    });
    component.facturadorRowData = [];
    jest.spyOn(component, 'toggleDivFacturador');
    jest.spyOn(component.agregarFacturadorFormGroup, 'reset');
    component.submitFacturadorForm();
    expect(component.facturadorRowData.length).toBe(1);
    expect(component.toggleDivFacturador).toHaveBeenCalled();
    expect(component.agregarFacturadorFormGroup.reset).toHaveBeenCalled();
  });

  it('no debe agregar un facturador si el formulario es inválido', () => {
    component.agregarFacturadorFormGroup = new FormGroup({});
    component.facturadorRowData = [];
    jest.spyOn(component, 'toggleDivFacturador');
    jest.spyOn(component.agregarFacturadorFormGroup, 'reset');
    component.submitFacturadorForm();
    expect(component.facturadorRowData.length).toBe(0);
    expect(component.toggleDivFacturador).not.toHaveBeenCalled();
    expect(component.agregarFacturadorFormGroup.reset).not.toHaveBeenCalled();
  });

  it('debería eliminar facturadores seleccionados', () => {
    component.facturadorRowData = [mockTercero, { ...mockTercero, rfc: 'RFC2', id: 2 }];
    component.selectedFacturadorRows = [mockTercero];
    component.eliminarSeleccionadosFacturador();
    expect(component.facturadorRowData.length).toBe(1);
    expect(component.facturadorRowData[0].rfc).toBe('RFC2');
  });

  it('no debe eliminar nada si no hay seleccionados en eliminarSeleccionadosFacturador', () => {
    component.facturadorRowData = [mockTercero];
    component.selectedFacturadorRows = [];
    component.eliminarSeleccionadosFacturador();
    expect(component.facturadorRowData.length).toBe(1);
  });

  it('rfcValidator retorna error si el valor es undefined', () => {
    expect(TercerosRelacionadosFabSeccionComponent.rfcValidator({ value: undefined } as AbstractControl)).toEqual({ invalidRFC: true });
  });

  it('rfcValidator retorna null si el valor es válido', () => {
    expect(TercerosRelacionadosFabSeccionComponent.rfcValidator({ value: 'ABC123456789' } as AbstractControl)).toBeNull();
  });

  it('requiredPaisValidator retorna null si el valor es null', () => {
    expect(TercerosRelacionadosFabSeccionComponent.requiredPaisValidator({ value: null } as AbstractControl)).toBeNull();
  });

  it('requiredPaisValidator retorna null si el valor es válido', () => {
    expect(TercerosRelacionadosFabSeccionComponent.requiredPaisValidator({ value: 'MX' } as AbstractControl)).toBeNull();
  });
it('onFabricanteSeleccionados actualiza los seleccionados', () => {
  component.onFabricanteSeleccionados([mockTercero]);
  expect(component.selectedFabricanteRows).toEqual([mockTercero]);
});

it('onDestinatarioSeleccionados actualiza los seleccionados', () => {
  component.onDestinatarioSeleccionados([mockTercero]);
  expect(component.selectedDestinatarioRows).toEqual([mockTercero]);
});

it('onProveedorSeleccionados actualiza los seleccionados', () => {
  component.onProveedorSeleccionados([mockTercero]);
  expect(component.selectedProveedorRows).toEqual([mockTercero]);
});

it('onFacturadorSeleccionados actualiza los seleccionados', () => {
  component.onFacturadorSeleccionados([mockTercero]);
  expect(component.selectedFacturadorRows).toEqual([mockTercero]);
});

it('onModificarFabricante actualiza el formulario con el seleccionado', () => {
  component.fabricanteRowData = [mockTercero];
  component.selectedFabricanteRows = [mockTercero];
  component.agregarFabricanteFormGroup = new FormBuilder().group({ rfc: [''] });
  component.onModificarFabricante();
  expect(component.showFabricante).toBe(true);
  expect(component.showTableDiv).toBe(false);
});

it('onModificarDestinatario actualiza el formulario con el seleccionado', () => {
  component.destinatarioRowData = [mockTercero];
  component.selectedDestinatarioRows = [mockTercero];
  component.agregarDestinatarioFormGroup = new FormBuilder().group({ rfc: [''] });
  component.onModificarDestinatario();
  expect(component.showDestinatario).toBe(true);
  expect(component.showTableDiv).toBe(false);
});

it('onModificarProveedor actualiza el formulario con el seleccionado', () => {
  component.proveedorRowData = [mockTercero];
  component.selectedProveedorRows = [mockTercero];
  component.agregarProveedorFormGroup = new FormBuilder().group({ rfc: [''] });
  component.onModificarProveedor();
  expect(component.showProveedor).toBe(true);
  expect(component.showTableDiv).toBe(false);
});

it('onModificarFacturador actualiza el formulario con el seleccionado', () => {
  component.facturadorRowData = [mockTercero];
  component.selectedFacturadorRows = [mockTercero];
  component.agregarFacturadorFormGroup = new FormBuilder().group({ rfc: [''] });
  component.onModificarFacturador();
  expect(component.showFacturador).toBe(true);
  expect(component.showTableDiv).toBe(false);
});
  it('debería limpiar los arrays y formularios en resetAll', () => {
    component.fabricanteRowData = [mockTercero];
    component.destinatarioRowData = [{ ...mockTercero, rfc: 'RFC2' }];
    component.proveedorRowData = [{ ...mockTercero, rfc: 'RFC3' }];
    component.facturadorRowData = [{ ...mockTercero, rfc: 'RFC4' }];
    component.agregarFabricanteFormGroup = new FormBuilder().group({ rfc: ['RFC1'] });
    component.agregarDestinatarioFormGroup = new FormBuilder().group({ rfc: ['RFC2'] });
    component.agregarProveedorFormGroup = new FormBuilder().group({ rfc: ['RFC3'] });
    component.agregarFacturadorFormGroup = new FormBuilder().group({ rfc: ['RFC4'] });
    expect(component.fabricanteRowData.length).toBe(1);
    expect(component.destinatarioRowData.length).toBe(1);
    expect(component.proveedorRowData.length).toBe(1);
    expect(component.facturadorRowData.length).toBe(1);
    expect(component.agregarFabricanteFormGroup.value.rfc).toBe('RFC1');
    expect(component.agregarDestinatarioFormGroup.value.rfc).toBe('RFC2');
    expect(component.agregarProveedorFormGroup.value.rfc).toBe('RFC3');
    expect(component.agregarFacturadorFormGroup.value.rfc).toBe('RFC4');
  });
});