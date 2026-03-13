import { CONTINUAR } from "./permiso-cites.enum";

export const MOVIMIENTO_LABEL = {
    tituluDeLaIzquierda: 'Movimientos disponibles:',
    derecha: 'Movimientos seleccionados*:',
}


export const MOVIMIENTO_BOTONS = [
    {
        btnNombre: 'Agregar selección',
        class: 'btn-default fixed-width-button',
        funcion: ():void => agregar(CONTINUAR),
    },
    {
        btnNombre: 'Restar selección',
        class: 'btn-danger fixed-width-button',
        funcion: ():void => quitar(''),
    },
    {
        btnNombre: 'Restar todos',
        class: 'btn-default fixed-width-button',
        funcion: ():void => quitar(CONTINUAR),
    },
];

function agregar(tipo: string): void {
    if (tipo === CONTINUAR) {
        // do nothing.
    }
}

function quitar(tipo: string = ''): void {
    if (tipo === CONTINUAR) {
        // do nothing.
    }
}