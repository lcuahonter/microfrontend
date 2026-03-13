import {
  ConsultaioQuery,
  ConsultaioState,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import { Subject, map, } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DatosDelTramiteContenedoraComponent } from '../../components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { TercerosRelacionadosContenedoraComponent } from '../../components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';
import { Tramite240117Query } from '../../estados/tramite240117Query.query';
import { Tramite240117Store } from '../../estados/tramite240117Store.store';
import { takeUntil } from 'rxjs';

/**
 * @component
 * @name PasoUnoComponent
 * @description Este componente representa el primer paso de un formulario en el flujo de trámites.
 * Gestiona el índice de la pestaña seleccionada y actualiza el estado correspondiente en el store.
 * También maneja la suscripción a observables para evitar fugas de memoria.
 *
 * @implements OnDestroy
 * @implements OnInit
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
   * Índice de la pestaña seleccionada.
   * @property {number} indice - Índice de la pestaña actualmente seleccionada.
   * @default 1
   */
  @Input() indice: number = 1;

  /**
   * @property destroyNotifier$
   * @description Observable que notifica para cancelar suscripciones activas cuando el componente es destruido.
   * Ayuda a prevenir fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @param tramite240117Query - Servicio de consulta para gestionar el estado del trámite 240117.
   * @param tramite240117Store - Servicio de almacenamiento para actualizar el estado del trámite 240117.
   * @param consultaQuery - Servicio de consulta para gestionar los estados de consulta.
   * @param datosSolicitudService - Servicio para obtener los datos de la solicitud.
   */
  constructor(
    private tramite240117Query: Tramite240117Query,
    private tramite240117Store: Tramite240117Store,
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
    this.tramite240117Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab??1;
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
      .obtenerRegistroTomarMuestrasDatosQuimacs()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.tramite240117Store.setState(datos);
      });
  }

  /**
   * Actualiza el índice de la pestaña seleccionada en el store.
   *
   * @param i Índice de la pestaña seleccionada.
   * @returns {void}
   */
  public seleccionaTab(i: number): void {
    this.tramite240117Store.updateTabSeleccionado(i);
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
