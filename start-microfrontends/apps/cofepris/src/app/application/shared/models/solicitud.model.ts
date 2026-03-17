import {DatosDomicilioLegalState} from '../../shared/estados/stores/datos-domicilio-legal.store';
import { SolicitudState } from '../estados/stores/aviso-calidad.store';


/**
 * @description
 * Representa el estado combinado de la solicitud y los datos de domicilio legal.
 *
 * @interface CombinedState
 * @property {SolicitudState} solicitudState - Estado relacionado con la solicitud.
 * @property {DatosDomicilioLegalState} datosDomicilioLegalState - Estado relacionado con los datos del domicilio legal.
 *
 * @compodoc
 * @description
 * Modelo que agrupa el estado de la solicitud y el estado de los datos de domicilio legal.
 */
export interface EstadoCombinado {

    /**
     * Estado relacionado con la solicitud.
     */
    solicitudState: SolicitudState;
    /**
     * Estado relacionado con los datos del domicilio legal.
     */
    datosDomicilioLegalState: DatosDomicilioLegalState;
}
