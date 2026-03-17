import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ScianTablaComponent } from '../../../../shared/components/scian-tabla/scian-tabla.component';
import { TablaScianConfig } from '../../../../shared/models/datos-solicitud.model';
import { Tramite260206Store } from '../../estados/stores/tramite260206Store.store';

/**
 * @class ScianTablaContenedoraComponent
 * @description Componente contenedor responsable de gestionar la tabla de códigos SCIAN 
 * (Sistema de Clasificación Industrial de América del Norte) para el trámite 260206.
 * Este componente actúa como intermediario entre la tabla SCIAN y el store del trámite,
 * manejando la selección y persistencia de datos SCIAN.
 * 
 * @implements {Component}
 * @standalone true
 * 
 * @example
 * ```html
 * <app-scian-tabla-contenedora></app-scian-tabla-contenedora>
 * ```
 */
@Component({
  selector: 'app-scian-tabla-contenedora',
  standalone: true,
  imports: [CommonModule, ScianTablaComponent],
  templateUrl: './scian-tabla-contenedora.component.html',
  styleUrl: './scian-tabla-contenedora.component.scss',
})
export class ScianTablaContenedoraComponent {
  
  /**
   * @property {number} idProcedimiento
   * @description Identificador único del procedimiento asociado a este componente.
   * Este valor es de solo lectura y se utiliza para referenciar el procedimiento específico
   * del trámite COFEPRIS 260206. Es una constante que identifica de manera inequívoca
   * el tipo de trámite que se está procesando.
   * 
   * @readonly
   * @default 260206
   * @type {number}
   * @memberof ScianTablaContenedoraComponent
   */
  public readonly idProcedimiento: number = 260206;

  /**
   * @constructor
   * @description Constructor del componente que inicializa las dependencias necesarias.
   * Inyecta el store del trámite 260206 para gestionar el estado de los datos SCIAN.
   * 
   * @param {Tramite260206Store} Tramite260206Store - Store que gestiona el estado del trámite 260206,
   * incluyendo los datos de configuración SCIAN seleccionados por el usuario.
   * 
   * @memberof ScianTablaContenedoraComponent
   */
  constructor(private Tramite260206Store: Tramite260206Store){}

  /**
   * @property {TablaScianConfig} scianSeleccionado
   * @description Almacena la configuración SCIAN seleccionada actualmente por el usuario.
   * Esta propiedad contiene los datos del código SCIAN elegido, incluyendo información
   * como el código, descripción y otros metadatos relacionados con la clasificación
   * industrial seleccionada.
   * 
   * @type {TablaScianConfig}
   * @public
   * @memberof ScianTablaContenedoraComponent
   * 
   * @remarks
   * - La propiedad utiliza el operador de aserción no nula (!) indicando que será
   *   inicializada definitivamente antes de su uso.
   * - Los datos almacenados en esta propiedad son utilizados posteriormente para
   *   actualizar el estado del store del trámite.
   */
  public scianSeleccionado!: TablaScianConfig;

  /**
   * @method obtenerSeleccionado
   * @description Método que maneja la selección de códigos SCIAN y actualiza el estado 
   * del store con la configuración seleccionada. Este método es invocado cuando el usuario
   * selecciona un elemento de la tabla SCIAN y agrega la nueva configuración al arreglo
   * existente en el store, manteniendo las selecciones anteriores.
   * 
   * @param {TablaScianConfig} event - Objeto que contiene los datos del código SCIAN 
   * seleccionado, incluyendo información como código, descripción, nivel jerárquico
   * y otros metadatos relevantes de la clasificación industrial.
   * 
   * @returns {void} No retorna ningún valor, pero actualiza el estado del store.
   * 
   * @memberof ScianTablaContenedoraComponent
   * 
   * @example
   * ```typescript
   * // Ejemplo de uso interno cuando se selecciona un código SCIAN
   * const configScian: TablaScianConfig = {
   *   codigo: '11111',
   *   descripcion: 'Cultivo de soya',
   *   nivel: 5
   * };
   * this.obtenerSeleccionado(configScian);
   * ```
   * 
   * @throws {Error} Puede lanzar errores si el store no está disponible o si hay
   * problemas en la actualización del estado.
   * 
   * @see {@link TablaScianConfig} Para ver la estructura de datos del parámetro event.
   * @see {@link Tramite260206Store} Para entender cómo se gestiona el estado del trámite.
   */
  obtenerSeleccionado(event: TablaScianConfig): void {
     this.Tramite260206Store.update((state) => ({
      ...state,
      scianConfigDatos: [...state.scianConfigDatos, event]
    }))
  }
}
