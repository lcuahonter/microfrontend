import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  Destinatario,
  Fabricante,
  Facturador,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { ELEMENTOS_REQUERIDOS, ID_PROCEDIMIENTO } from '../../constantes/modificacion-permiso.enum';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TercerosRelacionadosModificacionComponent } from '../../../../shared/components/shared2609/terceros-relacionados-modificacion/terceros-relacionados.component';
import { Tramite260902Query } from '../../estados/tramite260902Query.query';
import { Tramite260902Store } from '../../estados/tramite260902Store.store';


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
  imports: [CommonModule, TercerosRelacionadosModificacionComponent],
  templateUrl: './terceros-relacionados-vista.component.html',
  styleUrl: './terceros-relacionados-vista.component.css',
})
export class TercerosRelacionadosVistaComponent implements OnInit, OnDestroy, OnChanges {
    /**
   * Tipo de trámite actual, recibido del padre.
   */
  @Input() tipoTramite: string = '';
/**
   * Estados de habilitación de las tablas.
   */
  tablasDeshabilitadas: boolean = true;

  /**
   * Estado de los botones de acción (ejemplo: para prórroga)
   */
  botonDesactivarParaProrrogar: boolean = false;

  mostrarBotonesAccion: boolean = false;


   /**
   * @property {boolean} formularioDeshabilitado
   * @description
   * Indica si el formulario está deshabilitado. Por defecto es `false`.
   */
  @Input()
  formularioDeshabilitado: boolean = false;
    /**
   * @property {string[]} elementosRequeridos
   * @description
   * Lista de elementos requeridos para completar el formulario o proceso.
   */
  public readonly elementosRequeridos = ELEMENTOS_REQUERIDOS; 
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
   * @property {TercerosRelacionadosComponent} TercerosRelacionadosComponent
   * @description Referencia al componente hijo `TercerosRelacionadosComponent`
   * que se utiliza para mostrar las tablas de terceros relacionados.
   */
  @ViewChild('TercerosRelacionadosComponent')
  TercerosRelacionadosComponent!: TercerosRelacionadosModificacionComponent;
       /**
   * @property {boolean} estaOculto
   * @description
   * Variable booleana que controla si el componente debe estar oculto o no.
   */
  estaOculto: boolean = true;
      /**
     * @property {string} idProcedimiento
     * @description Identificador del procedimiento, utilizado para la gestión del trámite.
     */
     public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * @constructor
   * Inyecta los servicios necesarios para consultar y actualizar el estado del trámite.
   *
   * @param tramiteStore - Store que gestiona el estado de los datos del trámite.
   * @param tramiteQuery - Servicio de consulta que expone observables para leer los datos del store.
   */
  constructor(
    private tramiteStore: Tramite260902Store,
    private tramiteQuery: Tramite260902Query,
    private consultaQuery: ConsultaioQuery  
  ) {
    this.consultaQuery.selectConsultaioState$
        .pipe(takeUntil(this.destroy$))
        .subscribe((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        });
  }

    ngOnChanges(changes: SimpleChanges): void {
    this.estaOculto = false;
    if ((this.tipoTramite === '1' || this.tipoTramite === '2') && this.idProcedimiento === 260902) {
      this.tablasDeshabilitadas = false;
      this.botonDesactivarParaProrrogar = true;
      this.mostrarBotonesAccion = true;
    } else {
      this.tablasDeshabilitadas = true;
      this.botonDesactivarParaProrrogar = false;
      this.mostrarBotonesAccion = false;
    }
  }

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
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Se utiliza para limpiar las suscripciones activas y evitar fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
    /**
   * @description
   * Método que se encarga de validar el formulario contenido en
   * el componente `TercerosRelacionadosComponent`.
   *
   * Utiliza el método `formularioSolicitudValidacion()` del componente hijo
   * para comprobar si el formulario es válido.
   * En caso de que el hijo no esté inicializado o devuelva `null/undefined`,
   * se retorna `false` por defecto.
   *
   * @returns {boolean}
   * - `true`: si el formulario es válido.
   * - `false`: si el formulario no es válido o el componente hijo aún no está disponible.
   */
  validarContenedor(): boolean {
    return (
      this.TercerosRelacionadosComponent?.formularioSolicitudValidacion() ?? false
    );
  }
}
