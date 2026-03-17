import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ID_PROCEDIMIENTO } from '../../constants/destinados-donacio.enum';
import { ScianTablaComponent } from '../../../../shared/components/scian-tabla/scian-tabla.component';
import { TablaScianConfig } from '../../../../shared/models/datos-solicitud.model';
import { Tramite260209Store } from '../../estados/tramite260209Store.store';


/**
 * Componente contenedor para la tabla SCIAN.
 * 
 * Este componente sirve como contenedor para el componente `ScianTablaComponent`,
 * permitiendo su integración y reutilización dentro de otras vistas o módulos.
 * 
 * @selector app-scian-tabla-contenedora
 * @standalone true
 * @imports CommonModule, ScianTablaComponent
 * @templateUrl ./scian-tabla-contenedora.component.html
 * @styleUrl ./scian-tabla-contenedora.component.scss
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
   * Identificador único del procedimiento.
   * Esta propiedad es de solo lectura y se inicializa con el valor constante `ID_PROCEDIMIENTO`.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;
  
  /**
   * Constructor que inyecta el store del trámite 260209.
   * @constructor
   * @param {Tramite260209Store} tramite260209Store - Store que maneja el estado del trámite 260209.
   */
  constructor(private tramite260209Store: Tramite260209Store) {
        // No se necesita lógica de inicialización adicional.
  }

  /**
   * Configuración del SCIAN (Sistema de Clasificación Industrial de América del Norte) seleccionado.
   * @type {TablaScianConfig}
   * @public
   */
  public scianSeleccionado!: TablaScianConfig;

  /**
   * Método que actualiza el estado del store con la configuración seleccionada de la tabla SCIAN.
   * 
   * @param event - Objeto de tipo `TablaScianConfig` que contiene los datos seleccionados de la tabla.
   */
  obtenerSeleccionado(event: TablaScianConfig): void {
     this.tramite260209Store.update((state) => ({
      ...state,
      scianConfigDatos: [event]
    }))
  }
}
