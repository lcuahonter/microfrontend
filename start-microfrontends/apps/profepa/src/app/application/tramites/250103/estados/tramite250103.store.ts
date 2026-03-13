import { Detalle, Producto, TablaDatos} from '../models/embalaje-de-madera.models';
import { Store, StoreConfig } from '@datorama/akita';
import { CatalogoResponse } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';

/**
 * Estado del trámite con clave 250103. Contiene toda la información capturada
 * durante el proceso del trámite, incluyendo datos del destinatario, agente aduanal,
 * mercancía, y aspectos administrativos.
 */
export interface Tramite250103State {
  /** Tipo de movimiento seleccionado. */
  tipoMovimiento : string;
  /** Tipo de aduana seleccionada. */
  tipoAduana: CatalogoResponse | null;
  /** Tipo de inspectoría seleccionada. */
  tipoInspectoria: CatalogoResponse | null;
  /** Municipio correspondiente al trámite. */
  tipoMunicipio: CatalogoResponse | null;
  /** Denominación del destinatario. */
  destinatarioDenominacion: string;
  /** País del destinatario. */
  destinatarioPais: CatalogoResponse | null;
  /** Estado del destinatario. */
  destinatarioEstado: CatalogoResponse | null;
  /** Código postal del destinatario. */
  destinatarioCodigoPostal: string;
  /** Domicilio completo del destinatario. */
  destinatarioDomicilio: string;
  /** Ciudad del destinatario. */
  destinariociudad: string;
  /** Nombre del agente aduanal. */
  agenteAduanalNombre: string;
  /** Primer apellido del agente aduanal. */
  agenteAduanalPrimerApellido: string;
  /** Segundo apellido del agente aduanal. */
  agenteAduanalSegundoApellido: string;
  /** Número de patente del agente aduanal. */
  agenteAduanalPatente: string;
  /** Datos en tabla relacionados con el destinatario. */
  destinatarioRowData: TablaDatos[];
  /** Datos en tabla relacionados con el agente aduanal. */
  agenteAduanalRowData: TablaDatos[];
  /** Clave de identificación del trámite. */
  clave: string;
  /** Dependencia relacionada con el trámite. */
  dependencia: string;
  /** Banco relacionado al trámite o pago. */
  banco: string;
  /** Llave o folio del trámite. */
  llave: string;
  /** Fecha del trámite o captura. */
  fecha: string;
  /** Importe monetario relacionado. */
  importe: string;
  /** Documentos o elementos revisados. */
  revisados: string;
  /** Medio por el cual se realiza el trámite (ej. digital, físico). */
  medio: string;
  /** Tipo de identificación proporcionada. */
  identificacion: string;
  /** Número económico del vehículo. */
  economico: string;
  /** Placa del vehículo. */
  placa: string;
  /** Número del trámite o folio interno. */
  numero: string;
  /** Fechas adicionales relacionadas al trámite. */
  fechas: string;
  /** Requisitos solicitados o entregados. */
  requisito: string;
  /** Descripción general del trámite o mercancía. */
  descripcion: string;
  /** Fracción arancelaria de la mercancía. */
  fraccion: string;
  /** Descripción arancelaria. */
  arancelaria: string;
  /** Cantidad de mercancía. */
  cantidad: string;
  /** Unidad de medida de la mercancía. */
  medida: string;
  /** Género biológico de la especie. */
  genero: string;
  /** Especie biológica. */
  especie: string;
  /** Nombre común de la especie. */
  comun: string;
  /** Lugar de origen del producto. */
  origen: string;
  /** Lugar de procedencia del producto. */
  procedencia: string;
  /** Lista de productos agregados */
  productos: Producto[];
  /** Detalles de cada producto, almacenados como entradas de mapa */
  detalles: [number, Detalle[]][];
}


/**
 * Crea y retorna el estado inicial para el trámite 250103.
 *
 * Esta función se utiliza para inicializar todos los campos del estado
 * con valores por defecto (nulos, cadenas vacías o arreglos vacíos),
 * asegurando una estructura limpia para comenzar el flujo del trámite.
 *
 * @returns {Tramite250103State} Estado inicial del trámite.
 */
export function createInitialState(): Tramite250103State {
  return {
    /** Valor inicial para tipo de movimiento (sin seleccionar). */
    tipoMovimiento  :'',
    /** Valor inicial para tipo de aduana (sin seleccionar). */
    tipoAduana: null,
    /** Valor inicial para tipo de inspectoría (sin seleccionar). */
    tipoInspectoria: null,
    /** Valor inicial para municipio (sin seleccionar). */
    tipoMunicipio: null,
    /** Denominación del destinatario (vacía). */
    destinatarioDenominacion: '',
    /** País del destinatario (sin seleccionar). */
    destinatarioPais: null,
    /** Estado del destinatario (sin seleccionar). */
    destinatarioEstado: null,
    /** Código postal del destinatario (vacío). */
    destinatarioCodigoPostal: '',
    /** Domicilio del destinatario (vacío). */
    destinatarioDomicilio: '',
    /** Ciudad del destinatario (vacía). */
    destinariociudad: '',
    /** Nombre del agente aduanal (vacío). */
    agenteAduanalNombre: '',
    /** Primer apellido del agente aduanal (vacío). */
    agenteAduanalPrimerApellido: '',
    /** Segundo apellido del agente aduanal (vacío). */
    agenteAduanalSegundoApellido: '',
    /** Patente del agente aduanal (vacía). */
    agenteAduanalPatente: '',
    /** Lista vacía para los datos del destinatario en tabla. */
    destinatarioRowData: [],
    /** Lista vacía para los datos del agente aduanal en tabla. */
    agenteAduanalRowData: [],
    /** Clave del trámite (vacía). */
    clave: '',
    /** Dependencia relacionada (vacía). */
    dependencia: '',
    /** Banco relacionado (vacío). */
    banco: '',
    /** Llave única del trámite (vacía). */
    llave: '',
    /** Fecha del trámite (vacía). */
    fecha: '',
    /** Importe monetario (vacío). */
    importe: '',
    /** Elementos revisados (vacío). */
    revisados: '',
    /** Medio por el cual se realiza el trámite (vacío). */
    medio: '',
    /** Identificación proporcionada (vacía). */
    identificacion: '',
    /** Número económico del vehículo (vacío). */
    economico: '',
    /** Placa del vehículo (vacía). */
    placa: '',
    /** Número interno o folio (vacío). */
    numero: '',
    /** Fechas relacionadas (vacío). */
    fechas: '',
    /** Requisitos entregados o solicitados (vacío). */
    requisito: '',
    /** Descripción general (vacía). */
    descripcion: '',
    /** Fracción arancelaria (vacía). */
    fraccion: '',
    /** Descripción arancelaria (vacía). */
    arancelaria: '',
    /** Cantidad de mercancía (vacía). */
    cantidad: '',
    /** Unidad de medida (vacía). */
    medida: '',
    /** Género biológico (vacío). */
    genero: '',
    /** Especie biológica (vacía). */
    especie: '',
    /** Nombre común (vacío). */
    comun: '',
    /** País o región de origen (vacío). */
    origen: '',
    /** Lugar de procedencia (vacío). */
    procedencia: '',
     /** Lista vacía para los productos */
     productos: [],
     /** Lista vacía para los detalles de productos */
     detalles: [],
  };
}

/**
 * Store para gestionar el estado del trámite 250103.
 *
 * Este store utiliza Akita para manejar el estado de la aplicación,
 * permitiendo la gestión eficiente de datos y su persistencia.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite250103', resettable: true })
export class Tramite250103Store extends Store<Tramite250103State> {
  constructor() {
    super(createInitialState());
  }

  /**
 * @method establecerDatos
 * @description Actualiza el estado con los datos proporcionados.
 * @param datos Datos parciales para actualizar el estado del trámite.
 */
  public establecerDatos(datos: Partial<Tramite250103State>): void {
    this.update((state) => ({
      ...state,
      ...datos,
    }));
  }

  /**
 * @method establecerDestinatario
 * @description Establece la información de destinatarios en el estado del trámite.
 * @param destinatarioRowData Lista de datos de destinatarios que serán almacenados.
 */
  public establecerDestinatario(destinatarioRowData: TablaDatos[]): void {
      this.update((state) => ({ ...state, destinatarioRowData }));
    }

    /**
 * @method establecerAgenteAduanal
 * @description Establece la información de agentes aduanales en el estado del trámite.
 * @param agenteAduanalRowData Lista de datos de agentes aduanales que serán almacenados.
 */
  public establecerAgenteAduanal(agenteAduanalRowData: TablaDatos[]): void {
    this.update((state) => ({ ...state, agenteAduanalRowData }));
  }

  /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores a actualizar en el estado.
  */
  public actualizarEstado(valores: Partial<Tramite250103State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }

  /**
  * Restaura el estado inicial del store.
  */
 public resetStore(): void {
  this.reset();
 }

}



