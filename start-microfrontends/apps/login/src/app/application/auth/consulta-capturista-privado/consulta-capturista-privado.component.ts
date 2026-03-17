import { CapturistaStore, CapturistaStoreService } from '../../../estados/capturista.store';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { BusquedaRFCCURPQuery } from '../../../queries/capturista.query';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Componente para la consulta de datos de un capturista en modo privado.
 * Permite visualizar los datos consultados de un capturista en un formulario deshabilitado.
 * Ofrece la opción de confirmar los datos y regresar al registro.
 */
@Component({
  selector: 'app-consulta-capturista-privado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consulta-capturista-privado.component.html',
  styleUrl: './consulta-capturista-privado.component.scss',
})
export class ConsultaCapturistaPrivadoComponent implements OnInit {
  /** Formulario reactivo para mostrar los datos del capturista */
  formConsultaCapturista!: FormGroup;
  /** Estado actual del capturista consultado */
  public capturistaConsultado?: CapturistaStore;
  /** Notificador para cancelar suscripciones al destruir el componente */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Bandera para indicar si se deben registrar los datos */
  public registrarDatos: boolean = false;

  /**
   * Constructor que inyecta los servicios y dependencias necesarias.
   * @param busquedaQuery Query para obtener el estado del capturista consultado.
   * @param fb FormBuilder para crear el formulario reactivo.
   * @param router Router para la navegación.
   * @param capturistaStore Servicio para gestionar el estado de capturistas.
   */
  constructor(
    private busquedaQuery: BusquedaRFCCURPQuery,
    private fb: FormBuilder,
    private router: Router,
    private capturistaStore: CapturistaStoreService
  ) {
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado del capturista consultado y llena el formulario con sus datos.
   */
  ngOnInit(): void {
    this.busquedaQuery.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.capturistaConsultado = seccionState;
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
    this.crearFormCapturista();
    this.llenarCamposCapturista();
  }

  /**
   * Crea el formulario reactivo para mostrar los datos del capturista.
   * Todos los campos están deshabilitados para solo visualización.
   */
  crearFormCapturista() {
    this.formConsultaCapturista = this.fb.group({
      nombre: [{ value: '', disabled: true }],
      apellidoPaterno: [{ value: '', disabled: true }],
      apellidoMaterno: [{ value: '', disabled: true }],
      rfc: [{ value: '', disabled: true }],
      curp: [{ value: '', disabled: true }],
    });
  }

  /**
   * Llena los campos del formulario con los datos del capturista consultado.
   */
  llenarCamposCapturista() {
    if (this.capturistaConsultado) {
      this.formConsultaCapturista.get('nombre')?.setValue(this.capturistaConsultado.consultaCapturista.nombre);
      this.formConsultaCapturista.get('apellidoPaterno')?.setValue(this.capturistaConsultado.consultaCapturista.apellidoPaterno);
      this.formConsultaCapturista.get('apellidoMaterno')?.setValue(this.capturistaConsultado.consultaCapturista.apellidoMaterno);
      this.formConsultaCapturista.get('rfc')?.setValue(this.capturistaConsultado.consultaCapturista.rfc);
      this.formConsultaCapturista.get('curp')?.setValue(this.capturistaConsultado.consultaCapturista.curp);
    }
  }

  /**
  * Confirma los datos del capturista y actualiza el estado global.
  * Navega de regreso a la pantalla de registro de capturista privado.
  */
  confirmarDatosCapturista() {
    this.capturistaStore.setListaCapturistas(this.capturistaConsultado?.listaCapturistas || []);
    this.capturistaStore.setRegistraDatos(this.registrarDatos = true);
    this.router.navigate(['login/registro-capturista-privado']);
  }
}
