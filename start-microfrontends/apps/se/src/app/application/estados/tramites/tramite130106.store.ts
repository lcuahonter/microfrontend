import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { PartidasDeLaMercanciaModelo } from '../../shared/models/partidas-de-la-mercancia.model';


export interface Solicitud130106State {
    idSolicitud: number | null;
    regimen: string;
    clasificacion: string;
    solicitudDescripcion: string
    fraccion: string
    cantidad: string;
    factura: string;
    umt: string;
    defaultSelect: string;
    defaultProducto: string;
    mercanciaCantidad: string;
    mercanciaFactura: string;
    descripcion: string;
    especifico: string;
    justificacion: string;
    observaciones: string;
    entidad: string;
    representacion: string;
    bloque: string;
    disponible: string;
    seleccionado: string;
    solicitud: string;
    producto: string;
    selectRangoDias: string[];
    tableBodyData: PartidasDeLaMercanciaModelo[];
    valorPartidaUSD: number;
    unidadMedida: string;
    filaSeleccionada: PartidasDeLaMercanciaModelo[];
    cantidadPartidasDeLaMercancia: string;
    valorPartidaUSDPartidasDeLaMercancia: string;
    descripcionPartidasDeLaMercancia: string;
    valorFacturaUSD: string;
    usoEspecifico: string;
    justificacionImportacionExportacion: string;
    mostrarTabla: boolean;
    cantidadTotal: string;
    valorTotalUSD: string;
  fechasSeleccionadas: string[];
}

export function createInitialState(): Solicitud130106State {
    return {
        idSolicitud: 0,
        regimen: '',
        clasificacion: '',
        solicitudDescripcion: '',
        fraccion: '',
        cantidad: '',
        factura: '',
        umt: '',
        defaultSelect: 'Inicial',
        defaultProducto: 'Nuevo',
        mercanciaCantidad: '',
        mercanciaFactura: '',
        descripcion: '',
        especifico: '',
        justificacion: '',
        observaciones: '',
        entidad: '',
        representacion: '',
        bloque: '',
        disponible: '',
        seleccionado: '',
        solicitud: '',
        producto: '',
        selectRangoDias: [''],
        tableBodyData: [],
        filaSeleccionada: [],
        mostrarTabla: false,
        valorPartidaUSD: 0,
        unidadMedida: '',
        cantidadPartidasDeLaMercancia: '',
        valorPartidaUSDPartidasDeLaMercancia: '',
        descripcionPartidasDeLaMercancia: '',
        valorFacturaUSD: '',
        usoEspecifico: '',
        justificacionImportacionExportacion: '',
        cantidadTotal: '',
        valorTotalUSD: '',
        fechasSeleccionadas: [],

    };
}
@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'tramite130106', resettable: true })
export class Tramite130106Store extends Store<Solicitud130106State> {

    constructor() {
        super(createInitialState());
    }


    public setFraccion(fraccion: string): void {
        this.update((state) => ({
            ...state,
            fraccion,
        }));
    }
    public setCantidad(cantidad: string): void {
        this.update((state) => ({
            ...state,
            cantidad,
        }));
    }
    public setFactura(factura: string): void {
        this.update((state) => ({
            ...state,
            factura,
        }));
    }
    public setUmt(umt: string): void {
        this.update((state) => ({
            ...state,
            umt,
        }));
    }
    public setMercanciaCantidad(mercanciaCantidad: string): void {
        this.update((state) => ({
            ...state,
            mercanciaCantidad,
        }));
    }
    public setMercanciaFactura(mercanciaFactura: string): void {
        this.update((state) => ({
            ...state,
            mercanciaFactura,
        }));
    }
    public setDescripcion(descripcion: string): void {
        this.update((state) => ({
            ...state,
            descripcion,
        }));
    }
    public setEspecifico(especifico: string): void {
        this.update((state) => ({
            ...state,
            especifico,
        }));
    }
    public setJustificacion(justificacion: string): void {
        this.update((state) => ({
            ...state,
            justificacion,
        }));
    }
    public setObservaciones(observaciones: string): void {
        this.update((state) => ({
            ...state,
            observaciones,
        }));
    }
    public setEntidad(entidad: string): void {
        this.update((state) => ({
            ...state,
            entidad,
        }));
    }
    public setRepresentacion(representacion: string): void {
        this.update((state) => ({
            ...state,
            representacion,
        }));
    }
    public setBloque(bloque: string): void {
        this.update((state) => ({
            ...state,
            bloque,
        }));
    }

    public setRegimen(regimen: string): void {
        this.update((state) => ({
            ...state,
            regimen,
        }));
    }

    public setClasificacion(clasificacion: string): void {
        this.update((state) => ({
            ...state,
            clasificacion,
        }));
    }

    public setSolicitudDescripcion(solicitudDescripcion: string): void {
        this.update((state) => ({
            ...state,
            solicitudDescripcion,
        }));
    }
    public setDisponible(disponible: string): void {
        this.update((state) => ({
            ...state,
            disponible,
        }));
    }
    public setSeleccionado(seleccionado: string): void {
        this.update((state) => ({
            ...state,
            seleccionado,
        }));
    }

    public setSolicitud(solicitud: string): void {
        this.update((state) => ({
            ...state,
            solicitud,
        }));
    }
    public setProducto(producto: string): void {
        this.update((state) => ({
            ...state,
            producto,
        }));
    }
    updateSelectRangoDias(selectRangoDias: string[]): void {
        this.update({ selectRangoDias });
    }

    /**
* Guarda el ID de la solicitud en el estado.
*
* @param idSolicitud - El ID de la solicitud que se va a guardar.
*/
    public setIdSolicitud(idSolicitud: number | null): void {
        this.update((state) => ({
            ...state,
            idSolicitud,
        }));
    }
    /**
     * Actualiza el estado del store con los valores proporcionados.
     * Valores a actualizar en el estado.
     */
    public actualizarEstado(valores: Partial<Solicitud130106State>): void {
        this.update((state) => ({
            ...state,
            ...valores,
        }));
    }

}



