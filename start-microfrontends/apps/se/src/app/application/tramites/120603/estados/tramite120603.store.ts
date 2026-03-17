import { SeleccionDeSucursalData, SociosYAccionistasData, SociosYAccionistasExtranjerosData } from '../models/filaData.modal';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/** Interfaz de los datos de la solicitud */
export interface Solicitud120603State {
    id_solicitud?: number;
    estado: string;
    representacionFederal: string;
    tipoEmpresa: string;
    especifique: string;
    actividadEconomicaPreponderante: string;
    descripcion: string;
    codigoPostal: string;
    estadoDomicilio: string;
    municipioAlcaldia: string;
    localidad: string;
    colonia: string;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    lada: string;
    telefono: string;
    nacionalidad: string;
    tipoDePersona: string;
    taxId: string;
    razonSocial: string;
    datosPais: string;
    datosCodigoPostal: string;
    datosEstado: string;
    correoElectronico: string;
    registroFederal: string;
    nombre: string;
    apellidoPaterno: string;
    domicilioDisabledForm?: { [key: string]: unknown };
    sucursalDeData?: SeleccionDeSucursalData[];
    datosGenerales?: SociosYAccionistasData[];
    datosGeneralesExtranjeros?: SociosYAccionistasExtranjerosData[];
}


export function createInitialState(): Solicitud120603State {
    return {
        id_solicitud: 0,
        estado: 'POR_DEFECTO_STATE',
        representacionFederal: 'POR_DEFECTO_REPRESENTACION',
        tipoEmpresa: 'POR_DEFECTO_TIPO_EMPRESA',
        especifique: '',
        actividadEconomicaPreponderante: 'POR_DEFECTO_ACTIVIDAD',
        descripcion: '',
        codigoPostal: '',
        estadoDomicilio: '',
        municipioAlcaldia: '',
        localidad: '',
        colonia: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        lada: '',
        telefono: '',
        nacionalidad: '',
        tipoDePersona: 'POR_DEFECTO_PERSONA',
        taxId: '',
        razonSocial: '',
        datosPais: '',
        datosCodigoPostal: '',
        datosEstado: '',
        correoElectronico: '',
        registroFederal: '',
        nombre: '',
        apellidoPaterno: '',
        domicilioDisabledForm: {
            pais: '',
            cvepais: '',
            cveColonia: '',
            cveEntidad: '',
            codigoPostal: '',
            estadoDomicilio: '',
            municipioAlcaldia: '',
            localidad: '',
            colonia: '',
            calle: '',
            numeroExterior: '',
            numeroInterior: '',
            lada: '',
            telefono: '',
        },
        sucursalDeData: [],
    };
}
/**
* Injectable decorator to make the store available at the root level.
*/
@Injectable({
    providedIn: 'root',
})

@StoreConfig({ name: 'Solicitud120603State', resettable: true })

export class Solicitud120603Store extends Store<Solicitud120603State> {

    constructor() {
        super(createInitialState());
    }

    /**
    * Proporciona los datos de selección de sucursal en el estado.
    *
    * @param sucursalDeData - Los datos de selección de sucursal que se van a guardar.
    */
    public setSeleccionDeSucursalData(sucursalDeData: SeleccionDeSucursalData[]): void {
        this.update((state) => ({
            ...state,
            sucursalDeData,
        }));
    }
    /**
   * Proporciona el tipo de solicitud en el estado.
   *
   * @param estado - El estado que se va a guardar.
   */
    public setEstado(estado: string): void {
        this.update((state) => ({
            ...state,
            estado,
        }));
    }

    /**
     * Proporciona la representación federal en el estado.
     *
     * @param representacionFederal - La representación federal que se va a guardar.
     */
    public setRepresentacionFederal(representacionFederal: string): void {
        this.update((state) => ({
            ...state,
            representacionFederal,
        }));
    }

    /**
     * Proporciona el tipo de empresa en el estado.
     *
     * @param tipoEmpresa - El tipo de empresa que se va a guardar.
     */
    public setTipoEmpresa(tipoEmpresa: string): void {
        this.update((state) => ({
            ...state,
            tipoEmpresa,
        }));
    }

    /**
     * Proporciona la especificación adicional en el estado.
     *
     * @param especifique - La especificación que se va a guardar.
     */
    public setEspecifique(especifique: string): void {
        this.update((state) => ({
            ...state,
            especifique,
        }));
    }

    /**
     * Proporciona la actividad económica preponderante en el estado.
     *
     * @param actividadEconomicaPreponderante - La actividad económica que se va a guardar.
     */
    public setActividadEconomicaPreponderante(actividadEconomicaPreponderante: string): void {
        this.update((state) => ({
            ...state,
            actividadEconomicaPreponderante,
        }));
    }

    /**
     * Proporciona la descripción en el estado.
     *
     * @param descripcion - La descripción que se va a guardar.
     */
    public setDescripcion(descripcion: string): void {
        this.update((state) => ({
            ...state,
            descripcion,
        }));
    }

    /**
     * Proporciona el código postal en el estado.
     *
     * @param codigoPostal - El código postal que se va a guardar.
     */
    public setCodigoPostal(codigoPostal: string): void {
        this.update((state) => ({
            ...state,
            codigoPostal,
        }));
    }

    /**
     * Proporciona el estado del domicilio en el estado.
     *
     * @param estadoDomicilio - El estado del domicilio que se va a guardar.
     */
    public setEstadoDomicilio(estadoDomicilio: string): void {
        this.update((state) => ({
            ...state,
            estadoDomicilio,
        }));
    }

    /**
     * Proporciona el municipio o alcaldía en el estado.
     *
     * @param municipioAlcaldia - El municipio o alcaldía que se va a guardar.
     */
    public setMunicipioAlcaldia(municipioAlcaldia: string): void {
        this.update((state) => ({
            ...state,
            municipioAlcaldia,
        }));
    }

    /**
     * Proporciona la localidad en el estado.
     *
     * @param localidad - La localidad que se va a guardar.
     */
    public setLocalidad(localidad: string): void {
        this.update((state) => ({
            ...state,
            localidad,
        }));
    }

    /**
     * Proporciona la colonia en el estado.
     *
     * @param colonia - La colonia que se va a guardar.
     */
    public setColonia(colonia: string): void {
        this.update((state) => ({
            ...state,
            colonia,
        }));
    }

    /**
     * Proporciona la calle en el estado.
     *
     * @param calle - La calle que se va a guardar.
     */
    public setCalle(calle: string): void {
        this.update((state) => ({
            ...state,
            calle,
        }));
    }

    /**
     * Proporciona el número exterior en el estado.
     *
     * @param numeroExterior - El número exterior que se va a guardar.
     */
    public setNumeroExterior(numeroExterior: string): void {
        this.update((state) => ({
            ...state,
            numeroExterior,
        }));
    }

    /**
     * Proporciona el número interior en el estado.
     *
     * @param numeroInterior - El número interior que se va a guardar.
     */
    public setNumeroInterior(numeroInterior: string): void {
        this.update((state) => ({
            ...state,
            numeroInterior,
        }));
    }

    /**
     * Proporciona la lada telefónica en el estado.
     *
     * @param lada - La lada que se va a guardar.
     */
    public setLada(lada: string): void {
        this.update((state) => ({
            ...state,
            lada,
        }));
    }

    /**
     * Proporciona el teléfono en el estado.
     *
     * @param telefono - El teléfono que se va a guardar.
     */
    public setTelefono(telefono: string): void {
        this.update((state) => ({
            ...state,
            telefono,
        }));
    }

    /**
     * Proporciona la nacionalidad en el estado.
     *
     * @param nacionalidad - La nacionalidad que se va a guardar.
     */
    public setNacionalidad(nacionalidad: string): void {
        this.update((state) => ({
            ...state,
            nacionalidad,
        }));
    }

    /**
     * Proporciona el tipo de persona en el estado.
     *
     * @param tipoDePersona - El tipo de persona que se va a guardar.
     */
    public setTipoDePersona(tipoDePersona: string): void {
        this.update((state) => ({
            ...state,
            tipoDePersona,
        }));
    }

    /**
     * Proporciona el Tax ID en el estado.
     *
     * @param taxId - El Tax ID que se va a guardar.
     */
    public setTaxId(taxId: string): void {
        this.update((state) => ({
            ...state,
            taxId,
        }));
    }
    public setDomicilioDataToStore(event: { [key: string]: unknown }): void {
        this.update((state) => ({
            ...state,
            domicilioDisabledForm: event
        }));
    }

    /**
     * Proporciona la razón social en el estado.
     *
     * @param razonSocial - La razón social que se va a guardar.
     */
    public setRazonSocial(razonSocial: string): void {
        this.update((state) => ({
            ...state,
            razonSocial,
        }));
    }

    /**
     * Proporciona los datos del país en el estado.
     *
     * @param datosPais - Los datos del país que se van a guardar.
     */
    public setDatosPais(datosPais: string): void {
        this.update((state) => ({
            ...state,
            datosPais,
        }));
    }

    /**
     * Proporciona el código postal adicional en el estado.
     *
     * @param datosCodigoPostal - El código postal adicional que se va a guardar.
     */
    public setDatosCodigoPostal(datosCodigoPostal: string): void {
        this.update((state) => ({
            ...state,
            datosCodigoPostal,
        }));
    }

    /**
     * Proporciona el estado adicional en el estado.
     *
     * @param datosEstado - El estado adicional que se va a guardar.
     */
    public setDatosEstado(datosEstado: string): void {
        this.update((state) => ({
            ...state,
            datosEstado,
        }));
    }

    /**
     * Proporciona el correo electrónico en el estado.
     *
     * @param correoElectronico - El correo electrónico que se va a guardar.
     */
    public setCorreoElectronico(correoElectronico: string): void {
        this.update((state) => ({
            ...state,
            correoElectronico,
        }));
    }

    /**
     * Proporciona el registro federal en el estado.
     *
     * @param registroFederal - El registro federal que se va a guardar.
     */
    public setRegistroFederal(registroFederal: string): void {
        this.update((state) => ({
            ...state,
            registroFederal,
        }));
    }

    /**
     * Proporciona el nombre en el estado.
     *
     * @param nombre - El nombre que se va a guardar.
     */
    public setNombre(nombre: string): void {
        this.update((state) => ({
            ...state,
            nombre,
        }));
    }

    /**
     * Proporciona el apellido paterno en el estado.
     *
     * @param apellidoPaterno - El apellido paterno que se va a guardar.
     */
    public setApellidoPaterno(apellidoPaterno: string): void {
        this.update((state) => ({
            ...state,
            apellidoPaterno,
        }));
    }

    /**
     * Proporciona los datos de socios y accionistas nacionales en el estado.
     *
     * Si el id es 0, agrega un nuevo elemento con un id generado automáticamente.
     * Si el id es mayor a 0, actualiza el elemento existente con los nuevos datos.
     *
     * @param datosGenerales - Los datos de socios y accionistas nacionales a guardar.
     */
    public setSociosYAaccionistasData(datosGenerales: SociosYAccionistasData[]): void {
        this.update((STATE) => {
          const LISTAEXISTENTE = STATE.datosGenerales || [];
          const NUEVOARTICULO = { ...datosGenerales[0] };
    
          if (NUEVOARTICULO.id === 0) {
            // Agregar nuevo elemento con una identificación generada
            NUEVOARTICULO.id = (LISTAEXISTENTE.length || 0) + 1;
            const UPDATEDLIST = [...LISTAEXISTENTE, NUEVOARTICULO];
            return { ...STATE, datosGenerales: UPDATEDLIST };
          }
    
          // Actualizar el elemento existente cuando id > 0
          const UPDATEDLIST = LISTAEXISTENTE.map((ITEM) =>
            ITEM.id === NUEVOARTICULO.id ? { ...ITEM, ...NUEVOARTICULO } : ITEM
          );
          return { ...STATE, datosGenerales: UPDATEDLIST };
        });
      }

    /**
     * Proporciona los datos de socios y accionistas extranjeros en el estado.
     *
     * Si el id es 0, agrega un nuevo elemento con un id generado automáticamente.
     * Si el id es mayor a 0, actualiza el elemento existente con los nuevos datos.
     *
     * @param datosGeneralesExtranjeros - Los datos de socios y accionistas extranjeros a guardar.
     */
    public setSociosYAaccionistasExtranjerosData(datosGeneralesExtranjeros: SociosYAccionistasExtranjerosData[]): void {
        this.update((STATE) => {
          const LISTAEXISTENTE = STATE.datosGeneralesExtranjeros || [];
          const NUEVOARTICULO = { ...datosGeneralesExtranjeros[0] };

            if (NUEVOARTICULO.id === 0) {
            // Agregar nuevo elemento con una identificación generada
            NUEVOARTICULO.id = (LISTAEXISTENTE.length || 0) + 1;
            const UPDATEDLIST = [...LISTAEXISTENTE, NUEVOARTICULO];
            return { ...STATE, datosGeneralesExtranjeros: UPDATEDLIST };
          }
            // Actualizar el elemento existente cuando id > 0
            const UPDATEDLIST = LISTAEXISTENTE.map((ITEM) =>
            ITEM.id === NUEVOARTICULO.id ? { ...ITEM, ...NUEVOARTICULO } : ITEM
          );
          return { ...STATE, datosGeneralesExtranjeros: UPDATEDLIST };
        }
        );
      }
            

    /**
     * Limpia todos los datos de la empresa en el estado.
     */
    public limpiarDatosEmpresa(): void {
        this.reset();
    }
}