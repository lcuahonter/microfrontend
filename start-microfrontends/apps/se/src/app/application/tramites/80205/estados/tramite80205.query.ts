import { AmpliacionServiciosState } from './tramite80205.store';
import { AmpliacionServiciosStore } from './tramite80205.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (`Query`) para gestionar y acceder al estado relacionado con la ampliación de servicios.
 * 
 * Esta clase extiende la clase `Query` de Akita y proporciona selectores para acceder a diferentes partes del estado
 * gestionado por `AmpliacionServiciosStore`.
 * 
 * @see https://datorama.github.io/akita/
 */
@Injectable({ providedIn: 'root' })
export class AmpliacionServiciosQuery extends Query<AmpliacionServiciosState> {

  /**
   * Selector para obtener la información del registro desde el estado.
   */
  selectInfoRegistro$ = this.select((state) => state.infoRegistro);

  /**
   * Selector para obtener los servicios disponibles desde el estado.
   */
  selectServicios$ = this.select((state) => state.servicios);

  /**
   * Selector para obtener la lista de empresas desde el estado.
   */
  selectEmpresas$ = this.select((state) => state.empresas);

  /**
   * Selector para obtener la información de la aduana de ingreso desde el estado.
   */
  selectAduanaDeIngreso$ = this.select((state) => state.aduanaDeIngreso);

  /**
   * Selector para obtener los datos relacionados con el programa IMMEX desde el estado.
   */
  selectDatosImmex$ = this.select((state) => state.datosImmex);

  /**
   * Selector para obtener los datos generales desde el estado.
   */
  selectDatos$ = this.select((state) => state.datos);

  /**
   * Selector para obtener la aduana de ingreso seleccionada desde el estado.
   */
  selectAduanaDeIngresoSelecion$ = this.select((state) => state.aduanaDeIngresoSelecion);

  /**
   * Selector para verificar si todos los valores de la propiedad `formaValida` en el estado son `true`.
   */
  FormaValida$ = this.select((state) => {
    return Object.values(state.formaValida).every(value => value === true);
  });

  /**
   * Selector para obtener el RFC de la empresa desde el estado.
   */
  selectRfcEmpresa$ = this.select((state) => state.rfcEmpresa);

  /**
   * Selector para obtener el número del programa desde el estado.
   */
  selectNumeroPrograma$ = this.select((state) => state.numeroPrograma);

  /**
   * Selector para obtener el tiempo del programa desde el estado.
   */
  selectTiempoPrograma$ = this.select((state) => state.tiempoPrograma);

  selectIdSolicitud$ = this.select((state) => state.idSolicitud);

  datosAutorizados$ = this.select((state) => state.datosAutorizados);

  selectTramite80205$= this.select((state) => state);

  /**
   * Constructor de la clase que inicializa el query con la tienda proporcionada.
   * 
   * @param store - Instancia de `AmpliacionServiciosStore` utilizada para gestionar el estado de la aplicación.
   */
  constructor(protected override store: AmpliacionServiciosStore) {
    super(store);
  }
}
