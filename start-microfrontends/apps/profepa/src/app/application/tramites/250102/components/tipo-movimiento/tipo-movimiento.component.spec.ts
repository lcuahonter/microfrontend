import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoMovimientoComponent } from './tipo-movimiento.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite250102Store } from '../../estados/tramite250102.store';
import { Tramite250102Query } from '../../estados/tramite250102.query';
import { TipoMovimientoService } from '../../services/tipo-movimiento.service';
import { MOVIMIENTO_OPCIONES_DE_BOTON_DE_RADIO } from '../../constantes/flora-fauna.enum';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

const mockStore = {
  establecerDatos: jest.fn(),
};

const mockQuery = {
  selectTramiteState$: of({
    tipoMovimiento: MOVIMIENTO_OPCIONES_DE_BOTON_DE_RADIO[0]?.value,
    tipoAduana: '',
    tipoInspectoria: '',
    tipoMunicipio: ''
  }),
  selectTipoMovimiento$: of(MOVIMIENTO_OPCIONES_DE_BOTON_DE_RADIO[0]?.value),
};

const mockService = {
  obtenerAduanaData: jest.fn(() => of([])),
  obtenerInspectoriaData: jest.fn(() => of([])),
  obtenerAlcaldíaData: jest.fn(() => of([])),
};

describe('TipoMovimientoComponent', () => {
  let component: TipoMovimientoComponent;
  let fixture: ComponentFixture<TipoMovimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoMovimientoComponent, ReactiveFormsModule],
      providers: [
         provideHttpClient(),
        FormBuilder,
        { provide: Tramite250102Store, useValue: mockStore },
        { provide: Tramite250102Query, useValue: mockQuery },
        { provide: TipoMovimientoService, useValue: mockService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoMovimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con valores predeterminados', () => {
    expect(component.tipoMovimientoForm.value).toEqual({
      tipoMovimiento: MOVIMIENTO_OPCIONES_DE_BOTON_DE_RADIO[0]?.value,
      tipoAduana: '',
      tipoInspectoria: '',
      tipoMunicipio: ''
    });
  });

  it('debe actualizar la tienda cuando se llama a setValoresStore', () => {
    const FORM = component.tipoMovimientoForm;
    FORM.get('tipoMovimiento')?.setValue('nuevoValor');

    component.setValoresStore(FORM, 'tipoMovimiento');

    expect(mockStore.establecerDatos).toHaveBeenCalledWith({ tipoMovimiento: 'nuevoValor' });
  });

  it('Debería recuperar valores de la tienda y parchearlos en el formulario', () => {
    component.getValoresStore();
    fixture.detectChanges();

    expect(component.tipoMovimientoForm.value.tipoMovimiento).toBe(MOVIMIENTO_OPCIONES_DE_BOTON_DE_RADIO[0]?.value);
  });

  it('Debería llamar a los métodos de servicio para obtener datos al inicio', () => {
    component.ngOnInit();

    expect(mockService.obtenerAduanaData).toHaveBeenCalled();
    expect(mockService.obtenerInspectoriaData).toHaveBeenCalled();
    expect(mockService.obtenerAlcaldíaData).toHaveBeenCalled();
  });

  it('Deberían limpiar las suscripciones en Destroy', () => {
    const DESTROY_SPY = jest.spyOn(component.destroy$, 'next');
    component.ngOnDestroy();
    expect(DESTROY_SPY).toHaveBeenCalled();
  });
});