import { DatosGrupos, createDatosGruposState } from '../models/permiso-importacion-modification.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * @Injectable
 * Marca esta clase como inyectable y disponible en el inyector raíz de Angular.
 * Esto permite que el store sea utilizado en cualquier parte de la aplicación.
 */
@Injectable({
    providedIn: 'root',
})

/**
 * @StoreConfig
 * Configuración del store de Akita.
 * 
 * @param name Nombre del store: 'seccion'.
 * @param resettable Indica si el store puede ser reseteado a su estado inicial: true.
 */
@StoreConfig({ name: 'seccion', resettable: true })

/**
 * Store principal para gestionar el estado del trámite de Permiso de Importación.
 *
 * Extiende de la clase Store de Akita y administra el estado reactivo de los datos agrupados del formulario,
 * permitiendo actualizar, limpiar y modificar secciones específicas del permiso de importación.
 *
 * Proporciona métodos para actualizar campos individuales o grupos de datos, así como para resetear el estado.
 *
 * @export
 * @class PermisoImportacionStore
 * @extends {Store<DatosGrupos>}
 */
export class PermisoImportacionStore extends Store<DatosGrupos> {
    /**
     * Inicializa el store con el estado inicial de los datos de grupos.
     */
    constructor() {
        super(createDatosGruposState());
    }

    /**
     * Actualiza el store con la información del solicitante.
     * @param params Datos agrupados del formulario.
     */
    public actualizarDatosGrupos(params: Partial<DatosGrupos>): void {
        this.update(state => ({
            ...state,
            ...params,
        }));
    }

    /**
     * Actualiza el valor de la entidad federativa.
     * @method setregimen
     * @description Actualiza el valor de la entidad federativa.
     * @param {string} entidadFederativa - Lista de entidades federativas.
     */


    public setregimen(regimen: string): void {
        this.update((state) => ({
            ...state,
            datosRealizer: {
                ...state.datosRealizer,
                regimen: regimen,
            }
        }));
    }

    /**
     * Actualiza el valor de la clasificación del régimen.
     * @method setclassificion_regimen
     * @description Actualiza el valor de la clasificación del régimen.
     * @param {string} classificion_regimen - Clasificación del régimen.
     */
    public setclassificion_regimen(classificion_regimen: string): void {
        this.update((state) => ({
            ...state,
            datosRealizer: {
                ...state.datosRealizer,
                classificion_regimen: classificion_regimen,
            }
        }));
    }

    /**
     * Actualiza el valor de la descripción.
     * @method setDescripcion
     * @description Actualiza el valor de la descripción.
     * @param {string} descripción - Descripción del régimen.
     */
    public setDescripcion(descripcion: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                descripcion: descripcion,
            }
        }));
    }


    /**
     * Actualiza el valor de la marca de la mercancía.
     * @method setmarca
     * @description Actualiza el valor de la marca de la mercancía.
     * @param {string} marca - Marca(s) comercial(es) y modelo(s).
     */
    public setMarca(marca: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                marca: marca,
            }
        }));
    }

    /**
     * Actualiza el tipo de aduana de entrada.
     * @method settipo_entrada
     * @description Actualiza el tipo de aduana de entrada.
     * @param {string} tipo_entrada - Tipo de aduana de entrada.
     */
    public setTipoEntrada(tipoEntrada: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                tipo_entrada: tipoEntrada,
            }
        }));
    }

    /**
     * Actualiza la fracción arancelaria.
     * @method setfraccion
     * @description Actualiza la fracción arancelaria.
     * @param {string} fraccion - Fracción arancelaria.
     */
    public setFraccion(fraccion: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                fraccion: fraccion,
            }
        }));
    }

    /**
     * Actualiza el valor de NICO.
     * @method setnico
     * @description Actualiza el valor de NICO.
     * @param {string} nico - NICO.
     */
    public setNico(nico: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                nico: nico,
            }
        }));
    }

    /**
     * Actualiza la unidad de medida la tarifa (UMT).
     * @method setumt
     * @description Actualiza la unidad de medida la tarifa (UMT).
     * @param {string} umt - Unidad de medida la tarifa.
     */
    public setUmt(umt: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                umt: umt,
            }
        }));
    }

    /**
     * Actualiza el número de factura.
     * @method setfactura_número
     * @description Actualiza el número de factura.
     * @param {string} factura_número - Número de factura.
     */
    public setFacturaNumero(factura_numero: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                factura_numero: factura_numero,
            }
        }));
    }

    /**
     * Actualiza la fecha de factura.
     * @method setfactura_fecha
     * @description Actualiza la fecha de factura.
     * @param {string} factura_fecha - Fecha de factura.
     */
    public setFacturaFecha(factura_fecha: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                factura_fecha: factura_fecha,
            }
        }));
    }

    /**
     * Actualiza la unidad de medida de comercialización (UMC).
     * @method setumc
     * @description Actualiza la unidad de medida de comercialización (UMC).
     * @param {string} umc - Unidad de medida de comercialización.
     */
    public setUmc(umc: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                umc: umc,
            }
        }));
    }

    /**
     * Actualiza el valor de otro UMC.
     * @method setotro_umc
     * @description Actualiza el valor de otro UMC.
     * @param {string} otro_umc - Otro UMC.
     */
    public setOtroUmc(otroUmc: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                otro_umc: otroUmc,
            }
        }));
    }

    /**
     * Actualiza la cantidad UMC.
     * @method setcantidad_umc
     * @description Actualiza la cantidad UMC.
     * @param {string} cantidad_umc - Cantidad UMC.
     */
    public setCantidadUmc(cantidad_umc: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                cantidad_umc: cantidad_umc,
            }
        }));
    }

    /**
     * Actualiza el factor de conversión.
     * @method setfactor_conversión
     * @description Actualiza el factor de conversión.
     * @param {string} factor_conversión - Factor de conversión.
     */
    public setFactorConversion(factor_conversion: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                factor_conversión: factor_conversion,
            }
        }));
    }

    /**
     * Actualiza la cantidad UMT.
     * @method setcantidad_umt
     * @description Actualiza la cantidad UMT.
     * @param {string} cantidad_umt - Cantidad UMT.
     */
    public setCantidadUmt(cantidad_umt: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                cantidad_umt: cantidad_umt,
            }
        }));
    }

    /**
     * Actualiza el valor de la factura de la mercancía a importar en términos de la Moneda de Comercialización.
     * @method setvalor_factura
     * @description Actualiza el valor de la factura de la mercancía a importar en términos de la Moneda de Comercialización.
     * @param {string} valor_factura - Valor de la factura.
     */
    public setValorFactura(valor_factura: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                valor_factura: valor_factura,
            }
        }));
    }

    /**
     * Actualiza la moneda de comercialización.
     * @method setmoneda_comercialización
     * @description Actualiza la moneda de comercialización.
     * @param {string} moneda_comercialización - Moneda de comercialización.
     */
    public setMonedaComercializacion(moneda_comercializacion: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                moneda_comercializacion: moneda_comercializacion,
            }
        }));
    }

    /**
     * Actualiza el valor de la factura en USD de la mercancía a importar.
     * @method setvalor_factura_usd
     * @description Actualiza el valor de la factura en USD de la mercancía a importar.
     * @param {string} valor_factura_usd - Valor de la factura en USD.
     */
    public setValorFacturaUsd(valor_factura_usd: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                valor_factura_usd: valor_factura_usd,
            }
        }));
    }

    /**
     * 
     * @method setprecio_unitario_usd
     * @description Actualiza el precio unitario en USD.
     * @param {string} precio_unitario_usd - Precio unitario en USD.
     */
    public setPrecioUnitarioUsd(precio_unitario_usd: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                precio_unitario_usd: precio_unitario_usd,
            }
        }));
    }

    /**
     * @method setpaís_exportador
     * @description Actualiza el país exportador.
     * @param {string} país_exportador - País exportador.
     */
    public setPaisExportador(pais_exportador: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                pais_exportador: pais_exportador,
            }
        }));
    }

    /**
     * @method setpaís_origen
     * @description Actualiza el país de origen.
     * @param {string} país_origen - País de origen.
     */
    public setPaisOrigen(pais_origen: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                pais_origen: pais_origen,
            }
        }));
    }

    /**
     * @method setvalor_total_factura
     * @description Actualiza el valor total de la factura en términos de la Moneda de Comercialización.
     * @param {string} valor_total_factura - Valor total de la factura.
     */
    public setValorTotalFactura(valor_total_factura: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                valor_total_factura: valor_total_factura,
            }
        }));
    }

    /**
     * @method setvalor_total_factura_usd
     * @description Actualiza el valor total de la factura USD de la mercancía a importar.
     * @param {string} valor_total_factura_usd - Valor total de la factura en USD.
     */
    public setValorTotalFacturaUsd(valor_total_factura_usd: string): void {
        this.update((state) => ({
            ...state,
            datosMercanica: {
                ...state.datosMercanica,
                valor_total_factura_usd: valor_total_factura_usd,
            }
        }));
    }

    /**
     * @method setNumero_documento
     * @description Actualiza el número de documento de exportación.
     * @param {string} número_documento - Número de documento.
     */
    public setNumero_documento(numero_documento: string): void {
        this.update((state) => ({
            ...state,
            datosExporta: {
                ...state.datosExporta,
                numero_documento: numero_documento,
            }
        }));
    }

    /**
     * @method setFecha_documento
     * @description Actualiza la fecha del documento de exportación.
     * @param {string} fecha_documento - Fecha del documento.
     */
    public setFecha_documento(fechaDocumento: string): void {
        this.update((state) => ({
            ...state,
            datosExporta: {
                ...state.datosExporta,
                fecha_documento: fechaDocumento,
            }
        }));
    }

    /**
     * @method setDescripcionExportacion
     * @description Actualiza la descripción de la mercancía de exportación.
     * @param {string} descripción - Descripción de la mercancía.
     */
    public setDescripcionExportacion(descripcionExportacion: string): void {
        this.update((state) => ({
            ...state,
            datosExporta: {
                ...state.datosExporta,
                descripcionExportacion: descripcionExportacion,
            }
        }));
    }

    /**
     * @method setCodigo_arancelario
     * @description Actualiza el código arancelario.
     * @param {string} código_arancelario - Código arancelario.
     */
    public setCodigo_arancelario(codigo_arancelario: string): void {
        this.update((state) => ({
            ...state,
            datosExporta: {
                ...state.datosExporta,
                codigo_arancelario: codigo_arancelario
            }
        }));
    }

    /**
     * @method setCantidad_umt
     * @description Actualiza la cantidad en la unidad de medida señalada.
     * @param {string} cantidad_umt - Cantidad UMT.
     */
    public setCantidad_umt(cantidad_umt: string): void {
        this.update((state) => ({
            ...state,
            datosExporta: {
                ...state.datosExporta,
                cantidad_umt: cantidad_umt,
            }
        }));
    }

    /**
     * @method setValor_usd
     * @description Actualiza el valor en USD de la mercancía a importar.
     * @param {string} valor_usd - Valor USD.
     */
    public setValor_usd(valor_usd: string): void {
        this.update((state) => ({
            ...state,
            datosExporta: {
                ...state.datosExporta,
                valor_usd: valor_usd,
            }
        }));
    }

    /**
     * @method setPrecio_unitario_usd
     * @description Actualiza el precio unitario en USD.
     * @param {string} precio_unitario_usd - Precio unitario USD.
     */
    public setPrecio_unitario_usd(precio_unitario_usd: string): void {
        this.update((state) => ({
            ...state,
            datosExporta: {
                ...state.datosExporta,
                precio_unitario_usd: precio_unitario_usd,
            }
        }));
    }

    /**
     * @method setPersona_tipo
     * @description Actualiza el tipo de persona.
     * @param {string} persona_tipo - Tipo de persona.
     */
    public setPersona_tipo(persona_tipo: string): void {
        this.update((state) => ({
            ...state,
            datosProductor: {
                ...state.datosProductor,
                persona_tipo: persona_tipo,
            }
        }));
    }

    /**
     * @method setPersonales_nombre
     * @description Actualiza el nombre de las personas.
     * @param {string} personales_nombre - Nombre(s) de la(s) persona(s).
     */
    public setPersonales_nombre(personales_nombre: string): void {
        this.update((state) => ({
            ...state,
            datosProductor: {
                ...state.datosProductor,
                personales_nombre,
            }
        }));
    }

    /**
     * @method setPrimer_apellido
     * @description Actualiza el primer apellido.
     * @param {string} primer_apellido - Primer apellido.
     */
    public setPrimer_apellido(primer_apellido: string): void {
        this.update((state) => ({
            ...state,
            datosProductor: {
                ...state.datosProductor,
                primer_apellido,
            }
        }));
    }

    /**
     * @method setSegundo_apellido
     * @description Actualiza el segundo apellido.
     * @param {string} segundo_apellido - Segundo apellido.
     */
    public setSegundo_apellido(segundo_apellido: string): void {
        this.update((state) => ({
            ...state,
            datosProductor: {
                ...state.datosProductor,
                segundo_apellido,
            }
        }));
    }

    /**
     * @method setDenominación_razón_social
     * @description Actualiza la denominación o razón social.
     * @param {string} denominación_razón_social - Denominación o razón social.
     */
    public setDenominacion_razon_social(denominacion_razon_social: string): void {
        this.update((state) => ({
            ...state,
            datosProductor: {
                ...state.datosProductor,
                denominacion_razon_social,
            }
        }));
    }

    /**
     * @method setDomicilio
     * @description Actualiza el domicilio.
     * @param {string} domicilio - Domicilio.
     */
    public setDomicilio(domicilio: string): void {
        this.update((state) => ({
            ...state,
            datosProductor: {
                ...state.datosProductor,
                domicilio,
            }
        }));
    }

    /**
     * @method setExportadorPersona_tipo
     * @description Actualiza el tipo de persona del exportador.
     * @param {string} persona_tipo - Tipo de persona.
     */
    public setExportadorPersona_tipo(persona_tipo: string): void {
        this.update((state) => ({
            ...state,
            datosExportador: {
                ...state.datosExportador,
                persona_tipo,
            }
        }));
    }

    /**
     * @method setExportadorPersonales_nombre
     * @description Actualiza el nombre de las personas del exportador.
     * @param {string} personales_nombre - Nombre(s) de la(s) persona(s).
     */
    public setExportadorPersonales_nombre(personales_nombre: string): void {
        this.update((state) => ({
            ...state,
            datosExportador: {
                ...state.datosExportador,
                personales_nombre,
            }
        }));
    }

    /**
     * @method setExportadorPrimer_apellido
     * @description Actualiza el primer apellido del exportador.
     * @param {string} primer_apellido - Primer apellido.
     */
    public setExportadorPrimer_apellido(primer_apellido: string): void {
        this.update((state) => ({
            ...state,
            datosExportador: {
                ...state.datosExportador,
                primer_apellido,
            }
        }));
    }

    /**
     * @method setExportadorSegundo_apellido
     * @description Actualiza el segundo apellido del exportador.
     * @param {string} segundo_apellido - Segundo apellido.
     */
    public setExportadorSegundo_apellido(segundo_apellido: string): void {
        this.update((state) => ({
            ...state,
            datosExportador: {
                ...state.datosExportador,
                segundo_apellido,
            }
        }));
    }

    /**
     * @method setExportadorDenominación_razón_social
     * @description Actualiza la denominación o razón social del exportador.
     * @param {string} denominación_razón_social - Denominación o razón social.
     */
    public setExportadorDenominacion_razon_social(denominacion_razon_social_exportador: string): void {
        this.update((state) => ({
            ...state,
            datosExportador: {
                ...state.datosExportador,
                denominacion_razon_social_exportador: denominacion_razon_social_exportador,
            }
        }));
    }

    /**
     * @method setExportadorDomicilio
     * @description Actualiza el domicilio del exportador.
     * @param {string} domicilio - Domicilio.
     */
    public setExportadorDomicilio(domicilio: string): void {
        this.update((state) => ({
            ...state,
            datosExportador: {
                ...state.datosExportador,
                domicilio,
            }
        }));
    }

    /**
     * @method setExportadorObservaciones
     * @description Actualiza las observaciones del exportador.
     * @param {string} observaciones - Observaciones.
     */
    public setExportadorObservaciones(observaciones: string): void {
        this.update((state) => ({
            ...state,
            datosExportador: {
                ...state.datosExportador,
                observaciones,
            }
        }));
    }

    /**
     * @description Resets the store to its initial state.
     */
    public limpiarFormulario(): void {
        this.reset();
    }

    /**
     * Actualiza la entidad federativa en el estado federal.
     * @param entidad_federativa Nombre de la entidad federativa.
     */
    public setEntidad_federativa(entidad_federativa: string): void {
        this.update((state) => ({
            ...state,
            datosFederal: {
                ...state.datosFederal,
                entidad_federativa,
            }
        }));
    }

    /**
     * Actualiza la representación federal en el estado federal.
     * @param representacion_federal Nombre de la representación federal.
     */
    public setRepresentacion_federal(representacion_federal: string): void {
        this.update((state) => ({
            ...state,
            datosFederal: {
                ...state.datosFederal,
                representacion_federal,
            }
        }));
    }

    /**
     * Actualiza la descripción de la representación federal en el estado federal.
     * @param descripcion_representacion_federal Descripción de la representación federal.
     */
    public setDescripcion_representacion_federal(descripcion_representacion_federal: string): void {
        this.update((state) => ({
            ...state,
            datosFederal: {
                ...state.datosFederal,
                descripcion_representacion_federal,
            }
        }));
    }
}
