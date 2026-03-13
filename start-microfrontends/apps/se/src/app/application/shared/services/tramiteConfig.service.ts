import { Injectable } from '@angular/core';

import { ModeloConfig, ServiceConfig } from '../models/service-config.model';
import { AtenderRequerimientoCampos } from '../models/atender-req-campos.model';
import { RequerimientoConfig } from '../models/requerimiento-config.model';
import { TramiteConfig } from '../models/tramite-config.model';
import { ValidacionDocumentosRequerimiento } from '../models/validacion-documentos-requerimiento.model';


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
    130118: { habilitarFechas: true, isAntecedentes: false, anexo222se: true },
    130104: { habilitarFechas: true, isAntecedentes: true, anexo222se: true , isModificarPartidas: true},
    130109: { habilitarFechas: true, isAntecedentes: true, anexo222se: true , isModificarPartidas: true},
    130112: { habilitarFechas: true, isAntecedentes: true, anexo222se: true , isModificarPartidas: true},
    130113: { habilitarFechas: true, isAntecedentes: true, anexo222se: true , isModificarPartidas: true},
    130120: { habilitarFechas: true, isAntecedentes: true, anexo222se: true },
    120301: { habilitarFechas: false, isAntecedentes: false, anexo222se: false },
    110101: { habilitarFechas: false, isAntecedentes: false, anexo222se: false, descargaSolicitud: true },
    110102: { habilitarFechas: false, isAntecedentes: false, anexo222se: false, descargaSolicitud: true },
    80101: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, descargaSolicitud: false },
    80105: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, descargaSolicitud: false },
    130107: { habilitarFechas: true, isAntecedentes: true, anexo222se: true , isModificarPartidas: true},
    80104: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, descargaSolicitud: false },
    80103: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, descargaSolicitud: false },
  80102: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, descargaSolicitud: false },
    130103: { habilitarFechas: true, isAntecedentes: true, anexo222se: true , isModificarPartidas: true},
  };

  /**
   * Obtiene la configuración de interfaz de usuario para un trámite.
   * 
   * @param tramiteId Identificador del trámite
   * @returns Configuración de UI del trámite correspondiente
   */
  getConfig(tramiteId: number): TramiteConfig {
    return this.configs[tramiteId] ?? {
      habilitarFechas: false,
      isAntecedentes: false,
      anexo222se: false,
      descargaSolicitud: false,
      isModificarPartidas: false
    };
  }

  /**
   * Configuración de servicios por trámite.
   * 
   * La clave corresponde al `tramiteId`.
   */
  private serviceConfig: Record<number, ServiceConfig> = {
    130118: { serviceCriterios: true },
    120301: { serviceCriterios: false },
    110101: { serviceCriterios: false },
    110102: { serviceCriterios: false },
    130120: { serviceCriterios: true },
    80101: { serviceCriterios: true },
    80104: { serviceCriterios: true },
    80105: { serviceCriterios: true },
    80103: { serviceCriterios: true },
    130104: { serviceCriterios: true },
    130109: { serviceCriterios: true },
    130112: { serviceCriterios: true },
    130113: { serviceCriterios: true },
    130107: { serviceCriterios: true },
  80102: { serviceCriterios: true },
    130103: { serviceCriterios: true },

  }

  /**
  * Obtiene la configuración de servicios para un trámite.
  * 
  * @param tramiteId Identificador del trámite
  * @returns Configuración de servicios del trámite correspondiente
  */
  getServiceConfig(tramiteId: number): ServiceConfig {
    return this.serviceConfig[tramiteId] ?? {
      serviceCriterios: false
    };
  }

  /**
   * Configuración de modelos por trámite.
   * 
   * Cada entrada indica si se debe actualizar el modelo para un trámite específico.
   * La clave es el `tramiteId` y el valor indica la propiedad `actualiarModelo`.
   */
  private actualizarModeloConfig: Record<number, ModeloConfig> = {
    110101: { actualizarModelo: true, actualizarVista: true },
    110102: { actualizarModelo: true, actualizarVista: true },
    80103: { actualizarModelo: true, actualizarVista: false },
    80101: { actualizarModelo: true, actualizarVista: false },
    80104: { actualizarModelo: true, actualizarVista: false },
    80105: { actualizarModelo: true, actualizarVista: false },
  80102: { actualizarModelo: true, actualizarVista: false },
  }

  /**
 * Obtiene la configuración de servicios para un trámite.
 * 
 * @param tramiteId Identificador del trámite
 * @returns La configuración del modelo asociada al trámite.
 */
  getModeloConfig(tramiteId: number): ModeloConfig {
    return this.actualizarModeloConfig[tramiteId] ?? {
      actualizarModelo: false,
      actualizarVista: false
    };
  }

  /**   
   * Configuración específica para la autorización de dictámenes por trámite.
   * La clave corresponde al `tramiteId`.
   */
  private configsAtorizarDictamen: Record<number, TramiteConfig> = {
    130118: { habilitarFechas: true, isAntecedentes: false, anexo222se: true },
    130104: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, isModificarPartidas: true },
    130109: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, isModificarPartidas: true },
    130112: { habilitarFechas: true, isAntecedentes: true, anexo222se: true , isModificarPartidas: true},
    130113: { habilitarFechas: true, isAntecedentes: true, anexo222se: true , isModificarPartidas: true},
    130120: { habilitarFechas: true, isAntecedentes: false, anexo222se: true },
    120301: { habilitarFechas: false, isAntecedentes: false, anexo222se: false },
    110101: { habilitarFechas: false, isAntecedentes: false, anexo222se: false, descargaSolicitud: true, validacionesEspeciales: true },
    110102: { habilitarFechas: false, isAntecedentes: false, anexo222se: false, descargaSolicitud: true, validacionesEspeciales: true },
    80101: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, descargaSolicitud: false, validacionesEspeciales: true },
    80104: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, descargaSolicitud: false, validacionesEspeciales: true },
    80105: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, descargaSolicitud: false, validacionesEspeciales: true },
    130107: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, isModificarPartidas: true },
    80103: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, descargaSolicitud: false, validacionesEspeciales: true },
  80102: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, descargaSolicitud: false, validacionesEspeciales: true },
   130103: { habilitarFechas: true, isAntecedentes: true, anexo222se: true, isModificarPartidas: true },
  };

  /**   * Obtiene la configuración específica para la autorización de dictámenes de un trámite.
   * 
   * @param tramiteId Identificador del trámite
   * @returns Configuración de autorización de dictámenes del trámite correspondiente
   */
  getConfigAutorizarDictamen(tramiteId: number): TramiteConfig {
    return this.configsAtorizarDictamen[tramiteId] ?? {
      habilitarFechas: false,
      isAntecedentes: false,
      anexo222se: false,
      descargaSolicitud: false,
      validacionesEspeciales: false,
      isModificarPartidas: false
    };
  }

  /**
   * Configuración de requerimientos por trámite.
   * 
   * La clave corresponde al `tramiteId`.
   */
  private requerimientoConfig: Record<number, RequerimientoConfig> = {
    130120: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: false },
    130118: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: false },
    110101: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true },
    110102: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true },
    80101: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: false },
    80104: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: false },
    80105: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: false },
    80103: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: false },
    130104: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true },
    130109: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true },
    130112: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true },
    130113: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true },
    130107: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true },
  80102: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: false },
   130103: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true },
  };

  /** * Obtiene la configuración de requerimientos para un trámite.
   * 
   * @param tramiteId Identificador del trámite
   * @returns Configuración de requerimientos del trámite correspondiente
   */
  getRequerimientoConfig(tramiteId: number): RequerimientoConfig {
    return this.requerimientoConfig[tramiteId] ?? {
      isTipoRequerimiento: false,
      isAreaSolicitante: false,
      isJustificacionRequerimiento: false,
      isSegundaTabla: false
    };
  }

  /** 
   * Configuración de validación de documentos por trámite.
   * 
   * La clave corresponde al `tramiteId`.
   */
  private validacionDocumentosRequerimientos: Record<number, ValidacionDocumentosRequerimiento> = {
    130120: { TablaDocumentosRequeridos: true, TablaDocumentosAdicionales: false },
    130118: { TablaDocumentosRequeridos: true, TablaDocumentosAdicionales: false },
    110101: { TablaDocumentosRequeridos: false, TablaDocumentosAdicionales: true },
  };

  /** * Obtiene la configuración de requerimientos para un trámite.
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

  /** 
   * Configuración de atención de requerimientos por campo por trámite.
   * 
   * La clave corresponde al `tramiteId`.
   */
  private atenderRequerimientoCampos: Record<number, AtenderRequerimientoCampos> = {
    130109: { isAtencionRequerimientoCampo: true },
    130120: { isAtencionRequerimientoCampo: true },
    130118: { isAtencionRequerimientoCampo: false },
    130107: { isAtencionRequerimientoCampo: true },
    130113: { isAtencionRequerimientoCampo: true },
  };

  /**
   * Obtiene la configuración de atención de requerimientos por campo para un trámite.
   * @param tramiteId tramite Identificador del trámite
   * @returns 
   */
  getAtenderRequerimientoCampos(tramiteId: number): AtenderRequerimientoCampos {
    return this.atenderRequerimientoCampos[tramiteId] ?? {
      isAtencionRequerimientoCampo: false
    };
  }
}