import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import {
  Solicitud261601State,
  Solicitud261601Store,
} from '../../estados/tramites261601.store';

import { CommonModule } from '@angular/common';
import { CorreccionInternaDeLaCofeprisService } from '../../services/correccion-interna-de-la-cofepris.service';

import { ReactiveFormsModule } from '@angular/forms';
import { Solicitud261601Query } from '../../estados/tramites261601.query';
import { TEXTOS } from '../../constants/constants.enum';

import {
  TituloComponent,
} from '@libs/shared/data-access-user/src';

import{ConsultaioQuery,ConsultaioState} from '@ng-mf/data-access-user';

/**
 * Componente para gestionar la solicitud del trámite 261601.
 * Este componente utiliza un formulario reactivo para capturar y mostrar
 * información relacionada con la solicitud.
 */
@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * Constante que contiene los textos utilizados en el componente.
   */
  TEXTOS = TEXTOS;

  /**
   * Folio del trámite asociado.
   */
  foliodeltramite: number = 0;

  /**
   * Tipo de solicitud asociada.
   */
  tipodesolicitud: string = '';

  /**
   * Razón social legal del solicitante.
   */
  legalRazonSocial: string = '';

  /**
   * Apellido paterno del solicitante.
   */
  apellidoPaterno: string = '';

  /**
   * Apellido materno del solicitante.
   */
  apellidoMaterno: string = '';

  /**
   * RFC del solicitante.
   */
  rfc: string = 'MAVL621207C95';

  /**
   * Formulario reactivo para capturar los datos de la solicitud.
   */
  solicitudForm!: FormGroup;

  /**
   * Estado actual de la solicitud.
   */
  solicitudState!: Solicitud261601State;

  /**
   * Observable para gestionar la destrucción del componente.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Indica si el formulario es de solo lectura.
     */
    esFormularioSoloLectura: boolean = false;
  
    /**
     * Estado de los datos de consulta.
     */
    consultaDatos!: ConsultaioState;

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /**
   * Constructor del componente.
   * @param correccionService Servicio para obtener datos de corrección interna.
   * @param solicitud261601Store Store para gestionar el estado de la solicitud.
   * @param solicitud261601Query Query para obtener datos de la solicitud.
   * @param fb FormBuilder para crear formularios reactivos.
   */
  constructor(
    private correccionService: CorreccionInternaDeLaCofeprisService,
    private solicitud261601Store: Solicitud261601Store,
    private solicitud261601Query: Solicitud261601Query,
    private fb: FormBuilder,
    private consultaioQuery: ConsultaioQuery) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario y carga los datos iniciales.
   */
  ngOnInit(): void {
    this.solicitud261601Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.createForm();
        })
      )
      .subscribe();

    this.loadFolioDelTramite();
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
        this.consultaDatos = seccionState;
        this.esFormularioSoloLectura = this.consultaDatos.readonly;
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe();
    this.inicializarEstadoFormulario();
  }

  /**
   * Crea y configura el formulario reactivo para la solicitud.
   */
  createForm(): void {
    this.solicitudForm = this.fb.group({
      detalledelaSolicitud: [this.solicitudState?.detalledelaSolicitud],
      cumplocon: [this.solicitudState?.cumplocon],
      rfc: [this.solicitudState?.rfc || this.rfc],
      legalRazonSocial: [this.solicitudState?.legalRazonSocial],
      apellidoPaterno: [this.solicitudState?.apellidoPaterno],
      apellidoMaterno: [this.solicitudState?.apellidoMaterno],
    });
  }

  /**
   * Carga el folio y el tipo de trámite asociado desde el servicio.
   */
  loadFolioDelTramite(): void {
    this.correccionService.getTramitesAsociados().subscribe((data) => {
      if (data && data.length > 0) {
        this.foliodeltramite = data[0].folioTramite;
        this.tipodesolicitud = data[0].tipoTramite;
      }
    });
  }

  /**
   * Obtiene los datos adicionales de la solicitud y los asigna al formulario.
   */
  getSolicitudData(): void {
    this.correccionService.getSolicitudData().subscribe((data) => {
      if (data && data.length > 0) {
        const SOLICITUD_DATA = data[0];
        this.solicitudForm.patchValue({
          legalRazonSocial: SOLICITUD_DATA.legalRazonSocial,
          apellidoPaterno: SOLICITUD_DATA.apellidoPaterno,
          apellidoMaterno: SOLICITUD_DATA.apellidoMaterno,
        });

        this.solicitudForm.get('legalRazonSocial')?.disable();
        this.solicitudForm.get('apellidoPaterno')?.disable();
        this.solicitudForm.get('apellidoMaterno')?.disable();
      }
    });
  }

  /**
   * Inicializa el estado del formulario.
   * Si el formulario es de solo lectura, lo deshabilita.
   * De lo contrario, lo habilita.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.solicitudForm?.disable();
    }
    else {
      this.solicitudForm?.enable();
    }
}

  /**
   * Actualiza un valor específico en el store.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Método del store a invocar.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud261601Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (
      this.solicitud261601Store[metodoNombre] as (
        value: string | number | null
      ) => void
    )(VALOR);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Libera los recursos utilizados.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
