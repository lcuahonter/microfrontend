import { Store, StoreConfig } from '@datorama/akita';
import { EstadoFormularioResiduo } from '../../models/datos-residuos.model';
import { Injectable } from '@angular/core';

/**
 * Crea y retorna el estado inicial para el formulario de residuo con valores por defecto.
 *
 * Los campos del formulario `formularioDatos` y `formularioResiduo` son inicializados como cadenas vacías.
 *
 * @returns {EstadoFormularioResiduo} Estado inicial del formulario de residuo
 */
export function crearEstadoInicialFormularioResiduo(): EstadoFormularioResiduo {
  return {
    formularioDatos: {
      /** Número de identificación del registro de materia prima */
      numero: '',

      /** Nombre de la materia prima */
      nombreMateriaPrima: '',

      /** Cantidad numérica de materia prima */
      cantidad: '',

      /** Cantidad escrita con letra */
      cantidadLetra: '',

      /** Unidad de medida utilizada */
      unidadDeMedida: '',

      /** Fracción arancelaria correspondiente a la materia prima */
      fraccionArancelaria: '',
    },
    formularioResiduo: {
      /** Fracción arancelaria correspondiente al residuo */
      fraccionArancelaria: '',

      /** Número de Identificación Comercial (NICO) */
      nico: '',

      /** Acotación específica del residuo */
      acotacion: '',

      clasificacionDesc:'',
      unidadMedidaDesc:'',
      claveResiduoDesc:'',
      nicoDesc:'',
      cretiDesc:'',
      estadoFisicoDesc:'',
      tipoContenedorDesc:'',
      otroTipoContenedorDesc:'',
      fraccionDesc:'',
      otroEstadoFisicoDesc:'',

      /** Indica si el residuo es peligroso */
      residuoPeligroso: '',

      /** Cantidad numérica del residuo */
      cantidad: '',

      /** Cantidad escrita con letra */
      cantidadLetra: '',

      /** Unidad de medida del residuo */
      unidadMedida: '',

      /** Clasificación del residuo */
      clasificacion: '',

      /** Clave identificadora del residuo */
      claveResiduo: '',

      /** Nombre del residuo */
      nombre: '',

      /** Descripción detallada del residuo */
      descripcion: '',

      /** Evaluación CRETI del residuo (Corrosivo, Reactivo, Explosivo, Tóxico, Inflamable) */
      creti: '',

      manifiesto: '',

      /** Estado físico del residuo (sólido, líquido, etc.) */
      estadoFisico: '',

      /** Tipo de contenedor usado para el residuo */
      tipoContenedor: '',

      /** Capacidad del contenedor */
      capacidad: '',
    },
    residuos: [],
  };
}

/**
 * Store de Akita para gestionar el estado del formulario de residuos peligrosos.
 * Utiliza la configuración de Akita con nombre 'formulario-residuo' y permite reiniciar el estado.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'formulario-residuo', resettable: true })
export class FormularioResiduoStore extends Store<EstadoFormularioResiduo> {
  /**
   * Constructor del store que inicializa el estado del formulario de residuo
   * con los valores por defecto definidos en la función `crearEstadoInicialFormularioResiduo`.
   */
  constructor() {
    super(crearEstadoInicialFormularioResiduo());
  }

  /**
   * Actualiza los datos del formulario relacionados con la materia prima.
   *
   * @param {EstadoFormularioResiduo['formularioDatos']} datos - Objeto que contiene los datos de `formularioDatos`.
   */
  actualizarFormularioDatos(
    datos: EstadoFormularioResiduo['formularioDatos']
  ): void {
    this.update((state) => ({
      ...state,
      formularioDatos: { ...datos },
    }));
  }

  /**
   * Actualiza los datos del formulario relacionados con el residuo.
   *
   * @param {EstadoFormularioResiduo['formularioResiduo']} residuo - Objeto que contiene los datos de `formularioResiduo`.
   */
  actualizarFormularioResiduo(
    residuo: EstadoFormularioResiduo['formularioResiduo']
  ): void {
    this.update((state) => ({
      ...state,
      formularioResiduo: { ...residuo },
    }));
  }

  /**
   * Limpia todos los campos del formulario, reiniciándolos a su estado inicial.
   */
  limpiarFormulario(): void {
    this.reset();
  }
}
