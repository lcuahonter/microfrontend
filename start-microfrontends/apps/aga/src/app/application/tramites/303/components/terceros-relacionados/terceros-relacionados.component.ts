import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notificacion, NotificacionesComponent, REGEX_RFC, TablaDinamicaComponent, TablaSeleccion, TituloComponent, UppercaseDirective } from '@libs/shared/data-access-user/src';
import { Subject, catchError, map, of, takeUntil } from 'rxjs';
import { Tramite303Store, Tramite303StoreService } from '../../../../core/estados/tramites/tramite303.store';
import { CommonModule } from '@angular/common';
import { ENLACE_OPERATIVO } from '../../../../core/enums/303/enlace-operativo.enum';
import { EnlaceOperativo } from '../../../../core/models/303/enlace-operativo.model';
import { EnlaceOperativoComponent } from '../enlace-operativo/enlace-operativo.component';
import { Notificadores } from '../../../../core/models/303/notificadores.model';
import { NumeroTelefonicoDirective } from '@libs/shared/data-access-user/src/tramites/directives/numeroTelefonico/numero-telefonico.directive';
import { PERSONAS_OIR_RECIBIR_NOTIFICACIONES } from '../../../../core/enums/303/personas-oir-recibir-notificaciones.enum';
import { RepresentanteLegal } from '../../../../core/models/303/representante-legal.model';
import { Tramite303Query } from '../../../../core/queries/tramite303.query';
import { Tramite303Service } from '../../../../core/services/303/tramite303.service';

/**
 * Componente para gestionar los terceros relacionados.
 */
@Component({
  selector: 'terceros-relacionados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UppercaseDirective, NumeroTelefonicoDirective, TituloComponent, NotificacionesComponent, TablaDinamicaComponent, EnlaceOperativoComponent],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
})
export class TercerosRelacionadosComponent implements OnInit {
  /** Formulario reactivo para el representante legal */
  representanteLegalForm!: FormGroup;
  /** Notificación a mostrar al usuario */
  public nuevaNotificacion!: Notificacion;
  /** Notificador para destruir las suscripciones y evitar fugas de memoria */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Configuración de la tabla de selección */
  tablaSeleccion = TablaSeleccion;
  /** Encabezado de la tabla de enlaces operativos */
  encabezadoDeTablaEnlace = ENLACE_OPERATIVO;
  /** Lista de enlaces operativos */
  public enlacesOperativos: EnlaceOperativo[] = [];
  /** Enlaces operativos seleccionados */
  public enlacesOperativosSeleccionados: EnlaceOperativo[] = [];
  /** Estado del trámite 303 consultado */
  public tramiteConsultado?: Tramite303Store;
  /** Representante legal asociado al trámite 303 */
  private representanteLegal?: RepresentanteLegal;
  /** Encabezado de la tabla de personas para oír y recibir notificaciones */
  encabezadoNotificadores = PERSONAS_OIR_RECIBIR_NOTIFICACIONES;
  /** Lista de notificadores */
  public notificadores: Notificadores[] = [];
  /** Estado del modal para agregar un enlace */
  agregarEnlaceModal = false;
  /**
   * Constructor del componente TercerosRelacionadosComponent.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param servicio Servicio para gestionar el trámite 303.
   * @param router Router para la navegación.
   * @param tramite303State Estado del trámite 303.
   * @param tramite303Query Consultas del trámite 303.
   */
  constructor(
    private fb: FormBuilder,
    private servicio: Tramite303Service,
    private tramite303State: Tramite303StoreService,
    private tramite303Query: Tramite303Query,
  ) {
    this.crearRepresentanteLegalForm();
  }

  /**
   * Método para inicializar el formulario del representante legal.
   */
  ngOnInit(): void {
    this.tramite303Query.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.tramiteConsultado = seccionState;
          this.enlacesOperativos = seccionState.listaEnlaces || [];
          if (seccionState.representanteLegal) {
            this.representanteLegal = seccionState.representanteLegal;
            this.representanteLegalForm.patchValue({
              rfc: this.representanteLegal.rfc,
              nombre: this.representanteLegal.nombre,
              primerApellido: this.representanteLegal.primerApellido,
              segundoApellido: this.representanteLegal.segundoApellido,
              telefono: this.representanteLegal.telefono,
              correo: this.representanteLegal.correo
            });
          }
          this.buscarNotificadores();
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * Busca y carga los notificadores disponibles.
   */
  buscarNotificadores(): void {
    this.servicio.consultaNotificadores()
      .pipe(
        map((data) => {
          if (data) {
            this.notificadores = data;
          }
        }),
        catchError((_error) => {
          console.error('Error al consultar catálogo IMMEX', _error);
          return of([]);
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
     * Busca un representante legal por su RFC.
     * @returns 
     */
  buscarRepresentanteLegal(): void {
    const RFC = this.representanteLegalForm.get('rfcBusqueda')?.value?.trim();
    const RFCVALUE = RFC?.trim();

    if (!RFCVALUE) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: 'Debe capturar el RFC antes de buscar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    this.ejecutarBusquedaRepresentanteLegal(RFCVALUE);
  }

  /**
   * Ejecuta la búsqueda del representante legal por su RFC.
   * @param RFCVALUE RFC del representante legal a buscar.
   */
  ejecutarBusquedaRepresentanteLegal(RFCVALUE: string): void {
    this.servicio.buscarFisicaPorRFC(RFCVALUE)
      .pipe(
        map((data) => {
          if (data) {
            this.representanteLegalForm.patchValue({
              rfc: data.rfc,
              nombre: data.nombre,
              primerApellido: data.primerApellido,
              segundoApellido: data.segundoApellido,
              telefono: data.telefono,
              correo: data.correo
            });
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'success',
              modo: 'action',
              titulo: 'Éxito',
              mensaje: 'Datos guardados correctamente.',
              cerrar: true,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
            this.representanteLegal = data;
            this.tramite303State.setRepresentanteLegal(this.representanteLegal);
          } else {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'warning',
              modo: 'action',
              titulo: 'Aviso',
              mensaje: 'El contribuyente no fue encontrado, favor de verificar el RFC.',
              cerrar: true,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
            console.error('No se encontró un socio accionista con el RFC proporcionado.');
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
   * Método para crear el formulario reactivo del representante legal 
   */
  crearRepresentanteLegalForm(): void {
    this.representanteLegalForm = this.fb.group({
      rfcBusqueda: ['', [Validators.required, Validators.pattern(REGEX_RFC)]],
      rfc: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(13), Validators.pattern(REGEX_RFC)]],
      nombre: [{ value: '', disabled: true }, [Validators.required]],
      primerApellido: [{ value: '', disabled: true }, [Validators.required]],
      segundoApellido: [{ value: '', disabled: true }],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  /** 
   * Método de ayuda para saber si un campo es inválido 
   */
  campoInvalido(campo: string): boolean {
    const CONTROL = this.representanteLegalForm.get(campo);
    return Boolean(CONTROL && CONTROL.invalid && (CONTROL.dirty || CONTROL.touched));
  }

  /**
   * Método para aceptar el enlace operativo seleccionado.
   */
  agregarEnlace(): void {
    this.agregarEnlaceModal = true;
  }

  /**
   * Método para modificar un enlace operativo existente.
   * @returns void
   */
  modificarEnlace(): void {
    if (this.enlacesOperativosSeleccionados.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: 'Debe seleccionar al menos un enlace operativo para modificar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    if (this.enlacesOperativosSeleccionados.length > 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: 'Debe seleccionar solo un enlace operativo para modificar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    const SELECT_ENLACE = this.enlacesOperativosSeleccionados[0];
    this.tramite303State.enlaceOperativoModificar(SELECT_ENLACE);
    this.agregarEnlaceModal = true;
  }

  /**
   * Método para eliminar un enlace operativo existente.
   */
  eliminarEnlace(): void {
    if (this.enlacesOperativosSeleccionados.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: 'Debe seleccionar al menos un enlace operativo para eliminar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    const RFCS_TO_DELETE = this.enlacesOperativosSeleccionados.map(enlace => enlace.rfc);
    this.enlacesOperativos = this.enlacesOperativos.filter(enlace => !RFCS_TO_DELETE.includes(enlace.rfc));
    this.enlacesOperativosSeleccionados = [];
    this.tramite303State.setListaEnlaces(this.enlacesOperativos);
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'success',
      modo: 'action',
      titulo: 'Éxito',
      mensaje: 'Enlace(s) operativo(s) eliminado(s) correctamente.',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
}
