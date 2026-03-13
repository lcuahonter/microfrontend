import { Observable, of } from 'rxjs';
import { FormularioRecuperacion } from './RecuperacionState.store';
import { Injectable } from '@angular/core';

/** 
 * Interfaz que define la estructura de la respuesta de recuperación
 * @interface RecuperacionResponse
 */
interface RecuperacionResponse {
  /** Correo electrónico del usuario */
  correo: string;
  /** Identificador único del usuario */
  usuario: string;
}

/**
 * Servicio que maneja la lógica de recuperación de cuenta
 * @class RecuperacionCuentaService
 */
@Injectable({
  providedIn: 'root'
})
export class RecuperacionCuentaService {
  /** 
   * Datos mock para simular respuesta del servidor
   * @private
   * @readonly
   */
  private readonly mockData = {
    correo: 'usuario@dominio.com',
    usuario: 'USRTEST123'
  };

  /**
   * Constructor del servicio de recuperación de cuenta
   * @constructor
   */
  constructor() {
    // Constructor vacío
  }

  /**
   * Procesa la solicitud de recuperación de cuenta
   * @param {RecuperacionState['formData']} formData - Datos del formulario de recuperación
   * @returns {Observable<RecuperacionResponse>} Observable con la respuesta de recuperación
   * @description Valida los datos del formulario y retorna la información de la cuenta
   */
  recuperarCuenta(formData: FormularioRecuperacion): Observable<RecuperacionResponse> {
    // Usar formData para simular validación
    if (this.validarDatos(formData)) {
      return of(this.mockData);
    }
    
    return of({
      correo: `${formData.usuario}@dominio.com`,
      usuario: formData.usuario || 'USRTEST123'
    });
  }

  /**
   * Valida los datos del formulario contra los datos mock
   * @param {RecuperacionState['formData']} formData - Datos del formulario a validar
   * @returns {boolean} True si los datos son válidos, False en caso contrario
   * @private
   */
  private validarDatos(formData: FormularioRecuperacion): boolean {
    return this.mockData.usuario === formData.usuario;
  }
}