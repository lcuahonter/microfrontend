import { Component, OnDestroy } from '@angular/core';
import { ConsultaioQuery, SolicitanteQuery, SolicitanteState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { DatosModificacion } from '../../../../shared/models/modificacion.model';
import { EliminacionModificacionComponent } from '../../../../shared/components/modificacion/modificacion.component';
import { ModificacionSolicitudeService } from '../../services/modificacion-solicitude.service';
import { ToastrService } from 'ngx-toastr';

/**
 * @component DatosModificacionesComponent
 * Componente para mostrar y gestionar los datos de modificaciones
 */
@Component({
  selector: 'app-datos-modificaciones',
  templateUrl: './datos-modificaciones.component.html',
  styleUrls: ['./datos-modificaciones.component.scss'],
  standalone: true,
  imports: [
    EliminacionModificacionComponent
  ],
  providers: [ModificacionSolicitudeService, ToastrService],
})
/**
 * @class DatosModificacionesComponent
 * Clase del componente de datos de modificaciones
 */
export class DatosModificacionesComponent implements OnDestroy {
  /** Subject para limpiar observables */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Indica si el formulario está en modo solo lectura */
  public esFormularioSoloLectura: boolean = false;

  /** Datos relacionados con la modificación del trámite */
  datosModificacion!: DatosModificacion;

  /** Estado de datos del solicitante */
  solicitanteState!: SolicitanteState;

  /**
   * Constructor del componente
   * @param {ModificacionSolicitudeService} modificionService
   * @param {ToastrService} toastr
   * @param {ConsultaioQuery} consultaioQuery
   * @param {SolicitanteQuery} solicitanteQuery
   */
  constructor(public modificionService: ModificacionSolicitudeService, private toastr: ToastrService, private consultaioQuery: ConsultaioQuery,private solicitanteQuery: SolicitanteQuery){
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly;
        this.cargarDatos();
      })
    )
    .subscribe();

    this.solicitanteQuery.selectSeccionState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.solicitanteState = seccionState;
      })
    )
    .subscribe();
    this.cargarDatos();
  }

  /**
   * Carga los datos generales desde el servicio y los coloca en el formulario
   */
  cargarDatos(): void {
    this.datosModificacion = {
      rfc: this.solicitanteState?.rfc_original,
      representacionFederal: '',
      tipo: this.solicitanteState?.tipo_sociedad || '',
      programa: this.solicitanteState?.email || ''
    }
  }

  /**
   * Método que se ejecuta cuando el componente es destruido
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.unsubscribe(); // Cancela cualquier suscripción activa.
  }
}
