import { Destinatario, Fabricante, Facturador, Proveedor,PagoDerechosFormState } from '../../../../shared/models/terceros-relacionados.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { DatosSolicitudFormState } from '../../../../shared/models/datos-solicitud.model';

/**
 * Creacion del estado inicial para la interfaz de tramite 260701
 * @returns Solicitud260701
 */
export interface Solicitud260917State {
    /**
     * denominacionORazonSocial
     * @type {string}
     */
    denominacionORazonSocial: string;
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
     * El valor de marcarEnCasoDeQueSea.
     */
    marcarEnCasoDeQueSea: string;
    /**
     * El valor de regimen.
     */
    regimen: string;
    /**
     * El valor de aduanasEntradas.
     */
    aduanasEntradas: string;
    /**
     * El valor de numeroPermiso.
     */
    numeroPermiso: string;
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
     * El valor de claveDeLosLotes.
     */
    claveDeLosLotes: string;
    /**
     * El valor de cumplimiento.
     */
    cumplimiento: string;
    /**
     * El valor de claveDeReferencia.
     */
    claveDeReferencia: string;
    /**
     * El valor de cadenaDependencia.
     */
    cadenaDependencia: string;
    /**
     * El valor de banco.
     */
    banco: string;
    /**
     * El valor de llaveDePago.
     */
    llaveDePago: string;
    /**
     * El valor de fechaPago.
     */
    fechaPago: string;
    /**
     * El valor de importePago.
     */
    importePago: string;
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
     * El valor de denominacionSocial.
     */
    denominacionSocial: string;
    /**
     * El valor de terceroNombre.
     */
    terceroNombre: string;
    /**
     * El valor de primerApellido.
     */
    primerApellido: string;
    /**
     * El valor de nacional.
     */
    nacional: string;
    /**
     * El valor de extranjero.
     */
    extranjero: string;
    /**
     * El valor de tipoPersona.
     */
    tipoPersona: string;
    /**
     * El valor de tercerosRelacionadosRfc.
     */
    tercerosRelacionadosRfc: string;
    /**
     * El valor de curp.
     */
    curp: string;
    /**
     * El valor de razonSocial.
     */
    razonSocial: string;
    /**
     * El valor de pais.
     */
    pais: string;
    /**
     * El valor de tercerosRelacionadosEstado.
     */
    tercerosRelacionadosEstado: string;
    /**
     * El valor de tercerosRelacionadosMunicipio.
     */
    tercerosRelacionadosMunicipio: string;
    /**
     * El valor de tercerosRelacionadosLocalidad.
     */
    tercerosRelacionadosLocalidad: string;
    /**
     * El valor de tercerosRelacionadosCodigoPostal.
     */
    tercerosRelacionadosCodigoPostal: string;
    /**
     * El valor de tercerosRelacionadosColonia.
     */
    tercerosRelacionadosColonia: string;
    /**
     * El valor de tercerosRelacionadosCalle.
     */
    tercerosRelacionadosCalle: string;
    /**
     * El valor de numeroExterior.
     */
    numeroExterior: string;
    /**
     * El valor de numeroInterior.
     */
    numeroInterior: string;
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
     * El valor de muncipio.
     */
    muncipio: string;
    /**
     * El valor de tipoOperacion.
     */
    tipoOperacion: string;
    /**
     * El valor de justificacion.
     */
    justificacion: string;

    /**
     * RFC del responsable sanitario del establecimiento.
     */
    rfcResponsableSanitario: string;

    /**
     * Indica si se aceptan los manifiestos. Valores esperados: 'Sí' o 'No'.
     */
    aceptaManifiestos: string;

    /**
     * Indica si se acepta la publicación de información confidencial. Valores esperados: 'Sí' o 'No'.
     */
    aceptaPublicacion: string;

    /**
     * RFC del representante legal.
     */
    rfcRepresentante: string;

    /**
     * Razón social del representante legal.
     */
    razonSocialRepresentante: string;

    /**
     * Apellido paterno del representante legal.
     */
    apellidoPaternoRepresentante: string;

    /**
     * Apellido materno del representante legal.
     */
    apellidoMaternoRepresentante: string;
    /**
       * Lista de fabricantes en la tabla de datos.
       */
      fabricanteTablaDatos: Fabricante[];
      /**
       * Lista de proveedores en la tabla de datos.
       */
      proveedorTablaDatos: Proveedor[];
       /**
       * Lista de destinatarios finales en la tabla de datos.
       */
      destinatarioFinalTablaDatos: Destinatario[];
     /**
       * Lista de facturadores en la tabla de datos.
       */
      facturadorTablaDatos: Facturador[];

       /**
   * Estado del formulario de pago de derechos.
   */
  pagoDerechos: PagoDerechosFormState;

  datosSolicitudFormState: DatosSolicitudFormState;

  /**
   * Identificador de la solicitud (opcional).
  */
  idSolicitud: number;

}

/**
 * Crea el estado inicial del formulario Solicitud260917.
 * @returns Estado inicial con todos los campos definidos como cadenas vacías.
 */
export function createInitialState(): Solicitud260917State {
    return {

        idSolicitud: 0,
        /** Denominación o razón social del solicitante. */
        denominacionORazonSocial: '',

        /** Correo electrónico del solicitante. */
        correoElectronico: '',

        /** Código postal del domicilio. */
        codigoPostal: '',

        /** Estado del domicilio. */
        estado: '',

        /** Municipio del domicilio. */
        municipio: '',

        /** Localidad del domicilio. */
        localidad: '',

        /** Colonia del domicilio. */
        colonia: '',

        /** Calle del domicilio. */
        calle: '',

        /** Clave lada del número telefónico. */
        lada: '',

        /** Teléfono del solicitante. */
        telefono: '',

        /** Indica si se marcó el aviso correspondiente. */
        avisoCheckbox: '',

        /** Licencia sanitaria correspondiente. */
        licenciaSanitaria: '',

        /** Campo adicional para marcar condiciones especiales. */
        marcarEnCasoDeQueSea: '',

        /** Régimen bajo el cual opera. */
        regimen: '',

        /** Aduanas de entrada especificadas. */
        aduanasEntradas: '',

        /** Número de permiso. */
        numeroPermiso: '',

        /** Clave SCIAN seleccionada desde el modal. */
        claveScianModal: '',

        /** Descripción SCIAN seleccionada desde el modal. */
        claveDescripcionModal: '',

        /** Clasificación del producto. */
        clasificacion: '',

        /** Detalle adicional de la clasificación. */
        especificarClasificacionProducto: '',

        /** Denominación específica del producto. */
        denominacionEspecifica: '',

        /** Denominación distintiva del producto. */
        denominacionDistintiva: '',

        /** Denominación común del producto. */
        denominacionComun: '',

        /** Tipo de producto. */
        tipoDeProducto: '',

        /** Estado físico del producto. */
        estadoFisico: '',

        /** Fracción arancelaria del producto. */
        fraccionArancelaria: '',

        /** Descripción de la fracción arancelaria. */
        descripcionFraccion: '',

        /** Cantidad en unidad de medida de transporte. */
        cantidadUMT: '',

        /** Unidad de medida de transporte. */
        UMT: '',

        /** Cantidad en unidad de medida comercial. */
        cantidadUMC: '',

        /** Unidad de medida comercial. */
        UMC: '',

        /** Presentación del producto. */
        presentacion: '',

        /** Número de registro del producto. */
        numeroRegistro: '',

        /** Fecha de caducidad del producto. */
        fechaCaducidad: '',

        /** Clave de los lotes del producto. */
        claveDeLosLotes: '',

        /** Cumplimiento de requisitos del producto. */
        cumplimiento: '',

        /** Clave de referencia de pago. */
        claveDeReferencia: '',

        /** Cadena de dependencia asociada al pago. */
        cadenaDependencia: '',

        /** Banco receptor del pago. */
        banco: '',

        /** Llave generada para el pago. */
        llaveDePago: '',

        /** Fecha en la que se realizó el pago. */
        fechaPago: '',

        /** Importe del pago realizado. */
        importePago: '',

        /** RFC del contribuyente o tercero. */
        rfc: '',

        /** Nombre del contribuyente o tercero. */
        nombre: '',

        /** Apellido paterno. */
        apellidoPaterno: '',

        /** Apellido materno. */
        apellidoMaterno: '',

        /** Denominación social (si aplica). */
        denominacionSocial: '',

        /** Nombre del tercero relacionado. */
        terceroNombre: '',

        /** Primer apellido del tercero relacionado. */
        primerApellido: '',

        /** Marca si el tercero es nacional. */
        nacional: '',

        /** Marca si el tercero es extranjero. */
        extranjero: '',

        /** Tipo de persona (física o moral). */
        tipoPersona: '',

        /** RFC del tercero relacionado. */
        tercerosRelacionadosRfc: '',

        /** CURP del tercero relacionado. */
        curp: '',

        /** Razón social del tercero. */
        razonSocial: '',

        /** País del tercero. */
        pais: '',

        /** Estado del tercero. */
        tercerosRelacionadosEstado: '',

        /** Municipio del tercero. */
        tercerosRelacionadosMunicipio: '',

        /** Localidad del tercero. */
        tercerosRelacionadosLocalidad: '',

        /** Código postal del tercero. */
        tercerosRelacionadosCodigoPostal: '',

        /** Colonia del tercero. */
        tercerosRelacionadosColonia: '',

        /** Calle del tercero. */
        tercerosRelacionadosCalle: '',

        /** Número exterior del domicilio del tercero. */
        numeroExterior: '',

        /** Número interior del domicilio del tercero. */
        numeroInterior: '',

        /** Lada del teléfono del tercero. */
        tercerosRelacionadosLada: '',

        /** Teléfono del tercero. */
        tercerosRelacionadosTelefono: '',

        /** Correo electrónico del tercero. */
        tercerosRelacionadosCorreoElectronico: '',

        /** Municipio (campo extra). */
        muncipio: '',

        /** Tipo de operación del trámite. */
        tipoOperacion: '',

        /** Justificación de la operación. */
        justificacion: '',

        /** RFC del responsable sanitario. */
        rfcResponsableSanitario: '',

        /** Aceptación de manifiestos por parte del usuario. */
        aceptaManifiestos: '',

        /** Aceptación de publicación de datos confidenciales. */
        aceptaPublicacion: '',

        /** RFC del representante legal. */
        rfcRepresentante: '',

        /** Razón social del representante. */
        razonSocialRepresentante: '',

        /** Apellido paterno del representante. */
        apellidoPaternoRepresentante: '',

        /** Apellido materno del representante. */
        apellidoMaternoRepresentante: '',
        fabricanteTablaDatos: [],
        proveedorTablaDatos: [],
        destinatarioFinalTablaDatos: [],
        facturadorTablaDatos: [],
        pagoDerechos: {
            claveReferencia: '',
            cadenaDependencia: '',
            estado: '',
            llavePago: '',
            fechaPago: '',
            importePago: '',
        },

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
            aeropuerto: false,
            publico: '',
            representanteRfc: '',
            representanteNombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
        }

    }
}

/**
 * Servicio que gestiona el estado del trámite 260701.
 */
@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'tramite260917', resettable: true })
export class Tramite260917Store extends Store<Solicitud260917State> {
    /**
     * Crea una instancia de Tramite260917Store.
     * @constructor
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Establece el estado de denominacionORazonSocial.
     * @param denominacionORazonSocial - El valor de denominacionORazonSocial.
     */
    public setDenominacionORazonSocial(denominacionORazonSocial: string): void {
        this.update((state) => ({
            ...state,
            denominacionORazonSocial,
        }));
    }
    /**
     * Establece el estado de correoElectronico.
     * @param correoElectronico - El valor de correoElectronico.
     */
    public setCorreoElectronico(correoElectronico: string): void {
        this.update((state) => ({
            ...state,
            correoElectronico,
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
     * Establece el estado de localidad.
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
     * Establece el estado de avisoCheckbox.
     * @param avisoCheckbox - El valor de avisoCheckbox.
     */
    public setAvisoCheckbox(avisoCheckbox: string): void {
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
     * Establece el estado de marcarEnCasoDeQueSea.
     * @param marcarEnCasoDeQueSea - El valor de marcarEnCasoDeQueSea.
     */
    public setMarcarEnCasoDeQueSea(marcarEnCasoDeQueSea: string): void {
        this.update((state) => ({
            ...state,
            marcarEnCasoDeQueSea,
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
    public setAduanasEntradas(aduanasEntradas: string): void {
        this.update((state) => ({
            ...state,
            aduanasEntradas,
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
     * Establece el estado de especificarClasificacionProducto.
     * @param especificarClasificacionProducto - El valor de especificarClasificacionProducto.
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
     * Establece el estado de descripcionFraccion.
     * @param descripcionFraccion - El valor de descripcionFraccion.
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
     * Establece el estado de claveDeLosLotes.
     * @param claveDeLosLotes - El valor de claveDeLosLotes.
     */
    public setClaveDeLosLotes(claveDeLosLotes: string): void {
        this.update((state) => ({
            ...state,
            claveDeLosLotes,
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
     * Establece el estado de cadenaDependencia.
     * @param cadenaDependencia - El valor de cadenaDependencia.
     */
    public setCadenaDependencia(cadenaDependencia: string): void {
        this.update((state) => ({
            ...state,
            cadenaDependencia,
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
     * Establece el estado de llaveDePago.
     * @param llaveDePago - El valor de llaveDePago.
     */
    public setLlaveDePago(llaveDePago: string): void {
        this.update((state) => ({
            ...state,
            llaveDePago,
        }));
    }
    /**
     * Establece el estado de fechaPago.
     * @param fechaPago - El valor de fechaPago.
     */
    public setFechaPago(fechaPago: string): void {
        this.update((state) => ({
            ...state,
            fechaPago,
        }));
    }
    /**
     * Establece el estado de importePago.
     * @param importePago - El valor de importePago.
     */
    public setImportePago(importePago: string): void {
        this.update((state) => ({
            ...state,
            importePago,
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
     * Establece el estado de denominacionSocial.
     * @param denominacionSocial - El valor de denominacionSocial.
     */
    public setDenominacionSocial(denominacionSocial: string): void {
        this.update((state) => ({
            ...state,
            denominacionSocial,
        }));
    }
    /**
     * Establece el estado de terceroNombre.
     * @param terceroNombre - El valor de terceroNombre.
     */
    public setTerceroNombre(terceroNombre: string): void {
        this.update((state) => ({
            ...state,
            terceroNombre,
        }));
    }
    /**
     * Establece el estado de primerApellido.
     * @param primerApellido - El valor de primerApellido.
     */
    public setPrimerApellido(primerApellido: string): void {
        this.update((state) => ({
            ...state,
            primerApellido,
        }));
    }
    /**
     * Establece el estado de nacional.
     * @param nacional - El valor de nacional.
     */
    public setNacional(nacional: string): void {
        this.update((state) => ({
            ...state,
            nacional,
        }));
    }
    /**
     * Establece el estado de extranjero.
     * @param extranjero - El valor de extranjero.
     */
    public setExtranjero(extranjero: string): void {
        this.update((state) => ({
            ...state,
            extranjero,
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
     * Establece el estado de curp.
     * @param curp - El valor de curp.
     */
    public setCurp(curp: string): void {
        this.update((state) => ({
            ...state,
            curp,
        }));
    }
    /**
     * Establece el estado de razonSocial.
     * @param razonSocial - El valor de razonSocial.
     */
    public setRazonSocial(razonSocial: string): void {
        this.update((state) => ({
            ...state,
            razonSocial,
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
     * Establece el estado de numeroExterior.
     * @param numeroExterior - El valor de numeroExterior.
     */
    public setNumeroExterior(numeroExterior: string): void {
        this.update((state) => ({
            ...state,
            numeroExterior,
        }));
    }
    /**
     * Establece el estado de numeroInterior.
     * @param numeroInterior - El valor de numeroInterior.
     */
    public setNumeroInterior(numeroInterior: string): void {
        this.update((state) => ({
            ...state,
            numeroInterior,
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
     * Establece el estado de muncipio.
     * @param muncipio - El valor de muncipio.
     */
    public setMuncipio(muncipio: string): void {
        this.update((state) => ({
            ...state,
            muncipio,
        }));
    }
    /**
     * Establece el estado de tipoOperacion.
     * @param tipoOperacion - El valor de tipoOperacion.
     */
    public setTipoOperacion(tipoOperacion: string): void {
        this.update((state) => ({
            ...state,
            tipoOperacion,
        }));
    }
    /**
     * Establece el estado de justificacion.
     * @param justificacion - El valor de justificacion.
     */
    public setJustificacion(justificacion: string): void {
        this.update((state) => ({
            ...state,
            justificacion,
        }));
    }

    /**
     * Actualiza el RFC del responsable sanitario en el estado.
     * @param rfcResponsableSanitario - Nuevo valor del RFC del responsable sanitario.
     */
    public setRFCResponsableSanitario(rfcResponsableSanitario: string): void {
        this.update((state) => ({
            ...state,
            rfcResponsableSanitario,
        }));
    }

    /**
     * Actualiza el valor de aceptación de manifiestos en el estado.
     * @param aceptaManifiestos - Valor que indica si se aceptan los manifiestos.
     */
    public setAceptaManifiestos(aceptaManifiestos: string): void {
        this.update((state) => ({
            ...state,
            aceptaManifiestos,
        }));
    }

    /**
     * Actualiza el valor de aceptación de publicación en el estado.
     * @param aceptaPublicacion - Valor que indica si se acepta la publicación.
     */
    public setAceptaPublicacion(aceptaPublicacion: string): void {
        this.update((state) => ({
            ...state,
            aceptaPublicacion,
        }));
    }

    /**
     * Actualiza el RFC del representante en el estado.
     * @param rfcRepresentante - Nuevo valor del RFC del representante.
     */
    public setRFCRepresentante(rfcRepresentante: string): void {
        this.update((state) => ({
            ...state,
            rfcRepresentante,
        }));
    }

    /**
     * Actualiza la razón social del representante en el estado.
     * @param razonSocialRepresentante - Nueva razón social del representante.
     */
    public setRazonSocialRepresentante(razonSocialRepresentante: string): void {
        this.update((state) => ({
            ...state,
            razonSocialRepresentante,
        }));
    }

    /**
     * Actualiza el apellido paterno del representante en el estado.
     * @param apellidoPaternoRepresentante - Nuevo apellido paterno del representante.
     */
    public setApellidoPaternoRepresentante(apellidoPaternoRepresentante: string): void {
        this.update((state) => ({
            ...state,
            apellidoPaternoRepresentante,
        }));
    }

    /**
     * Actualiza el apellido materno del representante en el estado.
     * @param apellidoMaternoRepresentante - Nuevo apellido materno del representante.
     */
    public setApellidoMaternoRepresentante(apellidoMaternoRepresentante: string): void {
        this.update((state) => ({
            ...state,
            apellidoMaternoRepresentante,
        }));
    }

      /**
   * Actualiza la tabla de fabricantes.
   * @param {Fabricante[]} newFabricantes - Nuevos fabricantes a agregar
   */
  public updateFabricanteTablaDatos(newFabricantes: Fabricante[]): void {
    this.update((state) => ({
      ...state,
      fabricanteTablaDatos: [ ...newFabricantes],
    }));
  }

   /**
   * @method fabricanteTablaModificaDatos
   * @description
   * Actualiza los datos seleccionados en la tabla de fabricantes en el estado del trámite.
   * Sustituye el arreglo actual por el nuevo conjunto de fabricantes.
   *
   * @param {Fabricante[]} tabSeleccionado - Lista de fabricantes seleccionados que se asignarán al estado.
   * @returns {void} Este método no retorna ningún valor.
   */
  public fabricanteTablaModificaDatos(tabSeleccionado: Fabricante[]): void {
    this.update((state) => ({
      ...state,
      fabricanteTablaModificaDatos: tabSeleccionado,
    }));
  }


    /**
   * Actualiza la tabla de proveedores.
   * @param {Proveedor[]} newProveedores - Nuevos proveedores a agregar
   */
  public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaDatos: [...newProveedores],
    }));
  }
  /**
   * Actualiza la tabla de destinatarios finales.
   * @param {Destinatario[]} newDestinatarios - Nuevos destinatarios a agregar
   */
  public updateDestinatarioFinalTablaDatos(
    newDestinatarios: Destinatario[]
  ): void {
    this.update((state) => ({
      ...state,
      destinatarioFinalTablaDatos: [
        
        ...newDestinatarios,
      ],
    }));
  }

   /**
   * Actualiza la tabla de facturadores.
   * @param {Facturador[]} newFacturadores - Nuevos facturadores a agregar
   */
  public updateFacturadorTablaDatos(newFacturadores: Facturador[]): void {
    this.update((state) => ({
      ...state,
      facturadorTablaDatos: [...newFacturadores],
    }));
  }
  /**
   * @method updatePagoDerechos
   * @description Actualiza el estado del formulario de pago de derechos.
   * @param {PagoDerechosFormState} nuevoPagoDerechos - Nuevo estado del formulario.
   */
  public updatePagoDerechos(nuevoPagoDerechos: PagoDerechosFormState): void {
    this.update((state) => ({
      ...state,
      pagoDerechos: nuevoPagoDerechos,
    }));
  }

  /**
   * @method setIdSolicitud
   * @description Establece el identificador de la solicitud.
   * @param {number} idSolicitud - Nuevo identificador de la solicitud.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  public updateDatosSolicitudFormState(
    datosSolicitudFormState: DatosSolicitudFormState
  ): void {
    this.update((state) => ({
      ...state,
      datosSolicitudFormState,
    }));
  }



}