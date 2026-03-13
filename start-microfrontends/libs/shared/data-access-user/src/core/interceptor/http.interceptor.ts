import {
  EnvironmentInjector,
  inject,
  runInInjectionContext
} from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';
import { LoginStore } from '../estados/login.store';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificacionesService } from '../services/shared/notificaciones.service';


/**
 * @var {number} solicitudesActivas
 * @description
 * Contador global de solicitudes HTTP activas. Se incrementa al iniciar una petición y se decrementa al finalizarla (éxito o error).
 * El spinner de carga se muestra cuando hay al menos una solicitud activa y se oculta cuando no quedan solicitudes pendientes.
 */
let solicitudesActivas = 0;
/**
 * Interceptor HTTP que añade un token de autorización a todas las solicitudes salientes
 * y maneja errores que puedan ocurrir durante la comunicación HTTP.
 *
 * @param req - La solicitud HTTP original.
 * @param next - El siguiente manejador en la cadena de interceptores.
 * @returns Una solicitud HTTP modificada con el encabezado de autorización y manejo de errores.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const httpInterceptorFn: HttpInterceptorFn = (req, next) => {

  /**
   * Injector de entorno utilizado para crear un nuevo contexto de inyección
   * fuera del ciclo de vida típico de un componente o servicio.
   */
  const INJECTOR = inject(EnvironmentInjector);
  /**
   * @const {NgxSpinnerService} SPINNER
   * @description
   * Instancia del servicio NgxSpinnerService, utilizada para mostrar y ocultar el spinner de carga global.
   * El spinner se activa cuando hay solicitudes HTTP en curso y se desactiva cuando todas han finalizado.
   */
  const SPINNER = inject(NgxSpinnerService);
  /**
   * @property {LoginStore} LOGIN_STORE
   * @description
   * Instancia del store de autenticación, utilizada para gestionar el estado de inicio de sesión del usuario.
   * Permite acceder y modificar la información relacionada con la sesión actual.
   */
  const LOGIN_STORE = inject(LoginStore);

  /**
   * Ejecuta una función dentro del contexto de inyección proporcionado por `INJECTOR`.
   * Esto permite inyectar dependencias como servicios, incluso fuera del contexto típico de Angular.
   */
  return runInInjectionContext(INJECTOR, () => {
    /**
     * Servicio responsable de mostrar notificaciones en la aplicación.
     * Puede utilizarse para mostrar mensajes tras interceptar una solicitud.
     */
    const NOTIF = inject(NotificacionesService);
    /**
     * Lógica específica para la solicitud de guardado.
     *
     * Si la URL de la petición termina en "/solicitud/guardar",
     * se agrega el campo `rol_capturista` al objeto `solicitante` en el cuerpo de la solicitud.
     * Este valor se obtiene del estado actual de autenticación (`LoginStore`).
     * La solicitud se clona con el nuevo cuerpo y se envía al siguiente manejador.
     *
     * @param req - La solicitud HTTP original.
     * @returns La solicitud modificada con el campo adicional en el cuerpo.
     */
    if (req.url.endsWith("/solicitud/guardar")) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const BODY: any = req.body || {};
      const NEWBODY = {
        ...BODY,
        solicitante: {
          ...BODY.solicitante,
          rol_capturista: LOGIN_STORE.getValue().rolCapturista
        }
      };
      const REQ = req.clone({
        body: NEWBODY
      });

      return next(REQ);
    }

    /**
     * Clona la solicitud HTTP original y le agrega un encabezado `Authorization`
     * con un token de autenticación. El token puede obtenerse desde localStorage o sessionStorage.
     */
    const REQ = req.clone({
      setHeaders: {
        Authorization: 'Bearer dummy-token' // El token se obtiene desde localStorage o sessionStorage.
      }
    });
    /**
     * Incrementa el contador de solicitudes activas. Si es la primera solicitud activa,
     * muestra el spinner de carga global para indicar que hay procesos en curso.
     */
    solicitudesActivas++;
    if (solicitudesActivas === 1) {
      SPINNER.show('spinner', {
        type: 'ball-clip-rotate',
        size: 'large',
        color: '#cf5374',
      });
    }

    return next(REQ).pipe(
      catchError((error) => {
        // Note : reemplazar con el objeto necesario para modificar el cuadro de diálogo de mensaje de error
        NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: '"Ocurrió un error."',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });

        // Re-lanza el error para que otras partes de la aplicación también puedan manejarlo
        return throwError(() => error);
      }),
      finalize(() => {
        /**
         * Decrementa el contador de solicitudes activas al finalizar una petición (éxito o error).
         * Si no quedan solicitudes pendientes, oculta el spinner de carga global después de 1 segundo.
         * El retraso permite evitar parpadeos si llegan respuestas muy rápidas de forma consecutiva.
         */
        solicitudesActivas--;
        setTimeout(() => {
          if (solicitudesActivas === 0) {
            SPINNER.hide('spinner');
          }
        }, 1000);
      })
    );
  });

};
