// eslint-disable-next-line @nx/enforce-module-boundaries
import {Catalogo} from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

 
@Injectable({
  providedIn: 'root',
})
export class RepresentacionFederalService {
  constructor(private http: HttpClient) {
    // Lógica de inicialización si es necesario
  }
 
  getEntidad(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/120402/entidad_federativa.json');
  }
 
  getRepresentacion(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/120402/representaciones.json');
  }
 
}
 