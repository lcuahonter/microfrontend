import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  Destinatario,
  Fabricante,
  Facturador,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TIPO_ACTUALIZACION } from '../../../../shared/constantes/datos-solicitud.enum';
import { TercerosRelacionadosComponent } from '../../../../shared/components/shared26010/terceros-relacionados/terceros-relacionados.component';
import { Tramite260102Query } from '../../estados/queries/tramite260102Query.query';
import { Tramite260102Store } from '../../estados/stores/tramite260102Store.store';
/**
 * @component TercerosRelacionadosVistaComponent
 * @description Componente de solo lectura que muestra las tablas de terceros relacionados
 * (fabricantes, destinatarios finales, proveedores y facturadores).
 * Consume observables del store para renderizar los datos en la vista mediante el componente
 * `TercerosRelacionadosComponent`.
 */
@Component({
  selector: 'app-terceros-relacionados-vista',
  standalone: true,
  imports: [CommonModule, TercerosRelacionadosComponent],
  templateUrl: './terceros-relacionados-vista.component.html',
  styleUrl: './terceros-relacionados-vista.component.scss',
})
export class TercerosRelacionadosVistaComponent implements OnInit, OnDestroy {
  /**
   * @property {Fabricante[]} fabricanteTablaDatos
   * Datos de la tabla de fabricantes.
   */
  fabricanteTablaDatos: Fabricante[] = [];

  /**
   * @property {Destinatario[]} destinatarioFinalTablaDatos
   * Datos de la tabla de destinatarios finales.
   */
  destinatarioFinalTablaDatos: Destinatario[] = [];

  /**
   * @property {Proveedor[]} proveedorTablaDatos
   * Datos de la tabla de proveedores.
   */
  proveedorTablaDatos: Proveedor[] = [];

  /**
   * @property {Facturador[]} facturadorTablaDatos
   * Datos de la tabla de facturadores.
   */
  facturadorTablaDatos: Facturador[] = [];

  /**
   * @property {Subject<void>} destroy$
   * Subject para cancelar suscripciones y evitar fugas de memoria.
   * @private
   */
  private destroy$ = new Subject<void>();

   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false; 
  /**
* @property idProcedimiento
* @description Identificador numérico del trámite o procedimiento en curso.
* @type {number}
* @readonly
*/
  public readonly idProcedimiento: number = 260102;

  @ViewChild(TercerosRelacionadosComponent)
  tercerosRelacionadosComponent!: TercerosRelacionadosComponent;
  /**
   * @constructor
   * Inyecta los servicios necesarios para consultar y actualizar el estado del trámite.
   *
   * @param tramiteStore - Store que gestiona el estado de los datos del trámite.
   * @param tramiteQuery - Servicio de consulta que expone observables para leer los datos del store.
   * @param consultaQuery - Servicio de consulta para obtener datos adicionales relacionados con el trámite.
   */
  constructor(
    private tramiteStore: Tramite260102Store,
    private tramiteQuery: Tramite260102Query,
    private consultaQuery: ConsultaioQuery
  ) { }

  /**
   * @method ngOnInit
   * @description Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe los observables para mostrar los datos en la vista.
   */
  ngOnInit(): void {
    this.tramiteQuery.getFabricanteTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.fabricanteTablaDatos = data;
      });

    this.tramiteQuery.getDestinatarioFinalTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.destinatarioFinalTablaDatos = data;
      });

    this.tramiteQuery.getProveedorTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.proveedorTablaDatos = data;
      });

    this.tramiteQuery.getFacturadorTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.facturadorTablaDatos = data;
      });

    this.consultaQuery.selectConsultaioState$
          .pipe(
            takeUntil(this.destroy$),
            map((seccionState) => {
              this.esFormularioSoloLectura = seccionState.readonly;
            })
          )
          .subscribe();
  }

  /**
   * @method addFabricantes
   * @description Agrega nuevos fabricantes a la tabla de datos del trámite.
   *
   * @param newFabricantes - Lista de objetos `Fabricante` a agregar.
   */
  addFabricantes(newFabricantes: Fabricante[]): void {
    this.tramiteStore.updateFabricanteTablaDatos(newFabricantes);
  }

  /**
   * @method addDestinatarios
   * @description Agrega nuevos destinatarios a la tabla de datos del destinatario final.
   *
   * @param newDestinatarios - Lista de objetos `Destinatario` a agregar.
   */
  addDestinatarios(newDestinatarios: Destinatario[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(newDestinatarios);
  }

  /**
   * @method addProveedores
   * @description Agrega nuevos proveedores a la tabla de datos del trámite.
   *
   * @param newProveedores - Lista de objetos `Proveedor` a agregar.
   */
  addProveedores(newProveedores: Proveedor[]): void {
    this.tramiteStore.updateProveedorTablaDatos(newProveedores);
  }

  /**
   * @method addFacturadores
   * @description Agrega nuevos facturadores a la tabla de datos del trámite.
   *
   * @param newFacturadores - Lista de objetos `Facturador` a agregar.
   */
  addFacturadores(newFacturadores: Facturador[]): void {
    this.tramiteStore.updateFacturadorTablaDatos(newFacturadores);
  }
    /**
     * @method fabricanteEventoModificar
     * @description Método manejador de eventos que se ejecuta cuando se seleccionan
     * fabricantes para modificación. Actualiza el store con la selección actual
     * para permitir operaciones de edición sobre los registros seleccionados.
     * 
     * @param {Fabricante[]} seleccionadaFabricante - Arreglo de objetos Fabricante
     *   que han sido seleccionados por el usuario para modificación
     * @returns {void}
     * @access public
     * @since 1.0.0
     */
    fabricanteEventoModificar(seleccionadaFabricante: Fabricante[]): void {
      this.tramiteStore.updateSeleccionadoTablaFabricanteDatos(seleccionadaFabricante);
    }
  
    /**
     * @method destinatarioEventoModificar
     * @description Método manejador de eventos que procesa la selección de destinatarios
     * finales para modificación. Sincroniza la selección con el store para habilitar
     * las operaciones de edición correspondientes.
     * 
     * @param {Destinatario[]} seleccionadaDestinatario - Arreglo de objetos Destinatario
     *   seleccionados por el usuario para ser modificados
     * @returns {void}
     * @access public
     * @since 1.0.0
     */
    destinatarioEventoModificar(seleccionadaDestinatario: Destinatario[]): void {
      this.tramiteStore.updateSeleccionadoTablaDestinatarioDatos(
        seleccionadaDestinatario,
      );
    }
  
    /**
     * @method proveedorEventoModificar
     * @description Método manejador de eventos que gestiona la selección de proveedores
     * para modificación. Actualiza el estado del store con los proveedores seleccionados
     * para facilitar las operaciones de edición subsecuentes.
     * 
     * @param {Proveedor[]} seleccionadaProveedor - Arreglo de objetos Proveedor
     *   que el usuario ha seleccionado para modificar
     * @returns {void}
     * @access public
     * @since 1.0.0
     */
    proveedorEventoModificar(seleccionadaProveedor: Proveedor[]): void {
      this.tramiteStore.updateSeleccionadoTablaProveedorDatos(seleccionadaProveedor);
    }
  
    /**
     * @method facturadorEventoModificar
     * @description Método manejador de eventos que procesa la selección de facturadores
     * para modificación. Interactúa con el store para mantener actualizada la lista
     * de facturadores seleccionados y habilitar su edición.
     * 
     * @param {Facturador[]} seleccionadaFacturador - Arreglo de objetos Facturador
     *   seleccionados por el usuario para operaciones de modificación
     * @returns {void}
     * @access public
     * @since 1.0.0
     */
    facturadorEventoModificar(seleccionadaFacturador: Facturador[]): void {
      this.tramiteStore.updateSeleccionadoTablaFacturadorDatos(seleccionadaFacturador);
    }
  
    /**
     * @method eliminarFabricante
     * @description Método público que elimina fabricantes específicos de la tabla de datos.
     * Recibe la lista actualizada después de la eliminación y actualiza el store
     * utilizando el tipo de actualización ELIMINAR para mantener la integridad de los datos.
     * 
     * @param {Fabricante[]} fabricante - Arreglo actualizado de fabricantes después
     *   de realizar la operación de eliminación
     * @returns {void}
     * @access public
     * @since 1.0.0
     */
    eliminarFabricante(fabricante: Fabricante[]): void {
      this.tramiteStore.updateFabricanteTablaDatos(fabricante, TIPO_ACTUALIZACION.ELIMINAR);
    }
  
    /**
     * @method eliminarDestinatario
     * @description Método público que procesa la eliminación de destinatarios finales.
     * Actualiza el store con la lista resultante después de la eliminación,
     * especificando el tipo de operación para el manejo correcto del estado.
     * 
     * @param {Destinatario[]} destinatario - Arreglo de destinatarios actualizado
     *   post-eliminación que se sincronizará con el store
     * @returns {void}
     * @access public
     * @since 1.0.0
     */
    eliminarDestinatario(destinatario: Destinatario[]): void {
      this.tramiteStore.updateDestinatarioFinalTablaDatos(destinatario, TIPO_ACTUALIZACION.ELIMINAR);
    }
  
    /**
     * @method eliminarProveedor
     * @description Método público que gestiona la eliminación de proveedores del trámite.
     * Recibe la lista de proveedores actualizada y la sincroniza con el store
     * usando el tipo de actualización apropiado para operaciones de eliminación.
     * 
     * @param {Proveedor[]} proveedor - Arreglo de proveedores resultante después
     *   de la operación de eliminación
     * @returns {void}
     * @access public
     * @since 1.0.0
     */
    eliminarProveedor(proveedor: Proveedor[]): void {
      this.tramiteStore.updateProveedorTablaDatos(proveedor, TIPO_ACTUALIZACION.ELIMINAR);
    }
  
    /**
     * @method eliminarFacturador
     * @description Método público que maneja la eliminación de facturadores del sistema.
     * Actualiza el estado del store con la lista de facturadores resultante,
     * especificando el tipo de operación ELIMINAR para el procesamiento correcto.
     * 
     * @param {Facturador[]} facturador - Arreglo de facturadores actualizado
     *   después de realizar la eliminación correspondiente
     * @returns {void}
     * @access public
     * @since 1.0.0
     */
    eliminarFacturador(facturador: Facturador[]): void {
      this.tramiteStore.updateFacturadorTablaDatos(facturador, TIPO_ACTUALIZACION.ELIMINAR);
    }

    validarContenedor(): boolean {
    return (
      this.tercerosRelacionadosComponent?.formularioSolicitudValidacion() ??
      false
    );
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   * Aquí se emiten señales para completar y limpiar cualquier suscripción o recurso que el componente
   * haya estado utilizando, evitando posibles fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
