import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

import { AlianzaPacificoResponse, SearchAlianzaPacificoParams } from './model/alianza-pacifico.model';

@Injectable({
  providedIn: 'root'
})
export class AlianzaPacificoService {
  private MOCK_DATA: AlianzaPacificoResponse[] = [
    {
      noCertificado: '2018-26-0090634',
      paisProcedencia: 'PERU (REPUBLICA DEL)',
      estadoCod: 'Recibido',
      estadoReemplazo: '',
      fechaExpedicion: '12/06/2018',
      noTransaccion: 'PE1206180000013',
      informacionAdicional: '',
      pdfUrl: 'pdf',
      xmlUrl: 'xml'
    },
    {
      noCertificado: '2018-26-0091521',
      paisProcedencia: 'PERU (REPUBLICA DEL)',
      estadoCod: 'Recibido',
      estadoReemplazo: '',
      fechaExpedicion: '13/06/2018',
      noTransaccion: 'PE1306180000001',
      informacionAdicional: '',
      pdfUrl: 'pdf',
      xmlUrl: 'xml'
    },
    {
      noCertificado: '2018-26-0091782',
      paisProcedencia: 'PERU (REPUBLICA DEL)',
      estadoCod: 'Recibido',
      estadoReemplazo: '',
      fechaExpedicion: '13/06/2018',
      noTransaccion: 'PE1306180000003',
      informacionAdicional: '',
      pdfUrl: 'pdf',
      xmlUrl: 'xml'
    }
  ];

  /**
   * Buscar certificado
   * @param params 
   * @returns 
   */
  search(params: SearchAlianzaPacificoParams): Observable<AlianzaPacificoResponse[]> {
    let filtered = this.MOCK_DATA;
    if (params.noCertificado) {
      const VALOR = params.noCertificado;
      filtered = filtered.filter(item => item.noCertificado.includes(VALOR));
    }
    return of(filtered).pipe(delay(500));
  }
}
