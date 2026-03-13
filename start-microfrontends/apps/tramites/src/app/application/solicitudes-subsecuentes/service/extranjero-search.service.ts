import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

import { ExtranjeroResponse, SearchExtranjeroParams } from './model/response/extranjero.model';

@Injectable({
  providedIn: 'root'
})
export class ExtranjeroSearchService {
  private MOCK_DATA: ExtranjeroResponse[] = [
    { 
      nombre: 'EDIL JAIME RODRIGUEZ CASTILLO', 
      domicilio: 'BARRIO LOURDES SAN SALVADOR EL SALVADOR (REPUBLICA DE)', 
      correo: 'vucem2.5@hotmail.com' 
    },
    { 
      nombre: 'EDWIN JAIME AYALA MARTINEZ', 
      domicilio: 'EL SALVADOR 1 EL SALVADOR', 
      correo: 'vucem2.5@hotmail.com' 
    },
    { 
      nombre: 'JAIME GARDUÑO REYES', 
      domicilio: '', 
      correo: 'vucem2.5@hotmail.com' 
    },
    { 
      nombre: 'JAIME ZAVALA', 
      domicilio: 'GRAN VÍA 6 JAPON URUGUAY (REPUBLICA ORIENTAL DEL)', 
      correo: 'vucem2.5@hotmail.com' 
    },
    { 
      nombre: 'JAIME VAQUERO', 
      domicilio: 'EL SALVADOR SN EL SALVADOR', 
      correo: 'vucem2.5@hotmail.com' 
    },
    { 
      nombre: 'JAIME ANTONIO DELGADO', 
      domicilio: '2 SN EL SALVADOR', 
      correo: 'vucem2.5@hotmail.com' 
    },
    { 
      nombre: 'JAIME LOPEZ CASTELAN', 
      domicilio: 'COL CENTRO ZARAGOZA PUEBLA ESTADOS UNIDOS DE AMERICA', 
      correo: 'vucem2.5@hotmail.com' 
    }
  ];

  /**
   * Busca extranjeros
   * @param params parámetros de búsqueda
   * @returns Observable<ExtranjeroResponse[]>
   */
  search(params: SearchExtranjeroParams): Observable<ExtranjeroResponse[]> {
    let filtered = this.MOCK_DATA;
    
    if (params.nombre) {
      const SEARCH_TERM = params.nombre.toLowerCase();
      filtered = filtered.filter(item => item.nombre.toLowerCase().includes(SEARCH_TERM));
    }
    
    return of(filtered).pipe(delay(500));
  }
}
