import { FormControl, FormGroup } from "@angular/forms"
import { FraccionesArancelariasOutput } from "./fracciones-arancelarias.model"
import { ListaSelect } from "../../core/models/certificados/configuracion/registrar/response/listaSelect"

/**
 * Representa la clasificación del subproducto dentro del formulario de cupo.
 *
 * @interface ClasificacionSubProducto
 *
 * @property {string} clasificacion - Tipo o categoría del subproducto.
 * @property {string} otro - Valor adicional cuando la clasificación es personalizada.
 */
export interface ClasificacionSubProducto {
    clasificacion: string;
    otro: string;
}

/**
 * Define los controles reactivos asociados a la clasificación del subproducto.
 *
 * @interface ClasificacionSubProductoControls
 *
 * @property {FormControl<string>} clasificacion - Control para la clasificación del subproducto.
 * @property {FormControl<string>} otro - Control para el campo de clasificación personalizada.
 */
export interface ClasificacionSubProductoControls {
    clasificacion: FormControl<string>;
    otro: FormControl<string>;
}

/**
 * Representa el modelo de datos del formulario de registro de cupo.
 *
 * Contiene toda la información requerida para la configuración
 * y registro de un cupo, incluyendo producto, montos, fracciones
 * arancelarias y vigencias.
 *
 * @interface FormCupo
 */
export interface FormCupo {
    /**
     * Instrumento asociado al cupo.
     */
    instrumento: string;

    /**
     * Clasificación del régimen (importación o exportación).
     */
    clasificacionRegimen: string;

    /**
     * Clasificación del subproducto.
     */
    clasificacionSubProducto: ClasificacionSubProducto;

    /**
     * Tratado o acuerdo comercial seleccionado.
     */
    tratadoAcuerdo: string;

    /**
     * Lista de tratados asociados al cupo.
     */
    listaTratados: ListaSelect[];

    /**
     * Producto seleccionado para el cupo.
     */
    producto: ProductoFormCupo;

    /**
     * Unidad de medida del producto.
     */
    unidadMedida: string;

    /**
     * Indica si la unidad de medida es de comercialización.
     */
    unidadMedidaComercializacion: boolean;

    /**
     * Información relacionada con los montos del cupo.
     */
    datosDelMonto: DatosDelMonto;

    /**
     * Lista de fracciones arancelarias asociadas al cupo.
     */
    fraccionesArancelarias: FraccionesArancelariasOutput[];

    /**
     * Fecha de inicio de vigencia del cupo.
     */
    vigenciaInicio: string;

    /**
     * Fecha de fin de vigencia del cupo.
     */
    vigenciaFin: string;

    /**
     * Fundamento legal del cupo.
     */
    fundamento: string;
}

/**
 * Define la estructura de controles reactivos del formulario de cupo.
 *
 * @interface FormCupoControls
 */
export interface FormCupoControls {
    instrumento: FormControl<string>;
    clasificacionRegimen: FormControl<string>;
    clasificacionSubProducto: FormGroup<ClasificacionSubProductoControls>;
    tratadoAcuerdo: FormControl<string>;
    listaTratados: FormControl<ListaSelect[]>;
    producto: FormControl<ProductoFormCupo>;
    unidadMedida: FormControl<string>;
    unidadMedidaComercializacion: FormControl<boolean>;
    datosDelMonto: FormControl<DatosDelMonto>;
    fraccionesArancelarias: FormControl<FraccionesArancelariasOutput[]>;
    vigenciaInicio: FormControl<string>;
    vigenciaFin: FormControl<string>;
    fundamento: FormControl<string>;
}

/**
 * Representa la información de un producto dentro del formulario de cupo.
 *
 * @interface ProductoFormCupo
 */
export interface ProductoFormCupo {
    /**
     * Identificador único del producto.
     */
    id: number;

    /**
     * Clave numérica del producto.
     */
    clave: number;

    /**
     * Nombre del producto.
     */
    nombre: string;

    /**
     * Descripción del producto.
     */
    descripcion: string;

    /**
     * Sigla o abreviatura del producto.
     */
    sigla: string;
}

/**
 * Representa la información de montos asociada a un cupo y subcupo.
 *
 * @interface DatosDelMonto
 */
export interface DatosDelMonto {
    /**
     * Monto total asignado al cupo.
     */
    montoTotalCupo: string;

    /**
     * Monto total asignado al subcupo.
     */
    montoTotalSubCupo: string;

    /**
     * Saldo expedido del cupo.
     */
    saldoExpedidoCupo: string;

    /**
     * Saldo ejercido del cupo.
     */
    saldoEjercidoCupo: string;

    /**
     * Saldo ejercido correspondiente a MCE.
     */
    saldoEjercidoMCE: string;

    /**
     * Saldo disponible del cupo.
     */
    saldoCupo: string;

    /**
     * Saldo disponible del subcupo.
     */
    saldoSubCupo: string;

    /**
     * Fundamento legal del cupo.
     */
    fundamentoCupo: string;

    /**
     * Fundamento legal del subcupo.
     */
    fundamentoSubCupo: string;
}

/**
 * Define los controles reactivos para el formulario de montos.
 *
 * @interface FormMontoControls
 */
export interface FormMontoControls {
    montoTotalCupo: FormControl<string>;
    montoTotalSubCupo: FormControl<string>;
    saldoExpedidoCupo: FormControl<string>;
    saldoEjercidoCupo: FormControl<string>;
    saldoEjercidoMCE: FormControl<string>;
    saldoCupo: FormControl<string>;
    saldoSubCupo: FormControl<string>;
    fundamentoCupo: FormControl<string>;
    fundamentoSubCupo: FormControl<string>;
}