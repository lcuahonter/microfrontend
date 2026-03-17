import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DetallesPlantasComponent } from './detalles-plantas.component';

describe('DetallesPlantasComponent', () => {
  let fixture: ComponentFixture<DetallesPlantasComponent>;
  let component: DetallesPlantasComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, DetallesPlantasComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesPlantasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario en el constructor', () => {
    expect(component.formularioDatosPlantas).toBeDefined();
    expect(component.formularioDatosPlantas.get('permaneceMercancia')).toBeTruthy();
    expect(component.formularioDatosPlantas.get('fechaOpinion')?.disabled).toBe(true);
  });

  it('debe ejecutar inicializarFormularioDatosPlantas() y deshabilitar fechaOpinion', () => {
    component.inicializarFormularioDatosPlantas();
    expect(component.formularioDatosPlantas.get('permaneceMercancia')).toBeTruthy();
    expect(component.formularioDatosPlantas.get('fechaOpinion')?.disabled).toBe(true);
  });

  it('debe emitir cuando se llame a regresarPlantas()', () => {
    const emitSpy = jest.spyOn(component.alRegresarPlantas, 'emit');
    component.regresarPlantas();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('debe actualizar el valor en cambiarPermaneceMercancia()', () => {
    const patchSpy = jest.spyOn(component.formularioDatosPlantas, 'patchValue');
    const mockCatalogo = { id: 5, descripcion: 'Sí' };
    component.cambiarPermaneceMerCancia(mockCatalogo);
    expect(patchSpy).toHaveBeenCalledWith({ permaneceMercancia: 5 });
  });

  it('Debería parchear el valor en cambiartipoContribuyente()', () => {
    const patchSpy = jest.spyOn(component.formularioDatosPlantas, 'patchValue');
    const mockCatalogo = { id: 2, descripcion: 'Moral' };
    component.cambiartipoContribuyente(mockCatalogo);
    expect(patchSpy).toHaveBeenCalledWith({ tipoContribuyente: 2 });
  });
});
