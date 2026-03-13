/**
 * @fileoverview Servicio de inicialización de catálogos para la solicitud 32604
 * 
 * Este archivo contiene el servicio que proporciona métodos estáticos para
 * inicializar objetos de catálogo con valores por defecto para su uso en
 * componentes de formularios de la solicitud 32604.
 * 
 * @author Sistema de Gestión AGACE
 * @since 2024
 */

import { Injectable } from '@angular/core';

import { CatalogosSelect } from '@libs/shared/data-access-user/src';

/**
 * Servicio para inicializar los catálogos de la solicitud 32604.
 * 
 * Este servicio proporciona métodos estáticos para crear e inicializar objetos 
 * de catálogo con valores por defecto, siguiendo el mismo patrón establecido 
 * en otros componentes del sistema. Cada método retorna un objeto CatalogosSelect
 * configurado para un tipo específico de catálogo.
 * 
 * @class CatalogoInicializacionService
 * @injectable
 */
@Injectable({
  providedIn: 'root',
})
export class CatalogoInicializacionService {

  /**
   * Inicializa el catálogo del sector productivo con valores por defecto.
   * 
   * Crea un objeto CatalogosSelect configurado específicamente para la selección
   * de sectores productivos. El catálogo se inicializa con un array vacío de opciones
   * que será poblado posteriormente por el servicio correspondiente.
   * 
   * @static
   * @returns {CatalogosSelect} Objeto de catálogo inicializado para sector productivo
   * 
   * @memberof CatalogoInicializacionService
   */
  static inicializarSectorProductivo(): CatalogosSelect {
    return {
      catalogos: [],
      labelNombre: 'Sector Productivo',
      primerOpcion: 'Seleccione una opción',
      required: false
    };
  }

  /**
   * Inicializa el catálogo de servicios con valores por defecto.
   * 
   * Crea un objeto CatalogosSelect configurado específicamente para la selección
   * de servicios disponibles. Establece el label apropiado y configura el catálogo
   * como no requerido para permitir selecciones opcionales.
   * 
   * @static
   * @returns {CatalogosSelect} Objeto de catálogo inicializado para servicios
   * 
   * @memberof CatalogoInicializacionService
   */
  static inicializarServicio(): CatalogosSelect {
    return {
      catalogos: [],
      labelNombre: 'Servicio',
      primerOpcion: 'Seleccione una opción',
      required: false
    };
  }

  /**
   * Inicializa el catálogo de bimestres con valores por defecto.
   * 
   * Crea un objeto CatalogosSelect configurado para la selección de períodos
   * bimestrales. Este catálogo es utilizado para la selección de períodos
   * de tiempo en formularios relacionados con reportes o pagos periódicos.
   * 
   * @static
   * @returns {CatalogosSelect} Objeto de catálogo inicializado para bimestres
   * 
   * @memberof CatalogoInicializacionService
   */
  static inicializarBimestre(): CatalogosSelect {
    return {
      catalogos: [],
      labelNombre: 'Bimestre',
      primerOpcion: 'Seleccione una opción',
      required: false
    };
  }

  /**
   * Inicializa el catálogo "indique todos" con valores por defecto.
   * 
   * Crea un objeto CatalogosSelect con configuración genérica, sin label específico,
   * utilizado para casos donde se requiere una selección general o múltiple.
   * Es útil para formularios dinámicos donde el label puede establecerse posteriormente.
   * 
   * @static
   * @returns {CatalogosSelect} Objeto de catálogo inicializado para "indique todos"
   * 
   * @memberof CatalogoInicializacionService
   */
  static inicializarIndiqueTodos(): CatalogosSelect {
    return {
      catalogos: [],
      labelNombre: '',
      primerOpcion: 'Seleccione una opción',
      required: false
    };
  }

  /**
   * Inicializa todos los catálogos necesarios para el componente.
   * 
   * Método de conveniencia que inicializa todos los catálogos requeridos
   * en una sola llamada. Retorna un objeto con todos los catálogos organizados
   * por nombre para facilitar su uso en componentes que requieren múltiples catálogos.
   * 
   * @static
   * @returns {Object} Objeto con todos los catálogos inicializados
   * @returns {CatalogosSelect} returns.sectorProductivo - Catálogo de sectores productivos
   * @returns {CatalogosSelect} returns.servicio - Catálogo de servicios disponibles
   * @returns {CatalogosSelect} returns.bimestre - Catálogo de períodos bimestrales
   * @returns {CatalogosSelect} returns.indiqueTodos - Catálogo genérico para selecciones múltiples
   * 
   * @memberof CatalogoInicializacionService
   */
  static inicializarTodosCatalogos(): {
    sectorProductivo: CatalogosSelect;
    servicio: CatalogosSelect;
    bimestre: CatalogosSelect;
    indiqueTodos: CatalogosSelect;
  } {
    return {
      sectorProductivo: this.inicializarSectorProductivo(),
      servicio: this.inicializarServicio(),
      bimestre: this.inicializarBimestre(),
      indiqueTodos: this.inicializarIndiqueTodos()
    };
  }
}