import { BehaviorSubject } from 'rxjs';
import { ComercializadoresProductosResponse } from '../models/response/comercializadores-productos-response.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MercanciaStateService {
 /**
   * BehaviorSubject que mantiene el estado actual de la mercancía.
   * 
   * - Inicializa en `null` hasta que se establece un valor.
   * - Siempre expone el último valor emitido.
   */
  private mercanciaSubject = new BehaviorSubject<ComercializadoresProductosResponse | null>(null);

  /**
   * Observable público para que los componentes puedan suscribirse
   * y reaccionar a los cambios en el estado de la mercancía.
   */
  mercancia$ = this.mercanciaSubject.asObservable();

  /**
   * Actualiza el estado de la mercancía.
   *
   * @param data - Objeto con la información de mercancía obtenido desde el backend.
   */
  setMercancia(data: ComercializadoresProductosResponse): void {
    this.mercanciaSubject.next(data);
  }
}
