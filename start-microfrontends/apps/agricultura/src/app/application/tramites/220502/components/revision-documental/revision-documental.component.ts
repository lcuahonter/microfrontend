import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosGeneralesComponent } from '../datos-generales/datos-generales.component';
import { PagoDeDerechosComponent } from '../pago-de-derechos/pago-de-derechos.component';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { TercerosRelacionadosComponent } from '../terceros-relacionados/terceros-relacionados.component';

/**
 * Componente para la revisión documental.
 */
@Component({
  selector: 'app-revision-documental',
  templateUrl: './revision-documental.component.html',
  styleUrl: './revision-documental.component.scss',
  standalone: true,
  imports: [
    DatosGeneralesComponent,
    TercerosRelacionadosComponent,
    PagoDeDerechosComponent,
    CommonModule,
  ],
})
export class RevisionDocumentalComponent implements OnInit, OnDestroy {
  /**
   * Índice del tab seleccionado.
   * @type {number}
   */
  indice: number = 1;
  /**
   * Indica si el contenido es colapsable.
   * @type {boolean}
   */
  colapsable: boolean = true;
  /**
   * Índice actual de la fila.
   * @type {number}
   */
  indiceActual: number = 1;

  /**
   * Formulario principal.
   * @type {any}
   */
  forma: string = '';

  /**
   * Estado de la consulta, utilizado para manejar el estado del formulario.
   */
  public consultaState!: ConsultaioState;

  /**
   * Datos de respuesta del servidor utilizados para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * Se utiliza para la inyección de dependencias necesarias para la funcionalidad del componente.
   *
   * @param consultaQuery Servicio para consultar información.
   * @param solicitudPantallasService Servicio para gestionar las solicitudes de pantallas.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solicitudPantallasService: SolicitudPantallasService
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * @method ngOnInit
   * Inicializa el componente al cargarse.
   *
   * - Se suscribe al estado de consulta usando `consultaQuery.selectConsultaioState$`
   *   y almacena el resultado en `consultaState`.
   * - Si `consultaState.update` es verdadero, llama al método `guardarDatosFormulario()`.
   * - Si no, establece `esDatosRespuesta` en `true`.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();

    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.solicitudPantallasService
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
        }
      });
  }

  /**
   * Selecciona un tab específico.
   * @param {number} i - El índice del tab a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Se utiliza para limpiar los recursos y evitar fugas de memoria.
   * @return {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
