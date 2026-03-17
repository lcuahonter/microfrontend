import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado del formulario completo que se guarda en el store.
 */
export interface DatosDelInmueble104State {
  /**
   * Información correspondiente a la sección de Fomento a la Exportación.
   */
  fomentoExportacion: {
    /**
     * Tipo de programa seleccionado por el usuario.
     */
    tipoPrograma: string;

    /**
     * Folio de autorización asignado al programa.
     */
    folioAutorizacion: string;
  };

  /**
   * Información correspondiente a la dirección capturada en el formulario.
   */
  direccion: {
    /**
     * Nombre de la calle del domicilio.
     */
    calle: string;

    /**
     * Número exterior del domicilio.
     */
    numeroExterior: string;

    /**
     * Número interior del domicilio (opcional).
     */
    numeroInterior?: string;

    /**
     * País seleccionado en el formulario.
     */
    pais: string;

    /**
     * Entidad federativa (estado) seleccionada.
     */
    entidadFederativa: string;

    /**
     * Municipio o delegación correspondiente al domicilio.
     */
    municipioDelegacion: string;

    /**
     * Colonia del domicilio.
     */
    colonia: string;

    /**
     * Localidad del domicilio.
     */
    localidad: string;

    /**
     * Código postal del domicilio (5 dígitos).
     */
    codigoPostal: string;
  };
}

/**
 * Crea el estado inicial del formulario para Fomento a la Exportación y Dirección.
 * 
 * @returns Un objeto con valores por defecto para cada campo del formulario.
 */
export function createFormularioInitialState(): DatosDelInmueble104State {
  return {
    fomentoExportacion: {
      /**
       * Inicializa el tipo de programa como cadena vacía.
       */
      tipoPrograma: '',

      /**
       * Inicializa el folio de autorización como cadena vacía.
       */
      folioAutorizacion: '',
    },
    direccion: {
      /**
       * Inicializa la calle como cadena vacía.
       */
      calle: '',

      /**
       * Inicializa el número exterior como cadena vacía.
       */
      numeroExterior: '',

      /**
       * Inicializa el número interior como cadena vacía (opcional).
       */
      numeroInterior: '',

      /**
       * Inicializa el país como cadena vacía.
       */
      pais: '',

      /**
       * Inicializa la entidad federativa como cadena vacía.
       */
      entidadFederativa: '',

      /**
       * Inicializa el municipio o delegación como cadena vacía.
       */
      municipioDelegacion: '',

      /**
       * Inicializa la colonia como cadena vacía.
       */
      colonia: '',

      /**
       * Inicializa la localidad como cadena vacía.
       */
      localidad: '',

      /**
       * Inicializa el código postal como cadena vacía.
       */
      codigoPostal: '',
    },
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'DatosDelInmueble104', resettable: true })
export class DatosDelInmueble104Store extends Store<DatosDelInmueble104State> {
  /**
   * Constructor del store que inicializa el estado con los valores predeterminados
   * definidos en la función `createFormularioInitialState`.
   */
  constructor() {
    super(createFormularioInitialState());
  }


  /**
   * Actualiza los datos del formulario de fomento a la exportación
   * en el estado global del store.
   * 
   * @param datos - Objeto con los valores de tipoPrograma y folioAutorizacion.
   */
  public setFomentoExportacion(datos: DatosDelInmueble104State['fomentoExportacion']): void {
    this.update((state) => ({
      ...state,
      fomentoExportacion: datos,
    }));
  }


  /**
   * Actualiza los datos de la dirección en el estado global del store.
   * 
   * @param datos - Objeto con los valores del formulario de dirección
   * como calle, número exterior, país, entidad federativa, etc.
   */
  public setDireccion(datos: DatosDelInmueble104State['direccion']): void {
    this.update((state) => ({
      ...state,
      direccion: datos,
    }));
  }


/**
 * Limpia completamente el estado del formulario,
 * restableciendo todos los valores a su estado inicial.
 */
public limpiarFormulario(): void {
  this.reset();
}

}
