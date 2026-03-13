import { MetaInfo, PageDeDerechosData, Respuesta, RespuestaDetalle, RespuestaSolicitud } from '../models/datos-tramite.model';
import { Solicitud230201State, Tramite230201Store } from '../estados/tramite230201.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

@Injectable({
  providedIn: 'root'
})
export class PhytosanitaryExportacionService {

  /**
   * Constructor que se utiliza para la inyección de dependencias.
   * @param http Servicio HTTP para realizar solicitudes a recursos externos.
   * @param store Store de Akita para gestionar el estado del trámite.
   */
  constructor(private http: HttpClient, private store: Tramite230201Store) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Obtiene el catálogo de países de procedencia.
   * @returns Un observable con la respuesta del catálogo de países de procedencia.
   */
  getPaisDeProcedencia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230201/paisDeProcedencia.json');
  }

  /**
   * Obtiene el catálogo de aduanas.
   * @returns Un observable con la respuesta del catálogo de aduanas.
   */
  getAduana(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230201/aduanaIngresara.json');
  }

  /**
   * Obtiene el catálogo de países.
   * @returns Un observable con la respuesta del catálogo de países.
   */
  getPais(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230201/pais.json');
  }

  /**
   * Obtiene la información meta asociada a la solicitud.
   * @returns Un observable con la respuesta que contiene la información meta.
   */
  getMetaInfo(): Observable<Respuesta<MetaInfo>> {
    return this.http.get<Respuesta<MetaInfo>>('assets/json/230201/solicitudDatosInfo.json');
  }

  /**
   * Obtiene el catálogo de entidades federativas.
   * @returns Un observable con la respuesta del catálogo de entidades.
   */
  getEntidades(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230201/entidades.json');
  }

  /**
   * Obtiene el catálogo de descripciones de productos.
   * @returns Un observable con la respuesta del catálogo de descripciones de productos.
   */
  getDescripcionProducto(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230201/descripcionProducto.json');
  }

  /**
   * Agrega una nueva solicitud.
   * @returns Un observable con la respuesta de la solicitud agregada.
   */
  agregarSolicitud(): Observable<RespuestaSolicitud> {
    return this.http.get<RespuestaSolicitud>(`assets/json/230201/solicitudDatos.json`);
  }

  /**
   * Agrega un nuevo detalle a la solicitud.
   * @returns Un observable con la respuesta del detalle agregado.
   */
  agregarDetalle(): Observable<RespuestaDetalle> {
    return this.http.get<RespuestaDetalle>(`assets/json/230201/detalleDatos.json`);
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias.
   * @returns Un observable con la respuesta del catálogo de fracciones arancelarias.
   */
  getFraccionArancelaria(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230201/fraccionArancelaria.json');
  }

  /**
   * Obtiene el catálogo de géneros.
   * @returns Un observable con la respuesta del catálogo de géneros.
   */
  getGenero(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230201/genero.json');
  }

  /**
   * Obtiene el catálogo de especies.
   * @returns Un observable con la respuesta del catálogo de especies.
   */
  getEspecie(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230201/especie.json');
  }

  /**
   * Obtiene el catálogo de nombres comunes.
   * @returns Un observable con la respuesta del catálogo de nombres comunes.
   */
  getNombreComun(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230201/nombreComun.json');
  }

  /**
   * Obtiene el catálogo de unidades de medida.
   * @returns Un observable con la respuesta del catálogo de unidades de medida.
   */
  getUnidadDeMedida(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230201/unidadDeMedida.json');
  }

  /**
   * Obtiene el catálogo de medios de transporte.
   * @returns Un observable con la respuesta del catálogo de medios de transporte.
   */
  getMedioDeTransporte(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230201/medioDeTransporte.json');
  }

  /**
   * Obtiene el catálogo de estados.
   * @returns Un observable con la respuesta del catálogo de estados.
   */
  getEstado(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230201/estado.json');
  }

  /**
   * Obtiene el catálogo de destinatarios.
   * @returns Un observable con la respuesta del catálogo de destinatarios.
   */
  getSavedData(): Observable<Solicitud230201State> {
    return this.http.get<Solicitud230201State>('assets/json/230201/savedData.json');
  }

  /**
   * @description
   * Obtiene los puntos de inspección disponibles.
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getPagoDeDatos(): Observable<PageDeDerechosData> {
    return this.http.get<PageDeDerechosData>(`assets/json/230201/pago-de-derecho.json`);
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param data Datos de tipo Solicitud230201State que se utilizarán para actualizar el estado del formulario.
   */
  actualizarEstadoFormulario(data: Solicitud230201State): void {
    this.store.update((state) => {
      return {
        ...state,
        aduana: data.aduana,
        paisDeProcedencia: data.paisDeProcedencia,
        pais: data.pais,
        entidades: data.entidades,
        descripcionProducto: data.descripcionProducto,
        datosSolicitud: data.datosSolicitud,
        datosDetalle: data.datosDetalle,
        fraccionArancelaria: data.fraccionArancelaria,
        descripcionFraccionArancelaria: data.descripcionFraccionArancelaria,
        cantidad: data.cantidad,
        cantidadLetra: data.cantidadLetra,
        genero: data.genero,
        especie: data.especie,
        nombreComun: data.nombreComun,
        unidadDeMedida: data.unidadDeMedida,
        lungarDeEntrada: data.lungarDeEntrada,
        destinoDeImportador: data.destinoDeImportador,
        medioDeTransporte: data.medioDeTransporte,
        numeroYDescripcion: data.numeroYDescripcion,
        codigoPostal: data.codigoPostal,
        estado: data.estado,
        calle: data.calle,
        numeroExterior: data.numeroExterior,
        numeroInterior: data.numeroInterior,
        colonia: data.colonia,
        tercerosPopupState: data.tercerosPopupState,
        destinatarios: data.destinatarios,
        claveDeReferencia: data.claveDeReferencia,
        cadenaPagoDependencia: data.cadenaPagoDependencia,
        banco: data.banco,
        llaveDePago: data.llaveDePago,
        fecPago: data.fecPago,
        impPago: data.impPago,
        update: true
      };
    });
  }
}
