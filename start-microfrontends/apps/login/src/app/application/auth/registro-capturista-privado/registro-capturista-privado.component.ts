import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { CapturistaStore, CapturistaStoreService } from '../../../estados/capturista.store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notificacion, NotificacionesComponent, REGEX_CURP, REGEX_RFC_FISICA, REGEX_RFC_MORAL, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Subject, catchError, map, of, takeUntil } from 'rxjs';
import { BusquedaRFCCURPQuery } from '../../../queries/capturista.query';
import { CONFIGURACION_ENCABEZADO_CAPTURISTAS } from '../../core/constantes/capturista.enum';
import { Capturista } from '../../core/models/capturista.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuariosService } from '../../core/service/usuarios.service';

@Component({
  selector: 'app-registro-capturista-privado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaDinamicaComponent, NotificacionesComponent],
  templateUrl: './registro-capturista-privado.component.html',
  styleUrl: './registro-capturista-privado.component.scss',
})
export class RegistroCapturistaPrivadoComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para la consulta de capturista */
  FormRegistroCapturistaPrivado!: FormGroup;
  /** Notificador para cancelar suscripciones al destruir el componente */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Capturista consultado actualmente */
  capturistaConsultado?: Capturista;
  /** Estado actual del capturista */
  public capturistaState!: CapturistaStore;
  /** Listado de capturistas registrados */
  listadoCapturistas: Capturista[] = [];
  /** Controla la visualización de la tabla de capturistas */
  visualizarTabla: boolean = false;
  /** Configuración del encabezado de la tabla de capturistas */
  encabezadoDeTablaCapturistas = CONFIGURACION_ENCABEZADO_CAPTURISTAS;
  /** Capturistas seleccionados en la tabla */
  capturistasSeleccionados: Capturista[] = [];
  /** Enum para la selección en la tabla */
  tablaSeleccion = TablaSeleccion;
  /** Notificación para mostrar mensajes al usuario */
  public nuevaNotificacion!: Notificacion;

  /**
   * Constructor que inyecta los servicios y dependencias necesarias.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param router Router para la navegación.
   * @param usuariosService Servicio para operaciones de usuario.
   * @param capturistaStore Servicio para gestionar el estado de capturistas.
   * @param BusquedaQuery Query para la búsqueda de RFC/CURP.
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
    private capturistaStore: CapturistaStoreService,
    private BusquedaQuery: BusquedaRFCCURPQuery
  ) {
  }
  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se crea el formulario reactivo para la consulta de capturista.
   */
  ngOnInit(): void {
    this.crearFormulario();
    this.BusquedaQuery.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.capturistaState = seccionState;
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
    this.confirmarCapturista();
  }

  /**
   * Crea el formulario reactivo para la consulta de capturista.
   * Inicializa los campos 'rfc' y 'curp' como vacíos.
   */
  crearFormulario(): void {
    this.FormRegistroCapturistaPrivado = this.fb.group({
      rfc: ['', [RegistroCapturistaPrivadoComponent.validadorRFC]],
      curp: ['', [RegistroCapturistaPrivadoComponent.validadorCURP]],
    });
  }
/**
 * 
 * @param control Método para validación de RFC del usuario
 * @returns 
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
   * 
   * @param control Método para la validación de la CURP del usuario a consultar
   * @returns 
   */
  static validadorCURP(control: AbstractControl): ValidationErrors | null {
    const CURP = control.value;
    if (!CURP) { return null; }

    const ES_VALIDO = REGEX_CURP.test(CURP);
    return ES_VALIDO ? null : { curpInvalida: true };
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Consulta un capturista usando los valores del formulario (RFC y/o CURP).
   * Si encuentra un capturista, lo almacena en el estado y navega a la vista de consulta.
   * Si no encuentra, limpia la variable capturistaConsultado.
   * Maneja errores de la petición mostrando un mensaje en consola.
   */
  consultaCapturista(): void {
    const RFC = this.FormRegistroCapturistaPrivado.get('rfc')?.value;
    const CURP = this.FormRegistroCapturistaPrivado.get('curp')?.value;
    if (!RFC && !CURP) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Alerta',
        mensaje: 'Ingresa al menos RFC o CURP para realizar la consulta..',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    this.usuariosService.consultaCapturista(RFC, CURP)
      .pipe(
        map((data) => {
          if (data) {
            this.capturistaConsultado = data;
            this.capturistaStore.setConsultaCapturista(data);
            this.router.navigate(['login/consulta-capturista']);
          } else {
            this.capturistaConsultado = undefined;
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'error',
              modo: 'action',
              titulo: 'Error',
              mensaje: 'Este usuario no se encuentra registrado.',
              cerrar: true,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
          }
        }),
        catchError((error) => {
          console.error('Error al consultar capturista:', error);
          return of(undefined);
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
  * Confirma y agrega el capturista consultado a la lista si corresponde.
  * Actualiza el estado de visualización de la tabla y la lista de capturistas.
  */
  confirmarCapturista(): void {
    if (this.capturistaState.registrarDatos) {
      this.capturistaStore.setVisualizarTabla(this.visualizarTabla = true);
      this.visualizarTabla = this.capturistaState.visualizarTabla;
      if (this.capturistaState.listaCapturistas.length === 0) {
        this.listadoCapturistas = [];
        this.capturistaStore.setListaCapturistas(this.listadoCapturistas);
      }
      this.listadoCapturistas = this.capturistaState.listaCapturistas;
      this.listadoCapturistas.push(this.capturistaState.consultaCapturista);
      this.capturistaStore.setListaCapturistas(this.listadoCapturistas);
    }
  }

  /**
   * Elimina los capturistas seleccionados de la lista y actualiza el estado.
   */
  eliminarSeleccionados(): void {
    this.capturistasSeleccionados.forEach((capturista) => {
      const INDEX = this.listadoCapturistas.indexOf(capturista);
      if (INDEX > -1) {
        this.listadoCapturistas.splice(INDEX, 1);
      }
    });
    this.capturistaStore.setListaCapturistas(this.listadoCapturistas);
    this.capturistasSeleccionados = [];
  }

  /**
   * Navega a la pantalla de firma electrónica.
   */
  enviarFirma(): void {
    if (this.listadoCapturistas.length > 0) {
      this.router.navigate(['login/firma-electronica']);
    }
    else {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Alerta',
        mensaje: 'No hay capturistas registrados para enviar a firma.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }
}
