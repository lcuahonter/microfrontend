import { BehaviorSubject, Observable } from 'rxjs';
import { Catalogo, CatalogoResponse } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Pantallas220401Service {

  constructor(private http: HttpClient) {
    //constructor
   }
   private dropdownState = new BehaviorSubject<{ [key: string]: unknown }>({});
   getState(): Observable<{[key: string]: unknown}> {
    return this.dropdownState.asObservable();
  }

  setState(key: string, value: unknown): void {
    const CURRENT_STATE = this.dropdownState.value;
    CURRENT_STATE[key] = value;
    this.dropdownState.next(CURRENT_STATE);
  }
   getDelegacionesData(): Observable<CatalogoResponse[]> {
    return this.http.get<CatalogoResponse[]>('assets/json/220401/delegaciones.json');
  }
  getEspecieData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/220401/delegaciones.json');
  }
  getFuncionZootecnica(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/220401/delegaciones.json');
  }
  getMercancia(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/220401/delegaciones.json');
  }
  getlaodPaisDestino(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/220401/delegaciones.json');
  }
  getNombreEstablecimiento(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/220401/delegaciones.json');
  }
  getTipoActividad(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/220401/delegaciones.json');
  }
  getAduanaSalida(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/220401/delegaciones.json');
  }
  getOisaSalida(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/220401/delegaciones.json');
  }
  getRegimenMercancia(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/220401/delegaciones.json');
  }
  getPaisOrigen(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/220401/delegaciones.json');
  }
}