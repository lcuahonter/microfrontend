import { Store, StoreConfig } from "@datorama/akita";
import { Injectable } from "@angular/core";

/**
 * Estado para la información de Consultaio obtenida del inicio de sesión
 */
export interface SubsecuenteIoState {
    folioTramite: string;
    tipoDeTramite: string;
    id_solicitud: string;
}

/**
 * Creación del estado inicial para el Consultaio
 * @returns SubsecuenteIoState
 */
export function createSubsecuenteInitialState(): SubsecuenteIoState {
    return {
        folioTramite: '',
        id_solicitud: '',
        tipoDeTramite: ''
    };
}

@Injectable({
    providedIn: 'root'
})
@StoreConfig({ name: 'SubsecuenteIo', resettable: true, })
export class SubsecuenteIoStore extends Store<SubsecuenteIoState> {
    constructor() {
        super(createSubsecuenteInitialState());
    }



    /**
  * Guarda la información del SubsecuenteIo en el estado
  * @param folioTramite
  * @param id_solicitud
  * @param tipoDeTramite
  */
    public setState(folioTramite: string, id_solicitud: string, tipoDeTramite: string): void {
        this.update(state => ({
            ...state,
            folioTramite,
            tipoDeTramite,
            id_solicitud
        }));
    }
}
