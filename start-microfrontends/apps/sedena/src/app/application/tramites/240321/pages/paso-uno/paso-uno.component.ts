import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteContenedoraComponent } from '../../components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { FolioComponent } from '../../components/folio/folio.component';
import { ModificacionService } from '../../services/modificacion.service';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { TercerosRelacionadosContenedoraComponent } from '../../components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';
import { Tramite240321Store } from '../../estados/tramite240321Store.store';
import { Tramite240321Query } from '../../estados/tramite240321Query.query';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

/**
 * @title Paso Uno
 * @description Componente que representa el primer paso del flujo de solicitud. Contiene los datos del solicitante, datos del trámite, terceros relacionados y pago de derechos.
 * @summary Agrupa los subcomponentes necesarios para capturar la información inicial del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [SolicitanteComponent, DatosDelTramiteContenedoraComponent, TercerosRelacionadosContenedoraComponent, PagoDeDerechosContenedoraComponent, CommonModule, FolioComponent]
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
  /**
    * Índice de la pestaña seleccionada.
    * @property {number} indice - Índice de la pestaña actualmente seleccionada.
    * @default 1
    */
  @Input() indice: number = 1;

  /**
* Evento que emite el índice de la pestaña seleccionada.
* Se utiliza para notificar al componente padre
* cuando el usuario cambia de pestaña.
* @type {EventEmitter<number>}
*/
  @Output() selectedTab = new EventEmitter<number>();

  /**
   * @description
   * Estado actual de la consulta para el componente.
   * 
   * @type {ConsultaioState}
   * @memberof PasoUnoComponent
   */
  public consultaState!: ConsultaioState;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @desc Constructor de la clase PasoUnoComponent.
   * 
   * @param consultaQuery Servicio para consultar información relacionada con el trámite.
   * @param modificacionService Servicio para manejar las modificaciones del trámite.
   * @param tramiteStore Almacén de estado específico para el trámite 240321.
   */
  constructor(private readonly consultaQuery: ConsultaioQuery, private modificacionService: ModificacionService, private tramiteStore: Tramite240321Store, private tramiteQuery: Tramite240321Query, private datosSolicitudService: DatosSolicitudService) { }

  /**
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * En este método, se suscribe al estado de la consulta utilizando el servicio `consultaQuery` y actualiza el estado del componente.
   * La suscripción se gestiona para evitar fugas de memoria utilizando el observable `destroyNotifier$`.
   * 
   * @see https://angular.io/api/core/OnInit
   */
  ngOnInit(): void {
    this.tramiteQuery.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab ?? 1;
      });

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;

        })
      )
      .subscribe();
  }

  /**
* Updates the selected tab index in the store.
*
* @param i Index of the selected tab.
* @returns {void}
*/
  public seleccionaTab(i: number): void {
    this.tramiteStore.updateTabSeleccionado(i);
  }

  /**
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Notifica a los suscriptores y completa el observable `destroyNotifier$` para evitar fugas de memoria.
   *
   * @see https://angular.io/api/core/OnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
