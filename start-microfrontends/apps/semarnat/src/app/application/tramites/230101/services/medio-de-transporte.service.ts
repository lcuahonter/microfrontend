import { Catalogo } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Solicitud230101State, Solicitud230101Store } from '../estados/tramites/tramites230101.store';

/**
 * Servicio para gestionar los medios de transporte.
 * 
 * Este servicio proporciona métodos para obtener datos relacionados con los medios de transporte
 * desde un archivo JSON alojado en los activos de la aplicación.
 * @providedIn `root`
 */
@Injectable({
  providedIn: 'root',
})
export class MediodetransporteService {
  
  /**
   * URL del archivo JSON que contiene los datos de medios de transporte.
   * @type {string}
   */
  private readonly url = './assets/json/230101/mediodetransporte.json';

  /**
   * Constructor del servicio MediodetransporteService.
   * @param http Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient, private solicitud230101Store: Solicitud230101Store) {}
  /**
   * Método para actualizar el estado del formulario con los datos proporcionados.
   * @param DATOS Objeto que contiene los datos de la solicitud 230101.
   */
  actualizarEstadoFormulario(DATOS: Solicitud230101State): void {
     this.solicitud230101Store.setRegimen(DATOS.regimen);
     this.solicitud230101Store.setTipoProducto(DATOS.tipoProducto);
     this.solicitud230101Store.setPaisProcedencia(DATOS.paisProcedencia);
     this.solicitud230101Store.setClasificacionMercancia(DATOS.clasificacionMercancia);
     this.solicitud230101Store.setFraccionArancelaria(DATOS.fraccionArancelaria);   
     this.solicitud230101Store.setDescFraccionArancelaria(DATOS.descFraccionArancelaria); 
     this.solicitud230101Store.setCantidad(DATOS.cantidad);
     this.solicitud230101Store.setCantidadLetra(DATOS.cantidadLetra);
     this.solicitud230101Store.setGenero(DATOS.genero);
     this.solicitud230101Store.setEspecie(DATOS.especie);
     this.solicitud230101Store.setNombreComun(DATOS.nombreComun);   
     this.solicitud230101Store.setDescripcionProducto(DATOS.descripcionProducto); 
     this.solicitud230101Store.setCantidadUMC(DATOS.cantidadUMC);
     this.solicitud230101Store.setManifiestosYdesc(DATOS.manifiestosYdesc);
     this.solicitud230101Store.setClaveDeReferencia(DATOS.claveDeReferencia);
     this.solicitud230101Store.setCadenaPagoDependencia(DATOS.cadenaPagoDependencia);
     this.solicitud230101Store.setBanco(DATOS.banco);   
     this.solicitud230101Store.setllaveDePago(DATOS.llaveDePago); 
     this.solicitud230101Store.setFecPago(DATOS.fecPago);
     this.solicitud230101Store.setImpPago(DATOS.impPago);
    
  }
  /**
   * @descripcion Obtiene los datos de consulta desde un archivo JSON.
   * @retorna Un observable que emite un objeto de tipo `Solicitud230101State`.
   */
  getConsultaData(): Observable<Solicitud230101State> {
    return this.http.get<Solicitud230101State>('assets/json/230101/consulta.json');
  }

  /**
   * @descripcion Obtiene una lista de medios de transporte desde el servidor.
   * @retorna Un observable que emite un arreglo de objetos de tipo `Catalogo`.
   */
  getMedioDeTransporte(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(this.url);
  }
}
