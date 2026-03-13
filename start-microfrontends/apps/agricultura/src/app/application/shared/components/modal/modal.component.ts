import { CommonModule } from '@angular/common';

import {
  Component,
  ComponentRef,
  OnDestroy,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
/**
 * Componente reutilizable para mostrar modales y cargar componentes dinámicos dentro del modal.
 * @component ModalComponent
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ModalModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnDestroy {
  /**
   * Referencia al modal de ngx-bootstrap.
   * @property {ModalDirective} modal
   */
  @ViewChild('modal', { static: false }) modal?: ModalDirective;

  /**
   * Contenedor de vista donde se carga el componente dinámico.
   * @property {ViewContainerRef} container
   */
  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef,
    static: true,
  })

  /**
   * Bandera para indicar si el modal debe mostrarse.
   * @property {boolean} container
   */
  container!: ViewContainerRef;

  /**
   * Bandera para indicar si el modal debe mostrarse.
   * @property {boolean} mostrarModal
   */
  public mostrarModal: boolean = false;

  /**
   * Referencia al componente creado dinámicamente.
   * @property {ComponentRef<any>} componentRef
   * @private
   */
  private componentRef?: ComponentRef<unknown>;

  /**
   * Carga un componente dinámico dentro del contenedor, sin mostrar el modal.
   * @method loadComponent
   * @param {Type<any>} component - Componente a renderizar.
   * @param {any} [data] - Propiedades a asignar al componente.
   * @returns {void}
   */
  loadComponent(component: Type<unknown>, data?: unknown): void {
    this.container.clear();
    this.componentRef = this.container.createComponent(component);

    if (data && this.componentRef.instance) {
      Object.assign(this.componentRef.instance, data);
    }
  }

  /**
   * Crea y muestra un componente dinámico dentro del modal, pasando propiedades opcionales.
   * Se suscribe al evento `cerrar` si está presente para cerrar automáticamente el modal.
   * @method abrir
   * @param {Type<any>} component - Componente a mostrar en el modal.
   * @param {Record<string, any>} [inputs] - Propiedades de entrada para el componente.
   * @returns {void}
   */
  abrir(component: Type<unknown>, inputs?: Record<string, unknown>): void {
    this.container.clear();
    this.componentRef = this.container.createComponent(component);

    if (inputs) {
      Object.assign(this.componentRef.instance as object, inputs);
    }

    const INSTANCE = this.componentRef.instance as { cerrar?: { subscribe: (fn: () => void) => void } };
    if (INSTANCE && INSTANCE.cerrar && typeof INSTANCE.cerrar.subscribe === 'function') {
      INSTANCE.cerrar.subscribe(() => this.cerrar());
    }

    this.modal?.show();
  }

  /**
   * Cierra el modal, elimina el contenido del contenedor y destruye el componente creado.
   * @method cerrar
   * @returns {void}
   */
  cerrar(): void {
    this.modal?.hide();
    this.container.clear();
    this.componentRef?.destroy();
  }

  /**
   * Hook de ciclo de vida que se ejecuta al destruir el componente.
   * Se asegura de liberar recursos destruyendo el componente dinámico.
   * @method ngOnDestroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.componentRef?.destroy();
  }
}
