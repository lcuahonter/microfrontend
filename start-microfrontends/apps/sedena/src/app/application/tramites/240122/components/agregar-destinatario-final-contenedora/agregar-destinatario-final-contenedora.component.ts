import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { AgregarDestinatarioCustomComponent } from '../../../../shared/components/agregar-destinatario-custom/agregar-destinatario-custom.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';
import { Tramite240122Query } from '../../estados/tramite240122Query.query';
import { Tramite240122Store } from '../../estados/tramite240122Store.store';

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
 * en el contexto del trámite 240122. Este componente es independiente y utiliza otros módulos
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
   * @property {number} idProcedimiento - Identificador del procedimiento asociado al trámite.
   * @remarks Este valor se utiliza para identificar el trámite 240122.
   */
  public readonly idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240122;

  /**
   * @property {Observable<DestinoFinal | Proveedor | null | undefined>} terechosDatos$ - Observable que emite información sobre el destino final, proveedor o un valor nulo/indefinido.
   * @remarks Este observable se utiliza para gestionar los datos relacionados con los derechos
   * y destinatarios finales en el contexto de la aplicación.
   */
  public terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * 
   * @remarks
   * Cuando esta propiedad es `true`, los campos del formulario no serán editables.
   * 
   * @defaultValue false
   * 
   * @example
   * // Para activar el modo solo lectura:
   * this.esFormularioSoloLectura = true;
   * 
   * @es
   * Indica si el formulario es solo de lectura.
   */
  public esFormularioSoloLectura: boolean = false;
  /**
 * Subject para notificar la destrucción del componente.
 */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240122Store} tramiteStore - Store que administra el estado del trámite.
   * @param {Tramite240122Query} tramiteQuery - Query que permite obtener datos relacionados con el trámite.
   * @param {ConsultaioQuery} consultaioQuery - Query que permite obtener el estado de la consulta.
   * @returns {void}
   */
  constructor(public tramiteStore: Tramite240122Store, public tramiteQuery: Tramite240122Query, private readonly consultaioQuery: ConsultaioQuery) {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }
  /**
 * @inheritdoc
 * @description
 * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
 * Suscribe al observable del estado de consulta para actualizar la propiedad
 * `esFormularioSoloLectura` según el estado de solo lectura (`readonly`) de la sección.
 * La suscripción se mantiene activa hasta que se emite un valor en `destroyNotifier$`,
 * lo que previene fugas de memoria.
 *
 * @returns {void}
 */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe()
  }

  /**
   * Actualiza la lista de destinatarios finales en el store del trámite.
   *
   * @method updateDestinatarioFinalTablaDatos
   * @param {DestinoFinal[]} event - Lista de destinatarios finales actualizada.
   * @returns {void}
   * @remarks Este método se utiliza para propagar los cambios en la lista de destinatarios finales al estado global.
   */
  updateDestinatarioFinalTablaDatos(event: DestinoFinal[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
    this.cerrar.emit();
  }
actualizaExistenteEnDestinatarioDatos(event: DestinoFinal[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
    this.cerrar.emit();
  }
  /**
   * Hook del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   *
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  onCancelar():void {
  this.tramiteStore.actualizarDatosDestinatario({} as DestinoFinal);
  this.cerrar.emit();
}

}
