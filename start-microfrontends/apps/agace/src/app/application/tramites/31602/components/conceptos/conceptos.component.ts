import { Catalogo, CatalogoSelectComponent, InputRadioComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud31602IvaeiepsState, Tramite31602IvaeiepsStore } from '../../estados/stores/tramite31602ivaeieps.store';
import { Subject,map, takeUntil } from 'rxjs';
import { ComercioExteriorService } from '../../services/comercio-exterior.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { NumeroDeEmpleadosComponent } from '../numero-de-empleados/numero-de-empleados.component';
import { Tramite31602IvaeiepsQuery } from '../../estados/queries/tramite31602ivaeieps.query';
import radio_si_no from '@libs/shared/theme/assets/json/31601/radio_si_no.json';

/**
 * Componente que representa la sección de "Conceptos" de la aplicación.
 * Este componente es responsable de gestionar el formulario y los datos relacionados con "Conceptos".
 * Interactúa con servicios y la gestión de estado para manejar el flujo de datos y las interacciones del usuario.
 */
@Component({
  selector: 'app-conceptos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputRadioComponent,
    CatalogoSelectComponent,
    NumeroDeEmpleadosComponent
  ],
  templateUrl: './conceptos.component.html',
  styleUrl: './conceptos.component.scss',
})
export class ConceptosComponent implements OnInit,OnDestroy {

  /**
   * Un grupo de formulario reactivo utilizado para gestionar y validar
   * los controles del formulario para la sección "conceptos" en la aplicación.
   */
  public conceptosForm!: FormGroup;
  /**
   * Contiene las opciones para una selección de botón de radio, típicamente
   * representando una elección de "Sí" o "No". El valor se deriva de la constante `radio_si_no`.
   */
  public radioOpcions = radio_si_no;
  /**
   * Representa el valor seleccionado, que puede ser una cadena o un número.
   * Esta propiedad se inicializa como una cadena vacía por defecto.
   */
  public valorSeleccionado: string | number = '';
  /**
   * Representa el concepto de empleado seleccionado, que puede ser una cadena o un número.
   * Esta propiedad se utiliza para almacenar el valor actualmente seleccionado para operaciones relacionadas con empleados.
   */
  public conEmpleadosSeleccionado: string | number = '';
  /**
   * Representa el catálogo de elementos para el primer bimestre.
   * Este arreglo contiene instancias del tipo `Catalogo`.
   */
  public bimestreUnoCatalogo: Catalogo[] = [];
  /**
   * Representa un catálogo de elementos para el segundo bimestre.
   * Este arreglo contiene instancias del tipo `Catalogo`.
   */
  public bimestreDosCatalogo: Catalogo[] = [];
  /**
   * Representa el catálogo de elementos para el tercer bimestre (bimestre tres).
   * Este arreglo contiene instancias del tipo `Catalogo`.
   */
  public bimestreTresCatalogo: Catalogo[] = [];
  /**
   * Un subject utilizado para notificar y completar cualquier suscripción activa
   * cuando el componente es destruido. Esto ayuda a prevenir fugas de memoria
   * asegurando que las suscripciones se limpien adecuadamente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Representa el estado de la Solicitud31602Ivaeieps, que contiene
   * los datos y propiedades relacionados con el proceso actual de solicitud.
   * Este estado se utiliza para gestionar y rastrear el flujo de trabajo y los datos
   * de la aplicación para el trámite específico 31602.
   */
  public solicitudState!: Solicitud31602IvaeiepsState;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando se establece en `true`, los campos del formulario no son editables por el usuario.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Construye una instancia del ConceptosComponent.
   * 
   * @param fb - Una instancia de FormBuilder utilizada para crear y gestionar formularios reactivos.
   * @param comercioExteriorSvc - Servicio para manejar operaciones relacionadas con comercio exterior.
   * @param tramite31602Store - Almacén de gestión de estado para el Trámite 31602 IVA/IEPS.
   * @param tramite31602Query - Servicio de consulta para acceder al estado del Trámite 31602 IVA/IEPS.
   */
  constructor(
    private fb: FormBuilder,
    private comercioExteriorSvc: ComercioExteriorService,
    private tramite31602Store: Tramite31602IvaeiepsStore,
    private tramite31602Query: Tramite31602IvaeiepsQuery,
    private consultaQuery: ConsultaioQuery
  ) {
     this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
      })).subscribe();
  }

  /**
   * Gancho del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de una directiva.
   * 
   * En esta implementación:
   * - Se suscribe al observable `selectSolicitud$` de `tramite31602Query` para actualizar la propiedad `solicitudState`.
   * - Asegura que la suscripción se cancele automáticamente cuando el componente se destruya utilizando `takeUntil` con `destroyNotifier$`.
   * - Inicializa el formulario para conceptos llamando a `crearConceptosForm`.
   * - Obtiene datos del catálogo de bancos invocando `getBancoCatalogDatos`.
   */
  ngOnInit(): void {
    this.tramite31602Query.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
        this.solicitudState = seccionState;
    })).subscribe();
    this.crearConceptosForm();
    this.getBancoCatalogDatos();
    this.inicializarEstadoFormulario();

    this.conceptosForm.valueChanges
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe(values => {
      const TRANSFERENCIAS = Number(values.transferencias) || 0;
      const RETORNOS = Number(values.retornos) || 0;
      const CONSTANCIAS = Number(values.constancias) || 0;
      const TOTAL = TRANSFERENCIAS + RETORNOS + CONSTANCIAS;
      if (this.conceptosForm.get('total')?.value !== TOTAL) {
        this.conceptosForm.get('total')?.setValue(TOTAL, { emitEvent: false });
      }

      const TRANSFERENCIAS_VIR = Number(values.transferenciasVir) || 0;
      const RETORNOS_SE = Number(values.retornosSe) || 0;
      const CONSTANCIAS_DE = Number(values.constanciasDe) || 0;
      const TOTAL_DOS = TRANSFERENCIAS_VIR + RETORNOS_SE + CONSTANCIAS_DE;
      if (this.conceptosForm.get('totalDos')?.value !== TOTAL_DOS) {
        this.conceptosForm.get('totalDos')?.setValue(TOTAL_DOS, { emitEvent: false });
      }
    });
  }
  

  /**
   * Inicializa el FormGroup `conceptosForm` con controles y sus valores predeterminados
   * derivados del objeto `solicitudState`. Cada control corresponde a una propiedad específica
   * en el `solicitudState` y se utiliza para gestionar los datos del formulario en el componente conceptos.
   *
   * Los controles del formulario incluyen:
   * - `transferencias`: Representa datos de transferencias.
   * - `transferenciasVir`: Representa datos de transferencias virtuales.
   * - `retornos`: Representa datos de retornos.
   * - `retornosSe`: Representa datos de retornos secundarios.
   * - `constancias`: Representa datos de constancias.
   * - `constanciasDe`: Representa datos detallados de constancias.
   * - `total`: Representa el valor total.
   * - `totalDos`: Representa un valor total adicional.
   * - `empleadosPropios`: Representa datos sobre empleados propios.
   * - `conEmpleados`: Representa datos sobre empleados con condiciones específicas.
   * - `indiqueSiLosSocios`: Indica si los socios están involucrados.
   * - `numeroEmpleados`: Representa el número de empleados.
   * - `numeroEmpleadosDos`: Representa un conteo adicional de empleados.
   * - `numeroEmpleadosTres`: Representa un tercer conteo de empleados.
   * - `comboBimestresUno`: Representa la selección del primer combo bimestral.
   * - `comboBimestresDos`: Representa la selección del segundo combo bimestral.
   * - `comboBimestresTres`: Representa la selección del tercer combo bimestral.
   *
   * Este método se llama típicamente durante la inicialización del componente
   * para configurar la estructura del formulario y enlazarlo al estado del componente.
   */
  public crearConceptosForm(): void {
    this.conceptosForm = this.fb.group({
      transferencias: [this.solicitudState?.transferencias,Validators.required],
      transferenciasVir:[this.solicitudState?.transferenciasVir,Validators.required],
      retornos:[this.solicitudState?.retornos,Validators.required],
      retornosSe:[this.solicitudState?.retornosSe,Validators.required],
      constancias: [this.solicitudState?.constancias,Validators.required],
      constanciasDe: [this.solicitudState?.constanciasDe,Validators.required],
      total: [this.solicitudState?.total],
      totalDos: [this.solicitudState?.totalDos],
      empleadosPropios: [this.solicitudState?.empleadosPropios],
      conEmpleados: [this.solicitudState?.conEmpleados],
      indiqueSiLosSocios: [this.solicitudState?.indiqueSiLosSocios],
      numeroEmpleados: [this.solicitudState?.numeroEmpleados,Validators.required],
      numeroEmpleadosDos: [this.solicitudState?.numeroEmpleadosDos,Validators.required],
      numeroEmpleadosTres: [this.solicitudState?.numeroEmpleadosTres,Validators.required],
      comboBimestresUno: [this.solicitudState?.comboBimestresUno,Validators.required],
      comboBimestresDos: [this.solicitudState?.comboBimestresDos,Validators.required],
      comboBimestresTres: [this.solicitudState?.comboBimestresTres,Validators.required],
    });
  }

  /**
   * Inicializa el formulario para el componente.
   * 
   * Se suscribe al observable `selectSolicitud$` de `tramite31602Query` para actualizar la propiedad local
   * `solicitudState` cada vez que el observable emite un nuevo valor. La suscripción se cancela automáticamente
   * cuando `destroyNotifier$` emite, previniendo fugas de memoria.
   * Después de configurar la suscripción, llama a `crearConceptosForm()` para crear e inicializar
   * el grupo de formularios para conceptos.
   */
  public inicializarFormulario(): void {
    this.tramite31602Query.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
        this.solicitudState = seccionState;
    })).subscribe();
    this.crearConceptosForm();
  }

  /**
   * Maneja el evento de cambio para el input "Empleados Propios".
   * Actualiza la propiedad `valorSeleccionado` con el valor proporcionado.
   *
   * @param value - El nuevo valor seleccionado, que puede ser una cadena o un número.
   */
  public onEmpleadosPropiosCambio(value: string | number): void {
    this.valorSeleccionado = value;
  }

  /**
   * Maneja la selección de un valor relacionado con empleados.
   *
   * @param value - El valor seleccionado, que puede ser una cadena o un número.
   */
  public onConEmpleados(value: string | number): void {
    this.conEmpleadosSeleccionado = value;
  }

  /**
   * Obtiene datos del catálogo de bancos desde el servicio `comercioExteriorSvc` y asigna
   * los datos recuperados a las propiedades `bimestreUnoCatalogo`, `bimestreDosCatalogo` y 
   * `bimestreTresCatalogo`. Los datos se procesan dentro de una tubería de observables que 
   * asegura una limpieza adecuada utilizando `takeUntil` con el `destroyNotifier$`.
   */
  public getBancoCatalogDatos(): void {
    this.comercioExteriorSvc.getBancoDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const API_DATOS = JSON.parse(JSON.stringify(response));
      this.bimestreUnoCatalogo = API_DATOS.data;
      this.bimestreDosCatalogo = API_DATOS.data;
      this.bimestreTresCatalogo = API_DATOS.data;
    });
  }

  /**
   * Actualiza el store con un valor de un campo específico del formulario.
   *
   * @param form - La instancia de `FormGroup` que contiene los controles del formulario.
   * @param campo - El nombre del control del formulario cuyo valor será recuperado.
   * @param metodoNombre - La clave del método en el `Tramite31602IvaeiepsStore` 
   *                       que será invocado para actualizar el store.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite31602IvaeiepsStore): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31602Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

    /**
     * Inicializa el estado del formulario según su estado de solo lectura.
     *
     * - Si el formulario es de solo lectura (`esFormularioSoloLectura` es true), guarda el formulario llamando a `guardarFormulario()`.
     * - De lo contrario, inicializa el formulario llamando a `inicializarFormulario()`.
     * - Actualiza `valorSeleccionado` con el valor del control 'empleadosPropios' del formulario.
     * - Actualiza `conEmpleadosSeleccionado` con el valor del control 'conEmpleados' del formulario.
     */
    public inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarFormulario();
    } else {
      this.inicializarFormulario();
    }
    this.valorSeleccionado = this.conceptosForm.get('empleadosPropios')?.value;
    this.conEmpleadosSeleccionado = this.conceptosForm.get('conEmpleados')?.value;
  }

    /**
     * Inicializa el formulario y establece su estado habilitado o deshabilitado según la bandera de solo lectura.
     *
     * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), el formulario se deshabilita para evitar la interacción del usuario.
     * De lo contrario, el formulario se habilita para permitir la edición.
     *
     * @returns {void}
     */
    public guardarFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.conceptosForm.disable();
      } else {
        this.conceptosForm.enable();
      }
    }

  /**
   * Gancho del ciclo de vida que se llama cuando el componente es destruido.
   * Libera recursos emitiendo un valor al subject `destroyNotifier$`
   * y completándolo para notificar a cualquier suscripción que se desuscriba.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
