/**
 * FormDataService
 */
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import { FormData } from '../models/mod-permiso.model';
/*
** Servicio para manejar los datos del formulario en el asistente de modificación de permisos de medicamentos de uso.
** Este servicio utiliza un BehaviorSubject para almacenar y gestionar el estado de los datos del formulario.
*/
@Injectable({
  providedIn: 'root',
})

/**
 * FormDataService
 * 
 * Servicio para manejar los datos del formulario en el asistente de modificación de permisos de medicamentos de uso.
 * Este servicio utiliza un BehaviorSubject para almacenar y gestionar el estado de los datos del formulario.
 */
export class FormDataService {
  /**
   * `formDataSubject` es un BehaviorSubject que almacena el estado actual de los datos del formulario.
   * Inicializa con valores `null` para cada sección del formulario.
   */
  private formDataSubject = new BehaviorSubject<FormData>({
    solicitanteData: null, // Datos del solicitante
    completeForm: null, // Datos completos del formulario
    tercerosRelacionados: null, // Información de terceros relacionados
    pagoDeDerechos: null, // Información de pagos realizados
    tramitesAsociados: null, // Información de trámites asociados
  });

  /**
   * `formData$` es un observable que expone los datos del formulario.
   * Los componentes pueden suscribirse a este observable para recibir actualizaciones en tiempo real.
   */
  formData$ = this.formDataSubject.asObservable();

  /**
   * Método para actualizar una sección específica de los datos del formulario.
   * 
   * @template TKey - Tipo de la clave de la sección que se desea actualizar.
   * @param section - La clave de la sección que se actualizará (por ejemplo, `solicitanteData`).
   * @param data - Los datos que se asignarán a la sección especificada.
   */
  updateFormData<TKey extends keyof FormData>(section: TKey, data: FormData[TKey]): void {
    // Obtiene el estado actual de los datos del formulario
    const CURRENT_DATA = this.formDataSubject.value;

    // Actualiza la sección especificada con los nuevos datos
    CURRENT_DATA[section] = data;

    // Emite los datos actualizados a través del BehaviorSubject
    this.formDataSubject.next(CURRENT_DATA);
  }

  /**
   * Método para obtener el estado actual de los datos del formulario.
   * 
   * @returns Un objeto de tipo `FormData` que contiene los datos actuales de todas las secciones del formulario.
   */
  getFormData(): FormData {
    return this.formDataSubject.value;
  }
}