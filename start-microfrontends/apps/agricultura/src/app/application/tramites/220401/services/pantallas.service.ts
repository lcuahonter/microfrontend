import { CatalogoResponse } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TipoDeCertificoOption } from "../models/tipoCertificoOption.model";

@Injectable({
    providedIn: 'root'
  })

export class DetosDelService {

    constructor( private http:HttpClient){}
      /**
       * @method getEstadoData
       * @description Obtiene los datos de estado desde un archivo JSON.
       * @returns Observable con los datos del catálogo de estados.
       */
    getEstadoData(): Observable<CatalogoResponse[]> {
        return this.http.get<CatalogoResponse[]>('assets/json/220401/estatos.json');
      }
    
      /**
       * @method 
       * @description Obtiene los datos del certificado desde un archivo JSON.
       * @returns Observable con los datos del catálogo de certificados.
       */
      getCertificadoData(): Observable<TipoDeCertificoOption[]> {
        return this.http.get<TipoDeCertificoOption[]>('assets/json/220401/certificado1.json');
      }

      /**
       * @method 
       * @description Obtiene los datos del certificado desde un archivo JSON.
       * @returns Observable con los datos del catálogo de certificados.
       */
      getCertificado(): Observable<TipoDeCertificoOption[]> {
        return this.http.get<TipoDeCertificoOption[]>('assets/json/220401/certificado2.json');
      }
  
}