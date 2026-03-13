import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ID_PROCEDIMIENTO } from '../../constants/remedios-herbolarios.enum';
import { ScianTablaComponent } from '../../../../shared/components/scian-tabla/scian-tabla.component';
import { TablaScianConfig } from '../../../../shared/models/datos-solicitud.model';
import { Tramite260219Store } from '../../estados/tramite260219Store.store';


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
   * Constructor que inyecta el store del trámite 260219.
   * @constructor
   * @param {Tramite260219Store} tramite260219Store - Store que maneja el estado del trámite 260219.
   */
  constructor(private tramite260219Store: Tramite260219Store) {
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
     this.tramite260219Store.update((state) => ({
      ...state,
      scianConfigDatos: [...state.scianConfigDatos, event]
    }))
  }
}
