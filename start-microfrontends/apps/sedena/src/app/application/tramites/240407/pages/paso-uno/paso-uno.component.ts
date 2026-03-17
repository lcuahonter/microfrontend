import { Component, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { SolicitudProrrogaAvisoImportacionService } from '../../services/solicitud-prorroga-aviso-importacion.service';


/**
 * title Paso Uno
 * description Componente que representa el primer paso del flujo de solicitud. Contiene los datos del solicitante, datos del trámite, terceros relacionados y pago de derechos.
 * summary Agrupa los subcomponentes necesarios para capturar la información inicial del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnInit {
    /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
   /**
   * Índice utilizado para identificar la posición actual en un proceso o lista.
   * type {number}
   */
   indice: number = 1;
   /**
   * @property destroyNotifier$
   * @description Observable notifier to unsubscribe active subscriptions when the component is destroyed.
   * Helps prevent memory leaks.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solicitudProrrogaAvisoImportacionService: SolicitudProrrogaAvisoImportacionService
  ) {
     this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
  }
   /**
   * Angular lifecycle method that runs on component initialization.
   * Subscribes to the selected tab from state and updates `indice`.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }
    /**
   * Guarda los datos del formulario obtenidos del servicio.
   */
  guardarDatosFormulario(): void {
    this.solicitudProrrogaAvisoImportacionService
      .obtenerRegistroTomarMuestrasDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp) {
          this.esDatosRespuesta = true;
          this.solicitudProrrogaAvisoImportacionService.actualizarEstadoFormulario(resp);
        }
      });
  }
   /**
    * Selecciona una pestaña específica.
    * param i - El índice de la pestaña a seleccionar.
    */
   seleccionaTab(i:number): void {
     this.indice = i;
   }
}
