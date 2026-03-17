import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { DatosDelSolicituteSeccionStateInterface, DatosDelSolicituteSeccionStateStoreI } from './datos-del-solicitud-seccion.store';

/**
 * Clase `DatosDelSolicituteSeccionQuery`
 * 
 * Esta clase es una consulta (`Query`) que permite acceder al estado de la sección
 * de datos del solicitante. Utiliza Akita para gestionar el estado de la aplicación.
 * 
 * Proporciona observables para acceder a propiedades específicas del estado.
 */
@Injectable({ providedIn: 'root' })
export class DatosDelSeccionQuery extends Query<DatosDelSolicituteSeccionStateInterface> {

  establecimientoCorreoElectronico$ = this.select('establecimientoCorreoElectronico');
  establecimientoDomicilioCodigoPostal$ = this.select('establecimientoDomicilioCodigoPostal');
  ideGenerica1$ = this.select('ideGenerica1');
  observaciones$ = this.select('observaciones');
  establecimientoRFCResponsableSanitario$ = this.select('establecimientoRFCResponsableSanitario');
  establecimientoRazonSocial$ = this.select('establecimientoRazonSocial');
  establecimientoEstados$ = this.select('establecimientoEstados');
  descripcionMunicipio$ = this.select('descripcionMunicipio');
  localidad$ = this.select('localidad');
  colonias$ = this.select('colonias');
  calle$ = this.select('calle');
  lada$ = this.select('lada');
  telefono$ = this.select('telefono');
  scian$ = this.select('scian');
  establishomentoColonias$ = this.select('establishomentoColonias');
  noLicenciaSanitaria$ = this.select('noLicenciaSanitaria');  
  avisoCheckbox = this.select('avisoCheckbox');  
  licenciaSanitaria = this.select('licenciaSanitaria');  
  regimen = this.select('regimen');  
  aduanasEntradas = this.select('aduanasEntradas');  
  descripcionScian = this.select('descripcionScian');

  constructor(protected override store: DatosDelSolicituteSeccionStateStoreI) {
    super(store);
  }
}