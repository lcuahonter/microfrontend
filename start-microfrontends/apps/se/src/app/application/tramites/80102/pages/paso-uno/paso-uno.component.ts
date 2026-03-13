import { Component, OnDestroy ,OnInit} from '@angular/core';
import { ConsultaioQuery, ConsultaioState, FormularioDinamico, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { AggregarComplimentosComponent } from '../../components/aggregar-complimentos/aggregar-complimentos.component';
import { AutorizacionProgrmaNuevoService } from '../../services/autorizacion-programa-nuevo.service';
import { CommonModule } from '@angular/common';
import { ContenedorAnnexoDosTresComponent } from '../../components/contenedor-annexo-dos-tres/contenedor-annexo-dos-tres.component';
import { ContenedorAnnexoUnoComponent } from '../../components/contenedor-annexo-uno/contenedor-annexo-uno.component';
import { EmpresasSubfabricanteComponent } from '../../components/empresas-subfabricante/empresas-subfabricante.component';
import { FederatariosYPlantasVistaComponent } from '../../components/federatarios-y-plantas-vista/federatarios-y-plantas-vista.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiciosComponent } from "../../components/servicios/servicios.component";
import { Tramite80102Query } from '../../estados/tramite80102.query';

import { Tramite80102State, Tramite80102Store } from '../../estados/tramite80102.store';
import { ProyectoImmexVistaComponent } from '../../components/proyecto-immex-vista/proyecto-immex-vista.component';


@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SolicitanteComponent,
    ServiciosComponent,
    AggregarComplimentosComponent,
    EmpresasSubfabricanteComponent,
    ContenedorAnnexoDosTresComponent,
    ContenedorAnnexoUnoComponent,
    FederatariosYPlantasVistaComponent,
    ProyectoImmexVistaComponent
],
  host: { hostID: crypto.randomUUID().toString() },
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Representa el tipo de persona (por ejemplo, persona moral o física).
   * @type {number}
   */
  tipoPersona!: number;

  /**
   * Arreglo que contiene los datos dinámicos relacionados con el domicilio fiscal.
   * @type {FormularioDinamico[]}
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   *
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Índice que controla la selección de las pestañas en la interfaz.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;
  
   /** Indica si el formulario está deshabilitado. */
 public formularioDeshabilitado: boolean = false;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Constructor de la clase PasoUnoComponent.
   * 
   * @param query Servicio para consultar el estado de Tramite80102.
   * @param store Almacén para gestionar el estado de Tramite80102.
   * @param consultaQuery Servicio para consultar el estado de Consultaio.
   * @param autorizacionProgrmaNuevoService Servicio público para la autorización de nuevos programas.
   * 
   * Suscribe al observable `selectConsultaioState$` de `consultaQuery` y actualiza la propiedad `consultaState`
   * cada vez que el estado de la sección cambia, hasta que se emita la notificación de destrucción del componente.
   */
  constructor(private query:Tramite80102Query,private store:Tramite80102Store,
    private consultaQuery: ConsultaioQuery, public autorizacionProgrmaNuevoService: AutorizacionProgrmaNuevoService
  ) {
  
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Si el estado de consulta (`consultaState`) existe, el `procedureId` es '80102' y la propiedad `update` es verdadera,
   *   se llama al método `guardarDatosFormulario()` para guardar los datos del formulario.
   * - En caso contrario, se establece la variable `esDatosRespuesta` en `true`.
   * - Además, se suscribe al observable `indicePrevioRuta$` para actualizar el índice (`indice`) cuando se emite un nuevo valor,
   *   asegurando la limpieza de la suscripción al destruir el componente mediante `takeUntil(this.destroyNotifier$)`.
   */
  ngOnInit():void{
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
                 this.formularioDeshabilitado = seccionState.readonly;
          if (
            this.consultaState &&
            this.consultaState.procedureId === '80102' &&
            this.consultaState.update &&
            this.consultaState.id_solicitud
          ) {
            this.guardarDatosFormulario(this.consultaState.id_solicitud);
            this.store.setIdSolicitud(
              Number(this.consultaState.id_solicitud)
            );
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();

    this.query.indicePrevioRuta$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((indice: number) => {
     if(indice){
      this.indice = indice;
     }
      });
  }

/**
 * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
 * Luego reinicializa el formulario con los valores actualizados desde el store.
 */
  guardarDatosFormulario(id_solicitud: string): void {
    const BODY = {
      idSolicitud: id_solicitud,    
    };
    this.autorizacionProgrmaNuevoService
      .fetchMostrarDatos(BODY.idSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        const RESPONSE = resp as { datos?: unknown };
        if (RESPONSE?.datos) {
          const DATOS = Array.isArray(RESPONSE.datos)
            ? RESPONSE.datos[0]
            : RESPONSE.datos;
          if (DATOS) {
            const MAPPED_DATA =
              this.autorizacionProgrmaNuevoService.reverseBuildSolicitud80102(
                DATOS as Record<string, unknown>
              );
            this.autorizacionProgrmaNuevoService.actualizarEstadoFormulario(
              MAPPED_DATA as unknown as Tramite80102State
            );
          }
          this.esDatosRespuesta = true;
        }
      });
  }


  /**
   * Cambia el índice de la pestaña seleccionada.
   * Se utiliza para cambiar la pestaña activa en la interfaz.
   *
   * @param {number} i - El índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.store.setindicePrevioRuta(i);
  }

   /**
     * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
     * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
     * @method ngOnDestroy
     */
   ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
