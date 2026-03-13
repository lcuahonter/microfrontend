import { ConsultaioQuery, ConsultaioState, FormularioDinamico } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { AltaPlantaComponent } from '../../components/alta-planta/alta-planta.component';
import { BitacoraComponent } from '../../components/bitacora/bitacora.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatosModificacionesComponent } from '../../components/datos-modificaciones/datos-modificaciones.component';
import { ModificacionSolicitudeService } from '../../services/modificacion-solicitude.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { Tramite80308Store } from '../../estados/tramite80308.store';

/**
 * @component PasoUnoComponent
 * Componente para el paso uno del asistente
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SolicitanteComponent,
    BitacoraComponent,
    AltaPlantaComponent,
    DatosModificacionesComponent,
  ],
  host: {},
})
/**
 * @class PasoUnoComponent
 * Clase del componente para el paso uno
 */
export class PasoUnoComponent {
  /** Tipo de persona */
  tipoPersona!: number;

  /** Datos dinámicos de domicilio fiscal */
  domicilioFiscal: FormularioDinamico[] = [];

  /** Índice de la pestaña seleccionada */
  indice: number = 1;

  /**
   * Cambia el índice de la pestaña seleccionada
   * @param {number} i
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Estado actual de la consulta */
  public consultaState!: ConsultaioState;

  /** Indica si hay datos de respuesta */
  public esDatosRespuesta: boolean = false;

  /** Subject para limpiar observables */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente
   * @param {ConsultaioQuery} consultaQuery
   * @param {ModificacionSolicitudeService} modificionService
   * @param {Tramite80308Store} store
   */
  constructor(private consultaQuery: ConsultaioQuery, public modificionService: ModificacionSolicitudeService, private store: Tramite80308Store,) {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }



  /**
   * Guarda los datos del formulario en el store
   */
  guardarDatosFormulario(): void {
    // ...existing code...
    this.modificionService
      .obtenerTramiteDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.store.update(resp);
        }
      });
  }
}
