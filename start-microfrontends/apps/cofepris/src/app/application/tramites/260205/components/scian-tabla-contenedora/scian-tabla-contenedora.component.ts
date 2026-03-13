import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ScianTablaComponent } from '../../../../shared/components/scian-tabla/scian-tabla.component';
import { TablaScianConfig } from '../../../../shared/models/datos-solicitud.model';
import { Tramite260205Store } from '../../estados/stores/tramite260205.store';

/**
 * @component ScianTablaContenedoraComponent
 * 
 * Este componente representa un contenedor para la tabla SCIAN, que permite la selección 
 * y actualización de datos relacionados con la configuración de SCIAN. Es un componente 
 * independiente que utiliza el módulo común de Angular y el componente `ScianTablaComponent`.
 * 
 * @selector app-scian-tabla-contenedora
 * 
 * @standalone true
 * 
 * @imports CommonModule, ScianTablaComponent
 * 
 * @templateUrl ./scian-tabla-contenedora.component.html
 * 
 * @styleUrl ./scian-tabla-contenedora.component.scss
 * 
 * @class ScianTablaContenedoraComponent
 * 
 * @constructor
 * - `Tramite260205Store`: Servicio inyectado que gestiona el estado de la aplicación 
 *   relacionado con el trámite 260205.
 * 
 * @property scianSeleccionado
 * - Tipo: `TablaScianConfig`
 * - Propiedad pública que almacena la configuración seleccionada de la tabla SCIAN.
 * 
 * @method obtenerSeleccionado
 * - Descripción: Método que actualiza el estado del store con la configuración seleccionada 
 *   de la tabla SCIAN.
 * - Parámetros:
 *   - `event`: Objeto de tipo `TablaScianConfig` que contiene los datos seleccionados de la tabla.
 * - Retorno: `void`
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
   * Constructor de la clase ScianTablaContenedoraComponent.
   * 
   * Este constructor inicializa una instancia de la clase y realiza la inyección de dependencias
   * necesarias para el funcionamiento del componente. En este caso, se inyecta el servicio 
   * `Tramite260205Store`, que se utiliza para gestionar el estado y las operaciones relacionadas 
   * con el trámite 260205.
   * 
   * @param Tramite260205Store - Servicio encargado de manejar el estado y las operaciones del trámite 260205.
   */
  constructor(private Tramite260205Store: Tramite260205Store){}

  /**
   * Representa la configuración seleccionada de la tabla SCIAN.
   * 
   * Esta propiedad almacena una instancia de `TablaScianConfig` que 
   * contiene los datos y configuraciones relevantes para el elemento 
   * seleccionado en la tabla SCIAN. Es utilizada para gestionar la 
   * selección actual y realizar operaciones relacionadas con el elemento 
   * seleccionado.
   * 
   * @type {TablaScianConfig}
   */
  public scianSeleccionado!: TablaScianConfig;

  /**
   * Método que actualiza el estado del store con la configuración seleccionada de la tabla SCIAN.
   * 
   * @param event - Objeto de tipo `TablaScianConfig` que contiene los datos seleccionados de la tabla.
   */
  obtenerSeleccionado(event: TablaScianConfig): void {
     this.Tramite260205Store.update((state) => ({
      ...state,
      scianConfigDatos: [event]
    }))
  }
}
