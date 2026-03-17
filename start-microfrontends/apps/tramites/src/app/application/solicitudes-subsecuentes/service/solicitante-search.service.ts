import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

export interface SolicitanteMock {
  rfc: string;
  nombre: string;
  correo: string;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitanteSearchService {
  private MOCK_DATA: SolicitanteMock[] = [
    { rfc: 'AAAA800101HHH', nombre: 'JUAN PEREZ GONZALEZ', correo: 'juan.perez@example.com' },
    { rfc: 'BBBB800101AAA', nombre: 'MARIA LOPEZ DIAZ', correo: 'maria.lopez@example.com' },
    { rfc: 'CCC800101A1A', nombre: 'EMPRESA SA DE CV', correo: 'contacto@empresa.com' },
    { rfc: 'DDD800101B2B', nombre: 'COMERCIALIZADORA MEXICANA', correo: 'info@comercializadora.mx' }
  ];

  /**
   * Busca por RFC
   * @param RFC RFC a buscar
   * @returns Observable<SolicitanteMock[]>
   */
  buscarPorRfc(RFC: string): Observable<SolicitanteMock[]> {
    const RESULTS = this.MOCK_DATA.filter(item => item.rfc.toUpperCase() === RFC.toUpperCase());
    // Simulamos un retraso de red
    return of(RESULTS).pipe(delay(500));
  }
}
