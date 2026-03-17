import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService ,SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { ImportacionService } from '../../services/importacion.service';
import { PagoDeDerechosContenedoraComponent } from "../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component";
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260203Query } from '../../estados/queries/tramite260203Query.query';
import { Tramite260203Store } from '../../estados/stores/tramite260203Store.store';

import { GuardarAdapter_260203 } from '../../adapters/guardar-payload.adapter';


/**
 * Decorador que define un componente en Angular.
 * 
 * Este componente representa la primera etapa de un trámite específico (260203) 
 * y utiliza varias dependencias y módulos para su funcionamiento. 
 * Se define como un componente independiente (`standalone`) y utiliza un selector 
 * específico para ser referenciado en otras partes de la aplicación.
 * 
 * Propiedades del decorador:
 * - `selector`: Define el nombre del selector que se utilizará para instanciar este componente.
 * - `standalone`: Indica que el componente es independiente y no requiere un módulo para ser utilizado.
 * - `imports`: Lista de módulos y componentes que se importan para ser utilizados dentro de este componente.
 * - `templateUrl`: Ruta del archivo HTML que define la estructura visual del componente.
 * - `styleUrl`: Ruta del archivo SCSS que contiene los estilos específicos del componente.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    ContenedorDeDatosSolicitudComponent,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosContenedoraComponent
],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnDestroy, OnChanges {
    @Input() confirmarSinPagoDeDerechos: number = 0;
   /**
     * @property {ContenedorDeDatosSolicitudComponent} contenedorDeDatosSolicitudComponent
     * @description
     * Referencia al componente hijo `ContenedorDeDatosSolicitudComponent` obtenida
     * mediante el decorador `@ViewChild`.
     *
     * Esta propiedad permite invocar métodos públicos del contenedor y acceder
     * a sus propiedades, por ejemplo para delegar la validación del formulario
     * interno (`validarContenedor()`).
     *
     * > Nota: Angular inicializa esta referencia después de que la vista
     * ha sido cargada, comúnmente en el ciclo de vida `ngAfterViewInit`.
     */
    @ViewChild(ContenedorDeDatosSolicitudComponent)
    contenedorDeDatosSolicitudComponent!: ContenedorDeDatosSolicitudComponent;

    @ViewChild(PagoDeDerechosContenedoraComponent)
    pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;

    @ViewChild(TercerosRelacionadosVistaComponent)
    tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;
  /**
   * Índice numérico utilizado como referencia o posición actual.
   * Comienza en 1 por defecto.
   *
   * @type {number}
   */
  indice: number | undefined = 1;

  /**
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   *
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
 * Esta variable se utiliza para almacenar el índice del subtítulo.
 */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

 /**
  * Constructor del componente que inicializa el estado de la consulta
  * y determina si se deben guardar los datos del formulario o mostrar solo los datos de respuesta.
  *
  * @param {ConsultaioQuery} consultaQuery - Servicio para obtener el estado de la consulta.
  * @param {ImportacionService} ImportacionService - Servicio para gestionar el permiso sanitario de importación de medicamentos.
  */
  constructor(
    protected store: Tramite260203Store,
    private query: Tramite260203Query,
    private consultaQuery: ConsultaioQuery,
    private importacionService: ImportacionService,
    private registroSolicitudService: RegistroSolicitudService,
  ) {
    this.query.getTabSeleccionado$
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe((tab) => {
            this.indice = tab;
          });
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$)).subscribe((seccionState) => {
        this.consultaState = seccionState;
        if (this.consultaState && this.consultaState.procedureId === '260203' &&
          this.consultaState.update) {
          this.guardarDatosFormulario();
        } else {
          this.esDatosRespuesta = true;
        }
      });  
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['confirmarSinPagoDeDerechos'] && !changes['confirmarSinPagoDeDerechos'].firstChange) {
      const CONFIRMAR_VALOR = changes['confirmarSinPagoDeDerechos'].currentValue;
      if (CONFIRMAR_VALOR) {
        this.seleccionaTab(CONFIRMAR_VALOR);
      }
    }
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
    this.registroSolicitudService.parcheOpcionesPrellenadas(260203,SOLICITUDE_ID).subscribe((res:any) => {
      if(res && res.datos){
        GuardarAdapter_260203.patchToStore(res.datos, this.store);
      }
    });
    this.esDatosRespuesta=true;
  }


  /**
   * Limpia los recursos observables al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Establece el índice seleccionado en el store.
   *
   * @param i - El índice a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.store.updateTabSeleccionado(i);
  }
     /**
   * @description
   * Método que se encarga de validar el primer paso del flujo.
   *
   * Invoca al método `validarContenedor()` del componente hijo
   * `ContenedorDeDatosSolicitudComponent` para comprobar si los
   * datos del formulario son correctos.
   *
   * En caso de que el componente hijo no esté disponible o
   * retorne `null/undefined`, se devuelve `false` por defecto.
   *
   * @returns {boolean}
   * - `true`: si el contenedor y su formulario interno son válidos.
   * - `false`: si el contenedor no es válido o no está disponible.
   */
   validarPasoUno(): boolean {
    const ESTABVALIDO = this.contenedorDeDatosSolicitudComponent?.validarContenedor() ?? false;
    const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;
    return (
      (ESTABVALIDO && ESTERCEROSVALIDO) ? true : false

    );
  }

      /**
   * Valida todos los pasos del formulario.
   *
   * Invoca los métodos de validación de los componentes hijos:
   * - ContenedorDeDatosSolicitudComponent
   * - TercerosRelacionadosVistaComponent
   * - PagoDeDerechosContenedoraComponent
   *
   * @returns {boolean}
   * - `true` si todos los componentes son válidos.
   * - `false` si alguno no es válido o no está disponible.
   */
  validarTodosLosPasos(): boolean {
    const ESTABVALIDO = this.contenedorDeDatosSolicitudComponent?.validarContenedor() ?? false;
    const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent?.validarContenedor() ?? false;
    const PAGOVALIDO = this.pagoDeDerechosContenedoraComponent?.validarContenedor() ?? false;
    return ESTABVALIDO && ESTERCEROSVALIDO && PAGOVALIDO;
  }
}
