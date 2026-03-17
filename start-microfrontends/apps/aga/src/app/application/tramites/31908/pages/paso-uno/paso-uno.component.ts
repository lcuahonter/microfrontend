import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent, SubsecuenteIoQuery, TituloComponent } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GuardarServiceT31908 } from '../../services/guardar.service';
import { TIPO_CONSULTRA_TRAMITE } from '../../../31910/constants/solicitud-modificacion-permiso-salida-territorio.enum';

@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [CommonModule, SolicitanteComponent, TituloComponent],
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  /**
     * Folio del trámite actual.
     * se usa solo para pruebas, se debe eliminar cuando se integre con el flujo real.
     */
  folioTramitePadre: string = '';


  /**
   * Estado del trámite 31907 observado desde el store de Akita.
   */
  estadoTramite!: ConsultaioState;

  /**
   * Subject para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  destroy$: Subject<void> = new Subject<void>();

  /**
   * indica si la opcion de solo lectura est activa o no
   */
  esLectura: boolean = false;

  /**
   * Folio del trámite actual.
   */
  folioTramite: string = '';

  /**
   * constructor de la clase PasoUnoComponent 
   * @param store Store de estado para el trámite 31907. 
   */
  constructor(
    private consultaioQuery: ConsultaioQuery,
    private subsecuenteQuery: SubsecuenteIoQuery,
    private service: GuardarServiceT31908) {
  }
  /**
 * Método llamado al destruir el componente.
 */
  ngOnInit(): void {
    this.obtenerEstadoTramite();
  }

  /**
     * Folio del trámite padre.
     */
  @Output() folioPadre: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Índice actual del tab mostrado.
   */
  indice: number = 2;
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * metodo para seleccionar el tab actual
   * @param i numero de tab a seleccionar
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }


  /**
     * Método para obtener el estado del trámite desde el store.
     */
  obtenerEstadoTramite(): void {
    this.consultaioQuery.select()
      .pipe(takeUntil(this.destroy$))
      .subscribe(estado => {
        this.estadoTramite = estado;
      });

    if (this.estadoTramite.parameter === TIPO_CONSULTRA_TRAMITE && this.estadoTramite.readonly) {
      this.esLectura = true;
      this.obtenerDetalleSolicitud(this.estadoTramite.folioTramite);
    } else {
      this.folioTramitePadre = this.subsecuenteQuery.getValue().folioTramite;
      this.folioPadre.emit(this.folioTramitePadre);
    }
  }

  /**
    * Obtiene el detalle de una solicitud específica del trámite 31907.
    * @param folioTramite folio del trámite.
    */
  obtenerDetalleSolicitud(folioTramite: string): void {
    this.service.obtenerDetalleSolicitud(folioTramite)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.folioTramitePadre = res.datos?.num_folio_original || '';
      });
  }

  /**
 * Método para limpiar las suscripciones al destruir el componente.
 */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
