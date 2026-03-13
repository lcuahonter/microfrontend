import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AgregarDestinatarioCustomComponent } from '../../../../shared/components/agregar-destinatario-custom/agregar-destinatario-custom.component';
import { CommonModule } from '@angular/common';
import { DestinoFinal } from '../../../../shared/models/terceros-relacionados.model';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { Tramite240120Query } from '../../estados/tramite240120Query.query';
import { Tramite240120Store } from '../../estados/tramite240120Store.store';

/**
 * @title Agregar Destinatario Final Contenedora
 * @description Componente contenedor que gestiona la integración del componente de destinatario final con el store.
 * @summary Encapsula el componente de agregar destinatario final y propaga los datos al estado global.
 */

@Component({
  selector: 'app-agregar-destinatario-final-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarDestinatarioCustomComponent],
  templateUrl: './agregar-destinatario-final-contenedora.component.html',
  styleUrl: './agregar-destinatario-final-contenedora.component.scss',
})
export class AgregarDestinatarioFinalContenedoraComponent implements OnInit, OnDestroy {
  
  /**
   * @event cerrar
   * @description Evento emitido para indicar que se debe cerrar el componente.
   * @remarks
   * Este evento no envía ningún valor, simplemente notifica a los componentes padres que se debe realizar la acción de cierre.
   * 
   * @eventType void
   * @es
   * Evento que se dispara para cerrar el componente actual.
   */
  @Output() cerrar = new EventEmitter<void>();  
  
  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240120Store} tramiteStore - Store que administra el estado del trámite.
   * @returns {void}
   */

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Identificador del procedimiento asociado al trámite.
   * @type {number}
   */
  public readonly idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240120;

  /**
   * Datos del destinatario final. Puede ser un objeto DestinoFinal, null o indefinido.
   * @type {DestinoFinal | null | undefined}
   */
  public destinatarioFinalDatos!: DestinoFinal | null | undefined;


  // eslint-disable-next-line no-empty-function
  constructor(public tramiteStore: Tramite240120Store,
    public tramiteQuery: Tramite240120Query,
  ) {}

/**
 * Actualiza la lista de destinatarios finales en el store del trámite.
 *
 * @param {DestinoFinal[]} event - Lista de destinatarios finales actualizada.
 * @returns {void}
 */
  updateDestinatarioFinalTablaDatos(event: DestinoFinal[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
  }

  /**
 * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
 * Se suscribe al observable `getmodificarDestinarioDatos$` para obtener los datos
 * del destinatario final y los asigna a la propiedad local. Utiliza `takeUntil`
 * para limpiar la suscripción al destruir el componente.
 *
 * @returns {void}
 */
  
  ngOnInit(): void {
     this.tramiteQuery.getmodificarDestinarioDatos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.destinatarioFinalDatos = datos;
      });
  }
 

/**
 * Actualiza los datos existentes del destinatario final en el store.
 *
 * @param {DestinoFinal[]} event - Arreglo de objetos DestinoFinal con los datos actualizados.
 * @returns {void}
 */
  actualizaExistenteEnDestinatarioDatos(event: DestinoFinal[]): void {
    this.tramiteStore.actualizaExistenteEnDestinatarioDatos(event);
  }

/**
 * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
 * Emite y completa el observable `destroyNotifier$` para limpiar suscripciones activas
 * y prevenir fugas de memoria.
 *
 * @returns {void}
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
