import { AlertComponent, TituloComponent } from '@ng-mf/data-access-user';
import { Component, Input, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { SagarpaService } from '../../../220501/services/sagarpa/sagarpa.service';
import { Solicitud } from '../../models/solicitud-pantallas.model';
import { Solicitud220501Store } from '../../../220501/estados/tramites220501.store';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { TEXTOS } from '../../../220501/constantes/texto-enum';



/**
 * Componente que representa los datos de la solicitud.
 */
@Component({
  selector: 'app-solicitud-datos',
  standalone: true,
  imports: [AlertComponent],
  templateUrl: './solicitud-datos.component.html',
  styleUrl: './solicitud-datos.component.scss',
})
/**
 * Componente que representa los datos de la solicitud
 */ 
export class SolicitudDatosComponent implements OnDestroy{
  /**
   * Obtiene los datos de enumeración y establece valores de TEXTOS
   */
  TEXTOS = TEXTOS;
 /**
   * Indica el número de procedimiento.
   */
  @Input() procedimiento?: number;
  /**
   * Controla la visibilidad del panel plegable.
   * El valor predeterminado está establecido en verdadero (ampliado)
   */
  colapsable: boolean = true;
  /**
   * Recibe datos del encabezado de la tabla como propiedad de entrada
   */
  @Input() tablaHeadData: string[] = [];
  /**
   * Recibe la lista de solicitudes como datos de fila de la tabla.
   */
  @Input() tablaFilaDatos: Solicitud[] = [];

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Constructor de la clase SolicitudDatosComponent.
   * @param sagarpaService Servicio para interactuar con la API de Sagarpa.
   * @param solicitud220501Store Store para gestionar el estado de la solicitud 220501.
   */
  constructor(
    private sagarpaService: SagarpaService,
    private solicitud220501Store: Solicitud220501Store,
        private solicitudService: SolicitudPantallasService,
        private NOTIF: NotificacionesService
  ) {}

  /**
   * Alterna el panel plegable (expandir/contraer)
   */
  mostrarColapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Método que se ejecuta al hacer clic en una fila de la tabla.
   * Obtiene los datos del registro seleccionado.
   * @returns {void}
   */
  alClicFila(id: number | string): void {
    this.solicitudService
      .iniciarInspeccionFisica(
        id,
        this.procedimiento ? this.procedimiento.toString() : ''
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resultado) => {
        // Validación de código
        if (resultado.codigo !== '00') {
          this.NOTIF.showNotification({
            tipoNotificacion: 'toastr',
            categoria: 'danger',
            mensaje: resultado.mensaje ? resultado.mensaje : '',
            titulo: 'Error',
            modo: '',
            cerrar: true,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: 'Cancelar',
          });
          return; // Salimos para no ejecutar el resto
        }
        this.solicitudService.actualizarEstadoFormularioDobleClick(
          this.procedimiento as number,
          resultado?.datos
        );
      });
  }
 

  /**
   * Método que se ejecuta al destruir el componente.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
