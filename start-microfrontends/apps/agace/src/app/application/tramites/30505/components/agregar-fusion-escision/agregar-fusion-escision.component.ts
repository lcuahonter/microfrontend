import { Component, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';

import { CommonModule, Location } from '@angular/common';
import { Solicitud30505State, Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { FusionEscision } from '../../../../core/models/30505/aviso-modificacion.model';

import { InputRadioComponent, Notificacion, NotificacionesComponent, Pedimento } from '@libs/shared/data-access-user/src';
import { SI_NO_RADIO } from '../../../../core/enums/30505/aviso-de-modificacion.enum';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
import { TercerosRelacionadosService } from '../../services/terceros-relacionados.service';

/**
 * Componente encargado de gestionar la adición de fusiones o escisiones en el trámite 30505.
 *
 * Este componente implementa la lógica y la interfaz para capturar, mostrar y almacenar los datos
 * relacionados con fusiones o escisiones de entidades, utilizando formularios reactivos y servicios
 * para la gestión del estado y la obtención de información de terceros.
 *
 * @remarks
 * - Utiliza Angular Reactive Forms para la captura y validación de datos.
 * - Se apoya en servicios y stores para la persistencia y consulta del estado del trámite.
 * - Implementa mecanismos para evitar fugas de memoria mediante la gestión de suscripciones.
 *
 * @example
 * ```html
 * <app-agregar-fusion-escision></app-agregar-fusion-escision>
 * ```
 *
 * @see Solicitud30505Store
 * @see Solicitud30505Query
 * @see TercerosRelacionadosService
 */
@Component({
  selector: 'app-agregar-fusion-escision',
  templateUrl: './agregar-fusion-escision.component.html',
  styleUrls: ['./agregar-fusion-escision.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputRadioComponent,NotificacionesComponent]
})
export class AgregarFusionEscisionComponent implements OnDestroy, OnInit {

  /**
   * Formulario reactivo utilizado para gestionar los datos de fusión o escisión.
   * Este FormGroup contiene los controles y validaciones necesarios para capturar
   * la información relacionada con el trámite correspondiente.
   */
  fusionEscisionForm!: FormGroup;
 /**
   * Opciones disponibles para indicar si la entidad está fusionada o no.
   * Utiliza el conjunto de opciones definido en `SI_NO_RADIO`.
   * 
   * @remarks
   * Este arreglo se utiliza para mostrar opciones de selección (Sí/No) en la interfaz de usuario.
   */
 fusionadaOpciones = SI_NO_RADIO;

  /**
   * Arreglo que almacena los datos relacionados con las fusiones y escisiones.
   * Cada elemento del arreglo es de tipo `FusionEscision`.
   */
  fusionEscisionData: FusionEscision[] = [];

  /**
   * Notificador utilizado para gestionar la destrucción de suscripciones en el componente.
   * Se emite un valor cuando el componente se destruye, permitiendo cancelar observables y evitar fugas de memoria.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Representa el estado actual del aviso dentro del flujo de la solicitud 30505.
   * 
   * @type {Solicitud30505State}
   * @private
   */
  private avisoState!: Solicitud30505State;
/**
 * Representa el índice del elemento que se desea eliminar.
 */
elementoParaEliminar!: number;

/**
 * Arreglo que almacena los pedimentos relacionados.
 */
pedimentos: Array<Pedimento> = [];

/**
 * Objeto que contiene la información de la notificación actual.
 * Puede ser nulo si no hay ninguna notificación activa.
 */
public nuevaNotificacion: Notificacion | null = null;

  /**
   * Constructor de la clase AgregarFusionEscisionComponent.
   * 
   * @param fb Instancia de FormBuilder para la creación y gestión de formularios reactivos.
   * @param ubicaccion Servicio Location para la manipulación de la ubicación y navegación.
   * @param tramiteStore Instancia de Solicitud30505Store para la gestión del estado de los trámites.
   * @param tramiteQuery Instancia de Solicitud30505Query para consultar el estado de los trámites.
   * @param tercerosService Servicio TercerosRelacionadosService para operaciones relacionadas con terceros.
   */
  constructor(
    private fb: FormBuilder,
    private ubicaccion: Location,
    private tramiteStore: Solicitud30505Store, private tramiteQuery: Solicitud30505Query,
    private tercerosService: TercerosRelacionadosService
  ) {
  }


  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama al método `inicializarFormulario` para configurar el formulario inicial.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
  }
  /**
   * Inicializa el formulario reactivo para el componente de fusión/escisión.
   * 
   * - Suscribe al observable `selectSolicitud$` para obtener el estado actual de la solicitud y actualizar la propiedad `AvisoState`.
   * - Crea el formulario `fusionEscisionForm` con los controles necesarios, asignando valores iniciales desde `AvisoState`.
   * - Algunos campos del formulario se inicializan como deshabilitados y con validadores requeridos.
   * - La suscripción al observable se gestiona con `takeUntil` para evitar fugas de memoria.
   * 
   * @remarks
   * Este método debe llamarse durante la inicialización del componente para asegurar que el formulario refleje el estado actual de la solicitud.
   */
  inicializarFormulario(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.avisoState = seccionState;
        })
      )
      .subscribe()

    this.fusionEscisionForm = this.fb.group({
      certificacionModal: [this.avisoState?.certificacionModal],
      rfcBusquedaModal: [this.avisoState?.rfcBusquedaModal, Validators.required],
      razonSocialFusionante: [{ value: this.avisoState?.razonSocialFusionante, disabled: true }, Validators.required],
      folioVucemFusionante: [{ value: this.avisoState?.folioVucemFusionante, disabled: true }, Validators.required],
      fechaInicioVigenciaFusionante: [{ value: this.avisoState?.fechaInicioVigenciaFusionante, disabled: true }, Validators.required],
      fechaFinVigenciaFusionante: [{ value: this.avisoState?.fechaFinVigenciaFusionante, disabled: true }, Validators.required],

      rfcBusquedaModalSC: [this.avisoState?.rfcBusquedaModalSC, Validators.required],
      razonSocialFusionanteSC: [this.avisoState?.razonSocialFusionanteSC, Validators.required]
    });

  }
/**
 * Elimina un pedimento del arreglo `pedimentos` si se confirma la acción.
 * 
 * Si el parámetro `borrar` es `true`, elimina el elemento en la posición indicada
 * por la propiedad `elementoParaEliminar`. Posteriormente, limpia la notificación activa.
 * 
 * @param borrar Indica si se debe proceder con la eliminación del pedimento.
 * @returns {void} No retorna ningún valor.
 */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
    this.nuevaNotificacion = null;
  }
 /**
 * Abre un modal de notificación para confirmar una acción o mostrar un mensaje.
 * 
 * Configura una nueva notificación con los parámetros proporcionados, incluyendo
 * el índice del elemento a eliminar y un mensaje personalizado. La notificación
 * incluye opciones de aceptar o cancelar.
 * 
 * @param i Índice del elemento relacionado con la notificación (por defecto 0).
 * @param mensaje Mensaje a mostrar en la notificación (por defecto un mensaje genérico).
 * @returns {void} No retorna ningún valor.
 */
  abrirModal(i: number = 0, mensaje: string = 'EI RFC capturado no cuenta con registro de Despacho de Mercancias'): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje, 
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
  
    this.elementoParaEliminar = i;
  }

  /**
   * Muestra u oculta los campos de certificación en el formulario según el valor seleccionado.
   *
   * Obtiene el valor del campo 'certificacionModal' del formulario y actualiza el estado en el store.
   * Si el valor es '1', deshabilita los campos relacionados con la fusión.
   * Si el valor es '0', deshabilita los mismos campos excepto 'razonSocialFusionanteSC', que se habilita.
   *
   * @remarks
   * Este método se utiliza para controlar la habilitación y deshabilitación de campos en el formulario
   * dependiendo de la opción seleccionada por el usuario en el campo de certificación.
   */
  mostrarCertificacion(): void {
    const VALOR = this.fusionEscisionForm.get('certificacionModal')?.value;
    this.tramiteStore.setAvisoDatos('certificacionModal',VALOR);
    if (VALOR === '1') {
      this.fusionEscisionForm.get('razonSocialFusionante')?.disable();
      this.fusionEscisionForm.get('folioVucemFusionante')?.disable();
      this.fusionEscisionForm.get('fechaInicioVigenciaFusionante')?.disable();
      this.fusionEscisionForm.get('fechaFinVigenciaFusionante')?.disable();
      this.fusionEscisionForm.get('razonSocialFusionanteSC')?.disable();
    } else if (VALOR === '0') {
      this.fusionEscisionForm.get('razonSocialFusionante')?.disable();
      this.fusionEscisionForm.get('folioVucemFusionante')?.disable();
      this.fusionEscisionForm.get('fechaInicioVigenciaFusionante')?.disable();
      this.fusionEscisionForm.get('fechaFinVigenciaFusionante')?.disable();
      this.fusionEscisionForm.get('razonSocialFusionanteSC')?.enable();
    }
  }

  /**
   * Carga los datos de la persona fusionada utilizando el RFC proporcionado en el formulario.
   * 
   * Si el RFC está presente en el formulario (`rfcBusquedaModal`), realiza una solicitud al servicio
   * `tercerosService` para obtener los datos de la persona asociada a ese RFC. Al recibir los datos,
   * actualiza los campos correspondientes del formulario (`razonSocialFusionante`, `folioVucemFusionante`,
   * `fechaInicioVigenciaFusionante`, `fechaFinVigenciaFusionante`) y notifica al store de trámite
   * (`tramiteStore`) con los valores obtenidos.
   * 
   * La suscripción se gestiona con `takeUntil` para evitar fugas de memoria.
   */
  cargarDatosPersonaFusionada(): void {
    const RFC = this.fusionEscisionForm.get('rfcBusquedaModal')?.value;
    if (RFC) {
      this.tercerosService.obtenerDatosPersona(RFC).pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe(
        (datos) => {

          this.fusionEscisionForm.patchValue({
            'razonSocialFusionante': datos.razonSocial,
            'folioVucemFusionante': datos.numFolioTramite,
            'fechaInicioVigenciaFusionante': datos.fechaInicioVigencia,
            'fechaFinVigenciaFusionante': datos.fechaFinVigencia
          });
          this.tramiteStore.setAvisoDatos('razonSocialFusionante',datos.razonSocial);
          this.tramiteStore.setAvisoDatos('folioVucemFusionante',datos.numFolioTramite);
          this.tramiteStore.setAvisoDatos('fechaInicioVigenciaFusionante',datos.fechaInicioVigencia);
          this.tramiteStore.setAvisoDatos('fechaFinVigenciaFusionante',datos.fechaFinVigencia);
        });
    }
  }

 /**
   * Agrega una nueva entrada de fusión o escisión utilizando los valores actuales del formulario.
   * 
   * - Obtiene los valores del formulario `fusionEscisionForm`.
   * - Crea un objeto con los datos de la fusión o escisión.
   * - Agrega el objeto al arreglo `fusionEscisionData`.
   * - Actualiza el estado en el store llamando a `tramiteStore.updateFusionDatos`.
   * - Reinicia el formulario.
   * - Navega a la ubicación anterior utilizando `ubicaccion.back()`.
   * 
   * @remarks
   * Este método se utiliza para registrar una nueva fusión o escisión en el flujo del trámite.
   */
  
  agregarFusionEscision(): void {
    const FUSION_ESCISION_VALUE = {
      certificacionModal: this.fusionEscisionForm.get('certificacionModal')?.value,
      rfcBusquedaModal: this.fusionEscisionForm.get('rfcBusquedaModal')?.value,
      razonSocialFusionante: this.fusionEscisionForm.get('razonSocialFusionante')?.value,
      folioVucemFusionante: this.fusionEscisionForm.get('folioVucemFusionante')?.value,
      fechaInicioVigenciaFusionante: this.fusionEscisionForm.get('fechaInicioVigenciaFusionante')?.value,
      fechaFinVigenciaFusionante: this.fusionEscisionForm.get('fechaFinVigenciaFusionante')?.value,
      rfcBusquedaModalSC: this.fusionEscisionForm.get('rfcBusquedaModalSC')?.value,
      razonSocialFusionanteSC: this.fusionEscisionForm.get('razonSocialFusionanteSC')?.value
    };
   
    this.fusionEscisionData.push(FUSION_ESCISION_VALUE);
    this.tramiteStore.updateFusionDatos(this.fusionEscisionData);
    this.abrirModal(0, 'Datos guardados correctamente'); 
    this.fusionEscisionForm.reset();
    setTimeout(() => {
      this.ubicaccion.back();
    }, 2000);
   
  }

  /**
   * Cierra el diálogo de fusión o escisión y navega a la ubicación anterior.
   *
   * Esta función utiliza el método `back()` del servicio `ubicaccion` para regresar
   * a la pantalla previa cuando el usuario cierra el diálogo correspondiente.
   */
  cerrarDialogoFusionEscision(): void {
    this.ubicaccion.back();
  }

   /**
   * Maneja el cambio del campo RFC en el formulario de fusión/escisión.
   * 
   * Obtiene el valor actual del campo 'rfcBusquedaModal' del formulario y
   * actualiza el aviso de datos en el store del trámite correspondiente.
   * 
   * @remarks
   * Este método se debe llamar cuando el usuario modifica el RFC en el formulario,
   * para asegurar que el store mantenga la información actualizada.
   */
  
  cambioRFC(): void {
    const RFC = this.fusionEscisionForm.get('rfcBusquedaModal')?.value;
    this.tramiteStore.setAvisoDatos('rfcBusquedaModal',RFC);
    this.abrirModal();
  }


  /**
   * Maneja el cambio del campo RFC en el formulario de fusión/escisión.
   *
   * Obtiene el valor actual del campo 'rfcBusquedaModalSC' del formulario
   * y actualiza el aviso de datos en el store del trámite correspondiente.
   *
   * @returns {void} No retorna ningún valor.
   */
  cambioRfcSC(): void {
    const VALOR = this.fusionEscisionForm.get('rfcBusquedaModalSC')?.value;
    this.tramiteStore.setAvisoDatos('rfcBusquedaModalSC',VALOR);
    
  }


  /**
   * Maneja el cambio en el campo "razonSocialSC" del formulario de fusión/escisión.
   * 
   * Obtiene el valor actualizado de la razón social de la sociedad controladora (SC)
   * desde el formulario y lo envía al store de trámites para actualizar el aviso de datos
   * correspondiente.
   *
   * @remarks
   * Este método se debe llamar cuando el usuario modifica el campo "razonSocialSC" en el formulario.
   */
  cambioRazonSocialSC(): void {
    const RAZON_SOCIAL_SC = this.fusionEscisionForm.get('razonSocialSC')?.value;
    this.tramiteStore.setAvisoDatos('razonSocialSC',RAZON_SOCIAL_SC);
  }


  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación y completa el observable `destroyNotifier$` para limpiar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}