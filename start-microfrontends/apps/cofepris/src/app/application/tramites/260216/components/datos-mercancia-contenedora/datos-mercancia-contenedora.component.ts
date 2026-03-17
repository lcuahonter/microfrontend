/**
 * Componente utilizado en el trámite 260216 para gestionar y actualizar la información de una mercancía seleccionada.
 *
 * Este archivo contiene la definición del componente `DatosMercanciaContenedoraComponent`, que permite observar el estado
 * del trámite y actualizar los datos de mercancías en la tabla principal.
 */

import { Component, OnInit } from '@angular/core';
import { Tramite260216State, Tramite260216Store } from '../../estados/tramite260216Store.store';
import { map,takeUntil} from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { Subject } from 'rxjs';
import { TablaMercanciasDatos } from '../../../../shared/models/datos-solicitud.model';
import { Tramite260216Query } from '../../estados/tramite260216Query.query';

/**
 * @component
 * @name DatosMercanciaContenedoraComponent
 * @description
 * Componente de Angular que gestiona y actualiza la información de una mercancía seleccionada.
 * Permite observar el estado del trámite y actualizar los datos de mercancías en la tabla principal.
 *
 * @selector app-datos-mercancia-contenedora
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./datos-mercancia-contenedora.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./datos-mercancia-contenedora.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - DatosMercanciaComponent: Componente compartido para gestionar la información de las mercancías.
 */
@Component({
  selector: 'app-datos-mercancia-contenedora',
  standalone: true,
  imports: [CommonModule, DatosMercanciaComponent],
  templateUrl: './datos-mercancia-contenedora.component.html',
  styleUrl: './datos-mercancia-contenedora.component.scss',
})
export class DatosMercanciaContenedoraComponent implements OnInit {
  /**
   * @property {TablaMercanciasDatos} SeleccionadoDatos
   * Contiene los datos de la mercancía actualmente seleccionada en la tabla.
   */
  public SeleccionadoDatos!: TablaMercanciasDatos;

  /**
   * @property {Subject<void>} destroyNotifier$
   * Subject utilizado para limpiar las suscripciones activas al destruir el componente.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Tramite260216State} tramiteState
   * Estado completo del trámite, que contiene información como la tabla de mercancías.
   */
  public tramiteState!: Tramite260216State;

  /**
   * @constructor
   * @description
   * Constructor que inyecta los servicios necesarios para consultar y modificar el estado del trámite.
   *
   * @param {Tramite260216Query} tramite260216Query - Servicio para observar el estado actual del trámite.
   * @param {Tramite260216Store} tramite260216Store - Store que permite actualizar el estado del trámite.
   */
  constructor(
    private tramite260216Query: Tramite260216Query,
    private tramite260216Store: Tramite260216Store
  ) {}

  /**
   * @method ngOnInit
   * @description
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Se suscribe al estado del trámite y guarda su valor localmente para uso posterior.
   */
  ngOnInit(): void {
    this.tramite260216Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * @method mercanciaSeleccionado
   * @description
   * Maneja la selección de una mercancía en la tabla de datos.
   * Actualiza el estado del store con los datos seleccionados o modificados.
   *
   * @param {TablaMercanciasDatos} event - Objeto de tipo `TablaMercanciasDatos` que representa la mercancía seleccionada.
   *
   * @example
   * ```typescript
   * const nuevaMercancia: TablaMercanciasDatos = { clasificacionProducto: '123', cantidadUMC: 10, ... };
   * this.mercanciaSeleccionado(nuevaMercancia);
   * ```
   */
  mercanciaSeleccionado(event: TablaMercanciasDatos): void {
    this.SeleccionadoDatos = event;

    const SELECCIONADO_MERCANCIA = {
      clasificacionProducto: event.clasificacionProducto,
      especificarClasificacionProducto: event.especificarClasificacionProducto,
      denominacionEspecificaProducto: event.denominacionEspecificaProducto,
      denominacionDistintiva: event.denominacionComun,
      denominacionComun: event.denominacionComun,
      formaFarmaceutica: event.formaFarmaceutica,
      estadoFisico: event.estadoFisico,
      fraccionArancelaria: event.fraccionArancelaria,
      descripcionFraccion: event.descripcionFraccion,
      unidadMedidaComercializacion: event.unidadMedidaComercializacion,
      cantidadUMC: event.cantidadUMC,
      unidadMedidaTarifa: event.unidadMedidaTarifa,
      cantidadUMT: event.cantidadUMT,
      presentacion: event.presentacion,
      numeroRegistroSanitario: event.numeroRegistroSanitario,
      paisOrigen: event.paisOrigen,
      paisProcedencia: event.paisProcedencia,
      tipoProducto: event.tipoProducto,
      usoEspecifico: event.usoEspecifico,
    };

    const INDICES = this.tramiteState.tablaMercanciasConfigDatos.findIndex(
      (idx) =>
        idx.clasificacionProducto ===
        SELECCIONADO_MERCANCIA.clasificacionProducto.toString()
    );

    let datosActivos = [];

    if (INDICES !== -1) {
      const TABLE_MERCANCIA_DATA = this.tramiteState.tablaMercanciasConfigDatos;
      TABLE_MERCANCIA_DATA.splice(INDICES, 1, SELECCIONADO_MERCANCIA);
      datosActivos = TABLE_MERCANCIA_DATA;
    } else {
      datosActivos = [
        ...this.tramiteState.tablaMercanciasConfigDatos,
        SELECCIONADO_MERCANCIA,
      ];
    }

    this.tramite260216Store.update((state) => ({
      ...state,
      seleccionadoTablaMercanciasDatos: [SELECCIONADO_MERCANCIA],
      tablaMercanciasConfigDatos: datosActivos,
    }));
  }
}