import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CONFIGURACIONCOLUMNA, ID_PROCEDIMIENTO } from '../../enum/mercancias.enum';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { CatalogoServices } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosProcedureQuery } from '../../../261103/estados/tramites261103.query';
import { DatosProcedureState } from '../../../261103/estados/tramites261103.store';
import { DatosSolicitudService } from '../../services/datoSolicitude.service';
import { Domicilio } from '../../modelos/domicilio-establecimientos.model';
import { FormGroup } from '@angular/forms';
import { Mercancias } from '../../modelos/mercancias.model';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src'
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';
@Component({
  selector: 'app-mercancias',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent, CatalogoSelectComponent, TituloComponent, ReactiveFormsModule],
  templateUrl: './mercancias.component.html',
  styleUrl: './mercancias.component.scss',
})
export class MercanciasComponent implements OnInit, OnDestroy {
  /**
 * Formulario reactivo para datos preoperativos.
 */
  domicilioEstablecimiento!: FormGroup;
  /**
* Formulario reactivo para datos preoperativos.
*/
  aduanaFormulario!: FormGroup;
  /** Enum para el tipo de selección de tabla */
  public TablaSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /** Array para almacenar la respuesta de permisos cancelar */
  mercanciasDatas: Mercancias[] = [];

  /**
   * Array para almacenar los datos de las aduanas.
   * 
   * Esta propiedad contiene una lista de objetos `Domicilio` que representan
   * la información de las aduanas disponibles. Los datos se cargan desde un
   * archivo JSON a través del servicio `DatosSolicitudService`
   * en el método `mercanciasData()`.
   */
  aduanaData: Domicilio[] = [];


      /**
       * Configuración de las columnas de la tabla para mostrar los trámites asociados.
       */
      configuracionTabla: ConfiguracionColumna<Mercancias>[] =
        CONFIGURACIONCOLUMNA;
    /**
 * Estado de la sección que contiene los datos del procedimiento.
 * 
 * Esta propiedad almacena el estado actual de los datos relacionados con el procedimiento.
 * Se inicializa a través de un observable en el método `obtenerDatosFormulario`, 
 * que suscribe a los cambios en el estado y actualiza esta propiedad con los datos más recientes.
 * 
 * Tipo: `DatosProcedureState`
 * 
 * @private
 */
  private seccionState!: DatosProcedureState;

/**
 * Subject para notificar la destrucción del componente.
 */
private destroyNotifier$: Subject<void> = new Subject();

/**
* Indica si el formulario está en modo solo lectura.
* Cuando es `true`, los campos del formulario no se pueden editar.
*/
esFormularioSoloLectura: boolean = false;
  /**
  * @property {string} idProcedimiento
  * @description
  * Identificador del procedimiento.
  */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;
  /**
   * Constructor para SolicitanteComponent.
   * 
   * @param fb - Una instancia de FormBuilder utilizada para crear y gestionar formularios.
   */
  
  constructor( 
    private fb: FormBuilder,
    private datosSolicitudService: DatosSolicitudService,
    private query: DatosProcedureQuery, private consultaioQuery: ConsultaioQuery, private catalogoService: CatalogoServices
  ) {
      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState: { readonly: boolean }) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.crearFormulario();
        })
      )
      .subscribe() 
  }

   /**
 * Inicializa el estado del formulario.
 * 
 * Este método realiza las siguientes acciones dependiendo del modo del formulario:
 * 
 * 1. Si el formulario está en modo solo lectura (`esFormularioSoloLectura`):
 *    - Llama al método `crearFormulario` para inicializar el formulario reactivo.
 * 
 * 2. Si el formulario no está en modo solo lectura:
 *    - Llama al método `mercanciasData` para cargar los datos de las mercancías.
 *    - Llama al método `obtenerDatosFormulario` para obtener los datos del estado actual.
 *    - Llama al método `crearFormulario` para inicializar el formulario reactivo.
 * 
 * Este método es útil para configurar el estado inicial del formulario y sincronizarlo
 * con los datos del estado global de la aplicación.
 * 
 * @returns {void}
 */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {      
      this.crearFormulario();
    }
  }

  /**
   * Guarda los datos del formulario y configura su estado según el modo de solo lectura.
   * 
   * Este método realiza las siguientes acciones:
   * 1. Llama al método `crearFormulario` para inicializar o recrear el formulario reactivo.
   * 2. Evalúa el estado de `esFormularioSoloLectura`:
   *    - Si es `true`: Deshabilita el formulario de aduanas para evitar modificaciones.
   *    - Si es `false`: Habilita el formulario de aduanas para permitir la edición.
   * 
   * Este método es útil para sincronizar el estado del formulario con la configuración
   * de solo lectura del componente.
   * 
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    this.crearFormulario();
    if (this.esFormularioSoloLectura) {
      this.aduanaFormulario.disable();
    } else {
       this.aduanaFormulario.enable();
    }
  }
  
  /**
   * Gancho de ciclo de vida que se llama después de que se inicializan las propiedades enlazadas a datos de una directiva.
   * Inicializa el componente configurando los valores del formulario.
   * 
   */
  ngOnInit(): void {
    this.getValorStore();
    this.mercanciasData();
    this.obtenerDatosFormulario();
    this.inicializarEstadoFormulario();
  }

   /**
 * Método para crear y configurar el formulario reactivo `aduanaFormulario`.
 * 
 * Este formulario contiene un único control llamado `aduanaFormulario`, que se inicializa
 * con el estado actual de la sección (`seccionState`). Este estado es obtenido
 * previamente a través de un observable en el método `obtenerDatosFormulario`.
 * 
 * El formulario es utilizado para gestionar los datos relacionados con la aduanaFormulario
 * en el contexto del componente.
 */
  crearFormulario(): void {   
    this.aduanaFormulario = this.fb.group({
      aduanas: [this.seccionState?.aduanas],
    });
  }
 
 /**
   * Obtiene el estado actual del trámite desde el store.
   */
  getValorStore(): void {
    this.query.selectProrroga$.pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe(
      (data) => {        
        this.seccionState = data;
      }
    );
  }

   /**
   * Cargar datos de domicilioEstablecimiento
   */
  mercanciasData(): void {
    this.datosSolicitudService.getMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(response => {
        this.mercanciasDatas = response;
      });
    /* Carga los datos de las aduanas desde el catálogo */
    this.catalogoService.aduanasCatalogo(String(this.idProcedimiento)).subscribe(response => {
    this.aduanaData = response.datos?.map(item => ({
      id: Number(item.clave),
      descripcion: item.descripcion,
      })) || [];
    });
   /* Carga los datos del catálogo scian */
    this.catalogoService.scianCatalogo(String(this.idProcedimiento)).subscribe(response => {
    });
  }

/**
* Gancho de ciclo de vida obtenerDatosFormulario
*/
  obtenerDatosFormulario(): void {
    this.query.selectProrroga$?.pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: DatosProcedureState) => {
        this.seccionState = data;
      });
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
 
}