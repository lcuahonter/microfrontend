import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

import { 
  NoContribuyenteResponse, 
  SearchNoContribuyenteParams 
} from './model/response/no-contribuyente.model';

@Injectable({
  providedIn: 'root'
})
export class NoContribuyenteSearchService {
  private MOCK_DATA: NoContribuyenteResponse[] = [
    { 
      curp: 'AAL040923HDFRRN09', 
      nombre: 'JUAN PABLO RODRIGUEZ', 
      correoElectronico: 'juan.pablo@example.com' 
    },
    { 
      curp: 'BBBM800101MDFRRN01', 
      nombre: 'MARIA ELENA SANDOVAL', 
      correoElectronico: 'maria.elena@example.com' 
    }
  ];

  /**
   * Busca no contribuyentes
   * @param params parámetros de búsqueda
   * @returns Observable<NoContribuyenteResponse[]>
   */
  search(params: SearchNoContribuyenteParams): Observable<NoContribuyenteResponse[]> {
    const SEARCH_TERM = params.curp.toUpperCase();
    const RESULTS = this.MOCK_DATA.filter(item => item.curp.includes(SEARCH_TERM));
    
    return of(RESULTS).pipe(delay(500));
  }
}
