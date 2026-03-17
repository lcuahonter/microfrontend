import { HttpCoreService } from '../../shared/http/http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportadorAutorizadoService {

  constructor(private http: HttpCoreService) { 
    // Lógica de inicialización si es necesario
  }


  getExportadorAutorizado(): Observable<{ label: string; value: string | number }[]> {
      return this.http.get('./assets/json/110102/exportadorautorizado.json');
    }

    getExportadorAutorizadoJPN(): Observable<{ label: string; value: string | number }[]> {
      return this.http.get('./assets/json/110102/exportadorautorizadojpn.json');
    }
    
}
