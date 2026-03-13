import { DatosTramiteService } from './datos-tramite.service';
import { FormBuilder } from '@angular/forms';

describe('DatosTramiteService', () => {
  let servicio: DatosTramiteService;
  let constructorFormularios: FormBuilder;

  beforeEach(() => {
    constructorFormularios = new FormBuilder();
    servicio = new DatosTramiteService(constructorFormularios);
  });

  it('debería crearse correctamente', () => {
    expect(servicio).toBeTruthy();
  });

  it('debería inicializar el formulario con los campos requeridos', () => {
    const formulario = servicio.formulario;
    expect(formulario.contains('tipoDeCaatAerea')).toBe(true);
    expect(formulario.contains('ideCodTransportacionAerea')).toBe(true);
    expect(formulario.contains('codIataIcao')).toBe(true);
  });

  it('debería actualizar el valor de un campo', () => {
    servicio.actualizarCampo('tipoDeCaatAerea', 'Aerea');
    expect(servicio.formulario.get('tipoDeCaatAerea')?.value).toBe('Aerea');
  });

  it('debería validar como inválido si los campos requeridos están vacíos', () => {
    servicio.formulario.reset();
    expect(servicio.validarFormulario()).toBe(false);
  });

  it('debería validar como válido si todos los campos requeridos están llenos', () => {
    servicio.actualizarCampo('tipoDeCaatAerea', 'Aerea');
    servicio.actualizarCampo('ideCodTransportacionAerea', '123');
    servicio.actualizarCampo('codIataIcao', 'ABC');
    expect(servicio.validarFormulario()).toBe(true);
  });
});
