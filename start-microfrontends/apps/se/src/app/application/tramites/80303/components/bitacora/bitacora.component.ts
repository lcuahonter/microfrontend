import { Component, OnDestroy, OnInit } from '@angular/core';
import { Bitacora } from '../../models/modificacion-programa-immex-baja-submanufacturera.model';
import { BitacoraTablaComponent } from '../../../../shared/components/bitacora/bitacora.component';
import { CommonModule } from '@angular/common';
import { ModificacionProgramaImmexBajaSubmanufactureraService } from '../../services/modificacion-programa-immex-baja-submanufacturera.service';
import { Subject } from 'rxjs';
import { Tramite80303Query } from '../../estados/tramite80303Query.query';
import { takeUntil } from 'rxjs';

import { Tramite80303Store } from '../../estados/tramite80303Store.store';

/**
 * Decorador de componente de Angular que define las propiedades y configuración del componente `BitacoraComponent`.
 * 
 * Este decorador especifica el selector del componente, los módulos importados, la plantilla HTML y los estilos asociados.
 * 
 * Propiedades:
 * - `selector`: Define el nombre del selector que se utiliza para instanciar este componente en una plantilla HTML.
 * - `standalone`: Indica que este componente es independiente y no requiere ser declarado en un módulo.
 * - `imports`: Lista de módulos y componentes que se importan para ser utilizados dentro de este componente.
 * - `templateUrl`: Ruta al archivo de plantilla HTML que define la estructura visual del componente.
 * - `styleUrl`: Ruta al archivo de estilos SCSS que define la apariencia del componente.
 */
@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [CommonModule, BitacoraTablaComponent],
  templateUrl: './bitacora.component.html',
  styleUrl: './bitacora.component.scss',
})
export class BitacoraComponent implements OnInit, OnDestroy {
  /**
   * Notificador utilizado para gestionar la destrucción de suscripciones en el componente.
   * Este Subject emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones activas y prevenir fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Arreglo que almacena los datos de la bitácora.
   * 
   * Este arreglo contiene objetos de tipo `Bitacora` que representan
   * los registros de la bitácora asociados a la aplicación.
   */
  bitacoraTablaDatos: Bitacora[] = [];

  /**
   * Constructor de la clase BitacoraComponent.
   * 
   * @param modificacionProgramaImmexBajaSubmanufactureraService - Servicio utilizado para gestionar las modificaciones del programa IMMEX en baja submanufacturera.
   * @param tramite80303Querry - Servicio para realizar consultas relacionadas con el trámite 80303.
   */
  constructor(
    public modificacionProgramaImmexBajaSubmanufactureraService: ModificacionProgramaImmexBajaSubmanufactureraService,
    public tramite80303Querry: Tramite80303Query,
    public tramite80303Store: Tramite80303Store,
  ) {}

  /**
   * Método de ciclo de vida Angular que se ejecuta al inicializar el componente.
   * 
   * - Obtiene los datos de la bitácora desde un servicio remoto utilizando la URL especificada.
   * - Se suscribe al estado del trámite para actualizar los datos de la tabla de bitácora
   *   cuando cambien en el estado global de la aplicación.
   * - Gestiona automáticamente la finalización de la suscripción al destruir el componente.
   */
  ngOnInit(): void {
  
      this.fetchBitacoraDatos('120662'); // Pass the `idPrograma` dynamically

}
/**
 * Fetches data for `bitacoraTablaDatos` using the API.
 * @param idPrograma - The ID of the program to query.
 */
fetchBitacoraDatos(idPrograma: string): void {
  this.modificacionProgramaImmexBajaSubmanufactureraService
    .consultarBitacoraImmex(idPrograma)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe(
      (response) => {
        if (response && response.codigo === '00' && response.datos) {
          this.bitacoraTablaDatos = response.datos; 
          this.tramite80303Store.updateBitacoraTablaDatos(response.datos);
        } 
      },
      (error) => {
        console.error('Error Details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
        });
      }
    );
}
  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.unsubscribe(); // Cancela cualquier suscripción activa.
  }
}
