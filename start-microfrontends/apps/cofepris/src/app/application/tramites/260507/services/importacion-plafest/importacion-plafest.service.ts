import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

/**
 * Servicio para gestionar la importación de documentos en el trámite 260507.
 * Proporciona métodos para obtener datos relacionados con la importación de documentos.
 */
@Injectable({
  providedIn: 'root'
})
export class ImportacionPlafestService {

  /**
   * Constructor del servicio.
   * @param http - Instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(
    private http: HttpClient
  ) { 
    // Constructor vacío, se utiliza para la inyección de dependencias.
  }

  /**
   * Obtiene los datos del documentos seleccionados.
   * @returns Observable con los datos del documentos seleccionados.
   */
  obtenerDocumentosSeleccionados(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260507/documentos-seleccionados.json');
  }
}
