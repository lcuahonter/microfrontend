import { BehaviorSubject, Observable } from 'rxjs';
import { DatosDeLaTabla, RespuestaConsulta, RespuestaTramite } from '../models/datos-tramite.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConsultaAvisoAcreditacionService {

  /**
   * Fuente observable para la fila seleccionada en la tabla.
   * 
   * Este Subject emite objetos de tipo `DatosDeLaTabla` que representan 
   * la información de la fila seleccionada. Puede ser utilizado para 
   * notificar a otros componentes o servicios sobre cambios en la selección.
   */
  public selectedRowSource = new BehaviorSubject<DatosDeLaTabla[]>([]);


  /**
   * Observable que emite los datos del formulario seleccionados.
   * 
   * @type {Observable<any>} Observable que proporciona los datos de la fila seleccionada.
   */
  formData$ = this.selectedRowSource.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de documentos a partir de un catálogo especificado.
   *
   * Esta función realiza una petición HTTP GET para obtener un archivo JSON
   * ubicado en la ruta `assets/json/31501/` correspondiente al nombre del catálogo.
   *
   * @param catalogo - El nombre del archivo de catálogo (sin la extensión .json) que se desea cargar.
   * @returns Un Observable que emite la respuesta del trámite (`RespuestaTramite`) con los datos del catálogo.
   */
  getListaDeDocumentos(catalogo: string): Observable<RespuestaTramite> {
    return this.http.get<RespuestaTramite>(
      `assets/json/32101/${catalogo}.json`
    );
  }

    /**
     * Obtiene los datos de una tabla específica desde un archivo JSON localizado en los activos.
     *
     * @param tabla - El nombre de la tabla cuyo contenido se desea obtener.
     * @returns Un observable que emite un objeto de tipo `RespuestaContenedor` con los datos de la tabla.
     */
  getDatosDeTabla(): DatosDeLaTabla[] {
    return this.selectedRowSource.getValue();
  }

  /**
   * Establece una nueva fila actualizada y notifica a los suscriptores.
   * 
   * @param row - La fila de datos de la tabla que se va a establecer como seleccionada.
   */
  setUpdatedRow(row: DatosDeLaTabla[]): void {
    this.selectedRowSource.next(row);
  }

    /**
 * Obtiene los datos para la consulta del trámite.
 * @returns {Observable<RespuestaConsulta>} Observable con los datos de consulta.
 */
  getDatosConsulta(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>('assets/json/32101/consulta_32101.json');
  }
}
