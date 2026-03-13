import { Component, OnInit } from '@angular/core';

import {
  Tramite260101State,
  Tramite260101Store,
} from '../../estados/tramite260101Store.store';
import { map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { ID_PROCEDIMIENTO } from '../../constants/medicos-uso.enum';
import { Subject } from 'rxjs';
import { TablaMercanciasDatos } from '../../../../shared/models/datos-solicitud.model';
import { Tramite260101Query } from '../../estados/tramite260101Query.query';

/**
 * @component DatosMercanciaContenedoraComponent
 * @description Componente encargado de gestionar y actualizar la información de una mercancía seleccionada.
 * Observa el estado del trámite y permite al usuario seleccionar y modificar datos de mercancías
 * en la tabla principal.
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
   * @property {Tramite260101State} tramiteState
   * Estado completo del trámite, que contiene información como la tabla de mercancías.
   */
  public tramiteState!: Tramite260101State;

  /**
   * Identificador del procedimiento actual.
   *
   * Se inicializa con la constante `ID_PROCEDIMIENTO` y se utiliza
   * para controlar la lógica del componente en función del
   * procedimiento en ejecución.
   */
  idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * @constructor
   * Inyecta los servicios necesarios para consultar y modificar el estado del trámite.
   *
   * @param tramite260101Query - Servicio para observar el estado actual del trámite.
   * @param tramite260101Store - Store que permite actualizar el estado del trámite.
   */
  constructor(
    private tramite260101Query: Tramite260101Query,
    private tramite260101Store: Tramite260101Store
  ) {}

  /**
   * @method ngOnInit
   * @description Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Se suscribe al estado del trámite y guarda su valor localmente para uso posterior.
   */
  ngOnInit(): void {
    this.tramite260101Query.selectTramiteState$
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
   * @description Maneja la selección de una mercancía en la tabla de datos.
   *
   * Este método:
   * - Asigna el objeto seleccionado a `SeleccionadoDatos`.
   * - Crea una versión simplificada de la mercancía.
   * - Verifica si ya existe en la tabla.
   * - La reemplaza o la agrega según sea el caso.
   * - Finalmente, actualiza el estado del store.
   *
   * @param {TablaMercanciasDatos} event - Objeto de tipo `TablaMercanciasDatos` que representa la mercancía seleccionada.
   */
  mercanciaSeleccionado(event: TablaMercanciasDatos): void {
    this.SeleccionadoDatos = event;

    const SELECCIONADO_MERCANCIA = {
  clasificacionProducto: event.clasificacionProducto,
  especificarClasificacionProducto: event.especificarClasificacionProducto,
  denominacionEspecificaProducto: event.denominacionEspecificaProducto,
  denominacionDistintiva: event.denominacionDistintiva,
  denominacionComun: event.denominacionComun,
  tipoProducto: event.tipoProducto,
  estadoFisico: event.estadoFisico,
  fraccionArancelaria: event.fraccionArancelaria,
  descripcionFraccion: event.descripcionFraccion,
  cantidadUmtValor: event.cantidadUMT,
  cantidadUmt: event.cantidadUMT,
  cantidadUmcValor: event.cantidadUMC,
  cantidadUmc: event.cantidadUMC,
  unidadMedidaComercializacion: event.unidadMedidaComercializacion,
  cantidadUMC: event.cantidadUMC,
  unidadMedidaTarifa: event.unidadMedidaTarifa,
  cantidadUMT: event.cantidadUMT,
  presentacion: event.presentacion,
  paisDeOriginDatos: event.paisDeOriginDatos,
  paisDeProcedenciaDatos: event.paisDeProcedenciaDatos,
  paisOrigen: event.paisOrigen,
  paisProcedencia: event.paisProcedencia,
  usoEspecifico: event.usoEspecifico,
  formaFarmaceutica: event.formaFarmaceutica,
  numeroRegistroSanitario: event.numeroRegistroSanitario,
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

    this.tramite260101Store.update((state) => ({
      ...state,
      seleccionadoTablaMercanciasDatos: [SELECCIONADO_MERCANCIA],
      tablaMercanciasConfigDatos: datosActivos,
    }));
  }
}
