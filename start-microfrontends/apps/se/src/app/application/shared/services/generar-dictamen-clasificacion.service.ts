import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';



/**
 * Servicio para compartir el estado del dictamen entre componentes no relacionados directamente
 * 
 * Permite que componentes como `app-generar-dictamen-clasificacion` emitan
 * una señal (por ejemplo, si el dictamen fue “No aceptado”)
 * y que otros componentes más profundos en la jerarquía (como `app-tratados`)
 * puedan reaccionar sin necesidad de propagar @Input/@Output.
 * 
 * Uso típico:
 *   - Llamar a `setNoAceptada(true)` desde el componente emisor.
 *   - Suscribirse a `noAceptada$` desde el componente receptor.
 */
@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class GenerarDictamenClasificacionService {

  /**
   * Subject que mantiene el valor actual de la bandera "No aceptada".
   * 
   * BehaviorSubject se usa en lugar de Subject normal para:
   *  - Conservar el último valor emitido.
   *  - Permitir que los nuevos suscriptores reciban el valor actual al instante.
   */
  private noAceptadaSubject: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);

  /**
   * Observable expuesto para que otros componentes puedan suscribirse
   * sin poder modificar el valor directamente.
   */
  public readonly noAceptada$: Observable<boolean | null> = this.noAceptadaSubject.asObservable();

  /**
   * Actualiza el estado de la bandera "No aceptada".
   * 
   * @param valor - true si el dictamen fue no aceptado, false si fue aceptado.
   */
  setNoAceptada(valor: boolean | null): void {
    this.noAceptadaSubject.next(valor);
  }

  /**
   * Retorna el valor actual de la bandera sin necesidad de suscribirse.
   * 
   * @returns boolean - valor actual de la bandera.
   */
  getNoAceptadaActual(): boolean | null {
    return this.noAceptadaSubject.getValue();
  }
}