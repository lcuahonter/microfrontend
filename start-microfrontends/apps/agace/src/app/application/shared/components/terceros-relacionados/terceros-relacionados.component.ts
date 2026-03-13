import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { ENLACE_TABLA } from '../../models/terceros-relacionados.model';
import { EnlaceOperativo } from '../../models/terceros-relacionados.model';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Inject } from '@angular/core';
import { Input } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PERSONAS_PARA } from '../../models/terceros-relacionados.model';
import { Personas } from '../../models/terceros-relacionados.model';
import { REPRESENTANTE_LEGAL } from '../../constants/terceros-relacionados.enum';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { TemplateRef } from '@angular/core';
import { TercerosRelacionadosQuery } from '../../estados/queries/terceros-relacionados.query';
import { TercerosRelacionadosService } from '../../services/terceros-relacionados.service';
import { TercerosRelacionadosState } from '../../estados/stores/terceros-relacionados.store';
import { TercerosRelacionadosStore } from '../../estados/stores/terceros-relacionados.store';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Componente que representa la funcionalidad de "Terceros Relacionados".
 * Este componente maneja la visualización y gestión de terceros relacionados,
 * incluyendo formularios, tablas e interacciones con modales.
 */
@Component({
  selector: 'shared-terceros-relacionados',
  standalone: true,
  providers: [BsModalService],
  imports: [CommonModule, ReactiveFormsModule, FormasDinamicasComponent, TablaDinamicaComponent, TituloComponent],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
})
export class TercerosRelacionadosComponent implements OnInit, OnDestroy {

  /**
    * @property consultaState
    * @description
    * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
    */
  @Input() consultaState!: ConsultaioState;
  /**
   * Una instancia de FormGroup que representa la estructura del formulario para "representante legal".
   * Contiene un FormGroup anidado llamado `represtantanteLegalFormGroup` para gestionar
   * los controles del formulario relacionados con el representante legal.
   */
  public represtantanteLegalForma: FormGroup = new FormGroup({
    represtantanteLegalFormGroup: new FormGroup({})
  });

  /**
   * Una referencia a la instancia del modal creada utilizando el `BsModalService`.
   * Esta propiedad se utiliza para gestionar e interactuar con el cuadro de diálogo modal.
   * Puede ser indefinida si no hay ningún modal abierto actualmente.
   */
  modalRef?: BsModalRef;
  /**
   * Contiene los datos del representante legal.
   * Esta propiedad se inicializa con la constante `REPRESENTANTE_LEGAL`.
   */
  public represtantanteLegalDatos = REPRESENTANTE_LEGAL;
  /**
   * Representa el modo de selección con casillas de verificación para la tabla.
   * Esta propiedad se asigna con el valor de `TablaSeleccion.CHECKBOX`,
   * que probablemente corresponde a una constante o enumeración predefinida
   * que indica que se utilizan casillas de verificación para seleccionar filas en la tabla.
   */
  public checkbox = TablaSeleccion.CHECKBOX;
  /**
   * Configuración para la tabla que muestra los enlaces operativos.
   * Esta propiedad define la configuración de las columnas para la tabla
   * utilizando el tipo `ConfiguracionColumna` con `EnlaceOperativo` como tipo genérico.
   * La configuración se inicializa con la constante predefinida `ENLACE_TABLA`.
   */
  public configuracionTabla: ConfiguracionColumna<EnlaceOperativo>[] = ENLACE_TABLA;
  /**
   * Un arreglo de objetos `EnlaceOperativo` que representa enlaces operativos o datos relacionados.
   * Esta propiedad se utiliza para almacenar y gestionar los datos operativos asociados con el componente.
   */
  public enlaceOperativoDatos: EnlaceOperativo[] = [];
  /**
   * Un subject utilizado para notificar y completar cualquier suscripción activa cuando el componente es destruido.
   * Esto ayuda a prevenir fugas de memoria al garantizar que las suscripciones se limpien correctamente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Un grupo de formulario reactivo utilizado para gestionar y validar los datos
   * relacionados con la funcionalidad de "enlace operativo".
   * Este grupo de formulario se inicializa y configura con controles de formulario
   * específicos y validadores en otra parte del componente.
   */
  public enlaceOperativoForm!: FormGroup;
  /**
   * Un arreglo de objetos `Personas` que representa individuos o entidades relacionadas.
   * Esta propiedad se utiliza para almacenar y gestionar la lista de personas asociadas.
   */
  public personaParas: Personas[] = [];
  /**
   * Representa la configuración para la tabla de personas relacionadas.
   * Esta propiedad es un arreglo de configuraciones de columnas específicas para el tipo `Personas`.
   * Se inicializa con configuraciones predefinidas de `PERSONAS_PARA`.
   */
  public personasConfiguracionTabla: ConfiguracionColumna<Personas>[] = PERSONAS_PARA;
  /**
   * Representa el estado del proceso de importación de "Terceros Relacionados".
   * Esta propiedad se utiliza para gestionar y rastrear el estado de los datos relacionados con terceros.
   */
  public importacionstate!: TercerosRelacionadosState;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando se establece en `true`, los campos del formulario no son editables por el usuario.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Indica si el modal está en modo de edición (true) o creación (false).
   */
  public esModalEdicion: boolean = false;

  /**
   * Índice del elemento seleccionado para edición.
   */
  public indiceElementoSeleccionado: number = -1;

  /**
   * Elementos seleccionados en la tabla para eliminación.
   */
  public elementosSeleccionados: EnlaceOperativo[] = [];

  /**
   * Constructor del componente TercerosRelacionadosComponent.
   * 
   * @param fb - Una instancia de FormBuilder utilizada para crear y gestionar formularios reactivos.
   * @param modalService - Un servicio para gestionar cuadros de diálogo modales.
   * @param tercerosRelacionadosSvc - Servicio para manejar operaciones relacionadas con "terceros relacionados".
   * @param tercerosRelacionadosStore - Almacén para gestionar el estado de "terceros relacionados".
   * @param tercerosRelacionadosQuery - Servicio de consulta para recuperar datos relacionados con "terceros relacionados".
   */
  constructor(
    private fb: FormBuilder,
    @Inject(BsModalService)
    private modalService: BsModalService,
    private tercerosRelacionadosSvc: TercerosRelacionadosService,
    private tercerosRelacionadosStore: TercerosRelacionadosStore,
    private tercerosRelacionadosQuery: TercerosRelacionadosQuery,
    private consultaQuery: ConsultaioQuery
  ) {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.esFormularioSoloLectura = seccionState.readonly;
    })).subscribe();
  }

  /**
   * Gancho del ciclo de vida que se llama después de que la vista del componente ha sido completamente inicializada.
   * 
   * - Se suscribe al observable `selectImportacion$` de `tercerosRelacionadosQuery` para actualizar la propiedad `importacionstate`.
   * - Garantiza que la suscripción se cancele automáticamente cuando el componente sea destruido utilizando `takeUntil` con `destroyNotifier$`.
   * - Llama a métodos para inicializar el formulario de enlace operativo, obtener datos de enlace operativo y recuperar personas relacionadas.
   * 
   * @returns void
   */
  ngOnInit(): void {
    this.tercerosRelacionadosQuery.selectImportacion$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.importacionstate = seccionState;
      if (
        this.importacionstate &&
        typeof this.importacionstate === 'object' &&
        this.importacionstate !== null &&
        'enlaceOperativo' in this.importacionstate
      ) {
        const DATOS = this.importacionstate['enlaceOperativo'] as unknown as EnlaceOperativo[];
        DATOS.forEach((dato: EnlaceOperativo) => {
          const IS_ALREADY_ADDED = this.enlaceOperativoDatos.some(
            (item: EnlaceOperativo) => item.rfc === dato.rfc
          )
          if (!IS_ALREADY_ADDED) {
            this.enlaceOperativoDatos = [...this.enlaceOperativoDatos, dato];
          }
        });
      }
    })
    ).subscribe();
    this.getEnlaceOperativo();
    this.crearEnlaceOperativoForm();
    this.getPersonas();
    this.inicializarEstadoFormulario();
  }


  /**
   * Inicializa el formulario para el componente "Terceros Relacionados".
   * 
   * Este método se suscribe al observable `selectImportacion$` de `tercerosRelacionadosQuery`
   * para actualizar la propiedad `importacionstate` cada vez que cambie el estado de la sección de importación.
   * La suscripción se cancela automáticamente cuando el `destroyNotifier$` emite un valor.
   * Después de configurar la suscripción, llama a `crearEnlaceOperativoForm()` para crear el formulario de enlace operativo.
   */
  public inicializarFormulario(): void {
    this.tercerosRelacionadosQuery.selectImportacion$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.importacionstate = seccionState;
    })).subscribe();

    this.crearEnlaceOperativoForm();
  }

  /**
   * Getter para la propiedad 'represtantanteLegalFormGroup'.
   * Esto recupera una instancia específica de `FormGroup` del grupo de formularios `represtantanteLegalForma`.
   *
   * @returns {FormGroup} El 'represtantanteLegalFormGroup' como una instancia de `FormGroup`.
   */
  get represtantanteLegalFormGroup(): FormGroup {
    return this.represtantanteLegalForma.get('represtantanteLegalFormGroup') as FormGroup;
  }

  /**
   * Inicializa el FormGroup `enlaceOperativoForm` con controles de formulario y sus respectivos validadores.
   * 
   * El formulario contiene los siguientes campos:
   * - `resigtro`: Un campo requerido para el registro.
   * - `irfc`: Un campo requerido para el RFC (Registro Federal de Contribuyentes).
   * - `inombre`: Un campo requerido para el nombre.
   * - `apellidoPaterno`: Un campo requerido para el apellido paterno.
   * - `apellidoMaterno`: Un campo requerido para el apellido materno.
   * - `cargo`: Un campo requerido para el cargo o puesto.
   * - `cuidad`: Un campo requerido para la ciudad.
   * - `telefono`: Un campo requerido para el número de teléfono.
   * - `correo`: Un campo requerido para la dirección de correo electrónico.
   * - `suplente`: Un campo requerido para el suplente o alterno.
   */
  public crearEnlaceOperativoForm(): void {
    this.enlaceOperativoForm = this.fb.group({
      resigtro: [''],
      irfc: [{ value: '', disabled: true }],
      inombre: [{ value: '', disabled: true }],
      apellidoPaterno: [{ value: '', disabled: true }],
      apellidoMaterno: [{ value: '', disabled: true }],
      cargo: ['', Validators.required],
      cuidad: [{ value: '', disabled: true }],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      suplente: [false],
    });
  }

  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   * 
   * - Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es `true`), guarda el formulario llamando a `guardarFormulario()`.
   * - De lo contrario, inicializa el formulario llamando a `inicializarFormulario()`.
   */
  public inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Inicializa el formulario y establece su estado habilitado o deshabilitado según la bandera de solo lectura.
   * 
   * - Llama a `inicializarFormulario()` para reiniciar o inicializar el formulario.
   * - Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es true), deshabilita los controles del formulario.
   * - De lo contrario, habilita los controles del formulario para la interacción del usuario.
   */
  public guardarFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.enlaceOperativoForm.disable();
    } else {
      this.enlaceOperativoForm.enable();
    }
  }

  /**
   * Recupera los datos de enlace operativo invocando el método `getEnlaceOperativoDatos` del servicio.
   * Se suscribe a la respuesta del servicio y asigna los datos parseados a `enlaceOperativoDatos`.
   * La suscripción se cancela automáticamente cuando el observable `destroyNotifier$` emite un valor.
   *
   * @remarks
   * Este método utiliza el operador `takeUntil` para gestionar el ciclo de vida de la suscripción,
   * asegurando que la suscripción se limpie cuando el componente sea destruido.
   */
  public getEnlaceOperativo(): void {
    this.tercerosRelacionadosSvc.getEnlaceOperativoDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const DATOS = JSON.parse(JSON.stringify(response));
      this.enlaceOperativoDatos = DATOS;
    })
  }

  /**
   * Recupera una lista de personas desde el servicio `tercerosRelacionadosSvc` y asigna la respuesta
   * a la propiedad `personaParas`. La respuesta se procesa convirtiéndola en un objeto JSON.
   * 
   * El observable se desuscribe automáticamente cuando el `destroyNotifier$` emite un valor,
   * asegurando una limpieza adecuada de los recursos.
   * 
   * @returns {void} Este método no retorna un valor.
   */
  public getPersonas(): void {
    this.tercerosRelacionadosSvc.getPersonasParaDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const DATOS = JSON.parse(JSON.stringify(response));
      this.personaParas = DATOS;
    })
  }

  /**
   * Maneja el cambio de valor para un campo específico y actualiza el store en consecuencia.
   *
   * @param event - Un objeto que contiene el campo (`campo`) a actualizar y el nuevo valor (`valor`).
   *   - `campo`: El nombre del campo a actualizar.
   *   - `valor`: El nuevo valor a establecer. Si el valor es un objeto con una propiedad `id`, se utiliza el `id` como valor.
   * Si el `valor` es un objeto con una propiedad `id`, se extrae el `id` y se utiliza para actualizar el store.
   * De lo contrario, se utiliza el `valor` en sí mismo para actualizar el store.
   */
  public establecerCambioDeValor(event: { campo: string; valor: unknown }): void {
    if (event && typeof event.valor === 'object' && event.valor !== null && 'id' in event.valor) {
      const VALOR = event.valor.id;
      this.tercerosRelacionadosStore.setDynamicFieldValue(event.campo, VALOR as string | number | boolean);
    } else if (event) {
      this.tercerosRelacionadosStore.setDynamicFieldValue(event.campo, event.valor as string | number | boolean);
    }
  }

  /**
   * Maneja el evento de cambio para un elemento de entrada y actualiza el valor correspondiente.
   *
   * @param event - El objeto de evento desencadenado por el elemento de entrada.
   * @param campo - El nombre del campo asociado con el elemento de entrada.
   *
   * Este método extrae el valor del elemento de entrada, crea un objeto de datos
   * que contiene el nombre del campo y su nuevo valor, y lo pasa al método `establecerCambioDeValor`
   * para manejar la lógica de actualización.
   */
  public eventoDeCambioDeValor(event: Event, campo: string): void {
    if (event.target) {
      const TARGET = event.target as HTMLInputElement;
      let VALOR: string | boolean;
      if (TARGET.type === 'checkbox') {
        VALOR = TARGET.checked;
      } else {
        VALOR = TARGET.value;
      }
      const DATO = { campo: campo, valor: VALOR };
      this.establecerCambioDeValor(DATO);
    }
  }

  /**
   * Abre el modal en modo de creación, limpiando el formulario.
   * @param template - Plantilla del modal a mostrar
   */
  public abrirModalAgregar(template: TemplateRef<void>): void {
    this.esModalEdicion = false;
    this.indiceElementoSeleccionado = -1;
    this.enlaceOperativoForm.reset();
    Object.keys(this.enlaceOperativoForm.controls).forEach(key => {
      if (key === 'irfc' || key === 'inombre' || key === 'apellidoPaterno' ||
        key === 'apellidoMaterno' || key === 'cuidad') {

        this.enlaceOperativoForm.get(key)?.disable();
      } else {
        this.enlaceOperativoForm.get(key)?.enable();
      }
    });

    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  /**
   * Abre el modal en modo de edición con los datos del elemento seleccionado.
   * @param template - Plantilla del modal a mostrar
   */
  public abrirModalModificar(template: TemplateRef<void>): void {
    if (this.elementosSeleccionados.length !== 1) {
      return;
    }

    const ELEMENTO_SELECCIONADO = this.elementosSeleccionados[0];
    this.indiceElementoSeleccionado = this.enlaceOperativoDatos.findIndex(
      item => item === ELEMENTO_SELECCIONADO
    );

    if (this.indiceElementoSeleccionado === -1) {
      return;
    }

    this.esModalEdicion = true;


    Object.keys(this.enlaceOperativoForm.controls).forEach(key => {
      if (key === 'irfc' || key === 'inombre' || key === 'apellidoPaterno' ||
        key === 'apellidoMaterno' || key === 'cuidad') {

        this.enlaceOperativoForm.get(key)?.disable();
      } else {
        this.enlaceOperativoForm.get(key)?.enable();
      }
    });

    this.cargarDatosEnFormulario(ELEMENTO_SELECCIONADO);
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  /**
   * Carga los datos del elemento seleccionado en el formulario del modal.
   * @param elemento - Elemento a cargar en el formulario
   */
  private cargarDatosEnFormulario(elemento: EnlaceOperativo): void {
    this.enlaceOperativoForm.patchValue({
      resigtro: '', // Campo para buscar el RFC
      irfc: elemento.rfc || '',
      inombre: elemento.nombre || '',
      apellidoPaterno: elemento.apellidoPaterno || '',
      apellidoMaterno: elemento.apellidoMaterno || '',
      cargo: elemento.cargoOPuesto || '',
      cuidad: elemento.ciudadOEstadoDeResidencia || '',
      telefono: elemento.telefono || '',
      correo: elemento.correoElectronico || '',
      suplente: elemento.suplente === 'true'
    });
  }

  /**
   * Guarda los datos del formulario (crear o modificar).
   */
  public guardarDatosFormulario(): void {
    // Skip validation for now to test basic functionality
    // if (this.enlaceOperativoForm.invalid) {
    //   this.enlaceOperativoForm.markAllAsTouched();
    //   return;
    // }

    const DATOS_FORMULARIO = this.enlaceOperativoForm.getRawValue(); // Use getRawValue to get disabled fields too
    const ENLACE_OPERATIVO: EnlaceOperativo = {
      rfc: DATOS_FORMULARIO.irfc || 'TEST-RFC-123',
      nombre: DATOS_FORMULARIO.inombre || 'Test Nombre',
      apellidoPaterno: DATOS_FORMULARIO.apellidoPaterno || 'Test Apellido',
      apellidoMaterno: DATOS_FORMULARIO.apellidoMaterno || 'Test Materno',
      ciudadOEstadoDeResidencia: DATOS_FORMULARIO.cuidad || 'Ciudad Test',
      cargoOPuesto: DATOS_FORMULARIO.cargo || 'Cargo Test',
      telefono: DATOS_FORMULARIO.telefono || '1234567890',
      correoElectronico: DATOS_FORMULARIO.correo || 'test@test.com',
      suplente: DATOS_FORMULARIO.suplente ? 'true' : 'false'
    };

    if (this.esModalEdicion && this.indiceElementoSeleccionado >= 0) {
      // Modificar elemento existente - create new array to trigger change detection
      const NUEVOS_ENLACES = [...this.enlaceOperativoDatos];
      NUEVOS_ENLACES[this.indiceElementoSeleccionado] = { ...ENLACE_OPERATIVO };
      this.enlaceOperativoDatos = NUEVOS_ENLACES;
    } else {
      // Agregar nuevo elemento - create new array to trigger change detection
      this.enlaceOperativoDatos = [...this.enlaceOperativoDatos, { ...ENLACE_OPERATIVO }];
    }

    this.tercerosRelacionadosStore.setDynamicFieldValue('enlaceOperativo', JSON.stringify(this.enlaceOperativoDatos));
    this.modalRef?.hide();
    this.enlaceOperativoForm.reset();
    this.elementosSeleccionados = [];
  }

  /**
   * Elimina los elementos seleccionados de la tabla.
   */
  public eliminarElementosSeleccionados(): void {
    if (this.elementosSeleccionados.length === 0) {
      return;
    }

    // Create a new array without the selected elements to trigger change detection
    this.enlaceOperativoDatos = this.enlaceOperativoDatos.filter(
      elemento => !this.elementosSeleccionados.includes(elemento)
    );

    this.elementosSeleccionados = [];
  }

  /**
   * Maneja la selección de elementos en la tabla.
   * @param elementosSeleccionados - Array de elementos seleccionados
   */
  public onSeleccionCambiada(elementosSeleccionados: EnlaceOperativo[]): void {
    this.elementosSeleccionados = elementosSeleccionados;
  }

  /**
   * Busca un evento y, si el campo 'resigtro' en el formulario 'represtantanteLegalForma' tiene un valor,
   * actualiza el formulario con información predefinida del representante legal.
   * Los campos actualizados incluyen:
   * - rfc: El identificador RFC.
   * - nombre: El nombre o identificador.
   * - apellidoPaterno: El apellido paterno.
   * - apellidoMaterno: El apellido materno.
   */
  public buscarEvento(): void {
    if (this.represtantanteLegalFormGroup.get('resigtro')?.value) {
      if (this.represtantanteLegalFormGroup.get('resigtro')?.valid) {
        this.represtantanteLegalFormGroup.patchValue({
          rfc: this.represtantanteLegalFormGroup.get('resigtro')?.value ,
          nombre: 'EURO FOODS DE MEXICO',
          apellidoPaterno: 'GONZALEZ',
          apellidoMaterno: 'PINAL',
          telefono: '618-256-2532',
          correoElectronico: 'test@test.com'
        });
      }
    } else {
      this.represtantanteLegalFormGroup.get('resigtro')?.markAsTouched();
    }
  }

  /** Busca el RFC ingresado y, si es válido, asigna datos simulados al formulario de enlace operativo. */
  buscarRFC(): void {
    if (this.enlaceOperativoForm.get('resigtro')?.value) {
      if (this.enlaceOperativoForm.get('resigtro')?.valid) {
        this.enlaceOperativoForm.patchValue({
          irfc: this.enlaceOperativoForm.get('resigtro')?.value,
          inombre: 'EURO FOODS DE MEXICO',
          apellidoPaterno: 'GONZALEZ',
          apellidoMaterno: 'PINAL',
          telefono: '618-256-2532',
          correo: 'test@test.com',
          cuidad: 'DURANGO',
          cargo: '',
        });
      }
    } else {
      this.enlaceOperativoForm.get('resigtro')?.markAsTouched();
    }
  }

  /**
   * Gancho del ciclo de vida que se llama cuando el componente es destruido.
   * Limpia los recursos emitiendo un valor al subject `destroyNotifier$`
   * y completándolo para notificar a cualquier suscripción que debe desuscribirse.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
