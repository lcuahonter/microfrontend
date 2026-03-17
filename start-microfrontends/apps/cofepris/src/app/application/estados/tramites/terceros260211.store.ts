import { Store, StoreConfig } from '@datorama/akita';
import { FabricanteDatos } from '../../tramites/260211/models/permiso-sanitario.enum';
import { Injectable } from '@angular/core';

/**
 * Interface que representa el estado de la solicitud para el trámite 90201.
 * Este estado contiene la información relacionada con los datos de la solicitud.
 * @interface Terceros260211State
 */
export interface Terceros260211State {
  tercerosNacionalidad: string;
  tipoPersona: string;
  rfc: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  curp: string;
  denominacionRazonSocial: string;
  pais: string;
  estadoLocalidad: string;
  municipioAlcaldia: string;
  localidad: string;
  codigoPostaloEquivalente: string;
  colonia: string;
  extranjeroEstado: string;
  extranjeroCodigo: string;
  extranjeroColonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  lada: string;
  telefono: string;
  correoElectronico: string;
  coloniaoEquivalente: string;
  coloniaoEquivalenteLabel: string;
  codigoPostaloEquivalentes: string;
  estado: string;
  entidadFederativa: string;
  Fabricantes: FabricanteDatos[];
  Proveedores: FabricanteDatos[];
  Facturadores: FabricanteDatos[];
  Destinatarios: FabricanteDatos[];
    
    }
/**
 * Función para crear el estado inicial de la solicitud.
 * @returns {Terceros260211State} El estado inicial con valores vacíos para cada propiedad.
 */
export function createInitialState(): Terceros260211State {
  return {
     tercerosNacionalidad: '',
    tipoPersona: '',
    rfc: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    curp: '',
    denominacionRazonSocial: '',
    pais: '',
    estadoLocalidad: '',
    municipioAlcaldia: '',
    localidad: '',
    codigoPostaloEquivalente: '',
    colonia: '',
    extranjeroEstado: '',
    extranjeroCodigo: '',
    extranjeroColonia: '',
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    lada: '',
    telefono: '',
    correoElectronico: '',
    coloniaoEquivalente: '',
    coloniaoEquivalenteLabel: '',
    codigoPostaloEquivalentes: '',
    estado: '',
    entidadFederativa: '',
    Fabricantes: [],
     Destinatarios: [],
    Proveedores: [],
    Facturadores: []
    };
}

/**
 * Store para la gestión del estado de la solicitud del trámite 221601.
 * Utiliza Akita para la gestión de estado y permite actualizar los valores relacionados con el trámite.
 * @class Terceros260211Store
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'Terceros260211Store', resettable: true })
export class Terceros260211Store extends Store<Terceros260211State> {
  /**
   * Constructor del store que inicializa el estado con el estado inicial creado.
   */
  constructor() {
    super(createInitialState());

  }
    /**
 * Actualiza la lista de fabricantes en el estado del store.
 * @param fabricantes - Arreglo de objetos FabricanteDatos que se almacenarán en el store.
 */
public setFabricantes(fabricantes: FabricanteDatos[]): void {
  this.update((state) => ({
      ...state,
      Fabricantes: fabricantes,
    }));
}
/**
 * Actualiza la lista de proveedores en el estado del store.
 * @param proveedores - Arreglo de objetos FabricanteDatos que se almacenarán en el store.
 */
public setProveedors(proveedores: FabricanteDatos[]): void {
   this.update((state) => ({
      ...state,
      Proveedores: proveedores,
    }));
}

/**
 * Actualiza la lista de facturadores en el estado del store.
 * @param facturadores - Arreglo de objetos FabricanteDatos que se almacenarán en el store.
 */
public setFacturadors(facturadores: FabricanteDatos[]): void {
  this.update((state) => ({
      ...state,
      Facturadores: facturadores,
    }));
}

/**
 * Actualiza la lista de destinatarios en el estado del store.
 * @param destinatarios - Arreglo de objetos FabricanteDatos que se almacenarán en el store.
 */
public setDestinatarios(destinatarios: FabricanteDatos[]): void {
  this.update((state) => ({
      ...state,
      Destinatarios: destinatarios,
    }));
}
 /**
 * Actualiza el estado con el valor proporcionado.
 * Se utiliza para definir la entidad estatal seleccionada.
 */
public setEstado(estado: string): void {
  this.update(state => ({
    ...state,
    estado,
  }));
}

/**
 * Establece la entidad federativa en el estado.
 * Representa una división política del país.
 */
public setEntidadFederativa(entidadFederativa: string): void {
  this.update(state => ({
    ...state,
    entidadFederativa,
  }));
}

/**
 * Define la nacionalidad del tercero.
 * Puede ser nacional o extranjero.
 */
public setTercerosNacionalidad(tercerosNacionalidad: string): void {
  this.update(state => ({
    ...state,
    tercerosNacionalidad,
  }));
}

/**
 * Establece el tipo de persona (física o moral).
 * Afecta los campos visibles del formulario.
 */
public setTipoPersona(tipoPersona: string): void {
  this.update(state => ({
    ...state,
    tipoPersona,
  }));
}

/**
 * Asigna el RFC del tercero al estado.
 * Campo obligatorio para identificar la entidad.
 */
public setRfc(rfc: string): void {
  this.update(state => ({
    ...state,
    rfc,
  }));
}

/**
 * Actualiza el nombre del tercero en el estado.
 * Solo aplica para personas físicas.
 */
public setNombre(nombre: string): void {
  this.update(state => ({
    ...state,
    nombre,
  }));
}

/**
 * Define el primer apellido del tercero.
 * Campo requerido para personas físicas.
 */
public setPrimerApellido(primerApellido: string): void {
  this.update(state => ({
    ...state,
    primerApellido,
  }));
}

/**
 * Define el segundo apellido del tercero.
 * Es un campo opcional para personas físicas.
 */
public setSegundoApellido(segundoApellido: string): void {
  this.update(state => ({
    ...state,
    segundoApellido,
  }));
}

/**
 * Establece el CURP del tercero.
 * Útil para validar identidad en México.
 */
public setCurp(curp: string): void {
  this.update(state => ({
    ...state,
    curp,
  }));
}

/**
 * Asigna la razón social o denominación.
 * Campo obligatorio para personas morales.
 */
public setDenominacionRazonSocial(denominacionRazonSocial: string): void {
  this.update(state => ({
    ...state,
    denominacionRazonSocial,
  }));
}

/**
 * Establece el país seleccionado.
 * Se utiliza para clasificar la ubicación del tercero.
 */
public setPais(pais: string): void {
  this.update(state => ({
    ...state,
    pais,
  }));
}

/**
 * Define el estado o provincia local.
 * Aplica a ubicaciones detalladas dentro del país.
 */
public setEstadoLocalidad(estadoLocalidad: string): void {
  this.update(state => ({
    ...state,
    estadoLocalidad,
  }));
}

/**
 * Establece el municipio o alcaldía.
 * Campo requerido para la dirección completa.
 */
public setMunicipioAlcaldia(municipioAlcaldia: string): void {
  this.update(state => ({
    ...state,
    municipioAlcaldia,
  }));
}


/**
 * Establece la localidad del tercero.
 * Forma parte de la dirección completa.
 */
public setLocalidad(localidad: string): void {
  this.update(state => ({
    ...state,
    localidad,
  }));
}

/**
 * Asigna el código postal o equivalente.
 * Puede ser nacional o internacional.
 */
public setCodigoPostaloEquivalente(codigoPostaloEquivalente: string): void {
  this.update(state => ({
    ...state,
    codigoPostaloEquivalente,
  }));
}

/**
 * Establece la colonia del tercero.
 * Campo relevante para direcciones mexicanas.
 */
public setColonia(colonia: string): void {
  this.update(state => ({
    ...state,
    colonia,
  }));
}

/**
 * Define el estado extranjero si aplica.
 * Usado solo cuando el país no es México.
 */
public setExtranjeroEstado(extranjeroEstado: string): void {
  this.update(state => ({
    ...state,
    extranjeroEstado,
  }));
}

/**
 * Establece el código postal extranjero.
 * Campo requerido para direcciones internacionales.
 */
public setExtranjeroCodigo(extranjeroCodigo: string): void {
  this.update(state => ({
    ...state,
    extranjeroCodigo,
  }));
}

/**
 * Asigna la colonia extranjera del tercero.
 * Aplica solo para domicilios fuera de México.
 */
public setExtranjeroColonia(extranjeroColonia: string): void {
  this.update(state => ({
    ...state,
    extranjeroColonia,
  }));
}

/**
 * Establece el nombre de la calle.
 * Parte esencial de la dirección.
 */
public setCalle(calle: string): void {
  this.update(state => ({
    ...state,
    calle,
  }));
}

/**
 * Asigna el número exterior del domicilio.
 * Campo obligatorio en direcciones postales.
 */
public setNumeroExterior(numeroExterior: string): void {
  this.update(state => ({
    ...state,
    numeroExterior,
  }));
}

/**
 * Establece el número interior del domicilio.
 * Campo opcional para edificios o unidades.
 */
public setNumeroInterior(numeroInterior: string): void {
  this.update(state => ({
    ...state,
    numeroInterior,
  }));
}
/**
 * Establece la lada telefónica del tercero.
 * Normalmente corresponde a la región del país.
 */
public setLada(lada: string): void {
  this.update(state => ({
    ...state,
    lada,
  }));
}

/**
 * Asigna el número telefónico del tercero.
 * Se utiliza para contacto directo.
 */
public setTelefono(telefono: string): void {
  this.update(state => ({
    ...state,
    telefono,
  }));
}

/**
 * Establece el correo electrónico del tercero.
 * Es usado para notificaciones o contacto.
 */
public setCorreoElectronico(correoElectronico: string): void {
  this.update(state => ({
    ...state,
    correoElectronico,
  }));
}

/**
 * Define la colonia o equivalente del domicilio.
 * Utilizado cuando no se puede usar una colonia estándar.
 */
public setColoniaoEquivalente(coloniaoEquivalente: string): void {
  this.update(state => ({
    ...state,
    coloniaoEquivalente,
  }));
}

/**
 * Establece la etiqueta legible de la colonia equivalente.
 * Aparece en visualizaciones o reportes.
 */
public setColoniaoEquivalenteLabel(coloniaoEquivalenteLabel: string): void {
  this.update(state => ({
    ...state,
    coloniaoEquivalenteLabel,
  }));
}

/**
 * Asigna el código postal alternativo o equivalente.
 * Aplica en contextos especiales o internacionales.
 */
public setCodigoPostaloEquivalentes(codigoPostaloEquivalentes: string): void {
  this.update(state => ({
    ...state,
    codigoPostaloEquivalentes,
  }));
}

}