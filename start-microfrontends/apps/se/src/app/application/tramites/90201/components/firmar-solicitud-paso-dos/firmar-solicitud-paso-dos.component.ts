import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  FIRMAR,
  SOLICITUD,
} from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';

import { ACUSE_DATOS } from '@libs/shared/data-access-user/src/core/enums/90201/productor-indirecto-tabla.enum';
import { AcuseTablaDatos } from '@libs/shared/data-access-user/src/core/models/90201/expansion-de-productores.model';
import { AlertComponent } from '@libs/shared/data-access-user/src/tramites/components/alert/alert.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src/tramites/components/firma-electronica/firma-electronica.component';
import TablaDatos from '@libs/shared/theme/assets/json/90201/acuse-tabla.json';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src/tramites/components/tabla-dinamica/tabla-dinamica.component';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';


/**
 * Componente FirmarSolicitudPasoDos que se utiliza para mostrar y gestionar los FirmarSolicitudPasoDos.
 *
 * Este componente utiliza varios subcomponentes como TituloComponent, CommonModule,
 * FirmaElectronicaComponent,TablaDinamicaComponent y AlertComponent para mostrar información y permitir al usuario seleccionar y agregar tratados.
 *
 * @component
 */

@Component({
  selector: 'app-firmar-solicitud-paso-dos',
  standalone: true,
  imports: [
    AlertComponent,
    CommonModule,
    FirmaElectronicaComponent,
    TablaDinamicaComponent,
    TituloComponent
  ],
  templateUrl: './firmar-solicitud-paso-dos.component.html',
  styleUrl: './firmar-solicitud-paso-dos.component.scss',
})
export class FirmarSolicitudPasoDosComponent {
  /**
   * Una propiedad pública que contiene las constantes de texto para el componente "firmar-solicitud-paso-dos".
   * El objeto `firmar` contiene varias cadenas de texto utilizadas dentro de este componente.
   */
  public TEXTOS = FIRMAR;
  /**
   * Contiene el contenido de texto para el componente "firmar solicitud paso dos".
   * Esta variable se llena con los datos del objeto `solicitud`.
   */
  public TEXTOS2 = SOLICITUD;
  
  /**
   * Configuración de la tabla utilizada en el componente para mostrar los datos del acuse.
   * 
   * @remarks
   * Esta propiedad almacena la configuración de columnas, formato y otros parámetros
   * necesarios para renderizar la tabla de datos del acuse en la interfaz de usuario.
   * 
   * @see ACUSE_DATOS para la definición de la configuración.
   */
  public configuracionTabla = ACUSE_DATOS;

  /**
   * Un arreglo de objetos `AcuseTablaDatos` que contiene los datos para la tabla.
   * Estos datos se inicializan a partir de la constante `TablaDatos`.
   */
  public acuseTablaDatos: AcuseTablaDatos[] = TablaDatos;

  /**
   * Constructor del componente.
   * @param router - El enrutador.
   */
  constructor(
    private router: Router
  ) {}

  /**
   * Maneja el evento para obtener la firma y realiza acciones adicionales.
   * @param ev - La cadena de texto que representa la firma obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
    this.router.navigate(['temporal-contenedores/acuse'])
  }
}

}
