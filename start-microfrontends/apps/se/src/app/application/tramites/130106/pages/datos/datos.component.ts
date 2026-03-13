/**
 * compo doc
 * @component Datos90305Component
 * @description
 * Componente que gestiona la información del solicitante en el trámite 90305.
 * Permite seleccionar el tipo de persona y cambiar entre diferentes pestañas de datos.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { DatosDeLaSolicitudComponent } from '../../components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { Solocitud130106Service } from '../../service/service130106.service';

/**
 * compo doc
 * @selector app-datos-90305
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html'
})
export class DatosComponent implements OnInit {
  /** Bandera que indica si los datos de respuesta están disponibles o han sido cargados.  
   *  Se utiliza para controlar la lógica de visualización o validación en el componente. */
  public esDatosRespuesta: boolean = false;
  /** Almacena el estado actual de la consulta relacionada con el trámite.  
*  Contiene información necesaria para mostrar o procesar datos en el componente. */
  public consultaState!: ConsultaioState;
  /** Notificador utilizado para cancelar suscripciones al destruir el componente.  
*  Ayuda a prevenir fugas de memoria en flujos observables. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Índice actual del subtítulo seleccionado en la interfaz.
   */
  indice: number = 1;

  /**
     * Referencia al componente SolicitanteComponent mediante ViewChild.
     * Se utiliza para invocar métodos o acceder a propiedades del componente hijo.
     */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /** Referencia al componente CertificadoOrigenComponent mediante ViewChild. */
  @ViewChild(DatosDeLaSolicitudComponent, { static: false }) datosDeLaSolicitud!: DatosDeLaSolicitudComponent;
  
  /** Constructor que inyecta el servicio del trámite 130106 y el query de consulta.  
*  Permite acceder a los datos y lógica necesaria para el componente. */
  constructor(
    private solocitud130106Service: Solocitud130106Service,
    private consultaQuery: ConsultaioQuery
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }


  /** Inicializa el componente suscribiéndose al estado de consulta.  a
 *  Ejecuta lógica según si se requiere actualización o solo visualización. */
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
   * Método para actualizar el índice del subtítulo seleksccionado.
   * 
   * @param i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Obtiene los datos del formulario desde un JSON simulado y actualiza el store.  
  *  Marca la bandera de respuesta si la información es válida. */
  guardarDatosFormulario(): void {
    this.solocitud130106Service
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solocitud130106Service.actualizarEstadoFormulario(resp);
        }
      });
  }
}
