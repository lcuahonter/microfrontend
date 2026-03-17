import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para la gestión de operaciones relacionadas con el pago de derechos.
 * Proporciona métodos para recuperar catálogos y datos necesarios para el trámite.
 */
@Injectable({
  providedIn: 'root'
})
export class PagoDeDerechosService {

  /**
   * Inicializa una nueva instancia del servicio PagoDeDerechosService.
   * @param http Cliente HTTP de Angular para realizar solicitudes a recursos externos.
   */
  constructor(private http: HttpClient) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Recupera la lista de bancos desde un archivo JSON almacenado localmente.
   * @returns Observable que emite un arreglo de objetos Catalogo representando los bancos disponibles.
   */
  onBancoList(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260911/bancoList.json');
  }
}