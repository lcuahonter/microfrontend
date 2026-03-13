/**
 * @module TramiteStore
 * @description
 * Este servicio administra el estado de `TramiteState` utilizando Akita.
 */

import { DatosDeLaSolicitudInt, InternaDatosGeneralesInt } from '../modelos/acuicola.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de la modalidad de cambio.
 * @export
 * @interface TramiteState
 */
export interface TramiteState {
  /**
   * Estado de la solicitud.
   * @property {DatosDeLaSolicitudInt} SolicitudState
   */
  SolicitudState: DatosDeLaSolicitudInt;

  /**
   * Estado de los datos generales internos.
   * @property {InternaDatosGeneralesInt} InternaDatosGeneralesState
   */
  InternaDatosGeneralesState: InternaDatosGeneralesInt;

  /**
   * Clave de referencia del trámite.
   * @property {string} claveDeReferencia
   */
  claveDeReferencia: string;

  /**
   * Cadena de dependencia asociada al trámite.
   * @property {string} cadenaDependencia
   */
  cadenaDependencia: string;

  /**
   * Banco asociado al trámite.
   * @property {number} banco
   */
  banco: number;

  /**
   * Llave de pago del trámite.
   * @property {string} llaveDePago
   */
  llaveDePago: string;

  /**
   * Fecha de inicio del trámite.
   * @property {string} fechaInicio
   */
  fechaInicio: string;

  /**
   * Importe del pago del trámite.
   * @property {string} importeDePago
   */
  importeDePago: string;

  /**
   * Clave de referencia para la revisión.
   * @property {string} claveDeReferenciaRevision
   */
  claveDeReferenciaRevision: string;

  /**
   * Cadena de dependencia para la revisión.
   * @property {string} cadenaDependenciaRevision
   */
  cadenaDependenciaRevision: string;

  /**
   * Banco asociado a la revisión.
   * @property {string} bancoRevision
   */
  bancoRevision: string;

  /**
   * Llave de pago para la revisión.
   * @property {string} llaveDePagoRevision
   */
  llaveDePagoRevision: string;

  /**
   * Fecha de pago de derechos para la revisión.
   * @property {string} fechaPagoDeDerechosRevision
   */
  fechaPagoDeDerechosRevision: string;

  /**
   * Importe del pago de derechos para la revisión.
   * @property {string} importeDePagoRevision
   */
  importeDePagoRevision: string;

  /**
   * Justificación del trámite.
   * @property {string} justificacion
   */
  justificacion: string;

  /**
   * Certificados autorizados relacionados con el trámite.
   * @property {string} certificadosAutorizados
   */
  certificadosAutorizados: string;

  /**
   * Hora de inspección del trámite.
   * @property {string} horaDeInspeccion
   */
  horaDeInspeccion: string;

  /**
   * Identificador de la aduana de ingreso.
   * @property {number} aduanaDeIngreso
   */
  aduanaDeIngreso: number;

  /**
   * Nombre de la oficina de inspección.
   * @property {string} oficinaDeInspeccion
   */
  oficinaDeInspeccion: string;

  /**
   * Punto de inspección asociado al trámite.
   * @property {string} puntoDeInspeccion
   */
  puntoDeInspeccion: string;

  /**
   * Valor seleccionado en el trámite.
   * @property {string | null} valorSeleccionado
   */
  valorSeleccionado: string | null;

  /**
   * Nombre del inspector asignado.
   * @property {string} nombreInspector
   */
  nombreInspector: string;

  /**
   * Primer apellido del inspector.
   * @property {string} primerApellido
   */
  primerApellido: string;

  /**
   * Segundo apellido del inspector.
   * @property {string} segundoApellido
   */
  segundoApellido: string;

  /**
   * Cantidad de contenedores involucrados.
   * @property {number} cantidadContenedores
   */
  cantidadContenedores: number;

  /**
   * Tipo de contenedor utilizado.
   * @property {number} tipoContenedor
   */
  tipoContenedor: number;

  /**
   * Medio de transporte utilizado.
   * @property {string} medioDeTransporte
   */
  medioDeTransporte: string;

  /**
   * Identificación del transporte.
   * @property {string} identificacionTransporte
   */
  identificacionTransporte: string;

  /**
   * Indica si la solicitud está relacionada con transporte ferroviario.
   * @property {string} esSolicitudFerros
   */
  esSolicitudFerros: string;

  /**
   * Clave de referencia para los derechos.
   * @property {string} claveDeReferenciaDerechos
   */
  claveDeReferenciaDerechos: string;

  /**
   * Cadena de dependencia para los derechos.
   * @property {string} cadenaDependenciaDerechos
   */
  cadenaDependenciaDerechos: string;

  /**
   * Banco asociado a los derechos.
   * @property {string} bancoDerechos
   */
  bancoDerechos: string;

  /**
   * Llave de pago para los derechos.
   * @property {string} llaveDePagoDerechos
   */
  llaveDePagoDerechos: string;

  /**
   * Fecha de pago.
   * @property {string} fechaDePago
   */
  fechaDePago: string;

  /**
   * Importe del pago de derechos.
   * @property {string} importeDePagoDerechos
   */
  importeDePagoDerechos: string;

  /**
   * Indica si el trámite está exento de pago.
   * @property {string} exentoDePago
   */
  exentoDePago: string;

  /**
   * Fecha de inspección del trámite.
   * @property {string} fechaDeInspeccion
   */
  fechaDeInspeccion: string;

  /**
   * Fecha de pago de derechos.
   * @property {string} fechaPagoDeDerechos
   */
  fechaPagoDeDerechos: string;

  /**
   * Justificación del pago.
   * @property {string} pagoJustificacion
   */
  pagoJustificacion: string;

  /**
   * Fecha de pago de derechos.
   * @property {string} fechaPagoDerechos
   */
  fechaPagoDerechos: string;
}

/**
 * @function createInitialState
 * @description
 * Inicializa el estado con valores predeterminados.
 * @returns {TramiteState} Estado inicial.
 */
export function createInitialState(): TramiteState {
    return {
        /**
         * Estado de la solicitud.
         * @property {DatosDeLaSolicitudInt} SolicitudState
         */
        SolicitudState: {
            folioDelTramite: '',
            numeroDeGuia: '',
            numeroFerrocaril: '',
            justificacion: '',
            certificadosAutorizados: '',
            fechaInicio: '',
            horaDeInspeccion: '1',
            aduanaDeIngreso: '1',
            sanidadAgropecuaria: '1',
            puntoDeInspeccion: '1',
            nombreInspector: '',
            primerApellido: '',
            segundoApellido: '',
            cantidadContenedores: '',
            tipoContenedor: '',
            medioDeTransporte: '1',
            identificacionTransporte: '',
            esSolicitudFerros: '',
            banco: '',
            regimenAlQueDestina: '',
            nombreDeLaEmpresaTransportista: '',
            puntoDeVerificacion: '',
            identificacionDelTransporte: '',
            datosParaMovilizacion: '',
            oficinaDeInspeccion: '',
        },
        /**
         * Estado de los datos generales internos.
         * @property {InternaDatosGeneralesInt} InternaDatosGeneralesState
         */
        InternaDatosGeneralesState: {
            folioDelTramite: 0,
            aduanaIngreso: '',
            oficinaInspeccion: '',
            puntoInspeccion: '',
            claveUCON: '',
            establecimientoTIFs: '',
            nombreVeterinario: '',
            numeroGuia: '',
            regimen: '',
            capturaMercancia: '',
            animalesVivos: '',
            coordenadas: '',
            movilizacionNacional: '',
            identTransporte: '',
            puntoVerificacion: '',
            empresaTransportista: '',
            datosParaMovilizacion: '',
            puntoDeVerificacion: '',
            regimenAlQueDestina: ''
        },
        /**
         * Clave de referencia del trámite.
         * @property {string} claveDeReferencia
         */
        claveDeReferencia: '',
        /**
         * Cadena de dependencia asociada al trámite.
         * @property {string} cadenaDependencia
         */
        cadenaDependencia: '',
        /**
         * Banco asociado al trámite.
         * @property {number} banco
         */
        banco: 0,
        /**
         * Llave de pago del trámite.
         * @property {string} llaveDePago
         */
        llaveDePago: '',
        /**
         * Fecha de inicio del trámite.
         * @property {string} fechaInicio
         */
        fechaInicio: '',
        /**
         * Importe del pago del trámite.
         * @property {string} importeDePago
         */
        importeDePago: '',
        /**
         * Clave de referencia para la revisión.
         * @property {string} claveDeReferenciaRevision
         */
        claveDeReferenciaRevision: '',
        /**
         * Cadena de dependencia para la revisión.
         * @property {string} cadenaDependenciaRevision
         */
        cadenaDependenciaRevision: '',
        /**
         * Banco asociado a la revisión.
         * @property {string} bancoRevision
         */
        bancoRevision: '',
        /**
         * Llave de pago para la revisión.
         * @property {string} llaveDePagoRevision
         */
        llaveDePagoRevision: '',
        /**
         * Fecha de pago de derechos para la revisión.
         * @property {string} fechaPagoDeDerechosRevision
         */
        fechaPagoDeDerechosRevision: '',
        /**
         * Importe del pago de derechos para la revisión.
         * @property {string} importeDePagoRevision
         */
        importeDePagoRevision: '',
        /**
         * Justificación del trámite.
         * @property {string} justificacion
         */
        justificacion: '',
        /**
         * Certificados autorizados relacionados con el trámite.
         * @property {string} certificadosAutorizados
         */
        certificadosAutorizados: '',
        /**
         * Hora de inspección del trámite.
         * @property {string} horaDeInspeccion
         */
        horaDeInspeccion: '',
        /**
         * Identificador de la aduana de ingreso.
         * @property {number} aduanaDeIngreso
         */
        aduanaDeIngreso: 0,
        /**
         * Nombre de la oficina de inspección.
         * @property {string} oficinaDeInspeccion
         */
        oficinaDeInspeccion: '',
        /**
         * Punto de inspección asociado al trámite.
         * @property {string} puntoDeInspeccion
         */
        puntoDeInspeccion: '',
        /**
         * Nombre del inspector asignado.
         * @property {string} nombreInspector
         */
        nombreInspector: '',
        /**
         * Primer apellido del inspector.
         * @property {string} primerApellido
         */
        primerApellido: '',
        /**
         * Segundo apellido del inspector.
         * @property {string} segundoApellido
         */
        segundoApellido: '',
        /**
         * Cantidad de contenedores involucrados.
         * @property {number} cantidadContenedores
         */
        cantidadContenedores: 0,
        /**
         * Tipo de contenedor utilizado.
         * @property {number} tipoContenedor
         */
        tipoContenedor: 0,
        /**
         * Medio de transporte utilizado.
         * @property {string} medioDeTransporte
         */
        medioDeTransporte: '',
        /**
         * Identificación del transporte.
         * @property {string} identificacionTransporte
         */
        identificacionTransporte: '',
        /**
         * Indica si la solicitud está relacionada con transporte ferroviario.
         * @property {string} esSolicitudFerros
         */
        esSolicitudFerros: '',
        /**
         * Valor seleccionado en el trámite.
         * @property {string | null} valorSeleccionado
         */
        valorSeleccionado: null,
        /**
         * Clave de referencia para los derechos.
         * @property {string} claveDeReferenciaDerechos
         */
        claveDeReferenciaDerechos: '',
        /**
         * Cadena de dependencia para los derechos.
         * @property {string} cadenaDependenciaDerechos
         */
        cadenaDependenciaDerechos: '',
        /**
         * Banco asociado a los derechos.
         * @property {string} bancoDerechos
         */
        bancoDerechos: '',
        /**
         * Llave de pago para los derechos.
         * @property {string} llaveDePagoDerechos
         */
        llaveDePagoDerechos: '',
        /**
         * Fecha de pago.
         * @property {string} fechaDePago
         */
        fechaDePago: '',
        /**
         * Importe del pago de derechos.
         * @property {string} importeDePagoDerechos
         */
        importeDePagoDerechos: '',
        /**
         * Indica si el trámite está exento de pago.
         * @property {string} exentoDePago
         */
        exentoDePago: '',
        /**
         * Fecha de inspección del trámite.
         * @property {string} fechaDeInspeccion
         */
        fechaDeInspeccion: '',
        /**
         * Fecha de pago de derechos.
         * @property {string} fechaPagoDeDerechos
         */
        fechaPagoDeDerechos: '',
        /**
         * Justificación del pago.
         * @property {string} pagoJustificacion
         */
        pagoJustificacion: '',
        /**
         * Fecha de pago de derechos.
         * @property {string} fechaPagoDerechos
         */
        fechaPagoDerechos: '',
    };
}

/**
 * @class TramiteStore
 * @description
 * Administra el estado de la modalidad de cambio utilizando Akita.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'cambio-modalidad' })
export class TramiteStore extends Store<TramiteState> {
    constructor() {
        super(createInitialState());
    }

    /**
     * @method setSolicitudTramite
     * @description
     * Actualiza el estado de `SolicitudState` con nuevos valores.
     * @param {DatosDeLaSolicitudInt} SolicitudState - Datos del formulario de cambio de modalidad.
     */
    public setSolicitudTramite(SolicitudState: DatosDeLaSolicitudInt): void {
        this.update((state) => ({
            ...state,
            SolicitudState,
        }));
    }

    /**
     * @method setInternaDatosGeneralesTramite
     * @description
     * Actualiza el estado de `InternaDatosGeneralesState` con nuevos valores.
     * @param {InternaDatosGeneralesInt} InternaDatosGeneralesState - Datos del formulario de cambio de modalidad.
     */
    public setInternaDatosGeneralesTramite(InternaDatosGeneralesState: InternaDatosGeneralesInt): void {
        this.update((state) => ({
            ...state,
            InternaDatosGeneralesState,
        }));
    }

    /**
     * @method setClaveDeReferencia
     * @description
     * Actualiza el estado de `claveDeReferencia` con un nuevo valor.
     * @param {string} claveDeReferencia - Clave de referencia.
     */
    public setClaveDeReferencia(claveDeReferencia: string): void {
        this.update((state) => ({
            ...state,
            claveDeReferencia,
        }));
    }

    /**
     * @method setCadenaDependencia
     * @description
     * Actualiza el estado de `cadenaDependencia` con un nuevo valor.
     * @param {string} cadenaDependencia - Cadena de dependencia.
     */
    public setCadenaDependencia(cadenaDependencia: string): void {
        this.update((state) => ({
            ...state,
            cadenaDependencia,
        }));
    }

    /**
     * @method setBanco
     * @description
     * Actualiza el estado de `banco` con un nuevo valor.
     * @param {number} banco - Banco.
     */
    public setBanco(banco: number): void {
        this.update((state) => ({
            ...state,
            banco,
        }));
    }

    /**
     * @method setLlaveDePago
     * @description
     * Actualiza el estado de `llaveDePago` con un nuevo valor.
     * @param {string} llaveDePago - Llave de pago.
     */
    public setLlaveDePago(llaveDePago: string): void {
        this.update((state) => ({
            ...state,
            llaveDePago,
        }));
    }

    /**
     * @method setFechaInicio
     * @description
     * Actualiza el estado de `fechaInicio` con un nuevo valor.
     * @param {string} fechaInicio - Fecha de inicio.
     */
    public setFechaInicio(fechaInicio: string): void {
        this.update((state) => ({
            ...state,
            fechaInicio,
        }));
    }

    /**
     * @method setImporteDePago
     * @description
     * Actualiza el estado de `importeDePago` con un nuevo valor.
     * @param {string} importeDePago - Importe de pago.
     */
    public setImporteDePago(importeDePago: string): void {
        this.update((state) => ({
            ...state,
            importeDePago,
        }));
    }

    /**
     * @method setClaveDeReferenciaRevision
     * @description
     * Actualiza el estado de `claveDeReferenciaRevision` con un nuevo valor.
     * @param {string} claveDeReferenciaRevision - Clave de referencia de revisión.
     */
    public setClaveDeReferenciaRevision(claveDeReferenciaRevision: string): void {
        this.update((state) => ({
            ...state,
            claveDeReferenciaRevision,
        }));
    }

    /**
     * @method setCadenaDependenciaRevision
     * @description
     * Actualiza el estado de `cadenaDependenciaRevision` con un nuevo valor.
     * @param {string} cadenaDependenciaRevision - Cadena de dependencia de revisión.
     */
    public setCadenaDependenciaRevision(cadenaDependenciaRevision: string): void {
        this.update((state) => ({
            ...state,
            cadenaDependenciaRevision,
        }));
    }

    /**
     * @method setBancoRevision
     * @description
     * Actualiza el estado de `bancoRevision` con un nuevo valor.
     * @param {string} bancoRevision - Banco de revisión.
     */
    public setBancoRevision(bancoRevision: string): void {
        this.update((state) => ({
            ...state,
            bancoRevision,
        }));
    }

    /**
     * @method setLlaveDePagoRevision
     * @description
     * Actualiza el estado de `llaveDePagoRevision` con un nuevo valor.
     * @param {string} llaveDePagoRevision - Llave de pago de revisión.
     */
    public setLlaveDePagoRevision(llaveDePagoRevision: string): void {
        this.update((state) => ({
            ...state,
            llaveDePagoRevision,
        }));
    }

    /**
 * @method setFechaPagoDeDerechosRevision
 * @description
 * Actualiza el estado de `fechaPagoDeDerechosRevision` con un nuevo valor.
 * @param {string} fechaPagoDeDerechosRevision - Fecha de pago de derechos de revisión.
 */
public setFechaPagoDeDerechosRevision(fechaPagoDeDerechosRevision: string): void {
    this.update((state) => ({
        ...state,
        fechaPagoDeDerechosRevision,
    }));
}
    /**
     * @method setImporteDePagoRevision
     * @description
     * Actualiza el estado de `importeDePagoRevision` con un nuevo valor.
     * @param {string} importeDePagoRevision - Importe de pago de revisión.
     */
    public setImporteDePagoRevision(importeDePagoRevision: string): void {
        this.update((state) => ({
            ...state,
            importeDePagoRevision,
        }));
    }

    /**
     * @method setJustificacion
     * @description
     * Actualiza el estado de `justificacion` con un nuevo valor.
     * @param {string} justificacion - Justificación.
     */
    public setJustificacion(justificacion: string): void {
        this.update((state) => ({
            ...state,
            justificacion,
        }));
    }

    /**
     * @method setCertificadosAutorizados
     * @description
     * Actualiza el estado de `certificadosAutorizados` con un nuevo valor.
     * @param {string} certificadosAutorizados - Certificados autorizados.
     */
    public setCertificadosAutorizados(certificadosAutorizados: string): void {
        this.update((state) => ({
            ...state,
            certificadosAutorizados,
        }));
    }

    /**
     * @method setHoraDeInspeccion
     * @description
     * Actualiza el estado de `horaDeInspeccion` con un nuevo valor.
     * @param {string} horaDeInspeccion - Hora de inspección.
     */
    public setHoraDeInspeccion(horaDeInspeccion: string): void {
        this.update((state) => ({
            ...state,
            horaDeInspeccion,
        }));
    }

    /**
     * @method setAduanaDeIngreso
     * @description
     * Actualiza el estado de `aduanaDeIngreso` con un nuevo valor.
     * @param {number} aduanaDeIngreso - Aduana de ingreso.
     */
    public setAduanaDeIngreso(aduanaDeIngreso: number): void {
        this.update((state) => ({
            ...state,
            aduanaDeIngreso,
        }));
    }

    /**
     * @method setOficinaDeInspeccion
     * @description
     * Actualiza el estado de `oficinaDeInspeccion` con un nuevo valor.
     * @param {string} oficinaDeInspeccion - Oficina de inspección.
     */
    public setOficinaDeInspeccion(oficinaDeInspeccion: string): void {
        this.update((state) => ({
            ...state,
            oficinaDeInspeccion,
        }));
    }

    /**
     * @method setPuntoDeInspeccion
     * @description
     * Actualiza el estado de `puntoDeInspeccion` con un nuevo valor.
     * @param {string} puntoDeInspeccion - Punto de inspección.
     */
    public setPuntoDeInspeccion(puntoDeInspeccion: string): void {
        this.update((state) => ({
            ...state,
            puntoDeInspeccion,
        }));
    }

    /**
     * @method setNombreInspector
     * @description
     * Actualiza el estado de `nombreInspector` con un nuevo valor.
     * @param {string} nombreInspector - Nombre del inspector.
     */
    public setNombreInspector(nombreInspector: string): void {
        this.update((state) => ({
            ...state,
            nombreInspector,
        }));
    }

    /**
     * @method setPrimerApellido
     * @description
     * Actualiza el estado de `primerApellido` con un nuevo valor.
     * @param {string} primerApellido - Primer apellido.
     */
    public setPrimerApellido(primerApellido: string): void {
        this.update((state) => ({
            ...state,
            primerApellido,
        }));
    }

    /**
     * @method setSegundoApellido
     * @description
     * Actualiza el estado de `segundoApellido` con un nuevo valor.
     * @param {string} segundoApellido - Segundo apellido.
     */
    public setSegundoApellido(segundoApellido: string): void {
        this.update((state) => ({
            ...state,
            segundoApellido,
        }));
    }

    /**
     * @method setCantidadContenedores
     * @description
     * Actualiza el estado de `cantidadContenedores` con un nuevo valor.
     * @param {number} cantidadContenedores - Cantidad de contenedores.
     */
    public setCantidadContenedores(cantidadContenedores: number): void {
        this.update((state) => ({
            ...state,
            cantidadContenedores,
        }));
    }

    /**
     * @method setTipoContenedor
     * @description
     * Actualiza el estado de `tipoContenedor` con un nuevo valor.
     * @param {number} tipoContenedor - Tipo de contenedor.
     */
    public setTipoContenedor(tipoContenedor: number): void {
        this.update((state) => ({
            ...state,
            tipoContenedor,
        }));
    }

    /**
     * @method setMedioDeTransporte
     * @description
     * Actualiza el estado de `medioDeTransporte` con un nuevo valor.
     * @param {string} medioDeTransporte - Medio de transporte.
     */
    public setMedioDeTransporte(medioDeTransporte: string): void {
        this.update((state) => ({
            ...state,
            medioDeTransporte,
        }));
    }

    /**
     * @method setIdentificacionTransporte
     * @description
     * Actualiza el estado de `identificacionTransporte` con un nuevo valor.
     * @param {string} identificacionTransporte - Identificación del transporte.
     */
    public setIdentificacionTransporte(identificacionTransporte: string): void {
        this.update((state) => ({
            ...state,
            identificacionTransporte,
        }));
    }

    /**
     * @method setEsSolicitudFerros
     * @description
     * Actualiza el estado de `esSolicitudFerros` con un nuevo valor.
     * @param {string} esSolicitudFerros - Es solicitud ferros.
     */
    public setEsSolicitudFerros(esSolicitudFerros: string): void {
        this.update((state) => ({
            ...state,
            esSolicitudFerros,
        }));
    }

    /**
 * @method setValorSeleccionado
 * @description
 * Actualiza el estado de `valorSeleccionado` con un nuevo valor.
 * @param {string} valorSeleccionado - Valor seleccionado.
 */
public setValorSeleccionado(valorSeleccionado: string): void {
    this.update((state) => ({
        ...state,
        valorSeleccionado,
    }));
}

/**
 * @method setExentoDePago
 * @description
 * Actualiza el estado de `exentoDePago` con un nuevo valor.
 * @param {string} exentoDePago - Exento de pago.
 */
public setExentoDePago(exentoDePago: string): void {
    this.update((state) => ({
        ...state,
        exentoDePago,
    }));
}

/**
 * @method setFechaDeInspeccion
 * @description
 * Actualiza el estado de `fechaDeInspeccion` con un nuevo valor.
 * @param {string} fechaDeInspeccion - Fecha de inspección.
 */
public setFechaDeInspeccion(fechaDeInspeccion: string): void {
    this.update((state) => ({
        ...state,
        fechaDeInspeccion,
    }));
}

/**
 * @method setFechaDePago
 * @description
 * Actualiza el estado de `fechaDePago` con un nuevo valor.
 * @param {string} fechaDePago - Fecha de pago.
 */
public setFechaDePago(fechaDePago: string): void {
    this.update((state) => ({
        ...state,
        fechaDePago,
    }));
}

/**
 * @method setFechaPagoDeDerechos
 * @description
 * Actualiza el estado de `fechaPagoDeDerechos` con un nuevo valor.
 * @param {string} fechaPagoDeDerechos - Fecha de pago de derechos.
 */
public setFechaPagoDeDerechos(fechaPagoDeDerechos: string): void {
    this.update((state) => ({
        ...state,
        fechaPagoDeDerechos,
    }));
}

      
}