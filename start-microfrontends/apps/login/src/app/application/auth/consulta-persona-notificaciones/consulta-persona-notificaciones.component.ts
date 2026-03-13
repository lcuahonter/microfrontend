import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroStates, RegistroStore } from '../../../estados/registro.store';
import { Subject, map, takeUntil } from 'rxjs';
import { BusquedaRFCQuery } from '../../../queries/registro.query';
import { CommonModule } from '@angular/common';
import { ConsultaRegistro } from '../../core/models/consulta-registro.model';
import { NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';

/**
 * Componente para consultar los datos de una persona y mostrar notificaciones relacionadas.
 * Permite buscar información por RFC, visualizar los datos y confirmar la información consultada.
 */
@Component({
  selector: 'app-consulta-persona-notificaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NotificacionesComponent],
  templateUrl: './consulta-persona-notificaciones.component.html',
  styleUrl: './consulta-persona-notificaciones.component.scss',
})
export class ConsultaPersonaNotificacionesComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para la consulta de persona.
   */
  formConsulta!: FormGroup;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la solicitud de registro.
   */
  public registroState!: RegistroStore;
  /**
  * Indica si los datos han sido confirmados para el registro.
  */
  public registrarDatos: boolean = false;

  /**
   * Modelo que contiene los datos del notificador consultado.
   */
  public modelNotificador?: ConsultaRegistro;

  /**
   * Constructor. Inyecta dependencias necesarias para el funcionamiento del componente.
   * @param fb FormBuilder para construir el formulario reactivo.
   * @param registroQuery Query para obtener el estado de la solicitud.
   * @param tramiteService Servicio para consultar datos por RFC o CURP.
   * @param router Servicio de enrutamiento de Angular.
   */
  constructor(
    private fb: FormBuilder,
    private registroStore: RegistroStates,
    private registroQuery: BusquedaRFCQuery,
    private router: Router
  ) {
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Suscribe al estado de la solicitud y consulta los datos iniciales.
   */
  ngOnInit(): void {
    this.registroQuery.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.registroState = seccionState;
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
    this.crearFormRequerimiento();
    this.llenarCamposNotificador();
  }
  /**
   * Consulta los datos de la persona notificadora por RFC.
   * Si el RFC está vacío, no realiza la consulta.
   */
  llenarCamposNotificador() {
    if (this.registroState) {
      this.formConsulta.get('nombre')?.setValue(this.registroState.personaNotifcador.nombre);
      this.formConsulta.get('apellidoPaterno')?.setValue(this.registroState.personaNotifcador.apellidoPaterno);
      this.formConsulta.get('apellidoMaterno')?.setValue(this.registroState.personaNotifcador.apellidoMaterno);
      this.formConsulta.get('rfc')?.setValue(this.registroState.personaNotifcador.rfc);
      this.formConsulta.get('curp')?.setValue(this.registroState.personaNotifcador.curp);
    }
  }

  /**
   * Inicializa el formulario reactivo para la consulta de persona.
   */
  crearFormRequerimiento() {
    this.formConsulta = this.fb.group({
      nombre: [{ value: '', disabled: true }],
      apellidoPaterno: [{ value: '', disabled: true }],
      apellidoMaterno: [{ value: '', disabled: true }],
      rfc: [{ value: '', disabled: true }]
    });
  }

  /**
  * Se ejecuta al destruir el componente, limpiando las suscripciones.
  */
  ngOnDestroy() {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Cancela la operación y navega a la pantalla de registro de notificaciones.
   */
  cancelarDatos() {
    if (this.registroState.personasNotificaciones.length > 0) {
      this.registroStore.setBotonEliminar(true);
    }
    this.registroStore.setValorRegistro(this.registrarDatos = false);
    this.router.navigate(['login/registro-notificadores']);
  }
  /**
   * Método para confirmar datos y enviar datos a tabla 
   */
  confirmarDatos() {
    this.registroStore.setListaNotificadores(this.registroState.personasNotificaciones || []);
    this.registroStore.setValorRegistro(this.registrarDatos = true);
    this.router.navigate(['login/registro-notificadores']);
  }
}