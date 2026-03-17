/**
 * Clase: Tramite120602Query
 * -------------------------
 * Esta clase proporciona selectores y observables para acceder y consultar el estado del trámite 120602.
 * Permite obtener datos específicos y reactivos de la store, facilitando la gestión y visualización de la información
 * en los componentes relacionados con el trámite.
 *
 * Uso:
 * Inyectar Tramite120602Query en componentes o servicios para acceder a los selectores y observables del estado.
 *
 * Funcionalidad:
 * - Provee selectores para datos generales de socios, solicitud y representación federal.
 * - Permite la suscripción reactiva a cambios en el estado del trámite.
 * - Facilita la separación de lógica de acceso a estado respecto a los componentes de UI.
 *
 * Autor: [Agregar nombre del autor si se desea]
 * Fecha: 12/11/2025
 */
import { Tramite120602Store, Tramites120602State } from '../estados/tramite-120602.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Query para acceder al estado del trámite 120602.
 * Proporciona selectores para obtener datos específicos del estado.
 * Esta clase extiende de Query para facilitar la selección de datos.
 */
@Injectable({ providedIn: 'root' })
export class Tramite120602Query extends Query<Tramites120602State> {

  /**
   * Observable que emite la nacionalidad del socio desde el estado.
   */
  selectNacionalidad$ = this.select((state) => {
    return state.datosGeneralesSocios.nacionalidad;
  });

  /**
   * Observable que emite el tipo de persona del socio desde el estado.
   */
  selectPersona$ = this.select((state) => {
    return state.datosGeneralesSocios.persona;
  })

  /**
   * Observable que emite la cadena de dependencia o RFC del socio desde el estado.
   */
  selectCadenaDependencia$ = this.select((state) => {
    return state.datosGeneralesSocios.cadenaDependencia;
  })

  /**
   * Observable que emite los datos generales del socio desde el estado.
   */
  selectDatosGeneralesSocios$ = this.select((state) => {
    return state.datosGeneralesSocios;  
  })

    /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Observable que emite los datos generales del socio desde el estado.
   */
  selectNombre$ = this.select((state) => {
    return state.datosGeneralesSocios.nombre;
  })

  /**
   * Observable que emite el apellido paterno del socio desde el estado.
   */
  selectApellidoPaterno$ = this.select((state) => {
    return state.datosGeneralesSocios.apellidoPaterno;
  })

  /**
   * Observable que emite el código postal del socio desde el estado.
   */
  selectCodigoPostal$ = this.select((state) => {
    return state.datosGeneralesSocios.codigoPostal;
  })

  /**
   * Observable que emite el estado del socio desde el estado.
   */
  selectEstadoGenerales$ = this.select((state) => {
    return state.datosGeneralesSocios.estado;
  })

  /**
   * Observable que emite el correo electrónico del socio desde el estado.
   */
  selectCorreoElectronico$ = this.select((state) => {
    return state.datosGeneralesSocios.correoElectronico;
  })

  /**
   * Observable que emite el taxId del socio desde el estado.
   */
  selectTaxId$ = this.select((state) => {
    return state.datosGeneralesSocios.taxId;
  })

  /**
   * Observable que emite la denominación del socio desde el estado.
   */
  selectDenominacion$ = this.select((state) => {
    return state.datosGeneralesSocios.denominacion;
  })

  /**
   * Observable que emite el tipo de empresa seleccionada desde el estado.
   */
  selectTipoDeEmpresa$ = this.select((state) => {
    return state.datosDeLaSolicitud.tipoDeEmpresa;
  });

  /**
   * Observable que emite la clave de la actividad económica desde el estado.
   */
  selectActividadEconomicaClave$ = this.select((state) => {
    return state.datosDeLaSolicitud.actividadEconomicaClave;
  });

  /**
   * Observable que emite el estado seleccionado en la representación federal.
   */
  selectEstado$ = this.select((state) => {
    return state.representacionFederal.estado;
  });

  /**
   * Observable que emite la representación seleccionada en la representación federal.
   */
  selectRepresentacion$ = this.select((state)=> {
    return state.representacionFederal.representacion;
  })

  /**
   * Constructor de la clase Tramite120602Query.
   * @param store Instancia del store de Tramite120602.
   */
  constructor(
    protected override store: Tramite120602Store) {
    super(store);
  }
}