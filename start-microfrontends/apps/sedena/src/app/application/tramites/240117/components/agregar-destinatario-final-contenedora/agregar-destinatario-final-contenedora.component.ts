import { Component, EventEmitter, Output } from '@angular/core';
import {
  DestinoFinal,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { AgregarDestinatarioCustomComponent } from '../../../../shared/components/agregar-destinatario-custom/agregar-destinatario-custom.component';
import { CommonModule } from '@angular/common';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { Observable } from 'rxjs';
import { Tramite240117Query } from '../../estados/tramite240117Query.query';
import { Tramite240117Store } from '../../estados/tramite240117Store.store';

/**
 * @title Agregar Destinatario Final Contenedora
 * @description Componente contenedor que gestiona la integración del componente de destinatario final con el store.
 * @summary Encapsula el componente de agregar destinatario final y propaga los datos al estado global.
 */
/**
 * @component
 * @name AgregarDestinatarioFinalContenedoraComponent
 * @description
 * Componente encargado de gestionar la interfaz de usuario para agregar destinatarios finales
 * en el contexto del trámite 240117. Este componente es independiente y utiliza otros módulos
 * y componentes para su funcionalidad.
 *
 * @selector app-agregar-destinatario-final-contenedora
 * @standalone true
 * @imports
 * - CommonModule
 * - AgregarDestinatarioCustomComponent
 *
 * @templateUrl ./agregar-destinatario-final-contenedora.component.html
 * @styleUrl ./agregar-destinatario-final-contenedora.component.scss
 *
 * @remarks
 * Este componente interactúa con el store y las consultas del trámite para gestionar
 * los datos relacionados con los destinatarios finales.
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
   * Observable que emite la lista de destinatarios finales
   * registrados en la tabla del trámite.
   *
   * @type {Observable<DestinoFinal[]>}
   */
  destinatariosTablaDatos$ = this.tramiteQuery.getDestinatarioFinalTablaDatos$;

  /**
 * Evento que notifica al componente padre
 * el cierre del componente.
 */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * @property {boolean} estaOculto - Indica si el elemento está oculto o visible.
   * @remarks Este valor determina la visibilidad del componente en la interfaz de usuario.
   * @command Cambiar el valor de esta propiedad para alternar la visibilidad.
   */
  public readonly idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240117;

  /**
   * Observable que emite información sobre el destino final, proveedor o un valor nulo/indefinido.
   *
   * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
   *
   * @remarks
   * Este observable se utiliza para gestionar los datos relacionados con los derechos
   * y destinatarios finales en el contexto de la aplicación.
   */
  public terechosDatos$!: Observable<
    DestinoFinal | Proveedor | null | undefined>;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240117Store} tramiteStore - Store que administra el estado del trámite.
   * @param {Tramite240117Query} tramiteQuery - Consulta que proporciona acceso a los datos del trámite.
   * @returns {void}
   */
  constructor(
    public tramiteStore: Tramite240117Store,
    public tramiteQuery: Tramite240117Query

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
 * Actualiza los datos del destinatario final existente
 * en la tabla del trámite y emite el evento de cierre.
 *
 * @param event Lista actualizada de destinatarios finales.
 */
  actualizaExistenteEnDestinatarioDatos(event: DestinoFinal[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
    this.cerrar.emit();
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
