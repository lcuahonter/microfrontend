import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ID_PROCEDIMIENTO } from '../../constantes/materias-primas.enum';
import { ScianTablaComponent } from '../../../../shared/components/scian-tabla/scian-tabla.component';
import { TablaScianConfig } from '../../../../shared/models/datos-solicitud.model';
import { Tramite260203Store } from '../../estados/stores/tramite260203Store.store';

/**
 * Decorador `@Component` que define los metadatos para el componente `ScianTablaContenedoraComponent`.
 * 
 * Este componente es autónomo (`standalone`) y utiliza los módulos `CommonModule` y `ScianTablaComponent` 
 * como dependencias importadas. La plantilla HTML y los estilos del componente están definidos en 
 * los archivos `scian-tabla-contenedora.component.html` y `scian-tabla-contenedora.component.scss`, respectivamente.
 * 
 * Propiedades:
 * - `selector`: Define el nombre del selector que se utiliza para instanciar este componente en una plantilla HTML.
 * - `standalone`: Indica que este componente no depende de un módulo Angular para ser utilizado.
 * - `imports`: Lista de módulos y componentes que este componente utiliza como dependencias.
 * - `templateUrl`: Ruta al archivo que contiene la plantilla HTML del componente.
 * - `styleUrl`: Ruta al archivo que contiene los estilos CSS del componente.
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
   * @property {string} idProcedimiento
   * @description
   * Identificador del procedimiento.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;
  /**
   * Constructor de la clase `ScianTablaContenedoraComponent`.
   * 
   * Este constructor inicializa una instancia de la clase y realiza la inyección de dependencias
   * necesarias para el funcionamiento del componente. En este caso, se inyecta el servicio 
   * `Tramite260203Store`, que se utiliza para gestionar el estado relacionado con los trámites 
   * específicos de la aplicación.
   * 
   * @param tramite260203Store - Servicio de tipo `Tramite260203Store` que proporciona acceso 
   * al estado y las acciones relacionadas con los trámites de la aplicación.
   */
  constructor(private tramite260203Store: Tramite260203Store){}

  /**
   * Representa la configuración seleccionada de la tabla SCIAN.
   * 
   * Esta propiedad almacena un objeto de tipo `TablaScianConfig` que contiene 
   * la información de la selección actual realizada en la tabla SCIAN. 
   * Es utilizada para gestionar y manipular los datos seleccionados en el componente.
   * 
   * @type {TablaScianConfig}
   */
  public scianSeleccionado!: TablaScianConfig[];

  /**
   * Método que actualiza el estado del store con la configuración seleccionada de la tabla SCIAN.
   * 
   * @param event - Objeto de tipo `TablaScianConfig` que contiene los datos seleccionados de la tabla.
   */
  obtenerSeleccionado(event: TablaScianConfig | TablaScianConfig[]): void {
    const DATOS = Array.isArray(event) ? event : [event];
     this.tramite260203Store.update((state) => ({
      ...state,
      scianConfigDatos: DATOS
    }))
  }
}
