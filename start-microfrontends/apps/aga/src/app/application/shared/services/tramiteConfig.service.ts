import { Injectable } from '@angular/core';

import { ModeloConfig, ServiceConfig } from '../models/service-config.model';
import { RequerimientoConfig } from '../models/requerimiento-config.model';
import { TramiteConfig } from '../models/tramite-config.model';
import { ValidacionDocumentosRequerimiento } from '../models/validacion-documentos-requerimiento';


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
    5701: { habilitarFechas: false, isAntecedentes: false, anexo222se: false },
    130120: { habilitarFechas: true, isAntecedentes: true, anexo222se: true },
    120301: { habilitarFechas: false, isAntecedentes: false, anexo222se: false },
    110101: { habilitarFechas: false, isAntecedentes: false, anexo222se: false, descargaSolicitud: true },
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
    5701: { serviceCriterios: true },
    120301: { serviceCriterios: false },
    110101: { serviceCriterios: false },
    130120: { serviceCriterios: true },
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
    5701: { actualizarModelo: false, actualizarVista: false },
    120301: { actualizarModelo: false, actualizarVista: false },
    110101: { actualizarModelo: true, actualizarVista: true },
    130120: { actualizarModelo: false, actualizarVista: false },
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
    130118: { habilitarFechas: true, isAntecedentes: false, anexo222se: true },
    130120: { habilitarFechas: true, isAntecedentes: false, anexo222se: true },
    120301: { habilitarFechas: false, isAntecedentes: false, anexo222se: false },
    110101: { habilitarFechas: false, isAntecedentes: false, anexo222se: false, descargaSolicitud: true },
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
    130120: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: false },
    130118: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true },
    110101: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true },
    5701: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true },
  };

  /** * Obtiene la configuración de requerimientos para un trámite.
   * 
   * @param tramiteId Identificador del trámite
   * @returns Configuración de requerimientos del trámite correspondiente
   */
  getRequerimientoConfig(tramiteId: number): RequerimientoConfig {
    return this.requerimientoConfig[tramiteId];
  }

  /** 
   * Configuración de validación de documentos por trámite.
   * 
   * La clave corresponde al `tramiteId`.
   */
  private validacionDocumentosRequerimientos: Record<number, ValidacionDocumentosRequerimiento> = {
    5701: { TablaDocumentosRequeridos: true, TablaDocumentosAdicionales: false }    
  };

  /** 
   * Obtiene la configuración de requerimientos para un trámite.
   * 
   * @param tramiteId Identificador del trámite
   * @returns Configuración de requerimientos del trámite correspondiente
   */
  getValidacionDocuemntosRequerimientos(tramiteId: number): ValidacionDocumentosRequerimiento {
    return this.validacionDocumentosRequerimientos[tramiteId] ?? {
      TablaDocumentosRequeridos: false,
      TablaDocumentosAdicionales: false
    };
  }
}
