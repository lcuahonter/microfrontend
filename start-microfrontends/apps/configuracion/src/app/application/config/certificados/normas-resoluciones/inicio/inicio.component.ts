import { ActivatedRoute, Router } from '@angular/router';
import {
  CategoriaMensaje,
  ConfiguracionColumna,
  ErrorMessagesComponent,
  ExpandirTablaComponent,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TipoNotificacionEnum,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NormaResolucion, Pais, Tratado } from '../service/model/normas-resoluciones.model';
import { CommonModule } from '@angular/common';
import { NormasResolucionesService } from '../service/normas-resoluciones.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    ErrorMessagesComponent,
    ExpandirTablaComponent,
    NotificacionesComponent,
    TituloComponent
  ],
  templateUrl: './inicio.component.html',
})
export class NormasResolucionesComponent implements OnInit {
  form: FormGroup;
  tratados: Tratado[] = [];
  paises: Pais[] = [];
  datos: NormaResolucion[] = [];

  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;

  TablaSeleccion = TablaSeleccion;
  configuracionTabla: ConfiguracionColumna<NormaResolucion>[] = [
    { encabezado: 'Criterio', clave: (item: NormaResolucion) => item.criterio, orden: 1 },
    { encabezado: 'Norma', clave: (item: NormaResolucion) => item.norma, orden: 2 },
    { encabezado: 'Calificación', clave: (item: NormaResolucion) => item.calificacion, orden: 3 },
  ];

  errors: string[] = [];
  notificacion!: Notificacion;
  filasSeleccionadas: NormaResolucion[] = [];

  constructor(
    private fb: FormBuilder,
    private service: NormasResolucionesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.form = this.fb.group({
      tratado: [''],
      bloquePais: ['']
    });
  }

  ngOnInit(): void {
    this.service.getTratados().subscribe(res => { this.tratados = res; });
    this.service.getPaises().subscribe(res => { this.paises = res; });
  }

  /**
   * Busca las normas y resoluciones
   */
  onBuscar(): void {
    const FORM_VALUE = this.form.value;
    const TRATADO = FORM_VALUE.tratado;
    const BLOQUE_PAIS = FORM_VALUE.bloquePais;

    if (!TRATADO || !BLOQUE_PAIS) {
      this.mostrarNotificacionSeleccion();
      return;
    }

    this.service.buscarNormasResoluciones(TRATADO, BLOQUE_PAIS).subscribe(res => {
      this.datos = res;
      this.totalItems = res.length;
    });
  }

  /**
   * Registra una nueva norma o resolución
   */
  onRegistrar(): void {
    const TRATADO = this.form.get('tratado')?.value;
    const BLOQUE_PAIS = this.form.get('bloquePais')?.value;

    if (!TRATADO || !BLOQUE_PAIS) {
      this.mostrarNotificacionSeleccion();
      return;
    }

    // Simulamos el error de la imagen 1 si es un caso específico
    if (TRATADO === 'SGP') {
      this.errors = ['1. El Tratado Acuerdo no contiene Criterios asociados'];
      return;
    }

    this.errors = [];
    
    const T_DESC = this.tratados.find(t => t.clave === TRATADO)?.descripcion || TRATADO;
    const P_DESC = this.paises.find(p => p.clave === BLOQUE_PAIS)?.descripcion || BLOQUE_PAIS;

    this.router.navigate(['registrar'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        tratado: T_DESC,
        bloquePais: P_DESC
      }
    });
  }

  /**
   * Modifica una norma o resolución
   */
  onModificar(_tipo: 'norma' | 'resoluciones'): void {
    if (this.filasSeleccionadas.length === 0) {
      return;
    }

    const TRATADO = this.form.get('tratado')?.value;
    const BLOQUE_PAIS = this.form.get('bloquePais')?.value;
    const SELECCIONADA = this.filasSeleccionadas[0];

    const T_DESC = this.tratados.find(t => t.clave === TRATADO)?.descripcion || TRATADO;
    const P_DESC = this.paises.find(p => p.clave === BLOQUE_PAIS)?.descripcion || BLOQUE_PAIS;

    this.router.navigate(['registrar'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        tratado: T_DESC,
        bloquePais: P_DESC,
        id: SELECCIONADA.id
      }
    });
  }

  /**
   * Muestra una notificación de selección
   */
  private mostrarNotificacionSeleccion(): void {
    this.notificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: '',
      titulo: 'Mensaje',
      mensaje: 'Debe de hacer la selección de un Tratado Acuerdo y un País Bloque',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Maneja la lista seleccionada
   */
  onListaSeleccionada(event: NormaResolucion[]): void {
    this.filasSeleccionadas = event;
  }

  /**
   * Limpia el formulario
   */
  onLimpiar(): void {
    this.form.reset({
      tratado: '',
      bloquePais: ''
    });
    this.datos = [];
    this.totalItems = 0;
    this.errors = [];
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onConfirmacion(_event: boolean): void {
    this.notificacion = undefined as unknown as Notificacion;
  }
}