import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableBodyData } from '@libs/shared/data-access-user/src';

/**
 * Interface para representar la estructura completa de datos de la tabla de mercancías.
 */
interface MercanciaTableData {
  mercanciaTable: {
    tableHeader: string[];
    tableBody: TableBodyData[];
  };
}

/**
 * Servicio para obtener la tabla de mercancías desde un archivo JSON local.
 * Proporciona métodos para acceder a los datos de la tabla de mercancías utilizados en el trámite 103.
 */
@Injectable({
  providedIn: 'root'
})
export class MercanciaTableService {
  /**
   * Ruta al archivo JSON que contiene los datos de la tabla de mercancías.
   * @type {string}
   */
  private readonly jsonUrl = '/assets/json/103/mercancia-table.json';

  /**
   * Constructor del servicio MercanciaTableService.
   * @param http Cliente HTTP para realizar solicitudes al archivo JSON.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos de la tabla de mercancías desde el archivo JSON.
   * @returns {Observable<MercanciaTableData>} Observable con los datos de la tabla de mercancías.
   */
  getTable(): Observable<MercanciaTableData> {
    return this.http.get<MercanciaTableData>(this.jsonUrl);
  }
}
