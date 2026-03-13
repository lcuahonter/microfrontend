import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


/**
 * Interfaz que representa el estado de Solicitud260104.
 */
export interface Solicitud260104State {
    /**
     * El valor de rfcResponsableSanitario.
     */
    razonSocial: string;
    /**
     * El valor de correoElectronico.
     */
    correoElectronico: string;
    /**
     * El valor de codigoPostal.
     */
    codigoPostal: string;
    /**
     * El valor de estado.
     */
    estado: string;
    /**
     * El valor de municipio.
     */
    municipio: string;
    /**
     * El valor de localidad.
     */
    localidad: string;
    /**
     * El valor de colonia.
     */
    colonia: string;
    /**
     * El valor de calle.
     */
    calle: string;
    /**
     * El valor de lada.
     */
    lada: string;
    /**
     * El valor de telefono.
     */
    telefono: string;
    /**
     * El valor de avisoCheckbox.
     */
    avisoCheckbox: string;
    /**
     * El valor de licenciaSanitaria.
     */
    licenciaSanitaria: string;
    /**
     * El valor de regimen.
     */
    regimen: string;
    /**
     * El valor de aduana.
     */
    aduana: string;
    /**
     * El valor de hacerlosPublicos.
     */
    hacerlosPublicos: string;
    /**
     * El valor de manifesto.
     */
    manifesto: string;
    /**
     * El valor de claveScianModal.
     */
    claveScianModal: string;
    /**
     * El valor de claveDescripcionModal.
     */
    claveDescripcionModal: string;
    /**
     * El valor de clasificacion.
     */
    clasificacion: string;
    /**
     * El valor de especificarClasificacionProducto.
     */
    especificarClasificacionProducto: string;
    /**
     * El valor de especifique.
     */
    especifique: string;
    /**
     * El valor de denominacionEspecifica.
     */
    denominacionEspecifica: string;
    /**
     * El valor de marca.
     */
    marca: string;
    /**
     * El valor de tipoDeProducto.
     */
    tipoDeProducto: string;
    /**
     * El valor de fraccionArancelaria.
     */
    fraccionArancelaria: string;
    /**
     * El valor de descripcionFraccion.
     */
    descripcionFraccion: string;
    /**
     * El valor de cantidadUMT.
     */
    cantidadUMT: string;
    /**
     * El valor de UMT.
     */
    UMT: string;
    /**
     * El valor de cantidadUMC.
     */
    cantidadUMC: string;
    /**
     * El valor de UMC.
     */
    UMC: string;
    /**
     * El valor de especifiqueTipo.
     */
    especifiqueTipo: string;
    /**
     * El valor de claveDeLosLotes.
     */
    claveDeLosLotes: string;
    /**
     * El valor de fechaFabricacion.
     */
    fechaFabricacion: string;
    /**
     * El valor de fechaCaducidad.
     */
    fechaCaducidad: string;
    /**
     * El valor de rfc.
     */
    rfc: string;
    /**
       * El valor de nombres.
       */
    nombres: string;
    /**
       * El valor de apellidoPaterno.
       */
    apellidoPaterno: string;
    /**
       * El valor de apellidoMaterno.
       */
    apellidoMaterno: string;
}

/**
 * Función para crear el estado inicial de Solicitud260104State.
 * @returns {Solicitud260104State} El estado inicial de Solicitud260104State.
 */
export function createInitialState(): Solicitud260104State {
    return {
        /**
         * El valor de rfcDel.
         */
        razonSocial: '',
        /**
         * El valor de correoElectronico.
        */
        correoElectronico: '',
        /**
         * El valor de codigoPostal.
         */
        codigoPostal: '',
        /**
         * El valor de estado.
         */
        estado: '',
        /**
         * El valor de municipio.
         */
        municipio: '',
        /**
         * El valor de localidad.
         */
        localidad: '',
        /**
         * El valor de colonia.
         */
        colonia: '',
        /**
         * El valor de calle.
         */
        calle: '',
        /**
         * El valor de lada.
         */
        lada: '',
        /**
         * El valor de telefono.
         */
        telefono: '',
        /**
         * El valor de avisoCheckbox.
         */
        avisoCheckbox: '',
        /**
         * El valor de licenciaSanitaria.
         */
        licenciaSanitaria: '',
        /**
         * El valor de regimen.
         */
        regimen: '',
        /**
         * El valor de aduana.
         */
        aduana: '',
        /**
         * El valor de hacerlosPublicos.
         */
        hacerlosPublicos: '',
        /**
         * El valor de manifesto.
         */
        manifesto: '',
        /**
         * El valor de claveScianModal.
         */
        claveScianModal: '',
        /**
         * El valor de claveDescripcionModal.
         */
        claveDescripcionModal: '',
        /**
         * El valor de clasificacion.
         */
        clasificacion: '',
        /**
         * El valor de especificarClasificacionProducto.
         */
        especificarClasificacionProducto: '',
        /**
         * El valor de especifique.
         */
        especifique: '',
        /**
         * El valor de denominacionEspecifica.
         */
        denominacionEspecifica: '',
        /**
         * El valor de marca.
         */
        marca: '',
        /**
         * El valor de tipoDeProducto.
         */
        tipoDeProducto: '',
        /**
         * El valor de fraccionArancelaria.
         */
        fraccionArancelaria: '',
        /**
         * El valor de descripcionFraccion.
         */
        descripcionFraccion: '',
        /**
         * El valor de cantidadUMT.
         */
        cantidadUMT: '',
        /**
         * El valor de UMT.
         */
        UMT: '',
        /**
         * El valor de cantidadUMC.
         */
        cantidadUMC: '',
        /**
         * El valor de UMC.
         */
        UMC: '',
        /**
         * El valor de especifiqueTipo.
         */
        especifiqueTipo: '',
        /**
         * El valor de claveDeLosLotes.
         */
        claveDeLosLotes: '',
        /**
         * El valor de fechaFabricacion.
         */
        fechaFabricacion: '',
        /**
         * El valor de fechaCaducidad.
         */
        fechaCaducidad: '',
        /**
         * El valor de rfc.
         */
        rfc: '',
        /**
     * El valor de nombres.
     */
        nombres: "",
        /**
           * El valor de apellidoPaterno.
           */
        apellidoPaterno: "",
        /**
           * El valor de apellidoMaterno.
           */
        apellidoMaterno: ""
    };
}

/**
* Decorador Injectable para hacer que la tienda esté disponible a nivel raíz.
*/
@Injectable({
    providedIn: 'root',
})
/**
 * Decorador StoreConfig para configurar la tienda con un nombre y una opción de restablecimiento.
 * @param {Object} config - El objeto de configuración.
 * @param {string} config.name - El nombre de la tienda.
 * @param {boolean} config.resettable - Indica si la tienda es restablecible.
 */
@StoreConfig({ name: 'tramite260104', resettable: true })

export class Tramite260104StoreDos extends Store<Solicitud260104State> {
    /**
     * Crea una instancia de Tramite31601Store.
     * Inicializa la tienda con el estado inicial.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Establece el estado de razonSocial.
     * @param razonSocial - El valor de razonSocial.
     */
    public setRazonSocial(razonSocial: string) {
        this.update((state) => ({
            ...state,
            razonSocial,
        }));
    }
    /**
     * Establece el estado de correoElectronico.
     * @param correoElectronico - El valor de correoElectronico.
     */
    public setCorreoElectronico(correoElectronico: string) {
        this.update((state) => ({
            ...state,
            correoElectronico,
        }));
    }
    /**
     * Establece el estado de codigoPostal.
     * @param codigoPostal - El valor de codigoPostal.
     */
    public setCodigoPostal(codigoPostal: string) {
        this.update((state) => ({
            ...state,
            codigoPostal,
        }));
    }
    /**
     * Establece el estado de estado.
     * @param estado - El valor de estado.
     */
    public setEstado(estado: string) {
        this.update((state) => ({
            ...state,
            estado,
        }));
    }
    /**
     * Establece el estado de municipio.
     * @param municipio - El valor de municipio.
     */
    public setMunicipio(municipio: string) {
        this.update((state) => ({
            ...state,
            municipio,
        }));
    }
    /**
     * Establece el estado de localidad.
     * @param localidad - El valor de localidad.
     */
    public setLocalidad(localidad: string) {
        this.update((state) => ({
            ...state,
            localidad,
        }));
    }
    /**
     * Establece el estado de colonia.
     * @param colonia - El valor de colonia.
     */
    public setColonia(colonia: string) {
        this.update((state) => ({
            ...state,
            colonia,
        }));
    }
    /**
     * Establece el estado de calle.
     * @param calle - El valor de calle.
     */
    public setCalle(calle: string) {
        this.update((state) => ({
            ...state,
            calle,
        }));
    }
    /**
     * Establece el estado de lada.
     * @param lada - El valor de lada.
     */
    public setLada(lada: string) {
        this.update((state) => ({
            ...state,
            lada,
        }));
    }
    /**
     * Establece el estado de telefono.
     * @param telefono - El valor de telefono.
     */
    public setTelefono(telefono: string) {
        this.update((state) => ({
            ...state,
            telefono,
        }));
    }
    /**
     * Establece el estado de avisoCheckbox.
     * @param avisoCheckbox - El valor de avisoCheckbox.
     */
    public setAvisoCheckbox(avisoCheckbox: string) {
        this.update((state) => ({
            ...state,
            avisoCheckbox,
        }));
    }
    /**
     * Establece el estado de licenciaSanitaria.
     * @param licenciaSanitaria - El valor de licenciaSanitaria.
     */
    public setLicenciaSanitaria(licenciaSanitaria: string) {
        this.update((state) => ({
            ...state,
            licenciaSanitaria,
        }));
    }
    /**
     * Establece el estado de regimen.
     * @param regimen - El valor de regimen.
     */
    public setRegimen(regimen: string) {
        this.update((state) => ({
            ...state,
            regimen,
        }));
    }
    /**
     * Establece el estado de aduana.
     * @param aduana - El valor de aduana.
     */
    public setAduana(aduana: string) {
        this.update((state) => ({
            ...state,
            aduana,
        }));
    }
    /**
     * Establece el estado de hacerlosPublicos.
     * @param hacerlosPublicos - El valor de hacerlosPublicos.
     */
    public setHacerlosPublicos(hacerlosPublicos: string) {
        this.update((state) => ({
            ...state,
            hacerlosPublicos,
        }));
    }
    /**
     * Establece el estado de manifesto.
     * @param manifesto - El valor de manifesto.
     */
    public setManifesto(manifesto: string) {
        this.update((state) => ({
            ...state,
            manifesto,
        }));
    }
    /**
     * Establece el estado de claveScianModal.
     * @param claveScianModal - El valor de claveScianModal.
     */
    public setClaveScianModal(claveScianModal: string) {
        this.update((state) => ({
            ...state,
            claveScianModal,
        }));
    }
    /**
     * Establece el estado de claveDescripcionModal.
     * @param claveDescripcionModal - El valor de claveDescripcionModal.
     */
    public setClaveDescripcionModal(claveDescripcionModal: string) {
        this.update((state) => ({
            ...state,
            claveDescripcionModal,
        }));
    }
    /**
     * Establece el estado de clasificacion.
     * @param clasificacion - El valor de clasificacion.
     */
    public setClasificacion(clasificacion: string) {
        this.update((state) => ({
            ...state,
            clasificacion,
        }));
    }
    /**
     * Establece el estado de especificarClasificacionProducto.
     * @param especificarClasificacionProducto - El valor de especificarClasificacionProducto.
     */
    public setEspecificarClasificacionProducto(especificarClasificacionProducto: string) {
        this.update((state) => ({
            ...state,
            especificarClasificacionProducto,
        }));
    }
    /**
     * Establece el estado de especifique.
     * @param especifique - El valor de especifique.
     */
    public setEspecifique(especifique: string) {
        this.update((state) => ({
            ...state,
            especifique,
        }));
    }
    /**
     * Establece el estado de denominacionEspecifica.
     * @param denominacionEspecifica - El valor de denominacionEspecifica.
     */
    public setDenominacionEspecifica(denominacionEspecifica: string) {
        this.update((state) => ({
            ...state,
            denominacionEspecifica,
        }));
    }
    /**
     * Establece el estado de marca.
     * @param marca - El valor de marca.
     */
    public setMarca(marca: string) {
        this.update((state) => ({
            ...state,
            marca,
        }));
    }
    /**
     * Establece el estado de tipoDeProducto.
     * @param tipoDeProducto - El valor de tipoDeProducto.
     */
    public setTipoDeProducto(tipoDeProducto: string) {
        this.update((state) => ({
            ...state,
            tipoDeProducto,
        }));
    }
    /**
     * Establece el estado de fraccionArancelaria.
     * @param fraccionArancelaria - El valor de fraccionArancelaria.
     */
    public setFraccionArancelaria(fraccionArancelaria: string) {
        this.update((state) => ({
            ...state,
            fraccionArancelaria,
        }));
    }
    /**
     * Establece el estado de descripcionFraccion.
     * @param descripcionFraccion - El valor de descripcionFraccion.
     */
    public setDescripcionFraccion(descripcionFraccion: string) {
        this.update((state) => ({
            ...state,
            descripcionFraccion,
        }));
    }
    /**
     * Establece el estado de cantidadUMT.
     * @param cantidadUMT - El valor de cantidadUMT.
     */
    public setCantidadUMT(cantidadUMT: string) {
        this.update((state) => ({
            ...state,
            cantidadUMT,
        }));
    }
    /**
     * Establece el estado de UMT.
     * @param UMT - El valor de UMT.
     */
    public setUMT(UMT: string) {
        this.update((state) => ({
            ...state,
            UMT,
        }));
    }
    /**
     * Establece el estado de cantidadUMC.
     * @param cantidadUMC - El valor de cantidadUMC.
     */
    public setCantidadUMC(cantidadUMC: string) {
        this.update((state) => ({
            ...state,
            cantidadUMC,
        }));
    }
    /**
     * Establece el estado de UMC.
     * @param UMC - El valor de UMC.
     */
    public setUMC(UMC: string) {
        this.update((state) => ({
            ...state,
            UMC,
        }));
    }
    /**
     * Establece el estado de especifiqueTipo.
     * @param especifiqueTipo - El valor de especifiqueTipo.
     */
    public setEspecifiqueTipo(especifiqueTipo: string) {
        this.update((state) => ({
            ...state,
            especifiqueTipo,
        }));
    }
    /**
     * Establece el estado de claveDeLosLotes.
     * @param claveDeLosLotes - El valor de claveDeLosLotes.
     */
    public setClaveDeLosLotes(claveDeLosLotes: string) {
        this.update((state) => ({
            ...state,
            claveDeLosLotes,
        }));
    }
    /**
     * Establece el estado de fechaFabricacion.
     * @param fechaFabricacion - El valor de fechaFabricacion.
     */
    public setFechaFabricacion(fechaFabricacion: string) {
        this.update((state) => ({
            ...state,
            fechaFabricacion,
        }));
    }
    /**
     * Establece el estado de fechaCaducidad.
     * @param fechaCaducidad - El valor de fechaCaducidad.
     */
    public setFechaCaducidad(fechaCaducidad: string) {
        this.update((state) => ({
            ...state,
            fechaCaducidad,
        }));
    }
    /**
     * Establece el estado de rfc.
     * @param rfc - El valor de rfc.
     */
    public setRfc(rfc: string) {
        this.update((state) => ({
            ...state,
            rfc,
        }));
    }
    /**
       * Establece el estado de rfc.
       * @param nombre - El valor de rfc.
       */
    public setNumero(nombres: string) {
        this.update((state) => ({
            ...state,
            nombres,
        }));
    }
    /**
     * Establece el estado de rfc.
     * @param apellidoPaterno - El valor de rfc.
     */
    public setApellidoPaterno(apellidoPaterno: string) {
        this.update((state) => ({
            ...state,
            apellidoPaterno,
        }));
    }
    /**
   * Establece el estado de rfc.
   * @param apellidoMaterno - El valor de rfc.
   */
    public setApellidoMaterno(apellidoMaterno: string) {
        this.update((state) => ({
            ...state,
            apellidoMaterno,
        }));
    }
}
