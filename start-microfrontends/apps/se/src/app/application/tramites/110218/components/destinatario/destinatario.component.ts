import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { REGEX_DESCRIPCION_ESPECIALES } from '@libs/shared/data-access-user/src';
import { ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';

import {ConsultaioQuery} from "@ng-mf/data-access-user";

import { REG_X } from '@libs/shared/data-access-user/src';

import { TituloComponent } from '@libs/shared/data-access-user/src';

import { CertificadoTecnicoJaponService } from '../../service/certificadoTecnicoJapon.service';

import { Tramite110218Query } from '../../estados/queries/tramite110218.query';

import { Solicitud110218State, Tramite110218Store } from '../../estados/tramites/tramite110218.store';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Componente para manejar los datos del destinatario para el certificado técnico de Japón.
 * 
 * @component
 */
@Component({
  selector: 'app-destinatario',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  templateUrl: './destinatario.component.html',
  styleUrls: ['./destinatario.component.scss'],
})
export class DestinatarioComponent implements OnInit, OnDestroy {

  /**
   * Indica si el formulario debe estar en modo solo lectura.
   */
  public esSoloLectura!: boolean;

  /**
   * Formulario reactivo que contiene los datos personales del destinatario.
   */
  public datosDelDestinatario!: FormGroup;

  /**
   * Formulario reactivo que contiene los datos del domicilio del destinatario.
   */
  public domicilioDelDestinatario!: FormGroup;

  /**
   * Estado actual del trámite, obtenido del store.
   */
  public estadoSeleccionado!: Solicitud110218State;

  /**
   * Subject que permite limpiar las suscripciones activas al destruir el componente.
   * 
   * @private
   */
  private destroyed$ = new Subject<void>();

  /**
   * Constructor del componente.
   *
   * @param formBuilder Constructor de formularios reactivos.
   * @param tramite110218Store Store del estado para el trámite 110218.
   * @param tramite110218Query Query para observar cambios en el estado del trámite.
   * @param service Servicio para operaciones relacionadas al certificado técnico de Japón.
   * @param consultaQuery Query para obtener el estado de solo lectura del formulario.
   */
  constructor(
    public formBuilder: FormBuilder,
    private tramite110218Store: Tramite110218Store,
    private tramite110218Query: Tramite110218Query,
    private service: CertificadoTecnicoJaponService,
    private consultaQuery: ConsultaioQuery
  ) {}

  /**
   * Inicializa el componente: obtiene los valores del store, crea formularios y
   * observa si el formulario debe estar en modo solo lectura.
   *
   * @returns void
   */
  ngOnInit(): void {
    this.getValorStore();
    this.crearFormularioDatosDelDestinatario();
    this.crearFormularioDomicilioDelDestinatario();

    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((estadoConsulta) => {
        this.esSoloLectura = estadoConsulta.readonly;
        this.habilitarDeshabilitarFormulario();
      });
  }

  /**
   * Crea y configura el formulario de datos personales del destinatario.
   *
   * @returns void
   */
  crearFormularioDatosDelDestinatario(): void {
    this.datosDelDestinatario = this.formBuilder.group({
      nombre: [
        this.estadoSeleccionado?.nombre,
        [Validators.required, Validators.pattern(REGEX_DESCRIPCION_ESPECIALES)],
      ],
      primerApellido: [
        this.estadoSeleccionado?.primerApellido,
        [Validators.required, Validators.pattern(REGEX_DESCRIPCION_ESPECIALES)],
      ],
      segundoApellido: [
        this.estadoSeleccionado?.segundoApellido,
        [Validators.required],
      ],
      numeroderegistroFiscal: [
        this.estadoSeleccionado?.numeroderegistroFiscal,
        [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)],
      ],
      razonSocial: [
        this.estadoSeleccionado?.razonSocial,
        [Validators.required],
      ],
    });
  }

  /**
   * Crea y configura el formulario para capturar los datos del domicilio del destinatario.
   *
   * @returns void
   */
  crearFormularioDomicilioDelDestinatario(): void {
    this.domicilioDelDestinatario = this.formBuilder.group({
      calle: [
        this.estadoSeleccionado?.calle,
        Validators.required,
      ],
      numeroLetra: [
        this.estadoSeleccionado?.numeroLetra,
        Validators.required,
      ],
      ciudad: [
        this.estadoSeleccionado?.ciudad,
        Validators.required,
      ],
      correoElectronico: [
        this.estadoSeleccionado?.correoElectronico,
        [Validators.required, Validators.email],
      ],
      fax: [
        this.estadoSeleccionado?.fax,
        [Validators.pattern(REG_X.SOLO_NUMEROS)],
      ],
      telefono: [
        this.estadoSeleccionado?.telefono,
        [Validators.pattern(REG_X.SOLO_NUMEROS)],
      ],
    });
  }

  /**
   * Habilita o deshabilita los formularios en función de la propiedad `esSoloLectura`.
   *
   * @returns void
   */
  habilitarDeshabilitarFormulario(): void {
    if (this.esSoloLectura) {
      this.datosDelDestinatario.disable();
      this.domicilioDelDestinatario.disable();
    } else {
      this.datosDelDestinatario.enable();
      this.domicilioDelDestinatario.enable();
    }
  }

  /**
   * Limpia las suscripciones activas al destruir el componente para evitar fugas de memoria.
   *
   * @returns void
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Actualiza un valor del formulario en el estado global del trámite.
   *
   * @param form Formulario del cual se obtiene el valor.
   * @param control Nombre del control a actualizar en el estado.
   * @returns void
   */
  setValorStore(form: FormGroup, control: string): void {
    const VALOR = form.get(control)?.value;
    this.tramite110218Store.setTramite110218State({
      [control]: VALOR,
    });
  }

  /**
   * Se suscribe al estado del trámite y actualiza la propiedad `estadoSeleccionado`
   * cada vez que hay un cambio.
   *
   * @returns void
   */
  getValorStore(): void {
    this.tramite110218Query.selectTramite110218State$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }
}
