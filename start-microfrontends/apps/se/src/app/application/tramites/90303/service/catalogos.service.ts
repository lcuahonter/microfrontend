import { HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { ListaSectoresRespuesta, ListaSectoresTabla, PlantasRespuesta } from '../models/registro.model';
import {
  Mercancias,
  PlantasTabla,
  ProductorIndirecto,
  SectorTabla,
} from '../../../shared/models/complementaria.model';
import {
  Solicitud90303State,
  Tramite90303Store,
} from '../state/Tramite90303.store';
import { Bitacora } from '../../../shared/models/bitacora.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONRespuesta } from '../../../shared/models/shared803.model';
import { Observable } from 'rxjs';
import { PROC_90303 } from '../servers/api-route';
import { ProgramaLista } from '../../../shared/models/lista-programa.model';
import { Tramite90303Query } from '../state/Tramite90303.query';

/**
 * Servicio para gestionar la obtención de datos de catálogos.
 * Este servicio realiza solicitudes HTTP para obtener datos de diferentes tablas relacionadas con el trámite.
 */
@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes a los recursos.
   * @param httpService Servicio HTTP personalizado para manejar solicitudes específicas.
   * @param tramite90303Store Store para manejar el estado del trámite 90303.
   * @param tramite90303Query Query para obtener datos del estado del trámite 90303.
   */
  constructor(
    private http: HttpClient,
    private httpService: HttpCoreService,
    private tramite90303Store: Tramite90303Store,
    private tramite90303Query: Tramite90303Query
  ) {}
  /**
   * Actualiza el estado del formulario 90303 en el store, usando los datos de modificación actuales.
   *
   * @param DATOS - Objeto con los valores actualizados del formulario de modificación.
   */
  actualizarEstadoFormulario(DATOS: Solicitud90303State): void {
    this.tramite90303Store.update(DATOS);
  }

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   * @returns Observable con los datos del formulario.
   */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_90303.MOSTRAR(id));
  }

  /**
   * Obtiene la lista de sectores desde la API.
   *
   * @param payload Datos necesarios para obtener la lista de sectores.
   * @returns {Observable<JSONRespuesta<ListaSectoresTabla[]>>} Observable con la lista de sectores.
   */
  obtenerListaSectores(payload: ListaSectoresRespuesta): Observable<JSONRespuesta<ListaSectoresTabla[]>> {
    return this.httpService
      .post<JSONRespuesta<ListaSectoresTabla[]>>(
        PROC_90303.LISTA_SECTORES,
        {
          body: payload,
        }
      );
  }

  /**
   * Busca el ID de la solicitud basado en el payload proporcionado.
   *
   * @param payload Datos necesarios para buscar el ID de la solicitud.
   * @returns {Observable<JSONRespuesta<{ buscaIdSolicitud: string }>>} Observable con el ID de la solicitud.
   */
  buscarIdSolicitud(payload: {
    idPrograma: string;
    tipoPrograma: string;
  }): Observable<JSONRespuesta<{ buscaIdSolicitud: string }>> {
    return this.httpService.post<JSONRespuesta<{ buscaIdSolicitud: string }>>(
      PROC_90303.BUSCAR_ID_SOLICITUD,
      {
        body: payload,
      }
    );
  }

  /**
   * Obtiene los datos de la tabla de plantas.
   * @returns Un observable con la lista de plantas.
   */
  obtenerTablaPlantas(payload: PlantasRespuesta): Observable<JSONRespuesta<PlantasTabla[]>> {
    return this.httpService.post<JSONRespuesta<PlantasTabla[]>>(
     PROC_90303.PLANTAS,
     {
       body: payload,
     }
    );
  }

  /**
   * Obtiene los datos de la tabla de sectores.
   * @returns Un observable con la lista de sectores.
   */
  obtenerTablaSector(buscarIdSolicitud: string): Observable<JSONRespuesta<SectorTabla[]>> {
    return this.httpService.get<JSONRespuesta<SectorTabla[]>>(
      `${PROC_90303.SECTOR}${buscarIdSolicitud}`
    );
  }

  /**
   * Obtiene los datos de la tabla de mercancías.
   * @returns Un observable con la lista de mercancías.
   */
  obtenerTablaMercancia(payload: {
    idSolicitud: string;
    fechaProsec: number;
  }): Observable<JSONRespuesta<Mercancias[]>> {
    return this.httpService.post<JSONRespuesta<Mercancias[]>>(
      PROC_90303.MERCANCIA_PRODUCIR,
      {
        body: payload,
      }
    );
  }

  /**
   * Obtiene los datos de la tabla de productores indirectos.
   * @returns Un observable con la lista de productores indirectos.
   */

  obtenerTablaProductor(payload: {
    idSolicitud: string;
    fechaProsec: number;
  }): Observable<JSONRespuesta<ProductorIndirecto[]>> {
    return this.httpService.post<JSONRespuesta<ProductorIndirecto[]>>(
      PROC_90303.PRODUCTOR_INDIRECTO,
      {
        body: payload,
      }
    );
  }

  /**
   * Obtiene los datos de la tabla de bitácoras.
   * @returns Un observable con la lista de bitácoras.
   */
  obtenerTablaBitacora(idPrograma: string): Observable<JSONRespuesta<Bitacora[]>> {
    return this.httpService.get<JSONRespuesta<Bitacora[]>>(
      PROC_90303.BITACORA + idPrograma
    );
  }

  /**
   * Obtiene la lista de programas desde la API.
   * @param rfc RFC del contribuyente.
   * @param tipoPrograma Tipo de programa.
   * @returns Un observable con la lista de programas.
   */
  obtenerListaProgramas(
    rfc: string,
    tipoPrograma: string
  ): Observable<JSONRespuesta<ProgramaLista[]>> {
    return this.httpService.get<JSONRespuesta<ProgramaLista[]>>(
      PROC_90303.LISTA_PROGRAMAS + `${rfc}&tipoPrograma=${tipoPrograma}`
    );
  }

  /**
   * Actualiza los datos de la tabla Prosec en el servidor.
   * @param payload Datos a enviar para la actualización.
   * @returns {Observable<JSONRespuesta<any>>} Observable con la respuesta de la actualización.
   */
  actualizarGridProsec(payload: any): Observable<JSONRespuesta<any>> {
    return this.httpService.post<JSONRespuesta<any>>(
      PROC_90303.ACTUALIZAR_GRID_PROSEC,
      {
        body: payload,
      }
    );
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<Solicitud80301State>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<Solicitud90303State> {
    return this.tramite90303Query.selectSolicitud$;
  }

  /**
   * Guarda los datos del formulario de modificación en el servidor.
   * @param body Objeto que contiene los datos a guardar.
   * @returns {Observable<JSONResponse>} Observable con la respuesta del guardado.
   */
  postGuardarDatos(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(PROC_90303.GUARDAR, {
      body: body,
    });
  }

  /**
   * Construye el mapeo inverso de la solicitud 90303 desde el payload construido.
   * @param built Objeto con el payload construido.
   * @returns {Record<string, unknown>} Objeto con los datos mapeados inversamente.
   */
  reverseBuildSolicitud90303(
    built: Record<string, unknown>
  ): Record<string, unknown> { 
    return {
      sector: this.reverseMapSectorTabla(built),
    }
  }

  /**
   * Mapea inversamente los datos de la tabla de sectores desde el payload.
   * @param data Objeto con los datos del payload.
   * @returns {unknown} Datos mapeados de la tabla de sectores.
   */
  reverseMapSectorTabla(data: Record<string, unknown>): unknown {
    const SECTOR = (data?.['sector'] as Record<string, unknown>[]) ?? [];
    return SECTOR.map((sector) => ({
      cvSectorCatalogo: sector['cvSectorCatalogo'] || '',
      sector: sector['sector'] || '',
      estatus: sector['descripcionTestado'] || '',
    }));
  }
}
