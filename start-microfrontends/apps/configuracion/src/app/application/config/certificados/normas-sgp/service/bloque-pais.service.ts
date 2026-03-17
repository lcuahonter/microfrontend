import { BloquePais, BloquePaisResponse } from './model/response/bloque-pais.model';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BloquePaisService {
  private mockData: BloquePais[] = [
    { id: 1, nombre: 'MACAO' },
    { id: 2, nombre: 'MACEDONIA (ANTIGUA REPUBLICA YUGOSLAVA DE)' },
    { id: 3, nombre: 'MADAGASCAR (REPUBLICA DE)' },
    { id: 4, nombre: 'MALASIA' },
    { id: 5, nombre: 'MALAWI (REPUBLICA DE)' },
    { id: 6, nombre: 'MALDIVAS (REPUBLICA DE)' },
    { id: 7, nombre: 'MALI (REPUBLICA DE)' },
    { id: 8, nombre: 'MALTA (REPUBLICA DE)' },
    { id: 9, nombre: 'MARRUECOS (REINO DE)' },
    { id: 10, nombre: 'MARTINICA (DEPARTAMENTO DE) (FRANCIA)' },
    { id: 11, nombre: 'MAURICIO' },
    { id: 12, nombre: 'MAURITANIA (REPUBLICA ISLAMICA DE)' },
    { id: 13, nombre: 'MAYOTTE' }
  ];

  /**
   * Obtiene los bloques/paises.
   * @param FILTRO - Filtro para buscar bloques/paises.
   * @param PAGE - Número de página.
   * @param SIZE - Tamaño de la página.
   * @returns Observable con la respuesta de la API.
   */
  getBloquesPaises(FILTRO: string, PAGE: number, SIZE: number): Observable<BloquePaisResponse> {
    const FILTERED = this.mockData.filter(item => 
      item.nombre.toLowerCase().includes(FILTRO.toLowerCase())
    );
    const START = (PAGE - 1) * SIZE;
    const END = START + SIZE;
    
    return of({
      data: FILTERED.slice(START, END),
      total: FILTERED.length
    }).pipe(delay(500));
  }
}
