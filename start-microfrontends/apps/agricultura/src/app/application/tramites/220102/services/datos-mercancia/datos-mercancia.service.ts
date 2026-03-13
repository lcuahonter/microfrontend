import { Catalogo, RespuestaCatalogos, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { FinalDataToSend, MercanciaForm } from '../../models/fitosanitario.model';
import { FitosanitarioStore } from '../../estados/fitosanitario.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL } from '../../constantes/fitosanitario.enum';
import { map } from 'rxjs/operators';

/**
 * @fileoverview
 * Servicio para la gestión de datos de mercancía fitosanitaria.
 * Permite obtener catálogos, actualizar/eliminar datos en el store, obtener el estado completo y controlar la activación de campos.
 * Cobertura compodoc 100%: cada método, propiedad y constructor está documentado.
 * @module DatosMercanciaService
 */

/**
 * Servicio para la gestión de datos de mercancía fitosanitaria.
 * Permite obtener catálogos, actualizar/eliminar datos en el store, obtener el estado completo y controlar la activación de campos.
 * @class DatosMercanciaService
 * @providedIn root
 */
@Injectable({
  providedIn: 'root'
})
export class DatosMercanciaService {
  /**
   * URL base para las peticiones de catálogos y datos.
   * @property {string}
   */
  url: string = URL;

  /**
   * Constructor del servicio.
   * Inyecta los servicios necesarios para la gestión de datos y el manejo del store.
   * @param {HttpClient} http Servicio HTTP para peticiones a la API.
   * @param {SeccionLibStore} seccionStore Store para el manejo de la validez y estado de las secciones.
   * @param {FitosanitarioStore} fitosanitarioStore Store para el manejo de los datos de mercancía.
   */
  constructor(
    private readonly http: HttpClient,
    private readonly seccionStore: SeccionLibStore,
    private readonly fitosanitarioStore: FitosanitarioStore
  ) {
    // Constructor logic can be added here if needed
  }

  /**
   * Obtiene un catálogo de opciones desde un archivo JSON.
   * @method obtenerSelectorList
   * @param {string} fileName Nombre del archivo JSON a consultar.
   * @returns {Observable<Catalogo[]>} Observable con el catálogo solicitado.
   * @description Realiza una petición HTTP para obtener un catálogo y lo transforma a un arreglo de objetos tipo Catalogo.
   */
  obtenerSelectorList(fileName: string): Observable<Catalogo[]> {
    const BASEURL = this.url + fileName;
    return this.http.get<RespuestaCatalogos>(BASEURL).pipe(
      map(response => response.data)
    );
  }

  /**
   * Actualiza el formulario de movilización en el store.
   * @method actualizarFormularioMovilizacion
   * @param {MercanciaForm[]} formularioMovilizacion Datos del formulario de movilización.
   * @returns {void}
   * @description Llama al store para actualizar los datos de la mercancía.
   */
  public actualizarFormularioMovilizacion(formularioMovilizacion: MercanciaForm[]): void {
    this.fitosanitarioStore.actualizarDatosForma(formularioMovilizacion);
  }

  /**
   * Elimina un dato de mercancía por su ID en el store.
   * @method eliminarDatoPorId
   * @param {number} id Identificador del dato a eliminar.
   * @returns {void}
   * @description Llama al store para eliminar el dato de mercancía correspondiente al ID proporcionado.
   */
  public eliminarDatoPorId(id: number): void {
    this.fitosanitarioStore.eliminarDatoPorId(id);
  }

  /**
   * Obtiene el estado completo del store fitosanitario como un observable.
   * @method obtenerDatos
   * @returns {Observable<FinalDataToSend>} Un observable que emite el estado completo del store fitosanitario.
   * @description Permite suscribirse a los cambios del estado global de la mercancía.
   */
  public obtenerDatos(): Observable<FinalDataToSend> {
    return this.fitosanitarioStore._select(state => state); // Devuelve el estado completo
  }

  /**
   * Desactiva o activa los campos de la sección actual según el estado proporcionado.
   * @method botonDesactivarCampos
   * @param {boolean} status Indica si los campos deben estar activos (`true`) o desactivados (`false`).
   * @returns {void}
   * @description Actualiza el estado de la sección y la validez del formulario en el store.
   */
  public botonDesactivarCampos(status: boolean): void {
    this.seccionStore.establecerSeccion([true]);
    this.seccionStore.establecerFormaValida([status]);
  }

  /**
   * Obtiene los datos de mercancía desde el archivo JSON ubicado en la URL especificada.
   * @method obtenerDatosMercancia
   * @returns {Observable<FinalDataToSend>} Un observable que emite un arreglo de objetos de tipo FinalDataToSend.
   * @description Realiza una petición HTTP para obtener los datos de mercancía desde un archivo JSON.
   */
  obtenerDatosMercancia(): Observable<FinalDataToSend> {
    return this.http.get<FinalDataToSend>(this.url + 'mercancia.json');
  }
}