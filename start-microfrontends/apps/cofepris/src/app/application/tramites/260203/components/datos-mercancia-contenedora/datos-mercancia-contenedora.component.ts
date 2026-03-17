import { Component, OnInit } from '@angular/core';
import { Observable, map, takeUntil } from 'rxjs';
import {
  Tramite260203State,
  Tramite260203Store,
} from '../../estados/stores/tramite260203Store.store';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { DetalleMercancia } from '../../../../shared/models/detalle-mercancia.model';
import { Subject } from 'rxjs';
import { TablaMercanciasDatos } from '../../../../shared/models/datos-solicitud.model';
import { Tramite260203Query } from '../../estados/queries/tramite260203Query.query';

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
   * @property {Tramite260203State} tramiteState
   * Estado completo del trámite, que contiene información como la tabla de mercancías.
   */
  public tramiteState!: Tramite260203State;

  /**
   * Observable que emite una lista de objetos de tipo `DetalleMercancia`.
   * 
   * Este flujo de datos se utiliza para gestionar y observar los detalles 
   * de las mercancías contenidas en el componente. Los objetos de tipo 
   * `DetalleMercancia` representan información específica sobre cada 
   * mercancía, como su descripción, cantidad, y otros atributos relevantes.
   * 
   * @type {Observable<DetalleMercancia[]>}
   */
  detalleMercancia$!: Observable<DetalleMercancia[]>;

  /**
   * @constructor
   * Inyecta los servicios necesarios para consultar y modificar el estado del trámite.
   *
   * @param tramite260203Query - Servicio para observar el estado actual del trámite.
   * @param tramite260203Store - Store que permite actualizar el estado del trámite.
   */
  constructor(
    private tramite260203Query: Tramite260203Query,
    private tramite260203Store: Tramite260203Store
  ) {}

  /**
   * @method ngOnInit
   * @description Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Se suscribe al estado del trámite y guarda su valor localmente para uso posterior.
   */
  ngOnInit(): void {
    this.tramite260203Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState: Tramite260203State) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
    //this.detalleMercancia$ = this.tramite260203Query.getDetalleMercancia$;
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

    this.tramite260203Store.update((state) => ({
      ...state,
      seleccionadoTablaMercanciasDatos: [SELECCIONADO_MERCANCIA],
      tablaMercanciasConfigDatos: datosActivos,
    }));
  }

  /**
   * Agrega un nuevo detalle de mercancía al estado del trámite.
   * @param {DetalleMercancia} datos - Detalle de la mercancía a agregar
   */
  aggregarMercancia(datos: DetalleMercancia): void {
   // this.tramite260203Store.aggregarDetalleMercancia(datos);
  }

  /**
   * Elimina los detalles de mercancía del estado del trámite.
   * @param {DetalleMercancia[]} datos - Detalles de mercancía a eliminar
   */
  eliminarMercancia(datos: DetalleMercancia[]): void {
    //this.tramite260203Store.eliminarDetalleMercancia(datos);
  }
}
