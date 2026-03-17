import {
    ApplicationRef,
    ComponentRef,
    EnvironmentInjector,
    Injectable,
    createComponent,
  } from '@angular/core';
  import { Notificacion, NotificacionesComponent } from '../../../tramites/components/notificaciones/notificaciones.component';
  
  /**
   * Servicio encargado de crear y mostrar dinámicamente el componente de notificaciones.
   * Permite mostrar diferentes tipos de notificaciones (modal, toast, banner) sin necesidad
   * de tener el componente previamente en el DOM.
   */
  @Injectable({
    providedIn: 'root',
  })
  export class NotificacionesService {
    /**
     * Referencia al componente de notificación creado dinámicamente.
     */
    private componentRef?: ComponentRef<NotificacionesComponent>;
  
    /**
     * Constructor del servicio.
     * 
     * @param appRef Referencia a la aplicación, utilizada para adjuntar vistas al árbol del DOM.
     * @param injector Inyector de entorno para crear componentes standalone dinámicamente.
     */
    constructor(
      private appRef: ApplicationRef,
      private injector: EnvironmentInjector
    ) {}
  
    /**
     * Muestra una notificación utilizando el componente `NotificacionesComponent`.
     * El componente se crea e inserta dinámicamente en el DOM, y se elimina automáticamente
     * si se especifica un tiempo de espera (`tiempoDeEspera`).
     *
     * @param notificacion Objeto con los datos necesarios para mostrar la notificación.
     */
    showNotification(notificacion: Notificacion): void {
      // Evita crear múltiples instancias si ya existe una
      if (this.componentRef) {
        this.hideNotification(); // Elimina la anterior si es necesario
      }
  
      // Crea dinámicamente el componente
      this.componentRef = createComponent(NotificacionesComponent, {
        environmentInjector: this.injector,
      });
  
      // Asigna el input manualmente
      this.componentRef.instance.notificacionInput = notificacion;
  
      // Llama manualmente a ngOnChanges (ya que Angular no lo hace con inputs dinámicos)
      this.componentRef.instance.ngOnChanges({
        notificacionInput: {
          currentValue: notificacion,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true
        }
      });
  
      // Adjunta la vista al DOM
      this.appRef.attachView(this.componentRef.hostView);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ELE = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
      
      // Buscar el elemento <c-header>
      const NAVELEMENT = document.querySelector('c-header');

      if (NAVELEMENT && NAVELEMENT.parentNode) {
        // Insertar el nuevo elemento después de <c-header>
        NAVELEMENT.parentNode.insertBefore(ELE, NAVELEMENT.nextSibling);
      } else {
        // <c-header> o <nav> no encontrados. Se agrega al body como alternativa.
        document.body.appendChild(ELE);
      }
  
      // Elimina automáticamente el componente si se especifica un tiempo de espera
      if (notificacion.tiempoDeEspera) {
        setTimeout(() => this.hideNotification(), notificacion.tiempoDeEspera);
      }
    }
  
    /**
     * Oculta y destruye el componente de notificación, si existe.
     * Elimina la vista del árbol de vistas y limpia la referencia.
     */
    hideNotification(): void {
      if (this.componentRef) {
        this.appRef.detachView(this.componentRef.hostView);
        this.componentRef.destroy();
        this.componentRef = undefined;
      }
    }
  }
  