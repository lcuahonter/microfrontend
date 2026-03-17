import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import {
  Destinatario,
  Fabricante,
  Facturador,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { EventEmitter, Output } from '@angular/core';
import { ID_PROCEDIMIENTO } from '../../enums/domicilio-del-establecimiento.enum';

import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { Tramite260911Query } from '../../estados/tramite260911.query';
import { Tramite260911Store } from '../../estados/tramite260911.store';


/**
 * Componente para la gestión y visualización de terceros relacionados (fabricantes y destinatarios).
 * Renderiza tablas dinámicas con la información obtenida desde servicios y controla el modo de solo lectura.
 * Implementa la gestión de ciclo de vida para evitar fugas de memoria.
 *
 * @selector app-terceros-relacionados
 * @standalone true
 * @templateUrl ./terceros-relacionados.component.html
 * @styleUrl ./terceros-relacionados.component.scss
 * @providers [TercerosRelacionadosService]
 * @imports [
 *   CommonModule, 
 *   TituloComponent, 
 *   ReactiveFormsModule, 
 *   AlertComponent, 
 *   TablaDinamicaComponent, 
 *   TableComponent
 * ]
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-terceros-relacionados-vista',
  standalone: true,
  imports: [CommonModule, TercerosRelacionadosComponent],
  templateUrl: './terceros-relacionados-vista.component.html',
  styleUrl: './terceros-relacionados-vista.component.scss',
})
export class TercerosRelacionadosVistaComponent implements OnInit, OnDestroy, OnChanges {
    @Output() continuar = new EventEmitter<void>();
  // ...existing code...

  tipoTramiteUP: string = '';
  botonDesactivarParaProrrogar: boolean = false;

  

  /**
   * Tipo de trámite actual.
   */
  @Input() tipoTramite: string = '';
  /**
   * Estado de habilitación de la tabla de fabricantes.
   */
  isFabricanteTablaDatosDisabled: boolean = true;
  /**
   * Estado de habilitación de la tabla de destinatarios finales.
   */
  isDestinatarioFinalTablaDatosDisabled: boolean = true;
  /**
   * Estado de habilitación de la tabla de proveedores.
   */
  isProveedorTablaDatosDisabled: boolean = true;
  /**
   * Estado de habilitación de la tabla de facturadores.
   */
   
  isFacturadorTablaDatosDisabled: boolean = true;
  /**
   * Datos de la tabla de fabricantes.
   */
  fabricanteTablaDatos: Fabricante[] = [];
  /**
   * Datos de la tabla de destinatarios finales.
   */
  destinatarioFinalTablaDatos: Destinatario[] = [];
  /**
   * Datos de la tabla de proveedores.
   */
  proveedorTablaDatos: Proveedor[] = [];
  /**
   * Datos de la tabla de facturadores.
   */
  facturadorTablaDatos: Facturador[] = [];
  /**
   * Datos de la tabla de fabricantes seleccionados.
   */
  fabricanteSeleccionadoDatos: Fabricante[] = [];
  /**
   * Datos de la tabla de destinatarios finales seleccionados.
   */
  destinatarioSeleccionadoDatos: Destinatario[] = [];
  /**
   * Datos de la tabla de proveedores seleccionados.
   */
  proveedorSeleccionadoDatos: Proveedor[] = [];
  /**
   * Datos de la tabla de facturadores seleccionados.
   */
  facturadorSeleccionadoDatos: Facturador[] = [];

  /**
   * Estado de habilitación de los botones de acción para la tabla de fabricantes.
   */
  fabricanteButtonState = { showModificar: false, showEliminar: false };
  /**
   * Estado de habilitación de los botones de acción para la tabla de destinatarios finales.
   */
  destinatarioButtonState = { showModificar: false, showEliminar: false };
  /**
   * Estado de habilitación de los botones de acción para la tabla de proveedores.
   */
  proveedorButtonState = { showModificar: false, showEliminar: false };
  /**
   * Estado de habilitación de los botones de acción para la tabla de facturadores.
   */
  facturadorButtonState = { showModificar: false, showEliminar: false };

  /**
   * Indica si el formulario debe mostrarse en modo de solo lectura.
   */
  esFormularioSoloLectura = false;

  //botonDesactivarParaProrrogar!:boolean;

  /**
   * Subject para manejar la destrucción del componente.
   */
  private destroy$ = new Subject<void>();

   /**
     * @property idProcedimiento
     * @description ID of the current procedure, defined as a read-only property.
     * @type {string | number}
     * @readonly
     */
    public readonly idProcedimiento = ID_PROCEDIMIENTO;

    tramiteID: string = "260911";

  /**
   * Constructor de la clase.
   *
   * @param tramiteQuery - Servicio para consultar datos del trámite.
   * @param tramiteStore - Servicio para almacenar datos del trámite.
   * @param renderer - Servicio para manipular el DOM.
   */
  constructor(
    private tramiteQuery: Tramite260911Query,
    private tramiteStore: Tramite260911Store,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe a los observables para obtener los datos de las tablas.
   *
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramiteQuery.getFabricanteTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((datos) => {
        this.fabricanteTablaDatos = datos;
      });

    this.tramiteQuery.getDestinatarioFinalTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((datos) => {
        this.destinatarioFinalTablaDatos = datos;
      });

    this.tramiteQuery.getProveedorTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((datos) => {
        
        this.proveedorTablaDatos = datos as Proveedor[];
      });

    this.tramiteQuery.getFacturadorTablaDatos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((datos) => {
        this.facturadorTablaDatos = datos as Facturador[];
      });
    
  }
/**
 * Método del ciclo de vida de Angular que se ejecuta al detectar cambios en las propiedades de entrada.
 * Se utiliza para actualizar el estado de los checkboxes de las tablas según el tipo de trámite.
 *
 * @method ngOnChanges
 * @returns {void}
 */

  ngOnChanges(): void {
  if (this.tipoTramite === '1' || this.tipoTramite === '2') {
    this.isFabricanteTablaDatosDisabled = false;
    this.isDestinatarioFinalTablaDatosDisabled = false;
    this.isProveedorTablaDatosDisabled = false;
    this.isFacturadorTablaDatosDisabled = false;
    this.botonDesactivarParaProrrogar =true;

    
  } else {
    this.isFabricanteTablaDatosDisabled = true;
    this.isDestinatarioFinalTablaDatosDisabled = true;
    this.isProveedorTablaDatosDisabled = true;
    this.isFacturadorTablaDatosDisabled = true;
    this.botonDesactivarParaProrrogar = false;

  }
}
  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia los recursos suscritos para evitar fugas de memoria.
   *
   * @method ngOnDestroy
   * @returns {void}
   */

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  /**
   * Elimina los fabricantes seleccionados de la tabla de fabricantes.
   *
   * @remarks
   * Este método toma los fabricantes seleccionados, obtiene sus IDs y los elimina de la lista principal de fabricantes.
   * Luego, actualiza el estado de la tabla y restablece la selección y el estado de los botones relacionados.
   *
   * @method eliminarFabricante
   * @returns {void}
   *
   * @compodoc
   * @description
   * Elimina los fabricantes seleccionados de la tabla y actualiza el estado de la interfaz.
   */
  eliminarFabricante(): void {
    if (this.fabricanteSeleccionadoDatos.length > 0) {
      const IDS_TO_DELETE = this.fabricanteSeleccionadoDatos.map(f => f.id);
      const UPDATED = this.fabricanteTablaDatos.filter(f => !IDS_TO_DELETE.includes(f.id));
      this.tramiteStore.updateFabricanteTablaDatos(UPDATED);
      this.fabricanteSeleccionadoDatos = [];
      this.fabricanteButtonState = { showModificar: false, showEliminar: false };
    }
  }


  /**
   * Elimina los destinatarios seleccionados de la tabla final de destinatarios.
   * 
   * - Obtiene los IDs de los destinatarios seleccionados.
   * - Filtra la tabla de destinatarios finales para excluir los seleccionados.
   * - Actualiza el estado en el store con la nueva lista de destinatarios.
   * - Limpia la selección actual y actualiza el estado de los botones relacionados.
   *
   * @remarks
   * Este método se utiliza para gestionar la eliminación de destinatarios en el componente de terceros relacionados.
   */
  eliminarDestinatario(): void {
    if (this.destinatarioSeleccionadoDatos.length > 0) {
      const IDS_TO_DELETE = this.destinatarioSeleccionadoDatos.map(d => d.id);
      const UPDATED = this.destinatarioFinalTablaDatos.filter(d => !IDS_TO_DELETE.includes(d.id));
      this.tramiteStore.updateDestinatarioFinalTablaDatos(UPDATED);
      this.destinatarioSeleccionadoDatos = [];
      this.destinatarioButtonState = { showModificar: false, showEliminar: false };
    }
  }
  /**
   * Modifica el fabricante seleccionado.
   * 
   * - Si hay un solo fabricante seleccionado, abre un diálogo o formulario para editarlo.
   * - Si hay más de uno, no hace nada.
   *
   * @remarks
   * Este método se utiliza para gestionar la modificación de fabricantes en el componente de terceros relacionados.
   */

  modificarProveedor(): void {
    if (this.proveedorSeleccionadoDatos.length === 1) {
      // Open modal or form to edit proveedor
      // Example: this.openEditDialog(this.proveedorSeleccionadoDatos[0]);
    }
  }


  /**
   * Elimina los proveedores seleccionados de la tabla de proveedores.
   *
   * - Obtiene los IDs de los proveedores seleccionados.
   * - Filtra la lista de proveedores para excluir los seleccionados.
   * - Actualiza la tabla de proveedores en el store.
   * - Limpia la selección de proveedores y actualiza el estado de los botones.
   *
   * @remarks
   * Este método se utiliza para gestionar la eliminación de proveedores relacionados en el componente.
   */
  eliminarProveedor(): void {
    if (this.proveedorSeleccionadoDatos.length > 0) {
      const IDS_TO_DELETE = this.proveedorSeleccionadoDatos.map((p: Proveedor) => p.id);
      const UPDATED = this.proveedorTablaDatos.filter((p: Proveedor) => !IDS_TO_DELETE.includes(p.id));
      this.tramiteStore.updateProveedorTablaDatos(UPDATED);
      this.proveedorSeleccionadoDatos = [];
      this.proveedorButtonState = { showModificar: false, showEliminar: false };
    }
  }
  

  /**
   * Elimina los facturadores seleccionados de la tabla de facturadores.
   *
   * - Obtiene los IDs de los facturadores seleccionados.
   * - Filtra la lista de facturadores para eliminar los seleccionados.
   * - Actualiza el estado de la tabla de facturadores en el store.
   * - Limpia la selección actual y actualiza el estado de los botones.
   *
   * @remarks
   * Este método se utiliza para gestionar la eliminación de facturadores relacionados en el componente.
   */
  eliminarFacturador(): void {
    if (this.facturadorSeleccionadoDatos.length > 0) {
      const IDS_TO_DELETE = this.facturadorSeleccionadoDatos.map((f: Facturador) => f.id);
      const UPDATED = this.facturadorTablaDatos.filter((f: Facturador) => !IDS_TO_DELETE.includes(f.id));
      this.tramiteStore.updateFacturadorTablaDatos(UPDATED);
      this.facturadorSeleccionadoDatos = [];
      this.facturadorButtonState = { showModificar: false, showEliminar: false };
    }
  }


  /**
   * @description
   * Agrega un nuevo fabricante a la lista de fabricantes relacionados.
   * 
   * Este método inicializa el arreglo `fabricanteSeleccionadoDatos` como vacío,
   * permitiendo la selección de un nuevo fabricante en el componente.
   */
  agregarFabricante(): void {
    
    this.fabricanteSeleccionadoDatos = [];
  }

  /**
   * @description
   * Agrega un nuevo destinatario a la lista de destinatarios relacionados.
   *
   * Este método inicializa el arreglo `destinatarioSeleccionadoDatos` como vacío,
   * permitiendo la selección de un nuevo destinatario en el componente.
   */
  agregarDestinatario(): void {
  
    this.destinatarioSeleccionadoDatos = [];
  }

  /**
   * @description
   * Agrega un nuevo proveedor a la lista de proveedores relacionados.
   *
   * Este método inicializa el arreglo `proveedorSeleccionadoDatos` como vacío,
   * permitiendo la selección de un nuevo proveedor en el componente.
   */
  agregarProveedor(): void {
 
    this.proveedorSeleccionadoDatos = [];
  }

  /**
   * @description
   * Agrega un nuevo facturador a la lista de facturadores relacionados.
   *
   * Este método inicializa el arreglo `facturadorSeleccionadoDatos` como vacío,
   * permitiendo la selección de un nuevo facturador en el componente.
   */
  agregarFacturador(): void {
  
    this.facturadorSeleccionadoDatos = [];
  }

  /**
   * @description
   * Maneja la selección de un fabricante en la tabla.
   *
   * Este método actualiza el estado de los datos seleccionados y los botones
   * en función de la selección actual.
   *
   * @param event - El evento de selección que contiene los datos del fabricante.
   */
  onFabricanteSeleccionado(event: Fabricante[] | object): void {
    let DATOS: Fabricante[] = [];
    if (Array.isArray(event)) {
      DATOS = event;
    } else if (TercerosRelacionadosVistaComponent.isSelectionEvent<Fabricante>(event)) {
      DATOS = event.selectedRows ?? event.detail ?? [];
    }
    this.fabricanteSeleccionadoDatos = DATOS;
    this.fabricanteButtonState = {
      showModificar: DATOS.length === 1,
      showEliminar: DATOS.length > 0
    };
  }

  /**
   * @description
   * Maneja la selección de un destinatario en la tabla.
   *
   * Este método actualiza el estado de los datos seleccionados y los botones
   * en función de la selección actual.
   *
   * @param event - El evento de selección que contiene los datos del destinatario.
   */
  onDestinatarioSeleccionado(event: Destinatario[] | object): void {
    let DATOS: Destinatario[] = [];
    if (Array.isArray(event)) {
      DATOS = event;
    } else if (TercerosRelacionadosVistaComponent.isSelectionEvent<Destinatario>(event)) {
      DATOS = event.selectedRows ?? event.detail ?? [];
    }
    this.destinatarioSeleccionadoDatos = DATOS;
    this.destinatarioButtonState = {
      showModificar: DATOS.length === 1,
      showEliminar: DATOS.length > 0
    };
  }

  /**
   * @description
   * Maneja la selección de un proveedor en la tabla.
   *
   * Este método actualiza el estado de los datos seleccionados y los botones
   * en función de la selección actual.
   *
   * @param event - El evento de selección que contiene los datos del proveedor.
   */
  onProveedorSeleccionado(event: Proveedor[] | object): void {
    let DATOS: Proveedor[] = [];
    if (Array.isArray(event)) {
      DATOS = event as Proveedor[];
    } else if (TercerosRelacionadosVistaComponent.isSelectionEvent<Proveedor>(event)) {
      DATOS = event.selectedRows ?? event.detail ?? [];
    }
    this.proveedorSeleccionadoDatos = DATOS;
    this.proveedorButtonState = {
      showModificar: DATOS.length === 1,
      showEliminar: DATOS.length > 0
    };
  }

  /**
   * @description
   * Maneja la selección de un facturador en la tabla.
   *
   * Este método actualiza el estado de los datos seleccionados y los botones
   * en función de la selección actual.
   *
   * @param event - El evento de selección que contiene los datos del facturador.
   */
  onFacturadorSeleccionado(event: Facturador[] | object): void {
    let DATOS: Facturador[] = [];
    if (Array.isArray(event)) {
      DATOS = event as Facturador[];
    } else if (TercerosRelacionadosVistaComponent.isSelectionEvent<Facturador>(event)) {
      DATOS = event.selectedRows ?? event.detail ?? [];
    }
    this.facturadorSeleccionadoDatos = DATOS;
    this.facturadorButtonState = {
      showModificar: DATOS.length === 1,
      showEliminar: DATOS.length > 0
    };
  }

  /**
   * @description
   * Agrega un nuevo fabricante a la lista de fabricantes relacionados.
   *
   * Este método inicializa el arreglo `fabricanteSeleccionadoDatos` como vacío,
   * permitiendo la selección de un nuevo fabricante en el componente.
   */
  addFabricantes(newFabricantes: Fabricante[]): void {
    this.tramiteStore.updateFabricanteTablaDatos(newFabricantes);
  }

  

  /**
   * Agrega una lista de destinatarios al trámite actual.
   *
   * @param newDestinatarios - Un arreglo de objetos `Destinatario` que serán añadidos como destinatarios finales en la tabla de datos.
   */
  addDestinatarios(newDestinatarios: Destinatario[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(newDestinatarios);
  }

  /**
   * Agrega una lista de proveedores al trámite actual.
   *
   * @param newProveedores - Un arreglo de objetos `Proveedor` que serán añadidos como proveedores en la tabla de datos.
   */
  addProveedores(newProveedores: Proveedor[]): void {
    this.tramiteStore.updateProveedorTablaDatos(newProveedores);
  }

  /**
   * Agrega una lista de facturadores al trámite actual.
   *
   * @param newFacturadores - Un arreglo de objetos `Facturador` que serán añadidos como facturadores en la tabla de datos.
   */
  addFacturadores(newFacturadores: Facturador[]): void {
    this.tramiteStore.updateFacturadorTablaDatos(newFacturadores);
  }


  /**
   * Determina si el objeto proporcionado es un evento de selección válido.
   *
   * Un evento de selección válido es un objeto que contiene una propiedad `selectedRows` o `detail`,
   * y cada una de estas propiedades (si existen) debe ser un arreglo.
   *
   * @typeParam T - Tipo de los elementos en los arreglos de selección.
   * @param event - El objeto a verificar como posible evento de selección.
   * @returns `true` si el objeto es un evento de selección válido, `false` en caso contrario.
   */
  private static isSelectionEvent<T>(event: unknown): event is { selectedRows?: T[]; detail?: T[] } {
    return (
      typeof event === 'object' &&
      event !== null &&
      (
        ('selectedRows' in event && Array.isArray((event as { selectedRows?: T[] }).selectedRows)) ||
        ('detail' in event && Array.isArray((event as { detail?: T[] }).detail))
      )
    );
  }

// eslint-disable-next-line class-methods-use-this
public validateRequiredFields(): boolean {
  // No required fields in this component
  return true;
}

// eslint-disable-next-line class-methods-use-this
public markAllFieldsTouched(): void {
  // No fields to mark as touched in this component
}
}
