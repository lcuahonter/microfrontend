import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  SolicitanteComponent
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteContenedoraComponent } from '../../components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { ImportacionArmamentoFisicasMoralesService } from '../../services/importacion-armamento-fisicas-morales.service';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { TercerosRelacionadosContenedoraComponent } from '../../components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';
import { Tramite240102Query } from '../../estados/tramite240102Query.query';
import { Tramite240102Store } from '../../estados/tramite240102Store.store';

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
  imports: [CommonModule, SolicitanteComponent, DatosDelTramiteContenedoraComponent, PagoDeDerechosContenedoraComponent, TercerosRelacionadosContenedoraComponent],
})
export class PasoUnoComponent implements OnDestroy, OnInit {
  /**
   * @property indice
   * @description Indica el índice de la pestaña seleccionada dentro del paso del formulario.
   * @type {number | undefined}
   */
  public indice: number | undefined = 1;

  /**
   * @property destroyNotifier$
   * @description Notificador observable que permite cancelar las suscripciones activas cuando se destruye el componente.
   * Ayuda a prevenir fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Constructor del componente.
   * @param tramite240102Query - Query de Akita para obtener los datos del trámite 240102.
   * @param tramite240102Store - Store de Akita que gestiona el estado del trámite 240102.
   * @param consultaQuery - Query para consultar información adicional.
   * @param importacionArmamentoService - Servicio para la importación de armamento de personas físicas y morales.
   */
  constructor(
    private tramite240102Query: Tramite240102Query,
    private tramite240102Store: Tramite240102Store,
    private consultaQuery: ConsultaioQuery,
    private importacionArmamentoService: ImportacionArmamentoFisicasMoralesService
  ) {
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al valor del tab seleccionado desde el estado y actualiza `indice`.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite240102Query.getTabSeleccionado$
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
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();

  }

  /**
 * Guarda los datos del formulario obtenidos del servicio.
 */
  guardarDatosFormulario(): void {
    this.importacionArmamentoService
      .obtenerRegistroTomarMuestrasDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.importacionArmamentoService.actualizarEstadoFormulario(resp);
        }
      });
  }
  /**
   * Actualiza el índice de la pestaña seleccionada en el store.
   *
   * @param i Índice de la pestaña seleccionada.
   * @returns {void}
   */
  public seleccionaTab(i: number): void {
    this.tramite240102Store.updateTabSeleccionado(i);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta justo antes de destruir el componente.
   * Emite y completa el observable `destroyNotifier$` para cancelar las suscripciones.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
