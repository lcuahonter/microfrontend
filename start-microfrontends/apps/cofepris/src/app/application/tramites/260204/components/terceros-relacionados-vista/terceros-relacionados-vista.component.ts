import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  Destinatario,
  Fabricante,
  Facturador,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ELEMENTOS_REQUERIDOS } from '../../constantes/permiso-sanitario-importacion-medicamentos.enum';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite260204Query } from '../../estados/queries/tramite260204Query.query';
import { Tramite260204Store } from '../../estados/stores/tramite260204Store.store';

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
  styleUrl: './terceros-relacionados-vista.component.css',
})
export class TercerosRelacionadosVistaComponent implements OnInit, OnDestroy {
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
   * @property {TercerosRelacionadosComponent} TercerosRelacionadosComponent
   * @description Referencia al componente hijo `TercerosRelacionadosComponent`
   * que se utiliza para mostrar las tablas de terceros relacionados.
   */
  @ViewChild(TercerosRelacionadosComponent) TercerosRelacionadosComponent!: TercerosRelacionadosComponent;
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
   * Indica si el componente debe estar en modo solo lectura.
   * Cuando es `true`, los elementos del componente no serán editables.
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor de la clase `TercerosRelacionadosVistaComponent`.
   * 
   * Este constructor inicializa las dependencias necesarias para el componente.
   * 
   * @param tramiteStore - Servicio de almacenamiento relacionado con el trámite 260204.
   * @param tramiteQuery - Servicio de consulta relacionado con el trámite 260204.
   * @param consultaQuery - Servicio de consulta general utilizado en el componente.
   */
   constructor(
     private tramiteStore: Tramite260204Store,
     private tramiteQuery: Tramite260204Query,
     private consultaQuery: ConsultaioQuery  
   ) { 
    this.consultaQuery.selectConsultaioState$
        .pipe(takeUntil(this.destroy$))
        .subscribe((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        });
   }
 

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * Este método realiza las siguientes acciones:
   * 
   * 1. Suscribe a varios observables de `tramiteQuery` para obtener datos relacionados con 
   *    fabricantes, destinatarios finales, proveedores y facturadores, y los asigna a las 
   *    propiedades correspondientes del componente:
   *    - `fabricanteTablaDatos`
   *    - `destinatarioFinalTablaDatos`
   *    - `proveedorTablaDatos`
   *    - `facturadorTablaDatos`
   * 
   *    Cada suscripción se gestiona utilizando el operador `takeUntil` para garantizar que 
   *    las suscripciones se cancelen cuando el componente se destruya, evitando fugas de memoria.
   * 
   * 2. Configura la propiedad `esFormularioSoloLectura` como un observable que determina si 
   *    el formulario debe estar en modo de solo lectura. Esto se basa en el estado de consulta 
   *    obtenido de `consultaQuery.selectConsultaioState$`:
   *    - Si `create` es falso y `procedureId` es igual a '260204', se asigna el valor de 
   *      `readonly` del estado de la sección.
   *    - En caso contrario, se asigna `false`.
   * 
   * Este método asegura que los datos necesarios para el componente se carguen correctamente 
   * y que el estado de solo lectura del formulario se gestione dinámicamente.
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
  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * 
   * Este método se utiliza para realizar la limpieza de recursos y evitar fugas de memoria.
   * En este caso, se emite un valor en el Subject `destroy$` para notificar que el componente
   * ha sido destruido y luego se completa el Subject para liberar sus recursos.
   * 
   * Es una práctica recomendada utilizar este método para cancelar suscripciones, 
   * detener observables o liberar cualquier recurso que el componente haya utilizado.
   */
  ngOnDestroy(): void{
    this.destroy$.next();
    this.destroy$.complete();
  }
}
