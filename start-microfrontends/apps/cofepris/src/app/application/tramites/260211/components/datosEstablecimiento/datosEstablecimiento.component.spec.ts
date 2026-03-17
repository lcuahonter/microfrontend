import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DatosEstablecimientoComponent } from './datosEstablecimiento.component';

describe('DatosEstablecimientoComponent', () => {
  let component: DatosEstablecimientoComponent;
  let fixture: ComponentFixture<DatosEstablecimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosEstablecimientoComponent, HttpClientTestingModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosEstablecimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con los valores por defecto', () => {
    expect(component.forma).toBeDefined();
    expect(component.forma.get('denominacion')?.value).toBe(component.solicitudState?.denominacion);
    expect(component.forma.get('correo')?.value).toBe(component.solicitudState?.correo);
  });

  it('debe alternar el estado de colapsable', () => {
    const initialState = component.colapsable;
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(!initialState);
  });

  it('debe habilitar todos los controles del formulario cuando se llama toggleFormControls', () => {
    component.forma.disable();
    component.toggleFormControls();
    Object.keys(component.forma.controls).forEach((controlName) => {
      expect(component.forma.get(controlName)?.enabled).toBe(true);
    });
  });

  it('debe establecer valores en el store cuando se llama setValoresStore', () => {
    const mockStoreMethod = jest.fn();
    const mockForm = {
      get: jest.fn().mockReturnValue({ value: 'testValue' }),
    } as unknown as typeof component.forma;

    component['tramite260211Store'] = { mockMethod: mockStoreMethod } as any;
    component.setValoresStore(mockForm, 'mockField', 'mockMethod' as any);

    expect(mockForm.get).toHaveBeenCalledWith('mockField');
    expect(mockStoreMethod).toHaveBeenCalledWith('testValue');
  });
});
