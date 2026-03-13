/**
 * @componente
 * @nombre DatosDelTramiteComponente
 * @descripción
 * Componente que gestiona los datos del trámite 220103.
 * Proporciona funcionalidades para manejar formularios dinámicos, tablas de mercancías y la interacción con el estado del trámite.
 */

import { CommonModule } from '@angular/common';

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { AlertComponent, ConsultaioQuery, ModeloDeFormaDinamica, TablaSeleccion } from '@ng-mf/data-access-user';
import { CAMPOS_FORMULARIO_DATOS_DEL_TRAMITE, CAMPOS_FORMULARIO_MERCANCIAS, CONFIGURACION_MERCANCIAS, IMPORTANTE } from '../../constantes/sanidad-acuicola-importacion.enum';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Mercancia } from '../../modelos/sanidad-acuicola-importacion.model';
import { SanidadAcuicolaImportacionService } from '../../services/sanidad-acuicola-importacion.service';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { Tramite220103Query } from '../../estados/queries/tramites220103.query';

import { Tramite220103State, Tramite220103Store } from '../../estados/tramites/tramites220103.store';

import { guid } from '@datorama/akita';

/**
 * Componente que gestiona los datos del trámite 220103.
 */
@Component({
  selector: 'app-datos-del-tramite',
  standalone: true,
  imports: [CommonModule, AlertComponent, FormasDinamicasComponent, TablaDinamicaComponent],
  templateUrl: './datos-del-tramite.component.html',
  styleUrl: './datos-del-tramite.component.scss',
})
export class DatosDelTramiteComponent implements OnInit, OnDestroy {

  /**
   * Indica si se está modificando una mercancía.
   */
  esModificarMercancia: boolean = false;

  /**
   * Referencia al modal de mercancías.
   */
  @ViewChild('cerrarModal') cerrarModalRef!: ElementRef;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Se actualiza según el estado de la consulta.
   */
  esSoloLectura!: boolean;

  /**
   * Notificador para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private notificadorDestruccion$ = new Subject<void>();

  /**
   * Lista de mercancías seleccionadas en la tabla.
   */
  mercanciasSeleccionadas: Mercancia[] = [];

  /**
   * Mensaje importante que se muestra en el componente.
   */
  mensajeImportante: string = IMPORTANTE.Importante;

  /**
   * Formulario dinámico para los datos del trámite.
   */
  formularioDatosTramite!: FormGroup;

  /**
   * Formulario dinámico para los datos de mercancías.
   */
  formularioDatosMercancia!: FormGroup;

  /**
   * Configuración de los campos del formulario de datos del trámite.
   */
  configuracionFormularioDatos: ModeloDeFormaDinamica[] = CAMPOS_FORMULARIO_DATOS_DEL_TRAMITE;

  /**
   * Configuración de los campos del formulario de mercancías.
   */
  configuracionFormularioMercancia: ModeloDeFormaDinamica[] = CAMPOS_FORMULARIO_MERCANCIAS;

  /**
   * Estado seleccionado del trámite.
   */
  estadoSeleccionado!: Tramite220103State;

  /**
   * Estado seleccionado de la mercancía.
   */
  estadoSeleccionadoMercancia!: Tramite220103State;

  /**
   * Configuración de la tabla de mercancías.
   */
  configuracionTabla = CONFIGURACION_MERCANCIAS;

  /**
   * Datos de la tabla de mercancías.
   */
  datosTabla: Mercancia[] = [];

  /**
   * Tipo de selección de la tabla (checkbox).
   */
  seleccionTabla: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Constructor del componente.
   * 
   * @param formBuilder - FormBuilder para inicializar los formularios.
   * @param tramite220103Store - Almacén para gestionar el estado del trámite.
   * @param tramite220103Query - Consulta para obtener el estado del trámite.
   * @param servicio - Servicio para interactuar con la API de mercancías.
   */
  constructor(
    formBuilder: FormBuilder,
    private tramite220103Store: Tramite220103Store,
    private tramite220103Query: Tramite220103Query,
    private servicio: SanidadAcuicolaImportacionService,
    private consultaQuery: ConsultaioQuery
  ) {
    this.formularioDatosTramite = formBuilder.group({});
    this.formularioDatosMercancia = formBuilder.group({});
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe al estado del trámite y actualiza los datos de la tabla.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estadoConsulta) => {
        this.esSoloLectura = estadoConsulta.readonly;
        this.habilitarDeshabilitarFormulario();
      });

    this.obtenerEstado();
    this.obtenerAduanaDeIngreso();
    this.obtenerMedioDeTransporte();
    this.obtenerOrigen();
    this.obtenerUmc();
    this.obtenerUso();
    this.obtenerPais();
  }

  /**
   * Habilita o deshabilita el formulario de datos del trámite según el modo de solo lectura.
   * 
   * Si la propiedad `esSoloLectura` es verdadera, deshabilita el formulario para evitar modificaciones.
   * En caso contrario, habilita el formulario para permitir la edición de los datos.
   */
  habilitarDeshabilitarFormulario(): void {
    if (this.esSoloLectura) {
      this.formularioDatosTramite.disable();
    } else {
      this.formularioDatosTramite.enable();
    }
  }

  /**
   * Obtiene el estado actual del trámite y actualiza los datos de la tabla.
   */
  obtenerEstado(): void {
    this.tramite220103Query.selectTramite220103State$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estado) => {
        this.estadoSeleccionado = estado;
        this.estadoSeleccionadoMercancia = estado['mercancia'] ?? {} as Tramite220103State;
        this.datosTabla = estado.tablaMercancia || [];
      });
  }

  /**
   * Obtiene la descripción de la fracción arancelaria y actualiza el formulario y el estado.
   */
  obtenerDescripcionFraccion(): void {
    if (this.formularioDatosMercancia.get('fraccionArancelaria')?.value === '30019099') {
      this.formularioDatosMercancia.patchValue({
        descripcionFraccion: 'Los demás',
        umt: 'kilogramo',
      });
      this.tramite220103Store.setTramite220103State('descripcionFraccion', 'Los demás');
      this.tramite220103Store.setTramite220103State('umt', 'kilogramo');
    }
  }

  /**
   * Establece un cambio de valor en el estado del trámite.
   * 
   * @param evento - Evento que contiene el campo y el valor a actualizar.
   * @param prop - Propiedad específica del estado a actualizar (opcional).
   */
  establecerCambioDeValor(evento: { campo: string; valor: unknown }, prop?: string): void {
    this.tramite220103Store.setTramite220103State(evento.campo, evento.valor, prop);
    if (evento.campo === 'fraccionArancelaria') {
      this.obtenerDescripcionFraccion();
    }
    if (evento.campo === 'uso') {
      const NUEVO_VALOR = this.formularioDatosMercancia.get('uso')?.value !== '';
      this.configuracionFormularioMercancia = this.configuracionFormularioMercancia.map(campo => {
        if (campo.campo === 'otroUso') {
          return { ...campo, mostrar: NUEVO_VALOR };
        }
        return campo;
      });
    }
  }

  /**
   * Obtiene las opciones de aduanas de ingreso desde el servicio.
   */
  obtenerAduanaDeIngreso(): void {
    this.servicio.getAdunaDeIngreso()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((opciones) => {
        this.configuracionFormularioDatos = this.configuracionFormularioDatos.map(aduana => {
          if (aduana.campo === 'aduanaDeIngreso') {
            return { ...aduana, opciones: [...opciones] };
          }
          return aduana;
        });
      });
  }

  /**
   * Obtiene las opciones de medios de transporte desde el servicio.
   */
  obtenerMedioDeTransporte(): void {
    this.servicio.getMedioDeTransporte()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((opciones) => {
        this.configuracionFormularioDatos = this.configuracionFormularioDatos.map(medioTransporte => {
          if (medioTransporte.campo === 'medioDeTransporte') {
            return { ...medioTransporte, opciones: [...opciones] };
          }
          return medioTransporte;
        });
      });
  }

  /**
   * Obtiene las opciones de origen desde el servicio.
   */
  obtenerOrigen(): void {
    this.servicio.getOrigen()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((opciones) => {
        this.configuracionFormularioMercancia = this.configuracionFormularioMercancia.map(origen => {
          if (origen.campo === 'origen') {
            return { ...origen, opciones: [...opciones] };
          }
          return origen;
        });
      });
  }


  /**
   * Obtiene las opciones de UMC desde el servicio.
   */
  obtenerUmc(): void {
    this.servicio.getUmc()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((opciones) => {
        this.configuracionFormularioMercancia = this.configuracionFormularioMercancia.map(umc => {
          if (umc.campo === 'umc') {
            return { ...umc, opciones: [...opciones] };
          }
          return umc;
        });
      });
  }

  /**
   * Obtiene las opciones de uso desde el servicio.
   */
  obtenerUso(): void {
    this.servicio.getUso()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((opciones) => {
        this.configuracionFormularioMercancia = this.configuracionFormularioMercancia.map(uso => {
          if (uso.campo === 'uso') {
            return { ...uso, opciones: [...opciones] };
          }
          return uso;
        });
      });
  }

  /**
   * Obtiene las opciones de países desde el servicio.
   */
  obtenerPais(): void {
    this.servicio.getPais()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((opciones) => {
        if (opciones) {
          this.configuracionFormularioMercancia = this.configuracionFormularioMercancia.map(item => {
            if (item.campo === 'paisOrigen' || item.campo === 'paisProcedencia') {
              return { ...item, opciones: [...opciones] };
            }
            return item;
          });
        }
      });
  }

  /**
   * Obtiene las mercancías seleccionadas en la tabla.
   * 
   * @param evento - Lista de mercancías seleccionadas.
   */
  obtenerMercanciasSeleccionadas(evento: Mercancia[]): void {
    this.mercanciasSeleccionadas = evento;
  }

  /**
   * Agrega una mercancía al estado del trámite.
   */
  agregarMercancia(): void {
    if (this.formularioDatosMercancia.valid) {
      const MERCANCIA: Mercancia = this.formularioDatosMercancia.value;
      if (this.esModificarMercancia) {
        MERCANCIA.id = this.mercanciasSeleccionadas[0].id;
        this.esModificarMercancia = false;
      } else {
        MERCANCIA.id = guid();
        this.postMercancia(MERCANCIA.id);
      }
      this.formularioDatosMercancia.reset();
      this.cerrarModal();
    } else if (this.formularioDatosMercancia.invalid) {
      this.formularioDatosMercancia.markAllAsTouched();
    }
  }

  /**
   * Cierra el modal de mercancías.
   */
  cerrarModal(): void {
    if (this.cerrarModalRef) {
      this.cerrarModalRef.nativeElement.click();
    }
  }

  /**
   * Obtiene las mercancías desde el servicio y actualiza el estado.
   * 
   * @param id - Identificador de la mercancía.
   */
  postMercancia(id: string): void {
    this.servicio.getMercancias()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((respuesta: Mercancia[]) => {
        if (respuesta) {
          respuesta[0].id = id;
          this.tramite220103Store.setTramite220103State('tablaMercancia', respuesta);
        }
      });
  }

  /**
   * Elimina una mercancía seleccionada del estado del trámite.
   */
  eliminarMercancia(): void {
    if (this.mercanciasSeleccionadas[0]?.id) {
      this.tramite220103Store.eliminarMercancia(this.mercanciasSeleccionadas[0].id);
    }
    this.mercanciasSeleccionadas = [];
  }

  /**
   * Modifica una mercancía seleccionada en el formulario.
   */
  modificarMercancia(): void {
    if (this.mercanciasSeleccionadas.length > 0) {
      this.esModificarMercancia = true;
      this.formularioDatosMercancia.patchValue(this.mercanciasSeleccionadas[0]);
    }
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}