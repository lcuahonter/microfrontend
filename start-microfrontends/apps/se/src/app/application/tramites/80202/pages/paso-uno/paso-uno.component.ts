import { Subject, map, takeUntil } from 'rxjs';
import { AnexoComponent } from '../../components/anexo.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { ImmexRegistroState } from '../../estados/immex-ampliacion-sensibles.store';
import { OnInit } from '@angular/core';
import { PermisoImmexDatosService } from '../../services/permiso-immex-datos.service';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@ng-mf/data-access-user';

@Component({
  selector: 'app-paso-uno',
  styleUrl: './paso-uno.component.scss',
  templateUrl: './paso-uno.component.html',
  standalone: true,
  imports: [CommonModule, SolicitanteComponent, AnexoComponent],
})
export class PasoUnoComponent implements OnInit {
  /**
   * Índice que representa el número actual o posición en un flujo o proceso.
   * Se inicializa con un valor predeterminado de 1.
   */
  indice: number = 1;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();


  /**
   * @property consultaState
   * @description Estado actual de la consulta para el trámite.
   * @type {ConsultaioState}
   * @memberof PasoUnoComponent
   */
  public consultaState!: ConsultaioState;

  constructor(private seccionStore: SeccionLibStore,
    private readonly consultaQuery: ConsultaioQuery,
    private permisoImmexDatosService: PermisoImmexDatosService,
  ) { }

  /**
   * @method ngOnInit
   * @description Método de inicialización del componente. Asigna las secciones del formulario.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    }
    else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Cambia la pestaña seleccionada en la interfaz de usuario.
   *
   * @param i - El índice de la pestaña que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.permisoImmexDatosService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.permisoImmexDatosService.actualizarEstadoFormulario(
            (resp as unknown as ImmexRegistroState) || {}
          );
        }
      });
  }

}
