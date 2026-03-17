import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

import { AcuseResolucionResponse, SearchAcuseResolucionParams } from './model/response/acuse-resolucion.model';

@Injectable({
  providedIn: 'root'
})
export class AcusesResolucionesService {
  private MOCK_DATA: AcuseResolucionResponse[] = [
    {
      folio: '0201100200420160815000200',
      tipoTramite: 'Validar inicialmente el certificado de origen para la exportación de mercancías a los países miembros de la ALADI',
      dependencia: 'SE-CIUDAD JUAREZ',
      fechaInicioTramite: '11/09/2024',
      sentidoResolucion: 'Aceptada',
      estatusResolucion: 'Autorizada'
    },
    {
      folio: '0201100200420160815000201',
      tipoTramite: 'Validar inicialmente el certificado de origen para la exportación de mercancías a los países miembros de la ALADI',
      dependencia: 'SE-CIUDAD JUAREZ',
      fechaInicioTramite: '11/09/2024',
      sentidoResolucion: 'Aceptada',
      estatusResolucion: 'Autorizada'
    },
    {
      folio: '0201100200420160815000237',
      tipoTramite: 'Validar inicialmente el certificado de origen para la exportación de mercancías a los países miembros de la ALADI',
      dependencia: 'SE-CIUDAD JUAREZ',
      fechaInicioTramite: '18/09/2024',
      sentidoResolucion: 'Aceptada',
      estatusResolucion: 'Autorizada'
    }
  ];

  /**
   * Busca acuses y resoluciones
   * @param params parámetros de búsqueda
   * @returns Observable<AcuseResolucionResponse[]>
   */
  search(params: SearchAcuseResolucionParams): Observable<AcuseResolucionResponse[]> {
    let filtered = this.MOCK_DATA;

    if (params.folio) {
      const SEARCH_FOLIO = params.folio;
      filtered = filtered.filter(item => item.folio.includes(SEARCH_FOLIO));
    }
    
    return of(filtered).pipe(delay(500));
  }
}
