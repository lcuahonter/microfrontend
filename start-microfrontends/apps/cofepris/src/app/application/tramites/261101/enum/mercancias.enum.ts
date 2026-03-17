import { ConfiguracionColumna } from "@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model";
import { Mercancias } from "../modelos/mercancias.model";
/**
   * Configuración para las columnas de la tabla.
   * Define cómo se mostrarán los datos de los trámites Mercancias.
   */
  export const CONFIGURACIONCOLUMNA: ConfiguracionColumna<Mercancias>[] = [
    /** Configuración para las columnas de la tabla */
      { encabezado: 'Clasificación del producto ', clave: (item: Mercancias) => item.clasificacionDelProducto, orden: 1 },
      { encabezado: 'Especificar clasificación del product  ', clave: (item: Mercancias) => item.especificarClasificacionDelProduct, orden: 2 },
      { encabezado: 'Denominación ', clave: (item: Mercancias) => item.denominacion, orden: 3 },
      { encabezado: 'Denominación distintiva  ', clave: (item: Mercancias) => item.denominacionDistintiva, orden: 4 },
      { encabezado: 'Número CAS  ', clave: (item: Mercancias) => item.numeroCAS, orden: 5 },
      { encabezado: 'Fracción arancelaria', clave: (item: Mercancias) => item.fraccionArancelaria, orden: 6 },
      { encabezado: 'Descripción de I fracción ', clave: (item: Mercancias) => item.descripcionDeFraccion, orden: 7 },
    ];
  /**
   * Identificador del procedimiento para Mercancias.
   */
  export const ID_PROCEDIMIENTO = 261101;
