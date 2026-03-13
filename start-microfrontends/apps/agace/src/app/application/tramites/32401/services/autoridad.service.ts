import { Catalogo, CatalogosSelect } from '@libs/shared/data-access-user/src';
import { CapturarElTextoLibre } from '../models/datos-tramite.model';
import { FormaRequerimiento } from '../models/datos-tramite.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequerimientoOpcions } from '../models/datos-tramite.model';
import { RespuestaContenedor } from '../models/datos-tramite.model';
import { Tramite32401Store } from '../estados/tramite32401.store';
/**
 * Servicio para interactuar con los datos relacionados con la autoridad.
 * Proporciona métodos para obtener y gestionar listas de trámites, aduanas y solicitudes.
 */
@Injectable({
  /** Define el ámbito del servicio como raíz. */
  providedIn: 'root',
})
export class AutoridadService {
  /**
   * Constructor del servicio.
   * Inyecta el cliente HTTP para realizar solicitudes.
   * @param http Cliente HTTP para la comunicación con el servidor.
   * @param {Tramite32401Store} tramite32401Store - Store encargado de gestionar el estado del trámite 32401.
   */
  constructor(
    private http: HttpClient,
    private tramite32401Store: Tramite32401Store
  ) {
    // Constructor vacío, se puede agregar lógica adicional si es necesario.
  }

  /**
   * Obtiene la lista de trámites desde un archivo JSON.
   * @returns Observable con los datos del catálogo de trámites.
   */
  obtenerTramiteLista(): Observable<CatalogosSelect> {
    return this.http.get<CatalogosSelect>(
      `assets/json/32401/tipo-de-tramite.json`
    );
  }

  /**
   * Obtiene la lista de aduanas desde un archivo JSON.
   * @returns Observable con los datos del catálogo de aduanas.
   */
  obtenerAduanaLista(): Observable<CatalogosSelect> {
    return this.http.get<CatalogosSelect>(
      `assets/json/32401/tipo-de-requerimiento.json`
    );
  }

  /**
   * Agrega una solicitud y obtiene información desde un archivo JSON.
   * @returns Observable con los datos del contenedor relacionados con la solicitud.
   */
  agregarSolicitud(): Observable<RespuestaContenedor> {
    return this.http.get<RespuestaContenedor>(
      `assets/json/32401/contenedorLista.json`
    );
  }

  /**
   * Método para obtener los datos de captura de texto libre desde un archivo JSON.
   * Realiza una solicitud HTTP GET para recuperar la información.
   * @returns Observable que emite los datos de CapturarElTextoLibre.
   */
  agregarCapturarElTextoLibre(): Observable<CapturarElTextoLibre> {
    return this.http.get<CapturarElTextoLibre>(
      `assets/json/32401/capturar-el-texto-libre.json`
    );
  }

  /**
   * Realiza una petición HTTP GET para obtener las opciones de requerimiento
   * desde un archivo JSON local ubicado en la ruta especificada.
   *
   * @returns Un observable que emite un arreglo de objetos `RequerimientoOpcions`.
   */
  agregarRequerimientoOpcions(): Observable<RequerimientoOpcions[]> {
    return this.http.get<RequerimientoOpcions[]>(
      `assets/json/32401/requerimiento-opcions.json`
    );
  }

  /**
   * Obtiene un requerimiento desde un archivo JSON local.
   *
   * @returns Un observable con los datos del requerimiento en formato `FormaRequerimiento`.
   */
  agregarRequerimiento(): Observable<FormaRequerimiento> {
    return this.http.get<FormaRequerimiento>(
      `assets/json/32401/requerimiento.json`
    );
  }

  /**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   *
   * @param valor - Objeto del tipo `FormaRequerimiento` que contiene el motivo de cancelación y el tipo de requerimiento.
   */
  actualizarEstadoFormulario(valor: FormaRequerimiento): void {
    this.tramite32401Store.setMotivoCancelacion(valor.motivoCancelacion);
    this.tramite32401Store.setTipoDeRequerimiento(valor.tipoDeRequerimiento);
    this.tramite32401Store.setTipoDeDocumento(valor.tipoDeDocumento);
    this.tramite32401Store.setDocumentoAdicional(valor.documentoAdicional);
  }

  /**
   * Obtiene los tipos de documentos desde un archivo JSON local.
   *
   * @returns {Observable<CatalogosSelect>} Un observable que emite los datos del catálogo de tipos de documentos.
   */
  getTiposDocumentos(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/32401/tipos-documentos.json'
    );
  }
}
