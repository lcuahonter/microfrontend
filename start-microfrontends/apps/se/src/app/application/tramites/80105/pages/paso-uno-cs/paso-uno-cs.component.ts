import { CONFIGURACION_DOS_DATOS,SECCIONES_TRAMITE_230401 } from '../../constantes/nuevo-programa.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState} from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { FraccionArancelariaDescripcion } from '../../../../shared/models/empresas.model';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { Solocitud80105Service } from '../../services/service80105.service';
import { NuevoProgramaIndustrialService } from '../../services/modalidad-terciarización.service';
import { Tramite80101State } from '../../estados/tramite80101.store';
@Component({
  selector: 'app-paso-uno-cs',
  templateUrl: './paso-uno-cs.component.html',
})
export class PasoUnoCsComponent implements OnInit, OnDestroy {

/** Bandera que indica si los datos de respuesta están disponibles o han sido cargados.  
 *  Se utiliza para controlar la lógica de visualización o validación en el componente. */
   public esDatosRespuesta: boolean = false;
   /** Almacena el estado actual de la consulta relacionada con el trámite.  
 *  Contiene información necesaria para mostrar o procesar datos en el componente. */
   public consultaState!:ConsultaioState;
   /** Notificador utilizado para cancelar suscripciones al destruir el componente.  
 *  Ayuda a prevenir fugas de memoria en flujos observables. */
   private destroyNotifier$: Subject<void> = new Subject();
  /*
  * Almacena la configuración de las pestañas del primer paso.
  */
   configuracionDosDatos: ConfiguracionColumna<FraccionArancelariaDescripcion>[] =CONFIGURACION_DOS_DATOS

  /*
  * Almacena la configuración de las pestañas del primer paso.
  */
  indice: number = 1;

  /** Indica si el formulario está deshabilitado. */
  public formularioDeshabilitado: boolean = false;


  constructor(private seccionStore: SeccionLibStore, private solocitud80105Service: Solocitud80105Service,
      private consultaQuery: ConsultaioQuery,private nuevoProgramaIndustrialService:NuevoProgramaIndustrialService){
    this.asignarSecciones();
  }


  /**
   * Selecciona una pestaña específica.
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
  * Método para asignar las secciones existentes al stored
  */
  private asignarSecciones(): void {
    const SECCIONES: boolean[] = [];
    const FORMA_VALIDA: boolean[] = [];
    const PREDETERMINADO = SECCIONES_TRAMITE_230401
    for (const LLAVE_SECCION in PREDETERMINADO.PASO_1) {
      if (Object.prototype.hasOwnProperty.call(PREDETERMINADO.PASO_1, LLAVE_SECCION)) {
        const KEY = LLAVE_SECCION as keyof typeof PREDETERMINADO.PASO_1;
        SECCIONES.push(PREDETERMINADO.PASO_1[KEY]);
        FORMA_VALIDA.push(false);
      }
    }
  }
 /** Inicializa el componente suscribiéndose al estado de consulta.  a
 *  Ejecuta lógica según si se requiere actualización o solo visualización. */
  ngOnInit(): void {
     this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$))
        .subscribe((seccionState) => {
          this.consultaState = seccionState
          if (this.consultaState &&
            this.consultaState.procedureId === '80105' &&
            this.consultaState.update &&
            this.consultaState.id_solicitud) {
              this.guardarDatosFormulario(this.consultaState.id_solicitud);
            } else {
              this.esDatosRespuesta = true;
            }
        });        
  }

  /** Obtiene los datos del formulario desde la API y actualiza el store.  
 *  Marca la bandera de respuesta si la información es válida. */
  guardarDatosFormulario(id_solicitud: string): void {
    this.nuevoProgramaIndustrialService
      .fetchMostrarDatos(id_solicitud).pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
          const RESPONSE = resp as { datos?: unknown };
          if (RESPONSE?.datos) {
            const DATOS = Array.isArray(RESPONSE.datos)
            ? RESPONSE.datos[0]
            : RESPONSE.datos;
            if (DATOS) {
              const MAPPED_DATA =
              this.nuevoProgramaIndustrialService.reverseBuildSolicitud80105(
                DATOS as Record<string, unknown>
              );
              this.nuevoProgramaIndustrialService.actualizarEstadoFormulario(
                MAPPED_DATA as unknown as Tramite80101State
              );
            }
            this.esDatosRespuesta = true;
          }
        }
      });
  }

  /** Obtiene los datos del formulario desde un JSON simulado y actualiza el store.  
 *  Marca la bandera de respuesta si la información es válida. */
    guardarDatosFormularioJson(): void {
    this.solocitud80105Service
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.solocitud80105Service.actualizarEstadoFormulario(resp);
        }
      });
          this.solocitud80105Service
      .getRegistroTomaMuestrasMercanciasDatas().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.solocitud80105Service.actualizarEstadoFormularios(resp);
        }
      });
          this.solocitud80105Service
      .getRegistroComplementosData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.solocitud80105Service.actualizarComplementos(resp);
        }
      });
      this.solocitud80105Service
      .getRegistroFederatoriosData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.solocitud80105Service.actualizarFederatorios(resp);
        }
      });
        this.solocitud80105Service
      .getRegistroComplementarData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.solocitud80105Service.actualizarComplementar(resp);
        }
      });
  }
 /**
   * Método del ciclo de vida `ngOnDestroy()`.
   * Este método se ejecuta cuando el componente es destruido y realiza las siguientes acciones:
   *
   * @memberof PagoDeDerechosComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
