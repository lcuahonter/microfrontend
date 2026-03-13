import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';
import { ID_PROCEDIMIENTO } from '../../constants/destinados-donacio.enum';
import { Tramite260209Store } from '../../estados/tramite260209Store.store';

/**
 * @class AgregarDestinatarioFinalContenedoraComponent
 * @description Componente contenedor Angular que encapsula la funcionalidad para agregar y gestionar
 * destinatarios finales en el trámite 260209. Este componente actúa como un contenedor inteligente
 * que utiliza el componente presentacional `AgregarDestinatarioFinalComponent` y se comunica con
 * el store de estado `Tramite260209Store` para mantener la persistencia de los datos de destinatarios.
 * 
 * @author Equipo de Desarrollo COFEPRIS
 * @version 3.0
 * @since 2025
 * 
 * @example
 * ```html
 * <app-agregar-destinatario-final-contenedora></app-agregar-destinatario-final-contenedora>
 * ```
 * 
 * @see {@link AgregarDestinatarioFinalComponent} - Componente hijo utilizado para la presentación
 * @see {@link Tramite260209Store} - Store utilizado para la gestión del estado
 * @see {@link Destinatario} - Modelo de datos para destinatarios
 */

@Component({
  selector: 'app-agregar-destinatario-final-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarDestinatarioFinalComponent],
  templateUrl: './agregar-destinatario-final-contenedora.component.html',
  styleUrl: './agregar-destinatario-final-contenedora.component.scss',
})
export class AgregarDestinatarioFinalContenedoraComponent {
  
  /**
   * @property {string} idProcedimiento
   * @readonly
   * @public
   * @description Identificador único del procedimiento asociado al trámite 260209.
   * Esta propiedad contiene el valor constante del ID del procedimiento que se utiliza
   * para identificar y categorizar el tipo de trámite que se está procesando.
   * Es una propiedad de solo lectura que se inicializa con el valor de la constante
   * ID_PROCEDIMIENTO importada desde los enums de destinados-donacio.
   * 
   * @example
   * ```typescript
   * // Acceso al ID del procedimiento
   * const procedimientoId = this.idProcedimiento;
   * ```
   * 
   * @since 3.0
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * @property {Tramite260209Store} tramiteStore
   * @public
   * @description Store de estado que administra toda la información relacionada con el trámite 260209.
   * Esta propiedad se inyecta a través del constructor y proporciona acceso a los métodos y propiedades
   * del store para la gestión del estado global del trámite, incluyendo la manipulación de datos
   * de destinatarios finales, validaciones y persistencia de información.
   * 
   * @example
   * ```typescript
   * // Acceso a métodos del store
   * this.tramiteStore.updateDestinatarioFinalTablaDatos(destinatarios);
   * ```
   * 
   * @since 3.0
   */
  public tramiteStore: Tramite260209Store;

  /**
   * @constructor
   * @description Constructor de la clase que inicializa el componente contenedor e inyecta
   * las dependencias necesarias para su funcionamiento. Específicamente, inyecta el store
   * de estado del trámite 260209 que será utilizado para gestionar toda la información
   * relacionada con los destinatarios finales y el estado general del trámite.
   * 
   * No requiere lógica de inicialización adicional ya que la configuración del componente
   * se realiza de manera declarativa a través de los decoradores de Angular.
   * 
   * @param {Tramite260209Store} tramiteStore - Instancia del store que administra el estado
   * del trámite 260209. Este store contiene métodos para actualizar, consultar y validar
   * los datos relacionados con destinatarios finales y otros aspectos del trámite.
   * 
   * @throws {Error} Lanza error si el tramiteStore no puede ser inyectado correctamente
   * 
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por Angular durante la instanciación
   * const component = new AgregarDestinatarioFinalContenedoraComponent(tramiteStore);
   * ```
   * 
   * @since 3.0
   */
  constructor(tramiteStore: Tramite260209Store) {
    this.tramiteStore = tramiteStore;
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * @method updateDestinatarioFinalTablaDatos
   * @public
   * @description Método público que actualiza la tabla de datos de destinatarios finales en el store
   * del trámite. Este método actúa como un puente entre el componente hijo `AgregarDestinatarioFinalComponent`
   * y el store de estado, recibiendo la lista actualizada de destinatarios y propagándola al store
   * para mantener la consistencia del estado global de la aplicación.
   * 
   * El método es invocado típicamente cuando el usuario realiza acciones como agregar, editar o
   * eliminar destinatarios finales desde la interfaz de usuario, garantizando que todos los cambios
   * se reflejen correctamente en el estado centralizado del trámite.
   * 
   * @param {Destinatario[]} event - Array de objetos tipo Destinatario que contiene la lista
   * actualizada de destinatarios finales. Cada objeto debe cumplir con la estructura definida
   * en el modelo Destinatario e incluir toda la información necesaria como nombre, identificación,
   * dirección y otros datos relevantes para el trámite.
   * 
   * @returns {void} Este método no retorna ningún valor, ya que su propósito es únicamente
   * actualizar el estado interno del store.
   * 
   * @throws {Error} Puede lanzar error si el parámetro event no es un array válido o si
   * alguno de los objetos Destinatario no cumple con la estructura esperada.
   * 
   * @example
   * ```typescript
   * // Ejemplo de uso desde el template del componente
   * onDestinatariosUpdated(destinatarios: Destinatario[]) {
   *   this.updateDestinatarioFinalTablaDatos(destinatarios);
   * }
   * 
   * // Ejemplo con datos de prueba
   * const destinatarios: Destinatario[] = [
   *   { id: '1', nombre: 'Juan Pérez', rfc: 'PEPJ800101XXX' },
   *   { id: '2', nombre: 'María García', rfc: 'GARM750615YYY' }
   * ];
   * this.updateDestinatarioFinalTablaDatos(destinatarios);
   * ```
   * 
   * @see {@link Destinatario} - Modelo de datos utilizado para los destinatarios
   * @see {@link Tramite260209Store.updateDestinatarioFinalTablaDatos} - Método del store invocado
   * 
   * @since 3.0
   */
  updateDestinatarioFinalTablaDatos(event: Destinatario[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
  }
}
