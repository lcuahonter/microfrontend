import { ActivatedRoute } from '@angular/router';
import { AutoridadService } from '../../services/autoridad.service';
import { CapturarRequerimientoComponent } from '../capturar-requerimiento/capturar-requerimiento.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { EventEmitter } from '@angular/core';
import { FolioTramite } from '../../models/datos-tramite.model';
import { FormBuilder } from '@angular/forms';
import { FormaRequerimiento } from '../../models/datos-tramite.model';
import { FormsModule } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';


@Component({
  selector: 'app-requiremento',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, CapturarRequerimientoComponent],
  templateUrl: './requiremento.component.html',
  styleUrl: './requiremento.component.css'
})
export class RequirementoComponent implements OnInit, OnDestroy {

  /**
   * Representa el folio asociado al trámite.
   * 
   * @type {any} - El tipo es genérico, se recomienda especificar un tipo más concreto si es posible.
   */
  folioTramite: FolioTramite = {} as FolioTramite;

  /**
    * Índice del paso actual en el wizard.
    * 
    * Esta propiedad indica el índice del paso actual en el wizard, comenzando desde 1.
    */
  indice: number = 1;

    /**
   * Evento de continuar.
   * 
   * Esta propiedad utiliza `@Output` para emitir un evento `continuarEvento` con una cadena como valor.
   */
  @Output() continuarEvento = new EventEmitter<string>();

    /**
     * @private
     * @description Sujeto utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
     * Se emite un valor cuando el componente se destruye, lo que permite completar las suscripciones activas.
     */
    private destroy$: Subject<void> = new Subject<void>();

    /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

     /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private consultaioQuery: ConsultaioQuery,
    private autoridadService: AutoridadService
    ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Obtiene el valor de `folioTramite` desde el estado del historial de navegación.
   * - Se suscribe al observable `selectConsultaioState$` para obtener el estado de la consulta,
   *   actualizando las propiedades `consultaDatos` y `soloLectura` según corresponda.
   * - Si la propiedad `update` de `consultaDatos` es verdadera, llama al método `guardarDatosFormulario()`.
   * - En caso contrario, establece el modo de solo lectura (`soloLectura`) en verdadero.
   */
  ngOnInit(): void {
    const FOLIO_TRAMITE = history.state.data;
    this.folioTramite = {
            folioTramite: FOLIO_TRAMITE?.row?.folioTramite,
            tipoTramite: FOLIO_TRAMITE?.row?.tipoTramite,
          };
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroy$),
      map((seccionState) => {
        this.consultaDatos = seccionState;
        this.soloLectura = this.consultaDatos.readonly;
      })
    )
    .subscribe();
     if (this.consultaDatos.update) {
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
    this.autoridadService
      .agregarRequerimiento()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: FormaRequerimiento) => {
        if (resp) {
          this.folioTramite = {
            folioTramite: resp.folioTramite,
            tipoTramite: resp.tipoTramite,
          };

          this.esDatosRespuesta = true;
          this.autoridadService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
  * Selecciona una pestaña.
  * @param i El índice de la pestaña a seleccionar.
  */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

    /**
 * Método para emitir un evento de continuar.
 * 
 * Este método emite un evento `continuarEvento` con una cadena vacía como valor.
 * Se utiliza para indicar que se debe continuar al siguiente paso en el proceso.
 * 
 * @example
 * // Llamar al método para emitir el evento de continuar
 * this.continuar();
 */
  continuar(): void {
    this.continuarEvento.emit('');
  }

  /**
   * Navega a la ruta principal de pago de autoridad.
   * Este método se utiliza para cancelar la acción actual y redirigir al usuario
   * a la página principal de la sección de pagos de autoridad.
   */
  cancelar(): void {
    this.router.navigate(['/pago/autoridad/main']);
  }

    /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Aquí se utiliza para emitir un valor en el observable `destroy$` y completar su emisión,
   * asegurando la limpieza de suscripciones y evitando posibles fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
