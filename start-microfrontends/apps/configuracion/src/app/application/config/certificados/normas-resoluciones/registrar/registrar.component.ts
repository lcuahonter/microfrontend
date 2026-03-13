import { ActivatedRoute, Router } from '@angular/router';
import {
  CategoriaMensaje,
  Notificacion,
  NotificacionesComponent,
  TipoNotificacionEnum,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NormasResolucionesService } from '../service/normas-resoluciones.service';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    NotificacionesComponent
  ],
  templateUrl: './registrar.component.html',
})
export class RegistrarComponent implements OnInit {
  formRegistro: FormGroup;
  criterios: string[] = [];
  notificacion!: Notificacion;
  esModificacion = false;
  tratadoDescripcion = '';
  bloquePaisDescripcion = '';

  constructor(
    private fb: FormBuilder,
    private service: NormasResolucionesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.formRegistro = this.fb.group({
      tratado: [{ value: '', disabled: true }],
      bloquePais: [{ value: '', disabled: true }],
      criterio: ['', Validators.required],
      norma: ['', Validators.required],
      calificacion: ['Aprobado'],
      primerParrafo: [''],
      segundoParrafo: [''],
      tercerParrafo: [''],
      cuartoParrafo: [''],
      exportadorAutorizado: [false],
      parrafoExportadorAutorizado: [''],
      asunto: ['', Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.service.getCriterios().subscribe(res => { this.criterios = res; });

    this.route.queryParams.subscribe(params => {
      const TRATADO = params['tratado'];
      const BLOQUE_PAIS = params['bloquePais'];
      const ID = params['id'];

      if (TRATADO && BLOQUE_PAIS) {
        this.tratadoDescripcion = TRATADO;
        this.bloquePaisDescripcion = BLOQUE_PAIS;
        
        this.formRegistro.patchValue({
          tratado: TRATADO,
          bloquePais: BLOQUE_PAIS
        });

        if (ID) {
          this.esModificacion = true;
          this.cargarDatos(ID);
        }
      }
    });
  }

  /**
   * Carga los datos de una norma o resolución
   */
  cargarDatos(id: string): void {
    this.service.buscarNormasResoluciones('', '').subscribe(res => {
      const DATA = res.find(item => item.id?.toString() === id);
      if (DATA) {
        this.formRegistro.patchValue({
          criterio: DATA.criterio,
          norma: DATA.norma,
          calificacion: DATA.calificacion,
          primerParrafo: DATA.primerParrafo || '',
          segundoParrafo: DATA.segundoParrafo || '',
          tercerParrafo: DATA.tercerParrafo || '',
          cuartoParrafo: DATA.cuartoParrafo || '',
          exportadorAutorizado: DATA.exportadorAutorizado || false,
          parrafoExportadorAutorizado: DATA.parrafoExportadorAutorizado || '',
          asunto: DATA.asunto || '',
          activo: DATA.activo ?? true
        });
      }
    });
  }

  /**
   * Guarda los datos de una norma o resolución
   */
  onGuardar(): void {
    if (this.formRegistro.invalid) {
      this.notificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: '',
        titulo: 'Error',
        mensaje: 'Por favor complete todos los campos obligatorios',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  onCancelar(): void {
    //
  }

  onConfirmacion(_event: boolean): void {
    this.notificacion = undefined as unknown as Notificacion;
  }
}
