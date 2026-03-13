import { GenerarDictamen26050Config } from '../models/generar-dictamen-26050-config.model';
import { Injectable } from '@angular/core';
import { ModeloConfig } from '../models/service-config.model';
import { RequerimientoConfig } from '../models/requerimiento-config.model';


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
   * Configuración de modelos por trámite.
   * 
   * Cada entrada indica si se debe actualizar el modelo para un trámite específico.
   * La clave es el `tramiteId` y el valor indica la propiedad `actualiarModelo`.
   */
  private generarDictamen26050Config: Record<number, GenerarDictamen26050Config> = {
    260501: { isPaisFabrica: true, isPaisElabora: true, isFechaFinVigencia: true },
    260502: { isPaisFabrica: true, isPaisElabora: false, isFechaFinVigencia: false },
    260503: { isPaisFabrica: true, isPaisElabora: false, isFechaFinVigencia: false },
    260504: { isPaisFabrica: true, isPaisElabora: true, isFechaFinVigencia: true },
    260505: { isPaisFabrica: true, isPaisElabora: false, isFechaFinVigencia: false },
    260507: { isPaisFabrica: true, isPaisElabora: false, isFechaFinVigencia: true },
    260508: { isPaisFabrica: true, isPaisElabora: false, isFechaFinVigencia: true },
    260509: { isPaisFabrica: true, isPaisElabora: false, isFechaFinVigencia: true },
    260510: { isPaisFabrica: true, isPaisElabora: false, isFechaFinVigencia: true },
    260511: { isPaisFabrica: true, isPaisElabora: false, isFechaFinVigencia: true },
  };

  /**
   * Configuración de modelos por trámite.
   * 
   * Cada entrada indica si se debe actualizar el modelo para un trámite específico.
   * La clave es el `tramiteId` y el valor indica la propiedad `actualiarModelo`.
   */
  private generarDictamenAutorizar26050Config: Record<number, GenerarDictamen26050Config> = {
    260503: { isPaisFabrica: true, isPaisElabora: false, isFechaFinVigencia: false, isAsignarAutorizador: false },
  };

  /**
 * Obtiene la configuración de servicios para un trámite.
 * 
 * @param tramiteId Identificador del trámite
 * @returns La configuración del modelo asociada al trámite.
 */
  getGenerarDictamen26050Config(tramiteId: number): GenerarDictamen26050Config {
    if (tramiteId === 260503) {
       return this.generarDictamenAutorizar26050Config[tramiteId];
    }
    return this.generarDictamen26050Config[tramiteId];
  }

  /**
   * Configuración de modelos por trámite.
   * 
   * Cada entrada indica si se debe actualizar el modelo para un trámite específico.
   * La clave es el `tramiteId` y el valor indica la propiedad `actualiarModelo`.
   */
  private actualizarModeloConfig: Record<number, ModeloConfig> = {
    260201: { actualizarModelo: false},
    260203: { actualizarModelo: false},
    260501: { actualizarModelo: false},
    260502: { actualizarModelo: false},
    260503: { actualizarModelo: false},
    260207: { actualizarModelo: false},
    260209: { actualizarModelo: false},
    260215: { actualizarModelo: false},
    260205: { actualizarModelo: false},
    260206: { actualizarModelo: false},
    260216: { actualizarModelo: false},
    260214: { actualizarModelo: false},
    260217: { actualizarModelo: false},
    260210: { actualizarModelo: false},
    260208: { actualizarModelo: false},
    260213: { actualizarModelo: false},
    260212: { actualizarModelo: false},
    260218: { actualizarModelo: false},
    260204: { actualizarModelo: false},
    260202: { actualizarModelo: false},
    260512: { actualizarModelo: false},
    260513: { actualizarModelo: false},
    260514: { actualizarModelo: false},
    260515: { actualizarModelo: false},
    260516: { actualizarModelo: false},
    260603: { actualizarModelo: false},
    260601: { actualizarModelo: false},
    260604: { actualizarModelo: false},
    260504: { actualizarModelo: false},
    260505: { actualizarModelo: false},
    260507: { actualizarModelo: false},
    260401: { actualizarModelo: false},
    260402: { actualizarModelo: false},
    260508: { actualizarModelo: false},
    260509: { actualizarModelo: false},
    260510: { actualizarModelo: false},
    260511: { actualizarModelo: false},
    260902: { actualizarModelo: false},
    260903: { actualizarModelo: false},
    260904: { actualizarModelo: false},
    260905: { actualizarModelo: false},
    260910: { actualizarModelo: false},
    260917: { actualizarModelo: false},
    260918: { actualizarModelo: false},
    260301: { actualizarModelo: false},
    260302: { actualizarModelo: false},
    260303: { actualizarModelo: false},
    260304: { actualizarModelo: false},
    261701: { actualizarModelo: false},
    261702: { actualizarModelo: false}

    
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
   * Configuración de requerimientos por trámite.
   * 
   * La clave corresponde al `tramiteId`.
   */
  private requerimientoConfig: Record<number, RequerimientoConfig> = {
    260201: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260203: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260501: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260205: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260206: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260214: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260216: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260217: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260208: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260210: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260213: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260207: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260209: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260215: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260212: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260204: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260218: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260202: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260512: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260513: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260514: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260502: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260503: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260401: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: false, isMotivo: true, isSiglasParticipanteExterno: true },
    260402: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: false, isMotivo: true, isSiglasParticipanteExterno: true },
    260515: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260516: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260603: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: false, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: false, isMotivo: true, isSiglasParticipanteExterno: true },
    260604: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: false, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: false, isMotivo:false, isSiglasParticipanteExterno:false },
    260504: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260505: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260507: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260902: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260903: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260904: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260905: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260910: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260917: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260918: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260508: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260509: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260510: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260511: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260301: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260302: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260304: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    260303: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true },
    261701: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: false, isBodyNullDocumentos: false, isFundamento: false, isAsignarAutorizador: false, isMotivo: false, isSiglasParticipanteExterno: false},
    261702: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: false, isBodyNullDocumentos: false, isFundamento: false, isAsignarAutorizador: false, isMotivo: false, isSiglasParticipanteExterno: false},
    260102: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true},
    260103: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true},
    260104: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: true, isAsignarAutorizador: true, isMotivo: true, isSiglasParticipanteExterno: true},
    260601: { isTipoRequerimiento: true, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true, isBodyNullDocumentos: true, isFundamento: false, isAsignarAutorizador: false, isMotivo:false, isSiglasParticipanteExterno:false },
  
    // 110101: { isTipoRequerimiento: false, isAreaSolicitante: false, isJustificacionRequerimiento: true, isSegundaTabla: true },
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