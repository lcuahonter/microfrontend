import { BsModalRef,BsModalService } from 'ngx-bootstrap/modal';
import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ConfiguracionColumna, EMPRESAS_TABLA, EmpresasDelGrupo, InputCheckComponent, InputRadioComponent, REGEX_RFC, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud31602IvaeiepsState, Tramite31602IvaeiepsStore } from '../../estados/stores/tramite31602ivaeieps.store';
import { Subject,map, takeUntil } from 'rxjs';
import { ComercioExteriorService } from '../../services/comercio-exterior.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { IvaeiepsDosComponent } from '../ivaeieps-dos/ivaeieps-dos.component';
import { PERMISO_A_DESISTIR } from '../../constantes/ivaeieps.enum';
import { Tramite31602IvaeiepsQuery } from '../../estados/queries/tramite31602ivaeieps.query';
import radio_si_no from '@libs/shared/theme/assets/json/31601/radio_si_no.json';


/**
 * Componente que representa la funcionalidad del formulario de IVA e IEPS.
 * Este componente es responsable de gestionar el estado del formulario, manejar las interacciones del usuario,
 * y comunicarse con el store y los servicios para obtener y actualizar datos.
 */
@Component({
  selector: 'app-ivaeieps',
  standalone: true,
  providers: [BsModalService],
  imports: [
    CommonModule,
    FormasDinamicasComponent,
    ReactiveFormsModule,
    InputRadioComponent,
    TituloComponent,
    TablaDinamicaComponent,
    IvaeiepsDosComponent,
    InputCheckComponent
  ],
  templateUrl: './ivaeieps.component.html',
  styleUrl: './ivaeieps.component.scss',
})
export class IvaeiepsComponent implements OnInit,OnDestroy {

  /**
   * Una instancia de FormGroup utilizada para gestionar los controles del formulario
   * y la lógica de validación para la sección de IVA e IEPS del componente.
   */
  public ivaEiepsFormGroup!: FormGroup;
  /**
   * Una referencia a la instancia del modal de Bootstrap.
   * Esto se utiliza para controlar e interactuar con el cuadro de diálogo modal.
   * Es opcional y puede ser indefinido si no hay ningún modal activo actualmente.
   */
  modalRef?: BsModalRef;
  /**
   * Representa el grupo de formulario reactivo para gestionar los datos de IVA e IEPS.
   * Este grupo de formulario se utiliza para manejar los controles del formulario y las validaciones
   * relacionadas con el componente de IVA/IEPS.
   */
  public ivaForm!: FormGroup;
  /**
   * Representa el estado de un grupo de botones de radio, inicializado con el valor `radio_si_no`.
   * Esto se utiliza típicamente para manejar opciones binarias (por ejemplo, Sí/No).
   */
  public radioBtn = radio_si_no;
  /**
   * Representa el modo de selección para una tabla, específicamente utilizando casillas de verificación.
   * Esta propiedad se asigna con un valor del enumerado `TablaSeleccion`,
   * donde el modo de selección está configurado como `CHECKBOX`.
   */
  public tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;
  /**
   * Representa el valor de selección predeterminado para un componente específico.
   * Esto puede ser una cadena o un número, inicializado como una cadena vacía.
   */
  public predeterminadoSeleccionar: string | number = '';
  /**
   * Representa un grupo de formulario reactivo para el componente.
   */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({})
  });

  /**
   * Representa los datos del formulario de permiso para desistir.
   * Esta propiedad se inicializa con la constante `PERMISO_A_DESISTIR`.
   */
  public permisoDesistirFormDatos = PERMISO_A_DESISTIR;
  /**
   * Un arreglo que contiene datos relacionados con las empresas dentro del grupo.
   * Cada elemento en el arreglo es de tipo `EmpresasDelGrupo`.
   */
  public empresasDelGrupoDatos: EmpresasDelGrupo[] = [];
  /**
   * Configuración para la tabla que muestra datos del tipo `EmpresasDelGrupo`.
   * Esta propiedad se inicializa con la configuración de columnas predefinida
   * de `EMPRESAS_TABLA`.
   */
  public configuracionTabla: ConfiguracionColumna<EmpresasDelGrupo>[] = EMPRESAS_TABLA;
  /**
   * Un subject utilizado para notificar y completar suscripciones cuando el componente es destruido.
   * Esto ayuda a prevenir fugas de memoria al garantizar que cualquier suscripción en curso vinculada a este notifier
   * se desuscriba correctamente cuando finaliza el ciclo de vida del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Represents the state of the Solicitud31602Ivaeieps component.
   * This property holds the current state of the solicitud (request)
   * for the IVA and IEPS process in the application.
   */
  public solicitudState!: Solicitud31602IvaeiepsState;
  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando se establece en `true`, todos los campos del formulario son no editables y el usuario no puede modificar ningún valor.
   * Cuando se establece en `false`, el formulario es completamente editable.
   */
  public esFormularioSoloLectura: boolean = false;


  /**
   * Constructor del componente IvaeiepsComponent.
   * 
   * @param fb - Instancia de FormBuilder utilizada para crear y gestionar formularios reactivos.
   * @param comercioExteriorSvc - Servicio para manejar operaciones relacionadas con comercio exterior.
   * @param modalService - Servicio para gestionar cuadros de diálogo modales.
   * @param tramite31602Store - Store de gestión de estado para Tramite 31602 Ivaeieps.
   * @param tramite31602Query - Servicio de consulta para acceder al estado de Tramite 31602 Ivaeieps.
   */
  constructor(
    private fb: FormBuilder,
    private comercioExteriorSvc: ComercioExteriorService,
    @Inject(BsModalService)
    private modalService: BsModalService,
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
   * Este método realiza las siguientes acciones:
   * - Se suscribe al observable `selectSolicitud$` de `tramite31602Query` para actualizar la propiedad `solicitudState`.
   * - Inicializa el formulario de IVA/IEPS llamando a `crearIvaEiepsForm`.
   * - Obtiene datos de las empresas del grupo invocando `getEmpresasDelGrupoDatos`.
   * - Crea el formulario de IVA llamando a `crearIvaForm`.
   * 
   * La suscripción a `selectSolicitud$` se desuscribe automáticamente cuando el observable `destroyNotifier$` emite un valor.
   */
  ngOnInit(): void {
    this.tramite31602Query.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
        this.solicitudState = seccionState;
    })).subscribe();
    this.crearIvaEiepsForm();
    this.getEmpresasDelGrupoDatos();
    this.crearIvaForm();
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa el grupo de formulario `ivaEiepsFormGroup` con valores predeterminados
   * del objeto `solicitudState`. El grupo de formulario contiene los siguientes controles:
   * - `indiqueIva`: Representa la indicación de IVA.
   * - `empleados`: Representa el número de empleados.
   * - `infraestructura`: Representa los detalles de infraestructura.
   * - `monto`: Representa el monto monetario.
   * - `antiguedad`: Representa la antigüedad o senioridad.
   *
   * Este método utiliza el `FormBuilder` de Angular para crear el grupo de formulario.
   */
  public crearIvaEiepsForm(): void {
    this.ivaEiepsFormGroup = this.fb.group({
      indiqueIva: [this.solicitudState.indiqueIva],
      empleados: [this.solicitudState.empleados],
      infraestructura: [this.solicitudState.infraestructura],
      monto: [this.solicitudState.monto],
      antiguedad: [this.solicitudState.antiguedad],
    });
  }

  /**
   * Inicializa el FormGroup `ivaForm` con controles predefinidos y sus validadores.
   * 
   * El formulario incluye los siguientes controles:
   * - `rfc`: Un campo obligatorio con un validador de patrón para coincidir con el formato RFC.
   * - `denominacion`: Un campo deshabilitado inicializado con una cadena vacía.
   * - `domicilio`: Un campo deshabilitado inicializado con una cadena vacía.
   * 
   * Este método utiliza el FormBuilder de Angular para crear la estructura del formulario.
   */
  public crearIvaForm(): void {
    this.ivaForm = this.fb.group({
      rfc: ['',[Validators.required,Validators.pattern(REGEX_RFC)]],
      denominacion: [{ value: '', disabled: true }],
      domicilio: [{ value: '', disabled: true }],
    });
  }

  /**
   * Recupera el 'ninoFormGroup' como un FormGroup desde el formulario principal.
   *
   * @returns {FormGroup} La instancia del FormGroup 'ninoFormGroup'.
   */
  get ninoFormGroup(): FormGroup {
    return this.forma.get('ninoFormGroup') as FormGroup;
  }

  /**
   * Actualiza el valor de `predeterminadoSeleccionar` basado en el valor proporcionado.
   *
   * @param value - El nuevo valor a establecer para `predeterminadoSeleccionar`.
   *                Puede ser una cadena o un número.
   */
  public cambioDeValorIndique(value: string | number): void {
    this.predeterminadoSeleccionar = value;
  }

  /**
   * Inicializa el formulario para el componente de IVA/IEPS.
   *
   * Este método se suscribe al observable `selectSolicitud$` del servicio `tramite31602Query`,
   * actualizando la propiedad local `solicitudState` con el estado más reciente de la sección hasta que el componente sea destruido.
   * También crea e inicializa los formularios de IVA/IEPS y de IVA llamando a sus respectivos métodos.
   */
  public inicializarFormulario(): void {
    this.tramite31602Query.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
        this.solicitudState = seccionState;
    })).subscribe();
    this.crearIvaEiepsForm();
    this.crearIvaForm();
  }

  /**
   * Recupera los datos de las empresas del grupo y los asigna a la propiedad `empresasDelGrupoDatos`.
   * 
   * Este método utiliza el servicio `comercioExteriorSvc.getEmpresasTablaDatos` para obtener los datos,
   * procesa la respuesta clonándola profundamente y asegura una limpieza adecuada de las suscripciones
   * utilizando el observable `destroyNotifier$`.
   * 
   * @returns {void} Este método no retorna un valor.
   */
  public getEmpresasDelGrupoDatos():void {
    this.comercioExteriorSvc.getEmpresasTablaDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const DATOS = JSON.parse(JSON.stringify(response));
      this.empresasDelGrupoDatos = DATOS;
    })
  }

  /**
   * Abre un cuadro de diálogo modal utilizando la plantilla proporcionada.
   *
   * @param template - Un `TemplateRef` que representa el contenido del modal a mostrar.
   *                   Esta plantilla se pasa al servicio modal para renderizar el modal.
   */
  public abrirModal(template: TemplateRef<void>): void {
    this.modalRef = this.modalService.show(template);
  }

  /**
   * Actualiza una propiedad específica en el Tramite31602IvaeiepsStore con el valor
   * obtenido de un campo de formulario dado.
   *
   * @param form - La instancia de FormGroup que contiene los controles del formulario.
   * @param campo - El nombre del control del formulario cuyo valor será obtenido.
   * @param metodoNombre - La clave del método de Tramite31602IvaeiepsStore que será invocado
   *                       para actualizar el store con el valor obtenido.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite31602IvaeiepsStore): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31602Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Inicializa el estado del formulario según su modo de solo lectura.
   * 
   * - Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es true), guarda el formulario llamando a `guardarFormulario()`.
   * - De lo contrario, inicializa el formulario llamando a `inicializarFormulario()`.
   * - Finalmente, asigna la propiedad `predeterminadoSeleccionar` al valor actual del control 'indiqueIva' de `ivaEiepsFormGroup`.
   */
  public inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarFormulario();
    } else {
      this.inicializarFormulario();
    }
    this.predeterminadoSeleccionar = this.ivaEiepsFormGroup.get('indiqueIva')?.value;
  }

  /**
   * Inicializa el formulario y alterna su estado habilitado o deshabilitado según la bandera de solo lectura.
   *
   * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), tanto `ivaEiepsFormGroup` como `ivaForm`
   * se deshabilitan para evitar la interacción del usuario. De lo contrario, ambos formularios se habilitan para permitir la edición.
   */
  public guardarFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.ivaEiepsFormGroup.disable();
        this.ivaForm.disable();
      } else {
        this.ivaEiepsFormGroup.enable();
        this.ivaForm.enable();
      }
  }

  /**
   * Gancho del ciclo de vida que se llama cuando el componente es destruido.
   * Libera recursos emitiendo un valor al subject `destroyNotifier$`
   * y completándolo para notificar a cualquier suscripción que debe desuscribirse.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }



}
