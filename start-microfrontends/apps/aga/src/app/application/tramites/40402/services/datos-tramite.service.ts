import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Injectable } from '@angular/core';

/**
 * Servicio para la gestión del formulario de datos del trámite 40402.
 *
 * Este archivo contiene la definición del servicio compartido para la gestión del formulario de datos del trámite,
 * incluyendo la creación, actualización y validación de los campos requeridos.
 *
 * Proporciona métodos para obtener el formulario reactivo, actualizar campos y validar los datos capturados.
 *
 * @class DatosTramiteService
 * @implements {Injectable}
 */
@Injectable({ providedIn: 'root' })

export class DatosTramiteService {    
/**
 * Instancia reactiva del formulario de datos del trámite.
 *
 * @property {BehaviorSubject<FormGroup>} formularioSujeto
 * Sujeto que mantiene el estado actual del formulario.
 */
  private formularioSujeto: BehaviorSubject<FormGroup>;

    /**
   * Crea una nueva instancia del servicio y del formulario reactivo para datos del trámite.
   *
   * Inicializa el formulario con los campos requeridos:
   * - tipoDeCaatAerea: Tipo de CAAT aéreo (requerido)
   * - ideCodTransportacionAerea: Identificador de código de transportación aérea (requerido)
   * - codIataIcao: Código IATA/ICAO (requerido, máximo 3 caracteres)
   *
   * @param {FormBuilder} formBuilder - Servicio para la construcción de formularios reactivos.
   */
  constructor(private formBuilder: FormBuilder) {
    const FORMULARIO = this.formBuilder.group({
      tipoDeCaatAerea: ['', Validators.required],
      ideCodTransportacionAerea: ['', Validators.required],
      codIataIcao: ['', [Validators.required, Validators.maxLength(3)]],
    });
    this.formularioSujeto = new BehaviorSubject<FormGroup>(FORMULARIO);
  }

  
/**
 * Obtiene el formulario como observable para suscribirse a los cambios.
 *
 * @method formulario$
 * @returns {Observable<FormGroup>} Observable del formulario reactivo.
 */
  get formulario$(): Observable<FormGroup> {
    return this.formularioSujeto.asObservable();
  }

  /**
 * Obtiene la instancia actual del formulario.
 *
 * @method formulario
 * @returns {FormGroup} Instancia del formulario reactivo.
 */
  get formulario(): FormGroup {
    return this.formularioSujeto.value;
  }

  /**
 * Actualiza el valor de un campo específico en el formulario.
 *
 * @method actualizarCampo
 * @param {string} campo - Nombre del campo a actualizar.
 * @param {unknown} valor - Valor a establecer en el campo.
 * @returns {void}
 */
  actualizarCampo(campo: string, valor: unknown): void {
    const FORMULARIO = this.formulario;
    FORMULARIO.get(campo)?.setValue(valor);
    FORMULARIO.get(campo)?.markAsTouched();
    this.formularioSujeto.next(FORMULARIO);
  }

/**
 * Valida el formulario, marcando todos los campos como tocados y verificando los campos requeridos.
 *
 * @method validarFormulario
 * @returns {boolean} true si el formulario es válido y todos los campos requeridos están llenos, false en caso contrario.
 */
  validarFormulario(): boolean {
    const FORMULARIO = this.formulario;
    FORMULARIO.markAllAsTouched();
    const CAMPOS_REQUERIDOS = ['tipoDeCaatAerea', 'ideCodTransportacionAerea', 'codIataIcao'];
    for (const CAMPO of CAMPOS_REQUERIDOS) {
      const CONTROL = FORMULARIO.get(CAMPO);
      if (!CONTROL || CONTROL.invalid || CONTROL.value === null || CONTROL.value === undefined || CONTROL.value === '') {
        return false;
      }
    }
    return FORMULARIO.valid;
  }
}
