import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite260206State, Tramite260206Store } from '../../estados/stores/tramite260206Store.store';
import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260206Query } from '../../estados/queries/tramite260206Query.query';

/**
 * @class AgregarProveedorContenedoraComponent
 * @description
 * Componente contenedor responsable de gestionar la funcionalidad de agregar proveedores
 * para el trámite 260206. Actúa como intermediario entre el componente de presentación
 * AgregarProveedorComponent y el estado global del trámite.
 * 
 * Este componente maneja:
 * - La suscripción al estado del trámite
 * - La actualización de la tabla de proveedores
 * - La gestión del ciclo de vida de las suscripciones RxJS
 * 
 * @implements {OnInit} - Para la inicialización del componente
 * @implements {OnDestroy} - Para la limpieza de recursos
 * 
 * @selector app-agregar-proveedor-contenedora
 * @standalone true
 * @templateUrl ./agregar-proveedor-contenedora.component.html
 * @styleUrl ./agregar-proveedor-contenedora.component.scss
 */
@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent implements OnDestroy, OnInit {
    /**
     * @property {Subject<void>} destroyNotifier$
     * @description
     * Observable privado utilizado para implementar el patrón de destrucción de suscripciones.
     * Emite un valor cuando el componente se destruye para completar automáticamente
     * todas las suscripciones que usan el operador takeUntil, evitando memory leaks.
     * 
     * @private
     * @readonly
     * @memberof AgregarProveedorContenedoraComponent
     */
    private destroyNotifier$: Subject<void> = new Subject();

    /**
     * @property {Tramite260206State} tramiteState
     * @description
     * Estado local que contiene toda la información del trámite 260206.
     * Se actualiza automáticamente cuando cambia el estado global del trámite
     * a través de la suscripción en ngOnInit.
     * 
     * Contiene información como:
     * - Datos del formulario del trámite
     * - Tabla de mercancías
     * - Tabla de proveedores
     * - Estado de validaciones
     * 
     * @public
     * @type {Tramite260206State}
     * @memberof AgregarProveedorContenedoraComponent
     */
    public tramiteState!: Tramite260206State;
 

    /**
     * @constructor
     * @description
     * Constructor del componente que inyecta las dependencias necesarias para
     * la gestión del estado del trámite 260206.
     * 
     * @param {Tramite260206Store} tramiteStore - Servicio de almacén que proporciona
     *        métodos para actualizar el estado del trámite, incluyendo la tabla de proveedores.
     *        Se utiliza para realizar operaciones de escritura en el estado global.
     * 
     * @param {Tramite260206Query} tramite260206Query - Servicio de consulta que proporciona
     *        observables para acceder a diferentes partes del estado del trámite.
     *        Se utiliza para realizar operaciones de lectura del estado global.
     * 
     * @memberof AgregarProveedorContenedoraComponent
     */
    constructor(
        public tramiteStore: Tramite260206Store,
        public tramite260206Query: Tramite260206Query) {
    }

    /**
     * @method ngOnInit
     * @description
     * Hook del ciclo de vida de Angular que se ejecuta después de la inicialización
     * del componente y sus propiedades enlazadas por datos.
     * 
     * Establece una suscripción al estado del trámite para mantener sincronizada
     * la propiedad local tramiteState con los cambios en el estado global.
     * La suscripción se auto-destruye cuando el componente se destruye gracias
     * al operador takeUntil.
     * 
     * Flujo de ejecución:
     * 1. Se suscribe al observable selectTramiteState$
     * 2. Aplica el operador takeUntil para auto-destrucción
     * 3. Mapea el estado recibido a la propiedad local
     * 4. Se suscribe para activar el flujo de datos
     * 
     * @public
     * @implements {OnInit}
     * @memberof AgregarProveedorContenedoraComponent
     * @returns {void}
     */
    ngOnInit(): void {
        this.tramite260206Query.selectTramiteState$
            .pipe(
                takeUntil(this.destroyNotifier$),
                map((seccionState) => {
                    this.tramiteState = seccionState;
                })
            )
            .subscribe();
    }
    
    /**
     * @method updateProveedorTablaDatos
     * @description
     * Método público que actúa como puente entre el componente hijo AgregarProveedorComponent
     * y el almacén de estado del trámite. Recibe la lista actualizada de proveedores
     * desde el componente hijo y la propaga al estado global.
     * 
     * Este método se invoca típicamente cuando:
     * - Se agrega un nuevo proveedor
     * - Se modifica un proveedor existente
     * - Se elimina un proveedor
     * - Se reordenan los proveedores en la tabla
     * 
     * @public
     * @param {Proveedor[]} event - Array de objetos Proveedor que representa
     *        el estado actualizado de la tabla de proveedores. Cada elemento
     *        contiene la información completa de un proveedor.
     * 
     * @returns {void}
     * @memberof AgregarProveedorContenedoraComponent
     * 
     * @example
     * // El método se invoca automáticamente desde el template cuando
     * // el componente hijo emite el evento de actualización
     * this.updateProveedorTablaDatos(nuevaListaProveedores);
     */
    updateProveedorTablaDatos(event:Proveedor[]): void {  
        this.tramiteStore.updateProveedorTablaDatos(event);
    }

    /**
     * @method ngOnDestroy
     * @description
     * Hook del ciclo de vida de Angular que se ejecuta justo antes de que
     * el componente sea destruido y removido del DOM.
     * 
     * Implementa el patrón de limpieza de suscripciones RxJS para prevenir
     * memory leaks. Emite un valor a través del destroyNotifier$ y luego
     * lo completa, lo que causa que todas las suscripciones que usan
     * takeUntil(this.destroyNotifier$) se cancelen automáticamente.
     * 
     * Secuencia de limpieza:
     * 1. Emite un valor para notificar destrucción
     * 2. Completa el Subject para liberar recursos
     * 3. Todas las suscripciones activas se cancelan automáticamente
     * 
     * @public
     * @implements {OnDestroy}
     * @memberof AgregarProveedorContenedoraComponent
     * @returns {void}
     */
    ngOnDestroy(): void {
        this.destroyNotifier$.next();
        this.destroyNotifier$.complete();
    }
}
