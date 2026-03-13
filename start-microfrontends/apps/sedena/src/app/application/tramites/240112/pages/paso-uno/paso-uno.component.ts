import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AgregarDestinatarioService } from '../../service/agregar-destinatario.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDelTramiteContenedoraComponent } from '../../components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { PagoDeDerechocComponent } from '../../components/pago-de-derechoc/pago-de-derechoc.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { TercerosRelacionadosContenedoraComponent } from '../../components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';
import { Tramite240112Query } from '../../estados/tramite240112Query.query';
import { Tramite240112Store } from '../../estados/tramite240112Store.store';

/**
 * Componente encargado de gestionar el primer paso del flujo del trámite.
 *
 * @component
 *
 * @remarks
 * Este componente administra la selección de pestañas dentro del paso uno,
 * mantiene el estado del formulario habilitado o deshabilitado, y
 * se conecta con servicios y stores para obtener y actualizar datos.
 *
 * @example
 * ```html
 * <app-paso-uno></app-paso-uno>
 * ```
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [
    SolicitanteComponent,
    TercerosRelacionadosContenedoraComponent,
    DatosDelTramiteContenedoraComponent,
    PagoDeDerechocComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ]
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Índice de la pestaña seleccionada actualmente.
   * Indica cuál pestaña está activa en el formulario.
   *
   * @type {number}
   * @default 1
   */
  /**
     * Índice de la pestaña seleccionada.
     * @property {number} indice - Índice de la pestaña actualmente seleccionada.
     * @default 1
     */
  @Input() indice: number = 1;

  /**
   * Observable Subject para notificar y cancelar suscripciones al destruir el componente,
   * evitando fugas de memoria.
   *
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario debe estar deshabilitado para edición.
   * Cuando es `true`, los controles del formulario se muestran en modo solo lectura.
   *
   * @type {boolean}
   * @default false
   */
  formularioDeshabilitado: boolean = false;

  /**
   * Lista de las secciones o pestañas del formulario,
   * cada una con su índice, título y nombre del componente asociado.
   *
   * @type {Array<{ index: number; title: string; component: string; }>}
   */
  seccionesDeLaSolicitud = [
    { index: 1, title: 'Solicitante', component: 'solicitante' },
    { index: 2, title: 'Datos del trámite', component: 'datos-de-tramite' },
    { index: 3, title: 'Terceros relacionados', component: 'terceros-relacionados' },
    { index: 4, title: 'Pago de derechos', component: 'pago-de-derechos' }
  ];

  /**
   * Constructor del componente PasoUnoComponent.
   *
   * @param tramite240112Query Servicio para consultar el estado del trámite.
   * @param tramite240112Store Servicio para actualizar el estado del trámite.
   * @param consultaQuery Servicio para consultar el estado de la consulta.
   * @param agregarDestinatarioService Servicio para gestionar destinatarios y datos del formulario.
   */
  constructor(
    private tramite240112Query: Tramite240112Query,
    private tramite240112Store: Tramite240112Store,
    private consultaQuery: ConsultaioQuery,
    private agregarDestinatarioService: AgregarDestinatarioService
  ) { }

  /**
   * Hook del ciclo de vida Angular que se ejecuta al inicializar el componente.
   * Se suscribe a observables para controlar la pestaña activa y el estado del formulario.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite240112Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab ?? 1;
      });

    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        if (seccionState.update) {
          this.formularioDeshabilitado = false;
          this.guardarDatosFormulario();
        }
        if (seccionState.readonly) {
          this.formularioDeshabilitado = true;
        }
      });
  }

  /**
   * Obtiene los datos de acuicultura desde el servicio y actualiza el estado del formulario.
   *
   * @remarks
   * Realiza una suscripción con `takeUntil` para evitar fugas de memoria.
   *
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    this.agregarDestinatarioService
      .getAcuiculturaData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.agregarDestinatarioService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Cambia la pestaña seleccionada y actualiza el estado en el store.
   *
   * @param {number} i Índice de la pestaña a seleccionar.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.tramite240112Store.updateTabSeleccionado(i);
  }

  /**
   * Hook del ciclo de vida Angular que se ejecuta al destruir el componente.
   * Realiza limpieza de suscripciones para evitar fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
