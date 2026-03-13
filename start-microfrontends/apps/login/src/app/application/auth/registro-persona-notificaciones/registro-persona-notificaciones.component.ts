import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notificacion, NotificacionesComponent, REGEX_RFC_FISICA, REGEX_RFC_MORAL, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { RegistroStates, RegistroStore } from '../../../estados/registro.store';
import { Subject, catchError, map, of, takeUntil } from 'rxjs';
import { BusquedaRFCQuery } from '../../../queries/registro.query';
import { CONFIGURACION_ENCABEZADO_NOTIFICADORES } from '../../core/constantes/notificadores.enum';
import { CommonModule } from '@angular/common';
import { ConsultaRegistro } from '../../core/models/consulta-registro.model';
import { Router } from '@angular/router';
import { UsuariosService } from '../../core/service/usuarios.service';

/**
 * Componente para el registro de personas que recibirán notificaciones.
 * Permite capturar el RFC y navegar a la consulta de notificador.
 */
@Component({
  selector: 'app-registro-persona-notificaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TablaDinamicaComponent, NotificacionesComponent],
  templateUrl: './registro-persona-notificaciones.component.html',
  styleUrl: './registro-persona-notificaciones.component.scss',
})
export class RegistroPersonaNotificacionesComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para capturar el RFC de la persona a notificar.
   */
  public FormNotificaciones!: FormGroup;

  /**
   * Estado de la solicitud de registro.
   */
  public registroState!: RegistroStore;

  /**
   * Indica si la tabla de datos debe visualizarse.
   */
  visualizarTabla: boolean = false;

  /**
   * Lista de personas consultadas para notificaciones.
   */
  personasNotificaciones: ConsultaRegistro[] = [];

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
  * @description
  * Configuración de la tabla de notificadore.
  */
  tablaSeleccion = TablaSeleccion;

  /**
  * @description
  * Encabezado de la tabla de notificadores.
  */
  encabezadoDeTablaNotificadores = CONFIGURACION_ENCABEZADO_NOTIFICADORES;
  /**
   * @description
   * Lista de notificadores seleccionados para eliminar.
   */
  notificadoresSeleccionados: ConsultaRegistro[] = [];
  /** Modelo que contiene los datos del notificador consultado.*/
  public modelNotificador?: ConsultaRegistro;
  /** Notificación para mostrar mensajes al usuario.*/
  public nuevaNotificacion!: Notificacion;
  /** variable para visualizar el botón eliminar notificadores */
  public botonEliminar: boolean = false;

  /**
   * Constructor del componente.
   * 
   * @param fb FormBuilder para la creación de formularios reactivos.
   * @param registroStore Servicio para manipular el estado de registro.
   * @param registroQuery Query para consultar el estado de registro.
   * @param router Servicio de enrutamiento de Angular.
   */
  constructor(
    private fb: FormBuilder,
    private registroStore: RegistroStates,
    private registroQuery: BusquedaRFCQuery,
    private router: Router,
    private usuariosService: UsuariosService
  ) { }

  /**
   * Inicializa el componente, crea el formulario y suscribe a los cambios del estado de registro.
   */
  ngOnInit(): void {
    this.crearFormConsulta()
    this.registroQuery.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.registroState = seccionState;
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
    this.confirmarDatos();
    this.personasNotificaciones = this.registroState.personasNotificaciones;
    this.botonEliminar = this.registroState.eliminar;
  }

  /**
  * Se ejecuta al destruir el componente, limpiando las suscripciones.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Confirma y actualiza los datos de las personas notificadoras en el estado.
   * Si no existen personas, inicializa la lista y actualiza la visualización de la tabla.
   */
  confirmarDatos(): void {
    if (this.registroState.registrarDatos) {
      this.registroStore.setValorVisualizarTabla(this.visualizarTabla = true);
      this.visualizarTabla = this.registroState.visualizarTabla;
      if (this.registroState.personasNotificaciones.length === 0) {
        this.personasNotificaciones = [];
        this.registroStore.setListaNotificadores(this.personasNotificaciones);
      }
      this.personasNotificaciones = this.registroState.personasNotificaciones;
      this.personasNotificaciones.push(this.registroState.personaNotifcador);
      this.registroStore.setListaNotificadores(this.personasNotificaciones);
    }
  }

  /**
   * Crea el formulario reactivo para capturar el RFC.
   */
  crearFormConsulta(): void {
    this.FormNotificaciones = this.fb.group({
      rfc: ['', [Validators.required, RegistroPersonaNotificacionesComponent.validadorRFC]]
    });
  }

  /**
   * Valida el RFC ingresado en el formulario.
   * Utiliza expresiones regulares para verificar si es un RFC válido.
   * 
   * @returns Un objeto de error si el RFC es inválido, o null si es válido.
   */
  static validadorRFC(control: AbstractControl): ValidationErrors | null {
    const VALUE = control.value;
    if (!VALUE) {
      return null;
    }
    const ES_VALIDO = REGEX_RFC_FISICA.test(VALUE) || REGEX_RFC_MORAL.test(VALUE);
    return ES_VALIDO ? null : { rfcInvalido: true };
  }

  /**
   * Navega a la pantalla para agregar una persona para oír/recibir notificaciones.
   */
  agregarPersonas(): void {
    const RFC = this.FormNotificaciones.get('rfc')?.value;
    this.usuariosService.consultaNotificadores(RFC)
      .pipe(
        map((data) => {
          if (data) {
            this.modelNotificador = data;
            this.registroStore.setModeloNotificador(data);
            this.router.navigate(['login/consulta-registro-notificador']);
          } else {
            this.modelNotificador = undefined;
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: 'Alerta',
              mensaje: 'No se encuentra este registro.',
              cerrar: false,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
          }
        }),
        catchError((error) => {
          console.error('Error al consultar notificador:', error);
          return of(undefined);
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * Actualiza el store con el valor de un campo del formulario.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo a actualizar.
   * @param metodoNombre Nombre del método del store a invocar.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof RegistroStates): void {
    const VALOR = form.get(campo)?.value;
    (this.registroStore[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Elimina las personas seleccionadas de la lista de notificaciones y actualiza el store.
   */
  eliminarSeleccionados(): void {
    this.personasNotificaciones = this.personasNotificaciones.filter(
      (notificador) =>
        !this.notificadoresSeleccionados.some(
          (seleccionado) => seleccionado.rfc === notificador.rfc
        )
    );
    this.registroStore.setListaNotificadores(this.personasNotificaciones);
  }

  /**
   * Navega a la pantalla de firma electrónica.
   */
  enviarFirma(): void {
    if (this.personasNotificaciones.length > 0) {
      this.router.navigate(['login/firma-electronica']);
    } else {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Alerta',
        mensaje: 'No hay notificadores para enviar a firmar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }
}