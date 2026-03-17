import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';

import { ConsultaioQuery, REGEX_DESCRIPCION_ESPECIALES } from '@ng-mf/data-access-user';
import { ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';

import { REG_X } from '@ng-mf/data-access-user';

import { TituloComponent } from '@ng-mf/data-access-user';

import { CertificadoTecnicoJaponService } from '../../service/certificadoTecnicoJapon.service';
import { Solicitud110218State } from '../../estados/tramites/tramite110218.store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';

import { Tramite110218Query } from '../../estados/queries/tramite110218.query';

import { Tramite110218Store } from '../../estados/tramites/tramite110218.store';

/**
 * Componente para manejar los datos del representante legal del exportador.
 *
 * Este componente permite a los usuarios introducir y visualizar los datos del representante legal,
 * incluyendo información personal y de contacto.
 */
@Component({
  selector: 'app-representante-legal',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  templateUrl: './representante-legal.component.html',
  styleUrl: './representante-legal.component.scss',
})
export class RepresentanteLegalComponent implements OnDestroy, OnInit {
  /**
   * Indica si el formulario debe estar en modo solo lectura.
   * Se actualiza según el estado de la consulta.
   */
  esSoloLectura!: boolean;
  /**
   * Formulario para los datos del exportador.
   * Contiene los campos relacionados con el representante legal, como nombre, cargo, teléfono, etc.
   */
  datosdelexportador!: FormGroup;

  /**
   * Estado seleccionado del trámite 110218.
   * Contiene los valores actuales almacenados en el estado global.
   */
  estadoSeleccionado!: Solicitud110218State;

  /**
   * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Constructor del componente.
   *
   * @param formBuilder - Constructor de formularios reactivos.
   * @param tramite110218Store - Store para manejar el estado del trámite 110218.
   * @param tramite110218Query - Query para consultar el estado del trámite 110218.
   * @param service - Servicio para obtener datos del representante legal.
   */
  constructor(
    public formBuilder: FormBuilder,
    private tramite110218Store: Tramite110218Store,
    private tramite110218Query: Tramite110218Query,
    private consultaQuery: ConsultaioQuery,
    private service: CertificadoTecnicoJaponService
  ) {}

  /**
   * Inicializa el formulario reactivo con valores predeterminados y validaciones.
   * Los campos incluyen nombre, cargo, teléfono, fax y correo electrónico.
   */
  inicializarFormulario(): void {
    this.datosdelexportador = this.formBuilder.group({
      /**
       * Nombre del representante legal.
       * Campo obligatorio, solo permite letras y espacios.
       */
      nombredelRepresentante: [
        this.estadoSeleccionado?.nombredelRepresentante,
        [Validators.required, Validators.pattern(REGEX_DESCRIPCION_ESPECIALES)],
      ],
      /**
       * Empresa del representante legal.
       * Campo de solo lectura, sin validación necesaria.
       */
      empresa: [{ value: '', disabled: true }],
      /**
       * Cargo del representante legal.
       * Campo obligatorio.
       */
      cargo: [this.estadoSeleccionado?.cargo, Validators.required],
      /**
       * Teléfono del representante legal.
       * Campo obligatorio, solo permite números.
       */
      telefonos: [
        this.estadoSeleccionado?.telefonos,
        [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)],
      ],
      /**
       * Fax del representante legal.
       * Campo obligatorio, solo permite números.
       */
      faxs: [
        this.estadoSeleccionado?.faxs,
        [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)],
      ],
      /**
       * Correo electrónico del representante legal.
       * Campo obligatorio, debe ser un correo válido.
       */
      correoElectronicos: [
        this.estadoSeleccionado?.correoElectronicos,
        [Validators.required, Validators.email],
      ],
    });
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Obtiene los datos del representante legal y configura el formulario.
   */
  ngOnInit(): void {
    this.obtenerDatosDeTabla();
    this.getValorStore();
    this.inicializarFormulario();
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((estadoConsulta) => {
        this.esSoloLectura = estadoConsulta.readonly;
        this.habilitarDeshabilitarFormulario();
      });

  }
  /**
   * Habilita o deshabilita el formulario según el modo de solo lectura.
   * Si `esSoloLectura` es verdadero, deshabilita todos los controles del formulario.
   * Si es falso, habilita todos los controles.
   */
  habilitarDeshabilitarFormulario(): void {
    if (this.esSoloLectura) {
      this.datosdelexportador.disable();
    } else {
      this.datosdelexportador.enable();
    }
  }

  /**
   * Obtiene los datos del representante legal desde el servicio.
   * Actualiza el campo "empresa" en el formulario con los datos obtenidos.
   */
  obtenerDatosDeTabla(): void {
    this.service
      .getrepresentante()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: { empresa: string }) => {
        this.datosdelexportador.patchValue({
          empresa: data.empresa,
        });
      });
  }

  /**
   * Actualiza un valor específico en el store del trámite.
   *
   * @param FormGroup - Formulario reactivo.
   * @param control - Nombre del control cuyo valor se actualizará en el store.
   */
  setValorStore(FormGroup: FormGroup, control: string): void {
    const VALOR = FormGroup.get(control)?.value;
    this.tramite110218Store.setTramite110218State({
      [control]: VALOR,
    });
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   * Suscribe al observable del estado y actualiza la propiedad `estadoSeleccionado`.
   */
  getValorStore(): void {
    this.tramite110218Query.selectTramite110218State$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}