import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { TablaScianConfig } from '../../models/shared2606/datos-solicitud.model';
/**
 * Servicio para manejar y compartir datos relacionados con la tabla SCIAN.
 */
@Injectable({
  providedIn: 'root'
})

export class ScianDataService {
    /**
     * Subject para almacenar los datos de la tabla SCIAN.
     */
    private scianDataSubject = new BehaviorSubject<TablaScianConfig[]>([]);
    /**
     * Observable para suscribirse a los cambios en los datos de la tabla SCIAN.
     */
    public scianData$ = this.scianDataSubject.asObservable();
    /**
     * Actualiza los datos de la tabla SCIAN.
     * @param data - Nueva lista de datos de tipo `TablaScianConfig[]`.
     */
    updateScianData(data: TablaScianConfig[]): void {
        this.scianDataSubject.next(data);
    }
}