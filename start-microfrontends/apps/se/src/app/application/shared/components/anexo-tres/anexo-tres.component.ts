import { AlertComponent, ConfiguracionColumna, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component,Input,OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud80104State, Tramite80104Store } from '../../../estados/tramites/tramite80104.store';
import {Subject,map,takeUntil } from 'rxjs';
import { ANEXO_TRES_ALERTA } from '../../constantes/anexo-dos-y-tres.enum';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FraccionArancelariaDescripcion } from '../../models/empresas.model';
import { Tramite80104Query } from '../../../estados/queries/tramite80104.query';

/**
 * Decorador que define la configuración del componente AnexoTresComponent.
 * 
 * - selector: Nombre del selector HTML utilizado para insertar este componente en las plantillas.
 * - standalone: Indica que el componente es independiente y puede usarse sin un módulo.
 * - imports: Lista de componentes y módulos necesarios para el funcionamiento del componente.
 * - templateUrl: Ruta del archivo de plantilla HTML asociado al componente.
 * - styleUrl: Ruta del archivo de estilos SCSS asociado al componente.
 */
@Component({
  selector: 'app-anexo-tres',
  standalone: true,
  imports: [
    TituloComponent,
    TablaDinamicaComponent,
    AlertComponent,
    FormsModule,
    ReactiveFormsModule,
    ],
  templateUrl: './anexo-tres.component.html',
  styleUrl: './anexo-tres.component.scss'
})
/**
 * Componente encargado de gestionar el Anexo Tres del formulario 80104.
 * Permite agregar, eliminar y visualizar fracciones arancelarias tanto para el Anexo Dos como para el Anexo Tres.
 * 
 * Implementa OnInit para inicializar formularios y datos al cargar el componente.
 * Implementa OnDestroy para limpiar suscripciones al destruir el componente.
 */
export class AnexoTresComponent implements OnInit, OnDestroy {

  /** Mensaje de alerta para Anexo Tres */
  public anexoTresAlerta = ANEXO_TRES_ALERTA;

  /**
   * Configuración de columnas para los datos del Anexo Dos.
   * Se recibe como propiedad desde el componente padre.
   */
  @Input() configuracionDosDatos: ConfiguracionColumna<FraccionArancelariaDescripcion>[] = [];

  /** Formulario reactivo para el Anexo Dos */
  anexoDosForm!: FormGroup;

  /** Formulario reactivo para el Anexo Tres */
  anexoTresForm!: FormGroup;

  /** Tipo de selección por checkbox para tablas dinámicas */
  public checkbox = TablaSeleccion.CHECKBOX;

  /** Estado actual de la solicitud almacenado desde la store */
  public solicitudState!: Solicitud80104State;

  /** Observable para destruir suscripciones al destruir el componente */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Lista de elementos agregados al Anexo Dos */
  anexoDos: FraccionArancelariaDescripcion[] = [];

  /** Lista de elementos agregados al Anexo Tres */
  anexoTres: FraccionArancelariaDescripcion[] = [];
 /** Indica si el formulario debe mostrarse en modo solo lectura.  
 *  Controla la habilitación o deshabilitación de los campos. */
  esFormularioSoloLectura: boolean = false;

/**  
 * Arreglo que contiene las filas seleccionadas del Anexo Dos, representadas por objetos de tipo FraccionArancelariaDescripcion.  
 * Se utiliza para almacenar y manipular las descripciones arancelarias seleccionadas por el usuario.  
 */
  public selectedAnexoDosRows: FraccionArancelariaDescripcion[] = [];

/**  
 * Arreglo que almacena las filas seleccionadas del Anexo Tres, representadas por objetos de tipo FraccionArancelariaDescripcion.  
 * Permite gestionar las descripciones arancelarias seleccionadas por el usuario en el contexto del Anexo Tres.  
 */
  public selectedAnexoTresRows: FraccionArancelariaDescripcion[] = [];

  /**
 * Constructor del componente.
 * Inicializa los servicios y realiza una suscripción al estado de `ConsultaioQuery` para determinar si el formulario debe ser de solo lectura.
 * Al detectar cambios en el estado, también inicializa el formulario de certificado.
 */
  constructor(
    private fb: FormBuilder,
    private tramite80104Store: Tramite80104Store,
    private tramite80104Query: Tramite80104Query,
   private consultaioQuery: ConsultaioQuery,
        ) { 
       this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        
          this.inicializarCertificadoFormulario();
        })
      )
      .subscribe();
    }   

     /**
   * Método que se ejecuta cuando el componente es inicializado.
   * 
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   */
  ngOnInit(): void {
    this.inicializarCertificadoFormulario();
  }
   /**
   * Método para inicializar el formulario reactivo con los datos de la solicitud.
   * 
   * Este método configura los campos del formulario con los valores actuales del estado de la solicitud
   * y aplica las validaciones necesarias. También deshabilita ciertos campos y establece valores predeterminados.
   */
  inicializarCertificadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
     this.inicializarFormulario();
    }  
  }
  /**
   * @comdoc
   * Guarda los datos del formulario de combinación requerida.
   * 
   * Inicializa el formulario y ajusta su estado de habilitación según si es de solo lectura.
   * - Si el formulario es de solo lectura, lo deshabilita.
   * - Si no es de solo lectura, lo habilita.
   * - Si no aplica ninguna de las condiciones anteriores, no realiza ninguna acción adicional.
   */
  guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.anexoDosForm.disable();
         this.anexoTresForm.disable();
   
      } else {
        this.anexoDosForm.enable();
          this.anexoTresForm.enable();
      
      }
  }

  /**
   * Inicializa los formularios y obtiene valores actuales desde la store.
   * También se suscribe al estado de la solicitud.
   */
  private inicializarFormulario(): void {
    this.tramite80104Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Solicitud80104State;
        })
      )
      .subscribe();
/* 
 * Se inicializa el formulario reactivo para el Anexo Dos.
 * Contiene dos controles:
 * - fraccionArancelaria: campo de entrada para el número de fracción arancelaria.
 * - descripcion: campo de entrada para la descripción de la fracción arancelaria.
 * Actualmente no se aplican validadores, pero pueden añadirse si se requiere validación en el futuro.
 */
    this.anexoDosForm = this.fb.group({
      fraccionArancelaria: [this.solicitudState.fraccionArancelaria,[Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      descripcion: [this.solicitudState.descripcion,[Validators.required, Validators.maxLength(1000)]]
    });
    /* Formulario para Anexo Tres con campos de fracción y descripción */
    this.anexoTresForm = this.fb.group({
      fraccionTres: [this.solicitudState.fraccionTres, [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      descripcionTres: [this.solicitudState.descripcionTres,[Validators.required, Validators.maxLength(1000)]]
    });
    /* Obtiene los valores actuales del estado para Anexo Dos y Anexo Tres */
    this.anexoDos = this.tramite80104Query.getValue().anexoDos;
    this.anexoTres = this.tramite80104Query.getValue().anexoTres;
  }

  /**
   * Establece un valor específico en la store utilizando el nombre del método correspondiente.
   * @param form Formulario reactivo de donde se extrae el valor
   * @param campo Campo dentro del formulario
   * @param metodoNombre Nombre del método de la store que será invocado
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite80104Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite80104Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Agrega un nuevo elemento a la lista del Anexo Dos y actualiza la store.
   */
  anexoDosAgregar(): void {
  if (this.anexoDosForm.invalid) {
    this.anexoDosForm.markAllAsTouched();
    return;
  }
    const NUEVOITEM: FraccionArancelariaDescripcion = {
      fraccionArancelaria: this.anexoDosForm.value.fraccionArancelaria,
      descripcion: this.anexoDosForm.value.descripcion,
    };
    this.anexoDos = [...(this.anexoDos || []), NUEVOITEM];
    this.tramite80104Store.setAnexoDos(this.anexoDos);
    this.anexoDosForm.reset();
  }

/**
 * Método que actualiza las filas seleccionadas del Anexo Dos con las proporcionadas como parámetro.
 * Se invoca al seleccionar una o más descripciones arancelarias en la interfaz del Anexo Dos.
 */
onAnexoDosRowSelected(selectedRows: FraccionArancelariaDescripcion[]): void {
  this.selectedAnexoDosRows = selectedRows;
}

/**
 * Método que actualiza las filas seleccionadas del Anexo Tres con las proporcionadas como parámetro.
 * Se ejecuta al seleccionar una o más descripciones arancelarias en la interfaz del Anexo Tres.
 */
onAnexoTresRowSelected(selectedRows: FraccionArancelariaDescripcion[]): void {
  this.selectedAnexoTresRows = selectedRows;
}

  /**
   * Agrega un nuevo elemento a la lista del Anexo Tres y actualiza la store.
   */
  anexoTresAgregar(): void {
  if (this.anexoTresForm.invalid) {
    this.anexoTresForm.markAllAsTouched();
    return;
  }
    const NUEVOITEM: FraccionArancelariaDescripcion = {
      fraccionArancelaria: this.anexoTresForm.value.fraccionTres,
      descripcion: this.anexoTresForm.value.descripcionTres,
    };
    this.anexoTres = [...(this.anexoTres || []), NUEVOITEM];
    this.tramite80104Store.setAnexoTres(this.anexoTres);
    this.anexoTresForm.reset();
  }

  /**
   * Elimina (resetea) el formulario del Anexo Dos sin alterar el estado global.
   */
  anexoDosElimiar(): void {
  if (!this.selectedAnexoDosRows.length) {return}
  this.anexoDos = this.anexoDos.filter(
    item => !this.selectedAnexoDosRows.some(selected => selected === item)
  );
  this.tramite80104Store.setAnexoDos(this.anexoDos);
  this.selectedAnexoDosRows = [];
  }

  /**
   * Elimina (resetea) el formulario del Anexo Tres sin alterar el estado global.
   */
  anexoTresElimiar(): void {
    if (!this.selectedAnexoTresRows.length) {return}
    this.anexoTres = this.anexoTres.filter(
      item => !this.selectedAnexoTresRows.some(selected => selected === item)
    );
    this.tramite80104Store.setAnexoTres(this.anexoTres);
    this.selectedAnexoTresRows = [];
  }

  /**
   * Ciclo de vida: se ejecuta al destruir el componente.
   * Libera recursos cancelando suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
