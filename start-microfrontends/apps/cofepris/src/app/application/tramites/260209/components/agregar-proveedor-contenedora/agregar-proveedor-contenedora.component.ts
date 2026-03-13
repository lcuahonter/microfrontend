import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260209Store } from '../../estados/tramite260209Store.store';

/**
 * @class AgregarProveedorContenedoraComponent
 * @classdesc Componente contenedor de Angular que actúa como intermediario entre la interfaz de usuario
 * y el componente reutilizable `AgregarProveedorComponent`. Este componente gestiona la funcionalidad
 * relacionada con la administración de proveedores específicamente para el trámite 260209 de COFEPRIS.
 * 
 * @description
 * - Utiliza el patrón de componente contenedor para separar la lógica de presentación de la lógica de negocio
 * - Interactúa directamente con el store `Tramite260209Store` para mantener el estado del trámite
 * - Proporciona una interfaz específica para la gestión de proveedores en el contexto del trámite 260209
 * - Implementa el patrón standalone component de Angular para una mejor modularidad
 * 
 * @author Sistema COFEPRIS
 * @since 2025
 * @version 3.0
 * 
 * @example
 * ```html
 * <app-agregar-proveedor-contenedora></app-agregar-proveedor-contenedora>
 * ```
 */

@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent {
  
  /**
   * @property {Tramite260209Store} tramite260209Store - Store inyectado para la gestión del estado del trámite
   * @description Propiedad pública que contiene la instancia del store que administra el estado completo
   * del trámite 260209. Permite el acceso directo desde el template y otros métodos del componente
   * para realizar operaciones de lectura y escritura del estado.
   * 
   * @public
   * @readonly - La instancia del store no debe ser reasignada una vez inyectada
   * @memberof AgregarProveedorContenedoraComponent
   */

  /**
   * @constructor
   * @description Constructor del componente que implementa la inyección de dependencias de Angular.
   * Recibe e inicializa el store necesario para la gestión del estado del trámite 260209.
   * 
   * @param {Tramite260209Store} tramite260209Store - Store que administra el estado completo del trámite 260209,
   * incluyendo los datos de proveedores, documentos, y demás información relacionada con el proceso.
   * 
   * @memberof AgregarProveedorContenedoraComponent
   * @since 3.0
   * 
   * @example
   * ```typescript
   * // El constructor se ejecuta automáticamente durante la instanciación del componente
   * // No requiere llamada manual, Angular se encarga de la inyección de dependencias
   * ```
   */
  constructor(public tramite260209Store: Tramite260209Store) {
    // No se necesita lógica de inicialización adicional.
    // El store se inyecta automáticamente y está listo para su uso.
  }

  /**
   * @method updateProveedorTablaDatos
   * @description Método público que actúa como intermediario para actualizar los datos de la tabla
   * de proveedores en el store del trámite. Este método se ejecuta típicamente cuando el usuario
   * realiza cambios en la lista de proveedores desde el componente hijo `AgregarProveedorComponent`.
   * 
   * @param {Proveedor[]} event - Array de objetos tipo Proveedor que contiene la lista actualizada
   * de proveedores. Cada objeto debe cumplir con la estructura definida en el modelo `Proveedor`
   * del módulo de terceros relacionados.
   * 
   * @returns {void} Este método no retorna ningún valor, ya que su propósito es actualizar
   * el estado interno del store.
   * 
   * @memberof AgregarProveedorContenedoraComponent
   * @since 3.0
   * @public
   * 
   * @example
   * ```typescript
   * // Ejemplo de uso desde el template HTML
   * // <app-agregar-proveedor (proveedoresActualizados)="updateProveedorTablaDatos($event)">
   * // </app-agregar-proveedor>
   * 
   * const nuevosProveedores: Proveedor[] = [
   *   { id: 1, nombre: 'Proveedor A', rfc: 'RFC123456789' },
   *   { id: 2, nombre: 'Proveedor B', rfc: 'RFC987654321' }
   * ];
   * this.updateProveedorTablaDatos(nuevosProveedores);
   * ```
   * 
   * @throws {Error} Puede lanzar errores si el store no está disponible o si los datos
   * no cumplen con la estructura esperada del modelo Proveedor.
   */
  updateProveedorTablaDatos(event: Proveedor[]): void {
    this.tramite260209Store.updateProveedorTablaDatos(event);
  }
}
