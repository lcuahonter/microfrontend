import { ConsultaHistoricaRequest, ConsultaHistoricaResponse } from './model/consulta-historica.model';
import { Observable, delay, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsultaHistoricaService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene el historico de la fraccion
   * @param request 
   */
  getHistorico(request: ConsultaHistoricaRequest): Observable<ConsultaHistoricaResponse> {
    // Si la fracción es igual a la del ejemplo "61032301", devolvemos vacíos para mostrar el mensaje requerido
    if (request.fraccionArancelaria === '61032301') {
      return of({
        agregadas: [],
        disgregadas: []
      }).pipe(delay(500));
    }

    // Default mock data
    return of({
      agregadas: [
        { fecha: '2023-10-01', accion: 'Alta', detalle: 'Se agregó la fracción' }
      ],
      disgregadas: [
        { fecha: '2023-11-15', accion: 'Disgregación', detalle: 'Se disgregó de la partida 6103' }
      ]
    }).pipe(delay(500));
  }
}
