import { DatosDeLaMercanciaComponent } from './datos-de-la-mercancia.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';

describe('DatosDeLaMercanciaComponent', () => {
  let component: DatosDeLaMercanciaComponent;

  const MOCK_MERCANCIA_INPUT_VALUES = [
    { label: 'Etiqueta de Prueba', placeholder: 'Marcador de Prueba', required: true, controlName: 'testControl' },
  ];

  const MOCK_PRODUCTO_OPCIONES: { label: string; value: string }[] = [];
  const MOCK_MERCANCIA_CATALOGO_ARRAY: { id: number; descripcion: string }[][] = []; 


  beforeEach(() => {
    component = new DatosDeLaMercanciaComponent();
    component.form = new FormGroup({
      testControl: new FormControl('', Validators.required),
      plazo: new FormControl(''),
    });
    component.mercanciaInputValues = MOCK_MERCANCIA_INPUT_VALUES;
    component.productoOpciones = MOCK_PRODUCTO_OPCIONES;
    component.mercanciaCatalogoArray = MOCK_MERCANCIA_CATALOGO_ARRAY;
    component.setValoresStoreEvent = new EventEmitter();
    component.alCambioDelCampoValores = new EventEmitter();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('esInvalido', () => {
    it('debería devolver true si el control es inválido y está tocado o modificado', () => {
      const CONTROL = component.form.get('testControl');
      CONTROL?.markAsTouched();
      expect(component.esInvalido('testControl')).toBe(true);
    });

    it('debería devolver false si el control es válido', () => {
      const CONTROL = component.form.get('testControl');
      CONTROL?.setValue('Valor Válido');
      expect(component.esInvalido('testControl')).toBe(false);
    });

    it('debería devolver false si el control no existe', () => {
      expect(component.esInvalido('controlInexistente')).toBe(false);
    });
  });

  describe('setValoresStore', () => {
    it('debería emitir setValoresStoreEvent con los datos correctos', () => {
      const EMIT_SPY = jest.spyOn(component.setValoresStoreEvent, 'emit');
      component.setValoresStore(component.form, 'testField');
      expect(EMIT_SPY).toHaveBeenCalledWith({ form: component.form, campo: 'testField' });
    });
  });

  describe('alCambioDelCampo', () => {
    it('debería emitir alCambioDelCampoValores con los datos correctos para el índice 0', () => {
      const EMIT_SPY = jest.spyOn(component.alCambioDelCampoValores, 'emit');
      component.alCambioDelCampo(component.form, 'testControl', 0);
      expect(EMIT_SPY).toHaveBeenCalledWith({
        form: component.form,
        campo: 'testControl',
        metodoNombre: 'setFraccion',
      });
    });

    it('debería emitir alCambioDelCampoValores con los datos correctos para el índice 1', () => {
      const EMIT_SPY = jest.spyOn(component.alCambioDelCampoValores, 'emit');
      component.alCambioDelCampo(component.form, 'testControl', 1);
      expect(EMIT_SPY).toHaveBeenCalledWith({
        form: component.form,
        campo: 'testControl',
        metodoNombre: 'setUmt',
      });
    });

    it('debería emitir alCambioDelCampoValores con los datos correctos para el índice 2', () => {
      const EMIT_SPY = jest.spyOn(component.alCambioDelCampoValores, 'emit');
      component.alCambioDelCampo(component.form, 'testControl', 2);
      expect(EMIT_SPY).toHaveBeenCalledWith({
        form: component.form,
        campo: 'testControl',
        metodoNombre: 'setNico',
      });
    });
  });

  describe('alCambiarPlazo', () => {
    it('debería actualizar el valor del control plazo y llamar a setValoresStore', () => {
      const SET_VALORES_STORE_SPY = jest.spyOn(component, 'setValoresStore');
      component.alCambiarPlazo('nuevoPlazo');
      expect(component.form.get('plazo')?.value).toBe('nuevoPlazo');
      expect(SET_VALORES_STORE_SPY).toHaveBeenCalledWith(component.form, 'plazo');
    });
  });
});