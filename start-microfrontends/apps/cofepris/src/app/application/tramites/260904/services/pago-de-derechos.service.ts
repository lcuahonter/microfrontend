import { BancoList } from '../modelos/pago-de-derechos.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class PagoDeDerechosService {
 
  constructor(private http:HttpClient) {
     // No se necesita lógica de inicialización adicional.
  }
 
  /**
 * Recupera la lista de bancos desde un archivo JSON almacenado.
 * El método devuelve un observable que contiene un arreglo de objetos BancoList.
 */
   onBancoList(): Observable<BancoList[]> {
        return this.http.get<BancoList[]>('assets/json/260904/bancoList.json');
      }
}