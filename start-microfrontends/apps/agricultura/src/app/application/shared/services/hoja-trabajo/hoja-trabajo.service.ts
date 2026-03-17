import {
  API_GET_HOJA_INICIAR,
  API_GET_HOJA_TREABAJO_VISTA_PREVIA,
  API_GET_NOMBRES_LABORATORIOS,
  API_GET_ORDEN_SERVICIOS_TRATAMIENTO_VISTA_PREVIA,
  API_GET_REMISION_MUESTRAS_DIAGNOSTICO_VISTA_PREVIA,
  API_GET_TIPOS_LABORATORIO,
  API_GET_UNIDADES_MEDIDA_COMERCIAL,
  API_POST_DICTAMEN_GUARDAR,
  API_POST_HOJA_TRABAJO_GUARDAR,
} from '../../../core/server/api-router';
import { Injectable, inject } from '@angular/core';
import { ENVIRONMENT } from '@ng-mf/data-access-user';
import { GuardarDictamenModel } from '../../../core/models/hoja-trabajo/guardar-dictamen.model';
import { HojaTrabajoModel } from '../../../core/models/hoja-trabajo/hoja-trabajo.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseCatalogo } from '../../../core/models/hoja-trabajo/response-catalogo.model';
import { ResponseHojaTrabajoModel } from '../../../core/models/hoja-trabajo/response-hoja-trabajo.model';
import { ResponseIniciarModel } from '../../../core/models/hoja-trabajo/response-iniciar.model';

@Injectable({
  providedIn: 'root',
})
/**
 * Class: HojaTrabajoService
 *
 * Description:
 *  Service donde se llaman endpoints de la API para realizar peticiones a la hoja de trabajo.
 *
 *
 * @created 27 de noviembre 2025
 * @version 1.0
 * @category Componente
 */
export class HojaTrabajoService {
  /**
   * Cliente HTTP de Angular inyectado para realizar las peticiones al backend.
   */
  private http: HttpClient = inject(HttpClient);
  /**
   * URL base de la API del módulo de hoja de trabajo.
   * Se construye a partir de la constante de entorno ENVIRONMENT.API_HOST.
   */
  host = `${ENVIRONMENT.API_HOST}/api/`;

  /**
   * Obtiene la vista previa de la hoja de trabajo para un trámite y folio específicos.
   *
   * @param tramite       Identificador del trámite.
   * @param numFolioTramite Número de folio del trámite.
   * @returns Observable con la respuesta tipada de la hoja de trabajo.
   */
  visualizarHojaTrabajo(
    tramite: string,
    numFolioTramite: string
  ): Observable<ResponseHojaTrabajoModel> {
    const ENDPOINT = `${this.host}${API_GET_HOJA_TREABAJO_VISTA_PREVIA(
      tramite,
      numFolioTramite
    )}`;
    return this.http.get<ResponseHojaTrabajoModel>(ENDPOINT);
  }

  /**
   * Obtiene la vista previa de la orden de servicios de tratamiento
   * asociada a un trámite, folio y dictaminador.
   *
   * @param tramite           Identificador del trámite.
   * @param numFolioTramite   Número de folio del trámite.
   * @param nombreDictaminador Nombre del dictaminador que emite la orden.
   * @returns Observable con la respuesta de la hoja de trabajo.
   */
  visualizarOrdenServiciosTratamientoTrabajo(
    tramite: string,
    numFolioTramite: string,
    nombreDictaminador: string
  ): Observable<ResponseHojaTrabajoModel> {
    const ENDPOINT = `${
      this.host
    }${API_GET_ORDEN_SERVICIOS_TRATAMIENTO_VISTA_PREVIA(
      tramite,
      numFolioTramite,
      nombreDictaminador
    )}`;
    return this.http.get<ResponseHojaTrabajoModel>(ENDPOINT);
  }

  /**
   * Obtiene la vista previa del documento de remisión de muestras
   * para diagnóstico, asociado a un trámite, folio y dictaminador.
   *
   * @param tramite           Identificador del trámite.
   * @param numFolioTramite   Número de folio del trámite.
   * @param nombreDictaminador Nombre del dictaminador que remite las muestras.
   * @returns Observable con la respuesta de la hoja de trabajo.
   */
  visualizarRemisionMuestrasDiagnosticoTrabajo(
    tramite: string,
    numFolioTramite: string,
    nombreDictaminador: string
  ): Observable<ResponseHojaTrabajoModel> {
    const ENDPOINT = `${
      this.host
    }${API_GET_REMISION_MUESTRAS_DIAGNOSTICO_VISTA_PREVIA(
      tramite,
      numFolioTramite,
      nombreDictaminador
    )}`;
    return this.http.get<ResponseHojaTrabajoModel>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de tipos de laboratorio permitidos para un trámite.
   *
   * @param tramite Identificador del trámite.
   * @returns Observable con el catálogo de tipos de laboratorio.
   */
  catalogoTiposLaboratorio(tramite: string): Observable<ResponseCatalogo> {
    const ENDPOINT = `${this.host}${API_GET_TIPOS_LABORATORIO(tramite)}`;
    return this.http.get<ResponseCatalogo>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de nombres de laboratorio en función del trámite
   * y del tipo de laboratorio seleccionado.
   *
   * @param tramite           Identificador del trámite.
   * @param ideTipoLaboratorio Identificador del tipo de laboratorio.
   * @returns Observable con el catálogo de nombres de laboratorio.
   */
  catalogoNombresLaboratorio(
    tramite: string,
    ideTipoLaboratorio: string
  ): Observable<ResponseCatalogo> {
    const ENDPOINT = `${this.host}${API_GET_NOMBRES_LABORATORIOS(
      tramite,
      ideTipoLaboratorio
    )}`;
    return this.http.get<ResponseCatalogo>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de unidades de medida comerciales disponibles
   * para un trámite dado.
   *
   * @param tramite Identificador del trámite.
   * @returns Observable con el catálogo de unidades de medida comerciales.
   */
  catalogoUnidadMedidaComercial(tramite: string): Observable<ResponseCatalogo> {
    const ENDPOINT = `${this.host}${API_GET_UNIDADES_MEDIDA_COMERCIAL(
      tramite
    )}`;
    return this.http.get<ResponseCatalogo>(ENDPOINT);
  }

  /**
   * Envía al backend la información del dictamen para guardarla,
   * asociada a un trámite y número de folio.
   *
   * @param tramite         Identificador del trámite.
   * @param numFolioTramite Número de folio del trámite.
   * @param body            Cuerpo del dictamen (modelo de hoja de trabajo).
   * @returns Observable con la respuesta de guardado del dictamen.
   */
  guardarDictamen(
    tramite: string,
    numFolioTramite: string,
    body: GuardarDictamenModel
  ): Observable<ResponseHojaTrabajoModel> {
    const ENDPOINT = `${this.host}${API_POST_DICTAMEN_GUARDAR(
      tramite,
      numFolioTramite
    )}`;
    return this.http.post<ResponseHojaTrabajoModel>(ENDPOINT, body);
  }

  /**
   * Envía al backend la información de la hoja de trabajo para guardarla,
   * asociada a un trámite.
   *
   * @param tramite Identificador del trámite.
   * @param body    Cuerpo de la hoja de trabajo.
   * @returns Observable con la respuesta de guardado de la hoja de trabajo.
   */
  guardarHojaTrabajo(
    tramite: string,
    body: HojaTrabajoModel
  ): Observable<ResponseHojaTrabajoModel> {
    const ENDPOINT = `${this.host}${API_POST_HOJA_TRABAJO_GUARDAR(tramite)}`;
    return this.http.post<ResponseHojaTrabajoModel>(ENDPOINT, body);
  }

  /**
   * Convierte una cadena en base64 que representa un PDF a un objeto Blob.
   *
   * @param base64 Cadena en base64 del archivo PDF (sin encabezado de tipo MIME).
   * @returns Blob correspondiente al archivo PDF.
   */
  static convertirB64File(base64: string): Blob {
    const BYTECHARACTERS = atob(base64);
    const BYTENUMBERS = new Array(BYTECHARACTERS.length);

    for (let i = 0; i < BYTECHARACTERS.length; i++) {
      BYTENUMBERS[i] = BYTECHARACTERS.charCodeAt(i);
    }

    const BYTEARRAY = new Uint8Array(BYTENUMBERS);
    return new Blob([BYTEARRAY], { type: 'application/pdf' });
  }

  /**
   * Descarga un archivo PDF desde una cadena en base64 creando un enlace temporal
   * y disparando la descarga en el navegador.
   *
   * @param base64Pdf      Cadena en base64 del PDF (puede incluir o no el prefijo data:*).
   * @param nombreArchivo  Nombre con el que se descargará el archivo.
   * @return void
   */
  static descargarArchivo(base64Pdf: string, nombreArchivo: string): void {
    const CLEANBASE64 = base64Pdf.includes(',')
      ? base64Pdf.split(',')[1]
      : base64Pdf;

    const BLOB: Blob = HojaTrabajoService.convertirB64File(CLEANBASE64);
    const URLFILE: string = URL.createObjectURL(BLOB);

    const LINK = document.createElement('a');
    LINK.href = URLFILE;
    LINK.download = nombreArchivo;
    LINK.click();

    URL.revokeObjectURL(URLFILE);
  }

  /**
   * Metodo para iniciar la hoja de trabajo por request
   * @param tramite
   * @param numFolio
   */
  iniciarHojaTrabajo(
    tramite: string,
    numFolio: string
  ): Observable<ResponseIniciarModel> {
    return this.http.get<ResponseIniciarModel>(
      `${this.host}${API_GET_HOJA_INICIAR(tramite, numFolio)}`
    );
  }
}
