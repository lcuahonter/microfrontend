/**
 * @file Servicio para manejar el estado de Aviso de Calidad.
 * Este archivo define el estado, el estado inicial y las funciones para actualizar el estado.
 */

import { Store, StoreConfig } from '@datorama/akita'; // Importa Store y StoreConfig de Akita para manejar el estado.
import { Injectable } from '@angular/core'; // Importa el decorador Injectable de Angular.

/**
 * @interface SolicitudState
 * Representa el estado de la solicitud en el sistema.
 */
export interface SolicitudState {
    /**
     * @property {string} claveReferencia
     * Referencia de la solicitud.
     */
    claveReferencia: string;

    /**
     * @property {string} cadenaDependencia
     * Cadena de dependencia asociada a la solicitud.
     */
    cadenaDependencia: string;

    /**
     * @property {string} banco
     * Información del banco relacionado.
     */
    banco: string;

    /**
     * @property {string} llavePago
     * Llave única de la solicitud.
     */
    llavePago: string;

    /**
     * @property {string} fechaPago
     * Fecha del pago relacionado con la solicitud.
     */
    fechaPago: string;

    /**
     * @property {string} importePago
     * Importe relacionado con la solicitud.
     */
    importePago: string;

    rfcDel: string; // RFC del establecimiento.
    denominacionRazonSocial: string; // Denominación del establecimiento.
    correoElectronico: string; // Correo electrónico del establecimiento.
    codigoPostal: string; // Código postal del establecimiento.
    estado: string; // Estado del establecimiento.
    muncipio: string; // Municipio del establecimiento.
    localidad: string; // Localidad del establecimiento.
    colonia: string; // Colonia del establecimiento.
    calle: string; // Calle del establecimiento.
    lada: string; // Lada del establecimiento.
    telefono: string; // Teléfono del establecimiento.
    avisoCheckbox: boolean; // Checkbox de aviso.
    licenciaSanitaria: string; // Licencia sanitaria del establecimiento.
    claveScianModal: string; // Clave SCIAN seleccionada en el modal.
    claveDescripcionModal: string; // Descripción de la clave SCIAN seleccionada en el modal.
    nombreComercial: string; // Nombre comercial del producto o establecimiento.
    nombreComun: string; // Nombre común del producto.
    nombreCientifico: string; // Nombre científico del producto.
    usoEspecifico: string; // Uso específico del producto.
    estadoFisico: string; // Estado físico del producto.
    fraccionArancelaria: string; // Fracción arancelaria del producto.
    descripcionFraccion: string; // Descripción de la fracción arancelaria.
    cantidadUMT: string; // Cantidad en unidad de medida de trabajo.
    UMT: string; // Unidad de Medida de Trabajo.
    cantidadUMC: string; // Cantidad en unidad de medida de comercialización.
    UMC: string; // Unidad de Medida de Comercialización.
    numeroCas: string; // Número CAS del producto.
    porcentajeConcentracion: string; // Porcentaje de concentración del producto.
    clasificacionToxicologica: string; // Clasificación toxicológica del producto.
    objetoImportacion: string; // Objeto de importación.
}

/**
 * @function createInitialState
 * Crea el estado inicial de la solicitud.
 * @returns {SolicitudState} El estado inicial con valores vacíos.
 */
export function createInitialState(): SolicitudState {
    return {
        claveReferencia: '', // Inicializa claveReferencia como una cadena vacía.
        cadenaDependencia: '', // Inicializa cadenaDependencia como una cadena vacía.
        banco: '', // Inicializa banco como una cadena vacía.
        llavePago: '', // Inicializa llavePago como una cadena vacía.
        fechaPago: '', // Inicializa fechaPago como una cadena vacía.
        importePago: '', // Inicializa importePago como una cadena vacía.
        rfcDel: '', // Inicializa rfcdel como una cadena vacía.
        denominacionRazonSocial: '', // Inicializa denominacion como una cadena vacía.
        correoElectronico: '', // Inicializa correoElectronico como una cadena vacía.
        codigoPostal: '', // Inicializa codigoPostal como una cadena vacía.
        estado: '', // Inicializa estado como una cadena vacía.
        muncipio: '', // Inicializa muncipio como una cadena vacía.
        localidad: '', // Inicializa localidad como una cadena vacía.
        colonia: '', // Inicializa colonia como una cadena vacía.
        calle: '', // Inicializa calle como una cadena vacía.
        lada: '', // Inicializa lada como una cadena vacía.
        telefono: '', // Inicializa telefono como una cadena vacía.
        avisoCheckbox: false, // Inicializa avisoCheckbox como falso.
        licenciaSanitaria: '', // Inicializa licenciaSanitaria como una cadena vacía.
        claveScianModal: '',
        claveDescripcionModal: '',
        nombreComercial: '',
        nombreComun: '',
        nombreCientifico: '',
        usoEspecifico: '',
        estadoFisico: '',
        fraccionArancelaria: '',
        descripcionFraccion: '',
        cantidadUMT: '',
        UMT: '',
        cantidadUMC: '',
        UMC: '',
        numeroCas: '',
        porcentajeConcentracion: '',
        clasificacionToxicologica: '',
        objetoImportacion: '',
        };
}

/**
 * @Injectable Marca esta clase como un servicio que puede ser inyectado en otros componentes o servicios.
 * @providedIn 'root' Indica que este servicio está disponible en toda la aplicación.
 */
@Injectable({
    providedIn: 'root',
})

/**
 * @StoreConfig Configuración del store.
 * @name 'AvisocalidadStore' Nombre del store.
 * @resettable true Indica que el estado puede ser reiniciado.
 */
@StoreConfig({ name: 'AvisocalidadStore', resettable: true })

/**
 * @class AvisocalidadStore
 * Clase que extiende Store para manejar el estado de Aviso de Calidad.
 */
export class AvisocalidadStore extends Store<SolicitudState> {
    /**
     * @constructor
     * Inicializa el store con el estado inicial.
     */
    constructor() {
        super(createInitialState()); // Llama a la función para crear el estado inicial.
    }

    /**
     * @method setclaveReferencia
     * Actualiza el valor de claveReferencia en el estado.
     * @param {string} claveReferencia Nuevo valor para claveReferencia.
     */
    public setclaveReferencia(claveReferencia: string): void {
        this.update((state) => ({
            ...state, // Mantiene el resto del estado sin cambios.
            claveReferencia, // Actualiza claveReferencia.
        }));
    }

    /**
     * @method setcadenaDependencia
     * Actualiza el valor de cadenaDependencia en el estado.
     * @param {string} cadenaDependencia Nuevo valor para cadenaDependencia.
     */
    public setcadenaDependencia(cadenaDependencia: string): void {
        this.update((state) => ({
            ...state,
            cadenaDependencia,
        }));
    }

    /**
     * @method setbanco
     * Actualiza el valor de banco en el estado.
     * @param {string} banco Nuevo valor para banco.
     */
    public setbanco(banco: string): void {
        this.update((state) => ({
            ...state,
            banco,
        }));
    }

    /**
     * @method setllavePago
     * Actualiza el valor de llavePago en el estado.
     * @param {string} llavePago Nuevo valor para llavePago.
     */
    public setllavePago(llavePago: string): void {
        this.update((state) => ({
            ...state,
            llavePago,
        }));
    }

    /**
     * @method setfechaPago
     * Actualiza el valor de fechaPago en el estado.
     * @param {string} fechaPago Nuevo valor para fechaPago.
     */
    public setfechaPago(fechaPago: string): void {
        this.update((state) => ({
            ...state,
            fechaPago,
        }));
    }

    /**
     * @method setimportePago
     * Actualiza el valor de importePago en el estado.
     * @param {string} importePago Nuevo valor para importePago.
     */
    public setimportePago(importePago: string): void {
        this.update((state) => ({
            ...state,
            importePago,
        }));
    }

    /**
     * @method setRfcDel
     * @description Actualiza el estado con el RFC del delegado proporcionado.
     * @param {string} rfcDel - El RFC del delegado que se establecerá en el estado.
     */
    public setRfcDel(rfcDel: string): void {
        this.update((state) => ({
            ...state,
            rfcDel,
        }));
    }

    /**
     * @method setDenominacion
     * @description Actualiza el estado con la nueva denominación proporcionada.
     * @param denominacion - La nueva denominación que se establecerá en el estado.
     */
    public setDenominacionRazonSocial(denominacionRazonSocial: string): void {
        this.update((state) => ({
            ...state,
            denominacionRazonSocial,
        }));
    }

    /**
     * @method setCorreoElectronico
     * @description Actualiza el estado con el correo electrónico proporcionado.
     * @param {string} correoElectronico - El correo electrónico que se establecerá en el estado.
     */
    public setCorreoElectronico(correoElectronico: string): void {
        this.update((state) => ({
            ...state,
            correoElectronico,
        }));
    }

    /**
     * @method setCodigoPostal
     * @description Actualiza el estado con el código postal proporcionado.
     * @param {string} codigoPostal - El código postal que se establecerá en el estado.
     */
    public setCodigoPostal(codigoPostal: string): void {
        this.update((state) => ({
            ...state,
            codigoPostal,
        }));
    }
    /**
     * @method setEstado
     * @description Actualiza el estado del store con el valor proporcionado.
     * @param estado - El nuevo estado que se establecerá en el store.
     */
    public setEstado(estado: string): void {
        this.update((state) => ({
            ...state,
            estado,
        }));
    }
    /**
     * @method setMuncipio
     * @description Actualiza el estado con el municipio proporcionado.
     * @param {string} muncipio - El nombre del municipio que se establecerá en el estado.
     */
    public setMuncipio(muncipio: string): void {
        this.update((state) => ({
            ...state,
            muncipio,
        }));
    }
    /**
     * @method setLocalidad
     * @description Actualiza el estado con la localidad proporcionada.
     * @param {string} localidad - La nueva localidad que se establecerá en el estado.
     */
    public setLocalidad(localidad: string): void {
        this.update((state) => ({
            ...state,
            localidad,
        }));
    }
    /**
     * @description Actualiza el estado con la colonia proporcionada.
     * @param colonia - El nombre de la colonia que se establecerá en el estado.
     */
    public setColonia(colonia: string): void {
        this.update((state) => ({
            ...state,
            colonia,
        }));
    }

    /**
     * @method setCalle
     * @description Actualiza el estado con el valor de la calle proporcionado.
     * @param {string} calle - El nuevo valor de la calle que se establecerá en el estado.
     */
    public setCalle(calle: string): void {
        this.update((state) => ({
            ...state,
            calle,
        }));
    }
    /**
     * @method setLada
     * @description Actualiza el estado con el valor proporcionado de la lada.
     * @param {string} lada - El valor de la lada que se establecerá en el estado.
     * @example
     * this.setLada('123');
     * @memberof AvisoCalidadStore
     */
    public setLada(lada: string): void {
        this.update((state) => ({
            ...state,
            lada,
        }));
    }
    /**
     * @method setTelefono
     * @description Actualiza el estado con un nuevo valor de teléfono.
     * @param telefono - El nuevo número de teléfono que se establecerá en el estado.
     */
    public setTelefono(telefono: string): void {
        this.update((state) => ({
            ...state,
            telefono,
        }));
    }
    /**
     * @method setAvisoCheckbox
     * @description Actualiza el estado del checkbox de aviso en la tienda.
     * @param {boolean} avisoCheckbox - Valor booleano que indica el estado del checkbox de aviso.
     * @returns {void}
     */
    public setAvisoCheckbox(avisoCheckbox: boolean): void {
        this.update((state) => ({
            ...state,
            avisoCheckbox,
        }));
    }
    /**
     * @method setLicenciaSanitaria
     * @description Actualiza el estado con el valor proporcionado de la licencia sanitaria.
     * @param licenciaSanitaria - El nuevo valor de la licencia sanitaria que se establecerá en el estado.
     */
    public setLicenciaSanitaria(licenciaSanitaria: string): void {
        this.update((state) => ({
            ...state,
            licenciaSanitaria,
        }));
    }
    /**
     * @property {string} claveScianModal
     * Clave SCIAN seleccionada en el modal.
     */
    public setClaveScianModal(claveScianModal: string): void {
        this.update((state) => ({
            ...state,
            claveScianModal,
        }));
    }

    /**
     * @property {string} claveDescripcionModal
     * Descripción de la clave SCIAN seleccionada en el modal.
     */
    public setClaveDescripcionModal(claveDescripcionModal: string): void {
        this.update((state) => ({
            ...state,
            claveDescripcionModal,
        }));
    }

    /**
     * @property {string} nombreComercial
     * Nombre comercial del producto o establecimiento.
     */
    public setNombreComercial(nombreComercial: string): void {
        this.update((state) => ({
            ...state,
            nombreComercial,
        }));
    }

    /**
     * @property {string} nombreComun
     * Nombre común del producto.
     */
    public setNombreComun(nombreComun: string): void {
        this.update((state) => ({
            ...state,
            nombreComun,
        }));
    }

    /**
     * @property {string} nombreCientifico
     * Nombre científico del producto.
     */
    public setNombreCientifico(nombreCientifico: string): void {
        this.update((state) => ({
            ...state,
            nombreCientifico,
        }));
    }
    /**
     * @property {string} usoEspecifico
     * Uso específico del producto.
     */
    public setUsoEspecifico(usoEspecifico: string): void {
        this.update((state) => ({
            ...state,
            usoEspecifico,
        }));
    }

    /**
     * @property {string} estadoFisico
     * Estado físico del producto.
     */
    public setEstadoFisico(estadoFisico: string): void {
        this.update((state) => ({
            ...state,
            estadoFisico,
        }));
    }

    /**
     * @property {string} fraccionArancelaria
     * Fracción arancelaria del producto.
     */
    public setFraccionArancelaria(fraccionArancelaria: string): void {
        this.update((state) => ({
            ...state,
            fraccionArancelaria,
        }));
    }

    /**
     * @property {string} descripcionFraccion
     * Descripción de la fracción arancelaria.
     */
    public setDescripcionFraccion(descripcionFraccion: string): void {
        this.update((state) => ({
            ...state,
            descripcionFraccion,
        }));
    }

    /**
     * @property {string} cantidadUMT
     * Cantidad en unidad de medida de trabajo.
     */
    public setCantidadUMT(cantidadUMT: string): void {
        this.update((state) => ({
            ...state,
            cantidadUMT,
        }));
    }
    /**
     * @property {string} UMT
     * Unidad de Medida de Trabajo.
     */
    public setUMT(UMT: string): void {
        this.update((state) => ({
            ...state,
            UMT,
        }));
    }

    /**
     * @property {string} cantidadUMC
     * Cantidad en unidad de medida de comercialización.
     */
    public setCantidadUMC(cantidadUMC: string): void {
        this.update((state) => ({
            ...state,
            cantidadUMC,
        }));
    }

    /**
     * @property {string} UMC
     * Unidad de Medida de Comercialización.
     */
    public setUMC(UMC: string): void {
        this.update((state) => ({
            ...state,
            UMC,
        }));
    }

    /**
     * @property {string} numeroCas
     * Número CAS del producto.
     */
    public setNumerocas(numeroCas: string): void {
        this.update((state) => ({
            ...state,
            numeroCas,
        }));
    }

    /**
     * @property {string} porcentajeConcentracion
     * Porcentaje de concentración del producto.
     */
    public setPorcentajeConcentracion(porcentajeConcentracion: string): void {
        this.update((state) => ({
            ...state,
            porcentajeConcentracion,
        }));
    }

    /**
     * @property {string} clasificacionToxicologica
     * Clasificación toxicológica del producto.
     */
    public setClasificacionToxicologica(clasificacionToxicologica: string): void {
        this.update((state) => ({
            ...state,
            clasificacionToxicologica,
        }));
    }

    /**
     * @property {string} objetoImportacion
     * Objeto de importación.
     */
    public setObjetoImportacion(objetoImportacion: string): void {
        this.update((state) => ({
            ...state,
            objetoImportacion,
        }));
    }
    /**
     * Limpia los datos de la solicitud y restablece el estado inicial.
     */
    public limpiarSolicitud(): void {
        this.reset();
    }
}