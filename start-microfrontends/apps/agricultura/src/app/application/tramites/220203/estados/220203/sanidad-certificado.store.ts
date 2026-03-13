import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';

import { Acuicultura, Consulta, DestinatarioForm, FilaSolicitud, FormularioMovilizacion, PagoDeDerechos, RealizarGroup, createDatosState } from '../../models/220203/importacion-de-acuicultura.module';
import { TercerosrelacionadosdestinoTable } from '../../../../shared/models/tercerosrelacionados.model';

/**
 * @fileoverview
 * Store Akita para la gestión del estado de importación de acuicultura 220203.
 * Permite almacenar, actualizar y limpiar la información capturada en los formularios del trámite.
 * Cobertura de documentación completa: cada clase, método, propiedad y constructor está documentado en español.
 * @module AcuiculturaStore
 */

/**
 * Store Akita para la gestión del estado del trámite de importación de acuicultura 220203.
 * Proporciona métodos para almacenar, actualizar y limpiar la información capturada en los formularios.
 * Maneja el estado global de la aplicación para datos de mercancía, terceros, pagos y movilización.
 * 
 * @class AcuiculturaStore
 * @extends {Store<Acuicultura>}
 * @memberof AcuiculturaStore
 */
@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'importacion-de-acuicultura', resettable: true })
export class AcuiculturaStore extends Store<Acuicultura> {
    /**
     * Constructor del store AcuiculturaStore.
     * Inicializa el estado con los valores por defecto utilizando la función createDatosState().
     * Configura el store con el estado inicial necesario para el trámite de importación de acuicultura.
     * 
     * @constructor
     * @memberof AcuiculturaStore
     */
    constructor() {
        super(createDatosState());
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

    /**
     * Método para actualizar únicamente el grupo de realizar en el estado.
     * Actualiza la información específica del grupo de operaciones a realizar.
     * Utilizado para gestionar las acciones y operaciones del trámite.
     * 
     * @public
     * @method actualizarSoloRealizarGroup
     * @param {RealizarGroup} realizarGroup - Datos del grupo de operaciones a realizar
     * @memberof AcuiculturaStore
     * @returns {void}
     */
    public actualizarSoloRealizarGroup(realizarGroup: RealizarGroup): void {
        this.update(state => ({
            ...state,
            realizarGroup: realizarGroup,
        }));
    }

    /**
     * Método para actualizar el estado con la información del formulario de movilización.
     * Actualiza los datos relacionados con el transporte y movilización de mercancía.
     * Incluye información de puntos de verificación, transporte y rutas.
     * 
     * @public
     * @method actualizarFormularioMovilizacion
     * @param {FormularioMovilizacion} formularioMovilizacion - Datos completos del formulario de movilización
     * @memberof AcuiculturaStore
     * @returns {void}
     */
    public actualizarFormularioMovilizacion(formularioMovilizacion: FormularioMovilizacion): void {
        this.update(state => ({
            ...state,
            formularioMovilizacion,
        }));
    }

    /**
     * Método para actualizar el estado con la información de los datos de mercancía.
     * Actualiza el grupo de operaciones relacionadas con los datos de mercancía.
     * Utilizado para gestionar la información específica de los productos a importar.
     * 
     * @public
     * @method actualizarDatosMercancia
     * @param {RealizarGroup} realizarGroup - Datos del grupo de operaciones de mercancía
     * @memberof AcuiculturaStore
     * @returns {void}
     */
    public actualizarDatosMercancia(realizarGroup: RealizarGroup): void {
        this.update(state => ({
            ...state,
            realizarGroup
        }));
    }


    /**
     * Método para actualizar el estado con la información de la consulta.
     * Establece el estado de consulta para controlar el modo de solo lectura y permisos.
     * Utilizado para determinar si el formulario debe mostrarse en modo de consulta.
     * 
     * @public
     * @method setConsultaioState
     * @param {Consulta} consulta - Datos del estado de consulta del trámite
     * @memberof AcuiculturaStore
     * @returns {void}
     */
    public setConsultaioState(consulta: Consulta): void {
        this.update(state => ({
            ...state,
            consulta
        }));
    }

    /**
     * Método para actualizar el grupo de mercancía en el estado.
     * Actualiza la información de las filas de mercancía capturadas en el formulario.
     * Utilizado para gestionar la lista de productos y sus características.
     * 
     * @public
     * @method actualizarMercanciaGroup
     * @param {FilaSolicitud[]} mercanciaGroup - Arreglo de filas con información de mercancía
     * @memberof AcuiculturaStore
     * @returns {void}
     */
    public actualizarMercanciaGroup(mercanciaGroup: FilaSolicitud[]): void {
        this.update(state => ({
            ...state,
            mercanciaGroup: mercanciaGroup,
          selectedmercanciaGroupDatos: null
        }));
  }


  /**
   * Método para actualizar el grupo de mercancía en el estado.
   * Actualiza la información de las filas de mercancía capturadas en el formulario.
   * Utilizado para gestionar la lista de productos y sus características.
   * 
   * @public
   * @method actualizarMercanciaGroup
   * @param {FilaSolicitud[]} mercanciaGroup - Arreglo de filas con información de mercancía
   * @memberof AcuiculturaStore
   * @returns {void}
   */
  public actualizarMercanciaSelected(mercanciaGroup: FilaSolicitud[]): void {
    this.update(state => ({
      ...state,
      mercanciaGroup: mercanciaGroup,
        }));
    }
    async actualizarTodoElEstado(datos: Acuicultura): Promise<void> {
  await this.update(state => ({
    ...state,
    pagoDeDerechos: datos.pagoDeDerechos,
    formularioMovilizacion: datos.formularioMovilizacion,
    realizarGroup: datos.realizarGroup,
    mercanciaGroup: datos.mercanciaGroup,
    tercerosRelacionados: datos.tercerosRelacionados,
    datosForma: datos.datosForma
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
      selectedTerceros: datosParaMovilizacionNacional
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
     * Método para restablecer el estado del store a su estado inicial.
     * Limpia toda la información capturada y restablece los valores por defecto.
     * Utilizado para reiniciar el formulario completo o limpiar datos de sesiones anteriores.
     * 
     * @public
     * @method limpiarFormulario
     * @memberof AcuiculturaStore
     * @returns {void}
     */
    public limpiarFormulario(): void {
        this.reset();
    }
}