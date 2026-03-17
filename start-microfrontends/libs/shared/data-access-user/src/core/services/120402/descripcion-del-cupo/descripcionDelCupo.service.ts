import { HttpCoreService } from '../../shared/http/http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DescripcionDelCupoService {

  constructor( private http: HttpCoreService) {
    // Lógica de inicialización si es necesario
   }

  getDescripcionDelCupo(): Observable<unknown> {
    return this.http.get('assets/json/120402/descripcion-del-cupo.json');
  }

}
