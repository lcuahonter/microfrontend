import { FormularioMovilizacion } from '../../220701/modelos/importacion-de-acuicultura.module';
import { FormularioPago } from '../../220701/modelos/importacion-de-acuicultura.module';
import { Injectable } from '@angular/core';

import { DatosMercancia220701 } from '../../220701/modelos/importacion-de-acuicultura.module';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

import { Agricultura } from '../../220701/modelos/importacion-de-acuicultura.module';
import { createDatosState } from '../../220701/modelos/importacion-de-acuicultura.module';




@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'importacion-de-Agricultura', resettable: true })
/**
 * Tienda para gestionar el estado de la importación de agricultura.
 * Proporciona métodos para actualizar y restablecer el estado relacionado con los formularios y datos de mercancía.
 */
export class AgriculturaStore extends Store<Agricultura> {
    constructor() {
        super(createDatosState());
    }

    /**
     * Actualiza el estado con la información del formulario de pago.
     * @param {FormularioPago} formularioPago - Datos del formulario de pago.
     */
    public actualizarFormularioPago(formularioPago: FormularioPago): void {
        this.update(state => ({
            ...state,
            formularioPago, // Envuelve los datos en un array
        }));
    }

    /**
     * Actualiza el estado con la información del formulario de movilización.
     * @param {FormularioMovilizacion} formularioMovilizacion - Datos del formulario de movilización.
     */
    public actualizarFormularioMovilizacion(formularioMovilizacion: FormularioMovilizacion): void {
        this.update(state => ({
            ...state,
            formularioMovilizacion, // Envuelve los datos en un array
        }));
    }

    /**
     * Actualiza el estado con la información de los datos de mercancía.
     * @param {DatosMercancia220701} datosMercancia - Datos relacionados con la mercancía.
     */
    public actualizarDatosMercancia(datosMercancia: DatosMercancia220701): void {
        this.update(state => ({
            ...state,
            datosMercancia
        }));
    }

    /**
     * Restablece el estado a su estado inicial.
     * Limpia todos los datos almacenados en la tienda.
     */
    public limpiarFormulario(): void {
        this.reset();
    }

    /**
     * Actualiza el estado de validación de las formas.
     * @param {{ [key: string]: boolean }} updatedFormaValida - Objeto que contiene las validaciones actualizadas.
     */
    public actualizarformaValida(updatedFormaValida: { [key: string]: boolean }): void {
        this.update(state => ({
            ...state,
            formaValida: {
                ...state.formaValida,
                ...updatedFormaValida,
            }
        }));
    }

}
