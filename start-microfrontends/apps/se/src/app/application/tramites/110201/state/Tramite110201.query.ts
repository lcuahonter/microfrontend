import {
  Solicitud110201State,
  Tramite110201Store,
} from './Tramite110201.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Clase que proporciona consultas reactivas para el estado del trámite 110201.
 * Permite seleccionar partes específicas del estado almacenado en la tienda.
 */
@Injectable({ providedIn: 'root' })
export class Tramite110201Query extends Query<Solicitud110201State> {
  /**
   * Constructor de la clase.
   * @param store Instancia de la tienda `Tramite110201Store` que contiene el estado del trámite.
   */
  constructor(protected override store: Tramite110201Store) {
    super(store);
  }

  /**
   * Selecciona todo el estado de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Selecciona el catálogo de tratados.
   */
  seleccioneTratado$ = this.select((state) => state.tratado);

  /**
   * Selecciona el catálogo de países.
   */
  selectPais$ = this.select((state) => state.pais);

  /**
   * Selecciona la fracción arancelaria.
   */
  selectFraccionArancelaria$ = this.select(
    (state) => state.fraccionArancelaria
  );

  /**
   * Selecciona el número de registro.
   */
  selectNumRegistro$ = this.select((state) => state.numeroRegistro);

  /**
   * Selecciona el nombre comercial.
   */
  selectNomComercial$ = this.select((state) => state.nombreComercial);

  /**
   * Selecciona la fecha de inicio del bloque.
   */
  selectFechInicioB$ = this.select((state) => state.fechaInicial);

  /**
   * Selecciona la fecha de fin del bloque.
   */
  selectFechFinB$ = this.select((state) => state.fechaFinal);

  /**
   * Selecciona el archivo adjunto.
   */
  selectArchivo$ = this.select((state) => state.archivo);

  /**
   * Selecciona las observaciones.
   */
  selectObservaciones$ = this.select((state) => state.observaciones);

  /**
   * Selecciona el valor de presica.
   */
  selectPresica$ = this.select((state) => state.presica);

  /**
   * Selecciona el valor de presenta.
   */
  selectPresenta$ = this.select((state) => state.presenta);

  /**
   * Selecciona el catálogo de idiomas.
   */
  selectIdioma$ = this.select((state) => state.idioma);

  /**
   * Selecciona el catálogo de entidades.
   */
  selectEntidad$ = this.select((state) => state.entidad);

  /**
   * Selecciona el catálogo de representaciones.
   */
  selectRepresentacion$ = this.select((state) => state.representacion);

  /**
   * Selecciona el nombre del solicitante.
   */
  selectNombre$ = this.select((state) => state.nombre);

  /**
   * Selecciona el primer apellido del solicitante.
   */
  selectApellidoPrimer$ = this.select((state) => state.apellidoPrimer);

  /**
   * Selecciona el segundo apellido del solicitante.
   */
  selectApellidoSegundo$ = this.select((state) => state.apellidoSegundo);

  /**
   * Selecciona el número fiscal del solicitante.
   */
  selectNumeroFiscal$ = this.select((state) => state.numeroFiscal);

  /**
   * Selecciona la razón social.
   */
  selectRazonSocial$ = this.select((state) => state.razonSocial);

  /**
   * Selecciona la ciudad del solicitante.
   */
  selectCiudad$ = this.select((state) => state.ciudad);

  /**
   * Selecciona la calle del solicitante.
   */
  selectCalle$ = this.select((state) => state.calle);

  /**
   * Selecciona el número o letra de la dirección del solicitante.
   */
  selectNumeroLetra$ = this.select((state) => state.numeroLetra);

  /**
   * Selecciona la lada del número telefónico.
   */
  selectLada$ = this.select((state) => state.lada);

  /**
   * Selecciona el número telefónico.
   */
  selectTelefono$ = this.select((state) => state.telefono);

  /**
   * Selecciona el número de fax.
   */
  selectFax$ = this.select((state) => state.fax);

  /**
   * Selecciona el correo electrónico.
   */
  selectCorreoElectronico$ = this.select((state) => state.correoElectronico);

  /**
   * Selecciona el catálogo de naciones.
   */
  selectNacion$ = this.select((state) => state.nacion);

  /**
   * Selecciona el catálogo de transportes.
   */
  selectTransporte$ = this.select((state) => state.transporte);

  /**
   * Selecciona el catálogo de unidades de medida comercial (UMC).
   */
  selectUMC$ = this.select((state) => state.umc);

  /**
   * Selecciona el catálogo de unidades de medida.
   */
  selectUnidadMedida$ = this.select((state) => state.unidadMedida);

  /**
   * Selecciona el catálogo de tipos de factura.
   */
  selectTipoFactura$ = this.select((state) => state.tipoFactura);
}