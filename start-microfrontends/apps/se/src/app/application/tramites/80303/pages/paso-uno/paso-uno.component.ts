import { Component } from '@angular/core';

import { ConsultaioQuery, SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { ConsultaioState } from '@libs/shared/data-access-user/src';
import { ModificacionProgramaImmexBajaSubmanufactureraService } from '../../services/modificacion-programa-immex-baja-submanufacturera.service';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Tramite80303Query } from '../../estados/tramite80303Query.query';

import { Tramite80303State, Tramite80303Store } from '../../estados/tramite80303Store.store';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

import { MontoYFactorComponent } from '../../components/monto-y-factor/monto-y-factor.component';

import { AnexoUnoPestanaComponent } from '../../components/anexo-uno-pestana/anexo-uno-pestana.component';
import { ComplementarioComponent } from '../../components/complementaria/complementaria.component';

import { BitacoraComponent } from '../../components/bitacora/bitacora.component';
import { ModificacionComponent } from '../../components/modificacion/modificacion.component';

import { CommonModule } from '@angular/common';

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
  imports: [
    CommonModule,
    SolicitanteComponent,
    ModificacionComponent,
    BitacoraComponent,
    ComplementarioComponent,
    AnexoUnoPestanaComponent,
    MontoYFactorComponent,
  ],
 
})
export class PasoUnoComponent implements OnDestroy, OnInit {
  /**
   * @description Constructor del componente.
   * Inicializa el componente y establece el índice de la pestaña seleccionada.
   */
  formularioDeshabilitado: boolean = false;
  /**
   * @property indice
   * @description Indica el índice de la pestaña seleccionada dentro del paso del formulario.
   * @type {number | undefined}
   */
  public indice: number | undefined = 1;

  /**
   * @property subIndice
   * @description subIndica el índice de la pestaña seleccionada dentro del paso del formulario.
   * @type {number | undefined}
   */
  public subIndice: number | undefined = 1;
  /**
   * @property {ConsultaioState} consultaState - Estado actual relacionado con la consulta.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  /**
   * @property destroyNotifier$
   * @description Notificador observable que permite cancelar las suscripciones activas cuando se destruye el componente.
   * Ayuda a prevenir fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Inicializa el componente con la consulta y el store necesarios para el manejo del estado.
   *
   * @param tramite240101Query Consulta para acceder al estado del trámite.
   * @param tramite240101Store Store que permite actualizar el estado del trámite.
   */
  constructor(
    private tramite80303Query: Tramite80303Query,
    private tramite80303Store: Tramite80303Store,
      private store: Tramite80303Store,

    private consultaQuery: ConsultaioQuery,
    public modificacionProgramaImmexBajaSubmanufactureraService: ModificacionProgramaImmexBajaSubmanufactureraService
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al valor del tab seleccionado desde el estado y actualiza `indice`.
   *
   * @returns {void}
   */
   ngOnInit(): void {    
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;

          if (this.consultaState.update) {
            this.guardarDatosFormulario(this.consultaState?.id_solicitud);
            this.tramite80303Store.setIdSolicitud(Number(this.consultaState?.id_solicitud));
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
    
  }

  
/**
   * @method seleccionaTab
   * @description Cambia el índice de la pestaña seleccionada.
   * Se utiliza para cambiar de paso en el formulario multipaso.
   * @param {number} i - Índice de la pestaña que se desea seleccionar.
   * @returns {void}
   */
  public seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Actualiza el índice de la pestaña seleccionada en el store.
   *
   * @param i Índice de la pestaña seleccionada.
   * @returns {void}
   */
  public seleccionaSubTab(i: number): void {
    this.subIndice = i;
  }
  
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.More actions
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(id_solicitud: string): void {
    this.modificacionProgramaImmexBajaSubmanufactureraService
      .getMostrarSolicitud(id_solicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp?.datos) {
          const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
          if (DATOS) {
            const MAPPED_DATA = this.modificacionProgramaImmexBajaSubmanufactureraService.reverseBuildSolicitud80303(DATOS as Record<string, unknown>);
            this.modificacionProgramaImmexBajaSubmanufactureraService.actualizarEstadoFormulario(MAPPED_DATA as unknown as Tramite80303State);
          }
          this.esDatosRespuesta = true;
        }
      });
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
