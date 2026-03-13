import { Component, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {Subject, map, takeUntil } from 'rxjs';
import { DepositoFiscalManufacturaVehiculosApiService } from '../../services/deposito-fiscal-manufactura-vehiculos-api.service';
/**
 * **Componente Paso Uno**  
 * 
 * Representa el primer paso dentro del flujo de pasos en la aplicación.  
 * Este componente maneja la lógica y la interfaz de usuario para la primera sección del proceso.
 */
@Component({
  selector: 'app-paso-uno', // Selector utilizado para incluir este componente en otros archivos HTML.
  templateUrl: './paso-uno.component.html', // Ruta de la plantilla HTML asociada a este componente.
})

export class PasoUnoComponent implements OnInit {
  /**
   * **Índice del tab actual**  
   * Representa la pestaña actualmente seleccionada en la interfaz.
   */
  indice: number = 1;

  /**
   * Subject utilizado para limpiar las suscripciones al destruir el componente.
   * Se emite un valor y se completa en ngOnDestroy para evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();

  
  /** Subject para notificar la destrucción del componente. */
  public consultaState!:ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  
  /**
   * **Cambia la pestaña seleccionada**  
   * 
   * - Recibe un índice `i` y lo asigna a la variable `indice`.
   * - Se usa para actualizar la vista y mostrar el contenido de la pestaña correspondiente.
   * 
   * @param i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Constructor del componente.
   * @param depositoFiscalManufacturaVehiculosApiService Servicio para interactuar con la API de depósito fiscal.
   * @param consultaQuery Consulta para obtener el estado actual del store.
   */
  constructor(
    private depositoFiscalManufacturaVehiculosApiService: DepositoFiscalManufacturaVehiculosApiService,
    private consultaQuery: ConsultaioQuery
  ) {
    // Inicialización de servicios inyectados.
  }

  /**
   * Método de ciclo de vida que se ejecuta al inicializar el componente.
   * Se suscribe al estado del store y decide si cargar datos del formulario.
   */
  ngOnInit(): void {
    // Se suscribe al observable del estado y actualiza la propiedad local.
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();

    // Si el estado indica actualización, carga los datos del formulario.
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      // Si no, marca que ya hay datos de respuesta.
      this.esDatosRespuesta = true;
    }

    // Llama a la función para cargar datos del formulario.
    this.guardarDatosFormulario();
  }

      /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.depositoFiscalManufacturaVehiculosApiService
      .obtenerDatosInicialesFormulario().pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.depositoFiscalManufacturaVehiculosApiService.actualizarEstadoFormulario(resp);
        }
      });
  }


}
