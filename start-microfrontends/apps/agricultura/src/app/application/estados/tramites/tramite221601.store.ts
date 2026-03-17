import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interface que representa el estado de la solicitud para el trámite 90201.
 * Este estado contiene la información relacionada con los datos de la solicitud.
 * @interface Solicitud221601State
 */
export interface Solicitud221601State {
  /**
   * Justificación para la solicitud.
   * @type {string}
   */
  justificacion: string;

  /**
   * Aduana de ingreso para el trámite.
   * @type {string}
   */
  aduana: string;

  /**
   * Oficina de inspección asociada al trámite.
   * @type {string}
   */
  oficina: string;

  /**
   * Punto de inspección donde se realiza el trámite.
   * @type {string}
   */
  punto: string;

  /**
   * Número de guía relacionado con el trámite.
   * @type {string}
   */
  guia: string;

  /**
   * Régimen aduanero bajo el cual se realiza el trámite.
   * @type {string}
   */
  regimen: string;

  /**
   * Número de carro relacionado con el trámite.
   * @type {string}
   */
  carro: string;

  /**
   * Clave única asociada al trámite.
   * @type {string}
   */
  clave: string;
  /**
   * Clave única asociada al trámite.
   * @type {string}
   */
  claves: string;

  /**
   * veterinario aduanero bajo el cual se realiza el trámite.
   * @type {string}
   */
    veterinario: string;

  /**
   * establecimiento aduanero bajo el cual se realiza el trámite.
   * @type {string}
   */
    establecimiento: string;

     /**
   * capturaMercancia aduanero bajo el cual se realiza el trámite.
   * @type {string}
   */
    capturaMercancia:string
  medio: string;

  /**
   * Tipo de transporte utilizado en el trámite.
   * @type {string}
   */
  transporte: string;

  /**
   * Verificación que se realiza durante el trámite.
   * @type {string}
   */
  verificacion: string;

  /**
   * Empresa relacionada con el trámite.
   * @type {string}
   */
  empresa: string;
 

  /**
   * Dependencia responsable del trámite.
   * @type {string}
   */
  dependencia: string;

  /**
   * Banco asociado al trámite.
   * @type {string}
   */
  banco: string;

  /**
   * Llave única para la validación del trámite.
   * @type {string}
   */
  llave: string;

  /**
   * Fecha de la solicitud del trámite.
   * @type {string}
   */
  fecha: string;

  /**
   * Importe relacionado con el trámite.
   * @type {string}
   */
  importe: string;
/**
 * Coordenadas geográficas.
 * @type {string}
 */
coordenadas: string;

/**
 * Tipo de persona (física o moral).
 * @type {string}
 */
tipoPersona: string;

/**
 * Nombre(s) de la persona.
 * @type {string}
 */
nombre: string;

/**
 * Primer apellido de la persona.
 * @type {string}
 */
primerApellido: string;

/**
 * Segundo apellido de la persona.
 * @type {string}
 */
segundoApellido: string;

/**
 * Denominación o razón social.
 * @type {string}
 */
social: string;

/**
 * País de residencia.
 * @type {string}
 */
pais: string;

/**
 * Código postal.
 * @type {string}
 */
codigo: string;

/**
 * Estado o entidad federativa.
 * @type {string}
 */
estado: string;

/**
 * Municipio o alcaldía.
 * @type {string}
 */
municipio: string;

/**
 * Colonia o localidad.
 * @type {string}
 */
colonia: string;

/**
 * Nombre de la calle.
 * @type {string}
 */
calle: string;

/**
 * Número exterior del domicilio.
 * @type {string}
 */
exterior: string;

/**
 * Número interior del domicilio.
 * @type {string}
 */
interior: string;

/**
 * Clave lada del número telefónico.
 * @type {string}
 */
lada: string;

/**
 * Número telefónico de contacto.
 * @type {string}
 */
telefono: string;

/**
 * Correo electrónico de contacto.
 * @type {string}
 */
correoElectronico: string;

/**
 * Número del establecimiento TIF.
 * @type {string}
 */
tif: string;

}
/**
 * Función para crear el estado inicial de la solicitud.
 * @returns {Solicitud221601State} El estado inicial con valores vacíos para cada propiedad.
 */
export function createInitialState(): Solicitud221601State {
  return {
    justificacion: '',
    aduana: '',
    oficina: '',
    punto: '',
    guia: '',
    regimen: '',
    carro: '',
    clave: '',
    veterinario:'',
    establecimiento:'',
    capturaMercancia:'',
    medio: '',
    transporte: '',
    verificacion: '',
    empresa: '',
    claves: '',
    dependencia: '',
    banco: '',
    llave: '',
    fecha: '',
    importe: '',
    coordenadas: '',
    tipoPersona: '',
        nombre: '',
        primerApellido: '',
        segundoApellido: '',
        social: '',
        pais: '',
        codigo: '',
        estado: '',
        municipio: '',
        colonia: '',
        calle: '',
        exterior: '',
        interior: '',
        lada: '',
        telefono: '',
        correoElectronico: '',
        tif:'',       
   
  };
}

/**
 * Store para la gestión del estado de la solicitud del trámite 221601.
 * Utiliza Akita para la gestión de estado y permite actualizar los valores relacionados con el trámite.
 * @class Tramite221601Store
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite221601', resettable: true })
export class Tramite221601Store extends Store<Solicitud221601State> {
  /**
   * Constructor del store que inicializa el estado con el estado inicial creado.
   */
  constructor() {
    super(createInitialState());
  }
/**
   * Actualiza el estado con el régimen aduanero proporcionado.
   * @param {string} regimen El régimen aduanero a establecer.
   */
public setRegimen(regimen: string): void {
    this.update((state) => ({
      ...state,
      regimen,
    }));
  }

  /**
   * Actualiza el estado con la justificación proporcionada.
   * @param {string} justificacion La justificación a establecer.
   */
  public setJustificacion(justificacion: string): void {
    this.update((state) => ({
      ...state,
      justificacion,
    }));
  }

  /**
   * Actualiza el estado con la aduana proporcionada.
   * @param {string} aduana La aduana a establecer.
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
   * Actualiza el estado con la oficina proporcionada.
   * @param {string} oficina La oficina de inspección a establecer.
   */
  public setOficina(oficina: string): void {
    this.update((state) => ({
      ...state,
      oficina,
    }));
  }

  /**
   * Actualiza el estado con el punto de inspección proporcionado.
   * @param {string} punto El punto de inspección a establecer.
   */
  public setPunto(punto: string): void {
    this.update((state) => ({
      ...state,
      punto,
    }));
  }

  /**
   * Actualiza el estado con el número de guía proporcionado.
   * @param {string} guia El número de guía a establecer.
   */
  public setGuia(guia: string): void {
    this.update((state) => ({
      ...state,
      guia,
    }));
  }

  /**
   * Actualiza el estado con el número de carro proporcionado.
   * @param {string} carro El número de carro a establecer.
   */
  public setCarro(carro: string): void {
    this.update((state) => ({
      ...state,
      carro,
    }));
  }
  /**
   * Actualiza el estado con la clave proporcionada.
   * @param {string} clave La clave a establecer.
   */
  public setClave(clave: string): void {
    this.update((state) => ({
      ...state,
      clave,
    }));
  }
   /**
   * Actualiza el estado con la clave proporcionada.
   * @param {string} clave La clave a establecer.
   */
  public setClaves(claves: string): void {
    this.update((state) => ({
      ...state,
      claves,
    }));
  }
/**
 * Actualiza el estado con el nombre del médico veterinario proporcionado.
 * @param {string} veterinario - El nombre del veterinario a establecer.
 */
  public setVeterinario(veterinario: string): void {
    this.update((state) => ({
      ...state,
      veterinario,
    }));
  }

  public setEstablecimiento(establecimiento: string): void {
    this.update((state) => ({
      ...state,
      establecimiento,
    }));
  }
  /**
 * Actualiza el estado con el establecimiento para la captura de mercancía.
 * @param {string} establecimiento - El establecimiento para capturar mercancía.
 */
  public setCapturaMercancia(establecimiento: string): void {
    this.update((state) => ({
      ...state,
      establecimiento,
    }));
  }
  
  /**
   * Actualiza el estado con el medio de transporte proporcionado.
   * @param {string} medio El medio de transporte a establecer.
   */
  public setMedio(medio: string): void {
    this.update((state) => ({
      ...state,
      medio,
    }));
  }

  /**
   * Actualiza el estado con la verificación proporcionada.
   * @param {string} verificacion La verificación a establecer.
   */
  public setVerificacion(verificacion: string): void {
    this.update((state) => ({
      ...state,
      verificacion,
    }));
  }

  /**
   * Actualiza el estado con el tipo de transporte proporcionado.
   * @param {string} transporte El tipo de transporte a establecer.
   */
  public setTransporte(transporte: string): void {
    this.update((state) => ({
      ...state,
      transporte,
    }));
  }

  /**
   * Actualiza el estado con la empresa proporcionada.
   * @param {string} empresa La empresa a establecer.
   */
  public setEmpresa(empresa: string): void {
    this.update((state) => ({
      ...state,
      empresa,
    }));
  }
  /**
   * Actualiza el estado con la dependencia proporcionada.
   * @param {string} dependencia La dependencia a establecer.
   */
  public setDependencia(dependencia: string): void {
    this.update((state) => ({
      ...state,
      dependencia,
    }));
  }

  /**
   * Actualiza el estado con el banco proporcionado.
   * @param {string} banco El banco a establecer.
   */
  public setBanco(banco: string): void {
    this.update((state) => ({
      ...state,
      banco,
    }));
  }

  /**
   * Actualiza el estado con la llave proporcionada.
   * @param {string} llave La llave a establecer.
   */
  public setLlave(llave: string): void {
    this.update((state) => ({
      ...state,
      llave,
    }));
  }

  /**
   * Actualiza el estado con la fecha proporcionada.
   * @param {string} fecha La fecha a establecer.
   */
  public setFecha(fecha: string): void {
    this.update((state) => ({
      ...state,
      fecha,
    }));
  }

  /**
   * Actualiza el estado con el importe proporcionado.
   * @param {string} importe El importe a establecer.
   */
  public setImporte(importe: string): void {
    this.update((state) => ({
      ...state,
      importe,
    }));
  }
  /**
 * Establece el valor de las coordenadas en el estado.
 * @param {string} coordenadas Las coordenadas que se desean establecer en el estado.
 */
public setCoordenadas(coordenadas: string): void {
    this.update((state) => ({
      ...state,
      coordenadas, // Actualiza la propiedad 'coordenadas' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece el tipo de persona en el estado.
   * @param {string} tipoPersona El tipo de persona que se desea establecer en el estado.
   */
  public setTipoPersona(tipoPersona: string): void {
    this.update((state) => ({
      ...state,
      tipoPersona, // Actualiza la propiedad 'tipoPersona' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece el nombre en el estado.
   * @param {string} nombre El nombre que se desea establecer en el estado.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre, // Actualiza la propiedad 'nombre' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece el primer apellido en el estado.
   * @param {string} primerApellido El primer apellido que se desea establecer en el estado.
   */
  public setPrimerApellido(primerApellido: string): void {
    this.update((state) => ({
      ...state,
      primerApellido, // Actualiza la propiedad 'primerApellido' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece el segundo apellido en el estado.
   * @param {string} segundoApellido El segundo apellido que se desea establecer en el estado.
   */
  public setSegundoApellido(segundoApellido: string): void {
    this.update((state) => ({
      ...state,
      segundoApellido, // Actualiza la propiedad 'segundoApellido' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece la razón social en el estado.
   * @param {string} social La razón social que se desea establecer en el estado.
   */
  public setSocial(social: string): void {
    this.update((state) => ({
      ...state,
      social, // Actualiza la propiedad 'social' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece el país en el estado.
   * @param {string} pais El país que se desea establecer en el estado.
   */
  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais, // Actualiza la propiedad 'pais' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece el código en el estado.
   * @param {string} codigo El código que se desea establecer en el estado.
   */
  public setCodigo(codigo: string): void {
    this.update((state) => ({
      ...state,
      codigo, // Actualiza la propiedad 'codigo' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece el estado en el estado.
   * @param {string} estado El estado que se desea establecer en el estado.
   */
  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado, // Actualiza la propiedad 'estado' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece el municipio en el estado.
   * @param {string} municipio El municipio que se desea establecer en el estado.
   */
  public setMunicipio(municipio: string): void {
    this.update((state) => ({
      ...state,
      municipio, // Actualiza la propiedad 'municipio' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece la colonia en el estado.
   * @param {string} colonia La colonia que se desea establecer en el estado.
   */
  public setColonia(colonia: string): void {
    this.update((state) => ({
      ...state,
      colonia, // Actualiza la propiedad 'colonia' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece la calle en el estado.
   * @param {string} calle La calle que se desea establecer en el estado.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle, // Actualiza la propiedad 'calle' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece el número exterior en el estado.
   * @param {string} exterior El número exterior que se desea establecer en el estado.
   */
  public setExterior(exterior: string): void {
    this.update((state) => ({
      ...state,
      exterior, // Actualiza la propiedad 'exterior' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece el número interior en el estado.
   * @param {string} interior El número interior que se desea establecer en el estado.
   */
  public setInterior(interior: string): void {
    this.update((state) => ({
      ...state,
      interior, // Actualiza la propiedad 'interior' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece la lada en el estado.
   * @param {string} lada La lada que se desea establecer en el estado.
   */
  public setLada(lada: string): void {
    this.update((state) => ({
      ...state,
      lada, // Actualiza la propiedad 'lada' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece el número de teléfono en el estado.
   * @param {string} telefono El número de teléfono que se desea establecer en el estado.
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono, // Actualiza la propiedad 'telefono' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece el correo electrónico en el estado.
   * @param {string} correoElectronico El correo electrónico que se desea establecer en el estado.
   */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      correoElectronico, // Actualiza la propiedad 'correoElectronico' con el valor proporcionado.
    }));
  }
  
  /**
   * Establece el número TIF en el estado.
   * @param {string} tif El número TIF que se desea establecer en el estado.
   */
  public setTif(tif: string): void {
    this.update((state) => ({
      ...state,
      tif,// Actualiza la propiedad 'tif' con el valor proporcionado.
    }));
  }
/**
   * Sets the "Fecha de elaboración" date in the state.
   * @param {string} fecha - The new date value.
   */
  setFechaDesde(fecha: string): void {
    this.update((state) => ({
      ...state,
      fechaDesde: fecha,
    }));
  }
/**
   * Sets the "Fecha de elaboración" date in the state.
   * @param {string} fecha - The new date value.
   */
  setFechaProduccion(fecha: string): void {
    this.update((state) => ({
      ...state,
      fechaProduccion: fecha,
    }));
  }
 
/**
   * Sets the "Fecha de elaboración" date in the state.
   * @param {string} fecha - The new date value.
   */
  setFechaElaboracion(fecha: string): void {
    this.update((state) => ({
      ...state,
      fechaElaboracion: fecha,
    }));
  }

  /**
   * Sets the "Fecha hasta" date in the state.
   * @param {string} fecha - The new date value.
   */
  setFechaHasta(fecha: string): void {
    this.update((state) => ({
      ...state,
      fechaHasta: fecha,
    }));
  }

  /**
   * Sets the "Fecha de caducidad" date in the state.
   * @param {string} fecha - The new date value.
   */
  setFechaCaducidad(fecha: string): void {
    this.update((state) => ({
      ...state,
      fechaCaducidad: fecha,
    }));
  }

  /**
   * Sets the "Fecha de caducidad" date in the state.
   * @param {string} fecha - The new date value.
   */
  setFechadeCaducidad(fecha: string): void {
    this.update((state) => ({
      ...state,
      fechadeCaducidad: fecha,
    }));
  }

/**
   * Sets the "Fecha de caducidad" date in the state.
   * @param {string} fecha - The new date value.
   */
  setFechadelCaducidad(fecha: string): void {
    this.update((state) => ({
      ...state,
      fechadelCaducidad: fecha,
    }));
  }

  /**
   * Sets the "Fecha de sacrificio" date in the state.
   * @param {string} fecha - The new date value.
   */
  setFechadeSacrificio(fecha: string): void {
    this.update((state) => ({
      ...state,
      FechadeSacrificio: fecha,
    }));
  }

  /**
   * Sets the "Fecha de sacrificio" date in the state.
   * @param {string} fecha - The new date value.
   */
  setFechadelSacrificio(fecha: string): void {
    this.update((state) => ({
      ...state,
      fechadelSacrificio: fecha,
    }));
  }

}