import { Catalogo, Notificacion, TEXTOS_303, TablaSeleccion } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite303Store, Tramite303StoreService } from '../../../../core/estados/tramites/tramite303.store';
import { AgenteAduanal } from '../../../../core/models/303/agente-aduanal.model';
import { CONFIGURACION_ENCABEZADO_FIGURAS } from '../../../../core/enums/303/figuras.enum';
import { Tramite303Query } from '../../../../core/queries/tramite303.query';
import data from '@libs/shared/theme/assets/json/303/cat-tipo-figura.json';

@Component({
  selector: 'agentes-agencias-aduanales',
  templateUrl: './agentes-agencias-aduanales.component.html',
  styleUrl: './agentes-agencias-aduanales.component.scss'
})
export class AgentesAgenciasAduanalesComponent implements OnInit, OnDestroy {
  /** Catálogo de números IMMEX */
  catFigura!: Catalogo[];
  /** Texto de la sección */
  TEXTOS = TEXTOS_303;
  /** Formulario para el agente */
  formAgente!: FormGroup;
  /** Notificación a mostrar al usuario */
  public nuevaNotificacion!: Notificacion;
  /** Configuración de la tabla de selección */
  tablaSeleccion = TablaSeleccion;
  /** Encabezado de la tabla de figuras */
  encabezadoDeTablaFigura = CONFIGURACION_ENCABEZADO_FIGURAS;
  /** Lista de figuras aduanales */
  personasFiguras: AgenteAduanal[] = [];
  /** Lista de figuras seleccionadas */
  figurasSeleccionados: AgenteAduanal[] = [];
  /** Notificador para destruir las suscripciones y evitar fugas de memoria */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Estado del trámite 303 consultado */
  public tramiteConsultado?: Tramite303Store;
  /** Variable para controlar la visibilidad del modal de agregar agente */
  agregarAgentemodal = false;

  /**
   * Constructor del componente.
   * @param tramite303State Estado del trámite 303.
   * @param tramite303Query Consulta del trámite 303.
   */
  constructor(
    private tramite303State: Tramite303StoreService,
    private tramite303Query: Tramite303Query,
  ) { }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga el catálogo de figuras y asigna el valor a la variable `catFigura`.
   */
  ngOnInit(): void {
    this.catFigura = data;
    this.formAgente = new FormBuilder().group({
      figura: [null, Validators.required],
    });
    this.tramite303Query.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.tramiteConsultado = seccionState;
          this.personasFiguras = this.tramiteConsultado?.listaFiguras || [];
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Limpia el notificador para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Método que se ejecuta al buscar una figura.
   * Realiza una consulta a la API para obtener los datos de la figura según el número de patente y RFC proporcionados.
   * Si no se encuentra la figura, muestra una notificación al usuario.
   */
  agregarAgente(): void {
    const ID_SELECCIONADO = this.formAgente.get('figura')?.value;
    if (!ID_SELECCIONADO) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: 'Avisos',
        mensaje: 'Debe seleccionar un tipo de figura para continuar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    this.tramite303State.setSeleccionarFigura(ID_SELECCIONADO);
    this.agregarAgentemodal = true;
  }

  /**
   * Método para eliminar una figura de la lista.
   * Actualmente no implementado.
   */
  eliminarFigura(): void {
    const IDS_TO_DELETE = this.figurasSeleccionados.map(figura => figura.patente);
    this.personasFiguras = this.personasFiguras.filter(figura => !IDS_TO_DELETE.includes(figura.patente));
    this.figurasSeleccionados = [];
    this.tramite303State.setListaFiguras(this.personasFiguras);
  }
}