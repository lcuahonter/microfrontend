
/**
 * compo doc
 * @component
 * @selector app-paso-uno-cs
 * @description
 * Este componente gestiona el primer paso del trámite 80103, permitiendo la visualización y selección
 * de pestañas y la configuración de las secciones correspondientes. Utiliza el estado centralizado
 * proporcionado por SeccionLibStore para mantener el control de las secciones y la validez de los formularios.
 *
 * Funcionalidades principales:
 * - Visualiza y administra las pestañas correspondientes al paso uno del trámite.
 * - Permite seleccionar la pestaña activa mediante el método `seleccionaTab`.
 * - Asigna las secciones y su validez al store global utilizando la configuración predeterminada.
 *
 * Componentes importados:
 * - `SeccionLibStore`: Store para el manejo del estado de las secciones.
 *
 * @templateUrl ./paso-uno-cs.component.html
 */
import { CONFIGURACION_DOS_DATOS, SECCIONES_TRAMITE_230401 } from '../../constantes/nuevo-programa.enum';
import { Component, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState} from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { Tramite80101State, Tramite80101Store } from '../../estados/tramite80101.store';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { FraccionArancelariaDescripcion } from '../../../../shared/models/empresas.model';
import { NuevoProgramaIndustrialService } from '../../services/modalidad-albergue.service';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { Solocitud80103Service } from '../../services/service80103service';
import { Tramite80101Query } from '../../estados/tramite80101.query';
/*
  * Componente para gestionar el primer paso del trámite 80103.
  * Este componente permite la visualización y selección de pestañas,
  * así como la configuración de las secciones correspondientes.
  *
  * @export
  * @class PasoUnoCsComponent
  */


@Component({
  selector: 'app-paso-uno-cs',
  templateUrl: './paso-uno-cs.component.html',
})
/**
 * Clase que representa el componente del primer paso del trámite 80103.
 * Este componente gestiona la visualización y selección de pestañas,
 * así como la configuración de las secciones correspondientes.
 */
export class PasoUnoCsComponent implements OnInit {
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

/**
 * 
 * @param seccionStore 
 */
  constructor(private seccionStore: SeccionLibStore, private Solocitud80103Service: Solocitud80103Service, private nuevoProgramaIndustrialService: NuevoProgramaIndustrialService, private query:Tramite80101Query, private store:Tramite80101Store,
      private consultaQuery: ConsultaioQuery){
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
    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORMA_VALIDA);
  }
  /** Inicializa el componente suscribiéndose al estado de consulta.  a
   *  Ejecuta lógica según si se requiere actualización o solo visualización. */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.consultaState = seccionState
        this.formularioDeshabilitado = seccionState.readonly;
        if (this.consultaState &&
          this.consultaState.procedureId === '80103' &&
          (this.consultaState.update)) {
          this.guardarDatosFormulario(this.consultaState?.id_solicitud);
          this.store.setIdSolicitud(
            Number(this.consultaState.id_solicitud)
          );
            } else {
            this.esDatosRespuesta = true;
          }
      });        
    }
 /** Obtiene los datos del formulario desde un JSON simulado y actualiza el store.  
 *  Marca la bandera de respuesta si la información es válida. */
     guardarDatosFormulario(id_solicitud: string): void {
      this.nuevoProgramaIndustrialService
            .getMostrarSolicitud(id_solicitud)
            .pipe(takeUntil(this.destroyNotifier$))
            .subscribe((resp) => {
              if (resp) {
                if (resp?.datos) {
                  const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
                  if (DATOS) {
                    const MAPPED_DATA = this.nuevoProgramaIndustrialService.reverseBuildSolicitud80103(DATOS as Record<string, unknown>) as unknown as Tramite80101State;
                    this.nuevoProgramaIndustrialService.actualizarEstadoFormulario(MAPPED_DATA);
                  }
                this.esDatosRespuesta = true;
              }
        }
      });
  }
  
}
