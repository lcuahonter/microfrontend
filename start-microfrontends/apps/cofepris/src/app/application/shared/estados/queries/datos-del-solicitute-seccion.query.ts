import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { DatosDelSolicituteSeccionStateStore } from '../stores/datos-del-solicitute-seccion.store';

import { DatosDelSolicituteSeccionState } from '../stores/datos-del-solicitute-seccion.store';

/**
 * Clase `DatosDelSolicituteSeccionQuery`
 * 
 * Esta clase es una consulta (`Query`) que permite acceder al estado de la sección
 * de datos del solicitante. Utiliza Akita para gestionar el estado de la aplicación.
 * 
 * Proporciona observables para acceder a propiedades específicas del estado.
 */
@Injectable({ providedIn: 'root' })
/**
 * * Clase que representa una consulta para obtener datos del solicitante.
 * * Esta clase extiende la clase `Query` de Akita y proporciona selectores
 */
export class DatosDelSolicituteSeccionQuery extends Query<DatosDelSolicituteSeccionState> {

  /**
   * Selecciona el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

// ...existing code...

/**
 * Observable que expone el RFC del representante.
 */
representanteRfc$ = this.select('representanteRfc');

/**
 * Observable que expone el nombre del representante.
 */
representanteNombre$ = this.select('representanteNombre');

/**
 * Observable que expone el apellido paterno del representante.
 */
apellidoPaterno$ = this.select('apellidoPaterno');

/**
 * Observable que expone el apellido materno del representante.
 */
apellidoMaterno$ = this.select('apellidoMaterno');

/**
 * Observable que expone la denominación o razón social del establecimiento.
 */
establecimientoDenominacionRazonSocial$ = this.select('establecimientoDenominacionRazonSocial');

/**
 * Observable que expone el correo electrónico del establecimiento.
 */
establecimientoCorreoElectronico$ = this.select('establecimientoCorreoElectronico');

/**
 * Observable que expone el código postal del domicilio del establecimiento.
 */
establecimientoDomicilioCodigoPostal$ = this.select('establecimientoDomicilioCodigoPostal');

/**
 * Observable que expone el estado del domicilio del establecimiento.
 */
establecimientoDomicilioEstado$ = this.select('establecimientoDomicilioEstado');

/**
 * Observable que expone el municipio o alcaldía del establecimiento.
 */
establecimientoMunicipioYAlcaldia$ = this.select('establecimientoMunicipioYAlcaldia');

/**
 * Observable que expone la localidad del domicilio del establecimiento.
 */
establecimientoDomicilioLocalidad$ = this.select('establecimientoDomicilioLocalidad');

/**
 * Observable que expone la colonia del domicilio del establecimiento.
 */
establecimientoDomicilioColonia$ = this.select('establecimientoDomicilioColonia');

/**
 * Observable que expone la calle del domicilio del establecimiento.
 */
establecimientoDomicilioCalle$ = this.select('establecimientoDomicilioCalle');

/**
 * Observable que expone la lada telefónica del establecimiento.
 */
establecimientoDomicilioLada$ = this.select('establecimientoDomicilioLada');

/**
 * Observable que expone el teléfono del establecimiento.
 */
establecimientoDomicilioTelefono$ = this.select('establecimientoDomicilioTelefono');

/**
 * Observable que expone el RFC del profesional responsable.
 */
rfcDelProfesionalResponsable$ = this.select('rfcDelProfesionalResponsable');

/**
 * Observable que expone el nombre del profesional responsable.
 */
nombreDelProfesionalResponsable$ = this.select('nombreDelProfesionalResponsable');

/**
 * Observable que expone la selección del radio de información confidencial.
 */
informacionConfidencialRadio$ = this.select('informacionConfidencialRadio');

/**
 * Observable que expone los datos del propietario.
 */
propietarioData$ = this.select('propietarioData');

/**
 * Observable que expone los datos del establecimiento.
 */
establecimientoData$ = this.select('establecimientoData');

/**
 * Observable que expone el identificador genérico.
 */
ideGenerica$ = this.select('ideGenerica');

/**
 * Observable que expone las observaciones.
 */
observaciones$ = this.select('observaciones');

/**
 * Observable que expone el RFC del responsable sanitario del establecimiento.
 */
establecimientoRFCResponsableSanitario$ = this.select('establecimientoRFCResponsableSanitario');

/**
 * Observable que expone la razón social del establecimiento.
 */
establecimientoRazonSocial$ = this.select('establecimientoRazonSocial');

/**
 * Observable que expone los estados del establecimiento.
 */
establecimientoEstados$ = this.select('establecimientoEstados');

/**
 * Observable que expone la descripción del municipio.
 */
descripcionMunicipio$ = this.select('descripcionMunicipio');

/**
 * Observable que expone la localidad.
 */
localidad$ = this.select('localidad');

/**
 * Observable que expone las colonias.
 */
colonias$ = this.select('colonias');

/**
 * Observable que expone la calle.
 */
calle$ = this.select('calle');

/**
 * Observable que expone la lada.
 */
lada$ = this.select('lada');

/**
 * Observable que expone el teléfono.
 */
telefono$ = this.select('telefono');

/**
 * Observable que expone el SCIAN.
 */
scian$ = this.select('scian');

/**
 * Observable que expone las colonias del establecimiento.
 */
establishomentoColonias$ = this.select('establishomentoColonias');

/**
 * Observable que expone el número de licencia sanitaria.
 */
noLicenciaSanitaria$ = this.select('noLicenciaSanitaria');

/**
 * Observable que expone el estado del checkbox de aviso.
 */
avisoCheckbox = this.select('avisoCheckbox');

/**
 * Observable que expone la licencia sanitaria.
 */
licenciaSanitaria = this.select('licenciaSanitaria');

/**
 * Observable que expone el régimen.
 */
regimen = this.select('regimen');

/**
 * Observable que expone las aduanas de entrada.
 */
aduanasEntradas = this.select('aduanasEntradas');

/**
 * Observable que expone el estado del checkbox de AIFA.
 */
aifaCheckbox = this.select('aifaCheckbox');

/**
 * Observable que expone la descripción del SCIAN.
 */
descripcionScian = this.select('descripcionScian');

datosTabla$ = this.select('scianData');

/**
 * Constructor de la clase.
 * 
 * @param store Instancia del store de estado de la sección de datos del solicitante.
 */
constructor(protected override store: DatosDelSolicituteSeccionStateStore) {
  super(store);
}
}