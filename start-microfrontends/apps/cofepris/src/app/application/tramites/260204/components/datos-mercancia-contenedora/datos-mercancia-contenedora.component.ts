import { Component, OnInit } from '@angular/core';
import {
  Tramite260204State,
  Tramite260204Store,
} from '../../estados/stores/tramite260204Store.store';
import { map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { Subject } from 'rxjs';
import { TablaMercanciasDatos } from '../../../../shared/models/datos-solicitud.model';
import { Tramite260204Query } from '../../estados/queries/tramite260204Query.query';


/**
 * @component DatosMercanciaContenedoraComponent
 * @description Componente Angular que representa la sección de datos de mercancías contenedoras 
 * dentro de un trámite específico. Este componente es autónomo y utiliza otros módulos y componentes 
 * como `CommonModule` y `DatosMercanciaComponent` para su funcionalidad.
 *
 * @selector app-datos-mercancia-contenedora
 * Selector utilizado para instanciar este componente en una plantilla HTML.
 *
 * @standalone true
 * Indica que este componente es autónomo y no depende de un módulo específico.
 *
 * @imports
 * - `CommonModule`: Proporciona funcionalidades comunes de Angular como directivas estructurales.
 * - `DatosMercanciaComponent`: Componente utilizado para manejar los datos de mercancías.
 *
 * @templateUrl './datos-mercancia-contenedora.component.html'
 * Ruta del archivo HTML que define la estructura visual del componente.
 *
 * @styleUrl './datos-mercancia-contenedora.component.scss'
 * Ruta del archivo SCSS que contiene los estilos específicos para este componente.
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
   * @property {Tramite260204State} tramiteState
   * Estado completo del trámite, que contiene información como la tabla de mercancías.
   */
  public tramiteState!: Tramite260204State;

  /**
   * @constructor
   * Inyecta los servicios necesarios para consultar y modificar el estado del trámite.
   *
   * @param tramite260204Query - Servicio para observar el estado actual del trámite.
   * @param tramite260204Store - Store que permite actualizar el estado del trámite.
   */
  constructor(
    private tramite260204Query: Tramite260204Query,
    private tramite260204Store: Tramite260204Store
  ) {}

  /**
   * @method ngOnInit
   * @description Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Se suscribe al estado del trámite y guarda su valor localmente para uso posterior.
   */
  ngOnInit(): void {
    this.tramite260204Query.selectTramiteState$
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
      cantidadUmtValor: event.cantidadUmtValor
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

    this.tramite260204Store.update((state) => ({
      ...state,
      seleccionadoTablaMercanciasDatos: [SELECCIONADO_MERCANCIA],
      tablaMercanciasConfigDatos: datosActivos,
    }));
  }
}
