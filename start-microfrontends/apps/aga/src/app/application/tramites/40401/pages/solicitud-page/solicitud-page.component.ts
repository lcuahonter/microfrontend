/**
 * Componente principal de la página de solicitud para el trámite 40401 del sistema AGA.
 *
 * Este archivo contiene el componente Angular que gestiona la página principal de solicitud
 * del trámite 40401. Implementa un wizard de múltiples pasos que guía al usuario a través
 * del proceso de registro y solicitud, manejando la navegación, validación de formularios,
 * y coordinación con el sistema de gestión de estado reactivo.
 *
 * El componente implementa:
 * - Wizard de navegación con pasos secuenciales
 * - Gestión de estado reactivo utilizando Akita Store/Query
 * - Validación condicional de formularios por paso
 * - Control de flujo basado en configuraciones de transportación
 * - Integración con componentes hijos especializados
 * - Manejo del ciclo de vida con cleanup automático de suscripciones
 *
 * @fileoverview Componente principal del wizard de solicitud del trámite 40401
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.1.2 (Use ALERTA for Frontend Validation)
 * @since 1.0.0
 * @module SolicitudPageComponent
 */

import { BtnContinuarComponent, DatosPasos, Notificacion, SessionQuery } from '@ng-mf/data-access-user';
import { Component, ViewChild } from '@angular/core';
import { OnDestroy, OnInit } from '@angular/core';
import { ListaPasosWizard } from '@ng-mf/data-access-user';

import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

import { PASOS } from '../../enum/solicitante.enum';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Tramite40401Query } from '../../../../core/queries/tramite40401.query';
import { Tramite40401Store } from '../../../../core/estados/tramites/tramite40401.store';
import { WizardComponent } from '@ng-mf/data-access-user';
import { ALERTA } from '@libs/shared/data-access-user/src/tramites/constantes/mensajes-error-formularios';

// --- NUEVOS IMPORTS PARA LA INTEGRACIÓN CON BACKEND ---
import { RegistroCaatAereoService } from '../../services/RegistroCaatAereoController.service';
import { GuardarSolicitudRequest } from '../../models/guardar-solicitud-request.model';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src/tramites/components/paso-firma/paso-firma.component';


/**
 * Interfaz que define la estructura de acciones de botones del wizard.
 *
 * Esta interfaz especifica el contrato para objetos que representan acciones
 * ejecutadas por botones en la interfaz del wizard. Define el tipo de acción
 * a realizar y el valor numérico asociado para la navegación entre pasos.
 *
 * @interface AccionBoton
 *
 * @since 1.0.0
 */
interface AccionBoton {
  /**
   * @property {string} accion
   * Tipo de acción del botón ('cont' para continuar, 'prev' para retroceder).
   */
  accion: string;

  /**
   * @property {number} valor
   * Valor numérico que indica el índice del paso objetivo.
   */
  valor: number;
}

/**
 * Componente Angular standalone para la página de solicitud del trámite 40401.
 *
 * Este componente implementa la funcionalidad principal de la página de solicitud,
 * gestionando un wizard de múltiples pasos que guía al usuario a través del proceso
 * de registro del trámite 40401. Utiliza el patrón de gestión de estado reactivo
 * con Akita Store/Query para coordinar el estado de la aplicación y maneja
 * la navegación condicional basada en configuraciones específicas del trámite.
 *
 * Características del componente:
 * - Componente standalone con importaciones explícitas
 * - Implementa OnInit y OnDestroy para gestión del ciclo de vida
 * - Integra wizard de navegación con validación condicional
 * - Maneja estado reactivo con RxJS y Akita
 * - Controla flujo de navegación basado en configuraciones de transportación
 * - Gestiona referencias a componentes hijos especializados
 *
 * @component
 * @standalone
 * @implements {OnInit, OnDestroy}
 * @selector app-solicitud-page
 *
 * @since 1.0.0
 */
@Component({
  selector: 'app-solicitud-page',
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
  standalone: true,
  imports: [
    WizardComponent,
    PasoUnoComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    CommonModule,
    NotificacionesComponent,
    PasoFirmaComponent
  ],
})
export class SolicitudPageComponent implements OnInit, OnDestroy {
    
  readonly alertaRegistro = ALERTA;
  
  /**
   * Configuración de pasos del wizard para el proceso de solicitud del trámite 40401.
   *
   * Esta propiedad contiene un array de objetos `ListaPasosWizard` que definen
   * la estructura completa de pasos del wizard de solicitud. Cada paso incluye
   * información sobre su estado, título, y configuración de navegación, estableciendo
   * el flujo secuencial que debe seguir el usuario durante el proceso.
   *
   * @property {Array<ListaPasosWizard>} pasos
   * @readonly
   *
   * @since 1.0.0
   */
  pasos: Array<ListaPasosWizard> = PASOS;

  /**
   * Indicador de estado para el control de validación de nombres en el formulario.
   *
   * Esta propiedad booleana controla la visualización y validación de campos
   * relacionados con nombres en el formulario del trámite. Se utiliza para
   * mostrar mensajes de error o requerimientos específicos cuando la validación
   * de nombres no es satisfactoria.
   *
   * @property {boolean} nombre
   * @default false
   *
   * @since 1.0.0
   */
  nombre: boolean = false;

  /**
   * Índice del paso actualmente activo en el wizard de solicitud.
   *
   * Esta propiedad representa la posición actual del usuario dentro del flujo
   * de pasos del wizard. Se utiliza para controlar la navegación, mostrar el
   * contenido apropiado del paso actual, y gestionar la progresión a través
   * del proceso de solicitud del trámite 40401.
   *
   * @property {number} indice
   * @default 1
   *
   * @since 1.0.0
   */
  indice: number = 1;

  /**
   * Subject para gestionar la destrucción de suscripciones RxJS del componente.
   *
   * Este Subject implementa el patrón takeUntil para cancelar automáticamente
   * todas las suscripciones activas cuando el componente es destruido. Previene
   * fugas de memoria y efectos secundarios no deseados al asegurar que las
   * suscripciones se cancelen correctamente durante el ciclo de vida del componente.
   * @property {Subject<void>} destroyNotifier$
   * 
   * @since 1.0.0
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indicador de estado para habilitar o deshabilitar opciones de transportación.
   *
   * Esta propiedad booleana determina si las opciones de transportación están
   * habilitadas en el flujo actual del trámite. Se utiliza para controlar la
   * validación condicional y la navegación del wizard basada en los requisitos
   * específicos de transportación del trámite 40401.
   *
   * @property {boolean} transportacion
   * @default false
   *
   * @since 1.0.0
   */
  transportacion: boolean = false;

  /**
   * Referencia al componente hijo WizardComponent para control programático del wizard.
   *
   * Esta referencia permite la interacción directa con el componente wizard desde
   * el componente padre, habilitando el control programático de la navegación,
   * el acceso a métodos específicos del wizard, y la coordinación entre la lógica
   * del componente padre y la funcionalidad del wizard de pasos.
   *
   * @viewChild
   * @property {WizardComponent} wizardComponent
   *
   * @since 1.0.0
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Propiedad para manejar las notificaciones (Alertas de error/éxito).
   * Necesaria para el método mostrarError().
   */
  nuevaNotificacion: Notificacion = {} as Notificacion;

  /**
   * Configuración de datos para la navegación y control del wizard de solicitud.
   *
   * Este objeto contiene toda la información necesaria para configurar y controlar
   * la navegación del wizard, incluyendo el número total de pasos, el índice actual,
   * y los textos de los botones de navegación. Esta configuración se pasa al
   * componente wizard para su funcionamiento correcto.
   *
   * @property {DatosPasos} datosPasos
   *
   * @since 1.0.0
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor del componente de página de solicitud del trámite 40401.
   *
   * Inyecta las dependencias necesarias para la gestión del estado del trámite,
   * incluyendo el store para actualizaciones de estado y el query para consultas
   * reactivas. La inyección de dependencias es manejada automáticamente por el
   * framework de Angular siguiendo el patrón Akita de gestión de estado.
   *
   * @constructor
   * @param {Tramite40401Store} store - Store de Akita para gestión del estado del trámite 40401
   * @param {Tramite40401Query} tramiteQuery - Query de Akita para consultas reactivas del estado del trámite
   * @param {RegistroCaatAereoService} registroCaatAereoService - Servicio para comunicación con backend
   * @param {SessionQuery} sessionQuery - Query para obtener datos del usuario de sesión
   *
   * @since 1.0.0
   */
  constructor(
    public store: Tramite40401Store,
    public tramiteQuery: Tramite40401Query,
    private registroCaatAereoService: RegistroCaatAereoService,
    private sessionQuery: SessionQuery 
  ) {
    // Inicializa el paso activo en el store
  }

  /**
   * Método del ciclo de vida Angular que se ejecuta al inicializar el componente.
   *
   * Este método configura las suscripciones necesarias para el funcionamiento reactivo
   * del componente, estableciendo la suscripción al estado de la solicitud del trámite
   * y configurando la lógica de validación condicional para transportación. Utiliza
   * el patrón takeUntil para garantizar la limpieza automática de suscripciones.
   *
   * Operaciones realizadas:
   * - Suscripción reactiva al estado de la solicitud del trámite 40401
   * - Evaluación condicional de requisitos de transportación
   * - Configuración de validaciones basadas en pestaña activa y datos faltantes
   * - Mapeo del estado de la solicitud a propiedades locales del componente
   *
   * @method ngOnInit
   * @implements {OnInit}
   *
   * @since 1.0.0
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.transportacion =
            seccionState.pestanaActiva === 2 &&
            (!seccionState.codigo ||
              !seccionState.codigo ||
              !seccionState.codigo);
          // Asigna el estado de la solicitud al estado actual
        })
      )
      .subscribe();
  }

  /**
   * Selecciona y activa una pestaña específica en el wizard por su índice.
   *
   * Este método permite la navegación directa a un paso específico del wizard
   * actualizando el índice actual. Se utiliza para implementar navegación no
   * secuencial cuando el usuario selecciona directamente una pestaña específica
   * en la interfaz del wizard.
   *
   * @method seleccionaTab
   * @param {number} i - El índice de la pestaña/paso a seleccionar (base 1)
   * @returns {void} No retorna valor, pero actualiza el estado del componente
   *
   * @since 1.0.0
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Procesa acciones de botones del wizard y gestiona la navegación condicional.
   *
   * Este método maneja las acciones de navegación del wizard procesando eventos
   * de botones "Anterior" y "Continuar". Implementa lógica condicional específica
   * para el trámite 40401, incluyendo validaciones de transportación que pueden
   * bloquear o modificar el flujo normal de navegación del wizard.
   *
   * Lógica de procesamiento:
   * 1. Validación del rango de valores del paso objetivo
   * 2. Evaluación de requisitos de transportación para el paso 2
   * 3. Activación de validaciones específicas si faltan datos
   * 4. Navegación normal del wizard si las validaciones pasan
   * 5. Actualización del paso activo en el store de estado
   *
   * @method getValorIndice
   * @param {AccionBoton} e - Objeto que contiene la acción y el valor del índice objetivo
   * @returns {void} No retorna valor, pero ejecuta navegación y actualiza estado
   *
   * @since 1.0.0
   */
  getValorIndice(e: AccionBoton): void {
    this.limpiarErrores()
    // Interceptar el avance desde el paso 1 para guardar
    if (this.indice === 1 && e.accion === 'cont') {
        // 1. VALIDACIÓN FRONTEND OBLIGATORIA
        if (!this.validarDatosPaso1()) {
            // Usar la variable 'nombre' y 'ALERTA' para mostrar el error en el HTML
            this.nombre = true;
            this.datosPasos.indice = 1;
            // Scroll al inicio para que el usuario vea la alerta
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return; // DETENER: No llamar al backend si los datos están vacíos
        } else {
            this.nombre = false; // Limpiar error si todo está bien
        }

        // 2. Si es válido, guardar en Backend
        this.guardarEnBackend(e); 
        return; 
    }
    // Si no es el paso de guardado, usar navegación normal
    this.navegarWizard(e);
  }
  /**
   * Valida que los datos requeridos para el Paso 1 existan en el Store.
   * @returns true si los datos son válidos, false si falta algo.
   */
  private validarDatosPaso1(): boolean {
      const state = this.tramiteQuery.getValue();
      // Validar Tipo de CAAT (Select 1)
      if (!state.tipoCaat || state.tipoCaat.trim() === '') {
          return false;
      }
      // Validar Código IATA/ICAO (Select 2)
      if (!state.codigoIataIcao || state.codigoIataIcao.trim() === '') {
          return false;
      }
      // Validar Código (Input Texto) - Debe tener 3 chars
      if (!state.codigo || state.codigo.trim() === '' || state.codigo.length !== 3) {
          return false;
      }
      return true;
  }
  /**
   * Lógica original de navegación del wizard (extraída para reutilización).
   * Mantiene intactas las reglas de negocio originales de 'transportacion' y 'nombre'.
   */
  private navegarWizard(e: AccionBoton): void {
      if (e.valor > 0 && e.valor < 5) {
        if (this.transportacion && e.valor === 2) {
          this.nombre = true;
          this.datosPasos.indice = 1;
        } else {
          this.nombre = false;
          this.indice = e.valor;
          if (e.accion === 'cont') {
            this.wizardComponent.siguiente();
          } else {
            this.wizardComponent.atras();
          }
        }
        this.store.setPasoActivo(this.indice);
        // Actualizar datos del botón
        this.datosPasos = { ...this.datosPasos, indice: this.indice };
      }
      // Scroll al top al cambiar de paso para mejor UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  /**
   * Orquesta el guardado en el Backend.
   * Se ejecuta antes de avanzar al paso 2.
   */
  private guardarEnBackend(e: AccionBoton): void {
    const state = this.tramiteQuery.getValue();
    // Obtener sesión de usuario de forma segura
    const session = this.sessionQuery.getValue();
    const userProfile = (session as any).user || session;
    // 1. Mapeo de datos del Store al DTO del Backend (snake_case)
    const payload: GuardarSolicitudRequest = {
        id_solicitud: null,
        cod_iata_icao: state.codigo,
        ide_cod_transportacion_aerea: state.codigoIataIcao,
        solicitante: {
            rfc: "MAVL621207C95", 
            nombre: "JUAN PEREZ LOPEZ",
            es_persona_moral: false,
            ide_generica_1: state.tipoCaat,
            certificado_serial_number: null
        }
    };
    //Llamada al servicio
    this.registroCaatAereoService.guardar(payload)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
            next: (response: BaseResponse<any>) => {
                if (response.codigo === '00') {
                  //Extraemos el ID de la respuesta
                const nuevoId = response.datos.id_solicitud; 
                // Usamos .update() para modificar solo la propiedad idSolicitud del estado global
                this.store.update(state => ({
                    ...state,                 // Mantén todo lo demás igual
                    idSolicitud: nuevoId      // Sobrescribe el ID con el nuevo
                }));
                    this.navegarWizard(e);
                } else {
                    // ERROR DE NEGOCIO (Ej. Duplicado)
                    this.mostrarError(response.mensaje || 'Error al guardar la solicitud.');
                }
            },
            error: (err) => {
                console.error('Error HTTP:', err);
                this.mostrarError('Ocurrió un error de comunicación con el servidor.');
            }
        });
  }
  // Método auxiliar para mostrar alertas rojas
  private mostrarError(mensaje: string): void {
    this.nuevaNotificacion = {
        tipoNotificacion: 'error',
        categoria: 'error', 
        modo: 'alert', 
        mensaje: mensaje,
        titulo: 'Error',
        cerrar: true,
        tiempo: 5000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: ''
    } as Notificacion;
    
    // Scroll arriba para asegurar que el usuario vea la notificación
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  /**
   * Resetea las banderas y objetos de error para que la pantalla quede limpia.
   */
  private limpiarErrores(): void {
      this.nombre = false; // Oculta alerta frontend
      this.nuevaNotificacion = {} as Notificacion; // Oculta alerta backend
  }
  /**
   * Avanza automáticamente al siguiente paso del wizard de solicitud.
   *
   * Este método proporciona una forma conveniente de avanzar al siguiente paso
   * del wizard incrementando automáticamente el índice actual. Utiliza internamente
   * el método `getValorIndice` para aplicar todas las validaciones y lógica
   * condicional correspondiente al flujo del trámite 40401.
   *
   * @method continuar
   * @returns {void} No retorna valor, pero ejecuta navegación al siguiente paso
   *
   * @since 1.0.0
   */
  continuar(): void {
    this.getValorIndice({ accion: 'cont', valor: this.indice + 1 });
  }

  /**
   * Método del ciclo de vida Angular que se ejecuta cuando el componente es destruido.
   *
   * Este método implementa la interfaz OnDestroy y se encarga de la limpieza adecuada
   * de recursos cuando el componente es removido del DOM. Emite una señal a través
   * del Subject destroyNotifier$ para cancelar todas las suscripciones activas y
   * luego completa el Subject para liberar la memoria y prevenir fugas.
   *
   * Operaciones de limpieza realizadas:
   * 1. Emisión de señal de destrucción a través de destroyNotifier$
   * 2. Completado del Subject para liberar recursos
   * 3. Cancelación automática de todas las suscripciones usando takeUntil
   *
   * @method ngOnDestroy
   * @implements {OnDestroy}
   * @returns {void}
   *
   *
   * @since 1.0.0
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}