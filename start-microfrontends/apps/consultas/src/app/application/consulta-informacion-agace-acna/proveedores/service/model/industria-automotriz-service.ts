import { BusquedaInformacionAutomotrizResponse, DatosAutomotrizResponse, PaginacionResponse } from './response/busqueda-response';
import { Observable, of } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AutomotrizService {

  /**
   * URL del servidor donde se encuentra la API.
   */
  urlServer = ENVIRONMENT.API_HOST;

  constructor(private http: HttpClient) {
  }
  /**
   * 
   * @param body 
   * @returns 
   */
  getRegistrosByFiltros<T>(pag: number, itemsPerPage: number): Observable<BaseResponse<T>> {
    return of(this.dummyFiltros(pag, itemsPerPage) as unknown as BaseResponse<T>);
  }

  /**
   * Realiza la búsqueda por RFC de la industria.
   * Este método simula el filtrado de los registros por `rfc_industria` utilizando la respuesta dummy.
   */
  getRegistrosByRfcIndustria<T>(rfcIndustria: string, pag: number, itemsPerPage: number): Observable<BaseResponse<T>> {
    const BASE = this.dummyFiltros(pag, itemsPerPage) as unknown as BaseResponse<BusquedaInformacionAutomotrizResponse>;
    const FILTRO = rfcIndustria.trim().toLowerCase();

    const REGISTROS_FILTRADOS = BASE.datos?.registros?.filter(r => r.rfc_industria?.toLowerCase().includes(FILTRO)) || [];

    const TOTAL_FILTRADOS = REGISTROS_FILTRADOS.length;
    const TOTAL_PAGINAS = Math.ceil(TOTAL_FILTRADOS / itemsPerPage) || 1;

    const PAGINACION: PaginacionResponse = {
      num_pag: pag,
      tam_pag: itemsPerPage,
      total_elementos: TOTAL_FILTRADOS,
      total_paginas: TOTAL_PAGINAS,
      es_ultima_pag: pag >= TOTAL_PAGINAS
    };

    const DATOS: BusquedaInformacionAutomotrizResponse = {
      registros: REGISTROS_FILTRADOS,
      paginacion: PAGINACION
    };

    const RESPUESTA: BaseResponse<BusquedaInformacionAutomotrizResponse> = {
      codigo: BASE.codigo,
      mensaje: BASE.mensaje,
      path: BASE.path,
      timestamp: BASE.timestamp,
      datos: DATOS
    };

    /**
     * Retorna la respuesta filtrada por RFC de la industria.
     */
    return of(RESPUESTA as unknown as BaseResponse<T>);
    
  } 

  /**
   * Metodo dummy para simular la respuesta de los filtros, cuando se tenga el servicio se debe de quitar este codigo
   * @returns Retorna la respuesta del servidor simulando la respuesta
   */
  dummyFiltros(pag: number, itemsPerPage: number): BaseResponse<BusquedaInformacionAutomotrizResponse> {
    const REGISTROS: DatosAutomotrizResponse[] = [];
    const TAM_PAG = itemsPerPage;
    const BASE_INDEX = (pag - 1) * TAM_PAG;

    for (let i = 0; i < TAM_PAG; i++) {
      const INDEX = BASE_INDEX + i + 1;
      REGISTROS.push({
        rfc_industria: `RFC${String(INDEX).padStart(10, '0')}`,
        rfc_proveedor: `RFC_PROVEEDOR_${String(INDEX).padStart(9, '0')}`,
        denominacion: `Denominacion ${INDEX}`,
        domicilio_fiscal: `Domicilio Fiscal ${INDEX}`,
        norma: `Norma ${INDEX}`,
        numero_immex: `IMMEX${String(INDEX).padStart(5, '0')}`,
        numero_prosec: `PROSEC${String(INDEX).padStart(5, '0')}`,
        aduanas_opera: `Aduana ${INDEX}`,
        fecha_inicio_relacion: `2020-01-${String((INDEX % 28) + 1).padStart(2, '0')}`,
        fecha_fin_relacion: `2023-12-${String((INDEX % 28) + 1).padStart(2, '0')}`
      });
    }

    

    const TOTAL_ELEMENTOS = 100;
    const TOTAL_PAGINAS = Math.ceil(TOTAL_ELEMENTOS / TAM_PAG);

    const PAGINACION: PaginacionResponse = {
      num_pag: pag,
      tam_pag: TAM_PAG,
      total_elementos: TOTAL_ELEMENTOS,
      total_paginas: TOTAL_PAGINAS,
      es_ultima_pag: pag >= TOTAL_PAGINAS
    };

    const DATOS: BusquedaInformacionAutomotrizResponse = {
      registros: REGISTROS,
      paginacion: PAGINACION
    };

    return {
      codigo: '00',
      mensaje: 'Operacion exitosa.',
      path: '/api/consultas/industria',
      timestamp: new Date().toISOString(),
      datos: DATOS
    };
  }

}