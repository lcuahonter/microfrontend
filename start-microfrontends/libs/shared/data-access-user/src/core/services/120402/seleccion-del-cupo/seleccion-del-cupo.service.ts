import { HttpCoreService } from '../../shared/http/http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeleccionDelCupoService {

  constructor( private http: HttpCoreService) { 
    // Lógica de inicialización si es necesario
  }

  getSeleccionDelCupo(): Observable<unknown> {
    return this.http.get('assets/json/120402/seleccion-del-cupo.json');
  }

  getRegimen(): Observable<unknown> {
    return this.http.get('assets/json/220201/regimen.json');
  }

  getTratado(): Observable<unknown> {
    return this.http.get('assets/json/110101/tratdos-dropdown.json');
  }

  getProducto(): Observable<unknown> {
    return this.http.get('assets/json/220202/nombre.json');
  }
}
