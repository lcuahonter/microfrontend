import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ConfiguracionColumna,
  TablaDinamicaComponent,
  TablaSeleccion,
  TableBodyData,
} from '@ng-mf/data-access-user';
import {
  ENLACE_TABLA_CONFIGURACION,
  EnlaceConfiguracionItem,
} from '../../enum/enlance-tabla.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Solicitud31601State,
  Tramite31601Store,
} from '../../../../estados/tramites/tramite31601.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite31601Query } from '../../../../estados/queries/tramite31601.query';
import enlace from '@libs/shared/theme/assets/json/31601/enlace.json';
import enlaceData from '@libs/shared/theme/assets/json/31601/enlace-data.json';
import representanteDatos from '@libs/shared/theme/assets/json/31601/represtantante-data.json';

/**
 * @component EnlaceComponent
 * @description Componente para gestionar el enlace de un representante, incluyendo su información en un formulario reactivo. Forma parte del trámite 31601.
 *
 * Este componente:
 * - Muestra una tabla con datos precargados.
 * - Muestra y gestiona un formulario reactivo con datos del representante.
 * - Permite edición si no está en modo solo lectura.
 * - Usa datos precargados desde archivos JSON.
 * - Maneja el estado mediante un store y un query personalizados.
 * - Controla un modal para ingresar o editar información del representante.
 *
 * @example
 * <app-enlace></app-enlace>
 *
 * @imports
 * - TableComponent
 * - TituloComponent
 * - ReactiveFormsModule
 * - FormsModule
 *
 * @author Equipo Angular
 */
@Component({
  selector: 'app-enlace',
  standalone: true,
  imports: [
    TituloComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './enlace.component.html',
  styleUrl: './enlace.component.scss',
})
export class EnlaceComponent implements OnInit, OnDestroy {
  /**
   * Notificador para anular suscripciones y evitar fugas de memoria.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();
 /**
   * Datos predefinidos del representante.
   */
  datosRepresentativos = representanteDatos;

  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Encabezados de la tabla de enlace.
   */
  public enlaceHeaderData: string[] = [];

  /**
   * Cuerpo de la tabla de enlace (actualmente no usado directamente).
   */
  public enlanceBodyData: TableBodyData[] = [];

  /**
   * Datos de la tabla precargados desde un archivo JSON.
   */
  public enlaceTableData = enlace;

  /**
   * Formulario reactivo del representante.
   */
  public represtantante!: FormGroup;

  /**
   * Datos precargados del representante, desde archivo JSON.
   */
  public representativeData = enlaceData;

  /**
   * Estado actual del trámite.
   */
  public solicitudState!: Solicitud31601State;

  /**
   * Controla la visibilidad del modal.
   */
  public modal: string = 'modal';

  /**
   * Configuración de las columnas para la tabla de enlace.
   */
  configuracionTablaEnlace: ConfiguracionColumna<EnlaceConfiguracionItem>[] =
    ENLACE_TABLA_CONFIGURACION;

  /**
   * Tipo de selección para la tabla dinámica.
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Datos de la tabla de enlace.
   */
  datosTablaEnlace!: EnlaceConfiguracionItem[];

  /**
   * Indica si se debe mostrar el modal de datos de mercancía.
   */
  mostrarModalDatosMercancia: boolean = false;

  /**
   * Indica si se debe mostrar el popup de selección múltiple.
   */
  mostrarPopupSeleccionMultiple: boolean = false;
  /**
   * Indica si el popup está abierto.
   */
  multipleSeleccionPopupAbierto: boolean = false;

  /**
   * Indica si el popup está cerrado.
   */
  multipleSeleccionPopupCerrado: boolean = true;

  /**
   * Indica si el popup está abierto.
   */
  confirmEliminarPopupAbierto: boolean = false;

  /**
   * Indica si el popup está cerrado.
   */
  confirmEliminarPopupCerrado: boolean = true;

  /**
   * Indica si se está realizando una operación de actualización.
   */
  esOperacionDeActualizacion: boolean = false;

  /**
   * Referencia al botón o elemento de cierre del modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * Indica si el botón de modificar está habilitado.
   */
  enableModficarBoton: boolean = false;
  /**
   * Indica si el botón de eliminar está habilitado.
   */
  enableEliminarBoton: boolean = false;
  /**
   * Lista de filas seleccionadas en la tabla de enlace.
   * Contiene los items seleccionados para realizar operaciones como modificar o eliminar.
   */
  listaFilaSeleccionadaEnlace!: EnlaceConfiguracionItem[];
  /**
   * Fila seleccionada en la tabla de enlace.
   * Se usa para almacenar el último item seleccionado para operaciones posteriores.
   */
  filaSeleccionadaEnlace!: EnlaceConfiguracionItem;
/** Indica si se está editando una fila existente en la tabla de enlace */
modoEdicionEnlace: boolean = false;

/** Índice de la fila seleccionada para edición en la tabla de enlace */
filaSeleccionadaEnlaceIndex: number | null = null;

  /**
   * Constructor del componente.
   *
   * @param fb Instancia de FormBuilder para creación de formularios.
   * @param tramite31601Store Store personalizado para manejar el estado.
   * @param tramite31601Query Query para leer el estado del trámite.
   * @param consultaioQuery Query para obtener estado de la sección "consultaio".
   */
  constructor(
    private fb: FormBuilder,
    private tramite31601Store: Tramite31601Store,
    private tramite31601Query: Tramite31601Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.getRegistroForm();
        })
      )
      .subscribe();

    this.tramite31601Query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.datosTablaEnlace = seccionState.enlaceDatos;
      });
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.getRegistroForm();
    this.getEnlace();
  }

  /**
   * Obtiene y asigna los encabezados de la tabla desde el JSON.
   */
  public getEnlace(): void {
    this.enlaceHeaderData = this.enlaceTableData.tableHeader;
  }

  /**
   * Abre el modal y carga los datos del formulario.
   */
  public abrirModal(): void {
    this.modal = 'show';
    this.getRegistroForm();
  this.represtantante.reset();
  this.represtantante.get('suplente')?.setValue(false);
  }

  /**
   * Crea y configura el formulario del representante, usando datos del estado o valores por defecto.
   */
  public getRegistroForm(): void {
    this.tramite31601Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.represtantante = this.fb.group({
      resigtroReprestantante: [
        this.solicitudState?.resigtroReprestantante ??
          this.representativeData.resigtro,
        Validators.required,
      ],
      rfcReprestantante: [
        this.solicitudState?.rfcReprestantante ?? this.representativeData.rfc,
        Validators.required,
      ],
      nombreReprestante: [
        this.solicitudState?.nombreReprestante ??
          this.representativeData.nombre,
        Validators.required,
      ],
      apellidoPaterno: [
        this.solicitudState?.apellidoPaterno ??
          this.representativeData.apellidoPaterno,
        Validators.required,
      ],
      apellidoMaterno: [
        this.solicitudState?.apellidoMaterno ??
          this.representativeData.apellidoMaterno,
        Validators.required,
      ],
      cargo: [
        this.solicitudState?.cargo ?? this.representativeData.cargo,
        Validators.required,
      ],
      cuidad: [
        this.solicitudState?.cuidad ?? this.representativeData.cuidad,
        Validators.required,
      ],
      telefonoReprestantante: [
        this.solicitudState?.telefonoReprestantante ??
          this.representativeData.telefono,
        Validators.required,
      ],
      correoReprestantante: [
        this.solicitudState?.correoReprestantante ??
          this.representativeData.correo,
        Validators.required,
      ],
      suplente: [this.solicitudState?.suplente, Validators.required],
    });

    if (this.esFormularioSoloLectura) {
      Object.keys(this.represtantante.controls).forEach((key) =>
        this.represtantante.get(key)?.disable()
      );
    } else {
      Object.keys(this.represtantante.controls).forEach((key) =>
        this.represtantante.get(key)?.enable()
      );
    }

    this.patchData();
  }

  /**
   * Parchea ciertos campos del formulario como solo lectura.
   */
  public patchData(): void {
    this.represtantante.get('rfcReprestantante')?.disable();
    this.represtantante.get('nombreReprestante')?.disable();
    this.represtantante.get('apellidoPaterno')?.disable();
    this.represtantante.get('apellidoMaterno')?.disable();
    this.represtantante.get('cuidad')?.disable();
  }

  /**
   * Maneja la fila seleccionada en la tabla de enlace.
   * Actualiza los botones de modificar y eliminar según la selección.
   */
  manejarFilaSeleccionada(fila: EnlaceConfiguracionItem[]): void {
    if (fila.length === 0) {
      this.enableModficarBoton = false;
      this.enableEliminarBoton = false;
      return;
    }
    this.listaFilaSeleccionadaEnlace = fila;
    this.filaSeleccionadaEnlace = fila[fila.length - 1];
    this.enableModficarBoton = true;
    this.enableEliminarBoton = true;
  }

  /**
   * Confirma la eliminación de un enlace item.
   * Si no hay filas seleccionadas, no hace nada.
   * Abre un popup de confirmación si hay filas seleccionadas.
   */
  confirmEliminarEnlaceItem(): void {
    if (this.listaFilaSeleccionadaEnlace.length === 0) {
      return;
    }
    this.abrirElimninarConfirmationopup();
  }

 

  /**
   * Abre el modal para modificar un enlace item.
   * Si hay una sola fila seleccionada, abre el modal para editar.
   * Si hay más de una fila seleccionada, abre un popup de selección múltiple.
   */ 
modificarItemEnlace(): void {
  if (this.listaFilaSeleccionadaEnlace.length === 1) {
    const SELECCIONDA = this.listaFilaSeleccionadaEnlace[0];

    this.filaSeleccionadaEnlaceIndex = this.datosTablaEnlace.findIndex(
      item => item.id === SELECCIONDA.id
    );

    if (this.filaSeleccionadaEnlaceIndex !== -1) {
      this.modoEdicionEnlace = true;

      const FILA = this.datosTablaEnlace[this.filaSeleccionadaEnlaceIndex];

      this.represtantante.patchValue({
        resigtroReprestantante: FILA.registroFederal,
        rfcReprestantante: FILA.rfc,
        nombreReprestante: FILA.nombre,
        apellidoPaterno: FILA.apellidoPaterno,
        apellidoMaterno: FILA.apellidoMaterno,
        cargo: FILA.cargo,
        cuidad: FILA.estadoResidencia,
        telefonoReprestantante: FILA.telefono,
        correoReprestantante: FILA.correo,
        suplente: FILA.suplente,
      });
        this.abrirModalAgregar();       
    }
  } else {
   
    this.abrirMultipleSeleccionPopup();
  }
}
/**
 * Abre el modal con ID 'modalAgregar' usando Bootstrap programáticamente.
 * Solo se llama si la lógica del componente lo permite (ej. una fila seleccionada).
 * Usa document.getElementById y Modal de Bootstrap para mostrar el modal.
 */
abrirModalAgregar(): void {
  const MODAL_ELEMENT = document.getElementById('modalAgregar');
  if (MODAL_ELEMENT) {
    const MODAL = new Modal(MODAL_ELEMENT);
    MODAL.show();
  }
}
  /**
   * Elimina un enlace item seleccionado.
   * Filtra los datos de la tabla para eliminar el item seleccionado.
   * Limpia la lista de filas seleccionadas y actualiza el store.
   */
  eliminarEnlaceItem(): void {
    const IDS_TO_DELETE = this.listaFilaSeleccionadaEnlace.map(
      (item) => item.id
    );

    this.datosTablaEnlace = this.datosTablaEnlace.filter(
      (item) => !IDS_TO_DELETE.includes(item.id)
    );

    this.listaFilaSeleccionadaEnlace = [];
    this.tramite31601Store.setEnlaceTablaDatos(this.datosTablaEnlace);
    this.cerrarEliminarConfirmationPopup();
  }

  /**
   * Abre el popup de selección múltiple si el botón de modificar está habilitado.
   */
  abrirMultipleSeleccionPopup(): void {
    if (this.enableModficarBoton) {
      this.multipleSeleccionPopupAbierto = true;
    }
  }

  /**
   * Cierra el popup de selección múltiple.
   */
  cerrarMultipleSeleccionPopup(): void {
    this.multipleSeleccionPopupAbierto = false;
    this.multipleSeleccionPopupCerrado = false;
  }

  /**
   * Abre el popup de confirmación de eliminación.
   */
  abrirElimninarConfirmationopup(): void {
    this.confirmEliminarPopupAbierto = true;
  }

  /**
   * Cierra el popup de confirmación de eliminación.
   */
  cerrarEliminarConfirmationPopup(): void {
    this.confirmEliminarPopupAbierto = false;
    this.confirmEliminarPopupCerrado = false;
  }

  /**
   * Guarda los datos del formulario en la tabla de enlace.
   * Crea un nuevo objeto con los valores del formulario y lo agrega a la lista de datos de enlace.
   * Limpia los campos del formulario después de guardar.
   */
 saveDatos(): void {
  const VALOR: EnlaceConfiguracionItem = {
    id: this.modoEdicionEnlace && this.filaSeleccionadaEnlaceIndex !== null
      ? this.datosTablaEnlace[this.filaSeleccionadaEnlaceIndex].id // keep same ID
      : new Date().getTime().toString(),
    registroFederal: this.represtantante.get('resigtroReprestantante')?.value,
    rfc: this.represtantante.get('rfcReprestantante')?.value,
    nombre: this.represtantante.get('nombreReprestante')?.value,
    apellidoPaterno: this.represtantante.get('apellidoPaterno')?.value,
    apellidoMaterno: this.represtantante.get('apellidoMaterno')?.value,
    cargo: this.represtantante.get('cargo')?.value,
    estadoResidencia: this.represtantante.get('cuidad')?.value,
    telefono: this.represtantante.get('telefonoReprestantante')?.value,
    correo: this.represtantante.get('correoReprestantante')?.value,
    suplente: this.represtantante.get('suplente')?.value,
  };

  if (this.modoEdicionEnlace && this.filaSeleccionadaEnlaceIndex !== null) {
      this.datosTablaEnlace[this.filaSeleccionadaEnlaceIndex] = VALOR;
  } else {
       this.datosTablaEnlace = [...this.datosTablaEnlace, VALOR];
  }
  this.tramite31601Store.setEnlaceTablaDatos(this.datosTablaEnlace);

  this.represtantante.reset();
  this.represtantante.get('suplente')?.setValue(false);

  this.modoEdicionEnlace = false;
  this.filaSeleccionadaEnlaceIndex = null;
  this.listaFilaSeleccionadaEnlace = [];
  this.closeModal.nativeElement.click();
}

  /**
   * Establece un valor en el store de Tramite31601 desde el formulario.
   *
   * @param form Formulario del cual se toma el valor.
   * @param campo Nombre del campo del formulario.
   * @param metodoNombre Nombre del método del store al que se enviará el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite31601Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31601Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }
/**
 * @description
 * Método que busca el valor del campo `resigtroReprestantante` y, si existe,
 * actualiza (patch) los campos del formulario `represtantante` con los datos del
 * objeto `datosRepresentativos`. Esto incluye RFC, nombre, apellidos, teléfono,
 * correo y ciudad del representante.
 */
    openBuscar(): void {
    
  const RESGISTRO_VALUE = this.represtantante.get('resigtroReprestantante')?.value;

  if (RESGISTRO_VALUE) {
    this.represtantante.patchValue({
      rfcReprestantante: RESGISTRO_VALUE,
      nombreReprestante: this.datosRepresentativos.nombre,
      apellidoPaterno: this.datosRepresentativos.apellidoPaterno,
      apellidoMaterno: this.datosRepresentativos.apellidoMaterno,
      telefono:this.datosRepresentativos.telefono,
      correo:this.datosRepresentativos.correo,
      cuidad:this.datosRepresentativos.cuidad,
      telefonoReprestantante:this.datosRepresentativos.telefono,
      correoReprestantante:this.datosRepresentativos.correo,    
    });
  }
}
  /**
   * Método de limpieza que se ejecuta al destruir el componente. Cancela suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
