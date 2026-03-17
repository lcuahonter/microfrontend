/**
 * compo doc
 * @component Datos90305Component
 * @description
 * Componente que gestiona la información del solicitante en el trámite 90305.
 * Permite seleccionar el tipo de persona y cambiar entre diferentes pestañas de datos.
 */
import { Component,OnInit, ViewChild} from '@angular/core';
import { ConsultaioQuery, ConsultaioState} from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { DatosCertificado110203Component } from '../../components/datos-certificado-110203/datos-certificado-110203.component';
import { Destinatario110203Component } from '../../components/destinatario-110203/destinatario-110203.component';
import { Solocitud110203Service } from '../../service/service110203.service';
import { Tramite110203Query } from '../../../../estados/queries/tramite110203.query';
/**
 * compo doc
 * @selector app-datos-90305
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html'
})
export class DatosComponent implements OnInit {
  /**
  * Índice actual del subtítulo seleccionado en la interfaz.
  */
 indice: number = 1;

 /**
  * Método para actualizar el índice del subtítulo seleksccionado.
  * 
  * @param i - Índice de la pestaña seleccionada.
  */
 seleccionaTab(i: number): void {
   this.indice = i;
 }
  /** Bandera que indica si los datos de respuesta están disponibles o han sido cargados.  
 *  Se utiliza para controlar la lógica de visualización o validación en el componente. */
   public esDatosRespuesta: boolean = false;
   /** Almacena el estado actual de la consulta relacionada con el trámite.  
 *  Contiene información necesaria para mostrar o procesar datos en el componente. */
   public consultaState!:ConsultaioState;
   /** Notificador utilizado para cancelar suscripciones al destruir el componente.  
 *  Ayuda a prevenir fugas de memoria en flujos observables. */
   private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Referencia al componente hijo "DestinatarioComponent" para acceder a sus métodos y propiedades.
   */
  @ViewChild('DestinatarioComponent', { static: false }) destinatarioComponent!: Destinatario110203Component;
  /**
   * Referencia al componente hijo "DatosCertificadoComponent" para acceder a sus métodos y propiedades.
   */
  @ViewChild('DatosCertificadoComponent', { static: false }) datosCertificadoComponent!: DatosCertificado110203Component;


   /** Constructor que inyecta el servicio del trámite 221601 y el query de consulta.  
 *  Permite acceder a los datos y lógica necesaria para el componente. */
    constructor(
    private Solocitud110203Service: Solocitud110203Service,
    private consultaQuery: ConsultaioQuery,
    public tramiteQuery: Tramite110203Query,
  ) {
// Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }
  /** Inicializa el componente suscribiéndose al estado de consulta.  a
 *  Ejecuta lógica según si se requiere actualización o solo visualización. */
      ngOnInit(): void {
     this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$))
        .subscribe((seccionState) => {
          this.consultaState = seccionState
          if (this.consultaState.update) {
             this.guardarDatosFormulario();
             } else {
              this.esDatosRespuesta = true;
            }
        });
        
  }
 /** Obtiene los datos del formulario desde un JSON simulado y actualiza el store.  
 *  Marca la bandera de respuesta si la información es válida. */
     guardarDatosFormulario(): void {
    this.Solocitud110203Service
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.Solocitud110203Service.actualizarEstadoFormulario(resp);
        }
      });
  }

/**
 * Valida todos los formularios requeridos, incluyendo el formulario del componente destinatario.
 *
 * @returns `true` si todos los formularios son válidos; `false` si alguno no lo es.
 */
  public validarFormularios(): boolean {
  let allValid = true;

      if (this.destinatarioComponent) {
      if (!this.destinatarioComponent.validarFormularios()) {
        allValid = false;
      }
    } else {
      allValid = false;
    }

    if (this.datosCertificadoComponent) {
      if (!this.datosCertificadoComponent.validarFormularios()) {
        allValid = false;
      }
    } else {
      allValid = false;
    }

  return allValid;
  }
}
