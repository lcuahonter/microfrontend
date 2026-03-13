import { Store, StoreConfig } from '@datorama/akita';
import { DiscripccionDeLaMercanciaForm } from '../models/transportacion-maritima.model';
import { Injectable } from '@angular/core';

/**
 * Modelo de estado para el trámite 11101.
 */
export interface Tramitenacionales11101State {
    numeroderegistro: string;
    NobmreDenominationRazonSocial: string;
    rfctaxid: string;
    Telefono: string;
    correoelectronico: string;
    entidadadfederativa: string;
    alcadilamunicipio: string;
    colonia: string;
    codigopostal: string;
    calle: string;
    numeroletraexterior: string;
    numeroletrainterior: string;
    entrecalle: string;
    ycalle: string;
    radioDomicilio: string;
    estado: string;
    cantidad: string;
    formaParteDePatrimonio: string;
    descripcion: string;
    valor: string;
    unidadmedida: string;
    fraccionarancelaria: string;
    nico: string;
    marca: string;
    modelo: string;
    numerodeserie: string;
    fin: string;
    moneda: string;
    especifique: string;
    consecutivo: string;

    /**
     * Lista que indica el estado de cada sección del formulario (true si está activa, false si no).
     */
    seccion: boolean[];

    /**
     * Lista que indica si cada sección del formulario es válida (true si es válida, false si no).
     */
    formaValida: boolean[];


    /**
     * Número de seguro social de la persona física extranjera.
     * @type {string}
     */
    seguroNumero?: string;

    /**
     * Nombre de la persona física extranjera.
     * @type {string}
     */
    nombrePFE?: string;

    /**
     * Apellido paterno de la persona física extranjera.
     * @type {string}
     */
    apellidoPaternoPFE?: string;

    /**
     * Apellido materno de la persona física extranjera.
     * @type {string}
     */
    apellidoMaternoPFE?: string;

    /**
     * Correo electrónico de la persona física extranjera.
     * @type {string}
     */
    correoPFE?: string;

    /**
     * País de la persona física extranjera.
     * @type {string}
     */
    paisPFE?: string;

    /**
     * Código postal de la persona física extranjera.
     * @type {string}
     */
    codigoPostalPFE?: string;

    /**
     * Ciudad de la persona física extranjera.
     * @type {string}
     */
    ciudadPFE?: string;

    /**
     * Estado de la persona física extranjera.
     * @type {string}
     */
    estadoPFE?: string;

    /**
     * Calle de la persona física extranjera.
     * @type {string}
     */
    callePFE?: string;

    /**
     * Número exterior de la persona física extranjera.
     * @type {string}
     */
    numeroExteriorPFE?: string;

    /**
     * Número interior de la persona física extranjera.
     * @type {string}
     */
    numeroInteriorPFE?: string;

    /**
     * Tabla de descripción de la mercancía.
     * @type {discripccionDeLaMercanciaForm[]}
     */
    discripccionDeLaMercanciaTabla?: DiscripccionDeLaMercanciaForm[];

    /**
     * Tabla de personas morales extranjeras.
     * @type {discripccionDeLaMercanciaForm[]}
     */
    discripccionDeLaMercanciaForm?: DiscripccionDeLaMercanciaForm[];
    /**
* Denominación de la persona moral extranjera.
* @type {string}
*/
    denominacionPME?: string;

    /**
     * Correo electrónico de la persona moral extranjera.
     * @type {string}
     */
    correoPME?: string;

    /**
     * País de la persona moral extranjera.
     * @type {number | string}
     */
    paisPME?: number | string;

    /**
     * Código postal de la persona moral extranjera.
     * @type {string}
     */
    codigoPostalPME?: string;

    /**
     * Ciudad de la persona moral extranjera.
     * @type {string}
     */
    ciudadPME?: string;

    /**
     * Estado de la persona moral extranjera.
     * @type {string}
     */
    estadoPME?: string;

    /**
     * Calle de la persona moral extranjera.
     * @type {string}
     */
    callePME?: string;

    /**
     * Número exterior de la persona moral extranjera.
     * @type {string}
     */
    numeroExteriorPME?: string;

    /**
     * Número interior de la persona moral extranjera.
     * @type {string}
     */
    numeroInteriorPME?: string;

    /**
     * Nombre del director general de la persona moral extranjera.
     * @type {string}
     */
    nombreDG?: string;

    /**
     * Apellido paterno del director general de la persona moral extranjera.
     * @type {string}
     */
    apellidoPaternoDG?: string;

    /**
     * Apellido materno del director general de la persona moral extranjera.
     * @type {string}
     */
    apellidoMaternoDG?: string;

}

/**
 * Función para crear el estado inicial del trámite 40402.
 * @returns El estado inicial del trámite.
 */
export function createTramiteState(): Tramitenacionales11101State {
    return {
        seccion: [],
        formaValida: [],
        seguroNumero: '',
        nombrePFE: '',
        apellidoPaternoPFE: '',
        apellidoMaternoPFE: '',
        correoPFE: '',
        paisPFE: '',
        codigoPostalPFE: '',
        ciudadPFE: '',
        estadoPFE: '',
        callePFE: '',
        numeroExteriorPFE: '',
        numeroInteriorPFE: '',

        discripccionDeLaMercanciaTabla: [],

        denominacionPME: '',
        correoPME: '',
        paisPME: '',
        codigoPostalPME: '',
        ciudadPME: '',
        estadoPME: '',
        callePME: '',
        numeroExteriorPME: '',
        numeroInteriorPME: '',
        nombreDG: '',
        apellidoPaternoDG: '',
        apellidoMaternoDG: '',
        numeroderegistro: '',
        NobmreDenominationRazonSocial: '',
        rfctaxid: '',
        Telefono: '',
        correoelectronico: '',
        entidadadfederativa: '',
        alcadilamunicipio: '',
        colonia: '',
        codigopostal: '',
        calle: '',
        numeroletraexterior: '',
        numeroletrainterior: '',
        entrecalle: '',
        ycalle: '',
        radioDomicilio: '',
        estado: '',
        cantidad: '',
        formaParteDePatrimonio: '',
        descripcion: '',
        valor: '',
        unidadmedida: '',
        fraccionarancelaria: '',
        nico: '',
        marca: '',
        modelo: '',
        numerodeserie: '',
        fin: '',
        moneda: '',
        especifique: '',
        consecutivo: '',
    };
}

/**
 * Almacén de estado para gestionar los datos relacionados con el trámite 40402.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite11101', resettable: true })
export class Tramite11101Store extends Store<Tramitenacionales11101State> {
    /**
     * Constructor del almacén.
     * Inicializa el estado con los valores predeterminados.
     */
    constructor() {
        super(createTramiteState());
    }

    /**
    * Establece el número de registro.
    * @param numeroderegistro - Número de registro a asignar al estado.
    */
    public setNumeroderegistro(numeroderegistro: string): void {
        this.update((state) => ({
            ...state,
            numeroderegistro,
        }));
    }

    /**
     * Establece el nombre, denominación o razón social.
     * @param NobmreDenominationRazonSocial - Nombre, denominación o razón social a asignar al estado.
     */
    public setNobmreDenominationRazonSocial(NobmreDenominationRazonSocial: string): void {
        this.update((state) => ({
            ...state,
            NobmreDenominationRazonSocial,
        }));
    }

    /**
     * Establece el RFC o Tax ID.
     * @param rfctaxid - RFC o identificación fiscal a asignar al estado.
     */
    public setRfctaxid(rfctaxid: string): void {
        this.update((state) => ({
            ...state,
            rfctaxid,
        }));
    }

    /**
     * Establece el número de teléfono.
     * @param Telefono - Teléfono a asignar al estado.
     */
    public setTelefono(Telefono: string): void {
        this.update((state) => ({
            ...state,
            Telefono,
        }));
    }

    /**
     * Establece el correo electrónico.
     * @param correoelectronico - Correo electrónico a asignar al estado.
     */
    public setCorreoelectronico(correoelectronico: string): void {
        this.update((state) => ({
            ...state,
            correoelectronico,
        }));
    }

    /**
     * Establece la entidad federativa.
     * @param entidadadfederativa - Entidad federativa a asignar al estado.
     */
    public setEntidadadfederativa(entidadadfederativa: string): void {
        this.update((state) => ({
            ...state,
            entidadadfederativa,
        }));
    }

    /**
     * Establece la alcaldía o municipio.
     * @param alcadilamunicipio - Alcaldía o municipio a asignar al estado.
     */
    public setAlcadilamunicipio(alcadilamunicipio: string): void {
        this.update((state) => ({
            ...state,
            alcadilamunicipio,
        }));
    }

    /**
     * Establece la colonia.
     * @param colonia - Colonia a asignar al estado.
     */
    public setColonia(colonia: string): void {
        this.update((state) => ({
            ...state,
            colonia,
        }));
    }

    /**
     * Establece el código postal.
     * @param codigopostal - Código postal a asignar al estado.
     */
    public setCodigopostal(codigopostal: string): void {
        this.update((state) => ({
            ...state,
            codigopostal,
        }));
    }

    /**
     * Establece la calle.
     * @param calle - Calle a asignar al estado.
     */
    public setCalle(calle: string): void {
        this.update((state) => ({
            ...state,
            calle,
        }));
    }

    /**
     * Establece el número o letra exterior.
     * @param numeroletraexterior - Número o letra exterior a asignar al estado.
     */
    public setNumeroletraexterior(numeroletraexterior: string): void {
        this.update((state) => ({
            ...state,
            numeroletraexterior,
        }));
    }

    /**
     * Establece el número o letra interior.
     * @param numeroletrainterior - Número o letra interior a asignar al estado.
     */
    public setNumeroletrainterior(numeroletrainterior: string): void {
        this.update((state) => ({
            ...state,
            numeroletrainterior,
        }));
    }

    /**
     * Establece la calle entre la cual se encuentra.
     * @param entrecalle - Calle entre la cual se encuentra el domicilio.
     */
    public setEntrecalle(entrecalle: string): void {
        this.update((state) => ({
            ...state,
            entrecalle,
        }));
    }

    /**
     * Establece la calle adicional (y calle).
     * @param ycalle - Otra calle cercana al domicilio.
     */
    public setYcalle(ycalle: string): void {
        this.update((state) => ({
            ...state,
            ycalle,
        }));
    }

    /**
     * Actualiza el estado de las secciones del formulario.
     * @param seccion - Lista que indica el estado de cada sección (true si está activa, false si no).
     */
    public establecerSeccion(seccion: boolean[]): void {
        this.update((state) => ({
            ...state,
            seccion,
        }));
    }

    /**
     * Actualiza el estado de validación de las secciones del formulario.
     * @param formaValida - Lista que indica si cada sección del formulario es válida (true si es válida, false si no).
     */
    public establecerFormaValida(formaValida: boolean[]): void {
        this.update((state) => ({
            ...state,
            formaValida,
        }));
    }


    /**
     * Establece el número de seguro social de la persona física extranjera en el estado.
     * @param seguroNumero - Número de seguro social de la persona física extranjera.
     * @description Establece el número de seguro social de la persona física extranjera en el estado.
     */
    public setSeguroNumero(seguroNumero: string): void {
        this.update((state) => ({
            ...state,
            seguroNumero,
        }));
    }

    /**
     * Establece el nombre de la persona física extranjera en el estado.
     * @param nombrePFE - Nombre de la persona física extranjera.
     * @description Establece el nombre de la persona física extranjera en el estado.
     */
    public setNombrePFE(nombrePFE: string): void {
        this.update((state) => ({
            ...state,
            nombrePFE,
        }));
    }

    /**
     * Establece el apellido paterno de la persona física extranjera en el estado.
     * @param apellidoPaternoPFE - Apellido paterno de la persona física extranjera.
     * @description Establece el apellido paterno de la persona física extranjera en el estado.
     */
    public setApellidoPaternoPFE(apellidoPaternoPFE: string): void {
        this.update((state) => ({
            ...state,
            apellidoPaternoPFE,
        }));
    }

    /**
     * Establece el apellido materno de la persona física extranjera en el estado.
     * @param apellidoMaternoPFE - Apellido materno de la persona física extranjera.
     * @description Establece el apellido materno de la persona física extranjera en el estado.
     */
    public setApellidoMaternoPFE(apellidoMaternoPFE: string): void {
        this.update((state) => ({
            ...state,
            apellidoMaternoPFE,
        }));
    }

    /**
     * Establece el correo electrónico de la persona física extranjera en el estado.
     * @param correoPFE - Correo electrónico de la persona física extranjera.
     * @description Establece el correo electrónico de la persona física extranjera en el estado.
     */
    public setCorreoPFE(correoPFE: string): void {
        this.update((state) => ({
            ...state,
            correoPFE,
        }));
    }

    /**
     * Establece el país de la persona física extranjera en el estado.
     * @param paisPFE - País de la persona física extranjera.
     * @description Establece el país de la persona física extranjera en el estado.
     */
    public setPaisPFE(paisPFE: string): void {
        this.update((state) => ({
            ...state,
            paisPFE,
        }));
    }

    /**
     * Establece el código postal de la persona física extranjera en el estado.
     * @param codigoPostalPFE - Código postal de la persona física extranjera.
     * @description Establece el código postal de la persona física extranjera en el estado.
     */
    public setCodigoPostalPFE(codigoPostalPFE: string): void {
        this.update((state) => ({
            ...state,
            codigoPostalPFE,
        }));
    }

    /**
     * Establece la ciudad de la persona física extranjera en el estado.
     * @param ciudadPFE - Ciudad de la persona física extranjera.
     * @description Establece la ciudad de la persona física extranjera en el estado.
     */
    public setCiudadPFE(ciudadPFE: string): void {
        this.update((state) => ({
            ...state,
            ciudadPFE,
        }));
    }

    /**
     * Establece el estado de la persona física extranjera en el estado.
     * @param estadoPFE - Estado de la persona física extranjera.
     * @description Establece el estado de la persona física extranjera en el estado.
     */
    public setEstadoPFE(estadoPFE: string): void {
        this.update((state) => ({
            ...state,
            estadoPFE,
        }));
    }

    /**
     * Establece la calle de la persona física extranjera en el estado.
     * @param callePFE - Calle de la persona física extranjera.
     * @description Establece la calle de la persona física extranjera en el estado.
     */
    public setCallePFE(callePFE: string): void {
        this.update((state) => ({
            ...state,
            callePFE,
        }));
    }

    /**
     * Establece el número exterior de la persona física extranjera en el estado.
     * @param numeroExteriorPFE - Número exterior de la persona física extranjera.
     * @description Establece el número exterior de la persona física extranjera en el estado.
     */
    public setNumeroExteriorPFE(numeroExteriorPFE: string): void {
        this.update((state) => ({
            ...state,
            numeroExteriorPFE,
        }));
    }

    /**
     * Establece el número interior de la persona física extranjera en el estado.
     * @param numeroInteriorPFE - Número interior de la persona física extranjera.
     * @description Establece el número interior de la persona física extranjera en el estado.
     */
    public setNumeroInteriorPFE(numeroInteriorPFE: string): void {
        this.update((state) => ({
            ...state,
            numeroInteriorPFE,
        }));
    }

    /**
     * Establece la tabla de persona física extranjera en el estado.
     * @param personaFisicaExtranjeraTabla - Tabla de persona física extranjera.
     * @description Establece la tabla de persona física extranjera en el estado.
     */
    public setPersonaFisicaExtranjeraTabla(DiscripccionDeLaMercanciaTabla: DiscripccionDeLaMercanciaForm[]): void {
        this.update((state) => ({
            ...state,
            DiscripccionDeLaMercanciaTabla,
        }));
    }

    /**
     * Establece la tabla de persona moral extranjera en el estado.
     * @param personaMoralExtranjeraTabla - Tabla de persona moral extranjera.
     * @description Establece la tabla de persona moral extranjera en el estado.
     */
    public setPersonaMoralExtranjeraTabla(DiscripccionDeLaMercanciaTabla: DiscripccionDeLaMercanciaForm[]): void {
        this.update((state) => ({
            ...state,
            DiscripccionDeLaMercanciaTabla,
        }));
    }

    /**
     * Establece la denominación de la persona moral extranjera en el estado.
     * @param denominacionPME - Denominación de la persona moral extranjera.
     * @description Establece la denominación de la persona moral extranjera en el estado.
     */
    public setDenominacionPME(denominacionPME: string): void {
        this.update((state) => ({
            ...state,
            denominacionPME,
        }));
    }

    /**
     * Establece el correo electrónico de la persona moral extranjera en el estado.
     * @param correoPME - Correo electrónico de la persona moral extranjera.
     * @description Establece el correo electrónico de la persona moral extranjera en el estado.
     */
    public setCorreoPME(correoPME: string): void {
        this.update((state) => ({
            ...state,
            correoPME,
        }));
    }

    /**
     * Establece el país de la persona moral extranjera en el estado.
     * @param paisPME - País de la persona moral extranjera.
     * @description Establece el país de la persona moral extranjera en el estado.
     */
    public setPaisPME(paisPME: number | string): void {
        this.update((state) => ({
            ...state,
            paisPME,
        }));
    }

    /**
     * Establece el código postal de la persona moral extranjera en el estado.
     * @param codigoPostalPME - Código postal de la persona moral extranjera.
     * @description Establece el código postal de la persona moral extranjera en el estado.
     */
    public setCodigoPostalPME(codigoPostalPME: string): void {
        this.update((state) => ({
            ...state,
            codigoPostalPME,
        }));
    }

    /**
     * Establece la ciudad de la persona moral extranjera en el estado.
     * @param ciudadPME - Ciudad de la persona moral extranjera.
     * @description Establece la ciudad de la persona moral extranjera en el estado.
     */
    public setCiudadPME(ciudadPME: string): void {
        this.update((state) => ({
            ...state,
            ciudadPME,
        }));
    }

    /**
     * Establece el estado de la persona moral extranjera en el estado.
     * @param estadoPME - Estado de la persona moral extranjera.
     * @description Establece el estado de la persona moral extranjera en el estado.
     */
    public setEstadoPME(estadoPME: string): void {
        this.update((state) => ({
            ...state,
            estadoPME,
        }));
    }

    /**
     * Establece la calle de la persona moral extranjera en el estado.
     * @param callePME - Calle de la persona moral extranjera.
     * @description Establece la calle de la persona moral extranjera en el estado.
     */
    public setCallePME(callePME: string): void {
        this.update((state) => ({
            ...state,
            callePME,
        }));
    }

    /**
     * Establece el estado del radio de domicilio.
     * @param radioDomicilio - Estado del radio de domicilio (true si es manual, false si es carga masiva).
     * @description Establece el estado del radio de domicilio en el estado.
     */
    public setRadioDomicilio(radioDomicilio: string): void {
        this.update((state) => ({
            ...state,
            radioDomicilio,
        }));
    }

    /**
     * Establece el número exterior de la persona moral extranjera en el estado.
     * @param numeroExteriorPME - Número exterior de la persona moral extranjera.
     * @description Establece el número exterior de la persona moral extranjera en el estado.
     */
    public setNumeroExteriorPME(numeroExteriorPME: string): void {
        this.update((state) => ({
            ...state,
            numeroExteriorPME,
        }));
    }

    /**
     * Establece el número interior de la persona moral extranjera en el estado.
     * @param numeroInteriorPME - Número interior de la persona moral extranjera.
     * @description Establece el número interior de la persona moral extranjera en el estado.
     */
    public setNumeroInteriorPME(numeroInteriorPME: string): void {
        this.update((state) => ({
            ...state,
            numeroInteriorPME,
        }));
    }

    /**
     * Establece el nombre del director general de la persona moral extranjera en el estado.
     * @param nombreDG - Nombre del director general de la persona moral extranjera.
     * @description Establece el nombre del director general de la persona moral extranjera en el estado.
     */
    public setNombreDG(nombreDG: string): void {
        this.update((state) => ({
            ...state,
            nombreDG,
        }));
    }

    /**
     * Establece el apellido paterno del director general de la persona moral extranjera en el estado.
     * @param apellidoPaternoDG - Apellido paterno del director general de la persona moral extranjera.
     * @description Establece el apellido paterno del director general de la persona moral extranjera en el estado.
     */
    public setApellidoPaternoDG(apellidoPaternoDG: string): void {
        this.update((state) => ({
            ...state,
            apellidoPaternoDG,
        }));
    }

    /**
     * Establece el apellido materno del director general de la persona moral extranjera en el estado.
     * @param apellidoMaternoDG - Apellido materno del director general de la persona moral extranjera.
     * @description Establece el apellido materno del director general de la persona moral extranjera en el estado.
     */
    public setApellidoMaternoDG(apellidoMaternoDG: string): void {
        this.update((state) => ({
            ...state,
            apellidoMaternoDG,
        }));
    }

    /**
     * Establece el estado de la persona física.
     * @param estado - Estado de la persona física a asignar al estado.
     */
    public setEstado(estado: string): void {
        this.update((state) => ({
            ...state,
            estado,
        }));
    }

    /**
     * Establece la cantidad.
     * @param cantidad - Cantidad a asignar al estado.
     */
    public setCantidad(cantidad: string): void {
        this.update((state) => ({
            ...state,
            cantidad,
        }));
    }

    /**
     * Establece la forma en que parte del patrimonio.
     * @param formaParteDePatrimonio - Forma en que parte del patrimonio a asignar al estado.
     */
    public setFormaParteDePatrimonio(formaParteDePatrimonio: string): void {
        this.update((state) => ({
            ...state,
            formaParteDePatrimonio,
        }));
    }

    /**
     * Establece la descripción.
     * @param descripcion - Descripción a asignar al estado.
     */
    public setDescripcion(descripcion: string): void {
        this.update((state) => ({
            ...state,
            descripcion,
        }));
    }

    /**
     * Establece el valor.
     * @param valor - Valor a asignar al estado.
     */
    public setValor(valor: string): void {
        this.update((state) => ({
            ...state,
            valor,
        }));
    }

    /**
     * Establece la unidad de medida.
     * @param unidadmedida - Unidad de medida a asignar al estado.
     */
    public setUnidadmedida(unidadmedida: string): void {
        this.update((state) => ({
            ...state,
            unidadmedida,
        }));
    }

    /**
     * Establece la fracción arancelaria.
     * @param fraccionarancelaria - Fracción arancelaria a asignar al estado.
     */
    public setFraccionarancelaria(fraccionarancelaria: string): void {
        this.update((state) => ({
            ...state,
            fraccionarancelaria,
        }));
    }

    /**
     * Establece el NICO.
     * @param nico - NICO a asignar al estado.
     */
    public setNico(nico: string): void {
        this.update((state) => ({
            ...state,
            nico,
        }));
    }

    /**
     * Establece la marca.
     * @param marca - Marca a asignar al estado.
     */
    public setMarca(marca: string): void {
        this.update((state) => ({
            ...state,
            marca,
        }));
    }

    /**
     * Establece el modelo.
     * @param modelo - Modelo a asignar al estado.
     */
    public setModelo(modelo: string): void {
        this.update((state) => ({
            ...state,
            modelo,
        }));
    }

    /**
     * Establece el número de serie.
     * @param numerodeserie - Número de serie a asignar al estado.
     */
    public setNumerodeserie(numerodeserie: string): void {
        this.update((state) => ({
            ...state,
            numerodeserie,
        }));
    }

    /**
     * Establece el fin.
     * @param fin - Fin a asignar al estado.
     */
    public setFin(fin: string): void {
        this.update((state) => ({
            ...state,
            fin,
        }));
    }

    /**
     * Establece la moneda.
     * @param moneda - Moneda a asignar al estado.
     */
    public setMoneda(moneda: string): void {
        this.update((state) => ({
            ...state,
            moneda,
        }));
    }

    /**
     * Establece la especificación.
     * @param especifique - Especificación a asignar al estado.
     */
    public setEspecifique(especifique: string): void {
        this.update((state) => ({
            ...state,
            especifique,
        }));
    }

    /**
     * Establece el consecutivo.
     * @param consecutivo - Consecutivo a asignar al estado.
     */
    public setConsecutivo(consecutivo: string): void {
        this.update((state) => ({
            ...state,
            consecutivo,
        }));
    }

}