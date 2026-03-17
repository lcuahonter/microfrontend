import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, createComponent } from '@angular/core';


import {
  CategoriaMensaje,
  Notificacion,
  NotificacionesComponent,
  TipoNotificacionEnum,
} from '@ng-mf/data-access-user';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  /**
   * Crea y muestra una alerta usando el componente `NotificacionesComponent`.
   * @param mensaje Texto o HTML a mostrar en la alerta
   * @param options Configuración opcional de la alerta
   */
  showAlert(
    mensaje: string,
    options?: {
      titulo?: string;
      categoria?: CategoriaMensaje;
      modo?: string;
      cerrar?: boolean;
      tiempoDeEspera?: number;
      tamanioModal?: string;
    }
  ): ComponentRef<NotificacionesComponent> {
    const TITULO = options?.titulo ?? 'Alerta';
    const CATEGORIA = options?.categoria ?? CategoriaMensaje.ALERTA;
    const MODO = options?.modo ?? '';
    const CERRAR = options?.cerrar ?? true;
    const TIEMPO_DE_ESPERA = options?.tiempoDeEspera;
    const TAMANIO_MODAL = options?.tamanioModal ?? '';

    const NOTIFICACION: Notificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CATEGORIA,
      modo: MODO,
      titulo: TITULO,
      mensaje: mensaje,
      cerrar: CERRAR,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
      tamanioModal: TAMANIO_MODAL,
    };

    // Creamos dinámicamente el componente de notificaciones (misma lógica que NotificacionesService)
    const COMPONENT = createComponent(NotificacionesComponent, {
      environmentInjector: this.injector,
    });

    COMPONENT.instance.notificacionInput = NOTIFICACION;
    COMPONENT.instance.ngOnChanges({
      notificacionInput: {
        currentValue: NOTIFICACION,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    this.appRef.attachView(COMPONENT.hostView);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ELE = (COMPONENT.hostView as any).rootNodes[0] as HTMLElement;

    const NAVELEMENT = document.querySelector('c-header');
    if (NAVELEMENT && NAVELEMENT.parentNode) {
      NAVELEMENT.parentNode.insertBefore(ELE, NAVELEMENT.nextSibling);
    } else {
      document.body.appendChild(ELE);
    }

    if (TIEMPO_DE_ESPERA) {
      setTimeout(() => {
        this.appRef.detachView(COMPONENT.hostView);
        COMPONENT.destroy();
      }, TIEMPO_DE_ESPERA);
    }

    return COMPONENT;
  }
}