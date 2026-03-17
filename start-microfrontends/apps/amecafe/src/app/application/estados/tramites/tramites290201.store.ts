import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

import { FilaData, FilaData2 } from '../../tramites/290201/models/fila-model';

/**
 * Creacion del estado inicial para la interfaz de tramite 290201
 * @returns Solicitud290201
 */
export interface Solicitud290201State {
    id_solicitud: string;

  nombredeagencia: string;
  /**
   * Forma del café seleccionada.
   */
  formasdelcafe: string;

  /**
   * Tipos de café seleccionados.
   */
  tipos: string;

  /**
   * Calidad del café seleccionada.
   */
  calidad: string;

  /**
   * Procesos aplicados al café.
   */
  procesos: string;

  /**
   * Certificaciones del café.
   */
  certifications: string;

  /**
   * Aduana de salida seleccionada.
   */
  adunadesalida: string;

  /**
   * País de destino seleccionado.
   */
  paisdestino: string;

  /**
   * Entidad de procedencia seleccionada.
   */
  entidaddeprocedencia: string;

  /**
   * Ciclo cafetalero seleccionado.
   */
  ciclocafetalero: string;

  /**
   * Lugar de envasado seleccionado.
   */
  envasadoen: string;

  /**
   * Uso del café seleccionado.
   */
  utilizoCafeComo: string;

  /**
   * Cantidad utilizada.
   */
  cantidadutilizada: string;

  /**
   * Número de pedimento.
   */
  numerodepedimento: string;

  /**
   * Lista de países de importación.
   */
  paisdeimportacion: [];

  /**
   * Lista de fracciones arancelarias.
   */
  fraccionarancelaria: [];

  /**
   * Cantidad seleccionada.
   */
  cantidad: string;

  /**
   * Unidad de medida seleccionada.
   */
  unidaddemedida: string;

  /**
   * Precio aplicable.
   */
  precioapplicable: string;

  /**
   * Valor del dólar.
   */
  dolar: string;

  /**
   * Lote seleccionado.
   */
  lote: string;

  /**
   * Otras marcas seleccionadas.
   */
  otrasmarcas: string;

  /**
   * Tipo de café seleccionado.
   */
  elcafe: string;

  /**
   * Fecha de exportación.
   */
  fechaexportacion: string;

  /**
   * País de transbordo seleccionado.
   */
  paisdetransbordo: string;

  /**
   * Medio de transporte seleccionado.
   */
  mediodetransporte: string;

  /**
   * Identificador del café.
   */
  Identificadordel: string;

  /**
   * Observaciones.
   */
  observaciones: string;

  /**
   * Tipo de persona.
   */
  tipoPersona: string;

  /**
   * Denominación.
   */
  denominacion: string;

  /**
   * Domicilio.
   */
  domicilio: string;

  /**
   * País.
   */
  pais: string;

  /**
   * Código postal.
   */
  codigopostal: string;

  /**
   * Teléfono.
   */
  telefono: string;

  /**
   * Correo electrónico.
   */
  correoelectronico: string;

/**
 * @property {string} entidadFederativa
 * @description Entidad federativa seleccionada.
 */
entidadFederativa: string;

/**
 * @property {string} alcaldiaMunicipo
 * @description Alcaldía o municipio seleccionado.
 */
alcaldiaMunicipo: string;

/**
 * @property {string} colonia
 * @description Colonia seleccionada.
 */
colonia: string;

/**
 * @property {string} nombre
 * @description Nombre de la persona.
 */
nombre: string;

/**
 * @property {string} primerApellido
 * @description Primer apellido de la persona.
 */
primerApellido: string;

/**
 * @property {string} segundoApellido
 * @description Segundo apellido de la persona.
 */
segundoApellido: string;

/**
 * @property {string} calle
 * @description Calle del domicilio.
 */
calle: string;

/**
 * @property {string} numeroExterior
 * @description Número exterior del domicilio.
 */
numeroExterior: string;

/**
 * @property {string} numeroInterior
 * @description Número interior del domicilio.
 */
numeroInterior: string;

/**
 * @property {string} otrasCaracteristicas
 * @description Otras características del domicilio.
 */
otrasCaracteristicas: string;
/**
 * @property {FilaData2[]} tableData
 * @description Lista de datos de la tabla utilizada para almacenar información relacionada con el trámite.
 */
tableData: FilaData2[];
  /**
   * Fila seleccionada actualmente.
   */
filaSeleccionada: FilaData2 | null; 
  /**
   * Datos de la nueva fila del destinatario.
   */
  filaSeleccionadas: number[]; 
  /**
 * Datos del trámite de café capturados en el modal
 */
datosCafeGuardados: FilaData [];
isSubmitted: boolean;             
  tabDatosTramiteValid: boolean | null
  
}
export function createInitialSolicitudState(): Solicitud290201State {
  return {
     id_solicitud: '',
    nombredeagencia: '',
    /**
     * Forma del café seleccionada.
     */
    formasdelcafe: '',

    /**
     * Tipos de café seleccionados.
     */
    tipos: '',

    /**
     * Calidad del café seleccionada.
     */
    calidad: '',

    /**
     * Procesos aplicados al café.
     */
    procesos: '',

    /**
     * Certificaciones del café.
     */
    certifications: '',

    /**
     * Aduana de salida seleccionada.
     */
    adunadesalida: '',

    /**
     * País de destino seleccionado.
     */
    paisdestino: '',

    /**
     * Entidad de procedencia seleccionada.
     */
    entidaddeprocedencia: '',

    /**
     * Ciclo cafetalero seleccionado.
     */
    ciclocafetalero: '',

    /**
     * Lugar de envasado seleccionado.
     */
    envasadoen: '',

    /**
     * Uso del café seleccionado.
     */
    utilizoCafeComo: '',

    /**
     * Cantidad utilizada.
     */
    cantidadutilizada: '',

    /**
     * Número de pedimento.
     */
    numerodepedimento: '',

    /**
     * Lista de países de importación.
     */
    paisdeimportacion: [],

    /**
     * Lista de fracciones arancelarias.
     */
    fraccionarancelaria: [],

    /**
     * Cantidad seleccionada.
     */
    cantidad: '',

    /**
     * Unidad de medida seleccionada.
     */
    unidaddemedida: '',

    /**
     * Precio aplicable.
     */
    precioapplicable: '',

    /**
     * Valor del dólar.
     */
    dolar: '',

    /**
     * Lote seleccionado.
     */
    lote: '',

    /**
     * Otras marcas seleccionadas.
     */
    otrasmarcas: '',

    /**
     * Tipo de café seleccionado.
     */
    elcafe: '',

    /**
     * Fecha de exportación.
     */
    fechaexportacion: '',

    /**
     * País de transbordo seleccionado.
     */
    paisdetransbordo: '',

    /**
     * Medio de transporte seleccionado.
     */
    mediodetransporte: '',

    /**
     * Identificador del café.
     */
    Identificadordel: '',

    /**
     * Observaciones.
     */
    observaciones: '',

    /**
     * Tipo de persona.
     */
    tipoPersona: '',

    /**
     * Denominación.
     */
    denominacion: '',

    /**
     * Domicilio.
     */
    domicilio: '',

    /**
     * País.
     */
    pais: '',

    /**
     * Código postal.
     */
    codigopostal: '',

    /**
     * Teléfono.
     */
    telefono: '',

    /**
     * Correo electrónico.
     */
    correoelectronico: '',
    datosCafeGuardados: [],
    isSubmitted: false,
    tabDatosTramiteValid: null,
    
/**
 * @property {string} entidadFederativa
 * @description Entidad federativa seleccionada.
 */
entidadFederativa: '',

/**
 * @property {string} alcaldiaMunicipo
 * @description Alcaldía o municipio seleccionado.
 */
alcaldiaMunicipo: '',

/**
 * @property {string} colonia
 * @description Colonia seleccionada.
 */
colonia: '',

/**
 * @property {string} nombre
 * @description Nombre de la persona.
 */
nombre: '',

/**
 * @property {string} primerApellido
 * @description Primer apellido de la persona.
 */
primerApellido: '',

/**
 * @property {string} segundoApellido
 * @description Segundo apellido de la persona.
 */
segundoApellido: '',

/**
 * @property {string} calle
 * @description Calle del domicilio.
 */
calle: '',

/**
 * @property {string} numeroExterior
 * @description Número exterior del domicilio.
 */
numeroExterior: '',

/**
 * @property {string} numeroInterior
 * @description Número interior del domicilio.
 */
numeroInterior: '',

/**
 * @property {string} otrasCaracteristicas
 * @description Otras características del domicilio.
 */
otrasCaracteristicas: '',

/**
 * @property {FilaData2[]} tableData
 * @description Lista de datos de la tabla utilizada para almacenar información relacionada con el trámite.
 */
tableData: [],
    filaSeleccionada: null, // Currently selected row
    filaSeleccionadas: [], // IDs of selected rows
    
  };
  
}
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitud290201', resettable: true })
export class Solicitud290201Store extends Store<Solicitud290201State> {
  constructor() {
    super(createInitialSolicitudState());
  }

  /**
   * Actualiza el estado con el nombre de la agencia.
   * @param nombredeagencia Nombre de la agencia.
   */
  public setNombredeagencia(nombredeagencia: string): void {
    this.update((state) => ({
      ...state,
      nombredeagencia,
    }));
  }

  /**
   * Actualiza el estado con la forma del café seleccionada.
   * @param formasdelcafe Forma del café.
   */
  public setFormasDelCafe(formasdelcafe: string): void {
    this.update((state) => ({
      ...state,
      formasdelcafe,
    }));
  }

  /**
   * Actualiza el estado con los tipos seleccionados.
   * @param tipos Tipos de café.
   */
  public setTipos(tipos: string): void {
    this.update((state) => ({
      ...state,
      tipos,
    }));
  }

  /**
   * Actualiza el estado con la calidad seleccionada.
   * @param calidad Calidad del café.
   */
  public setCalidad(calidad: string): void {
    this.update((state) => ({
      ...state,
      calidad,
    }));
  }

  /**
   * Actualiza el estado con los procesos seleccionados.
   * @param procesos Procesos aplicados al café.
   */
  public setProcesos(procesos: string): void {
    this.update((state) => ({
      ...state,
      procesos,
    }));
  }

  /**
   * Actualiza el estado con las certificaciones seleccionadas.
   * @param certifications Certificaciones del café.
   */
  public setCertifications(certifications: string): void {
    this.update((state) => ({
      ...state,
      certifications,
    }));
  }

  /**
   * Actualiza el estado con la aduana de salida seleccionada.
   * @param adunadesalida Aduana de salida.
   */
  public setAdunadesalida(adunadesalida: string): void {
    this.update((state) => ({
      ...state,
      adunadesalida,
    }));
  }

  /**
   * Actualiza el estado con el país de destino seleccionado.
   * @param paisdestino País de destino.
   */
  public setPaisdestino(paisdestino: string): void {
    this.update((state) => ({
      ...state,
      paisdestino,
    }));
  }

  /**
   * Actualiza el estado con la entidad de procedencia seleccionada.
   * @param entidaddeprocedencia Entidad de procedencia.
   */
  public setEntidaddeprocedencia(entidaddeprocedencia: string): void {
    this.update((state) => ({
      ...state,
      entidaddeprocedencia,
    }));
  }

  /**
   * Actualiza el estado con el ciclo cafetalero seleccionado.
   * @param ciclocafetalero Ciclo cafetalero.
   */
  public setCiclocafetalero(ciclocafetalero: string): void {
    this.update((state) => ({
      ...state,
      ciclocafetalero,
    }));
  }

  /**
   * Actualiza el estado con el lugar de envasado seleccionado.
   * @param envasadoen Lugar de envasado.
   */
  public setEnvasadoen(envasadoen: string): void {
    this.update((state) => ({
      ...state,
      envasadoen,
    }));
  }

  /**
   * Actualiza el estado con el uso del café seleccionado.
   * @param utilizoCafeComo Uso del café.
   */
  public setUtilizoCafeComo(utilizoCafeComo: string): void {
    this.update((state) => ({
      ...state,
      utilizoCafeComo,
    }));
  }

  /**
   * Actualiza el estado con la cantidad utilizada.
   * @param cantidadutilizada Cantidad utilizada.
   */
  public setCantidadutilizada(cantidadutilizada: string): void {
    this.update((state) => ({
      ...state,
      cantidadutilizada,
    }));
  }

  /**
   * Actualiza el estado con el número de pedimento.
   * @param numerodepedimento Número de pedimento.
   */
  public setNumerodepedimento(numerodepedimento: string): void {
    this.update((state) => ({
      ...state,
      numerodepedimento,
    }));
  }

  /**
   * Actualiza el estado con los países de importación.
   * @param paisdeimportacion Lista de países de importación.
   */
  public setPaisdeimportacion(paisdeimportacion: []): void {
    this.update((state) => ({
      ...state,
      paisdeimportacion,
    }));
  }

  /**
   * Actualiza el estado con las fracciones arancelarias.
   * @param fraccionarancelaria Lista de fracciones arancelarias.
   */
  public setFraccionarancelaria(fraccionarancelaria: []): void {
    this.update((state) => ({
      ...state,
      fraccionarancelaria,
    }));
  }

  /**
   * Actualiza el estado con la cantidad seleccionada.
   * @param cantidad Cantidad.
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }

  /**
   * Actualiza el estado con la unidad de medida seleccionada.
   * @param unidaddemedida Unidad de medida.
   */
  public setUnidaddemedida(unidaddemedida: string): void {
    this.update((state) => ({
      ...state,
      unidaddemedida,
    }));
  }

  /**
   * Actualiza el estado con el precio aplicable.
   * @param precioapplicable Precio aplicable.
   */
  public setPrecioapplicable(precioapplicable: string): void {
    this.update((state) => ({
      ...state,
      precioapplicable,
    }));
  }

  /**
   * Actualiza el estado con el valor del dólar.
   * @param dolar Valor del dólar.
   */
  public setDolar(dolar: string): void {
    this.update((state) => ({
      ...state,
      dolar,
    }));
  }

  /**
   * Actualiza el estado con el lote seleccionado.
   * @param lote Lote.
   */
  public setLote(lote: string): void {
    this.update((state) => ({
      ...state,
      lote,
    }));
  }

  /**
   * Actualiza el estado con otras marcas seleccionadas.
   * @param otrasmarcas Otras marcas.
   */
  public setOtrasmarcas(otrasmarcas: string): void {
    this.update((state) => ({
      ...state,
      otrasmarcas,
    }));
  }

  /**
   * Actualiza el estado con el tipo de café seleccionado.
   * @param elcafe Tipo de café.
   */
  public setElcafe(elcafe: string): void {
    this.update((state) => ({
      ...state,
      elcafe,
    }));
  }

  /**
   * Actualiza el estado con la fecha de exportación.
   * @param fechaexportacion Fecha de exportación.
   */
  public setFechaexportacion(fechaexportacion: string): void {
    this.update((state) => ({
      ...state,
      fechaexportacion,
    }));
  }

  /**
   * Actualiza el estado con el país de transbordo.
   * @param paisdetransbordo País de transbordo.
   */
  public setPaisdetransbordo(paisdetransbordo: string): void {
    this.update((state) => ({
      ...state,
      paisdetransbordo,
    }));
  }

  /**
   * Actualiza el estado con el medio de transporte.
   * @param mediodetransporte Medio de transporte.
   */
  public setMediodetransporte(mediodetransporte: string): void {
    this.update((state) => ({
      ...state,
      mediodetransporte,
    }));
  }

  /**
   * Actualiza el estado con el identificador del café.
   * @param Identificadordel Identificador del café.
   */
  public setIdentificadordel(Identificadordel: string): void {
    this.update((state) => ({
      ...state,
      Identificadordel,
    }));
  }

  /**
   * Actualiza el estado con las observaciones.
   * @param observaciones Observaciones.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }

  /**
   * Actualiza el estado con el tipo de persona.
   * @param tipoPersona Tipo de persona.
   */
  public setTipoPersona(tipoPersona: string): void {
    this.update((state) => ({
      ...state,
      tipoPersona,
    }));
  }

  /**
   * Actualiza el estado con la denominación.
   * @param denominacion Denominación.
   */
  public setDenominacion(denominacion: string): void {
    this.update((state) => ({
      ...state,
      denominacion,
    }));
  }

  /**
   * Actualiza el estado con el domicilio.
   * @param domicilio Domicilio.
   */
  public setDomicilio(domicilio: string): void {
    this.update((state) => ({
      ...state,
      domicilio,
    }));
  }

  /**
   * Actualiza el estado con el país.
   * @param pais País.
   */
  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * Actualiza el estado con el código postal.
   * @param codigopostal Código postal.
   */
  public setCodigopostal(codigopostal: string): void {
    this.update((state) => ({
      ...state,
      codigopostal,
    }));
  }

  /**
   * Actualiza el estado con el teléfono.
   * @param telefono Teléfono.
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }

  /**
   * Actualiza el estado con el correo electrónico.
   * @param correoelectronico Correo electrónico.
   */
  public setCorreoelectronico(correoelectronico: string): void {
    this.update((state) => ({
      ...state,
      correoelectronico,
    }));
  }
   /**
     * @method setEntidadFederativa
     * @description 
     * Actualiza la entidad federativa en el estado.
     * @param {string} entidadFederativa - Entidad federativa.
     */
   public setEntidadFederativa(entidadFederativa: string): void {
    this.update((state) => ({
        ...state,
        entidadFederativa,
    }));
}

/**
 * @method setAlcaldiaMunicipo
 * @description 
 * Actualiza la alcaldía o municipio en el estado.
 * @param {string} alcaldiaMunicipo - Alcaldía o municipio.
 */
public setAlcaldiaMunicipo(alcaldiaMunicipo: string): void {
    this.update((state) => ({
        ...state,
        alcaldiaMunicipo,
    }));
}

/**
 * @method setColonia
 * @description 
 * Actualiza la colonia en el estado.
 * @param {string} colonia - Colonia.
 */
public setColonia(colonia: string): void {
    this.update((state) => ({
        ...state,
        colonia,
    }));
}
/**
 * @method setNombre
 * @description Actualiza el estado con el nombre proporcionado.
 * @param {string} nombre - Nombre de la persona.
 */
public setNombre(nombre: string): void {
  this.update((state) => ({
      ...state,
      nombre,
  }));
}

/**
 * @method setPrimerApellido
 * @description Actualiza el estado con el primer apellido proporcionado.
 * @param {string} primerApellido - Primer apellido de la persona.
 */
public setPrimerApellido(primerApellido: string): void {
  this.update((state) => ({
      ...state,
      primerApellido,
  }));
}

/**
 * @method setSegundoApellido
 * @description Actualiza el estado con el segundo apellido proporcionado.
 * @param {string} segundoApellido - Segundo apellido de la persona.
 */
public setSegundoApellido(segundoApellido: string): void {
  this.update((state) => ({
      ...state,
      segundoApellido,
  }));
}

/**
 * @method setCalle
 * @description Actualiza el estado con la calle proporcionada.
 * @param {string} calle - Calle del domicilio.
 */
public setCalle(calle: string): void {
  this.update((state) => ({
      ...state,
      calle,
  }));
}

/**
 * @method setNumeroExterior
 * @description Actualiza el estado con el número exterior proporcionado.
 * @param {string} numeroExterior - Número exterior del domicilio.
 */
public setNumeroExterior(numeroExterior: string): void {
  this.update((state) => ({
      ...state,
      numeroExterior,
  }));
}

/**
 * @method setNumeroInterior
 * @description Actualiza el estado con el número interior proporcionado.
 * @param {string} numeroInterior - Número interior del domicilio.
 */
public setNumeroInterior(numeroInterior: string): void {
  this.update((state) => ({
      ...state,
      numeroInterior,
  }));
}

/**
 * @method setOtrasCaracteristicas
 * @description Actualiza el estado con otras características proporcionadas.
 * @param {string} otrasCaracteristicas - Otras características del domicilio.
 */
public setOtrasCaracteristicas(otrasCaracteristicas: string): void {
  this.update((state) => ({
      ...state,
      otrasCaracteristicas,
  }));
}
/**
 * @method setTableData
 * @description Actualiza el estado con los datos de la tabla proporcionados.
 * @param {FilaData2[]} tableData - Lista de datos de la tabla.
 */
public setDatosDeTabla(tableData: FilaData2[]): void {
  this.update((state) => ({
    ...state,
    tableData
  }));
}
/**
 * @method setFilaSeleccionada
 * @description Actualiza la fila seleccionada en el estado.
 * @param {FilaData2 | null} filaSeleccionada - Fila seleccionada o null si no hay selección.
 */
public setFilaSeleccionada(filaSeleccionada: FilaData2 | null): void {
    this.update((state) => ({
      ...state,
      filaSeleccionada,
    }));
  }
/**
 * @method setFilaSeleccionadas
 * @description Actualiza las filas seleccionadas en el estado.
 * @param {number[]} filaSeleccionadas - IDs de las filas seleccionadas.
 */
public setFilaSeleccionadas(filaSeleccionadas: number[]): void {
    this.update((state) => ({
      ...state,
      filaSeleccionadas,
    }));
  }
    /**
 * Actualiza el identificador de la solicitud en el estado.
 *
 * @param id_solicitud - Identificador único de la solicitud.
 */
public setIdSolicitud(id_solicitud: string): void {
  this.update((state) => ({
    ...state,
    id_solicitud,
  }));
}


  /**
 * Guarda los datos del trámite de café
 */

public addOrUpdateDatosCafe(data: FilaData): void {
  this.update(state => {
    const INDEX = state.datosCafeGuardados.findIndex(item => item.id === data.id);
    const UPDATEARRAY = [...state.datosCafeGuardados];

    if (INDEX === -1) {
      // Si no existe, agregamos
      UPDATEARRAY.push(data);
    } else {
      // Si existe, actualizamos
      UPDATEARRAY[INDEX] = data;
    }

    return { ...state, datosCafeGuardados: UPDATEARRAY };
  });
}
public setSubmitted(isSubmitted: boolean): void {
    this.update({ isSubmitted });
  }

  /**
   * Actualiza si la pestaña de datos del trámite es válida.
   */
  public setTabDatosTramiteValid(valid: boolean | null): void {
    this.update({ tabDatosTramiteValid: valid });
  }
}