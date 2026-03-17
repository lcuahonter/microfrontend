import { Fabricante, Proveedor } from '../../../shared/models/shared2606/terceros-relacionados.model';
import { ManifiestosRespuesta, MercanciaCrossList,ProductoTable, RepresentanteLegalRespuesta,ScianTable, SolicitudTable } from '../models/aviso-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';
import { map } from 'rxjs/operators';


/**
 * Servicio para gestionar datos del aviso sanitario desde archivos JSON.
 */
@Injectable({
  providedIn: 'root'
})
export class AvisoSanitarioService {

  /**
   * Constructor del servicio.
   * 
   * @param http HttpClient para realizar solicitudes HTTP.
   */
  constructor(
    private http: HttpClient
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
     * Método para obtener los medios de transporte.
     * @param {string} catalogo - El nombre del catálogo a obtener
     * @returns Observable con la respuesta de los catálogos de medios de transporte.
     */
  getEstado(catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260601/estado.json');
  }

  /**
   * Obtiene los datos del catálogo de claves SCIAN.
   * 
   * @param catalgo Nombre del catálogo.
   * @returns Observable con los datos de claves SCIAN.
   */
  getClaveScian(catalgo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260601/clave-scian.json');
  }

  /**
   * Obtiene los datos del catálogo de descripciones SCIAN.
   * 
   * @returns Observable con los datos de descripciones SCIAN.
   */
  getDescripcionScian(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260601/descripcion-scian.json');
  }

  /**
   * Obtiene los datos del catálogo de regímenes.
   * 
   * @param catalgo Nombre del catálogo.
   * @returns Observable con los datos de regímenes.
   */
  getRegimenes(catalgo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260601/regimenes.json');
  }

  /**
   * Obtiene los datos del catálogo de aduanas.
   * 
   * @param catalgo Nombre del catálogo.
   * @returns Observable con los datos de aduanas.
   */
  getAduanas(catalgo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260601/aduanas.json');
  }

  /**
   * Obtiene los datos del catálogo de clasificación de productos.
   * 
   * @param catalgo Nombre del catálogo.
   * @returns Observable con los datos de clasificación de productos.
   */
  getProductoClasificacion(catalgo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260601/producto-clasificacion.json');
  }

  /**
   * Obtiene los datos del catálogo de clasificación específica de productos.
   * 
   * @param catalgo Nombre del catálogo.
   * @returns Observable con los datos de clasificación específica de productos.
   */
  getEspecificoProductoClasificacion(catalgo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260601/especifico-producto-clasificacion.json');
  }

  /**
   * Obtiene los datos del catálogo de tipos de productos.
   * 
   * @param catalgo Nombre del catálogo.
   * @returns Observable con los datos de tipos de productos.
   */
  getTipoProducto(catalgo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260601/tipo-producto.json');
  }

  /**
   * Obtiene los datos del catálogo de países destino.
   * 
   * @param catalgo Nombre del catálogo.
   * @returns Observable con los datos de países destino.
   */
  getPaisDestino(catalgo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260601/pais-destino.json');
  }

  /**
   * Obtiene la lista de manifiestos desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de los manifiestos.
   */
  getManifiestos(): Observable<ManifiestosRespuesta> {
    return this.http.get<ManifiestosRespuesta>('assets/json/260601/manifiestos.json');
  }

  /**
   * Busca el RFC del representante legal desde un archivo JSON.
   * 
   * @returns Observable con los datos del representante legal.
   */
  buscarRfc(): Observable<RepresentanteLegalRespuesta> {
    return this.http.get<RepresentanteLegalRespuesta>('assets/json/260601/representante-legal.json');
  }

  /**
   * Obtiene los datos del catálogo de proveedores.
   * 
   * @returns Observable con los datos del catálogo de proveedores.
   */
  obtenerProveedorDatos(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>('assets/json/260601/proveedor-table.json');
  }

  /**
   * Obtiene los datos del crosslist de mercancías.
   * 
   * @returns Observable con los datos del crosslist de mercancías.
   */
  obtenerMercanciaCrosslist(): Observable<MercanciaCrossList> {
    return this.http.get<MercanciaCrossList>('assets/json/260601/mercancia-crosslist.json');
  }

  /**
   * Obtiene los datos del catálogo de países.
   * 
   * @param catalgo Nombre del catálogo.
   * @returns Observable con los datos del catálogo de países.
   */
  getPais(catalgo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260601/pais.json');
  }

  /**
   * Autocompleta la descripción de la fracción arancelaria.
   * 
   * @returns Observable con los datos de descripción de la fracción arancelaria.
   */
  autocompletarDescripcion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260601/descripcion-fraccion-arancelaria.json');
  }

  /**
   * Obtiene los datos del documentos seleccionados.
   * @returns Observable con los datos del documentos seleccionados.
   */
  obtenerDocumentosSeleccionados(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260601/documentos-seleccionados.json');
  }

  /**
   * Obtiene los datos del catálogo de países de origen.
   * 
   * @returns Observable con los datos del catálogo de países de origen.
   */
  obtenerScianTabla(): Observable<ScianTable[]> {
    return this.http.get<ScianTable[]>('assets/json/260601/scian-tabla.json')
    .pipe(map((res) => res));
      
  }
  /**
   * Obtiene los datos del catálogo de productos.
   * 
   * @returns Observable con los datos del catálogo de productos.
   */

  obtenerProducto(): Observable<ProductoTable[]> {
    return this.http.get<ProductoTable[]>('assets/json/260601/producto-tabla.json')
      .pipe(map((res) => res));
  }
  /**
   * @method obtenerSolicitudDatos
   * @description
   * Obtiene los datos de las solicitudes desde un archivo JSON.
   * Estos datos se utilizan para poblar la tabla de solicitudes en el componente de datos de la solicitud.
   * 
   * @returns {Observable<SolicitudTable[]>} Observable con un arreglo de datos de solicitudes.
   */
  obtenerSolicitudDatos(): Observable<SolicitudTable[]> {
    return this.http.get<SolicitudTable[]>('assets/json/260601/solicitudDatos.json')
      .pipe(map((res) => res));
  }

  getFabricanteTablaDatos(): Observable<Fabricante[]> {
    return this.http.get<Fabricante[]>('assets/json/260101/fabricante.json');
  }

}
