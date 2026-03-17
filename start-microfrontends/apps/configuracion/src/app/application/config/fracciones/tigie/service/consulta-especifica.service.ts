import { Observable, delay, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { API_GET_CONSULTA_ESPECIFICA, API_GET_DESCARGAR_TIGIE } from './model/api-router';
import { ConsultaEspecificaRequest, ConsultaEspecificaResponse, TigieRow } from './model/consulta-especifica.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaEspecificaService {
  private urlServer = 'URL_MOCK_ENV'; // Replace with real env URL if needed

  constructor(private http: HttpClient) {}

  /**
   * Realiza la consulta especifica
   * @param request 
   */
  postConsultaEspecifica(request: ConsultaEspecificaRequest): Observable<ConsultaEspecificaResponse> {
    // Si la fracción es "asdasd12", simulamos error de validación
    if (request.fraccionArancelaria === 'asdasd12') {
      return of({
        codigo: 'error',
        mensaje: `1. (${request.fraccionArancelaria}) no es una Fracción Arancelaria válida`,
        datos: []
      }).pipe(delay(500));
    }

    // Respuesta exitosa mock
    return of({
      codigo: 'success',
      mensaje: 'Consulta realizada con éxito',
      datos: []
    }).pipe(delay(500));
  }

  /**
   * Obtiene el reporte de tigie
   */
  getTigieReport(): Observable<TigieRow[]> {
    // Simulamos datos para el excel
    return of([
      { fraccionArancelaria: '61032301', tipoOperacion: 'EXPORTACIÓN', tipoUMT: 'Pieza', fraccionExenta: 'S', fraccionProhibida: 'N', fraccionDerogada: 'NO', descripcion: 'De fibras sinteticas.', impuestoAdValorem: '' },
      { fraccionArancelaria: '61032301', tipoOperacion: 'IMPORTACIÓN', tipoUMT: 'Pieza', fraccionExenta: 'N', fraccionProhibida: 'N', fraccionDerogada: 'NO', descripcion: 'De fibras sinteticas.', impuestoAdValorem: '' },
      { fraccionArancelaria: '73065001', tipoOperacion: 'EXPORTACIÓN', tipoUMT: 'Kilogramo', fraccionExenta: 'S', fraccionProhibida: 'N', fraccionDerogada: 'NO', descripcion: 'De hierro o acero...', impuestoAdValorem: '' }
    ]).pipe(delay(1000));
  }
}
