import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  SolicitanteComponent
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteContenedoraComponent } from '../../components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { TercerosRelacionadosContenedoraComponent } from '../../components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';
import { Tramite240114Query } from '../../estados/tramite240114Query.query';
import { Tramite240114Store } from '../../estados/tramite240114Store.store';

/**
 * @title Paso Uno
 * @description Componente que representa el primer paso del flujo de solicitud. Contiene los datos del solicitante, datos del trámite, terceros relacionados y pago de derechos.
 * @summary Agrupa los subcomponentes necesarios para capturar la información inicial del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    DatosDelTramiteContenedoraComponent,
    TercerosRelacionadosContenedoraComponent,
    PagoDeDerechosContenedoraComponent,
  ],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnDestroy, OnInit {
  /**
   * @description Constructor del componente.
   * Inicializa el componente y establece el índice de la pestaña seleccionada.
   */
  formularioDeshabilitado: boolean = false;
  /**
   * @property {ConsultaioState} consultaState - Estado actual relacionado con la consulta.
   */
  public consultaState!: ConsultaioState;
  /**
   * @property indice
   * @description Indica el índice de la pestaña seleccionada dentro del paso del formulario.
   * @type {number | undefined}
   */

  public indice: number | undefined = 1;

  /**
   * @property destroyNotifier$
   * @description Notificador observable para cancelar las suscripciones activas cuando el componente es destruido.
   * Ayuda a prevenir fugas de memoria.
   * @type {Subject<void>}
   */

  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Inicializa el componente con las consultas y el store necesarios para la gestión del estado.
   *
   * @param Tramite260210Query Consulta para acceder al estado del trámite.
   * @param tramite260214Store Store para actualizar el estado del trámite.
   * @param consultaQuery Consulta para acceder al estado de la consulta.
   * @param datosSolicitudService Servicio para manejar los datos relacionados con la solicitud.
   */

  constructor(
    private tramite240114Query: Tramite240114Query,
    private tramite240114Store: Tramite240114Store,
    private consultaQuery: ConsultaioQuery,
    private datosSolicitudService: DatosSolicitudService
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe a la pestaña seleccionada desde el estado y actualiza `indice`.
   *
   * @returns {void}
   */

  ngOnInit(): void {
    this.tramite240114Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab;
      });

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.update) {
            this.guardarDatosFormulario();
            this.formularioDeshabilitado = false;
          } else if (this.consultaState.readonly) {
            this.formularioDeshabilitado = true;
          }
        })
      )
      .subscribe();
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.More actions
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.datosSolicitudService
      .obtenerRegistroTomarMuestrasDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.tramite240114Store.setState(datos);
      });
  }
  /**
   * Actualiza el índice de la pestaña seleccionada en el store.
   *
   * @param i Índice de la pestaña seleccionada.
   * @returns {void}
   */

  public seleccionaTab(i: number): void {
    this.tramite240114Store.updateTabSeleccionado(i);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta justo antes de que el componente sea destruido.
   * Emite y completa el `destroyNotifier$` para cancelar la suscripción a los observables.
   *
   * @returns {void}
   */

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
