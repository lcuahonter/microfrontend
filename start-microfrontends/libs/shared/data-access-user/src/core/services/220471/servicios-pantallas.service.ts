import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PantallasFormData } from '../../models/220401/servicios-pantallas.model';

@Injectable({
  providedIn: 'root'
})
/**
 * Este servicio se utiliza para almacenar los datos del formulario del trámite 110101.
 * pantallasFormData: almacenar los datos del formulario de los componentes secundarios
 * pantallasFormSubject: almacenar el asunto de los datos del formulario
 */
export class ServiciosPantallasService {
    /**
     * Esta variable se utiliza para almacenar los datos del formulario de las pantallas.
     */
    public pantallasFormData: PantallasFormData = {
        solict: [],
        datosDel: [],
        combinacionRequerida: [],
        unidads: [],
        datasGenerals: []
    };
    /**
     * Esta variable se utiliza para almacenar el asunto de los datos del formulario.
     */
    private pantallasFormSubject = new BehaviorSubject<PantallasFormData>(this.pantallasFormData);
    /**
     * Esta variable se utiliza para convertir el sujeto en observable.
     */
    public pantallasFormObservable$ = this.pantallasFormSubject.asObservable();
    /**
     * constructor de la clase
     * @param http: constructor de HttpClient
     */
    constructor(private http: HttpClient) { 
        // Lógica de inicialización si es necesario
    }

    /**
     * Este método se utiliza para configurar todos los datos del formulario de los componentes.
     * @param key: clave del formulario
     * @param data: datos del formulario
     */
    setPantallasFormData(key: string, data: object):void {
        this.pantallasFormData = {
            ...this.pantallasFormData,
            [key]: data
        };
    }

    /**
     * Este método se utiliza para configurar los datos del formulario en el oyente del tema.
     * @param data: datos del formulario
     */
    setPantallasFormDataSubject(data: PantallasFormData):void {
        this.pantallasFormSubject.next(data);
    }
}
