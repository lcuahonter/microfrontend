import { DatosSolicitudFormState, TablaMercanciasDatos, TablaOpcionConfig, TablaScianConfig } from '../../shared/models/shared2606/datos-solicitud.model';
import { Fabricante, Proveedor } from '../../shared/models/terceros-relacionados.model';
import {ProductoTable, ScianTable, SolicitudTable } from '../../tramites/260601/models/aviso-model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { TABLA_OPCION_DATA } from '../../shared/constantes/shared2606/datos-solicitud.enum';


/**
 * Creacion del estado inicial para la interfaz de tramite 260601
 * @returns AvisoSanitario260601
 */
export interface AvisoSanitarioState {
    idSolicitud: number;

    /** Nacionalidad de terceros relacionados. */
    tercerosNacionalidad: string | number;

    /** Tipo de persona de terceros relacionados. */
    tipoPersona: string | number;

    /** RFC del proveedor relacionado. */
    rfcProveedor: string;

    /** Indica si el campo de RFC del proveedor está inhabilitado. */
    rfcProveedorInhabilitar: boolean;

    /** CURP del proveedor relacionado. */
    curp: string;

    /** Indica si el campo de CURP está inhabilitado. */
    curpInhabilitar: boolean;

    /** Nombre del proveedor relacionado. */
    proveedorNombre: string;

    /** Indica si el campo del nombre del proveedor está inhabilitado. */
    proveedorNombreInhabilitar: boolean;

    /** Primer apellido del proveedor relacionado. */
    proveedorPrimerApellido: string;

    /** Indica si el campo del primer apellido del proveedor está inhabilitado. */
    proveedorPrimerApellidoInhabilitar: boolean;

    /** Segundo apellido del proveedor relacionado. */
    proveedorSegundoApellido: string;

    /** Indica si el campo del segundo apellido del proveedor está inhabilitado. */
    proveedorSegundoApellidoInhabilitar: boolean;

    /** Razón social del proveedor relacionado. */
    proveedorRazonSocial: string;

    /** Indica si el campo de razón social del proveedor está inhabilitado. */
    proveedorRazonSocialInhabilitar: boolean;

    /** Clave del país del domicilio. */
    cvePais: string;

    /** Indica si el campo del país está inhabilitado. */
    cvePaisInhabilitar: boolean;

    /** Estado del domicilio. */
    domicilioEstado: string;

    /** Indica si el campo del estado del domicilio está inhabilitado. */
    domicilioEstadoInhabilitar: boolean;

    /** Alcaldía del domicilio. */
    alcaldia: string;

    /** Indica si el campo de la alcaldía está inhabilitado. */
    alcaldiaInhabilitar: boolean;

    /** Localidad del domicilio. */
    localidad: string;

    /** Indica si el campo de la localidad está inhabilitado. */
    localidadInhabilitar: boolean;

    /** Código postal del domicilio. */
    domicilioCodigoPostal: string;

    /** Indica si el campo del código postal del domicilio está inhabilitado. */
    domicilioCodigoPostalInhabilitar: boolean;

    /** Colonia del domicilio. */
    colonia: string;

    /** Indica si el campo de la colonia está inhabilitado. */
    coloniaInhabilitar: boolean;

    /** Calle del domicilio. */
    domicilioCalle: string;

    /** Indica si el campo de la calle del domicilio está inhabilitado. */
    domicilioCalleInhabilitar: boolean;

    /** Número exterior del domicilio. */
    numeroExterior: string;

    /** Indica si el campo del número exterior está inhabilitado. */
    numeroExteriorInhabilitar: boolean;

    /** Número interior del domicilio. */
    numeroInterior: string;

    /** Indica si el campo del número exterior está inhabilitado. */
    numeroInteriorInhabilitar: boolean;

    /** LADA del número telefónico del domicilio. */
    domicilioLada: string;

    /** Representa el número interior del domicilio y su estado editable. */
    domicilioLadaInhabilitar: boolean;

    /** Teléfono del domicilio. */
    domicilioTelefono: string;

    /** Indica si el campo de teléfono del domicilio está inhabilitado. */
    domicilioTelefonoInhabilitar: boolean;

    /** Correo electrónico del domicilio. */
    domicilioCorreoElectronico: string;

    /** Indica si el campo de correo electrónico del domicilio está inhabilitado. */
    domicilioCorreoElectronicoInhabilitar: boolean;

    /** Indica si se debe mostrar el botón de búsqueda para RFC. */
    mostrarRfcBuscarBoton: boolean;

    /** Indica si se debe mostrar el botón de búsqueda para CURP. */
    mostrarCurpBuscarBoton: boolean;

    /** Indica si el país del domicilio está inhabilitado. */
    inhabilitarPais: boolean;

    /** Nacionalidad de terceros relacionados. */
    tercerosNacionalidadFabricante: string | number;

    /** Tipo de persona de terceros relacionados. */
    tipoPersonaFabricante: string | number;

    /** RFC del fabricante relacionado. */
    rfcFabricante: string;

    /** Indica si el campo de RFC del fabricante está inhabilitado. */
    rfcFabricanteInhabilitar: boolean;

    /** CURP del fabricante relacionado. */
    curpFabricante: string;

    /** Indica si el campo de CURP está inhabilitado. */
    curpFabricanteInhabilitar: boolean;

    /** Nombre del fabricante relacionado. */
    fabricanteNombre: string;

    /** Indica si el campo del nombre del fabricante está inhabilitado. */
    fabricanteNombreInhabilitar: boolean;

    /** Primer apellido del fabricante relacionado. */
    fabricantePrimerApellido: string;

    /** Indica si el campo del primer apellido del fabricante está inhabilitado. */
    fabricantePrimerApellidoInhabilitar: boolean;

    /** Segundo apellido del fabricante relacionado. */
    fabricanteSegundoApellido: string;

    /** Indica si el campo del segundo apellido del fabricante está inhabilitado. */
    fabricanteSegundoApellidoInhabilitar: boolean;

    /** Razón social del fabricante relacionado. */
    fabricanteRazonSocial: string;

    /** Indica si el campo de razón social del fabricante está inhabilitado. */
    fabricanteRazonSocialInhabilitar: boolean;

    /** Clave del país del domicilio. */
    cvePaisFabricante: string;

    /** Indica si el campo del país está inhabilitado. */
    cvePaisFabricanteInhabilitar: boolean;

    /** Estado del domicilio. */
    estadoFabricante: string;

    /** Indica si el campo del estado del domicilio está inhabilitado. */
    estadoFabricanteInhabilitar: boolean;

    /** Alcaldía del domicilio. */
    alcaldiaFabricante: string;

    /** Indica si el campo de la alcaldía está inhabilitado. */
    alcaldiaFabricanteInhabilitar: boolean;

    /** Localidad del domicilio. */
    localidadFabricante: string;

    /** Indica si el campo de la localidad está inhabilitado. */
    localidadFabricanteInhabilitar: boolean;

    /** Código postal del domicilio. */
    codigoPostalFabricante: string;

    /** Indica si el campo del código postal del domicilio está inhabilitado. */
    codigoPostalFabricanteInhabilitar: boolean;

    /** Colonia del domicilio. */
    coloniaFabricante: string;

    /** Indica si el campo de la colonia está inhabilitado. */
    coloniaFabricanteInhabilitar: boolean;

    /** Calle del domicilio. */
    calleFabricante: string;

    /** Indica si el campo de la calle del domicilio está inhabilitado. */
    calleFabricanteInhabilitar: boolean;

    /** Número exterior del domicilio. */
    numeroExteriorFabricante: string;

    /** Indica si el campo del número exterior está inhabilitado. */
    numeroExteriorFabricanteInhabilitar: boolean;

    /** Número interior del domicilio. */
    numeroInteriorFabricante: string;

    /** Indica si el campo del número interior está inhabilitado. */
    numeroInteriorFabricanteInhabilitar: boolean;

    /** LADA del número telefónico del domicilio. */
    ladaFabricante: string;

    /** Indica si el campo del lada está inhabilitado. */
    ladaFabricanteInhabilitar: boolean;

    /** Teléfono del domicilio. */
    telefonoFabricante: string;

    /** Indica si el campo del teléfono está inhabilitado. */
    telefonoFabricanteInhabilitar: boolean;

    /** Correo electrónico del domicilio. */
    correoElectronicoFabricante: string;

    /** Indica si el campo del correo electrónico está inhabilitado. */
    correoElectronicoFabricanteInhabilitar: boolean;

    /** Indica si se debe mostrar el botón de búsqueda para RFC. */
    mostrarRfcFabricanteBuscarBoton: boolean;

    /** Indica si se debe mostrar el botón de búsqueda para CURP. */
    mostrarCurpFabricanteBuscarBoton: boolean;

    /** Indica si el país del domicilio está inhabilitado. */
    inhabilitarPaisFabricante: boolean;

        /**
     * @property {Proveedor[]} proveedorTablaDatos
     * @description
     * Arreglo que contiene los datos de los proveedores relacionados con el trámite.
     */
    proveedorTablaDatos: Proveedor[];

    /**
     * @property {Fabricante[]} fabricanteTablaDatos
     * @description
     * Arreglo que contiene los datos de los fabricantes relacionados con el trámite.
     */
    fabricanteTablaDatos: Fabricante[];

    /**
     * @property {number} tabSeleccionado
     * @description
     * Índice de la pestaña actualmente seleccionada en el formulario del trámite.
     * Permite controlar la navegación y el estado de la interfaz de usuario.
     */
    tabSeleccionado?: number;
    /** Datos de SCIAN para la tabla. */
    scianBodyData : ScianTable[];
    /** Datos de productos para la tabla. */
    productoBodyData:ProductoTable[];
        /**
     * @property {string[]} cvePaisDeOrigen
     * @description
     * Arreglo que contiene las claves de los países de origen seleccionados para el producto.
     */
    cvePaisDeOrigen: string[];

    /**
     * @property {string[]} cvePaisDeProcedencia
     * @description
     * Arreglo que contiene las claves de los países de procedencia seleccionados para el producto.
     */
    cvePaisDeProcedencia: string[];

    /**
     * @property {string[]} cveUsoEspecifico
     * @description
     * Arreglo que contiene las claves de los usos específicos seleccionados para el producto.
     */
    cveUsoEspecifico: string[];
     /**
     * Lista de proveedores relacionados con el trámite.
     */
    proveedorTablaModificaDatos: Proveedor[];

    /**
     * Lista de fabricantes relacionados con el trámite.
     */
    fabricanteTablaModificaDatos: Fabricante[];

    datosSolicitudFormState: DatosSolicitudFormState;

    opcionConfigDatos: TablaOpcionConfig[];

    scianConfigDatos: TablaScianConfig[],

    tablaMercanciasConfigDatos: TablaMercanciasDatos[];

    opcionesColapsableState: boolean;
}

/**
 * Función que crea el estado inicial para el trámite 260601.
 * 
 * @returns Estado inicial predefinido.
 */
export function createInitialState(): AvisoSanitarioState {
    return {
        idSolicitud: 0,
        
        tercerosNacionalidad: '',
        tipoPersona: '',
        rfcProveedor: '',
        rfcProveedorInhabilitar: true,
        curp: '',
        curpInhabilitar: true,

        proveedorNombre: '',
        proveedorNombreInhabilitar: true,
        proveedorPrimerApellido: '',
        proveedorPrimerApellidoInhabilitar: true,
        proveedorSegundoApellido: '',
        proveedorSegundoApellidoInhabilitar: true,
        proveedorRazonSocial: '',
        proveedorRazonSocialInhabilitar: true,

        cvePais: '',
        cvePaisInhabilitar: true,
        domicilioEstado: '',
        domicilioEstadoInhabilitar: true,
        alcaldia: '',
        alcaldiaInhabilitar: true,
        localidad: '',
        localidadInhabilitar: true,
        domicilioCodigoPostal: '',
        domicilioCodigoPostalInhabilitar: true,
        colonia: '',
        coloniaInhabilitar: true,
        domicilioCalle: '',
        domicilioCalleInhabilitar: true,
        numeroExterior: '',
        numeroExteriorInhabilitar: true,
        numeroInterior: '',
        numeroInteriorInhabilitar: true,
        domicilioLada: '',
        domicilioLadaInhabilitar: true,
        domicilioTelefono: '',
        domicilioTelefonoInhabilitar: true,
        domicilioCorreoElectronico: '',
        domicilioCorreoElectronicoInhabilitar: true,
        mostrarRfcBuscarBoton: false,
        mostrarCurpBuscarBoton: false,
        inhabilitarPais: true,

        tercerosNacionalidadFabricante: '',
        tipoPersonaFabricante: '',
        rfcFabricante: '',
        rfcFabricanteInhabilitar: true,
        curpFabricante: '',
        curpFabricanteInhabilitar: true,

        fabricanteNombre: '',
        fabricanteNombreInhabilitar: true,
        fabricantePrimerApellido: '',
        fabricantePrimerApellidoInhabilitar: true,
        fabricanteSegundoApellido: '',
        fabricanteSegundoApellidoInhabilitar: true,
        fabricanteRazonSocial: '',
        fabricanteRazonSocialInhabilitar: true,

        cvePaisFabricante: '',
        cvePaisFabricanteInhabilitar: true,
        estadoFabricante: '',
        estadoFabricanteInhabilitar: true,
        alcaldiaFabricante: '',
        alcaldiaFabricanteInhabilitar: true,
        localidadFabricante: '',
        localidadFabricanteInhabilitar: true,
        codigoPostalFabricante: '',
        codigoPostalFabricanteInhabilitar: true,
        coloniaFabricante: '',
        coloniaFabricanteInhabilitar: true,
        calleFabricante: '',
        calleFabricanteInhabilitar: true,
        numeroExteriorFabricante: '',
        numeroExteriorFabricanteInhabilitar: true,
        numeroInteriorFabricante: '',
        numeroInteriorFabricanteInhabilitar: true,
        ladaFabricante: '',
        ladaFabricanteInhabilitar: true,
        telefonoFabricante: '',
        telefonoFabricanteInhabilitar: true,
        correoElectronicoFabricante: '',
        correoElectronicoFabricanteInhabilitar: true,
        mostrarRfcFabricanteBuscarBoton: false,
        mostrarCurpFabricanteBuscarBoton: false,
        inhabilitarPaisFabricante: true,
        proveedorTablaDatos: [],
        fabricanteTablaDatos: [],
        tabSeleccionado: 1,
        scianBodyData: [],
        productoBodyData: [],
        cvePaisDeOrigen: [],
        cvePaisDeProcedencia: [],
        cveUsoEspecifico: [],
        proveedorTablaModificaDatos:[],
        fabricanteTablaModificaDatos:[],

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
        opcionConfigDatos: TABLA_OPCION_DATA,
        scianConfigDatos: [],
        tablaMercanciasConfigDatos: [],
        opcionesColapsableState: false,
    }
}

/**
 * Clase de la tienda (store) para gestionar el estado del trámite 260601.
 */
@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'tramite260601', resettable: true })
export class Tramite260601Store extends Store<AvisoSanitarioState> {
    /**
     * Constructor de la clase `Tramite260601Store`.
     * Inicializa el estado con los valores definidos por `createInitialState`.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Actualiza el RFC del responsable sanitario.
     * 
     * @param RFCResponsableSanitario Nuevo valor del RFC.
     */
    public setRFCResponsableSanitario(RFCResponsableSanitario: string): void {
        this.update((state) => ({
            ...state,
            RFCResponsableSanitario
        }));
    }

    /**
     * Actualiza la razón social.
     * 
     * @param razonSocial Nuevo valor de la razón social.
     */
    public setRazonSocial(razonSocial: string): void {
        this.update((state) => ({
            ...state,
            razonSocial,
        }));
    }

    /**
     * Actualiza el correo electrónico.
     * 
     * @param correoElectronico Nuevo valor del correo electrónico.
     */
    public setCorreoElectronico(correoElectronico: string): void {
        this.update((state) => ({
            ...state,
            correoElectronico,
        }));
    }

    /**
     * Actualiza el código  postal.
     * 
     * @param codigoPostal Nuevo valor del código  postal.
     */
    public setCodigoPostal(codigoPostal: string): void {
        this.update((state) => ({
            ...state,
            codigoPostal,
        }));
    }

    /**
     * Actualiza el estado.
     * 
     * @param cveEstado Nuevo valor del estado.
     */
    public setEstado(cveEstado: string): void {
        this.update((state) => ({
            ...state,
            cveEstado,
        }));
    }

    /**
     * Actualiza el descripción municipio.
     * 
     * @param descripcionMunicipio Nuevo valor del descripción municipio.
     */
    public setDescripcionMunicipio(descripcionMunicipio: string): void {
        this.update((state) => ({
            ...state,
            descripcionMunicipio
        }));
    }

    /**
     * Actualiza el información extra.
     * 
     * @param informacionExtra Nuevo valor del información extra.
     */
    public setInformacionExtra(informacionExtra: string): void {
        this.update((state) => ({
            ...state,
            informacionExtra
        }));
    }

    /**
     * Actualiza el descripción colonia.
     * 
     * @param descripcionColonia Nuevo valor del descripción colonia.
     */
    public setDescripcionColonia(descripcionColonia: string): void {
        this.update((state) => ({
            ...state,
            descripcionColonia
        }));
    }

    /**
     * Actualiza el calle.
     * 
     * @param calle Nuevo valor del calle.
     */
    public setCalle(calle: string): void {
        this.update((state) => ({
            ...state,
            calle
        }));
    }

    /**
     * Actualiza el lada.
     * 
     * @param lada Nuevo valor del lada.
     */
    public setLada(lada: number): void {
        this.update((state) => ({
            ...state,
            lada,
        }));
    }

    /**
     * Actualiza el teléfono.
     * 
     * @param telefono Nuevo valor del teléfono.
     */
    public setTelefono(telefono: number): void {
        this.update((state) => ({
            ...state,
            telefono,
        }));
    }

    /**
     * Actualiza el SCIAN.
     * 
     * @param cveSCIAN Nuevo valor del SCIAN.
     */
    public setClaveScian(cveSCIAN: string): void {
        this.update((state) => ({
            ...state,
            cveSCIAN,
        }));
    }

    /**
     * Actualiza el SCIAN descripción.
     * 
     * @param cveSCIANDescripcion Nuevo valor del SCIAN descripción.
     */
    public setDescripcionScian(cveSCIANDescripcion: string): void {
        this.update((state) => ({
            ...state,
            cveSCIANDescripcion,
        }));
    }
  /**
   * @method cveSCIANID
   * @description
   * Actualiza el ID de la clave SCIAN en el estado.
   * Modifica el identificador numérico asociado al Sistema de Clasificación Industrial de América del Norte.
   * @param {number} cveSCIANID - Nuevo identificador numérico de la clave SCIAN.
   * @returns {void}
   */
    public cveSCIANID(cveSCIANID: number): void {
        this.update((state) => ({
            ...state,
            cveSCIANID,
        }));
    }

    /**
     * Actualiza el aviso funcionamiento.
     * 
     * @param avisoFuncionamiento Nuevo valor del aviso funcionamiento.
     */
    public setAvisoFuncionamiento(avisoFuncionamiento: boolean): void {
        this.update((state) => ({
            ...state,
            avisoFuncionamiento,
        }));
    }

    /**
     * Actualiza el régimen.
     * 
     * @param cveRegimenes Nuevo valor del régimen.
     */
    public setCveRegimenes(cveRegimenes: string): void {
        this.update((state) => ({
            ...state,
            cveRegimenes,
        }));
    }

    /**
     * Actualiza el aduanas.
     * 
     * @param cveAduanas Nuevo valor del aduanas.
     */
    public setCveAduanas(cveAduanas: string): void {
        this.update((state) => ({
            ...state,
            cveAduanas,
        }));
    }

    /**
     * Actualiza el producto clasificación.
     * 
     * @param cveProductoClasificacion Nuevo valor del producto clasificación.
     */
    public setProductoClasificacion(cveProductoClasificacion: string): void {
        this.update((state) => ({
            ...state,
            cveProductoClasificacion,
        }));
    }

    /**
     * Actualiza el específico producto clasificación.
     * 
     * @param cveEspecificoProductoClasifi Nuevo valor del específico producto clasificación.
     */
    public setEspecificoProductoClasificacion(cveEspecificoProductoClasifi: string): void {
        this.update((state) => ({
            ...state,
            cveEspecificoProductoClasifi,
        }));
    }

    /**
     * Actualiza el nombre producto.
     * 
     * @param nombreProducto Nuevo valor del nombre producto.
     */
    public setNombreProducto(nombreProducto: string): void {
        this.update((state) => ({
            ...state,
            nombreProducto,
        }));
    }

    /**
     * Actualiza el marca.
     * 
     * @param marca Nuevo valor del marca.
     */
    public setMarca(marca: string): void {
        this.update((state) => ({
            ...state,
            marca,
        }));
    }

    /**
     * Actualiza el tipo de producto.
     * 
     * @param cveTipoProducto Nuevo valor del tipo de producto.
     */
    public setTipoProducto(cveTipoProducto: string): void {
        this.update((state) => ({
            ...state,
            cveTipoProducto,
        }));
    }

    /**
     * Actualiza el fracción arancelaria.
     * 
     * @param fraccionArancelaria Nuevo valor del fracción arancelaria.
     */
    public setFraccionArancelaria(fraccionArancelaria: string): void {
        this.update((state) => ({
            ...state,
            fraccionArancelaria,
        }));
    }

    /**
     * Actualiza el fracción arancelaria descripción.
     * 
     * @param fraccionArancelariaDescripcion Nuevo valor del fracción arancelaria descripción.
     */
    public setFraccionArancelariaDescripcion(fraccionArancelariaDescripcion: string): void {
        this.update((state) => ({
            ...state,
            fraccionArancelariaDescripcion,
        }));
    }

    /**
     * Actualiza el modelo.
     * 
     * @param modelo Nuevo valor del modelo.
     */
    public setModelo(modelo: string): void {
        this.update((state) => ({
            ...state,
            modelo,
        }));
    }

    /**
     * Actualiza el producto descripción.
     * 
     * @param productoDescripcion Nuevo valor del producto descripción.
     */
    public setProductoDescripcion(productoDescripcion: string): void {
        this.update((state) => ({
            ...state,
            productoDescripcion,
        }));
    }

    /**
     * Actualiza el país destino.
     * 
     * @param correoElectronico Nuevo valor del país destino.
     */
    public setPaisDestino(cvePaisDestino: string): void {
        this.update((state) => ({
            ...state,
            cvePaisDestino,
        }));
    }

    /**
     * Actualiza el seleccionada manifiesto.
     * 
     * @param seleccionadaManifiesto Nuevo valor del seleccionada manifiesto.
     */
    public setSeleccionadaManifiesto(seleccionadaManifiesto: boolean[]): void {
        this.update((state) => ({
            ...state,
            seleccionadaManifiesto
        }));
    }

    /**
     * Actualiza el información confidencial.
     * 
     * @param informacionConfidencial Nuevo valor del información confidencial.
     */
    public setInformacionConfidencial(informacionConfidencial: string): void {
        this.update((state) => ({
            ...state,
            informacionConfidencial,
        }));
    }

    /**
     * Actualiza el rfc.
     * 
     * @param rfc Nuevo valor del rfc.
     */
    public setRfc(rfc: string): void {
        this.update((state) => ({
            ...state,
            rfc,
        }));
    }

    /**
     * Actualiza el nombre o razón social.
     * 
     * @param nombreOrazonsocial Nuevo valor del nombre o razón social.
     */
    public setNombreOrazonsocial(nombreOrazonsocial: string): void {
        this.update((state) => ({
            ...state,
            nombreOrazonsocial,
        }));
    }

    /**
     * Actualiza el apellido paterno.
     * 
     * @param apellidoPaterno Nuevo valor del apellido paterno.
     */
    public setApellidoPaterno(apellidoPaterno: string): void {
        this.update((state) => ({
            ...state,
            apellidoPaterno,
        }));
    }

    /**
     * Actualiza el apellido materno.
     * 
     * @param apellidoMaterno Nuevo valor del apellido materno.
     */
    public setApellidoMaterno(apellidoMaterno: string): void {
        this.update((state) => ({
            ...state,
            apellidoMaterno,
        }));
    }

    /**
     * Actualiza el terceros nacionalidad.
     * 
     * @param tercerosNacionalidadFabricante Nuevo valor del terceros nacionalidad.
     */
    public setTercerosNacionalidadFabricante(tercerosNacionalidadFabricante: string | number): void {
        this.update((state) => ({
            ...state,
            tercerosNacionalidadFabricante,
        }));
    }

    /**
     * Actualiza el tipo persona.
     * 
     * @param tipoPersonaFabricante Nuevo valor del tipo persona.
     */
    public setTipoPersonaFabricante(tipoPersonaFabricante: string | number): void {
        this.update((state) => ({
            ...state,
            tipoPersonaFabricante,
        }));
    }

    /**
     * Actualiza el rfc fabricante.
     * 
     * @param rfcFabricante Nuevo valor del rfc fabricante.
     */
    public setRfcFabricante(rfcFabricante: string): void {
        this.update((state) => ({
            ...state,
            rfcFabricante,
        }));
    }

    /**
     * Actualiza el rfc fabricante inhabilitar.
     * 
     * @param rfcFabricanteInhabilitar Nuevo valor del rfc fabricante inhabilitar.
     */
    public setRfcFabricanteInhabilitar(rfcFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            rfcFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el curp fabricante inhabilitar.
     * 
     * @param curpFabricanteInhabilitar Nuevo valor del curp fabricante inhabilitar.
     */
    public setCurpFabricanteInhabilitar(curpFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            curpFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el curp.
     * 
     * @param curpFabricante Nuevo valor del curp.
     */
    public setCurpFabricante(curpFabricante: string): void {
        this.update((state) => ({
            ...state,
            curpFabricante,
        }));
    }

    /**
     * Actualiza el fabricante nombre.
     * 
     * @param fabricanteNombre Nuevo valor del fabricante nombre.
     */
    public setFabricanteNombre(fabricanteNombre: string): void {
        this.update((state) => ({
            ...state,
            fabricanteNombre,
        }));
    }

    /**
     * Actualiza el nombre fabricante inhabilitar.
     * 
     * @param fabricanteNombreInhabilitar Nuevo valor del nombre fabricante inhabilitar.
     */
    public setFabricanteNombreInhabilitar(fabricanteNombreInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            fabricanteNombreInhabilitar,
        }));
    }

    /**
     * Actualiza el fabricante primer apellido.
     * 
     * @param fabricantePrimerApellido Nuevo valor del fabricante primer apellido.
     */
    public setFabricantePrimerApellido(fabricantePrimerApellido: string): void {
        this.update((state) => ({
            ...state,
            fabricantePrimerApellido,
        }));
    }

    /**
     * Actualiza el nombre fabricante inhabilitar.
     * 
     * @param fabricantePrimerApellidoInhabilitar Nuevo valor del nombre fabricante inhabilitar.
     */
    public setFabricantePrimerApellidoInhabilitar(fabricantePrimerApellidoInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            fabricantePrimerApellidoInhabilitar,
        }));
    }

    /**
     * Actualiza el fabricante segundo apellido.
     * 
     * @param fabricanteSegundoApellido Nuevo valor fabricante segundo apellido.
     */
    public setFabricanteSegundoApellido(fabricanteSegundoApellido: string): void {
        this.update((state) => ({
            ...state,
            fabricanteSegundoApellido,
        }));
    }

    /**
     * Actualiza el fabricante segundo apellido inhabilitar.
     * 
     * @param fabricanteSegundoApellidoInhabilitar Nuevo valor fabricante segundo apellido inhabilitar.
     */
    public setFabricanteSegundoApellidoInhabilitar(fabricanteSegundoApellidoInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            fabricanteSegundoApellidoInhabilitar,
        }));
    }

    /**
     * Actualiza el fabricante razón social.
     * 
     * @param fabricanteRazonSocial Nuevo valor del fabricante razón social.
     */
    public setFabricanteRazonSocial(fabricanteRazonSocial: string): void {
        this.update((state) => ({
            ...state,
            fabricanteRazonSocial,
        }));
    }

    /**
     * Actualiza el fabricante razón social inhabilitar.
     * 
     * @param fabricanteRazonSocialInhabilitar Nuevo valor del fabricante razón social inhabilitar.
     */
    public setFabricanteRazonSocialInhabilitar(fabricanteRazonSocialInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            fabricanteRazonSocialInhabilitar,
        }));
    }

    /**
     * Actualiza el país.
     * 
     * @param cvePaisFabricante Nuevo valor del país.
     */
    public setPaisFabricante(cvePaisFabricante: string): void {
        this.update((state) => ({
            ...state,
            cvePaisFabricante,
        }));
    }

    /**
     * Actualiza el país fabricante inhabilitar.
     * 
     * @param cvePaisFabricanteInhabilitar Nuevo valor del país fabricante inhabilitar.
     */
    public setPaisFabricanteInhabilitar(cvePaisFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            cvePaisFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el fabricante estado.
     * 
     * @param fabricanteEstado Nuevo valor del fabricante estado.
     */
    public setEstadoFabricante(fabricanteEstado: string): void {
        this.update((state) => ({
            ...state,
            fabricanteEstado,
        }));
    }

    /**
     * Actualiza el fabricante estado inhabilitar.
     * 
     * @param estadoFabricanteInhabilitar Nuevo valor del fabricante estado inhabilitar.
     */
    public setEstadoFabricanteInhabilitar(estadoFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            estadoFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el fabricante alcaldía.
     * 
     * @param alcaldiaFabricante Nuevo valor del fabricante alcaldía.
     */
    public setAlcaldiaFabricante(alcaldiaFabricante: string): void {
        this.update((state) => ({
            ...state,
            alcaldiaFabricante,
        }));
    }

    /**
     * Actualiza el fabricante alcaldía inhabilitar.
     * 
     * @param alcaldiaFabricanteInhabilitar Nuevo valor del fabricante alcaldía inhabilitar.
     */
    public setAlcaldiaFabricanteInhabilitar(alcaldiaFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            alcaldiaFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el localidad.
     * 
     * @param localidadFabricante Nuevo valor del localidad.
     */
    public setLocalidadFabricante(localidadFabricante: string): void {
        this.update((state) => ({
            ...state,
            localidadFabricante,
        }));
    }

    /**
     * Actualiza el localidad inhabilitar.
     * 
     * @param localidadFabricanteInhabilitar Nuevo valor del localidad inhabilitar.
     */
    public setLocalidadFabricanteInhabilitar(localidadFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            localidadFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el domicilio código postal.
     * 
     * @param codigoPostalFabricante Nuevo valor del domicilio código postal.
     */
    public setCodigoPostalFabricante(codigoPostalFabricante: string): void {
        this.update((state) => ({
            ...state,
            codigoPostalFabricante,
        }));
    }

    /**
     * Actualiza el domicilio código postal inhabilitar.
     * 
     * @param codigoPostalFabricanteInhabilitar Nuevo valor del domicilio código postal inhabilitar.
     */
    public setCodigoPostalInhabilitar(codigoPostalFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            codigoPostalFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el ccolonia.
     * 
     * @param coloniaFabricante Nuevo valor del colonia.
     */
    public setColoniaFabricante(coloniaFabricante: string): void {
        this.update((state) => ({
            ...state,
            coloniaFabricante,
        }));
    }

    /**
     * Actualiza el ccolonia inhabilitar.
     * 
     * @param coloniaFabricanteInhabilitar Nuevo valor del colonia inhabilitar.
     */
    public setColoniaFabricanteInhabilitar(coloniaFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            coloniaFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el domicilio calle.
     * 
     * @param domicilioCalle Nuevo valor del domicilio calle.
     */
    public setCalleFabricante(domicilioCalle: string): void {
        this.update((state) => ({
            ...state,
            domicilioCalle,
        }));
    }

    /**
     * Actualiza el domicilio calle inhabilitar.
     * 
     * @param calleFabricanteInhabilitar Nuevo valor del domicilio calle inhabilitar.
     */
    public setCalleFabricanteInhabilitar(calleFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            calleFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el número exterior.
     * 
     * @param numeroExteriorFabricante Nuevo valor del número exterior.
     */
    public setNumeroExteriorFabricante(numeroExteriorFabricante: string): void {
        this.update((state) => ({
            ...state,
            numeroExteriorFabricante,
        }));
    }

    /**
     * Actualiza el número exterior inhabilitar.
     * 
     * @param numeroExteriorFabricanteInhabilitar Nuevo valor del número exterior inhabilitar.
     */
    public setNumeroExteriorFabricanteInhabilitar(numeroExteriorFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            numeroExteriorFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el número interior.
     * 
     * @param numeroInteriorFabricante Nuevo valor del número interior.
     */
    public setNumeroInteriorFabricante(numeroInteriorFabricante: string): void {
        this.update((state) => ({
            ...state,
            numeroInteriorFabricante,
        }));
    }

    /**
     * Actualiza el número interior inhabilitar.
     * 
     * @param numeroInteriorFabricanteInhabilitar Nuevo valor del número interior inhabilitar.
     */
    public setNumeroInteriorFabricanteInhabilitar(numeroInteriorFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            numeroInteriorFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el domicilio lada.
     * 
     * @param ladaFabricante Nuevo valor del domicilio lada.
     */
    public setLadaFabricante(ladaFabricante: string): void {
        this.update((state) => ({
            ...state,
            ladaFabricante,
        }));
    }

    /**
     * Actualiza el domicilio lada inhabilitar.
     * 
     * @param ladaFabricanteInhabilitar Nuevo valor del domicilio lada inhabilitar.
     */
    public setLadaFabricanteInhabilitar(ladaFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            ladaFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el domicilio teléfono.
     * 
     * @param telefonoFabricante Nuevo valor del domicilio teléfono.
     */
    public setTelefonoFabricante(telefonoFabricante: string): void {
        this.update((state) => ({
            ...state,
            telefonoFabricante,
        }));
    }

    /**
     * Actualiza el domicilio teléfono inhabilitar.
     * 
     * @param telefonoFabricanteInhabilitar Nuevo valor del domicilio teléfono inhabilitar.
     */
    public setTelefonoFabricanteInhabilitar(telefonoFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            telefonoFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el domicilio correo electrónico.
     * 
     * @param correoElectronicoFabricante Nuevo valor del domicilio correo electrónico.
     */
    public setCorreoElectronicoFabricante(correoElectronicoFabricante: string): void {
        this.update((state) => ({
            ...state,
            correoElectronicoFabricante,
        }));
    }

    /**
     * Actualiza el domicilio correo electrónico inhabilitar.
     * 
     * @param correoElectronicoFabricanteInhabilitar Nuevo valor del domicilio correo electrónico inhabilitar.
     */
    public setCorreoElectronicoFabricanteInhabilitar(correoElectronicoFabricanteInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            correoElectronicoFabricanteInhabilitar,
        }));
    }

    /**
     * Actualiza el mostrar rfc fabricante buscar boton.
     * 
     * @param mostrarRfcFabricanteBuscarBoton Nuevo valor del mostrar rfc fabricante buscar boton.
     */
    public setMostrarRfcFabricanteBuscarBoton(mostrarRfcFabricanteBuscarBoton: boolean): void {
        this.update((state) => ({
            ...state,
            mostrarRfcFabricanteBuscarBoton,
        }));
    }

    /**
     * Actualiza el mostrar curp fabricante buscar boton.
     * 
     * @param mostrarCurpFabricanteBuscarBoton Nuevo valor del mostrar curp fabricante buscar boton.
     */
    public setMostrarCurpFabricanteBuscarBoton(mostrarCurpFabricanteBuscarBoton: boolean): void {
        this.update((state) => ({
            ...state,
            mostrarCurpFabricanteBuscarBoton,
        }));
    }

    /**
     * Actualiza el país fabricante inhabilitar.
     * 
     * @param inhabilitarPaisFabricante Nuevo valor del país fabricante inhabilitar.
     */
    public setInhabilitarPaisFabricante(inhabilitarPaisFabricante: boolean): void {
        this.update((state) => ({
            ...state,
            inhabilitarPaisFabricante,
        }));
    }

    /**
     * Actualiza el terceros nacionalidad.
     * 
     * @param tercerosNacionalidad Nuevo valor del terceros nacionalidad.
     */
    public setTercerosNacionalidad(tercerosNacionalidad: string | number): void {
        this.update((state) => ({
            ...state,
            tercerosNacionalidad,
        }));
    }

    /**
     * Actualiza el tipo persona.
     * 
     * @param tipoPersona Nuevo valor del tipo persona.
     */
    public setTipoPersona(tipoPersona: string | number): void {
        this.update((state) => ({
            ...state,
            tipoPersona,
        }));
    }

    /**
     * Actualiza el rfc proveedor.
     * 
     * @param rfcProveedor Nuevo valor del rfc proveedor.
     */
    public setRfcProveedor(rfcProveedor: string): void {
        this.update((state) => ({
            ...state,
            rfcProveedor,
        }));
    }

    /**
     * Actualiza el rfc proveedor inhabilitar.
     * 
     * @param rfcProveedorInhabilitar Nuevo valor del rfc proveedor inhabilitar.
     */
    public setRfcProveedorInhabilitar(rfcProveedorInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            rfcProveedorInhabilitar,
        }));
    }

    /**
     * Actualiza el curp inhabilitar.
     * 
     * @param curpInhabilitar Nuevo valor del curp inhabilitar.
     */
    public setCurpInhabilitar(curpInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            curpInhabilitar,
        }));
    }

    /**
     * Actualiza el curp.
     * 
     * @param curp Nuevo valor del curp.
     */
    public setCurp(curp: string): void {
        this.update((state) => ({
            ...state,
            curp,
        }));
    }

    /**
     * Actualiza el proveedor nombre.
     * 
     * @param proveedorNombre Nuevo valor del proveedor nombre.
     */
    public setProveedorNombre(proveedorNombre: string): void {
        this.update((state) => ({
            ...state,
            proveedorNombre,
        }));
    }

    /**
     * Actualiza el proveedor nombre inhabilitar.
     * 
     * @param proveedorNombreInhabilitar Nuevo valor del proveedor nombre inhabilitar.
     */
    public setProveedorNombreInhabilitar(proveedorNombreInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            proveedorNombreInhabilitar,
        }));
    }

    /**
     * Actualiza el proveedor primer apellido.
     * 
     * @param proveedorPrimerApellido Nuevo valor del proveedor primer apellido.
     */
    public setProveedorPrimerApellido(proveedorPrimerApellido: string): void {
        this.update((state) => ({
            ...state,
            proveedorPrimerApellido,
        }));
    }

    /**
     * Actualiza el proveedor primer apellido inhabilitar.
     * 
     * @param proveedorPrimerApellidoInhabilitar Nuevo valor del proveedor primer apellido inhabilitar.
     */
    public setProveedorPrimerApellidoInhabilitar(proveedorPrimerApellidoInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            proveedorPrimerApellidoInhabilitar,
        }));
    }

    /**
     * Actualiza el proveedor segundo apellido.
     * 
     * @param proveedorSegundoApellido Nuevo valor proveedor segundo apellido.
     */
    public setProveedorSegundoApellido(proveedorSegundoApellido: string): void {
        this.update((state) => ({
            ...state,
            proveedorSegundoApellido,
        }));
    }

    /**
     * Actualiza el proveedor segundo apellido inhabilitar.
     * 
     * @param proveedorSegundoApellidoInhabilitar Nuevo valor proveedor segundo apellido inhabilitar.
     */
    public setProveedorSegundoApellidoInhabilitar(proveedorSegundoApellidoInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            proveedorSegundoApellidoInhabilitar,
        }));
    }

    /**
     * Actualiza el proveedor razón social.
     * 
     * @param proveedorRazonSocial Nuevo valor del proveedor razón social.
     */
    public setProveedorRazonSocial(proveedorRazonSocial: string): void {
        this.update((state) => ({
            ...state,
            proveedorRazonSocial,
        }));
    }

    /**
     * Actualiza el proveedor razón social inhabilitar.
     * 
     * @param proveedorRazonSocialInhabilitar Nuevo valor del proveedor razón social inhabilitar.
     */
    public setProveedorRazonSocialInhabilitar(proveedorRazonSocialInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            proveedorRazonSocialInhabilitar,
        }));
    }

    /**
     * Actualiza el país.
     * 
     * @param cvePais Nuevo valor del país.
     */
    public setPais(cvePais: string): void {
        this.update((state) => ({
            ...state,
            cvePais,
        }));
    }

    /**
     * Actualiza el país inhabilitar.
     * 
     * @param cvePaisInhabilitar Nuevo valor del país inhabilitar.
     */
    public setPaisInhabilitar(cvePaisInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            cvePaisInhabilitar,
        }));
    }

    /**
     * Actualiza el domicilio estado.
     * 
     * @param domicilioEstado Nuevo valor del domicilio estado.
     */
    public setDomicilioEstado(domicilioEstado: string): void {
        this.update((state) => ({
            ...state,
            domicilioEstado,
        }));
    }

    /**
     * Actualiza el domicilio estado inhabilitar.
     * 
     * @param domicilioEstadoInhabilitar Nuevo valor del domicilio estado inhabilitar.
     */
    public setDomicilioEstadoInhabilitar(domicilioEstadoInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            domicilioEstadoInhabilitar,
        }));
    }

    /**
     * Actualiza el alcaldía.
     * 
     * @param alcaldia Nuevo valor del alcaldía.
     */
    public setAlcaldia(alcaldia: string): void {
        this.update((state) => ({
            ...state,
            alcaldia,
        }));
    }

    /**
     * Actualiza el alcaldía inhabilitar.
     * 
     * @param alcaldiaInhabilitar Nuevo valor del alcaldía inhabilitar.
     */
    public setAlcaldiaInhabilitar(alcaldiaInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            alcaldiaInhabilitar,
        }));
    }

    /**
     * Actualiza el localidad.
     * 
     * @param localidad Nuevo valor del localidad.
     */
    public setLocalidad(localidad: string): void {
        this.update((state) => ({
            ...state,
            localidad,
        }));
    }

    /**
     * Actualiza el localidad inhabilitar.
     * 
     * @param localidadInhabilitar Nuevo valor del localidad inhabilitar.
     */
    public setLocalidadInhabilitar(localidadInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            localidadInhabilitar,
        }));
    }

    /**
     * Actualiza el domicilio código postal.
     * 
     * @param domicilioCodigoPostal Nuevo valor del domicilio código postal.
     */
    public setDomicilioCodigoPostal(domicilioCodigoPostal: string): void {
        this.update((state) => ({
            ...state,
            domicilioCodigoPostal,
        }));
    }

    /**
     * Actualiza el domicilio código postal inhabilitar.
     * 
     * @param domicilioCodigoPostalInhabilitar Nuevo valor del domicilio código postal inhabilitar.
     */
    public setDomicilioCodigoPostalInhabilitar(domicilioCodigoPostalInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            domicilioCodigoPostalInhabilitar,
        }));
    }

    /**
     * Actualiza el ccolonia.
     * 
     * @param colonia Nuevo valor del colonia.
     */
    public setColonia(colonia: string): void {
        this.update((state) => ({
            ...state,
            colonia,
        }));
    }

    /**
     * Actualiza el ccolonia inhabilitar.
     * 
     * @param coloniaInhabilitar Nuevo valor del colonia inhabilitar.
     */
    public setColoniaInhabilitar(coloniaInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            coloniaInhabilitar,
        }));
    }

    /**
     * Actualiza el domicilio calle.
     * 
     * @param domicilioCalle Nuevo valor del domicilio calle.
     */
    public setDomicilioCalle(domicilioCalle: string): void {
        this.update((state) => ({
            ...state,
            domicilioCalle,
        }));
    }

    /**
     * Actualiza el domicilio calle inhabilitar.
     * 
     * @param domicilioCalleInhabilitar Nuevo valor del domicilio calle inhabilitar.
     */
    public setDomicilioCalleInhabilitar(domicilioCalleInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            domicilioCalleInhabilitar,
        }));
    }

    /**
     * Actualiza el número exterior.
     * 
     * @param numeroExterior Nuevo valor del número exterior.
     */
    public setNumeroExterior(numeroExterior: string): void {
        this.update((state) => ({
            ...state,
            numeroExterior,
        }));
    }

    /**
     * Actualiza el número exterior inhabilitar.
     * 
     * @param numeroExteriorInhabilitar Nuevo valor del número exterior inhabilitar.
     */
    public setNumeroExteriorInhabilitar(numeroExteriorInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            numeroExteriorInhabilitar,
        }));
    }

    /**
     * Actualiza el número interior.
     * 
     * @param numeroInterior Nuevo valor del número interior.
     */
    public setNumeroInterior(numeroInterior: string): void {
        this.update((state) => ({
            ...state,
            numeroInterior,
        }));
    }

    /**
     * Actualiza el número interior inhabilitar.
     * 
     * @param numeroInteriorInhabilitar Nuevo valor del número interior inhabilitar.
     */
    public setNumeroInteriorInhabilitar(numeroInteriorInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            numeroInteriorInhabilitar,
        }));
    }

    /**
     * Actualiza el domicilio lada.
     * 
     * @param domicilioLada Nuevo valor del domicilio lada.
     */
    public setDomicilioLada(domicilioLada: string): void {
        this.update((state) => ({
            ...state,
            domicilioLada,
        }));
    }

    /**
     * Actualiza el domicilio lada inhabilitar.
     * 
     * @param domicilioLadaInhabilitar Nuevo valor del domicilio lada inhabilitar.
     */
    public setDomicilioLadaInhabilitar(domicilioLadaInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            domicilioLadaInhabilitar,
        }));
    }

    /**
     * Actualiza el domicilio teléfono.
     * 
     * @param domicilioTelefono Nuevo valor del domicilio teléfono.
     */
    public setDomicilioTelefono(domicilioTelefono: string): void {
        this.update((state) => ({
            ...state,
            domicilioTelefono,
        }));
    }

    /**
     * Actualiza el domicilio teléfono inhabilitar.
     * 
     * @param domicilioTelefonoInhabilitar Nuevo valor del domicilio teléfono inhabilitar.
     */
    public setDomicilioTelefonoInhabilitar(domicilioTelefonoInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            domicilioTelefonoInhabilitar,
        }));
    }

    /**
     * Actualiza el domicilio correo electrónico.
     * 
     * @param domicilioCorreoElectronico Nuevo valor del domicilio correo electrónico.
     */
    public setDomicilioCorreoElectronico(domicilioCorreoElectronico: string): void {
        this.update((state) => ({
            ...state,
            domicilioCorreoElectronico,
        }));
    }

    /**
     * Actualiza el domicilio correo electrónico inhabilitar.
     * 
     * @param domicilioCorreoElectronicoInhabilitar Nuevo valor del domicilio correo electrónico inhabilitar.
     */
    public setDomicilioCorreoElectronicoInhabilitar(domicilioCorreoElectronicoInhabilitar: boolean): void {
        this.update((state) => ({
            ...state,
            domicilioCorreoElectronicoInhabilitar,
        }));
    }

    /**
     * Actualiza el mostrar rfc buscar boton.
     * 
     * @param mostrarRfcBuscarBoton Nuevo valor del mostrar rfc buscar boton.
     */
    public setMostrarRfcBuscarBoton(mostrarRfcBuscarBoton: boolean): void {
        this.update((state) => ({
            ...state,
            mostrarRfcBuscarBoton,
        }));
    }

    /**
     * Actualiza el mostrar curp buscar boton.
     * 
     * @param mostrarCurpBuscarBoton Nuevo valor del mostrar curp buscar boton.
     */
    public setMostrarCurpBuscarBoton(mostrarCurpBuscarBoton: boolean): void {
        this.update((state) => ({
            ...state,
            mostrarCurpBuscarBoton,
        }));
    }

    /**
     * Actualiza el inhabilitar país.
     * 
     * @param inhabilitarPais Nuevo valor del inhabilitar país.
     */
    public setInhabilitarPais(inhabilitarPais: boolean): void {
        this.update((state) => ({
            ...state,
            inhabilitarPais,
        }));
    }

        /**
     * @method updateProveedorTablaDatos
     * @description
     * Agrega nuevos proveedores al arreglo `proveedorTablaDatos` en el estado.
     * Los proveedores recibidos se concatenan al arreglo existente.
     * @param {Proveedor[]} newProveedores - Arreglo de proveedores a agregar.
     * @returns {void}
     */
    public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
        this.update((state) => ({
            ...state,
            proveedorTablaDatos: newProveedores,
        }));
    }

    /**
     * Actualiza la tabla de datos de SCIAN.
     * @param scianBodyData Nuevo valor de la tabla de datos de SCIAN.
     * @returns void
     * @memberof ProductoStore
     * */
     
    public setScianTabla(scianBodyData: ScianTable[]): void {
        this.update((state) => ({
            ...state,
            scianBodyData,
        }));
    }

    /**
     * @method updateFabricanteTablaDatos
     * @description
     * Agrega nuevos fabricantes al arreglo `fabricanteTablaDatos` en el estado.
     * Los fabricantes recibidos se concatenan al arreglo existente.
     * @param {Fabricante[]} newFabricantes - Arreglo de fabricantes a agregar.
     * @returns {void}
     */
    public updateFabricanteTablaDatos(newFabricantes: Fabricante[]): void {
        this.update((state) => ({
            ...state,
            fabricanteTablaDatos: newFabricantes,
        }));
    }

    /**
     * @method updateTabSeleccionado
     * @description
     * Actualiza el índice de la pestaña actualmente seleccionada en el estado.
     * Permite controlar la navegación y el estado de la interfaz de usuario.
     * @param {number} tabSeleccionado - Índice de la pestaña a seleccionar.
     * @returns {void}
     */
    public updateTabSeleccionado(tabSeleccionado: number): void {
        this.update((state) => ({
            ...state,
            tabSeleccionado: tabSeleccionado,
        }));
    }

    /**
     * Actualiza la tabla de datos de productos.
     * @param productoBodyData Nuevo valor de la tabla de datos de productos.
     * @returns void
     * @memberof ProductoStore
     * */
    public setProductoTabla(productoBodyData: ProductoTable[]): void {
        this.update((state) => ({
            ...state,
             productoBodyData,
        }));
    }
    /**
     * @method setSolicitudTabla
     * @description
     * Actualiza los datos de la tabla de solicitudes en el estado.
     * @param {SolicitudTable[]} solicitudBodyData - Nuevo arreglo de datos de solicitudes.
     * @returns {void}
     */
    public setSolicitudTabla(solicitudBodyData: SolicitudTable[]): void {
        this.update((state) => ({
            ...state,
            solicitudBodyData,
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
   * @method proveedorTablaModificaDatos
   * @description
   * Actualiza los datos seleccionados en la tabla de proveedores dentro del estado del trámite.
   * Sobrescribe la lista previa con los proveedores seleccionados.
   *
   * @param {Proveedor[]} tabSeleccionado - Lista de proveedores seleccionados que se asignarán al estado.
   * @returns {void} Este método no retorna ningún valor.
   */
  public proveedorTablaModificaDatos(tabSeleccionado: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaModificaDatos: tabSeleccionado,
    }));
  }

  setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  public updateDatosSolicitudFormState(datosSolicitudFormState: DatosSolicitudFormState): void {
    this.update((state) => ({
      ...state,
      datosSolicitudFormState,
    }));
  }

  public updateOpcionConfigDatos(opcionConfigDatos: TablaOpcionConfig[]): void {
    this.update((state) => ({
      ...state,
      opcionConfigDatos,
    }));
  }

  public updateScianConfigDatos(scianConfigDatos: TablaScianConfig[]): void {
    this.update((state) => ({
      ...state,
      scianConfigDatos,
    }));
  }

  public updateTablaMercanciasConfigDatos(tablaMercanciasConfigDatos: TablaMercanciasDatos[]): void {
    this.update((state) => ({
      ...state,
      tablaMercanciasConfigDatos,
    }));
  }
}