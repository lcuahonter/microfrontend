import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { ConfiguracionColumna,ConsultaioQuery,ConsultaioState,TablaDinamicaComponent, TablaSeleccion } from '@ng-mf/data-access-user';
import { PANELS1, TRANSPORTISTAS_CONFIGURACION } from '../../enums/oea-textil-registro.enum';
import { Subject, map } from 'rxjs';
import { Tramite32609Store, Tramites32609State } from '../../estados/tramites32609.store';
import { TransportistasListaInterface, TransportistasTable } from '../../modelos/oea-textil-registro.model';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { OeaTextilRegistroService } from '../../services/oea-textil-registro.service';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Tramite32609Query } from '../../estados/tramites32609.query';
import { Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';

/**
 * Componente para agregar y gestionar transportistas en el trámite 32609.
 * Permite crear, modificar, eliminar y consultar transportistas con validaciones de RFC.
 * Incluye funcionalidades de modal para diferentes estados y notificaciones.
 */
@Component({
  selector: 'app-agregar-transportistas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaDinamicaComponent],
  templateUrl: './agregar-transportistas.component.html',
  styleUrl: './agregar-transportistas.component.scss',
})
export class AgregarTransportistasComponent implements OnInit, OnDestroy {
  
  /**
   * Formulario reactivo para capturar y validar datos del transportista.
   * Incluye campos como RFC, denominación social, domicilio y CCAT.
   */
  transportistaCertificacionForm!: FormGroup;

  /**
   * Subject utilizado para gestionar la cancelación de suscripciones Observable.
   * Previene fugas de memoria al destruir el componente.
   */
   destroy$: Subject<void> = new Subject<void>();

  /**
   * Estado actual de la solicitud del trámite 32609.
   * Contiene toda la información del estado de la aplicación.
   */
  solicitudState!: Tramites32609State;

  /**
   * Configuración de paneles colapsables para la interfaz de usuario.
   * Importado desde las constantes de datos comunes.
   */
  panels1 = PANELS1

  /**
   * Tipo de selección para la tabla dinámica.
   * Configurado para usar checkboxes en la selección de filas.
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Lista de transportistas que se muestra en la tabla.
   * Array que contiene todos los transportistas agregados al trámite.
   */
  transportistasLista: TransportistasTable[] = [];

  /**
   * Configuración de columnas para la tabla de transportistas.
   * Define la estructura y formato de las columnas a mostrar.
   */
  transportistasConfiguracionColumnas: ConfiguracionColumna<TransportistasTable>[] = TRANSPORTISTAS_CONFIGURACION;
  
  /**
   * Referencia al modal principal para abrir/cerrar transportistas.
   * Se utiliza para gestionar el estado del modal de Bootstrap.
   */
  modalRefabir?: BsModalRef;
  
  /**
   * Referencia al modal de éxito para mostrar confirmaciones.
   * Muestra mensajes cuando las operaciones se completan exitosamente.
   */
  modalRefExito?: BsModalRef;
  
  /**
   * Referencia al modal de datos obligatorios.
   * Se muestra cuando faltan campos requeridos o hay datos duplicados.
   */
  modalRefDatosObligatorios?: BsModalRef;
  
  /**
   * Referencia al modal de datos básicos.
   * Se utiliza para mostrar errores de validación básica.
   */
  modalRefDatos?: BsModalRef;
  
  /**
   * Bandera que indica si el componente está en modo edición.
   * Controla el comportamiento del formulario entre agregar y modificar.
   */
  isEditMode: boolean = false;
  
  /**
   * Mensaje que se muestra en los modales de selección.
   * Contiene texto dinámico para diferentes estados de validación.
   */
  mensajeSeleccion: string = '';
  
  /**
   * Transportista actualmente seleccionado en la tabla.
   * Se utiliza para operaciones de edición y eliminación.
   */
  selectedTransportista: TransportistasTable | null = null;
  
  /**
   * Estado de consulta para determinar el modo de solo lectura.
   * Controla si el formulario debe estar habilitado o deshabilitado.
   */
  consultaState!: ConsultaioState;
  
  /**
   * Bandera que indica si el formulario debe estar en modo solo lectura.
   * Se actualiza según el estado de consulta del trámite.
   */
  esFormularioSoloLectura: boolean = false;
  
  /**
   * Referencia al template del modal de transportistas.
   * Template principal para agregar/editar transportistas.
   */
  @ViewChild('templateTransposrtistas') templateTransposrtistas!: TemplateRef<void>;
  
  /**
   * Referencia al template del modal de RFC duplicado.
   * Se muestra cuando se intenta agregar un RFC que ya existe.
   */
  @ViewChild('templateRFCDuplicado') templateRFCDuplicado!: TemplateRef<void>;
  
  /**
   * Referencia al template del modal de éxito.
   * Template para mostrar confirmaciones de operaciones exitosas.
   */
  @ViewChild('templateExito') templateExito!: TemplateRef<void>;
  
  /**
   * Referencia al template del modal de datos obligatorios.
   * Se muestra cuando faltan datos requeridos o hay errores de validación.
   */
  @ViewChild('templateDatosObligatorios') templateDatosObligatorios!: TemplateRef<void>;
  
  /**
   * Referencia al template del modal de datos básicos.
   * Template para errores de validación general.
   */
  @ViewChild('templateDatos') templateDatos!: TemplateRef<void>;
  
  /**
   * Referencia al template del modal de selección requerida.
   * Se muestra cuando se requiere seleccionar un elemento de la tabla.
   */
  @ViewChild('templateSeleccionRequerida') templateSeleccionRequerida!: TemplateRef<void>;
  
  /**
   * Referencia al template del modal de confirmación de eliminación.
   * Template para confirmar la eliminación de transportistas.
   */
  @ViewChild('templateConfirmacionEliminacion') templateConfirmacionEliminacion!: TemplateRef<void>;

  /**
   * Constructor del componente.
   * Inicializa los servicios necesarios y configura las suscripciones iniciales.
   * 
   * param fb - FormBuilder para crear formularios reactivos
   * param modalService - Servicio para gestionar modales de Bootstrap
   * param solicitudService - Servicio para operaciones de solicitud y consultas
   * param tramite32609Store - Store para gestionar el estado del trámite
   * param tramite32609Query - Query para consultar el estado del trámite
   * param consultaioQuery - Query para consultar el estado de solo lectura
   */
  constructor(
    private fb: FormBuilder,
    @Inject(BsModalService)
    private modalService: BsModalService,
    public solicitudService: OeaTextilRegistroService,
    private tramite32609Store: Tramite32609Store,
    private tramite32609Query: Tramite32609Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
          .pipe(
            takeUntil(this.destroy$),
            map((seccionState) => {
              this.esFormularioSoloLectura = seccionState.readonly;
              this.inicializarEstadoFormulario();
            })
          )
          .subscribe();
  }

  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   * Determina si debe guardar datos existentes o inicializar un formulario nuevo.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); 
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Guarda los datos del formulario y establece el estado de solo lectura.
   * Deshabilita todos los controles del formulario cuando está en modo consulta.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.transportistaCertificacionForm.disable();
    } else {
      this.transportistaCertificacionForm.enable();
    }
  }

  /**
   * Hook del ciclo de vida que se ejecuta después de la inicialización del componente.
   * Configura el estado inicial del formulario y las suscripciones necesarias.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa el formulario reactivo con los valores del estado actual.
   * Configura validaciones y campos deshabilitados según las reglas de negocio.
   * Se suscribe a los cambios del estado para actualizar el formulario automáticamente.
   */
  inicializarFormulario(): void {
    this.obtenerEstadoSolicitud();
    this.transportistaCertificacionForm = this.fb.group({
      rfcEnclaveOperativo:[this.solicitudState?.rfcEnclaveOperativo, Validators.required],
      enlaceOperativorfc: [
        {value:this.solicitudState?.enlaceOperativorfc, disabled: true}
      ],
      denominacionRazonsocial: [
        {value:this.solicitudState?.denominacionRazonsocial, disabled: true}
      ],
      domicilio: [{value:this.solicitudState?.domicilio, disabled: true}],
      ccat: [{value:this.solicitudState?.ccat, disabled: true}],
      validacionTransportistas: ['', Validators.required]
    })
  }

  /**
   * Obtiene el estado actual de la solicitud desde el store.
   * Se suscribe a los cambios del estado y actualiza la lista de transportistas.
   * Mantiene sincronizada la información entre el store y el componente.
   */

  obtenerEstadoSolicitud(): void {
    this.tramite32609Query.selectTramite32609$?.pipe(takeUntil(this.destroy$))
      .subscribe((data: Tramites32609State) => {
        this.solicitudState = data;
        this.transportistasLista = this.solicitudState.transportistasLista;
        if (data.transportistasLista) {
          this.transportistasLista = [...data.transportistasLista];
        }
      });
  }

  /**
   * Controla la funcionalidad de paneles colapsables en la interfaz.
   * Permite mostrar/ocultar secciones del formulario de manera acordeón.
   * 
   * param index - Índice del panel a mostrar/ocultar
   */
  mostrar_colapsable1(index: number): void {
    const IS_CURRENTLY_OPEN = this.panels1[index].isCollapsed;
    this.panels1.forEach((panel1, i) => {
      panel1.isCollapsed = i === index ? !IS_CURRENTLY_OPEN : true;
    });
  }

  /**
   * Abre el modal principal para agregar o editar transportistas.
   * Configura el tamaño del modal como grande para mejor visualización.
   * 
   * param templateTransposrtistas - Template del modal a mostrar
   */
  abrirModal1(templateTransposrtistas: TemplateRef<void>): void {
    this.modalRefabir = this.modalService.show(templateTransposrtistas, { class: 'modal-lg',});
  }

  /**
   * Busca información de un transportista por su RFC.
   * Valida que el RFC no esté duplicado antes de realizar la búsqueda.
   * Ejecuta la consulta al servicio para obtener datos adicionales.
   */
  buscarRFC():void{
    const RFC = this.transportistaCertificacionForm.get('rfcEnclaveOperativo')?.value;
    if (RFC) {
      // Verificar si el RFC ya existe en la tabla
      if (this.existeRFCEnTabla(RFC)) {
        this.mostrarModalRFCDuplicado();
        return;
      }
      
      this.buscarDatosPorRFC(RFC);
    }
  }

  /**
   * Verifica si un RFC ya existe en la lista de transportistas.
   * Realiza comparación insensible a mayúsculas/minúsculas.
   * 
   * param rfc - RFC a verificar en la lista
   * returns true si el RFC existe, false en caso contrario
   */
  existeRFCEnTabla(rfc: string): boolean {
    return this.transportistasLista.some(empresa => 
      empresa.rfcEnclaveOperativo?.toLowerCase() === rfc.toLowerCase()
    );
  }

  /**
   * Muestra el modal de RFC duplicado cuando se intenta agregar un RFC existente.
   * Configura el modal como pequeño y no dismissible.
   */
  mostrarModalRFCDuplicado(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-sm'
    };

    this.modalRefabir = this.modalService.show(this.templateRFCDuplicado, MODAL_CONFIG);
  }

  /**
   * Realiza la búsqueda de datos del transportista en el servicio por RFC.
   * Maneja respuestas exitosas y errores de la consulta.
   * Actualiza el formulario con los datos encontrados o limpia campos si no hay resultados.
   * 
   * param rfc - RFC del transportista a buscar
   */
  buscarDatosPorRFC(rfc: string): void {
    this.solicitudService.conseguirTransportistasLista(rfc)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (datos) => {
          const EMPRESA_DATA = datos[rfc];
          if (EMPRESA_DATA) {
            this.patchearDatosEmpresa(EMPRESA_DATA);
          } else {
            this.limpiarCamposEmpresa();
          }
        },
        error: (error) => {
          console.error('Error al buscar datos del RFC:', error);
          this.limpiarCamposEmpresa();
        }
      });
  }

  /**
   * Actualiza el formulario con los datos de la empresa encontrada.
   * Rellena automáticamente los campos de solo lectura con la información obtenida.
   * 
   * param empresaData - Datos de la empresa obtenidos del servicio
   */
  patchearDatosEmpresa(empresaData: TransportistasListaInterface): void {
    this.transportistaCertificacionForm.patchValue({
      enlaceOperativorfc: empresaData.enlaceOperativorfc,
      denominacionRazonsocial: empresaData.denominacionRazonsocial,
      domicilio: empresaData.domicilio,
      ccat: empresaData.ccat
    });
  }

  /**
   * Limpia los campos de información de la empresa en el formulario.
   * Se ejecuta cuando no se encuentran datos para el RFC consultado.
   */
  limpiarCamposEmpresa(): void {
    this.transportistaCertificacionForm.patchValue({
      enlaceOperativorfc: '',
      denominacionRazonsocial: '',
      domicilio: '',
      ccat: ''
    });
  }

  /**
   * Procesa la aceptación y validación del transportista.
   * Ejecuta todas las validaciones necesarias antes de agregar/actualizar.
   * Maneja tanto el modo de adición como el de edición de transportistas.
   */
  aceptarTransportista(): void {
    const RFC_VALUE = this.transportistaCertificacionForm.get('rfcEnclaveOperativo')?.value;
    
    // Verificar que el campo RFC requerido esté lleno
    if (!RFC_VALUE?.trim()) {
      this.transportistaCertificacionForm.get('rfcEnclaveOperativo')?.markAsTouched();
      this.mostrarModalDatos();
      return;
    }

    // Verificar si el usuario ingresó RFC pero no realizó la búsqueda (otros campos están vacíos)
    const DENOMINACION = this.transportistaCertificacionForm.get('denominacionRazonsocial')?.value;
    const DOMICILIO = this.transportistaCertificacionForm.get('domicilio')?.value;
    const ENLACE_RFC = this.transportistaCertificacionForm.get('enlaceOperativorfc')?.value;
    
    if (RFC_VALUE?.trim() && (!DENOMINACION?.trim() && !DOMICILIO?.trim() && !ENLACE_RFC?.trim())) {
      this.mostrarModalDatosObligatorios();
      return;
    }

    // En modo de edición, verificar si el RFC existe en otros registros (excluyendo el actual)
    if (this.isEditMode && this.existeRFCEnTablaExcluyendo(RFC_VALUE, this.selectedTransportista?.rfcEnclaveOperativo)) {
      this.mostrarModalDatosObligatorios();
      return;
    }

    // En modo de adición, verificar si el RFC ya existe
    if (!this.isEditMode && this.existeRFCEnTabla(RFC_VALUE)) {
      this.mostrarModalDatosObligatorios();
      return;
    }
    
    // Proceder con agregar los datos
    const FORMDATOS = this.transportistaCertificacionForm.getRawValue();
    
    const EMPRESA_DATA: TransportistasTable = {
      rfcEnclaveOperativo: FORMDATOS.rfcEnclaveOperativo,
      denominacionRazonsocial: FORMDATOS.denominacionRazonsocial,
      domicilio: FORMDATOS.domicilio,
      ccat: FORMDATOS.ccat
    };

    if (this.isEditMode && this.selectedTransportista) {
      // Actualizar registro existente
      const INDEX = this.transportistasLista.findIndex(emp => 
        emp.rfcEnclaveOperativo === this.selectedTransportista?.rfcEnclaveOperativo
      );
      if (INDEX !== -1) {
        this.transportistasLista[INDEX] = EMPRESA_DATA;
        this.transportistasLista = [...this.transportistasLista]; // Trigger change detection
      }
    } else {
      this.transportistasLista = [...this.transportistasLista, EMPRESA_DATA];
    }

    this.actualizarTransportistasListaEnStore();
    this.modalRefabir?.hide();
    this.limpiarFormulario();
    this.resetEditMode();
    
    this.mostrarModalExito();
  }

  /**
   * Verifica si un RFC existe en la tabla excluyendo un RFC específico.
   * Útil para validaciones en modo edición donde el RFC actual debe ser excluido.
   * 
   * param rfc - RFC a verificar
   * param rfcExcluir - RFC a excluir de la verificación (opcional)
   * returns true si existe el RFC (excluyendo el especificado), false en caso contrario
   */
  existeRFCEnTablaExcluyendo(rfc: string, rfcExcluir?: string): boolean {
    return this.transportistasLista.some(empresa => 
      empresa.rfcEnclaveOperativo?.toLowerCase() === rfc.toLowerCase() &&
      empresa.rfcEnclaveOperativo?.toLowerCase() !== rfcExcluir?.toLowerCase()
    );
  }

  /**
   * Muestra el modal de confirmación de éxito.
   * Se ejecuta después de completar operaciones exitosamente.
   */
  mostrarModalExito(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-sm'
    };

    this.modalRefExito = this.modalService.show(this.templateExito, MODAL_CONFIG);
  }

  /**
   * Limpia el formulario del transportista y lo reinicializa.
   * Restaura el formulario a su estado inicial con valores por defecto.
   */
  limpiarTransportista(): void {
    this.transportistaCertificacionForm.reset();
    this.inicializarFormulario();
  }

  /**
   * Limpia completamente el formulario estableciendo valores vacíos.
   * Resetea el modo de edición y prepara el formulario para una nueva entrada.
   */
  limpiarFormulario(): void {
    this.transportistaCertificacionForm.reset();
    this.transportistaCertificacionForm.patchValue({
      rfcEnclaveOperativo: '',
      enlaceOperativorfc: '',
      denominacionRazonsocial: '',
      domicilio: '',
      ccat:''
    });
    this.resetEditMode();
  }

  /**
   * Resetea el modo de edición a su estado inicial.
   * Limpia la selección actual y establece el modo como adición.
   */
  resetEditMode(): void {
    this.isEditMode = false;
    this.selectedTransportista = null;
  }

  /**
   * Cancela la operación actual del modal y limpia el formulario.
   * Cierra el modal y restaura el estado inicial del componente.
   */
  cancelarModal(): void {
    this.modalRefabir?.hide();
    this.limpiarTransportista();
  }

  /**
   * Cierra el modal de confirmación de éxito.
   * Se ejecuta después de mostrar el mensaje de operación exitosa.
   */
  cerrarModalExito(): void {
    this.modalRefExito?.hide();
  }

  /**
   * Cierra el modal de datos obligatorios.
   * Se ejecuta después de mostrar errores de validación.
   */
  cerrarModalDatosObligatorios(): void {
    this.modalRefDatosObligatorios?.hide();
  }

  /**
   * Muestra el modal de datos obligatorios para errores de validación.
   * Se usa cuando faltan campos requeridos o hay datos duplicados.
   */
  mostrarModalDatosObligatorios(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-sm'
    };

    this.modalRefDatosObligatorios = this.modalService.show(this.templateDatosObligatorios, MODAL_CONFIG);
  }

  /**
   * Muestra el modal de datos básicos para errores generales.
   * Se usa para validaciones básicas del formulario.
   */
  mostrarModalDatos(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-sm'
    };

    this.modalRefDatos = this.modalService.show(this.templateDatos, MODAL_CONFIG);
  }

  /**
   * Cierra el modal de datos básicos.
   * Se ejecuta después de mostrar errores de validación general.
   */
  cerrarModalDatos(): void {
    this.modalRefDatos?.hide();
  }

  /**
   * Inicia el proceso de modificación de un transportista existente.
   * Valida que haya un transportista seleccionado y configura el modo de edición.
   * Rellena el formulario con los datos del transportista seleccionado.
   */
  modificarTransportista(): void {
    if (this.transportistasLista.length === 0) {
    this.mensajeSeleccion = 'No se encontró información.';
    this.mostrarModalSeleccionRequerida();
    return;
    }
    if (!this.selectedTransportista) {
      this.mensajeSeleccion = 'Seleccione un registro.';
      this.mostrarModalSeleccionRequerida();
      return;
    }
    
    this.isEditMode = true;
    
    // Limpiar solo el campo RFC y rellenar otros campos desde la fila seleccionada
    this.transportistaCertificacionForm.patchValue({
      rfcEnclaveOperativo: '',
      enlaceOperativorfc: this.selectedTransportista.rfcEnclaveOperativo,
      denominacionRazonsocial: this.selectedTransportista.denominacionRazonsocial,
      domicilio: this.selectedTransportista.domicilio,
      ccat: this.selectedTransportista.ccat || ''
    });
    this.abrirModal1(this.templateTransposrtistas);
  }

  /**
   * Muestra el modal cuando se requiere seleccionar un elemento.
   * Se usa cuando el usuario intenta realizar una acción sin seleccionar un transportista.
   */
  mostrarModalSeleccionRequerida(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-sm'
    };

    this.modalRefabir = this.modalService.show(this.templateSeleccionRequerida, MODAL_CONFIG);
  }

  /**
   * Cierra el modal de selección requerida.
   * Se ejecuta después de mostrar el mensaje de selección obligatoria.
   */
  cerrarModalSeleccionRequerida(): void {
    this.modalRefabir?.hide();
  }

  /**
   * Maneja la selección de una fila en la tabla de transportistas.
   * Actualiza el transportista seleccionado para operaciones posteriores.
   * 
   * param empresa - Transportista seleccionado de la tabla
   */
  onFilaSeleccionada(empresa: TransportistasTable): void {
    this.selectedTransportista = empresa;
  }

  /**
   * Inicia el proceso de eliminación de un transportista.
   * Valida que haya un transportista seleccionado antes de proceder.
   * Muestra el modal de confirmación para la eliminación.
   */
  eliminarTransportista(): void {
    if (this.transportistasLista.length === 0 || !this.selectedTransportista) {
      this.mensajeSeleccion = 'Debe seleccionar un elemento';
      this.mostrarModalSeleccionRequerida();
      return;
    }
    this.mostrarModalConfirmacionEliminacion();
  }

  /**
   * Muestra el modal de confirmación para eliminar un transportista.
   * Requiere confirmación del usuario antes de proceder con la eliminación.
   */
  mostrarModalConfirmacionEliminacion(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-m'
    };

    this.modalRefabir = this.modalService.show(this.templateConfirmacionEliminacion, MODAL_CONFIG);
  }

  /**
   * Confirma y ejecuta la eliminación del transportista seleccionado.
   * Actualiza la lista y el store, resetea la selección y muestra confirmación.
   */
  confirmarEliminacionTransportista(): void {
    if (!this.selectedTransportista) {
      return;
    }
    
    this.transportistasLista = this.transportistasLista.filter(empresa => 
      empresa.rfcEnclaveOperativo !== this.selectedTransportista?.rfcEnclaveOperativo
    );
    
    this.actualizarTransportistasListaEnStore();
    this.selectedTransportista = null;
    
    this.modalRefabir?.hide();
    this.mensajeSeleccion = 'Datos eliminados correctamente';
    this.mostrarModalSeleccionRequerida();
  }

  /**
   * Cierra el modal de confirmación de eliminación sin realizar cambios.
   * Cancela el proceso de eliminación y mantiene el estado actual.
   */
  cerrarModalConfirmacionEliminacion(): void {
    this.modalRefabir?.hide();
  }

  /**
   * Actualiza la lista de transportistas en el store de estado.
   * Sincroniza los cambios locales con el estado global de la aplicación.
   */
  actualizarTransportistasListaEnStore(): void {
    this.tramite32609Store.establecerDatos({ transportistasLista: this.transportistasLista });
  }

  /**
   * Hook del ciclo de vida que se ejecuta antes de destruir el componente.
   * Finaliza todas las suscripciones para prevenir fugas de memoria.
   * Completa el Subject destroy$ para cancelar observables activos.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
 * Valida que exista al menos un transportista en la lista.
 * Retorna true si hay transportistas, false si la lista está vacía.
 */
public validarTransportistas(): boolean {
  this.transportistaCertificacionForm.get('validacionTransportistas')?.markAsTouched();
  
  return this.transportistasLista.length > 0;
}

}