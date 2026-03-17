
import { CatalogoSelectComponent, ConfiguracionColumna, TituloComponent } from '@libs/shared/data-access-user/src';
import { CatalogoServices } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261101.query';
import { DatosProcedureState } from '../../../../estados/tramites/tramites261101.store';
import { DatosProcedureStore } from '../../../../estados/tramites/tramites261101.store';
import { DatosSolicitudService } from '../../services/datoSolicitude.service';
import { Domicilio } from '../../modelos/domicilio-establecimientos.model';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ID_PROCEDIMIENTO } from '../../enum/mercancias.enum';
import { InputCheckComponent } from '@libs/shared/data-access-user/src';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SCIAN_DATA } from '../../../../shared/constantes/datos-scian.enum';
import { ScianData } from '../../../../shared/models/datos-modificacion.model';
import { Subject } from 'rxjs';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src'
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';


@Component({
  selector: 'app-domicilio-establecimientos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaDinamicaComponent, TooltipModule, InputCheckComponent, CatalogoSelectComponent, TituloComponent ],
  templateUrl: './domicilio-establecimientos.component.html',
  styleUrl: './domicilio-establecimientos.component.scss',
})
export class DomicilioEstablecimientosComponent implements OnInit, OnDestroy {
  /**
 * Formulario reactivo para datos preoperativos.
 */
  domicilioEstablecimiento!: FormGroup;
  /**
* Formulario reactivo para datos preoperativos.
*/
  AvisodeFuncionamiento!: FormGroup;
  /** Enum para el tipo de selección de tabla */
  public TablaSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /** Array para almacenar la respuesta de permisos cancelar */
  Domicilios: Domicilio[] = [];

  /**
   * Configuración de columnas para la tabla de datos SCIAN.
   */
  configuracionTabla: ConfiguracionColumna<ScianData>[] = SCIAN_DATA;
  /**
 * Datos cargados dinámicamente para la tabla SCIAN.
 */
  datosData: ScianData[] = [];
  /**
* Enum para la selección de tablas.
*/
  tipoSeleccionTabla = TablaSeleccion;
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

  /** Datos de regimenes obtenidos desde el catálogo */
  public regimenesData: Domicilio[] = [];
  /** Datos de estados obtenidos desde el catálogo */
  public estadosData: Domicilio[] = [];
  /**
   * Constructor del componente DomicilioEstablecimientosComponent.
   * 
   * Este constructor inicializa las dependencias necesarias para el funcionamiento del componente.
   * 
   * @param fb - Instancia de FormBuilder utilizada para crear y gestionar formularios reactivos.
   * @param datosSolicitudService - Servicio encargado de manejar las solicitudes relacionadas con los datos del formulario.
   * @param store - Almacén de estado (store) utilizado para gestionar y actualizar el estado de los datos del procedimiento.
   * @param query - Consulta (query) utilizada para obtener datos del estado del procedimiento.
   */
  constructor(private fb: FormBuilder,
    private datosSolicitudService: DatosSolicitudService,
    private store: DatosProcedureStore,
    private query: DatosProcedureQuery,
    private consultaioQuery: ConsultaioQuery,
    private catalogoService: CatalogoServices
  ) {
                /**
             * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
             *
             * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
             * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
             * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
             */
                this.consultaioQuery.selectConsultaioState$
                .pipe(
                  takeUntil(this.destroyNotifier$),
                  map((seccionState: { readonly: boolean })=>{
                    this.esFormularioSoloLectura = seccionState.readonly; 
                    this.guardarDatosFormulario();
                  })
                )
                .subscribe()
  }

/**
 * Método del ciclo de vida Angular que se ejecuta al inicializar el componente.
 * 
 * Este método realiza las siguientes acciones:
 * 1. Carga los datos almacenados en el estado mediante `loadStorData`.
 * 2. Inicializa el formulario reactivo para el domicilio del establecimiento con `establecerdomicilioEstablecimiento`.
 * 3. Configura el formulario reactivo para el aviso de funcionamiento con `avisodeFuncionamientomiento`.
 * 4. Carga los datos del catálogo SCIAN con `loadScian`.
 * 
 * @returns {void}
 */
ngOnInit(): void {
  this.inicializarEstadoFormulario();
  /* Carga los datos de los catálogos necesarios */
  this.catalogoService.regimenesCatalogo(String(this.idProcedimiento)).subscribe(response => {
      this.regimenesData = (response.datos?.map((item: any) => {
        return {
          id: item.clave,
          descripcion: item.descripcion
        };
      })) || [ ];
    });
  /* Carga los datos de los estados desde el catálogo */
  this.catalogoService.estadosCatalogo(String(this.idProcedimiento)).subscribe(response => {
      this.estadosData = (response.datos?.map((item: any) => {
        return {
          id: item.clave,
          descripcion: item.descripcion
        };
      })) || [ ];
  });
}

  /**
 * Inicializa el domicilioEstablecimiento con un conjunto de controles de formulario.
 * Cada control se inicializa con un valor de cadena vacío y está deshabilitado.
 * Los controles del formulario incluyen:
 */
  public establecerdomicilioEstablecimiento(): void {
    this.query.selectProrroga$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.seccionState = seccionState;
      })
    )
    .subscribe()
    this.domicilioEstablecimiento = this.fb.group({
      codigo: [this.seccionState?.codigo,],
      estado: [{ value: this.seccionState.estado, disabled: false }, [Validators.required]],
      municipio: [{ value: this.seccionState?.municipio, disabled: false }, [Validators.required]],
      localidad: [{ value: this.seccionState?.localidad, disabled: false }, [Validators.required]],
      colonia: [{ value: this.seccionState?.colonia, disabled: false }, [Validators.required]],
      calle: [{ value: this.seccionState?.calle, disabled: false }, [Validators.required]],
      correo: [{ value: this.seccionState?.correo, disabled: false }, [Validators.required]],
      sanitario: [{ value: this.seccionState?.sanitario, disabled: false }],
      lada: [{ value: this.seccionState?.lada, disabled: false }],
      telefono: [{ value: this.seccionState?.telefono, disabled: false }]
    });
    if (this.esFormularioSoloLectura) {
      this.domicilioEstablecimiento.disable();
    } else{
      this.domicilioEstablecimiento.enable();
    }
  }

    /**
   * Inicializa el formulario reactivo para el Aviso de Funcionamiento.
   * 
   * Este método crea un grupo de controles de formulario con los siguientes campos:
   * - 'funcionamiento': Campo que representa el estado de funcionamiento, inicializado con el valor de `seccionState?.funcionamiento` y habilitado.
   * - 'licencia': Campo que representa la licencia, inicializado con el valor de `seccionState?.licencia` y habilitado.
   * - 'regimen': Campo que representa el régimen, inicializado con el valor de `seccionState?.regimen` y habilitado.
   * 
   * @returns {void}
   */
    public avisodeFuncionamientomiento(): void {
      this.query.selectProrroga$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe()
      this.AvisodeFuncionamiento = this.fb.group({
        funcionamiento: [{ value: this.seccionState?.funcionamiento, disabled: false }],
        licencia: [{ value: this.seccionState?.licencia, disabled: false }],
        regimen: [{ value: this.seccionState?.regimen, disabled: false }],
      });
      if (this.esFormularioSoloLectura) {
        this.AvisodeFuncionamiento.disable();
      } else{
        this.AvisodeFuncionamiento.enable();
      }
    }

  /**
    * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
    * @param form - El formulario reactivo.
    * @param campo - El nombre del campo en el formulario.
    */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.store.establecerDatos({ [campo]: VALOR });
  }

  /**
* Gancho de ciclo de vida OnDestroy
*/
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  /**
   * Validar campo del formulario
   * @param field Nombre del campo
   * @returns Booleano que indica si el campo es válido
   */
  isValid(field: string): boolean {
    return Boolean(DatosSolicitudService.isValid(this.domicilioEstablecimiento, field));
  }

  /**
   * Carga los datos del catálogo loadScian.
   */
  loadScian(): void {
    this.datosSolicitudService
      .obternerDatosData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.datosData = resp;
      });
  }
  /**
    * Carga los datos del catálogo loadStorData.
    */
  loadStorData(): void {
    this.query.selectProrroga$?.pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: DatosProcedureState) => {
        this.seccionState = data;
      });
  }
    /**
 * Inicializa el estado del formulario.
 * 
 * Este método realiza las siguientes acciones:
 * 
 * 1. Llama al método `establecerdomicilioEstablecimiento` para inicializar el formulario reactivo
 *    relacionado con el domicilio del establecimiento.
 * 2. Llama al método `avisodeFuncionamientomiento` para configurar el formulario reactivo
 *    relacionado con el aviso de funcionamiento.
 * 
 * Este método es útil para establecer los valores iniciales de los formularios y sincronizarlos
 * con los datos del estado global de la aplicación.
 * 
 * @returns {void}
 */
inicializarEstadoFormulario(): void {
  this.establecerdomicilioEstablecimiento();
  this.avisodeFuncionamientomiento(); // Configura el formulario de aviso de funcionamiento.        
  } 
  /**
   * Carga los datos desde el estado y los catálogos, y actualiza el formulario reactivo.
   * 
   * Este método realiza las siguientes acciones:
   * 
   * 1. Llama al método `loadStorData` para cargar los datos almacenados en el estado.
   * 2. Llama al método `establecerdomicilioEstablecimiento` para inicializar el formulario reactivo
   *    relacionado con el domicilio del establecimiento.
   * 3. Llama al método `avisodeFuncionamientomiento` para configurar el formulario reactivo
   *    relacionado con el aviso de funcionamiento.
   * 4. Llama al método `loadScian` para cargar los datos del catálogo SCIAN.
   * 
   * Este método es útil para sincronizar los datos del formulario con el estado global de la aplicación
   * y cargar información adicional desde los catálogos.
   * 
   * @returns {void}
   */
      guardarDatosFormulario(): void {
        this.loadStorData(); 
        this.establecerdomicilioEstablecimiento(); 
        this.avisodeFuncionamientomiento(); 
        this.loadScian();
    }
}

