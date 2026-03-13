import { FormaRespuestaDatos, InstalacionesPrincipalesRespuestaTabla } from '@libs/shared/data-access-user/src/core/models/6502/dato-comunes.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones relacionadas con el registro poblacional
 * en el trámite 6502. Proporciona métodos para obtener datos de instalaciones 
 * principales y datos del formulario desde archivos JSON.
 * 
 * @example
 * // Ejemplo de uso en un componente:
 * constructor(private registroService: RegistroPoblacionalService) {}
 * 
 * ngOnInit() {
 *   this.registroService.obtenerInstalacionesPrincipalesTablaDatos()
 *     .subscribe(data => console.log(data));
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class RegistroPoblacionalService {

  /**
   * Constructor del servicio
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene los datos de instalaciones principales desde un archivo JSON.
   * 
   * El archivo JSON debe estar ubicado en:
   * `assets/json/6502/instalacionesPrincipales-tabla.json`
   * 
   * @returns {Observable<InstalacionesPrincipalesRespuestaTabla>} 
   * Observable que emite los datos de instalaciones principales
   * 
   * @example
   * this.service.obtenerInstalacionesPrincipalesTablaDatos()
   *   .subscribe({
   *     next: (data) => this.procesarDatos(data),
   *     error: (err) => console.error(err)
   *   });
   */
  obtenerInstalacionesPrincipalesTablaDatos(): Observable<InstalacionesPrincipalesRespuestaTabla> {
    return this.http.get<InstalacionesPrincipalesRespuestaTabla>(
      'assets/json/6502/instalacionesPrincipales-tabla.json'
    );
  }

  /**
   * Obtiene los datos del formulario desde un archivo JSON.
   * 
   * El archivo JSON debe estar ubicado en:
   * `assets/json/6502/forma-datos.json`
   * 
   * @returns {Observable<formaRespuestaDatos>} 
   * Observable que emite los datos del formulario
   * 
   * @example
   * this.service.obtenerFormaDatos()
   *   .subscribe(formData => {
   *     this.formulario.patchValue(formData);
   *   });
   */
  obtenerFromaDatos(): Observable<FormaRespuestaDatos> {
    return this.http.get<FormaRespuestaDatos>(
      'assets/json/6502/forma-datos.json'
    );
  }
}