import { Component, EventEmitter, Output } from '@angular/core';
import {
  DestinoFinal,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { AgregarDestinatarioCustomComponent } from '../../../../shared/components/agregar-destinatario-custom/agregar-destinatario-custom.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Tramite240119Query } from '../../estados/tramite240119Query.query';
import { Tramite240119Store } from '../../estados/tramite240119Store.store';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';

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
export class AgregarDestinatarioFinalContenedoraComponent {

  /**
 * Observable que emite la lista de destinatarios finales desde el store `Tramite240121Query`.
 * Se utiliza para proporcionar datos reactivos al componente hijo.
 */
  destinatariosTablaDatos$ = this.tramiteQuery.getDestinatarioFinalTablaDatos$;

  /**
   * Evento que se emite para cerrar el componente.
   * @property {EventEmitter<void>} cerrar
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * @property {boolean} estaOculto - Indica si el elemento está oculto o visible.
   * @remarks Este valor determina la visibilidad del componente en la interfaz de usuario.
   * @command Cambiar el valor de esta propiedad para alternar la visibilidad.
   */
  public readonly idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240119;

  /**
   * Observable que emite información sobre el destino final, proveedor o un valor nulo/indefinido.
   *
   * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
   *
   * @remarks
   * Este observable se utiliza para gestionar los datos relacionados con los derechos
   * y destinatarios finales en el contexto de la aplicación.
   */
  public terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240119Store} tramiteStore - Store que administra el estado del trámite.
   * @param {Tramite240119Query} tramiteQuery - Consulta que proporciona acceso a los datos del trámite.
   * @returns {void}
   */
  constructor(
    public tramiteStore: Tramite240119Store,
    public tramiteQuery: Tramite240119Query
  ) {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }

  /**
 * Maneja el evento para cerrar la acción actual.
 * Limpia los datos de terceros del store de trámite.
 */
  cerrarEvent(): void {
    this.tramiteStore.clearTercerosDatos();
  }

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
 * Actualiza la información del destinatario final en el estado del trámite
 * y notifica el cierre del formulario o modal correspondiente.
 *
 * @param event Lista actualizada de destinatarios finales.
 */
  actualizaExistenteEnDestinatarioDatos(event: DestinoFinal[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
    this.cerrar.emit();
  }
}
