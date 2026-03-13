import { Component, EventEmitter, Output } from '@angular/core';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-armas-explosivo.enum';
import { Observable } from 'rxjs';
import { Tramite240108Query } from '../../estados/tramite240108Query.query';
import { Tramite240108Store } from '../../estados/tramite240108Store.store';

/**
 * @title Agregar Destinatario Final Contenedora
 * @description Componente contenedor que gestiona la integración del componente de destinatario final con el store.
 * @summary Encapsula el componente de agregar destinatario final y propaga los datos al estado global.
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
   * Evento que se emite para notificar el cierre del componente.
   * Los componentes padres pueden suscribirse a este evento para ejecutar acciones al cerrar.
   *
   * @type {EventEmitter<void>}
   * @memberof AgregarDestinatarioFinalContenedoraComponent
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Identificador del procedimiento.
   * @property {number} idProcedimiento
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Observable que emite los datos del tercero (destinatario o proveedor),
   * que pueden ser `DestinoFinal`, `Proveedor`, `null` o `undefined`.
   * 
   * Se utiliza para obtener la información actual del tercero desde una fuente reactiva.
   *
   * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
   */
  terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240108Store} tramiteStore - Store que administra el estado del trámite.
   * @returns {void}
   */
  constructor(public tramiteStore: Tramite240108Store, public tramiteQuery: Tramite240108Query) {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }

  /**
 * Observable que proporciona la lista de destinatarios finales
 * registrados en la tabla del trámite.
 */
  destinatariosTablaDatos$ = this.tramiteQuery.getDestinatarioFinalTablaDatos$;

  /**
   * Actualiza la lista de destinatarios finales en el store del trámite.
   *
   * @method updateDestinatarioFinalTablaDatos
   * @param {DestinoFinal[]} event - Lista de destinatarios finales actualizada.
   * @returns {void}
   */
  updateDestinatarioFinalTablaDatos(event: DestinoFinal[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
    this.cerrar.emit();
  }

  /**
  * Maneja el evento para cerrar la acción actual.
  * Limpia los datos de terceros del store de trámite.
  */
  cerrarEvent(): void {
    this.tramiteStore.clearTercerosDatos();
  }

  /**
  * @method ngOnInit
  * @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
  * @command Este método asigna un observable `terechosDatos$` con los datos obtenidos desde `tramiteQuery`.
  */
  ngOnInit(): void {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }
}
