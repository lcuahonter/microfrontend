import { DetalleSolicitudResponse, MercanciaTabla } from '../models/solicitud-pantallas.model';
import { DestinatarioForm } from '../../220203/models/220203/importacion-de-acuicultura.module';
import { Injectable } from '@angular/core';
import { PagoDeDerechos } from '../models/pago-de-derechos.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
import { TercerosrelacionadosdestinoTable } from '../../../shared/models/tercerosrelacionados.model';

/**
 * Interfaz que define la estructura del estado de la solicitud.
 */
export interface Solicitud220503State {
   id_solicitud: number; 
  certificadosAutorizados: number|string;
  horaDeInspeccion: number|string;
  aduanaDeIngreso: number|string;
  sanidadAgropecuaria: number|string;
  puntoDeInspeccion: number|string;
  fechaDeInspeccion: string;
  nombre: string;
  primerapellido: string;
  segundoapellido: string;
  mercancia: string;
  tipocontenedor: number|string;
  transporteIdMedio: number|string;
  identificacionTransporte: string;
  esSolicitudFerros: string | number;
  totalDeGuiasAmparadas: string;
  fetchapago: string;
  aduanaIngreso: number;
  oficinaInspeccion: number;
  puntoInspeccion: number;
  claveUCON: string;
  establecimientoTIF: string;
  numeroguia: string;
  regimen: number;
  movilizacion: number;
  transporte: string;
  punto: number;
  nombreEmpresa: number;
  foliodel: string;
  exentoPagoNo: number | string;
  justificacion: number | string;
  claveReferencia: string;
  cadenaDependencia: string;
  banco: number;
  llavePago: string;
  importePago: string;
  tercerosRelacionados: TercerosrelacionadosdestinoTable[]; 
  datosForma: DestinatarioForm[];
  selectedTerceros: TercerosrelacionadosdestinoTable;
  seletedExdora: DestinatarioForm;
  pagoDeDerechos:PagoDeDerechos;
   mercanciaLista: MercanciaTabla[]
}

/**
 * Función para crear el estado inicial de la solicitud.
 *
 * @returns Estado inicial de la solicitud.
 */
export function crearEstadoInicial(): Solicitud220503State {
  return {
    id_solicitud: 0,
    certificadosAutorizados: 0,
    horaDeInspeccion: 0,
    aduanaDeIngreso: 0,
    sanidadAgropecuaria: 0,
    puntoDeInspeccion: 0,
    fechaDeInspeccion: '',
    nombre: '',
    primerapellido: '',
    segundoapellido: '',
    mercancia: '',
    tipocontenedor: 0,
    transporteIdMedio: 0,
    identificacionTransporte: '',
    esSolicitudFerros: 'no',
    totalDeGuiasAmparadas: '',
    foliodel: '',
    aduanaIngreso: 0,
    oficinaInspeccion: 0,
    puntoInspeccion: 0,
    claveUCON: '',
    establecimientoTIF: '',
    numeroguia: '',
    regimen: 0,
    movilizacion: 0,
    transporte: '',
    punto: 0,
    nombreEmpresa: 0,
    fetchapago: '',
    exentoPagoNo: 0,
    justificacion: 0,
    claveReferencia: '',
    cadenaDependencia: '',
    banco: 0,
    llavePago: '',
    importePago: '',
    datosForma: [],
    tercerosRelacionados: [],
    selectedTerceros:{} as TercerosrelacionadosdestinoTable,
    seletedExdora: {} as DestinatarioForm,
    pagoDeDerechos: {} as PagoDeDerechos,
    mercanciaLista:[],
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'Solicitud220503Store', resettable: true })
export class Solicitud220503Store extends Store<Solicitud220503State> {
  /**
   * Constructor de la clase Solicitud220503Store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(crearEstadoInicial());
  }

  /**
   * Actualiza el número de certificados autorizados en el estado.
   *
   * @param certificadosAutorizados - Cantidad de certificados autorizados.
   */
  public setCertificadosAutorizados(certificadosAutorizados: number|string): void {
    this.update((state) => ({
      ...state,
      certificadosAutorizados,
    }));
  }

  /**
   * Actualiza la hora de inspección en el estado.
   *
   * @param horaDeInspeccion - Hora en la que se realizará la inspección.
   */
  public setHoraDeInspeccion(horaDeInspeccion: number|string): void {
    this.update((state) => ({
      ...state,
      horaDeInspeccion,
    }));
  }

  /**
   * Actualiza el código de la aduana de ingreso en el estado.
   *
   * @param aduanaDeIngreso - Código de la aduana de ingreso.
   */
  public setAduanaDeIngreso(aduanaDeIngreso: number|string): void {
    this.update((state) => ({
      ...state,
      aduanaDeIngreso,
    }));
  }

  /**
   * Actualiza el valor de sanidad agropecuaria en el estado.
   *
   * @param sanidadAgropecuaria - Valor de sanidad agropecuaria.
   */
  public setSanidadAgropecuaria(sanidadAgropecuaria: number|string): void {
    this.update((state) => ({
      ...state,
      sanidadAgropecuaria,
    }));
  }

  /**
   * Actualiza el punto de inspección en el estado.
   *
   * @param puntoDeInspeccion - Código del punto de inspección.
   */
  public setPuntoDeInspeccion(puntoDeInspeccion: number|string): void {
    this.update((state) => ({
      ...state,
      puntoDeInspeccion,
    }));
  }

  /**
   * Actualiza la fecha de inspección en el estado.
   *
   * @param fechaDeInspeccion - Fecha en la que se realizará la inspección.
   */
  public setFechaDeInspeccion(fechaDeInspeccion: string): void {
    this.update((state) => ({
      ...state,
      fechaDeInspeccion,
    }));
  }

  /**
   * Actualiza el nombre del solicitante en el estado.
   *
   * @param nombre - Nombre del solicitante.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }

  /**
   * Actualiza el primer apellido del solicitante en el estado.
   *
   * @param primerapellido - Primer apellido del solicitante.
   */
  public setPrimerapellido(primerapellido: string): void {
    this.update((state) => ({
      ...state,
      primerapellido,
    }));
  }

  /**
   * Actualiza el segundo apellido del solicitante en el estado.
   *
   * @param segundoapellido - Segundo apellido del solicitante.
   */
  public setSegundoapellido(segundoapellido: string): void {
    this.update((state) => ({
      ...state,
      segundoapellido,
    }));
  }

  /**
   * Actualiza la mercancía declarada en el estado.
   *
   * @param mercancia - Descripción de la mercancía.
   */
  public setMercancia(mercancia: string): void {
    this.update((state) => ({
      ...state,
      mercancia,
    }));
  }

  /**
   * Actualiza el tipo de contenedor en el estado.
   *
   * @param tipocontenedor - Código del tipo de contenedor.
   */
  public setTipocontenedor(tipocontenedor: number|string): void {
    this.update((state) => ({
      ...state,
      tipocontenedor,
    }));
  }

  /**
   * Actualiza el medio de transporte en el estado.
   *
   * @param transporteIdMedio - Identificador del medio de transporte.
   */
  public setTransporteIdMedio(transporteIdMedio: number|string): void {
    this.update((state) => ({
      ...state,
      transporteIdMedio,
    }));
  }

  /**
   * Actualiza la identificación del transporte en el estado.
   *
   * @param identificacionTransporte - Identificación del transporte.
   */
  public setIdentificacionTransporte(identificacionTransporte: string): void {
    this.update((state) => ({
      ...state,
      identificacionTransporte,
    }));
  }

  /**
   * Actualiza si la solicitud es ferroviaria en el estado.
   *
   * @param esSolicitudFerros - Indica si la solicitud está relacionada con transporte ferroviario.
   */
  public setEsSolicitudFerros(esSolicitudFerros: string | number): void {
    this.update((state) => ({
      ...state,
      esSolicitudFerros,
    }));
  }

  /**
   * Actualiza el total de guías amparadas en el estado.
   *
   * @param totalDeGuiasAmparadas - Cantidad total de guías amparadas.
   */
  public setTotalDeGuiasAmparadas(totalDeGuiasAmparadas: string): void {
    this.update((state) => ({
      ...state,
      totalDeGuiasAmparadas,
    }));
  }

  /**
   * Método para establecer el número de folio del trámite.
   *
   * @param foliodel - Cadena de texto que contiene el número de folio.
   */
  public setFoliodel(foliodel: string): void {
    this.update((state) => ({
      ...state,
      foliodel,
    }));
  }

  /**
   * Método para establecer el código de aduana de ingreso.
   *
   * @param aduanaIngreso - Número que representa la aduana de ingreso.
   */
  public setAduanaIngreso(aduanaIngreso: number): void {
    this.update((state) => ({
      ...state,
      aduanaIngreso,
    }));
  }

  /**
   * Método para establecer la oficina de inspección.
   *
   * @param oficinaInspeccion - Número que representa la oficina de inspección.
   */
  public setOficinaInspeccion(oficinaInspeccion: number): void {
    this.update((state) => ({
      ...state,
      oficinaInspeccion,
    }));
  }

  /**
   * Método para establecer el punto de inspección.
   *
   * @param puntoInspeccion - Número que representa el punto de inspección.
   */
  public setPuntoInspeccion(puntoInspeccion: number): void {
    this.update((state) => ({
      ...state,
      puntoInspeccion,
    }));
  }

  /**
   * Método para establecer la clave UCON.
   *
   * @param claveUCON - Cadena de texto con la clave UCON.
   */
  public setClaveUCON(claveUCON: string): void {
    this.update((state) => ({
      ...state,
      claveUCON,
    }));
  }

  /**
   * Método para establecer el establecimiento TIF.
   *
   * @param establecimientoTIF - Cadena de texto con el establecimiento TIF.
   */
  public setEstablecimientoTIF(establecimientoTIF: string): void {
    this.update((state) => ({
      ...state,
      establecimientoTIF,
    }));
  }

  /**
   * Método para establecer el número de guía.
   *
   * @param numeroguia - Cadena de texto con el número de guía.
   */
  public setNumeroguia(numeroguia: string): void {
    this.update((state) => ({
      ...state,
      numeroguia,
    }));
  }

  /**
   * Método para establecer el régimen del trámite.
   *
   * @param regimen - Número que representa el régimen.
   */
  public setRegimen(regimen: number): void {
    this.update((state) => ({
      ...state,
      regimen,
    }));
  }

  /**
   * Método para establecer el tipo de movilización.
   *
   * @param movilizacion - Número que representa la movilización.
   */
  public setMovilizacion(movilizacion: number): void {
    this.update((state) => ({
      ...state,
      movilizacion,
    }));
  }

  /**
   * Método para establecer el medio de transporte.
   *
   * @param transporte - Cadena de texto con el tipo de transporte.
   */
  public setTransporte(transporte: string): void {
    this.update((state) => ({
      ...state,
      transporte,
    }));
  }

  /**
   * Método para establecer el nombre de la empresa.
   *
   * @param nombreEmpresa - Número que representa el nombre de la empresa.
   */
  public setNombreEmpresa(nombreEmpresa: number): void {
    this.update((state) => ({
      ...state,
      nombreEmpresa,
    }));
  }

  /**
   * Método para establecer el punto de referencia.
   *
   * @param punto - Número que representa el punto de referencia.
   */
  public setPunto(punto: number): void {
    this.update((state) => ({
      ...state,
      punto,
    }));
  }

  /**
   * Método para establecer si el pago está exento o no.
   *
   * @param exentoPagoNo - Cadena de texto o número que representa la exención del pago.
   */
  public setExentoPagoNo(exentoPagoNo: string | number): void {
    this.update((state) => ({
      ...state,
      exentoPagoNo,
    }));
  }

  /**
   * Método para establecer la justificación del trámite.
   *
   * @param justificacion - Número o cadena de texto con la justificación.
   */
  public setJustificacion(justificacion: number | string): void {
    this.update((state) => ({
      ...state,
      justificacion,
    }));
  }

  /**
   * Método para establecer la clave de referencia.
   *
   * @param claveReferencia - Cadena de texto con la clave de referencia.
   */
  public setClaveReferencia(claveReferencia: string): void {
    this.update((state) => ({
      ...state,
      claveReferencia,
    }));
  }

  /**
   * Método para establecer la cadena de dependencia.
   *
   * @param cadenaDependencia - Cadena de texto con la dependencia.
   */
  public setCadenaDependencia(cadenaDependencia: string): void {
    this.update((state) => ({
      ...state,
      cadenaDependencia,
    }));
  }

  /**
   * Método para establecer el banco asociado al trámite.
   *
   * @param banco - Número que representa el banco.
   */
  public setBanco(banco: number): void {
    this.update((state) => ({
      ...state,
      banco,
    }));
  }

  /**
   * Método para establecer la llave de pago.
   *
   * @param llavePago - Cadena de texto con la llave de pago.
   */
  public setIlavePago(llavePago: string): void {
    this.update((state) => ({
      ...state,
      llavePago,
    }));
  }

  /**
   * Método para establecer el importe del pago.
   *
   * @param importePago - Cadena de texto con el importe del pago.
   */
  public setImportePago(importePago: string): void {
    this.update((state) => ({
      ...state,
      importePago,
    }));
  }

   /**
   * Método para actualizar el store con la lista de terceros relacionados.
   * Actualiza la información de las personas asociadas como terceros en el trámite.
   * Utilizado para gestionar destinatarios, importadores y otros terceros involucrados.
   * 
   * @public
   * @method updateTercerosRelacionados
   * @param {TercerosrelacionadosdestinoTable[]} tercerosRelacionados - Lista de personas terceros relacionadas
   * @memberof AcuiculturaStore
   * @returns {void}
   */
  public updateTercerosRelacionados(tercerosRelacionados: TercerosrelacionadosdestinoTable[]): void {
    this.update(state => ({
      ...state,
      tercerosRelacionados: tercerosRelacionados,
    }));
  }

  /**
   * Método para establecer la fecha de pago.
   *
   * @param fetchapago - Cadena de texto con la fecha de pago.
   */
  public setFetchaPago(fetchapago: string): void {
    this.update((state) => ({
      ...state,
      fetchapago,
    }));
  }
 /**
   * Método para actualizar los datos del formulario de destinatarios.
   * Actualiza la información específica de los destinatarios finales del trámite.
   * Utilizado para gestionar la lista de destinatarios y exportadores.
   * 
   * @public
   * @method updatedatosForma
   * @param {DestinatarioForm[]} tercerosRelacionados - Lista de formularios de destinatarios
   * @memberof AcuiculturaStore
   * @returns {void}
   */
  public updatedatosForma(tercerosRelacionados: DestinatarioForm[]): void {
    this.update(state => ({
      ...state,
      datosForma: tercerosRelacionados,
    }));
  }
     /**
  * Método para actualizar el destinatario exportador seleccionado en el store.
  * Establece el destinatario que está siendo editado o visualizado en el formulario.
  * Utilizado para mantener el estado del exportador seleccionado en modales y formularios.
  * 
  * @public
  * @method actualizarSelectedExdora
  * @param {DestinatarioForm} datosParaMovilizacionNacional - Datos del destinatario exportador seleccionado
  * @memberof AcuiculturaStore
  * @returns {void}
  */
  public actualizarSelectedExdora(datosParaMovilizacionNacional: DestinatarioForm): void {
    this.update(state => ({
      ...state,
      seletedExdora: datosParaMovilizacionNacional
    }));
  }
      /**
 * Método para actualizar el tercero relacionado seleccionado en el store.
 * Establece el tercero que está siendo editado o visualizado en el formulario.
 * Utilizado para mantener el estado del tercero seleccionado en modales y formularios.
 * 
 * @public
 * @method actualizarSelectedTerceros
 * @param {TercerosrelacionadosdestinoTable} datosParaMovilizacionNacional - Datos del tercero seleccionado
 * @memberof AcuiculturaStore
 * @returns {void}
 */
  public actualizarSelectedTerceros(datosParaMovilizacionNacional: TercerosrelacionadosdestinoTable): void {
    this.update(state => ({
      ...state,
      selectedTerceros: datosParaMovilizacionNacional as TercerosrelacionadosdestinoTable
    }));
  }
    /**
       * Método para actualizar el estado con la información del pago de derechos.
       * Actualiza la sección de pago de derechos en el estado global del store.
       * Utilizado cuando el usuario completa o modifica la información de pago.
       * 
       * @public
       * @method actualizarPagoDeDerechos
       * @param {PagoDeDerechos} pagoDeDerechos - Datos completos del formulario de pago de derechos
       * @memberof AcuiculturaStore
       * @returns {void}
       */
      public actualizarPagoDeDerechos(pagoDeDerechos: PagoDeDerechos): void {
          this.update(state => ({
              ...state,
              pagoDeDerechos: pagoDeDerechos,
          }));
      }

      public setIdSolicitud(id_solicitud: number): void {
  this.update((state) => ({
    ...state,
    id_solicitud,
  }));
}
  /**
   * Restaura el estado al valor inicial.
   */
  public limpiarSeccion(): void {
    this.reset();
  }

  /**
   * Actualiza el estado del Store con la información obtenida de la tabla de selección.
   * Este método mapea los datos del API (snake_case) al estado del Store (camelCase).
   * * @param datos Objeto de datos proveniente del API de detalle de solicitud.
   */
  public hydrateFromTableSelection(datos: DetalleSolicitudResponse): void {
    this.update((state) => ({
      ...state,
      // Identificador único de la solicitud
      id_solicitud: datos.id_solicitud,
      
      // Datos que disparan la reactividad en los formularios hijos
      certificadosAutorizados: datos.certificado,
      horaDeInspeccion: datos.hora_inspeccion,
      fechaDeInspeccion: datos.fecha_inspeccion,
      
      // Mapeo de datos específicos del certificado
      aduanaDeIngreso: datos.datos_certificado?.aduana_de_ingreso || 0,
      puntoDeInspeccion: datos.datos_certificado?.punto_de_inspeccion || 0,
      sanidadAgropecuaria: datos.datos_certificado?.ofic_de_insp_agro || 0,
      
      // Información de transporte
      transporte: datos.datos_certificado?.medio_de_transporte || '',
    }));
  }

  /**
   * Actualiza el estado con los datos básicos de una inspección física iniciada.
   * Utilizado para sincronizar el ID de solicitud y el certificado activo.
   * * @param datos Objeto simplificado con la información de la inspección.
   */
  public setInspeccionFisica(datos: {
    idSolicitud: number;
    certificado: string;
    fechaInspeccion: string;
    horaInspeccion: string;
    cantidadContenedores: number;
  }): void {
    this.update((state) => ({
      ...state,
      id_solicitud: datos.idSolicitud,
      certificadosAutorizados: datos.certificado,
      fechaDeInspeccion: datos.fechaInspeccion,
      horaDeInspeccion: datos.horaInspeccion,
      tipocontenedor: datos.cantidadContenedores // Mapeado según tu estructura de estado
    }));
  }

    /**
   * Actualiza la lista de mercancías en el estado.
   *
   * @param mercanciaLista - Nueva lista de mercancías.
   */
  public setMercanciaLista(
    mercanciaLista: MercanciaTabla[]
  ): void {
    this.update((state) => ({
      ...state,
      mercanciaLista,
    }))}
}
