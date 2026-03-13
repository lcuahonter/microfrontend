import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  DestinoFinal,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-sustancias-quimicas.enum';
import { Observable } from 'rxjs';
import { Tramite240106Query } from '../../estados/tramite240106Query.query';
import { Tramite240106Store } from '../../estados/tramite240106Store.store';

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
export class AgregarDestinatarioFinalContenedoraComponent implements OnInit {
    /**
     * @property terechosDatos$
     * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
     * @description Observable que emite datos relacionados con el destino final o proveedor.
     * Puede ser un objeto de tipo `DestinoFinal`, `Proveedor`, `null` o `undefined`.
     * @command Este observable se utiliza para gestionar y observar los datos de los proveedores o destinos finales en el componente.
     */
    terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;

  /**
   * @event cerrar
   * @description Evento emitido para indicar que se debe cerrar el componente.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
 * Observable que emite la lista de destinatarios finales
 * almacenados en el estado del trámite.
 */
 destinatariosTablaDatos$ = this.tramiteQuery.getDestinatarioFinalTablaDatos$;

  /**
   * Emite un evento para señalar la cancelación de una acción o proceso.
   * 
   * Otros componentes o servicios pueden suscribirse a este evento para realizar limpieza
   * o revertir cambios cuando el usuario activa una acción de cancelación.
   *
   * @event
   */
  cancelarEventListenerCancel = new EventEmitter<void>();

  /**
   * Identificador del procedimiento.
   * @property {number} idProcedimiento
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;
  
  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240105Store} tramiteStore - Store que administra el estado del trámite.
   * @returns {void}
   */
  constructor(public tramiteStore: Tramite240106Store,public tramiteQuery: Tramite240106Query) {}

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
