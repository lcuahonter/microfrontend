import { AgregarFacturadorComponent } from '../../../../shared/components/agregar-facturador/agregar-facturador.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260209Store } from '../../estados/tramite260209Store.store';

/**
 * @class AgregarFacturadorContenedoraComponent
 * @description Componente contenedor que encapsula la funcionalidad de gestión de facturadores
 * para el trámite 260209. Este componente actúa como un wrapper que utiliza el componente
 * `AgregarFacturadorComponent` y gestiona la comunicación con el estado global del trámite
 * a través del store `Tramite260209Store`.
 * 
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * 
 * @example
 * ```html
 * <app-agregar-facturador-contenedora></app-agregar-facturador-contenedora>
 * ```
 */

@Component({
  /**
   * @property selector
   * @description Selector CSS utilizado para identificar este componente en las plantillas HTML.
   * Permite utilizar el componente como `<app-agregar-facturador-contenedora>`.
   * @type {string}
   */
  selector: 'app-agregar-facturador-contenedora',
  
  /**
   * @property standalone
   * @description Indica que este es un componente independiente que no requiere ser declarado
   * en un módulo Angular. Permite usar el componente directamente importándolo.
   * @type {boolean}
   */
  standalone: true,
  
  /**
   * @property imports
   * @description Array de dependencias que este componente necesita para funcionar correctamente.
   * Incluye CommonModule para directivas básicas y AgregarFacturadorComponent para la funcionalidad específica.
   * @type {Array}
   */
  imports: [CommonModule,AgregarFacturadorComponent],
  
  /**
   * @property templateUrl
   * @description Ruta relativa al archivo de plantilla HTML que define la estructura visual del componente.
   * @type {string}
   */
  templateUrl: './agregar-facturador-contenedora.component.html',
  
  /**
   * @property styleUrl
   * @description Ruta relativa al archivo de estilos SCSS que define la apariencia visual del componente.
   * @type {string}
   */
  styleUrl: './agregar-facturador-contenedora.component.scss',
})
export class AgregarFacturadorContenedoraComponent {
    
  /**
   * @property tramite260209Store
   * @description Store público que gestiona el estado global del trámite 260209.
   * Proporciona acceso a los métodos y propiedades para manipular los datos
   * relacionados con los facturadores del trámite.
   * 
   * @type {Tramite260209Store}
   * @public
   * @readonly Se inyecta a través del constructor y no debe ser reasignado
   */
  public tramite260209Store: Tramite260209Store;

  /**
   * @constructor
   * @description Constructor del componente que inicializa las dependencias necesarias.
   * Inyecta el store `Tramite260209Store` para permitir la gestión del estado del trámite
   * y la comunicación con otros componentes del sistema.
   * 
   * @param {Tramite260209Store} tramite260209Store - Store que administra el estado global del trámite 260209,
   * incluyendo los datos de facturadores, validaciones y operaciones CRUD.
   * 
   * @memberof AgregarFacturadorContenedoraComponent
   * @since 1.0.0
   */
    constructor(
        tramite260209Store: Tramite260209Store){
        this.tramite260209Store = tramite260209Store;
        // No se requiere lógica de inicialización adicional en este componente contenedor.
    }

    /**
   * @method updateFacturadorTablaDatos
   * @description Método público que actualiza los datos de la tabla de facturadores en el store del trámite.
   * Este método actúa como un puente entre el componente hijo `AgregarFacturadorComponent` y el store,
   * delegando la actualización de los datos al store correspondiente.
   * 
   * @param {Facturador[]} event - Array de objetos tipo Facturador que contiene la lista actualizada
   * de facturadores que se sincronizarán con el estado global del trámite. Cada objeto debe cumplir
   * con la interfaz Facturador definida en el modelo de terceros relacionados.
   * 
   * @returns {void} Este método no retorna ningún valor, ya que su propósito es actualizar el estado.
   * 
   * @throws {Error} Puede lanzar error si el store no está inicializado correctamente o si los datos
   * del parámetro event no son válidos.
   * 
   * @example
   * ```typescript
   * const facturadores: Facturador[] = [
   *   { id: 1, nombre: 'Facturador 1', rfc: 'RFC123456789' },
   *   { id: 2, nombre: 'Facturador 2', rfc: 'RFC987654321' }
   * ];
   * this.updateFacturadorTablaDatos(facturadores);
   * ```
   * 
   * @memberof AgregarFacturadorContenedoraComponent
   * @since 1.0.0
   * @public
   */
    updateFacturadorTablaDatos(event: Facturador[]): void {
        this.tramite260209Store.updateFacturadorTablaDatos(event);
    }
}
