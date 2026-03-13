
import { API_ALCANCE_REQUERIMIENTO_ENUM, API_ASIGNAR_AUTORIZADOR, API_CLASIFICACION_TOXICOLOGICA, API_ENUMERACION_INF_REQUERIMIENTO, API_FUNDAMENTO_DE_REQUERIMIENTO, API_GET_DESTINADO_PARA, API_GET_ENUMERACION, API_MOTIVO_DEL_REQUERIMIENTO, API_MOTIVO_DE_RECHAZO, API_MOTIVO_DE_RECHAZO_REQ_PARAM, API_OBSERVACIONES, API_PAIS_BLOQUES, API_PLAZO, API_RESTRICCIONES, API_TIPO_DE_DOCUMENTO,API_FUNDAMENTO_DE_OFICIO_DICTAMEN,API_FUNDAMENTO_NEGATIVO_DICTAMEN, API_AREA, API_FUNDAMENTO_DEL_DICTAMEN, API_FUNDAMENTO_OFICIO_DICTAMEN } from '../../../servers/consulta-api-router';
import { BaseResponse } from '../../../models/shared/base-response.model';
import { Catalogo } from '../../../models/shared/catalogos.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CveEnumeracionConfig {
  cveEnumeracion: string;
  ideTipoMotivo: string;
  motivoDelOficio:string;
  motivoDeRechazo?:string;
}

@Injectable({
    providedIn: 'root'
})
export class ConsultaCatalogoService {
   
  /**
    * URL del servidor donde se encuentra la API.
    */
  private readonly host: string;

  /**
   * Constructor del servicio IniciarService.
   * @param http - Cliente HTTP para realizar solicitudes al servidor.
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }
  private catalogoParameterConfig: Record<string, CveEnumeracionConfig> = {
    260203: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.DP', motivoDelOficio:'TIMTTR.DP' },
    260201: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260202: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260204: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260205: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260206: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260213: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260218: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.DP', motivoDelOficio:'TIMTTR.DP' },
    260212: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.DP', motivoDelOficio:'TIMTTR.DP' },
    260216: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260207: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260209: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260214: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260215: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260208: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },    
    260512: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260513: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260514: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260501: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.RI', motivoDeRechazo:'TIMTTR.DP' },
    260502: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.RI', motivoDeRechazo:'TIMTTR.DP' },
    260503: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.RI', motivoDeRechazo:'TIMTTR.DP' },
    260504: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.RI', motivoDeRechazo:'TIMTTR.DP' },
    260505: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.RI', motivoDeRechazo:'TIMTTR.DP' },
    260506: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.RI', motivoDeRechazo:'TIMTTR.DP' },
    260507: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.RI', motivoDeRechazo:'TIMTTR.DP' },
    260508: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.RI', motivoDeRechazo:'TIMTTR.DP' },
    260509: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.RI', motivoDeRechazo:'TIMTTR.DP' },
    260510: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.RI', motivoDeRechazo:'TIMTTR.DP' },
    260511: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.RI', motivoDeRechazo:'TIMTTR.DP' },
    260902: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260903: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260904: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260910: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260905: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260917: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260918: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260301: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260302: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260303: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260304: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260401: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    260402: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    // 260208: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },    
    // 260216: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    // 260207: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    // 260209: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    // 260215: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.RI', motivoDelOficio:'TIMTTR.DP' },
    // 260513: { cveEnumeracion: 'ENU_USO_AUTORIZADO_DICT', ideTipoMotivo: 'TIMTTR.DP', motivoDelOficio:'TIMTTR.DP' },


  }

  getCatalogoParameterConfig(tramiteId: number): CveEnumeracionConfig {
    return this.catalogoParameterConfig[tramiteId];
  }

  
  /* catalogos */
  getDestinadoPara(tramite: number, cve_enumeracion_h: string = 'ENU_USO_AUTORIZADO_DICT'): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_GET_DESTINADO_PARA(tramite.toString(), cve_enumeracion_h);
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  getRestricciones(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_RESTRICCIONES(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  getObservaciones(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_OBSERVACIONES(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  getPlazo(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_PLAZO(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  getAsignarAutorizador(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_ASIGNAR_AUTORIZADOR(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  getPaisBloques(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_PAIS_BLOQUES(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  getMotivoDeRechazo(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_MOTIVO_DE_RECHAZO(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  getMotivoDeRechazoReqParam(tramite: number, motivoReqParam: string): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_MOTIVO_DE_RECHAZO_REQ_PARAM(tramite.toString(), motivoReqParam);
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  // getMotivoDelOficio(tramite: number, ideTipoMotivo: string = 'TIMTTR.DP'): Observable<BaseResponse<Catalogo[]>>{
  //   const ENDPOINT = `${this.host}` + API_MOTIVO_DEL_OFICIO(tramite.toString(), ideTipoMotivo);
  //   return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  // }

  getAlcanceRequerimiento(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_RESTRICCIONES(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  getFundamentoDelRequerimiento(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_FUNDAMENTO_DE_REQUERIMIENTO(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  getMotivoDelRequerimiento(tramite: number, motivoReqParam: string): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_MOTIVO_DEL_REQUERIMIENTO(tramite.toString(), motivoReqParam);
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }
  
  getEnumeracion(tramite: number, cveEnumeracionH: string): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_GET_ENUMERACION(tramite.toString(), cveEnumeracionH);
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }
  
  getTipoDeDocumento(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_TIPO_DE_DOCUMENTO(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

   getEnumeracionEnum(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_ALCANCE_REQUERIMIENTO_ENUM(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de tipos de requerimiento 2604 para un trámite específico.
   *
   * @param tramite - Identificador numérico del trámite para el cual se solicita el catálogo.
   * @returns Un observable que emite la respuesta base con el arreglo de elementos del catálogo.
   */
  getTipoRequiremento2604(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_ENUMERACION_INF_REQUERIMIENTO(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de clasificación toxicológica para un trámite específico.
   * @param tramite - Identificador numérico del trámite para el cual se solicita el catálogo.
   * @returns Un observable que emite la respuesta base con el arreglo de elementos del catálogo.
   */
  getClasificacionToxicologica(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_CLASIFICACION_TOXICOLOGICA(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  getFundamentoDeOficioDictamen(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_FUNDAMENTO_DE_OFICIO_DICTAMEN(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  getFundamentoNegativoDictamen(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_FUNDAMENTO_NEGATIVO_DICTAMEN(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }
    getArea(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_AREA(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
 * Obtiene el catálogo de fundamentos del dictamen según el trámite.
 * Realiza una petición HTTP GET al servicio correspondiente.
 */
  getFundamentoDelDictamen(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_FUNDAMENTO_DEL_DICTAMEN(tramite.toString());
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  } 

/**
 * Obtiene el catálogo de fundamentos del oficio de dictamen según el trámite.
 * Realiza una petición HTTP GET al servicio correspondiente.
 */
  getFundamentoOficioDictamen(tramite: number): Observable<BaseResponse<Catalogo[]>>{
    const ENDPOINT = `${this.host}` + API_FUNDAMENTO_OFICIO_DICTAMEN(tramite.toString());
  return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  } 
}