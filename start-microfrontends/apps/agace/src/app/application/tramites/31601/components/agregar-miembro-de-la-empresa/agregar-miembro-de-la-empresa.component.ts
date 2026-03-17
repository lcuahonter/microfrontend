import { AfterViewInit } from '@angular/core';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { InputRadioComponent } from "@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component";
import { Modal } from 'bootstrap';
import { Modificacion } from '@libs/shared/data-access-user/src/core/enums/31601/modificacion.enum';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Solicitud31601State } from '../../../../estados/tramites/tramite31601.store';
import { Subject } from 'rxjs';
import { TablaSeleccion } from '@ng-mf/data-access-user';
import { TablePaginationComponent } from '@ng-mf/data-access-user';
import { Tramite31601Query } from '../../../../estados/queries/tramite31601.query';
import { Tramite31601Store } from '../../../../estados/tramites/tramite31601.store';
import { Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import enSuCaracterDe from '@libs/shared/theme/assets/json/31601/enSuCaracterDe.json';
import { map } from 'rxjs';
import miembrodelaempresaTable from '@libs/shared/theme/assets/json/31601/miembroDeLaEmpresa .json';
import nacionalidadOption from '@libs/shared/theme/assets/json/31601/nacionalidad.json';
import preOperativo from '@libs/shared/theme/assets/json/31601/preOperativo.json';
import { takeUntil } from 'rxjs';

import { Antecesor } from '../../modelos/antecesor.modal';
import { CONFIGURACION_ANTECESORES } from '../../constantes/antecesor.enum';
import { TablaDinamicaComponent } from "@libs/shared/data-access-user/src/tramites/components/tabla-dinamica/tabla-dinamica.component";

import { Notificacion, NotificacionesComponent } from "@libs/shared/data-access-user/src/tramites/components/notificaciones/notificaciones.component";

/**
 * @component
 * @name AgregarMiembroDeLaEmpresaComponent
 * @description
 * Componente que gestiona la adición de miembros de la empresa mediante un formulario reactivo, una tabla paginada y un modal de Bootstrap.
 * Utiliza catálogos cargados desde archivos JSON y mantiene estado usando un store personalizado.
 *
 * @usage
 * ```html
 * <app-agregar-miembro-de-la-empresa></app-agregar-miembro-de-la-empresa>
 * ```
 *
 * @dependencies
 * - FormBuilder
 * - Tramite31601Store
 * - Tramite31601Query
 * - ConsultaioQuery
 * - Modal de Bootstrap
 */
@Component({
  selector: 'app-agregar-miembro-de-la-empresa',
  templateUrl: './agregar-miembro-de-la-empresa.component.html',
  styleUrls: ['./agregar-miembro-de-la-empresa.component.scss'],
  standalone: true,
  imports: [
    TablePaginationComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    InputRadioComponent,
    TablaDinamicaComponent,
    NotificacionesComponent
],
})
export class AgregarMiembroDeLaEmpresaComponent
  implements OnInit, AfterViewInit, OnDestroy
{


  /**
   * Notificación para mostrar alertas al usuario.
   * Se utiliza para mostrar mensajes de éxito, error o confirmación en la interfaz.
   */
  alertaNotificacion: Notificacion | null = null;

  /**
   * Almacena los miembros seleccionados en la tabla.
   * Se utiliza para operaciones como modificar o eliminar miembros.
   */
  miembrosSeleccionados: Antecesor[] = [];

  /**
   * Configuración de la tabla de antecesores.
   * Define las columnas y opciones de visualización de la tabla dinámica.
   */
  configuracionTablaAntecesores = CONFIGURACION_ANTECESORES;
  /**
   * Notificador para completar observables al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Formulario principal del componente para agregar miembros.
   */
  agregarMiembroDeLaEmpresaFrom!: FormGroup;

  /**
   * Formulario para checkbox adicionales.
   */
  checkBoxesForm!: FormGroup;

  /**
   * Referencia al modal de Bootstrap para agregar miembros.
   */
  @ViewChild('Agregar', { static: false }) AgregarMOdel!: ElementRef;

  /**
   * Instancia del modal de Bootstrap.
   */
  AgregarModelInstance!: Modal;

  /**
   * Total de elementos en la tabla.
   */
  totalItems: number = 0;

  /**
   * Página actual en la tabla paginada.
   */
  currentPage: number = 1;

  /**
   * Elementos por página mostrados en la tabla.
   */
  itemsPerPage: number = 5;

  /**
   * Opciones para el input radio de "preoperativo".
   */
  radioOptions = preOperativo;

  /**
   * Opciones del catálogo "En su carácter de".
   */
  enSuCaracterDeOptions: Catalogo[] = enSuCaracterDe;

  /**
   * Opciones del catálogo de nacionalidades.
   */
  nacionalidadOptions: Catalogo[] = nacionalidadOption;
  /**
   * Opciones del catálogo de tipo de persona.
   */ 
  tipoDePersonaOptions: Catalogo[] = [
    { id: 1, descripcion: 'Física' },
    { id: 2, descripcion: 'Moral' }]

  /**
   * Estado de la solicitud obtenido desde el store.
   */
  public solicitudState!: Solicitud31601State;

  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

   /**
   * Tipo de selección de la tabla (checkbox).
   * Define cómo los usuarios pueden seleccionar elementos en las tablas.
   */
  seleccionTabla: TablaSeleccion = TablaSeleccion.CHECKBOX;
  /**
   * Cuerpo de datos de la tabla de miembros.
   */
  public miembroDeLaEmpresaBodyData: Antecesor[] = [];
  /**
 * @property {Modificacion} textoEstatico
 * @description Propiedad que contiene la enumeración `Modificacion`, la cual define textos estáticos
 * utilizados en el formulario y la interfaz de usuario. Estos textos están relacionados con las
 * declaraciones específicas del Registro en el Esquema Integral de Certificación.
 * 
 * @example
 * // Uso en la plantilla HTML
 * <p>{{ textoEstatico.checkbox1 }}</p>
 * <p>{{ textoEstatico.checkbox2 }}</p>
 */
  public textoEstatico = Modificacion

  /**
   * Datos de tabla obtenidos del archivo JSON correspondiente.
   */
  public getEstablecimientoTableData = miembrodelaempresaTable;

  /**
   * Constructor que inyecta los servicios necesarios.
   * @param fb Constructor de formularios
   * @param tramite31601Store Store de estado
   * @param tramite31601Query Query del store
   * @param consultaioQuery Consulta para estado de solo lectura
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
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Ciclo de vida de Angular: Inicializa el componente.
   */
  ngOnInit(): void {
    this.setEstablecimiento();
    this.inicializarEstadoFormulario();
  }
  /**
   * Sets the establishment by adding the first member from the `miembrodelaempresaTable`
   * to the `tramite31601Store` using the `agregarMiembrodelaempresaTable` method.
   *
   * @remarks
   * This method assumes that `miembrodelaempresaTable` is an array with at least one element.
   * It does not perform any validation or error handling for empty arrays.
   *
   * @returns void
   */
  setEstablecimiento() :void{
    this.tramite31601Store.agregarMiembrodelaempresaTable(miembrodelaempresaTable[0]);
   }

  /**
   * Inicializa los formularios y carga el estado desde el store.
   */
  inicializarEstadoFormulario(): void {
    this.tramite31601Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.miembroDeLaEmpresaBodyData =
            seccionState.miembrosSeleccionados;
        })
      )
      .subscribe();

    this.agregarMiembroDeLaEmpresaFrom = this.fb.group({
      ensucaracterde: [
        this.solicitudState?.ensucaracterde || '',
        Validators.required,
      ],
      rfc: [
        this.solicitudState?.rfc || ''],
      obligadoaTributarenMexico: [
        this.solicitudState?.obligadoaTributarenMexico || '',
        Validators.required,
      ],
      nacionalidad: [
        this.solicitudState?.nacionalidad || '',
        Validators.required,
      ],
      registroFederaldeContribuyentes: [
        {value:this.solicitudState?.registroFederaldeContribuyentes || 'EDOUTYHE',disabled: true }
    ],
      nombreCompleto: [
       {value:this.solicitudState?.nombreCompleto || 'EO383HE', disabled: true},
      ],
      tipoDePersonaMiembro: [
        this.solicitudState?.tipoDePersonaMiembro || '',
      ],
      nombreMiembro: [
         this.solicitudState?.nombreMiembro || ''
      ],
      apellidoPaternoMiembro: [this.solicitudState?.apellidoPaternoMiembro || ''],
      apellidoMaternoMiembro: [this.solicitudState?.apellidoMaternoMiembro || ''],
      nombreDeLaEmpresaMiembro: [
        this.solicitudState?.nombreDeLaEmpresaMiembro || '',
      ],
    });

    this.checkBoxesForm = this.fb.group({
      squemaIntegral: [
        this.solicitudState?.squemaIntegral,
        Validators.required,
      ],
      sidoModificadas: [
        this.solicitudState?.sidoModificadas,
        Validators.required,
      ],
    });

    // Modo solo lectura
    if (this.esFormularioSoloLectura) {
      Object.keys(this.checkBoxesForm.controls).forEach((key) =>
        this.checkBoxesForm.get(key)?.disable()
      );
    } else {
      Object.keys(this.checkBoxesForm.controls).forEach((key) =>
        this.checkBoxesForm.get(key)?.enable()
      );
    }


  }

/**
 * Maneja el cambio en el tipo de persona miembro.
 * Actualiza el valor en el formulario reactivo y sincroniza el valor en el store.
 * 
 * @param $event Objeto de tipo Catalogo que representa la opción seleccionada.
 */
tipoDePersonaMiembroChange($event: Catalogo): void {
  this.agregarMiembroDeLaEmpresaFrom.get('tipoDePersonaMiembro')?.setValue($event.id);
  this.setValoresStore(this.agregarMiembroDeLaEmpresaFrom, 'tipoDePersonaMiembro', 'setTipoDePersonaMiembro');
}


  /**
   * Actualiza la paginación de la tabla.
   */
  updatePagination(): void {
    const START_INDEX = (this.currentPage - 1) * this.itemsPerPage;
    this.miembroDeLaEmpresaBodyData = this.miembroDeLaEmpresaBodyData.slice(
      START_INDEX,
      START_INDEX + this.itemsPerPage
    );
  }

  /**
   * Cambia la página seleccionada en la tabla.
   * @param page Número de la nueva página
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  /**
   * Cambia la cantidad de elementos por página en la tabla.
   * @param itemsPerPage Nueva cantidad de elementos por página
   */
  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.updatePagination();
  }

  /**
   * Ciclo de vida de Angular: Inicializa el modal Bootstrap.
   */
  ngAfterViewInit(): void {
    if (this.AgregarMOdel?.nativeElement) {
      this.AgregarModelInstance = new Modal(this.AgregarMOdel.nativeElement);
    }
  }
/**
 * Establece las validaciones dinámicas según el valor de "obligado a tributar en México".
 * Si la respuesta es "Sí", los campos RFC, registro federal y nombre completo son obligatorios.
 * Si la respuesta es diferente, el campo tipo de persona miembro es obligatorio.
 */
/**
 * Establece las validaciones dinámicas según el valor de "obligado a tributar en México".
 * Si la respuesta es "Sí", los campos RFC, registro federal y nombre completo son obligatorios.
 * Si la respuesta es diferente, el campo tipo de persona miembro es obligatorio.
 */
setValidacionesObligadoa(): void {
  const VALUE = this.agregarMiembroDeLaEmpresaFrom.get('obligadoaTributarenMexico')?.value;
  const CONTROLES = this.agregarMiembroDeLaEmpresaFrom.controls;
  const ES_SI = VALUE === 'Si';
   ['registroFederaldeContribuyentes', 'rfc', 'nombreCompleto'].forEach(campo => {
    CONTROLES[campo].setValidators(ES_SI ? [Validators.required] : null);
    CONTROLES[campo].updateValueAndValidity();
  });
  CONTROLES['tipoDePersonaMiembro'].setValidators(!ES_SI ? [Validators.required] : null);
  CONTROLES['tipoDePersonaMiembro'].updateValueAndValidity();
}


/**
 * Establece las validaciones dinámicas según el tipo de persona seleccionado.
 * Si es persona física, los campos de nombre y apellidos son obligatorios.
 * Si es persona moral, el campo de nombre de la empresa es obligatorio.
 */
setValidacionestipo(): void {
  const TIPO = this.agregarMiembroDeLaEmpresaFrom.get('tipoDePersonaMiembro')?.value;
  const CONTROLES = this.agregarMiembroDeLaEmpresaFrom.controls;
  const ES_FISICA = TIPO === 1 || TIPO === '1';
  ['nombreMiembro', 'apellidoPaternoMiembro', 'apellidoMaternoMiembro'].forEach(campo => {
    CONTROLES[campo].setValidators(ES_FISICA ? [Validators.required] : null);
    CONTROLES[campo].updateValueAndValidity();
  });
  CONTROLES['nombreDeLaEmpresaMiembro'].setValidators(!ES_FISICA ? [Validators.required] : null);
  CONTROLES['nombreDeLaEmpresaMiembro'].updateValueAndValidity();
}


/**
 * Abre el modal de modificación si hay miembros seleccionados.
 * Si no hay selección, muestra una alerta solicitando seleccionar un registro.
 */
modificarModal(): void {
  if (this.miembrosSeleccionados.length > 0) {
    this.agregarMiembroDeLaEmpresaFrom.setValue(this.miembrosSeleccionados[0]);
    if (this.AgregarModelInstance) {
      this.AgregarModelInstance.show();
    }
  } else {
    this.mostrarAlertaSeleccionarRegistro();
  }
}

/**
 * Solicita confirmación para eliminar un miembro seleccionado.
 * Si hay miembros seleccionados, muestra una notificación de confirmación.
 * Si no hay selección, muestra una alerta solicitando seleccionar un registro.
 */
eliminarMiembro(): void {
  if (this.miembrosSeleccionados.length > 0) {
    this.alertaNotificacion = {
      ttl: 'eliminar confirmation',
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Confirma la eliminación',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
  } else {
    this.mostrarAlertaSeleccionarRegistro();
  }
}

/**
 * Confirma la eliminación de un miembro seleccionado.
 * Si el usuario acepta la confirmación y la notificación corresponde a la eliminación,
 * elimina el miembro seleccionado del store, limpia la selección y muestra una notificación de éxito.
 * 
 * @param $event Valor booleano que indica si el usuario confirmó la eliminación.
 */
confirmarEliminacion($event: boolean): void {
  if ($event === true && this.alertaNotificacion?.ttl === 'eliminar confirmation') {
    this.tramite31601Store.eliminarMiembrodelaempresaTable(this.miembrosSeleccionados[0]);
    this.miembrosSeleccionados = [];
    this.alertaNotificacion = null;
    setTimeout(() => {
      this.alertaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: '',
        titulo: '',
        mensaje: 'Datos eliminados correctamente',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }, 300);
  }
}

/**
 * Muestra una alerta notificando al usuario que debe seleccionar un registro.
 * Se utiliza cuando se intenta modificar o eliminar sin haber seleccionado un miembro.
 */
mostrarAlertaSeleccionarRegistro(): void {
  this.alertaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: '',
    mensaje: 'Seleccione un registro.',
    cerrar: false,
    tiempoDeEspera: 2000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: '',
  }
}
  /**
   * Muestra el modal de agregar miembro.
   */
  openAgregarModal(): void {
    if (this.AgregarModelInstance) {
      this.AgregarModelInstance.show();
      this.agregarMiembroDeLaEmpresaFrom.reset();
    }
  }
/**
 * Maneja la acción de aceptar/agregar un nuevo miembro de la empresa.
 * Si el formulario es inválido, marca todos los campos como tocados para mostrar errores.
 * Si es válido, agrega el miembro al store, cierra el modal y muestra una notificación de éxito.
 */
aceptar(): void {
  if (this.agregarMiembroDeLaEmpresaFrom.invalid) {
    this.agregarMiembroDeLaEmpresaFrom.markAllAsTouched();
  } else if (this.agregarMiembroDeLaEmpresaFrom.valid) {
    this.tramite31601Store.agregarMiembrodelaempresaTable(this.agregarMiembroDeLaEmpresaFrom.value);
    this.closeAgregarModal();
    this.alertaNotificacion = null;
    this.alertaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'success',
      modo: '',
      titulo: '',
      mensaje: 'Datos guardados correctamente',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
}
  /**
   * Cierra el modal de agregar miembro.
   */
  closeAgregarModal(): void {
    if (this.AgregarModelInstance) {
      this.AgregarModelInstance.hide();
    }
  }
  /**
   * Actualiza la lista de miembros seleccionados en la tabla.
   * Este método es llamado cuando la selección de la tabla cambia.
   * 
   * @param $event Arreglo de objetos Antecesor seleccionados.
   */
  obtenerMiembroSeleccionadas($event: Antecesor[]): void {
    this.miembrosSeleccionados = $event;
  }
  /**
   * Establece valores en el store.
   * @param form FormGroup de origen
   * @param campo Campo cuyo valor se establece
   * @param metodoNombre Método del store para actualizar el campo
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
   * Ciclo de vida de Angular: Limpia suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
