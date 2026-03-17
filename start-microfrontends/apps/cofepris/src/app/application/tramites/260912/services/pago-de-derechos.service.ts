import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para la gestión de pagos de derechos.
 * 
 * Este servicio se encarga de proporcionar funcionalidades relacionadas
 * con el proceso de pago de derechos, incluyendo la obtención de catálogos
 * de bancos y otras operaciones financieras necesarias.
 * 
 * @class PagoDeDerechosService
 * @injectable
 * @since 1.0.0
 * @author Equipo de Desarrollo
 * @example
 * ```typescript
 * constructor(private pagoService: PagoDeDerechosService) {}
 * 
 * ngOnInit() {
 *   this.pagoService.onBancoList().subscribe(bancos => {
 *     console.log('Lista de bancos:', bancos);
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class PagoDeDerechosService {

  /**
   * Constructor del servicio PagoDeDerechosService.
   * 
   * Inicializa el servicio con las dependencias necesarias para
   * realizar operaciones HTTP y gestionar los pagos de derechos.
   * 
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones HTTP
   * @memberof PagoDeDerechosService
   * @since 1.0.0
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por el inyector de dependencias de Angular
   * const service = new PagoDeDerechosService(httpClient);
   * ```
   */
  constructor(private http: HttpClient) { 
     // No se necesita lógica de inicialización adicional.
  }

  /**
   * Recupera la lista de bancos desde un archivo JSON almacenado.
   * 
   * Este método realiza una petición HTTP GET para obtener el catálogo
   * completo de bancos disponibles para el proceso de pago de derechos.
   * Los datos se obtienen desde un archivo JSON estático ubicado en
   * la carpeta de assets del proyecto.
   * 
   * @method onBancoList
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo
   *                                   que representan la información de los bancos disponibles
   * @memberof PagoDeDerechosService
   * @since 1.0.0
   * @throws {HttpErrorResponse} Cuando ocurre un error en la petición HTTP
   * @example
   * ```typescript
   * // Uso básico del método
   * this.pagoService.onBancoList().subscribe({
   *   next: (bancos: Catalogo[]) => {
   *     console.log('Bancos obtenidos:', bancos);
   *     this.bancos = bancos;
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener bancos:', error);
   *   }
   * });
   * ```
   * @example
   * ```typescript
   * // Uso con async/await
   * try {
   *   const bancos = await this.pagoService.onBancoList().toPromise();
   *   this.procesarBancos(bancos);
   * } catch (error) {
   *   this.manejarError(error);
   * }
   * ```
   */
   onBancoList(): Observable<Catalogo[]> {
        return this.http.get<Catalogo[]>('assets/json/260912/bancoList.json');
      }
}