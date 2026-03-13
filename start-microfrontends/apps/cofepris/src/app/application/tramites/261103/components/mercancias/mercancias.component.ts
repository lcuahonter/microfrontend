import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CONFIGURACIONCOLUMNA } from '../../enum/mercancias.enum';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosProcedureQuery } from '../../estados/tramites261103.query';
import { DatosProcedureState } from '../../estados/tramites261103.store';
import { Domicilio } from '../../modelos/domicilio-establecimientos.model';
import { FormGroup } from '@angular/forms';
import { Mercancias } from '../../modelos/mercancias.model';
import { ModificacionPermisoImportacionMedicamentosService } from '../../services/modificacion-permiso-importacion-medicamentos.service'
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
  imports: [CommonModule, TablaDinamicaComponent, CatalogoSelectComponent,TituloComponent, ReactiveFormsModule],
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
   * archivo JSON a través del servicio `ModificacionPermisoImportacionMedicamentosService`
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
   * Constructor para SolicitanteComponent.
   * 
   * @param fb - Una instancia de FormBuilder utilizada para crear y gestionar formularios.
   */
  
  constructor( 
    private fb: FormBuilder,
    private modificacionPermisoImportacionMedicamentosService: ModificacionPermisoImportacionMedicamentosService,
    private query: DatosProcedureQuery,private consultaioQuery: ConsultaioQuery
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
   * 2. Evalúa las condiciones de habilitación basándose en `esFormularioSoloLectura` e `ideGenerica1`.
   * 3. Habilita o deshabilita el formulario según las condiciones evaluadas.
   * 
   * Lógica de habilitación:
   * - Si el formulario está en modo solo lectura, todos los campos se deshabilitan.
   * - Si no está en modo solo lectura, los campos solo se habilitan si `ideGenerica1` es 'Modificacion'.
   * - En cualquier otro caso, los campos se deshabilitan.
   * 
   * Este método es útil para sincronizar el estado del formulario con la configuración
   * de solo lectura del componente.
   * 
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    this.crearFormulario();
    
    // Obtener el valor de ideGenerica1 del estado
    const IDE_GENERICA_1 = this.seccionState?.ideGenerica1;
    
    // Determinar si los campos deben estar habilitados
    const DEBE_ESTAR_HABILITADO = !this.esFormularioSoloLectura && (IDE_GENERICA_1 === 'Modificacion');
    
    if (DEBE_ESTAR_HABILITADO) {
      this.aduanaFormulario.enable();
    } else {
      this.aduanaFormulario.disable();
    }
  }
  
  /**
   * Getter que determina si los componentes deben estar deshabilitados.
   * 
   * Combina la lógica de `esFormularioSoloLectura` e `ideGenerica1` para determinar
   * si los componentes de la interfaz (como app-tabla-dinamica y botones) deben estar deshabilitados.
   * 
   * @returns {boolean} true si los componentes deben estar deshabilitados, false si deben estar habilitados
   */
  get debeEstarDeshabilitado(): boolean {
    const IDE_GENERICA_1 = this.seccionState?.ideGenerica1;
    return this.esFormularioSoloLectura || (IDE_GENERICA_1 !== 'Modificacion');
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
    this.modificacionPermisoImportacionMedicamentosService.getMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(response => {
        this.mercanciasDatas = response;
      });

      this.modificacionPermisoImportacionMedicamentosService.getAduanaData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(response => {
        this.aduanaData = response;
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