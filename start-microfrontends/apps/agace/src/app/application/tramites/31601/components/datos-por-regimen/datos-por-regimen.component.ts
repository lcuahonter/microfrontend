import { CONFIGURATION_TABLA_EMPLEADOS_BIMESTRE, EMPLEADOS_BIMESTRE } from '../../constantes/antecesor.enum';
import { Catalogo, ConfiguracionColumna, ConsultaioQuery, InputRadioComponent, TablaDinamicaComponent, TablaSeleccion, TableComponent, TablePaginationComponent,TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Solicitud31601State, Tramite31601Store } from '../../../../estados/tramites/tramite31601.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { RadioBotons } from '../../modelos/radio-buttons.model';
import { Tramite31601Query } from '../../../../estados/queries/tramite31601.query';

import { EmpleadoBimestre } from '../../modelos/antecesor.modal';

/**
 * Componente DatosPorRegimen que se utiliza para mostrar y gestionar los DatosPorRegimen.
 *
 * Este componente utiliza varios subcomponentes como TituloComponent, CatalogoSelectComponent, CommonModule,
 * ReactiveFormsModule,TableComponent  para mostrar información y permitir al usuario seleccionar y agregar tratados.
 * @component
 */

@Component({
  selector: 'app-datos-por-regimen',
  templateUrl: './datos-por-regimen.component.html',
  styleUrl: './datos-por-regimen.component.scss',
  standalone: true,
  imports: [
    TituloComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    TablePaginationComponent,FormsModule,TablaDinamicaComponent
  ],
})
export class DatosPorRegimenComponent implements OnInit,OnDestroy {

  /**
   * Una instancia de FormGroup que representa el formulario para el régimen.
   * Este formulario se utiliza para capturar y validar los comentarios de los usuarios relacionados con el régimen.
   */
  public regimenForm!: FormGroup;

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud31601State;
/* 
  Catálogo de captura utilizado para almacenar una lista de opciones disponibles.
  Cada objeto contiene un identificador y una descripción.
*/
   public capturecatalogo: Catalogo[] =[
            {
              "id": 1,
              "descripcion": "123"
            }];

  /**
   * Configuración de las columnas de la tabla de exportadores.
   * Define el encabezado, clave y el orden de las columnas para la tabla de exportadores.
   */
  public checkbox = TablaSeleccion.CHECKBOX;
  /**
   * Array de objetos RadioBotons que representan las opciones de radio disponibles.
   * Cada objeto contiene una etiqueta y un valor.
   */
  radioBotons: RadioBotons[] = [
    {
      label:"Si",
      value:"Yes"
    },
    {
      label:"No",
      value:"No"
    }
  ]

   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 

  /**
   * Notificador para destruir observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();
 /**
 * Configuración de las columnas para la tabla de exportadores.
 * Se utiliza para definir qué columnas se mostrarán, su orden y propiedades.
 */
  configuracionTabla: ConfiguracionColumna<EmpleadoBimestre>[] =CONFIGURATION_TABLA_EMPLEADOS_BIMESTRE;

    /**
   * Lista de destinatarios obtenida desde un archivo JSON.
   * Cada destinatario contiene información como nombre, teléfono, correo electrónico y dirección.
   */
  destinatario: EmpleadoBimestre[] = EMPLEADOS_BIMESTRE;
  /**
 * Constructor de la clase DatosPorRegimenComponent.
 * 
 * @param fb - Constructor de formularios.
 * @param tramite31601Store - Store de Tramite 31601.
 * @param tramite31601Query - Query de Tramite 31601.
 * @param consultaioQuery - Query de Consultatio.
 */
  constructor(
    private fb: FormBuilder,
    private tramite31601Store: Tramite31601Store,
    private tramite31601Query: Tramite31601Query,
    private consultaioQuery: ConsultaioQuery,
  ){
     this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
        this.crearRegimenForm();
      })
    )
    .subscribe()
  }
  /**
   * Gancho de ciclo de vida que se llama después de inicializar las propiedades enlazadas a datos de una directiva.
   * Este método inicializa catálogos, establece valores de control de formularios, prepara los datos de la pestaña del régimen,
   * y recupera el formulario que se va a agregar.
   *
   * @memberof DatosPorRegimenComponent
   */
  ngOnInit():void {
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
     this.crearRegimenForm();
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
      this.crearRegimenForm();
      if (this.esFormularioSoloLectura) {
        this.regimenForm.disable();        
      } else {
        this.regimenForm.enable();       
      }
  }
  /**
 * Crea e inicializa el FormGroup `regimenForm` con varios controles de formulario y sus validadores.
 * Los controles del formulario incluyen:
 * - `importaciones`: Un campo requerido para importaciones.
 * - `infraestructuraIndique`: Un campo requerido para infraestructura.
 * - `ultimosMeses`: Un campo requerido para los últimos meses.
 * - `operacionesmeses`: Un campo requerido para operaciones en meses.
 * - `valor`: Un campo requerido para valor.
 * - `transferencias`: Un campo opcional para transferencias con una longitud máxima de 20.
 * - `transferenciasVir`: Un campo opcional para transferencias virtuales con una longitud máxima de 7.
 * - `retornos`: Un campo opcional para retornos con una longitud máxima de 20.
 * - `retornosSe`: Un campo opcional para retornos secundarios con una longitud máxima de 7.
 * - `constancias`: Un campo opcional para constancias con una longitud máxima de 20.
 * - `constanciasDe`: Un campo opcional para detalles de constancias con una longitud máxima de 7.
 * - `total`: Un campo deshabilitado para total.
 * - `totals`: Un campo deshabilitado para totales.
 * - `empleadosPropios`: Un campo requerido para empleados propios.
 * - `numeroEmpleados`: Un campo requerido para el número de empleados.
 * - `numeroEmpleadosDos`: Un campo requerido para el número de empleados dos.
 * - `numeroEmpleadosTres`: Un campo requerido para el número de empleados tres.
 * - `comboBimestresUno`: Un campo opcional para el primer combo bimestral.
 * - `comboBimestresDos`: Un campo opcional para el segundo combo bimestral.
 * - `comboBimestresTres`: Un campo opcional para el tercer combo bimestral.
 * - `proveedorCumplimiento`: Un campo requerido para proveedor de cumplimiento.
 * - `declaracionISR`: Un campo requerido para declaración de ISR.
 * - `cancelacion`: Un campo requerido para cancelación.
 * - `cumplimientoReglas`: Un campo requerido para cumplimiento de reglas.
 * - `recintoFiscalizado`: Un campo requerido para recinto fiscalizado.
 * - `recintoEstrategico`: Un campo requerido para recinto estratégico.
 * - `cumplimientoLineamientos`: Un campo requerido para cumplimiento de lineamientos.
 */
  public crearRegimenForm():void {
    this.tramite31601Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.regimenForm = this.fb.group({
        indiques: [this.solicitudState.indiques, Validators.required],
  cuenta: [this.solicitudState.cuenta, Validators.required],
  mismo: [this.solicitudState.mismo, Validators.required],
  empresa: [this.solicitudState.empresa, Validators.required],
  propios: [this.solicitudState.propios, Validators.required],
  empleadoss: [this.solicitudState.empleadoss, Validators.required],
  socios: [this.solicitudState.socios, Validators.required],
  encuentras: [this.solicitudState.encuentras, Validators.required],
  cumplido: [this.solicitudState.cumplido, Validators.required],
  procedimiento: [this.solicitudState.procedimiento, Validators.required],
  determinan: [this.solicitudState.determinan, Validators.required],
      cancelacionProcedimiento: [this.solicitudState.cancelacionProcedimiento, Validators.required],
      cumpleLineamientos: [this.solicitudState.cumpleLineamientos, Validators.required],
      transferenciasDatos: [this.solicitudState?.transferenciasDatos ?? '', Validators.required],
  transferenciasdos: [this.solicitudState?.transferenciasdos ?? '', Validators.required],
  retornosDatos: [this.solicitudState?.retornosDatos ?? '', Validators.required],
  retornosdos: [this.solicitudState?.retornosdos ?? '', Validators.required],
  constanciasDatos: [this.solicitudState?.constanciasDatos ?? '', Validators.required],
  constanciasdos: [this.solicitudState?.constanciasdos ?? '', Validators.required],
  monedaTotal: [this.solicitudState?.monedaTotal ?? '', Validators.required],
  porcentajeTotal: [this.solicitudState?.porcentajeTotal ?? '', Validators.required],
  capture: [this.solicitudState?.capture ?? '', Validators.required],
   deEmpleados: [this.solicitudState.deEmpleados || '', Validators.required],
  bimestreDatos: [this.solicitudState.bimestreDatos || '', Validators.required],  
  numeroDeEmpleados: [this.solicitudState.numeroDeEmpleados || '', Validators.required],
  bimestredos: [this.solicitudState.bimestredos || '', Validators.required],  
  numeroDatos: [this.solicitudState.numeroDatos || '', Validators.required],
  bimestres: [this.solicitudState.bimestres || '', Validators.required],  
    });
   this.regimenForm.get('monedaTotal')?.disable();
    this.regimenForm.get('porcentajeTotal')?.disable();
    if (this.esFormularioSoloLectura) {
      Object.keys(this.regimenForm.controls).forEach((key) => {
        this.regimenForm.get(key)?.disable();
      })
    } else {
      Object.keys(this.regimenForm.controls).forEach((key) => {
        this.regimenForm.get(key)?.enable();
      })
    }  

  }

/**
 * Establece el valor de un campo en el store de Tramite31601.
 *
 * @param campo - El nombre del campo cuyo valor se va a establecer.
 * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
 */
setValoresStore(campo: string, metodoNombre: keyof Tramite31601Store): void {
  const VALOR = this.regimenForm.get(campo)?.value;
  (this.tramite31601Store[metodoNombre] as (value: string) => void)(VALOR);
}

/**
 * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
 * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
 */
ngOnDestroy(): void {
  this.destroyNotifier$.next();
  this.destroyNotifier$.complete();
}
}
