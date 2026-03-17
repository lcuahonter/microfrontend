// new
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { ScianDatos } from '@libs/shared/data-access-user/src';

import { DatosSolicitudFormState, TablaMercanciasDatos, TablaScianConfig } from '../../../../shared/models/2603/datos-solicitud.model';
import { PagoDerechosFormState } from '../../../../shared/models/2603/terceros-relacionados.model';

/**
 * Interfaz que representa el estado de Solicitud260304.
 */
export interface Solicitud260301State {
    pagoDerechos: PagoDerechosFormState;
    /**
     * El valor de idSolicitud.
     */
    idSolicitud: number | null;
    /**
     * El valor de denominacionRazon.
     */
    denominacionRazon: string;

    /**
     * El valor de RFCResponsableSanitario.
     */
    RFCResponsableSanitario: string;
    /**
     * El valor de codigoPostal.
     */
    codigoPostal: string;
    /**
     * El valor de estado.
     */
    estado: string;
    /**
     * El valor de muncipio.
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
     * El valor de calleYNumero.
    */
    calleYNumero: string;
    /**
     * El valor de correoElecronico.
    */
    correoElecronico: string;
    /**
     * El valor de lada.
    */
    lada: string;
    /**
     * El valor de telefono.
    */
    telefono: string;
    /**
     * El valor de claveScianModal.
    */
    claveScianModal: string;
    /**
     * El valor de avisoDeFuncionamiento.
     */
    avisoDeFuncionamiento: string;
    /**
     * El valor de claveDescripcionModal.
    */
    claveScian: string;
    /**
     * El valor de descripcion.
    */
    descripcion: string;
    /**
     * El valor de avisoCheckbox.
    */
    avisoCheckbox: boolean;
    /**
     * El valor de licenciaSanitaria.
    */
    licenciaSanitaria: string;
    /**
     * El valor de regimen.
    */
    regimen: string;
    /**
    * El valor de regimenDestinara.
   */
    regimenDestinara: string;
    /**
     * El valor de aduanasEntradas.
    */
    aduana: string;
    /**
     * El valor de numeroPermiso.
    */
    numeroPermiso: string;
    /**
    * El valor de losDatosNo.
   */
    losDatosNo: string;
    /**
    * El valor de nombreORazon.
   */
    nombreORazon: string;
    /**
     * El valor de clasificacion.
    */
    clasificacion: string;
    /**
     * El valor de clasificacion.
    */
    clave: string;
    /**
     * El valor de especificarClasificacionProducto.
    */
    especificarClasificacionProducto: string;
    /**
     * El valor de denominacionEspecifica.
    */
    denominacionEspecifica: string;
    /**
     * El valor de denominacionDistintiva.
    */
    denominacionDistintiva: string;
    /**
     * El valor de denominacionComun.
    */
    denominacionComun: string;
    /**
     * El valor de tipoDeProducto.
    */
    tipoDeProducto: string;
    /**
     * El valor de estadoFisico.
    */
    estadoFisico: string;
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
     * El valor de presentacion.
    */
    presentacion: string;
    /**
     * El valor de numeroRegistro.
    */
    numeroRegistro: string;
    /**
     * El valor de fechaCaducidad.
    */
    fechaCaducidad: string;
    /**
     * El valor de cumplimiento.
    */
    cumplimiento: string;
    /**
     * El valor de rfc.
    */
    rfc: string;
    /**
     * El valor de nombre.
    */
    nombre: string;
    /**
     * El valor de apellidoPaterno.
    */
    apellidoPaterno: string;
    /**
     * El valor de apellidoMaterno.
    */
    apellidoMaterno: string;
    /**
     * El valor de dci.
    */
    dci: string;
    /**
 * El valor de marcaComercialODenominacionDistintiva.
*/
    marcaComercialODenominacionDistintiva: string;
    /**
* El valor de descripcionDeLaFraccion.
*/
    descripcionDeLaFraccion: string;
    /**
     * El valor de numeroCas.
    */
    numeroCas: string;
    /**
     * El valor de cantidadDeLotes.
    */
    cantidadDeLotes: string;
    /**
     * El valor de kgOrPorLote.
    */
    kgOrPorLote: string;
    /**
     * El valor de pais.
    */
    pais: string;
    /**
     * El valor de paisDeProcedencia.
    */
    paisDeProcedencia: string;
    /**
     * El valor de detallarUso.
    */
    detallarUso: string;
    /**
     * El valor de numeroDePiezas.
    */
    numeroDePiezas: string;
    /**
     * El valor de descripcionDelNumeroDePiezas.
    */
    descripcionDelNumeroDePiezas: string;
    /**
     * El valor de numeroDeRegistro.
    */
    numeroDeRegistro: string;
    /**
     * El valor de claveDeReferencia.
    */
    claveDeReferencia: string;
    /**
     * El valor de cadenaDaLaDependencia.
    */
    cadenaDaLaDependencia: string;
    /**
     * El valor de banco.
    */
    banco: string;
    /**
     * El valor de laveDePago.
    */
    laveDePago: string;
    /**
     * El valor de fechaDePago.
     */
    fechaDePago: string;
    /**
     * El valor de importeDePago.
     */
    importeDePago: string;
    /**
     * El valor de tipoDocumento.
     */
    tipoDocumento: string;
    /**
     * El valor de tercerosRelacionadosDenominacionSocial.
     */
    tercerosRelacionadosDenominacionSocial: string;
    /**
     * El valor de tercerosRelacionadosTerceroNombre.
     */
    tercerosRelacionadosTerceroNombre: string;
    /**
     * El valor de tercerosNacionalidad.
     */
    tercerosNacionalidad: string;
    /**
     * El valor de tercerosRelacionadosFisica.
     */
    tipoPersona: string;
    /**
     * El valor de tercerosRelacionadosRfc.
     */
    tercerosRelacionadosRfc: string;
    /**
     * El valor de tercerosRelacionadosCurp.
     */
    tercerosRelacionadosCurp: string;
    /**
     * El valor de tercerosRelacionadosRazonSocial.
     */
    tercerosRelacionadosRazonSocial: string;
    /**
     * El valor de tercerosRelacionadosPais.
     */
    tercerosRelacionadosPais: string;
    /**
     * El valor de tercerosRelacionadosEstado.
     */
    tercerosRelacionadosEstado: string;
    /**
     * El valor de tercerosRelacionadosCodigoPostal.
     */
    tercerosRelacionadosCodigoPostal: string;
    /**
     * El valor de tercerosRelacionadosCalle.
     */
    tercerosRelacionadosCalle: string;
    /**
     * El valor de tercerosRelacionadosNumeroExterior.
     */
    tercerosRelacionadosNumeroExterior: string;
    /**
     * El valor de tercerosRelacionadosNumeroInterior.
     */
    tercerosRelacionadosNumeroInterior: string;
    /**
     * El valor de tercerosRelacionadosLada.
     */
    tercerosRelacionadosLada: string;
    /**
     * El valor de tercerosRelacionadosTelefono.
     */
    tercerosRelacionadosTelefono: string;
    /**
     * El valor de tercerosRelacionadosCorreoElectronico.
     */
    tercerosRelacionadosCorreoElectronico: string;
    /**
     * El valor de tercerosRelacionadosTelefono.
     */
    scianTabla: ScianDatos[];
    /**
     * El valor de datosPersonalesNombre.
     */
    datosPersonalesNombre: string;
    /**
     * El valor de datosPersonalesNombre.
     */
    datosPersonalesPrimerApellido: string;
    /**
     * El valor de datosPersonalesSegundoApellido.
     */
    datosPersonalesSegundoApellido: string;
    /**
     * El valor de tercerosRelacionadosMunicipio.
     */
    tercerosRelacionadosMunicipio: string;
    /**
     * El valor de tercerosRelacionadosLocalidad.
     */
    tercerosRelacionadosLocalidad: string;
    /**
     * El valor de tercerosRelacionadosLocalidad.
     */
    tercerosRelacionadosColonia: string;
    /**
     * El valor de manifiestos.
     */
    manifiestos: boolean;

    /** Estado del formulario general de la solicitud. */
    datosSolicitudFormState: DatosSolicitudFormState;

    /** Configuración SCIAN asociada. */
    scianConfigDatos: TablaScianConfig[];

    /** Configuración de la tabla de mercancías. */
    tablaMercanciasConfigDatos: TablaMercanciasDatos[];
}
/**
 * Función para crear el estado inicial de Solicitud260301State.
 * @returns {Solicitud260301State} El estado inicial de Solicitud260301State.
 */
export function createInitialState(): Solicitud260301State {
    return {
        pagoDerechos: {} as PagoDerechosFormState,
        idSolicitud: 0,
        denominacionRazon: '',
        RFCResponsableSanitario: '',
        codigoPostal: '',
        estado: '',
        municipio: '',
        localidad: '',
        colonia: '',
        calleYNumero: '',
        correoElecronico: '',
        lada: '',
        telefono: '',
        claveScianModal: '',
        avisoDeFuncionamiento: '',
        claveScian: '',
        descripcion: '',
        avisoCheckbox: false,
        licenciaSanitaria: '',
        regimen: '',
        regimenDestinara: '',
        aduana: '',
        numeroPermiso: '',
        losDatosNo: '',
        nombreORazon: '',
        clasificacion: '',
        clave: '',
        especificarClasificacionProducto: '',
        denominacionEspecifica: '',
        denominacionDistintiva: '',
        denominacionComun: '',
        tipoDeProducto: '',
        estadoFisico: '',
        fraccionArancelaria: '',
        descripcionFraccion: '',
        cantidadUMT: '',
        UMT: '',
        cantidadUMC: '',
        UMC: '',
        presentacion: '',
        numeroRegistro: '',
        fechaCaducidad: '',
        cumplimiento: '',
        rfc: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        dci: '',
        marcaComercialODenominacionDistintiva: '',
        descripcionDeLaFraccion: '',
        numeroCas: '',
        cantidadDeLotes: '',
        kgOrPorLote: '',
        pais: '',
        paisDeProcedencia: '',
        detallarUso: '',
        numeroDePiezas: '',
        descripcionDelNumeroDePiezas: '',
        numeroDeRegistro: '',
        claveDeReferencia: '',
        cadenaDaLaDependencia: '',
        banco: '',
        laveDePago: '',
        fechaDePago: '',
        importeDePago: '',
        tipoDocumento: '',
        tercerosRelacionadosDenominacionSocial: '',
        tercerosRelacionadosTerceroNombre: '',
        tercerosNacionalidad: '',
        tipoPersona: '',
        tercerosRelacionadosRfc: '',
        tercerosRelacionadosCurp: '',
        tercerosRelacionadosRazonSocial: '',
        tercerosRelacionadosPais: '',
        tercerosRelacionadosEstado: '',
        tercerosRelacionadosCodigoPostal: '',
        tercerosRelacionadosCalle: '',
        tercerosRelacionadosNumeroExterior: '',
        tercerosRelacionadosNumeroInterior: '',
        tercerosRelacionadosLada: '',
        tercerosRelacionadosTelefono: '',
        tercerosRelacionadosCorreoElectronico: '',
        scianTabla: [],
        datosPersonalesNombre: '',
        datosPersonalesPrimerApellido: '',
        datosPersonalesSegundoApellido: '',
        tercerosRelacionadosMunicipio: '',
        tercerosRelacionadosLocalidad: '',
        tercerosRelacionadosColonia: '',
        manifiestos: false,
        /** Información del solicitante y establecimiento */
        datosSolicitudFormState: {
            rfcSanitario: '',
            denominacionRazon: '',
            correoElectronico: '',
            codigoPostal: '',
            estado: '',
            municipioAlcaldia: '',
            localidad: '',
            colonia: '',
            calle: '',
            lada: '',
            telefono: '',
            aviso: '',
            licenciaSanitaria: '',
            regimen: '',
            adunasDeEntradas: '',
            aduana: '',
            aeropuerto: false,
            publico: '',
            representanteRfc: '',
            representanteNombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
        },
        scianConfigDatos: [],
        tablaMercanciasConfigDatos: [],
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
@StoreConfig({ name: 'tramite260301', resettable: true })

export class TramiteProc260301Store extends Store<Solicitud260301State> {
    /**
     * Actualiza el estado de la solicitud con múltiples valores a la vez.
     * @param partial - Objeto con los campos a actualizar.
     */
    public patchSolicitud(partial: Partial<Solicitud260301State>): void {
        this.update((state) => ({
            ...state,
            ...partial,
        }));
    }
    /**
     * Actualiza el estado de pagoDerechos.
     * @param event - El nuevo estado de PagoDerechosFormState.
     */
    updatePagoDerechos(event: any): void {
        this.update((state) => ({
            ...state,
            pagoDerechos: event,
        }));
    }
    /**
     * Crea una instancia de Tramite260304Store.
     * Inicializa la tienda con el estado inicial.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Establece el estado de denominacionRazon.
     * @param denominacionRazon - El valor de denominacionRazon.
     */
    public setDenominacionRazon(denominacionRazon: string): void {
        this.update((state) => ({
            ...state,
            denominacionRazon,
        }));
    }

    /**
     * Establece el estado de RFCResponsableSanitario.
     * @param RFCResponsableSanitario - El valor de RFCResponsableSanitario.
     */
    public setRFCResponsableSanitario(RFCResponsableSanitario: string): void {
        this.update((state) => ({
            ...state,
            RFCResponsableSanitario,
        }));
    }

    /**
     * Establece el estado de denominacion.
     * @param denominacion - El valor de denominacion.
     */
    public setDenominacion(denominacion: string): void {
        this.update((state) => ({
            ...state,
            denominacion,
        }));
    }
    /**
     * Establece el estado de correo.
     * @param correo - El valor de correo.
     */
    public setCorreo(correo: string): void {
        this.update((state) => ({
            ...state,
            correo,
        }));
    }
    /**
     * Establece el estado de codigoPostal.
     * @param codigoPostal - El valor de codigoPostal.
     */
    public setCodigoPostal(codigoPostal: string): void {
        this.update((state) => ({
            ...state,
            codigoPostal,
        }));
    }
    /**
     * Establece el estado de estado.
     * @param estado - El valor de estado.
     */
    public setEstado(estado: string): void {
        this.update((state) => ({
            ...state,
            estado,
        }));
    }
    /**
     * Establece el muncipio de muncipio.
     * @param muncipio - El valor de muncipio.
     */
    public setMuncipio(muncipio: string): void {
        this.update((state) => ({
            ...state,
            muncipio,
        }));
    }
    /**
     * Establece el localidad de localidad.
     * @param localidad - El valor de localidad.
     */
    public setLocalidad(localidad: string): void {
        this.update((state) => ({
            ...state,
            localidad,
        }));
    }
    /**
     * Establece el estado de colonia.
     * @param colonia - El valor de colonia.
     */
    public setColonia(colonia: string): void {
        this.update((state) => ({
            ...state,
            colonia,
        }));
    }
    /**
     * Establece el estado de calle.
     * @param calle - El valor de calle.
     */
    public setCalle(calle: string): void {
        this.update((state) => ({
            ...state,
            calle,
        }));
    }
    /**
     * Establece el estado de lada.
     * @param lada - El valor de lada.
     */
    public setLada(lada: string): void {
        this.update((state) => ({
            ...state,
            lada,
        }));
    }
    /**
     * Establece el estado de telefono.
     * @param telefono - El valor de telefono.
     */
    public setTelefono(telefono: string): void {
        this.update((state) => ({
            ...state,
            telefono,
        }));
    }
    /**
     * Establece el estado de claveScianModal.
     * @param claveScianModal - El valor de claveScianModal.
     */
    public setClaveScianModal(claveScianModal: string): void {
        this.update((state) => ({
            ...state,
            claveScianModal,
        }));
    }
    /**
     * Establece el estado de claveScianModal.
     * @param claveScianModal - El valor de claveScianModal.
     */
    public setClaveMercancias(claveMercancias: string): void {
        this.update((state) => ({
            ...state,
            claveMercancias,
        }));
    }
    /**
     * Establece el estado de claveDescripcionModal.
     * @param claveDescripcionModal - El valor de claveDescripcionModal.
     */
    public setClaveDescripcionModal(claveDescripcionModal: string): void {
        this.update((state) => ({
            ...state,
            claveDescripcionModal,
        }));
    }
    /**
     * Establece el estado de avisoCheckbox.
     * @param avisoCheckbox - El valor de avisoCheckbox.
     */
    public setAvisoCheckbox(avisoCheckbox: boolean): void {
        this.update((state) => ({
            ...state,
            avisoCheckbox,
        }));
    }
    /**
     * Establece el estado de licenciaSanitaria.
     * @param licenciaSanitaria - El valor de licenciaSanitaria.
     */
    public setLicenciaSanitaria(licenciaSanitaria: string): void {
        this.update((state) => ({
            ...state,
            licenciaSanitaria,
        }));
    }
    /**
     * Establece el estado de regimen.
     * @param regimen - El valor de regimen.
     */
    public setRegimen(regimen: string): void {
        this.update((state) => ({
            ...state,
            regimen,
        }));
    }
    /**
     * Establece el estado de aduanasEntradas.
     * @param aduanasEntradas - El valor de aduanasEntradas.
     */
    public setAduanasEntradas(aduana: string): void {
        this.update((state) => ({
            ...state,
            aduana,
        }));
    }
    /**
     * Establece el estado de numeroPermiso.
     * @param numeroPermiso - El valor de numeroPermiso.
     */
    public setNumeroPermiso(numeroPermiso: string): void {
        this.update((state) => ({
            ...state,
            numeroPermiso,
        }));
    }
    /**
     * Establece el estado de clasificacion.
     * @param clasificacion - El valor de clasificacion.
     */
    public setClasificacion(clasificacion: string): void {
        this.update((state) => ({
            ...state,
            clasificacion,
        }));
    }
    /**
     * Establece el estado de especificar.
     * @param especificar - El valor de especificar.
     */
    public setEspecificarClasificacionProducto(especificarClasificacionProducto: string): void {
        this.update((state) => ({
            ...state,
            especificarClasificacionProducto,
        }));
    }
    /**
     * Establece el estado de denominacionEspecifica.
     * @param denominacionEspecifica - El valor de denominacionEspecifica.
     */
    public setDenominacionEspecifica(denominacionEspecifica: string): void {
        this.update((state) => ({
            ...state,
            denominacionEspecifica,
        }));
    }
    /**
     * Establece el estado de denominacionDistintiva.
     * @param denominacionDistintiva - El valor de denominacionDistintiva.
     */
    public setDenominacionDistintiva(denominacionDistintiva: string): void {
        this.update((state) => ({
            ...state,
            denominacionDistintiva,
        }));
    }
    /**
     * Establece el estado de denominacionComun.
     * @param denominacionComun - El valor de denominacionComun.
     */
    public setDenominacionComun(denominacionComun: string): void {
        this.update((state) => ({
            ...state,
            denominacionComun,
        }));
    }
    /**
     * Establece el estado de tipoDeProducto.
     * @param tipoDeProducto - El valor de tipoDeProducto.
     */
    public setTipoDeProducto(tipoDeProducto: string): void {
        this.update((state) => ({
            ...state,
            tipoDeProducto,
        }));
    }
    /**
     * Establece el estado de estadoFisico.
     * @param estadoFisico - El valor de estadoFisico.
     */
    public setEstadoFisico(estadoFisico: string): void {
        this.update((state) => ({
            ...state,
            estadoFisico,
        }));
    }
    /**
     * Establece el estado de fraccionArancelaria.
     * @param fraccionArancelaria - El valor de fraccionArancelaria.
     */
    public setFraccionArancelaria(fraccionArancelaria: string): void {
        this.update((state) => ({
            ...state,
            fraccionArancelaria,
        }));
    }
    /**
     * Establece el estado de fraccionArancelaria.
     * @param fraccionArancelaria - El valor de fraccionArancelaria.
     */
    public setDescripcionFraccion(descripcionFraccion: string): void {
        this.update((state) => ({
            ...state,
            descripcionFraccion,
        }));
    }
    /**
     * Establece el estado de cantidadUMT.
     * @param cantidadUMT - El valor de cantidadUMT.
     */
    public setCantidadUMT(cantidadUMT: string): void {
        this.update((state) => ({
            ...state,
            cantidadUMT,
        }));
    }
    /**
     * Establece el estado de UMT.
     * @param UMT - El valor de UMT.
     */
    public setUMT(UMT: string): void {
        this.update((state) => ({
            ...state,
            UMT,
        }));
    }
    /**
     * Establece el estado de cantidadUMC.
     * @param cantidadUMC - El valor de cantidadUMC.
     */
    public setCantidadUMC(cantidadUMC: string): void {
        this.update((state) => ({
            ...state,
            cantidadUMC,
        }));
    }
    /**
     * Establece el estado de UMC.
     * @param UMC - El valor de UMC.
     */
    public setUMC(UMC: string): void {
        this.update((state) => ({
            ...state,
            UMC,
        }));
    }
    /**
     * Establece el estado de presentacion.
     * @param presentacion - El valor de presentacion.
     */
    public setPresentacion(presentacion: string): void {
        this.update((state) => ({
            ...state,
            presentacion,
        }));
    }
    /**
     * Establece el estado de numeroRegistro.
     * @param numeroRegistro - El valor de numeroRegistro.
     */
    public setNumeroRegistro(numeroRegistro: string): void {
        this.update((state) => ({
            ...state,
            numeroRegistro,
        }));
    }
    /**
     * Establece el estado de fechaCaducidad.
     * @param fechaCaducidad - El valor de fechaCaducidad.
     */
    public setFechaCaducidad(fechaCaducidad: string): void {
        this.update((state) => ({
            ...state,
            fechaCaducidad,
        }));
    }
    /**
     * Establece el estado de cumplimiento.
     * @param cumplimiento - El valor de cumplimiento.
     */
    public setCumplimiento(cumplimiento: string): void {
        this.update((state) => ({
            ...state,
            cumplimiento,
        }));
    }
    /**
     * Establece el estado de rfc.
     * @param rfc - El valor de rfc.
     */
    public setRfc(rfc: string): void {
        this.update((state) => ({
            ...state,
            rfc,
        }));
    }
    /**
     * Establece el estado de nombre.
     * @param nombre - El valor de nombre.
     */
    public setNombre(nombre: string): void {
        this.update((state) => ({
            ...state,
            nombre,
        }));
    }
    /**
     * Establece el estado de apellidoPaterno.
     * @param apellidoPaterno - El valor de apellidoPaterno.
     */
    public setApellidoPaterno(apellidoPaterno: string): void {
        this.update((state) => ({
            ...state,
            apellidoPaterno,
        }));
    }
    /**
     * Establece el estado de apellidoMaterno.
     * @param apellidoMaterno - El valor de apellidoMaterno.
     */
    public setApellidoMaterno(apellidoMaterno: string): void {
        this.update((state) => ({
            ...state,
            apellidoMaterno,
        }));
    }

    /**
     * Establece el estado de dci.
     * @param dci - El valor de dci.
     */
    public setDci(dci: string): void {
        this.update((state) => ({
            ...state,
            dci,
        }));
    }

    /**
     * Establece el estado de marcaComercialODenominacionDistintiva.
     * @param marcaComercialODenominacionDistintiva - El valor de marcaComercialODenominacionDistintiva.
     */
    public setMarcaComercialODenominacionDistintiva(marcaComercialODenominacionDistintiva: string): void {
        this.update((state) => ({
            ...state,
            marcaComercialODenominacionDistintiva,
        }));
    }

    /**
     * Establece el estado de descripcionDeLaFraccion.
     * @param descripcionDeLaFraccion - El valor de descripcionDeLaFraccion.
     */
    public setDescripcionDeLaFraccion(descripcionDeLaFraccion: string): void {
        this.update((state) => ({
            ...state,
            descripcionDeLaFraccion,
        }));
    }
    /**
     * Establece el estado de numeroCas.
     * @param numeroCas - El valor de numeroCas.
     */
    public setNumeroCas(numeroCas: string): void {
        this.update((state) => ({
            ...state,
            numeroCas,
        }));
    }
    /**
     * Establece el estado de cantidadDeLotes.
     * @param cantidadDeLotes - El valor de cantidadDeLotes.
     */
    public setCantidadDeLotes(cantidadDeLotes: string): void {
        this.update((state) => ({
            ...state,
            cantidadDeLotes,
        }));
    }
    /**
     * Establece el estado de kgOrPorLote.
     * @param kgOrPorLote - El valor de kgOrPorLote.
     */
    public setKgOrPorLote(kgOrPorLote: string): void {
        this.update((state) => ({
            ...state,
            kgOrPorLote,
        }));
    }
    /**
     * Establece el estado de pais.
     * @param pais - El valor de pais.
     */
    public setPais(pais: string): void {
        this.update((state) => ({
            ...state,
            pais,
        }));
    }
    /**
     * Establece el estado de paisDeProcedencia.
     * @param paisDeProcedencia - El valor de paisDeProcedencia.
     */
    public setPaisDeProcedencia(paisDeProcedencia: string): void {
        this.update((state) => ({
            ...state,
            paisDeProcedencia,
        }));
    }
    /**
     * Establece el estado de detallarUso.
     * @param detallarUso - El valor de detallarUso.
     */
    public setDetallarUso(detallarUso: string): void {
        this.update((state) => ({
            ...state,
            detallarUso,
        }));
    }
    /**
     * Establece el estado de numeroDePiezas.
     * @param numeroDePiezas - El valor de numeroDePiezas.
     */
    public setNumeroDePiezas(numeroDePiezas: string): void {
        this.update((state) => ({
            ...state,
            numeroDePiezas,
        }));
    }
    /**
     * Establece el estado de descripcionDelNumeroDePiezas.
     * @param descripcionDelNumeroDePiezas - El valor de descripcionDelNumeroDePiezas.
     */
    public setDescripcionDelNumeroDePiezas(descripcionDelNumeroDePiezas: string): void {
        this.update((state) => ({
            ...state,
            descripcionDelNumeroDePiezas,
        }));
    }
    /**
     * Establece el estado de numeroDeRegistro.
     * @param numeroDeRegistro - El valor de numeroDeRegistro.
     */
    public setNumeroDeRegistro(numeroDeRegistro: string): void {
        this.update((state) => ({
            ...state,
            numeroDeRegistro,
        }));
    }
    /**
     * Establece el estado de claveDeReferencia.
     * @param claveDeReferencia - El valor de claveDeReferencia.
     */
    public setNombreORazon(nombreORazon: string): void {
        this.update((state) => ({
            ...state,
            nombreORazon,
        }));
    }
    /**
     * Establece el estado de claveDeReferencia.
     * @param claveDeReferencia - El valor de claveDeReferencia.
     */
    public setLosDatosNo(losDatosNo: string): void {
        this.update((state) => ({
            ...state,
            losDatosNo,
        }));
    }
    /**
     * Establece el estado de claveDeReferencia.
     * @param claveDeReferencia - El valor de claveDeReferencia.
     */
    public setAvisoDeFuncionamiento(avisoDeFuncionamiento: string): void {
        this.update((state) => ({
            ...state,
            avisoDeFuncionamiento,
        }));
    }
    /**
     * Establece el estado de regimenDestinara.
     * @param regimenDestinara - El valor de regimenDestinara.
     */
    public setRegimenDestinara(regimenDestinara: string): void {
        this.update((state) => ({
            ...state,
            regimenDestinara,
        }));
    }
    /**
     * Establece el estado de regimenDestinara.
     * @param regimenDestinara - El valor de regimenDestinara.
     */
    public setClave(clave: string): void {
        this.update((state) => ({
            ...state,
            clave,
        }));
    }
    /**
     * Establece el estado de descripcion.
     * @param descripcion - El valor de descripcion.
     */
    public setDescripcion(descripcion: string): void {
        this.update((state) => ({
            ...state,
            descripcion,
        }));
    }
    /**
     * Establece el estado de descripcion.
     * @param descripcion - El valor de descripcion.
     */
    public setCalleYNumero(calleYNumero: string): void {
        this.update((state) => ({
            ...state,
            calleYNumero,
        }));
    }

    /**
     * Establece el estado de correoElecronico.
     * @param correoElecronico - El valor de correoElecronico.
     */
    public setCorreoElecronico(correoElecronico: string): void {
        this.update((state) => ({
            ...state,
            correoElecronico,
        }));
    }

    /**
     * Establece el estado de municipio.
     * @param municipio - El valor de municipio.
     */
    public setMunicipio(municipio: string): void {
        this.update((state) => ({
            ...state,
            municipio,
        }));
    }

    /**
     * Establece el estado de claveDeReferencia.
     * @param claveDeReferencia - El valor de claveDeReferencia.
     */
    public setClaveDeReferencia(claveDeReferencia: string): void {
        this.update((state) => ({
            ...state,
            claveDeReferencia,
        }));
    }

    /**
     * Establece el estado de cadenaDaLaDependencia.
     * @param cadenaDaLaDependencia - El valor de cadenaDaLaDependencia.
     */
    public setCadenaDaLaDependencia(cadenaDaLaDependencia: string): void {
        this.update((state) => ({
            ...state,
            cadenaDaLaDependencia,
        }));
    }

    /**
     * Establece el estado de banco.
     * @param banco - El valor de banco.
     */
    public setBanco(banco: string): void {
        this.update((state) => ({
            ...state,
            banco,
        }));
    }

    /**
     * Establece el estado de laveDePago.
     * @param laveDePago - El valor de laveDePago.
     */
    public setLaveDePago(laveDePago: string): void {
        this.update((state) => ({
            ...state,
            laveDePago,
        }));
    }

    /**
     * Establece el estado de fechaDePago.
     * @param fechaDePago - El valor de fechaDePago.
     */
    public setFechaDePago(fechaDePago: string): void {
        this.update((state) => ({
            ...state,
            fechaDePago,
        }));
    }

    /**
     * Establece el estado de importeDePago.
     * @param importeDePago - El valor de importeDePago.
     */
    public setImporteDePago(importeDePago: string): void {
        this.update((state) => ({
            ...state,
            importeDePago,
        }));
    }

    /**
     * Establece el estado de tipoDocumento.
     * @param tipoDocumento - El valor de tipoDocumento.
     */
    public setTipoDocumento(tipoDocumento: string): void {
        this.update((state) => ({
            ...state,
            tipoDocumento,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosDenominacionSocial.
     * @param tercerosRelacionadosDenominacionSocial - El valor de tercerosRelacionadosDenominacionSocial.
     */
    public setTercerosRelacionadosDenominacionSocial(tercerosRelacionadosDenominacionSocial: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosDenominacionSocial,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosTerceroNombre.
     * @param tercerosRelacionadosTerceroNombre - El valor de tercerosRelacionadosTerceroNombre.
     */
    public setTercerosRelacionadosTerceroNombre(tercerosRelacionadosTerceroNombre: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosTerceroNombre,
        }));
    }

    /**
     * Establece el estado de tercerosNacionalidad.
     * @param tercerosNacionalidad - El valor de tercerosNacionalidad.
     */
    public setTercerosNacionalidad(tercerosNacionalidad: string): void {
        this.update((state) => ({
            ...state,
            tercerosNacionalidad,
        }));
    }

    /**
     * Establece el estado de tipoPersona.
     * @param tipoPersona - El valor de tipoPersona.
     */
    public setTipoPersona(tipoPersona: string): void {
        this.update((state) => ({
            ...state,
            tipoPersona,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosRfc.
     * @param tercerosRelacionadosRfc - El valor de tercerosRelacionadosRfc.
     */
    public setTercerosRelacionadosRfc(tercerosRelacionadosRfc: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosRfc,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosCurp.
     * @param tercerosRelacionadosCurp - El valor de tercerosRelacionadosCurp.
     */
    public setTercerosRelacionadosCurp(tercerosRelacionadosCurp: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosCurp,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosRazonSocial.
     * @param tercerosRelacionadosRazonSocial - El valor de tercerosRelacionadosRazonSocial.
     */
    public setTercerosRelacionadosRazonSocial(tercerosRelacionadosRazonSocial: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosRazonSocial,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosPais.
     * @param tercerosRelacionadosPais - El valor de tercerosRelacionadosPais.
     */
    public setTercerosRelacionadosPais(tercerosRelacionadosPais: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosPais,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosEstado.
     * @param tercerosRelacionadosEstado - El valor de tercerosRelacionadosEstado.
     */
    public setTercerosRelacionadosEstado(tercerosRelacionadosEstado: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosEstado,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosCodigoPostal.
     * @param tercerosRelacionadosCodigoPostal - El valor de tercerosRelacionadosCodigoPostal.
     */
    public setTercerosRelacionadosCodigoPostal(tercerosRelacionadosCodigoPostal: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosCodigoPostal,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosCalle.
     * @param tercerosRelacionadosCalle - El valor de tercerosRelacionadosCalle.
     */
    public setTercerosRelacionadosCalle(tercerosRelacionadosCalle: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosCalle,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosNumeroExterior.
     * @param tercerosRelacionadosNumeroExterior - El valor de tercerosRelacionadosNumeroExterior.
     */
    public setTercerosRelacionadosNumeroExterior(tercerosRelacionadosNumeroExterior: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosNumeroExterior,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosNumeroInterior.
     * @param tercerosRelacionadosNumeroInterior - El valor de tercerosRelacionadosNumeroInterior.
     */
    public setTercerosRelacionadosNumeroInterior(tercerosRelacionadosNumeroInterior: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosNumeroInterior,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosLada.
     * @param tercerosRelacionadosLada - El valor de tercerosRelacionadosLada.
     */
    public setTercerosRelacionadosLada(tercerosRelacionadosLada: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosLada,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosTelefono.
     * @param tercerosRelacionadosTelefono - El valor de tercerosRelacionadosTelefono.
     */
    public setTercerosRelacionadosTelefono(tercerosRelacionadosTelefono: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosTelefono,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosCorreoElectronico.
     * @param tercerosRelacionadosCorreoElectronico - El valor de tercerosRelacionadosCorreoElectronico.
     */
    public setTercerosRelacionadosCorreoElectronico(tercerosRelacionadosCorreoElectronico: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosCorreoElectronico,
        }));
    }

    /**
     * Establece el estado de tablaDato.
     * @param tablaDato - El valor de tablaDato.
     */
    public setScianTabla(tablaDato: ScianDatos[]): void {
        this.update((state) => ({
            ...state,
            scianTabla: tablaDato,
        }));
    }

    /**
     * Establece el estado de datosPersonalesNombre.
     * @param datosPersonalesNombre - El valor de datosPersonalesNombre.
     */
    public setDatosPersonalesNombre(datosPersonalesNombre: string): void {
        this.update((state) => ({
            ...state,
            datosPersonalesNombre,
        }));
    }

    /**
     * Establece el estado de datosPersonalesPrimerApellido.
     * @param datosPersonalesPrimerApellido - El valor de datosPersonalesPrimerApellido.
     */
    public setDatosPersonalesPrimerApellido(datosPersonalesPrimerApellido: string): void {
        this.update((state) => ({
            ...state,
            datosPersonalesPrimerApellido,
        }));
    }

    /**
     * Establece el estado de datosPersonalesSegundoApellido.
     * @param datosPersonalesSegundoApellido - El valor de datosPersonalesSegundoApellido.
     */
    public setDatosPersonalesSegundoApellido(datosPersonalesSegundoApellido: string): void {
        this.update((state) => ({
            ...state,
            datosPersonalesSegundoApellido,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosMunicipio.
     * @param tercerosRelacionadosMunicipio - El valor de tercerosRelacionadosMunicipio.
     */
    public setTercerosRelacionadosMunicipio(tercerosRelacionadosMunicipio: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosMunicipio,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosLocalidad.
     * @param tercerosRelacionadosLocalidad - El valor de tercerosRelacionadosLocalidad.
     */
    public setTercerosRelacionadosLocalidad(tercerosRelacionadosLocalidad: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosLocalidad,
        }));
    }

    /**
     * Establece el estado de tercerosRelacionadosColonia.
     * @param tercerosRelacionadosColonia - El valor de tercerosRelacionadosColonia.
     */
    public setTercerosRelacionadosColonia(tercerosRelacionadosColonia: string): void {
        this.update((state) => ({
            ...state,
            tercerosRelacionadosColonia,
        }));
    }

    /**
     * Establece el estado de manifiestos.
     * @param manifiestos - El valor de manifiestos.
     */
    public setManifiestos(manifiestos: boolean): void {
        this.update((state) => ({
            ...state,
            manifiestos,
        }));
    }
    /**
* Guarda el ID de la solicitud en el estado.
*
* @param idSolicitud - El ID de la solicitud que se va a guardar.
*/
    public setIdSolicitud(idSolicitud: number): void {
        this.update((state) => ({
            ...state,
            idSolicitud,
        }));
    }

    /** Actualiza el formulario de datos de la solicitud. */
    public updateDatosSolicitudFormState(datosSolicitudFormState: DatosSolicitudFormState): void {
        this.update((state) => ({
            ...state,
            datosSolicitudFormState,
        }));
    }

    /** Actualiza configuración SCIAN. */
    public updateScianConfigDatos(scianConfigDatos: TablaScianConfig[]): void {
        this.update((state) => ({
            ...state,
            scianConfigDatos,
        }));
    }

    /** Actualiza configuración de mercancías. */
    public updateTablaMercanciasConfigDatos(tablaMercanciasConfigDatos: TablaMercanciasDatos[]): void {
        this.update((state) => ({
            ...state,
            tablaMercanciasConfigDatos,
        }));
    }

    public setDynamicFieldValue(fieldName: string, value: unknown): void {
        this.update((state) => ({
            ...state,
            [fieldName]: value,
        }));
    }

}

