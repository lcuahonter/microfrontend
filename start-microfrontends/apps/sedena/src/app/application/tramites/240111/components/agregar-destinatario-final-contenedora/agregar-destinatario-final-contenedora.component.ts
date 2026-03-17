import { Component, EventEmitter, Output } from '@angular/core';
import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-armas-municiones.enum';
import { Tramite240111Store } from '../../estados/tramite240111Store.store';
import { Tramite240111Query } from '../../estados/tramite240111Query.query';
import { Observable } from 'rxjs';


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
  styleUrl: './agregar-destinatario-final-contenedora.component.css',
})
export class AgregarDestinatarioFinalContenedoraComponent {
  /**
   * Evento emitido cuando se solicita cerrar el componente.
   * @event cerrar
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
      * @property terechosDatos$
      * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
      * @description Observable que emite datos relacionados con el destino final o proveedor.
      * Puede ser un objeto de tipo `DestinoFinal`, `Proveedor`, `null` o `undefined`.
      * @command Este observable se utiliza para gestionar y observar los datos de los proveedores o destinos finales en el componente.
      */
  terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;

  /**
   * Identificador del procedimiento.
   * @property {number} idProcedimiento
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240111Store} tramiteStore - Store que administra el estado del trámite.
   * @returns {void}
   */
  // eslint-disable-next-line no-empty-function
  constructor(public tramiteStore: Tramite240111Store, public tramiteQuery: Tramite240111Query) { }

  /**
 * Observable que emite la lista de destinatarios finales
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
