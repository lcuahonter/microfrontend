/**
 * @fileoverview Componente contenedor para agregar proveedores al trámite 240118.
 * @description Wrapper component que encapsula la funcionalidad de agregar proveedores
 * utilizando el componente reutilizable AgregarProveedorCustomComponent.
 * @author VUCEM Development Team
 * @since 1.0.0
 * @version 1.0.0
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  DestinoFinal,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { AgregarProveedorCustomComponent } from '../../../../shared/components/agregar-proveedor-custom/agregar-proveedor-custom.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Tramite240118Query } from '../../estados/tramite240118Query.query';
import { Tramite240118Store } from '../../estados/tramite240118Store.store';

/**
 * @class AgregarProveedorContenedoraComponent
 * @implements {OnInit}
 * @description Componente contenedor especializado para agregar proveedores en el trámite 240118.
 * Encapsula la lógica específica del trámite mientras reutiliza componentes genéricos.
 * 
 * Este componente actúa como bridge entre el flujo específico del trámite 240118
 * y el componente genérico de agregar proveedores, gestionando el estado local
 * y las comunicaciones con el store principal.
 * 
 * @example
 * ```html
 * <app-agregar-proveedor-contenedora
 *   (cerrar)="onCerrarModal()">
 * </app-agregar-proveedor-contenedora>
 * ```
 * 
 * @example
 * ```typescript
 * // En el componente padre
 * onCerrarModal(): void {
 *   this.mostrarModal = false;
 * }
 * ```
 * 
 * @standalone
 * @selector app-agregar-proveedor-contenedora
 * @templateUrl ./agregar-proveedor-contenedora.component.html
 * @styleUrl ./agregar-proveedor-contenedora.component.scss
 * @since 1.0.0
 * @author VUCEM Development Team
 * @version 1.0.0
 */
@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorCustomComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent implements OnInit {
  /**
   * @output cerrar
   * @description Evento que se emite cuando se debe cerrar el componente o modal.
   * Permite a los componentes padres reaccionar al cierre y gestionar la visibilidad
   * del modal o la navegación hacia otras secciones.
   *
   * @type {EventEmitter<void>}
   * 
   * @example
   * ```html
   * <app-agregar-proveedor-contenedora
   *   (cerrar)="onCerrarModalProveedor()">
   * </app-agregar-proveedor-contenedora>
   * ```
   * 
   * @since 1.0.0
   */
  @Output() cerrar = new EventEmitter<void>();
  /**
   * @property terechosDatos$
   * @description Observable que emite datos relacionados con terceros (destino final o proveedor)
   * que están siendo modificados o seleccionados en el estado del trámite.
   * Se utiliza para manejar el estado de edición de proveedores existentes.
   * 
   * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
   * 
   * @example
   * ```typescript
   * // Suscribirse a cambios en los datos
   * this.terechosDatos$.subscribe(datos => {
   *   if (datos && 'rfc' in datos) {
   *     console.log('Editando proveedor:', datos);
   *   }
   * });
   * ```
   * 
   * @since 1.0.0
   */
  terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;
  /**
   * @property idProcedimiento
   * @description Identificador único del procedimiento administrativo 240118 de SEDENA.
   * Constante que identifica específicamente el trámite de "Permiso extraordinario
   * para la exportación de sustancias químicas".
   * 
   * @type {number}
   * @readonly
   * @default 240118
   * 
   * @example
   * ```typescript
   * // Verificar tipo de trámite
   * if (this.idProcedimiento === 240118) {
   *   console.log('Trámite de sustancias químicas');
   * }
   * ```
   * 
   * @since 1.0.0
   */
  public readonly idProcedimiento: number = 240118;

  /**
   * @constructor
   * @description Inicializa el componente inyectando las dependencias necesarias
   * para la gestión del estado del trámite y la consulta de datos.
   * Configura el observable de terceros desde el query.
   *
   * @param {Tramite240118Store} tramiteStore - Store que administra el estado del trámite 240118.
   * @param {Tramite240118Query} tramiteQuery - Query que proporciona acceso reactivo a los datos del trámite.
   * 
   * @example
   * ```typescript
   * // Angular inyecta automáticamente estas dependencias
   * constructor(
   *   public tramiteStore: Tramite240118Store,
   *   public tramiteQuery: Tramite240118Query
   * ) {
   *   // Inicialización automática
   * }
   * ```
   * 
   * @since 1.0.0
   */

  constructor(
    public tramiteStore: Tramite240118Store,
    public tramiteQuery: Tramite240118Query
  ) {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }

  /**
   * @method ngOnInit
   * @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el observable que escucha los datos de terceros para el manejo de edición
   * de proveedores existentes.
   * 
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Se ejecuta automáticamente por Angular
   * ngOnInit(): void {
   *   // Configuración inicial del componente
   * }
   * ```
   * 
   * @override
   * @since 1.0.0
   */
  ngOnInit(): void {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }

  /**
   * @method updateProveedorTablaDatos
   * @description Actualiza la tabla de proveedores en el store del trámite
   * y cierra el modal de agregar proveedor. Este método coordina la
   * actualización del estado y la navegación del usuario.
   *
   * @param {Proveedor[]} event - Lista de proveedores que se agregarán al trámite.
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const nuevosProveedores: Proveedor[] = [{
   *   nombre: 'Proveedor Químico S.A.',
   *   rfc: 'PQS123456789',
   *   direccion: 'Industrial Norte 123'
   * }];
   * 
   * this.updateProveedorTablaDatos(nuevosProveedores);
   * // El modal se cierra automáticamente
   * ```
   * 
   * @fires cerrar - Emite evento de cierre del modal
   * @since 1.0.0
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramiteStore.updateProveedorTablaDatos(event);
    this.cerrar.emit();
  }
}
