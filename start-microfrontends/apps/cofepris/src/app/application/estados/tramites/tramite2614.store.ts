import { Store, StoreConfig } from '@datorama/akita';
import { Destinatario } from '../../shared/constantes/shared2614/destinatario.enum';
import { InformaciondeProcedencia } from '../../shared/constantes/shared2614/informacion-de-procedencia.enum';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa el estado unificado de las Solicitudes 2614.
 * Combina los campos comunes de 261401 y 261402, soportando ambos tipos de destinatarios.
 */
export interface Solicitud2614State {
  /**
   * Observaciones relacionadas con la solicitud.
   */
  observaciones: string;

  /**
   * Lista de destinatarios asociados a la solicitud.
   * Puede ser Destinatario[] o InformaciondeProcedencia[] dependiendo del tipo de trámite.
   */
  destinatarioDatos: Destinatario[] | InformaciondeProcedencia[];

  /**
   * La clave de referencia asociada con la solicitud.
   */
  claveDeReferencia?: string;

  /**
   * La cadena de pago proporcionada por la dependencia.
   */
  cadenaPagoDependencia?: string;

  /**
   * La clave del banco utilizada para el pago.
   */
  bancoClave?: string;

  /**
   * La llave de pago única asociada con la transacción.
   */
  llaveDePago?: string;

  /**
   * La fecha en que se realizó el pago.
   */
  fecPago?: string;

  /**
   * El importe del pago realizado.
   */
  impPago?: string;

  /**
   * Tipo de persona (física o moral) asociada a la solicitud.
   * Puede ser 'fisica' o 'moral'.
   */
  tipoPersona?: string;

  /**
   * Nombre(s) de la persona física destinataria.
   */
  nombre?: string;

  /**
   * Primer apellido de la persona física destinataria.
   */
  primerApellido?: string;

  /**
   * Segundo apellido de la persona.
   */
  segundoApellido?: string;

  /**
   * País de residencia.
   */
  pais?: string;

  /**
   * Domicilio de la persona o entidad.
   */
  domicilio?: string;

  /**
   * Número exterior del domicilio.
   */
  numeroExterior?: string;

  /**
   * Número interior del domicilio.
   */
  numeroInterior?: string;

  /**
   * Correo electrónico de contacto.
   */
  correoElectronico?: string;

  /**
   * Estado o provincia de residencia.
   */
  estado?: string;

  /**
   * Código postal o equivalente del domicilio.
   */
  codigopostal?: string;

  /**
   * Calle del domicilio.
   */
  calle?: string;

  /**
   * Lada telefónica nacional o internacional.
   */
  lada?: number;

  /**
   * Número de teléfono de contacto.
   */
  telefono?: string;

  /**
   * Denominación o razón social de la persona moral.
   */
  denominacion?: string;
}

/**
 * Función para crear el estado inicial unificado de las Solicitudes 2614.
 * Retorna un objeto con los valores iniciales del estado.
 */
export function createInitialState(): Solicitud2614State {
  return {
    observaciones: '',
    destinatarioDatos: [],
    claveDeReferencia: '',
    cadenaPagoDependencia: '',
    bancoClave: '',
    llaveDePago: '',
    fecPago: '',
    impPago: '',
    tipoPersona: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    pais: '',
    domicilio: '',
    numeroExterior: '',
    numeroInterior: '',
    correoElectronico: '',
    estado: '',
    codigopostal: '',
    calle: '',
    lada: 0,
    telefono: '',
    denominacion: '',
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite2614', resettable: true })
export class Tramite2614Store extends Store<Solicitud2614State> {
  /**
   * Crea una instancia de Tramite2614Store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza la lista de destinatarios en el estado.
   * Param destinatarioDatos Lista de destinatarios a establecer.
   */
  public setDestinatarioDatos(destinatarioDatos: Destinatario[] | InformaciondeProcedencia[]): void {
    this.update((state) => ({
      ...state,
      destinatarioDatos,
    }));
  }

  /**
   * Actualiza el estado de la solicitud con los valores proporcionados.
   * Param valores Objeto parcial con los valores a actualizar.
   */
  public actualizarEstado(valores: Partial<Solicitud2614State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }

  /**
   * Resetea el estado a los valores iniciales.
   */
  public resetearEstado(): void {
    this.update(createInitialState());
  }
  
  /**
   * Obtiene el estado actual completo del store Tramite2614Store.
   * Puedes usar este método para acceder a todos los valores actuales del store.
   * @returns {Solicitud2614State} El estado actual del store.
   */
  public getStoreTableData(): Solicitud2614State {
      return this.getValue();
  }
  
}