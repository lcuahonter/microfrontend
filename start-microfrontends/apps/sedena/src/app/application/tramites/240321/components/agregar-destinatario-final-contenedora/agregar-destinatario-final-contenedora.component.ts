import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AgregarDestinatarioCustomComponent } from '../../../../shared/components/agregar-destinatario-custom/agregar-destinatario-custom.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240321Query } from '../../estados/tramite240321Query.query';
import { Tramite240321Store } from '../../estados/tramite240321Store.store';
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
export class AgregarDestinatarioFinalContenedoraComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
* Observable que proporciona los datos de la tabla de destinatarios finales.
* Se obtiene desde `tramiteQuery` y se puede suscribir para renderizar
* la tabla o reaccionar a cambios en los datos.
*
* @type {Observable<Destinatario[]>}
*/
  destinatariosTablaDatos$ = this.tramiteQuery.getDestinatarioFinalTablaDatos$;

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
    * Subject utilizado para gestionar la desuscripción de observables.
    * Se completa en `ngOnDestroy()` para prevenir fugas de memoria.
    * @property {Subject<void>} unsubscribe$
    * @private
    */
  private unsubscribe$ = new Subject<void>();

  /**
   * Almacena el índice del destinatario actual.
   * @property {string} destinatarioIndice
   */
  destinatarioIndice: string = '';

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
   * @property {boolean} estaOculto - Indica si el elemento está oculto o visible.
   * @remarks Este valor determina la visibilidad del componente en la interfaz de usuario.
   * @command Cambiar el valor de esta propiedad para alternar la visibilidad.
   */
  public readonly idProcedimiento: number = NUMERO_TRAMITE.TRAMITE_240321;

  /**
 * Maneja el evento para cerrar la acción actual.
 * Limpia los datos de terceros del store de trámite.
 */
  cerrarEvent(): void {
    this.tramiteStore.clearTercerosDatos();
  }

  /**
 * Datos de la tabla de destinatarios finales.
 * @property {DestinoFinal[]} destinatarioFinalTablaDatos
 */
  destinatarioFinalTablaDatos: DestinoFinal[] = [];

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   *
   * @type {boolean}
   * @memberof AgregarDestinatarioFinalContenedoraComponent
   * @see https://compodoc.app/
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240321Store} tramiteStore - Store que administra el estado del trámite.
   * @param {ActivatedRoute} route - Ruta activa para obtener parámetros de la URL.
   * @param {Tramite240321Query} tramiteQuery - Query de Akita
   * para obtener datos del trámite.
   * @param {ConsultaioQuery} consultaioQuery - Query para obtener el estado de la sección de consulta.
   * @returns {void}
   */
  constructor(public tramiteStore: Tramite240321Store, private route: ActivatedRoute, private tramiteQuery: Tramite240321Query, private readonly consultaioQuery: ConsultaioQuery) {
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
   * Actualiza los datos de un destinatario final existente en el store.
   *
   * @method actualizaExistenteEnDestinatarioDatos
   * @param {DestinoFinal[]} event - Lista de destinatarios finales actualizada.
   * @returns {void}
   */
  actualizaExistenteEnDestinatarioDatos(event: DestinoFinal[]): void {
    this.tramiteStore.actualizaExistenteEnDestinatarioDatos(event);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe a los parámetros de la ruta y actualiza el estado del destinatario final.
   *
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => {
        const INDICE = String(params['destinario']);
        this.destinatarioIndice = INDICE;
        this.tramiteQuery.getDestinatarioFinalTablaDatos$
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((data) => {
            this.destinatarioFinalTablaDatos = data;
          });
      });
  }

  /**
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista del componente ha sido inicializada.
   * 
   * Suscribe al observable `selectConsultaioState$` para escuchar cambios en el estado de la sección y actualizar
   * la propiedad `esFormularioSoloLectura` según el valor de `readonly` en el estado.
   * 
   * La suscripción se mantiene activa hasta que se emite un valor en `unsubscribe$`, lo que previene fugas de memoria.
   * 
   * @see https://angular.io/api/core/AfterViewInit
   * 
   * @memberof AgregarDestinatarioFinalContenedoraComponent
   */
  ngAfterViewInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   *
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
