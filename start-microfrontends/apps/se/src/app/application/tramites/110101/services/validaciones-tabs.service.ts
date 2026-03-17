import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";

/**
 * **Servicio para controlar la visualización de mensajes en pantalla**  
 *
 * - Utiliza `BehaviorSubject` para mantener el estado actual del mensaje.  
 * - Proporciona un observable para que los componentes se suscriban a los cambios.  
 * - Permite mostrar u ocultar mensajes de manera reactiva en toda la aplicación.  
 */
@Injectable({ providedIn: 'root' })
export class MensajePantallaService {
    /**
     * **BehaviorSubject que mantiene el estado visible/oculto del mensaje**  
     *
     * - Almacena el último valor emitido (`true` para visible, `false` para oculto).  
     * - Se inicializa con `false` (mensaje oculto por defecto).  
     */
    private mensajeSubject = new BehaviorSubject<boolean>(false);
    /**
    * **Observable del estado del mensaje para suscripciones**  
    *
    * - Los componentes pueden suscribirse para reaccionar a cambios de visibilidad.  
    * - Emite `true` cuando el mensaje debe mostrarse, `false` cuando debe ocultarse.  
    */
    mensaje$ = this.mensajeSubject.asObservable();

     // Nuevo Subject para notificar que se debe marcar el formulario
    private tocarFormularioSubject = new Subject<void>();
    tocarFormulario$ = this.tocarFormularioSubject.asObservable();
    /**
       * **Controla la visualización del mensaje en pantalla**  
       *
       * - Actualiza el estado del mensaje según el valor booleano recibido.  
       * - Emite `true` para mostrar el mensaje, `false` para ocultarlo.  
       * - Notifica a todos los componentes suscritos sobre el cambio.  
       *
       * @param {boolean} valor - Estado deseado del mensaje (true: mostrar, false: ocultar).  
       */
    mostrarMensaje(valor: boolean): void {
        this.mensajeSubject.next(valor);
    }

      // Método para notificar al hijo que debe marcar el formulario
  marcarFormulario(): void {
    this.tocarFormularioSubject.next();
  }
}