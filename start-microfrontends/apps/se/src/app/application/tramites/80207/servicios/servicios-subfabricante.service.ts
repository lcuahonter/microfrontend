import { DEFAULT_DOMICILIO, Tramites80207Store } from '../estados/tramite80207.store';

import {
  ApiResponseItem,
  BaseItem,
  DatoComplementario,
  DomicilioDto,
  DomicilioPayload,
  InfoRegistro,
  PlantasDireccionModelo,
  SubfabricanteDireccionModelo,
  Tramite80207State,
} from '../modelos/subfabricante.model';

import { JSONResponse, RespuestaCatalogos } from '@ng-mf/data-access-user';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API_ROUTES } from '../../../shared/servers/api-route';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { BuscarPayload } from '../../../shared/models/empresas-subfabricanta.model';
import { CadenaOriginalRequest } from '../../130118/model/request/cadena-original-request.model';
import { FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_80207 } from '../servers/api-route';

/**
 * Decorador que marca una clase como un servicio que puede ser inyectado en otros componentes o servicios.
 * Este servicio está registrado en el inyector raíz.
 * @export
 * @class Injectable
 */
@Injectable({
  providedIn: 'root',
})
/**
 * @fileoverview Servicio para la gestión de datos de submanufactureras.
 * Este servicio maneja la obtención de datos relacionados con las submanufactureras,
 * incluyendo la lista de estados, subfabricantes disponibles y seleccionados.
 * @module serviciosSubfabricanteService --80207
 */
export class SubfabricanteService {
  constructor(private readonly http: HttpClient,
    private tramites80207Store: Tramites80207Store

  ) {
    //El constructor está intencionadamente vacío ya que solo inyecta el servicio HttpClient.
  }

  /**
   * Obtiene los datos de registro y subcontratista.
   * @method getDatos
   * @returns {Observable<InfoRegistro>} Observable con los datos de registro y subcontratista.
   */
  getDatos(): Observable<InfoRegistro> {
    return (
      this.http
        .get<InfoRegistro>('assets/json/80207/submanufacturer-datos.json')
        .pipe(map((res) => res)));
   
  }

  /**
   * Obtiene la lista de estados.
   * @method obtenerListaEstado
   * @returns {Observable<RespuestaCatalogos>} Observable con la lista de estados.
   */
  obtenerListaEstado(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/80207/estado-datos.json'
    );
  }

  /**
   * Obtiene la lista de subfabricantes disponibles.
   * @method getSubfabricantesDisponibles
   * @returns {Observable<TableData>} Observable con la lista de subfabricantes disponibles.
   */
  getSubfabricantesDisponibles(body: BuscarPayload): Observable<JSONResponse> {
     return this.http.post<JSONResponse>(API_ROUTES('/sat-t80207','80207').buscarPlantas, body).pipe(
            map((response) => response),
            catchError(() => {
              const ERROR = new Error(`Error al obtener la lista de subfabricantes en ${API_ROUTES('/sat-t80207','80207').buscarPlantas}`);
              return throwError(() => ERROR);
            })
          );
  }
  /**
   * Obtiene la lista de plantas disponibles.
   * @method getPlantasDisponibles
   * @returns {Observable<PlantasDireccionModelo[]>} Observable con la lista de plantas disponibles.
   * */

  getPlantasDisponibles(): Observable<PlantasDireccionModelo[]> {
    return this.http.get<PlantasDireccionModelo[]>(
      'assets/json/80207/plantas-disponibles.json'
    ).pipe(
      map((res) => res)
    );
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @method actualizarEstadoFormulario
   * @param {Tramite80207State} DATOS - Datos del trámite 80207.
   */

  actualizarEstadoFormulario(DATOS: Tramite80207State): void{
    this.tramites80207Store.setInfoRegistro(DATOS.infoRegistro);
    this.tramites80207Store.setDatosContr(DATOS.datosSubcontratista);
    this.tramites80207Store.setPlantasBuscadas(DATOS.plantasBuscadas);
    this.tramites80207Store.setPlantas(DATOS.plantas);
    this.tramites80207Store.setFormValida(DATOS.formaValida);
  }

  /**
   * Obtiene los datos de servicios de submanufactureras.
   * @method getServiciosData
   * @returns {Observable<Tramite80207State>} Observable con los datos de servicios.
   */
  getServiciosData(): Observable<Tramite80207State> {
    return this.http.get<Tramite80207State>('assets/json/80207/datos-submanufactureras.json');
  }

   /**
       * Envía una solicitud de firma electrónica.
       * @param idSolicitud - ID de la solicitud a firmar.
       * @param body - Cuerpo de la solicitud de firma.
       * @returns Observable con la respuesta del servidor.
       */
    enviarFirma<T>(idSolicitud: string | number, body: FirmarRequest): Observable<BaseResponse<T>> {
      return this.http.post<BaseResponse<T>>(PROC_80207.API_POST_FIRMA(String(idSolicitud)), body).pipe(
        map(response => response),
        catchError(() => {
          const ERROR = new Error(`Error al firmar solicitud con ID ${idSolicitud}`);
          return throwError(() => ERROR);
        })
      );
    }

     /**
       * Obtiene la cadena original del trámite 130118.
       * @param body Objeto que contiene los datos necesarios para generar la cadena original.
       * @returns Un observable que emite la respuesta del servidor con la cadena original.
       */
      obtenerCadenaOriginal<T>(idSolicitud: string, body: CadenaOriginalRequest): Observable<BaseResponse<T>> {
        return this.http.post<BaseResponse<T>>(PROC_80207.API_POST_CADENA_ORIGINAL(idSolicitud), body).pipe(
          map((response) => response),
          catchError(() => {
            const ERROR = new Error(`Error al obtener la cadena original en ${PROC_80207.API_POST_CADENA_ORIGINAL(idSolicitud)}`);
            return throwError(() => ERROR);
          })
        );
      }


          /**
 * Construye el domicilio fiscal completo a partir de los datos de domicilio
 * @param domicilio - Objeto domicilioDto
 * @param empresaDomicilio - Objeto domicilioSolicitud de empresaDto
 * @returns String con el domicilio fiscal completo
 */
// eslint-disable-next-line class-methods-use-this
private buildDomicilioFiscal(domicilio: DomicilioDto, empresaDomicilio: DomicilioDto = {}): string {
  const CALLE = domicilio.calle || empresaDomicilio.calle || '';
  const NUM_EXTERIOR = domicilio.numExterior || empresaDomicilio.numExterior || '';
  const NUM_INTERIOR = domicilio.numInterior || empresaDomicilio.numInterior || '';
  const COLONIA = domicilio.colonia || empresaDomicilio.colonia || '';
  const MUNICIPIO = domicilio.municipio || empresaDomicilio.municipio || domicilio.delegacionMunicipio || '';
  const ENTIDAD = domicilio.entidadFederativa?.nombre || empresaDomicilio.entidadFederativa?.nombre || '';
  const CODIGO_POSTAL = domicilio.codigoPostal || empresaDomicilio.codigoPostal || '';

  const PARTS = [CALLE, NUM_EXTERIOR, NUM_INTERIOR, COLONIA, MUNICIPIO, ENTIDAD, CODIGO_POSTAL]
    .filter(part => part && part.toString().trim() !== '')
    .map(part => part.toString().trim());

  return PARTS.join(', ');
}

toNumber(
  value: string | number | null | undefined,
  integerOnly: boolean = true
): number {
  if (value === null || value === undefined || value === '') {return 0;}

  const NUM = Number(value);

  if (isNaN(NUM)) {return 0;}

  return integerOnly ? Math.floor(NUM) : NUM;
}

      /**
       * Mapea la respuesta de la API a un arreglo de objetos PlantasSubfabricante.
       * @param apiResponse - Respuesta de la API que contiene los datos de las plantas subfabricantes.
       * @returns Arreglo de objetos PlantasSubfabricante mapeados.
       */
        // eslint-disable-next-line class-methods-use-this
        mapApiResponseToPlantasSubfabricante(apiResponse: ApiResponseItem[]): SubfabricanteDireccionModelo[] {
          // eslint-disable-next-line complexity
          return apiResponse.map(item => {
            const DOMICILIO = item.domicilioDto || {};
            const EMPRESA = item.empresaDto || {};
            const EMPRESA_DOMICILIO = EMPRESA.domicilioSolicitud || {};
      
            return {
              calle: DOMICILIO.calle || EMPRESA_DOMICILIO.calle || item.calle || '',
              numExterior: this.toNumber(
        DOMICILIO.numExterior || EMPRESA_DOMICILIO.numExterior || item.numeroExterior 
      )|| 0,
      numInterior: this.toNumber(
        DOMICILIO.numInterior || EMPRESA_DOMICILIO.numInterior || item.numeroInterior
      ),
      codigoPostal: this.toNumber(
        DOMICILIO.codigoPostal || EMPRESA_DOMICILIO.codigoPostal || item.codigoPostal
      ),
              colonia: DOMICILIO.colonia || EMPRESA_DOMICILIO.colonia || item.colonia || '',
              delegacionMunicipio: DOMICILIO.municipio || EMPRESA_DOMICILIO.municipio || DOMICILIO.delegacionMunicipio || item.delegacionMunicipio || '',
              entidadFederativa: DOMICILIO.entidadFederativa?.nombre || EMPRESA_DOMICILIO.entidadFederativa?.nombre || item.entidadFederativa || '',
              pais: DOMICILIO.pais?.nombre || EMPRESA_DOMICILIO.pais?.nombre || item.pais || '',
              idSubfabricante: (item.idSubfabricante || 0).toString(),
              rfc: EMPRESA.rfc || item.rfc || '',
              domicilioFiscalSolicitante: this.buildDomicilioFiscal(DOMICILIO, EMPRESA_DOMICILIO),
              razonSocial: EMPRESA.razonSocial || item.razonSocial || ''
            };
          });
        }

  
}

export function mapPlantaToDomicilio(planta?: PlantasDireccionModelo): DomicilioPayload {
  if (!planta){
    return DEFAULT_DOMICILIO;
  } 

  return {
    idDomicilio: 0,
    calle: planta.calle ?? '',
    numeroExterior: planta.numExterior !== null ? String(planta.numExterior) : '',
    numeroInterior: planta.numInterior !== null ? String(planta.numInterior) : '',
    codigoPostal: planta.codigoPostal !== null ? String(planta.codigoPostal) : '',
    informacionExtra: '',
    clave: '',
    cveLocalidad: planta.localidad ?? '',
    cveDelegMun: planta.delegacionMunicipio ?? '',
    cveEntidad: planta.entidadFederativa ?? '',
    cvePais: planta.pais ?? '',
    ciudad: '',
    telefono: '',
    fax: '',
    municipio: planta.delegacionMunicipio ?? '',
    colonia: planta.localidad ?? '',
    descUbicacion: '',
    cveCatalogo: '',
    telefonos: '',
    tipoDomicilio: 0,
  };
}


export function buildPlantasSubmanufactureras(array: PlantasDireccionModelo[], base: BaseItem[]): unknown[] {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const RESULT: any[] = [];
  
  array.forEach(arr => {
    const TEMPLATE = (base.length > 0 && base[0] && typeof base[0] === 'object') ? base[0] : {};
    
    const PLANT_DATA = {
      empresaCalle: arr.calle ?? '',
      empresaNumeroInterior: arr.numInterior ?? '',
      empresaNumeroExterior: arr.numExterior ?? '',
      empresaCodigoPostal: arr.codigoPostal ?? '',
      localidad: arr.localidad ?? '',
      empresaDelegacionMunicipio: arr.delegacionMunicipio ?? '',
      empresaEntidadFederativa: arr.entidadFederativa ?? '',
      empresaPais: arr.pais ?? '',
      rfc: arr.rfc ?? '',
      domicilioFiscal: arr.domicilioFiscalSolicitante ?? '',
      razonSocial: arr.razonSocial ?? '',
    };
    
    const DATOS_COMPLEMENTARIOS = Array.isArray(TEMPLATE.datosComplementarios)
      ? TEMPLATE.datosComplementarios.map((dc: DatoComplementario) => ({
          idPlantaC: dc.idPlantaC ?? '',
          idDato: dc.idDato ?? '',
          amparoPrograma: dc.amparoPrograma ?? '',
        }))
      : [];
    
    RESULT.push({
      ...TEMPLATE,
      ...PLANT_DATA,
      datosComplementarios: DATOS_COMPLEMENTARIOS,
    });
  });
  
  return RESULT;
}


