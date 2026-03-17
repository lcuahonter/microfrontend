import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

import { ExtranjeroMoralResponse, SearchExtranjeroMoralParams } from './model/response/extranjero-moral.model';

@Injectable({
  providedIn: 'root'
})
export class ExtranjeroMoralSearchService {
  private MOCK_DATA: ExtranjeroMoralResponse[] = [
    { 
      denominacionRazonSocial: 'Aug Rath jun. GmbH', 
      domicilio: 'WALFISCHGASSE VIENA AUSTRIA (REPUBLICA DE)', 
      correoElectronico: 'vucem2.5@hotmail.com' 
    },
    { 
      denominacionRazonSocial: 'CHAMOTTE UND THONOFENFABRIK AUG. RATH JUN GMBH', 
      domicilio: 'WALFISCHGASSE VIENA', 
      correoElectronico: 'vucem2.5@hotmail.com' 
    },
    { 
      denominacionRazonSocial: 'ORGANISMO INTERNACIONAL REGIONAL DE SANIDAD AGROPECUARIA', 
      domicilio: '21 AVENIDA 12 GUATEMALA GUATEMALA (REPUBLICA DE)', 
      correoElectronico: 'vucem2.5@hotmail.com' 
    }
  ];

  /**
   * Busca extranjeros morales
   * @param params parámetros de búsqueda
   * @returns Observable<ExtranjeroMoralResponse[]>
   */
  search(params: SearchExtranjeroMoralParams): Observable<ExtranjeroMoralResponse[]> {
    let filtered = this.MOCK_DATA;
    
    if (params.denominacionRazonSocial) {
      const SEARCH_TERM = params.denominacionRazonSocial.toLowerCase();
      filtered = filtered.filter(item => item.denominacionRazonSocial.toLowerCase().includes(SEARCH_TERM));
    }
    
    return of(filtered).pipe(delay(500));
  }
}
