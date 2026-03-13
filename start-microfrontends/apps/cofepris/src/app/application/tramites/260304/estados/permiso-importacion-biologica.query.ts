/**
 * Query de Akita para gestionar el estado de Permiso de Importación Biológica.
 * Proporciona selectores observables para acceder a diferentes partes del estado.
 * @module PermisoImportacionBiologicaQuery
 */
import { PermisoImportacionBiologicaState, PermisoImportacionBiologicaStore} from './permiso-importacion-biologica.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';


/**
 * Decorador que marca la clase como inyectable en el sistema de dependencias de Angular.
 * Proporciona el servicio en el nivel raíz.
 */
@Injectable({ providedIn: 'root' })
/**
 * Clase que extiende Akita Query para el estado de PermisoImportacionBiologica.
 * Permite seleccionar diferentes propiedades del estado como observables.
 */
export class PermisoImportacionBiologicaQuery extends Query<PermisoImportacionBiologicaState> {
  /** Observable del estado seleccionado. */
  selectedEstado$ = this.select((state) => state.selectedEstado);
  /** Observable de la clave seleccionada. */
  selectedClave$ = this.select((state) => state.setClave);
  /** Observable del banco seleccionado. */
  selectedBanco$ = this.select((state) => state.setBanco);
  /** Observable de la clave de referencia seleccionada. */
  selectedClaveDeReferncia$ = this.select((state)=>state.setClaveDeReferncia)
  /** Observable de la cadena de la dependencia seleccionada. */
  selectedCadenaDeLaDependencia$ = this.select((state)=>state.setCadenaDeLaDependencia)
  /** Observable de la llave de pago seleccionada. */
  selectedLlaveDePago$=this.select((state)=>state.setLlaveDePago)
  /** Observable de la fecha de pago seleccionada. */
  selectedFechaDePago$=this.select((state)=>state.setFechaDePago)
  /** Observable del importe de pago seleccionado. */
  selectedImporteDePago$ = this.select((state)=>state.setImporteDePago)

  /**
   * Constructor de la clase.
   * @param tramiteStore Instancia del store de PermisoImportacionBiologica.
   */
  constructor(private tramiteStore: PermisoImportacionBiologicaStore) {
    super(tramiteStore);
  }
}
