import { DatosDomicilioLegalState } from '../estados/stores/datos-domicilio-legal.store';
import { DatosSolicitudState } from '../estados/stores/datos-de-la-solicitud-modificacion.store';
import { PermisoImportacionBiologicaState } from '../estados//permiso-importacion-biologica.store';
import { SolicitudState } from '../estados/stores/aviso-calidad.store';

/**
 * @interface EstadoCombinado
 * @description
 * Representa el estado combinado de la solicitud y el permiso de importación biológica.
 * Incluye los estados relacionados con la solicitud y el permiso.
 */
export interface EstadoCombinado {
    /**
     * Estado relacionado con la solicitud.
     */
    datosSolicitudState: DatosSolicitudState;
    /**
     * Estado relacionado con el permiso de importación biológica.
     */
    permisoImportacionBiologicaState: PermisoImportacionBiologicaState;

    /**
     * Estado relacionado con los datos del domicilio legal.
     */
    datosDomicilioLegalState: DatosDomicilioLegalState;
    /**
     * Estado relacionado con la solicitud de aviso de calidad.
     */
    solicitudState: SolicitudState;
}
