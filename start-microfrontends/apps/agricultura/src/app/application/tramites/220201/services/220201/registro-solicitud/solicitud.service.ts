import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SolicitudService {
    private idSolicitudSource = new Subject<string>();
    idSolicitud$ = this.idSolicitudSource.asObservable();

    emitirIdSolicitud(idSolicitud: string): void {
        this.idSolicitudSource.next(idSolicitud);
    }
}