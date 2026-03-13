import { Catalogo, CatalogoServices, JSONResponse, formatearFechaYyyyMmDd } from '@libs/shared/data-access-user/src';
import { Observable, map } from 'rxjs';
import { Tramite130119State, Tramite130119Store } from '../../estados/store/tramite130119.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_130119 } from '../../servers/api-route';
import { Tramite130119Query } from '../../estados/queries/tramite130119.query';
/**
 * Servicio encargado de gestionar los datos de la solicitud.
 */
@Injectable({
  providedIn: 'root'
})
/**
 * Servicio encargado de gestionar los datos de la solicitud.
 */
export class DatosDeLaSolicitudService {

  /**
   * Constructor del servicio DatosDeLaSolicitudService.
   * 
   * @param {HttpCoreService} http - El servicio HTTP para realizar peticiones.
   */
  constructor(private http: HttpClient, private tramite130119Store: Tramite130119Store, private catalogoServices: CatalogoServices, public tramite130119Query: Tramite130119Query) {
    //
  }

  /**
   * Obtiene las opciones de régimen desde un archivo JSON.
   * 
   * @returns {Observable<Catalogo[]>} - Un observable con las opciones de régimen.
   */
  getRegimen(tramiteId: string): Observable<Catalogo[]> {
    return this.catalogoServices.regimenesCatalogo(tramiteId).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Obtiene las opciones de clasificación de régimen desde un archivo JSON.
   * 
   * @returns {Observable<Catalogo[]>} - Un observable con las opciones de clasificación de régimen.
   */
  getClasificacionDeRegimen(tramiteId: string, idRegimen: string): Observable<Catalogo[]> {
    return this.catalogoServices.getClasificacionRegimen(tramiteId, idRegimen).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Obtiene las opciones de fracción arancelaria desde un archivo JSON.
   * 
   * @returns {Observable<Catalogo[]>} - Un observable con las opciones de fracción arancelaria.
   */
  getFraccionArancelaria(tramiteId: string): Observable<Catalogo[]> {
    return this.catalogoServices.getFraccionesCatalogo(tramiteId).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * @method getUMTCatalogo
   * @description
   * Obtiene el catálogo de **Unidades de Medida y Tarifa (UMT)** correspondiente a la
   * fracción arancelaria seleccionada y al trámite indicado.
   *
   * El método realiza una llamada al servicio `unidadesMedidasTarifariasCatalogo`
   * y procesa la respuesta para retornar únicamente el arreglo de catálogo.
   * Si la respuesta no contiene datos, retorna un arreglo vacío.
   *
   * @param {string} tramiteId - Identificador del trámite asociado a la consulta.
   * @param {string} fraccionId - Identificador de la fracción arancelaria.
   *
   * @returns {Observable<Catalogo[]>}
   * Observable que emite la lista de elementos del catálogo UMT.
   */
  getUMTCatalogo(tramiteId: string, fraccionId: string): Observable<Catalogo[]> {
    return this.catalogoServices.unidadesMedidasTarifariasCatalogo(tramiteId, fraccionId).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Obtiene las opciones de países desde un archivo JSON.
   * 
   * @returns {Observable<CatalogoResponse[]>} - Un observable con las opciones de países.
   */
  getPais(tramiteId: string): Observable<Catalogo[]> {
    return this.catalogoServices.paisesBloqueCatalogo(tramiteId).pipe(
      map(res => res?.datos ?? [])
    );
  }
  /**
   * 
   * estado opciones
   */
  getEstado(tramiteId: string): Observable<Catalogo[]> {
    return this.catalogoServices.estadosCatalogo(tramiteId).pipe(
      map(res => res?.datos ?? [])
    );
  }
  /**
   * 
   * representacionfederal opciones
   */
  getRepresentacionfederal(tramiteId: string, idEstado: string): Observable<Catalogo[]> {
    return this.catalogoServices.representacionFederalCatalogo10(tramiteId, idEstado).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Obtiene los datos de la solicitud desde un archivo JSON.
   * 
   * @returns {Observable<Tramite130119State>} - Un observable con los datos de la solicitud.
   */
  obtenerDatosDeLaSolicitud(): Observable<Tramite130119State> {
    return this.http.get<Tramite130119State>('./assets/json/130119/datos.json');
  }

  /**
   * Establece los datos de la solicitud en el store.
   * 
   * @param {Tramite130119State} datos - Los datos de la solicitud a establecer.
   */
  establecerDatosDeLaSolicitud(datos: Tramite130119State): void {
    this.tramite130119Store.establecerDatos({ ...datos });
  }

  /**
      * Obtiene todos los datos del estado almacenado en el store.
      * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
      */
  getAllState(): Observable<Tramite130119State> {
    return this.tramite130119Query.selectTramite130119$;
  }

  /**
   * @description
   * Construye y devuelve el payload completo requerido para guardar la
   * información del trámite 130119.  
   * 
   * Este método toma el estado actual del trámite y lo transforma en el
   * formato esperado por el backend, incluyendo datos de mercancía,
   * productor, solicitante, representación federal y países seleccionados.
   *
   * También genera la sección `partidasMercancia` a partir del método
   * auxiliar `getPayloadDatos(item)`.
   *
   * @param {Tramite130119State} item  
   * Estado actual del trámite, del cual se extraen los valores necesarios
   * para estructurar el payload.
   *
   * @returns {unknown}  
   * Objeto con la estructura completa del payload listo para enviarse
   * al servicio correspondiente.
   */
  guardarPayloadDatos(item: Tramite130119State): unknown {
    return {
      rfc_solicitante: item.loginRfc,
      solicitante: {
        rfc: "AAL0409235E6",
        nombre: "ACEROS ALVARADO S.A. DE C.V.",
        actividad_economica: "Fabricación de productos de hierro y acero",
        correo_electronico: "contacto@acerosalvarado.com",
        razon_social: "CORPORACION MEXICANA",
        domicilio: {
          pais: "México",
          codigo_postal: "06700",
          estado: "Ciudad de México",
          municipio_alcaldia: "Cuauhtémoc",
          localidad: "Centro",
          colonia: "Roma Norte",
          calle: "Av. Insurgentes Sur",
          numero_exterior: "123",
          numero_interior: "Piso 5, Oficina A",
          lada: "",
          telefono: "123456"
        }
      },
      id_solcitud: item.idSolicitud || 0,
      cve_regimen: item.regimen,
      cve_clasificacion_regimen: item.clasificacionDeRegimen,
      mercancia: {
        cve_fraccion_arancelaria: item.fraccionArancelaria,
        descripcion: item.descripcion,
        cve_unidad_medida_tarifaria: item.umt,
        cve_pais_origen: item.paisOrigen,
        cantidad_tarifaria: Number(item.cantidad),
        valor_factura_usd: Number(item.valorFacturaUSD),
        fecha_salida: formatearFechaYyyyMmDd(item?.fechaExpedicionFactura),
        observaciones: item.observaciones
      },
      representacion_federal: {
        cve_entidad_federativa: item.estado,
        cve_unidad_administrativa: item.representacionFederal
      }
    };
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_130119.GUARDAR, body);
  }
}
