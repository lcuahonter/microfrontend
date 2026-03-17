import { Component, Input, OnDestroy } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import {
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Bitacora } from '../../models/bitacora.model';
import { TABLA_BITACORA } from '../../constantes/bitacora.enum';

/**
 * Componente para mostrar la tabla de bitácoras.
 */
@Component({
  selector: 'app-bitacora-tabla',
  standalone: true,
  imports: [TituloComponent, TablaDinamicaComponent],
  templateUrl: './bitacora.component.html',
  styleUrl: './bitacora.component.scss',
})
export class BitacoraTablaComponent implements OnDestroy {
  /**
   * Lista de bitácoras obtenidas del servicio
   * @type {Bitacora[]}
   */
  @Input() bitacoraDatos: Bitacora[] = [];

  /**
   * Configuración de la tabla de bitácoras
   * @type {ConfiguracionColumna<Bitacora>[]}
   */
  configuracionTabla = TABLA_BITACORA;

  /**
   * Tabla de selección de bitácoras
   * @type {TablaSeleccion}
   */
  tablaSeleccion = TablaSeleccion;

  /**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;

  /**
   * Sujeto para manejar la destrucción del componente.
   */
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
      .subscribe();
  }
  
  /**
   * Método que se ejecuta cuando el componente se destruye.
   * Se utiliza para limpiar los recursos y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
