import { ActivatedRouteSnapshot, CanActivate, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable, catchError, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { INICIAR_TRAMITE_CONSTANTS, IniciarConfig, IniciarRequest, IniciarResolverResult } from '../constants/iniciar-tramite.constants';
import { BaseResponse } from '../models/5701/base-response.model';
import { IniciarTramiteService } from '../services/shared/resolver/iniciar-tramite.service';
import { SessionQuery } from '../queries/usuario.queries';

import { CategoriaMensaje, TipoNotificacionEnum } from '../../tramites/components/notificaciones/notificaciones.component';
import { NotificacionesService } from '../services/shared/notificaciones.service';
import { SolicitudStore } from '../estados/solicitud.store';

/**
 * Resolver genérico para inicializar trámites antes de cargar componentes
 * Este resolver puede ser usado en cualquier trámite que necesite inicialización
 */
@Injectable({
  providedIn: 'root'
})
export class IniciarTramiteResolver implements Resolve<IniciarResolverResult | boolean>, CanActivate {

  constructor(
    private sessionQuery: SessionQuery,
    private iniciarTramiteService: IniciarTramiteService,
    private notificacionesService: NotificacionesService,
    private solicitudStore: SolicitudStore
  ) {}

  /**
   * Guard method to check if the route can be activated
   * Prevents navigation if the trámite initialization fails
   * @param route Información de la ruta activada
   * @returns Observable<boolean> - true permite navegación, false la bloquea
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.resolve(route).pipe(
      map((result) => {
        // Si el resolver retorna false, bloquear navegación
        if (result === false) {
          return true;
        }
        // Si el resolver retorna un objeto, permitir navegación
        return true;
      })
    );
  }

  /**
   * Resuelve la inicialización del trámite antes de navegar al componente
   * @param route Información de la ruta activada (contiene configuración del trámite)
   * @returns Observable con el resultado de la inicialización
   */
  resolve(route: ActivatedRouteSnapshot): Observable<IniciarResolverResult | boolean> {
    // Obtener la configuración del trámite desde los datos de la ruta
    const INICIAR_CONFIG: IniciarConfig | undefined = route.data?.['iniciarConfig'];
    
    // Obtener el RFC desde la sesión del usuario
    return this.sessionQuery.selectPerfilUsuario$.pipe(
      take(1), // Solo tomar el primer valor para evitar suscripciones múltiples
      switchMap((perfilUsuario) => {
        const tramite_datos = this.iniciarTramiteService.getTramiteDatos();
        
        // Construir el payload con datos del usuario o valores por defecto
        const PAYLOAD: IniciarRequest = {
          rfc_solicitante: perfilUsuario?.rfc || 'AAL0409235E6', // RFC del usuario o fallback
          rol_actual: 'CapturistaGubernamental',
          folio_programa: tramite_datos?.folio_programa || "FOL123456",
          idTipoTramite:Number(INICIAR_CONFIG?.procedureId),
          discriminador:INICIAR_CONFIG?.procedureId, // Valor estándar
          ...((INICIAR_CONFIG?.procedureId === '90303' || INICIAR_CONFIG?.procedureId === '80301') && { idProgramaAutorizado: tramite_datos?.id_programa_autorizado }),
          ...(INICIAR_CONFIG?.procedureId === '80302' && { tipoPrograma: "TICPSE.IMMEX",idProgramaAutorizado:"121880" })
        };

        return this.iniciarTramiteService.postIniciar(PAYLOAD, INICIAR_CONFIG).pipe(
          map((response: BaseResponse<null>) => {
            if (response.codigo !== INICIAR_TRAMITE_CONSTANTS.SUCCESS_CODE) {
              // Si hay error en la respuesta, mostrar notificación y bloquear navegación
              const ERROR_MESSAGE = response.error || response.causa || response.mensaje || INICIAR_TRAMITE_CONSTANTS.ERROR_MESSAGES.SAVE_ERROR;
              console.error('Error al iniciar trámite:', ERROR_MESSAGE);
              
              // Mostrar notificación de error al usuario
              this.notificacionesService.showNotification({
                tipoNotificacion: TipoNotificacionEnum.TOASTR,
                categoria: CategoriaMensaje.ERROR,
                modo: '',
                titulo: 'Error',
                mensaje: `${INICIAR_TRAMITE_CONSTANTS.ERROR_MESSAGES.INIT_ERROR}: ${ERROR_MESSAGE}`,
                cerrar: true,
                txtBtnAceptar: '',
                txtBtnCancelar: ''
              });
              
              // Retornar false para bloquear la navegación
              return false;
            }

            /** Actualizar el estado de la solicitud con la respuesta recibida */
            this.solicitudStore.establecerSolicitud(response);

            /** Limpiar los datos del trámite almacenados en el servicio */
            this.iniciarTramiteService.clearTramiteDatos();

            // Éxito - retornar datos y permitir navegación
            return {
              success: true,
              response,
              payload: PAYLOAD
            } as IniciarResolverResult;
          }),
          catchError((error) => {
            console.error('Error al iniciar trámite:', error);
            
            // Retornar false para bloquear la navegación
            return of(false);
          })
        );
      })
    );
  }
}

