import { Component, OnDestroy,OnInit } from '@angular/core';
import {
  Destinatario,
  Fabricante,
  Facturador,
  Proveedor,
  TercerosRelacionadosDatos,
} from '../../../../shared/models/terceros-relacionados.model';
import { Observable, Subject,takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ELEMENTOS_REQUERIDOS } from '../../constants/remedios-herbolarios.enum';
import { ID_PROCEDIMIENTO } from '../../constants/remedios-herbolarios.enum';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite260219Query } from '../../estados/tramite260219Query.query';
import { Tramite260219Store } from '../../estados/tramite260219Store.store';

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
    * indica si el formulario está en modo solo lectura.
    * Cuando es `true`, el formulario no permite modificaciones por parte del usuario.
    *
    * @type { boolean}
    */
  esFormularioSoloLectura: boolean = false;

  /**
   * Observable de datos de terceros relacionados.
   * @type {Observable<TercerosRelacionadosDatos>}
   */
  public tercerosDatos$!: Observable<TercerosRelacionadosDatos>;

  /**
   * Identificador único del procedimiento.
   * Esta propiedad es de solo lectura y se inicializa con el valor constante `ID_PROCEDIMIENTO`.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * @property {string[]} elementosRequeridos
   * @description
   * Lista de elementos requeridos para completar el formulario o proceso.
   */
    public readonly elementosRequeridos = ELEMENTOS_REQUERIDOS;

  /**
   * @constructor
   * Inyecta los servicios necesarios para consultar y actualizar el estado del trámite.
   *
   * @param tramiteStore - Store que gestiona el estado de los datos del trámite.
   * @param tramiteQuery - Servicio de consulta que expone observables para leer los datos del store.
   */
  constructor(
    private tramiteStore: Tramite260219Store,
    private tramiteQuery: Tramite260219Query,
    private consultaQuery: ConsultaioQuery
  ) {
    this.consultaQuery.selectConsultaioState$
    .pipe(takeUntil(this.destroy$))
    .subscribe((seccionState) => {
      this.esFormularioSoloLectura = seccionState.readonly;
    });
  }

  /**
   * @method ngOnInit
   * @description Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe los observables para mostrar los datos en la vista.
   */
  ngOnInit(): void {
    this.tercerosDatos$ = this.tramiteQuery.getTercerosDatos$;
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
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
