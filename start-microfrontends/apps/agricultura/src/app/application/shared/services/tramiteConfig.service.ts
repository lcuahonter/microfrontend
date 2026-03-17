import { Injectable } from '@angular/core';

import { ModeloConfig, ServiceConfig } from '../models/service-config.model';
import { RequerimientoConfig } from '../models/requerimiento-config.model';
import { TramiteConfig } from '../models/tramite-config.model';


@Injectable({
  providedIn: 'root'
})

/**
 * Servicio que centraliza la configuración por trámite.
 * 
 * Permite obtener tanto la configuración de la UI como la de servicios
 * en base al identificador del trámite (`tramiteId`).
 */
export class TramiteConfigService {

  /**
   * Configuración de interfaz de usuario por trámite.
   * 
   * La clave corresponde al `tramiteId`.
   */
  private configs: Record<number, TramiteConfig> = {
    220202: { habilitarFechas: false, isAntecedentes: false, anexo222se: false, descargaSolicitud: true},
    220201: { habilitarFechas: false, isAntecedentes: false, anexo222se: false, descargaSolicitud: false},
    220203: { habilitarFechas: false, isAntecedentes: false, anexo222se: false, descargaSolicitud: true }

  };

  /**
   * Obtiene la configuración de interfaz de usuario para un trámite.
   * 
   * @param tramiteId Identificador del trámite
   * @returns Configuración de UI del trámite correspondiente
   */
  getConfig(tramiteId: number): TramiteConfig {
    return this.configs[tramiteId];
  }

  /**
   * Configuración de servicios por trámite.
   * 
   * La clave corresponde al `tramiteId`.
   */
  private serviceConfig: Record<number, ServiceConfig> = {
    220201: { serviceCriterios: true },
    220202: { serviceCriterios: true },
    220203: { serviceCriterios: true }

  }

  /**
  * Obtiene la configuración de servicios para un trámite.
  * 
  * @param tramiteId Identificador del trámite
  * @returns Configuración de servicios del trámite correspondiente
  */
  getServiceConfig(tramiteId: number): ServiceConfig {
    return this.serviceConfig[tramiteId];
  }


  /**
   * Configuración de modelos por trámite.
   * 
   * Cada entrada indica si se debe actualizar el modelo para un trámite específico.
   * La clave es el `tramiteId` y el valor indica la propiedad `actualiarModelo`.
   */
  private actualizarModeloConfig: Record<number, ModeloConfig> = {
    220201: { actualizarModelo: true, actualizarVista: true },
    220202: { actualizarModelo: true, actualizarVista: true },
    220203: { actualizarModelo: true, actualizarVista: true }

  }

  /**
 * Obtiene la configuración de servicios para un trámite.
 * 
 * @param tramiteId Identificador del trámite
 * @returns La configuración del modelo asociada al trámite.
 */
  getModeloConfig(tramiteId: number): ModeloConfig {
    return this.actualizarModeloConfig[tramiteId];
  }



  /**   
   * Configuración específica para la autorización de dictámenes por trámite.
   * La clave corresponde al `tramiteId`.
   */
  private configsAtorizarDictamen: Record<number, TramiteConfig> = {
    220201: { habilitarFechas: true, isAntecedentes: false, anexo222se: false, descargaSolicitud: true },
    220202: { habilitarFechas: true, isAntecedentes: false, anexo222se: false, descargaSolicitud: false },
    220203: { habilitarFechas: true, isAntecedentes: false, anexo222se: false, descargaSolicitud: false }

  };

  /**   * Obtiene la configuración específica para la autorización de dictámenes de un trámite.
   * 
   * @param tramiteId Identificador del trámite
   * @returns Configuración de autorización de dictámenes del trámite correspondiente
   */
  getConfigAutorizarDictamen(tramiteId: number): TramiteConfig {
    return this.configsAtorizarDictamen[tramiteId];
  }

  /**
   * Configuración de requerimientos por trámite.
   * 
   * La clave corresponde al `tramiteId`.
   */
  private requerimientoConfig: Record<number, RequerimientoConfig> = {
    220201: { isTipoRequerimiento: true, isAreaSolicitante: true, isJustificacionRequerimiento: true, isSegundaTabla: true },
    220202: { isTipoRequerimiento: true, isAreaSolicitante: true, isJustificacionRequerimiento: true, isSegundaTabla: true },
    220203: { isTipoRequerimiento: true, isAreaSolicitante: true, isJustificacionRequerimiento: true, isSegundaTabla: true }
  };

  /** * Obtiene la configuración de requerimientos para un trámite.
   * 
   * @param tramiteId Identificador del trámite
   * @returns Configuración de requerimientos del trámite correspondiente
   */
  getRequerimientoConfig(tramiteId: number): RequerimientoConfig {
    return this.requerimientoConfig[tramiteId];
  }
}
