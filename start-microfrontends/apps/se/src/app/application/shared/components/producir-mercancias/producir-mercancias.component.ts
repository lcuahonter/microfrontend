import { Component, Input, OnDestroy } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Mercancias } from '../../models/complementaria.model';
import { TABLA_PRODUCIR_MERCANCIAS } from '../../constantes/complementaria.enum';

/**
 * Componente para mostrar la tabla de mercancías a producir.
 */
@Component({
  selector: 'app-producir-mercancias',
  standalone: true,
  imports: [
    TituloComponent,
    TablaDinamicaComponent
  ],
  templateUrl: './producir-mercancias.component.html',
  styleUrl: './producir-mercancias.component.scss'
})
export class ProducirMercanciasComponent implements OnDestroy {
  /**
   * Tabla de selección de mercancías
   * @type {TablaSeleccion}
   */
  tablaSeleccion = TablaSeleccion;

  /**
   * Configuración de la tabla de mercancías
   * @type {ConfiguracionColumna<Mercancias>[]}
   */
  configuracionTabla = TABLA_PRODUCIR_MERCANCIAS;

  /**
   * Lista de mercancías obtenidas del servicio
   * @type {Mercancias[]}
   */
  @Input() mercanciasProducir: Mercancias [] = [];
  /**
     * Subject para destruir notificador.
     */
    consultaDatos!: ConsultaioState;
     /**
     * Indica si el formulario está en modo solo lectura.
     * Cuando es `true`, los campos del formulario no se pueden editar.
     */
    soloLectura: boolean = false;
    
  /** Sujeto para manejar la destrucción del componente. */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
     /**
     * Constructor del componente.
     * @param certificadoService Servicio para gestionar certificados.
     * @param fb Constructor de formularios.
     * @param validacionesService Servicio para validar formularios.
     * @param store Almacén de datos del trámite.
     * @param query Consulta de datos del trámite.
     */
    constructor(private consultaioQuery: ConsultaioQuery) {
      // El constructor se utiliza para la inyección de dependencias.
       this.consultaioQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroyed$),
          map((seccionState) => {
            this.consultaDatos = seccionState;
            this.soloLectura = this.consultaDatos.readonly;
          })
        )
        .subscribe()
    }
    /**
     * Método que se ejecuta al destruir el componente.
     * Se utiliza para limpiar los recursos y evitar fugas de memoria.
     */
    ngOnDestroy(): void {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    }
}
