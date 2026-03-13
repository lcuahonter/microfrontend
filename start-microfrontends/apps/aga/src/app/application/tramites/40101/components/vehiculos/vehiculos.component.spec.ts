
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehiculosComponent } from './vehiculos.component';
import { FormBuilder, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Component, forwardRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { modificarTerrestreService } from '../services/modificacar-terrestre.service';
@Component({
  selector: 'app-catalogo-select',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockCatalogoSelectComponent),
      multi: true
    }
  ]
})
class MockCatalogoSelectComponent implements ControlValueAccessor {
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}
// Mock tipo-de-vehiculo component with ControlValueAccessor
@Component({
  selector: 'tipo-de-vehiculo',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockTipoDeVehiculoComponent),
      multi: true
    }
  ]
})
class MockTipoDeVehiculoComponent implements ControlValueAccessor {
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}

// Mock service
class modificarTerrestreServiceMock {
  obtenerTipoDeVehiculo() { return { pipe: () => ({ subscribe: () => {} }) }; }
  obtenerPaisEmisor() { return { pipe: () => ({ subscribe: () => {} }) }; }
  obtenerAno() { return { pipe: () => ({ subscribe: () => {} }) }; }
  obtenerColorVehiculo() { return { pipe: () => ({ subscribe: () => {} }) }; }
  obtenerTipoArrastre() { return { pipe: () => ({ subscribe: () => {} }) }; }
  obtenerPedimentoTabla() { return { pipe: () => ({ subscribe: () => {} }) }; }
}

describe('VehiculosComponent', () => {
  let componente: VehiculosComponent;
  let fixture: ComponentFixture<VehiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [VehiculosComponent, MockTipoDeVehiculoComponent, MockCatalogoSelectComponent],
      providers: [
        FormBuilder,
        { provide: modificarTerrestreService, useClass: modificarTerrestreServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VehiculosComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();

    // Patch tipoDeVehiculo to suppress NG01203 error for all tests
    if (componente.vehiculoFormulario && componente.vehiculoFormulario.patchValue) {
      componente.vehiculoFormulario.patchValue({ tipoDeVehiculo: 1 });
    }
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar los formularios correctamente', () => {
    componente.inicializarFormulario();
    expect(componente.vehiculoFormulario).toBeDefined();
    expect(componente.unidadFormulario).toBeDefined();
  });

  it('debería seleccionar la pestaña correctamente', () => {
    const resultado = componente.seleccionarPestana('unidaddearrastre');
    expect(componente.pestanaSeleccionada).toBe('Unidad de arrastre');
    expect(resultado).toBe('unidaddearrastre');
  });

  it('debería limpiar los datos del vehículo', () => {
    componente.vehiculoFormulario.patchValue({ numero: '123', tipoDeVehiculo: 1 });
    componente.limpiarVahiculodata();
    expect(componente.vehiculoFormulario.value.numero).toBeNull();
  });

  it('debería limpiar los datos de la unidad de arrastre', () => {
    componente.unidadFormulario.patchValue({ vinVehiculo: 'ABC123' });
    componente.limpiarUnidaddata();
    expect(componente.unidadFormulario.value.vinVehiculo).toBeNull();
  });

  it('debería agregar un vehículo si el formulario es válido', () => {
    componente.inicializarFormulario();
    componente.vehiculoFormulario.patchValue({
      numero: '1',
      tipoDeVehiculo: 1,
      idDeVehiculo: 1,
      numeroPlaca: 'XYZ123',
      paisEmisor: 1,
      estado: 'Estado',
      marca: 'Marca',
      modelo: 'Modelo',
      ano: 2020,
      transponder: 'Transponder',
      colorVehiculo: 1,
      numuroEconomico: 'ECO123',
      numero2daPlaca: 'ABC456',
      estado2daPlaca: 'Estado2',
      paisEmisor2daPlaca: 2,
      descripcion: 'Descripción',
    });
    componente.agregarVahiculodata();
    expect(componente.vehiculosTablaConfig.datos.length).toBeGreaterThan(0);
  });

  it('debería agregar una unidad de arrastre si el formulario es válido', () => {
    componente.inicializarFormulario();
    componente.unidadFormulario.patchValue({
      idDeVehiculoUnidad: 1,
      vinVehiculo: 'VIN123',
      tipoDeUnidadArrastre: 2,
      numeroEconomico: 'ECO456',
      numeroPlaca: 'PLACA789',
      paisEmisor: 1,
      estado: 'Estado',
      colorVehiculo: 1,
      numero2daPlaca: 'PLACA2',
      estado2daPlaca: 'Estado2',
      paisEmisor2daPlaca: 2,
      descripcion: 'Descripción',
    });
    componente.agregarUnidadData();
    expect(componente.unidadesTablaConfig.datos.length).toBeGreaterThan(0);
  });
});