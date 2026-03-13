
/**
 * @fileoverview
 * Este archivo contiene las constantes utilizadas en la sección de complementos
 * de la aplicación.
 * @module complementos-seccion.enum
 */ 
import { CommonModule } from '@angular/common';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';

import {
  FORMA_COMPLIMENTOS_PROGRAMA,
  FORMA_COMPLIMENTOS_SOLICITUDE,
  FORMA_DATOS_GENERALES,
  FORMA_MODIFICACIONES_SOLICITUDE,
  FORMA_NACIONALIDAA_MAXICANA,
  FORMA_PERSONA_FISICA_FORM_DATA,
  FORMA_SI_NACIONALIDAA_MAXICANA,
  MANIFIESTOS_DECLARACION,
  OBLIGACIONES_FISCALES,
  TABLA_SOCIO_ACCIONISTAS,
  TABLA_SOCIO_ACCIONISTAS_EXTRANJEROS,
} from '../../constantes/complementos-seccion.enum';
import {
  ModeloDeFormaDinamica,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { ComplementosSeccionService } from '../../services/complementos-seccion.service';

import { Subject, map, takeUntil } from 'rxjs';

import {
  NacionalidadMaxicana,
  SociaoAccionistas,
} from '../../models/complimentos-seccion.model';

import { ComplementosSeccionStore } from '../../../estados/tramites/complementos-seccion.store';

import { ComplementosSeccionQuery } from '../../../estados/queries/complementos-seccion.query';


import { ComplementosSeccionState } from '../../../estados/tramites/complementos-seccion.store';
import { InputRadioComponent } from '@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component';

/*
  * Este componente se encarga de gestionar la sección de complementos en la aplicación.
  * Permite la interacción con los datos de los accionistas y la configuración de formularios dinámicos.
  */
@Component({
  selector: 'app-complementos-seccion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormasDinamicasComponent,
    TituloComponent,
    InputRadioComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './complementos-seccion.component.html',
  styleUrls: ['./complementos-seccion.component.scss'],
})
/*

  * @class ComplementosSeccionComponent
  * @description Componente para gestionar la sección de complementos en la aplicación.
  * @implements {OnInit, OnDestroy}
  */
export class ComplementosSeccionComponent implements OnDestroy, OnInit {
  constructor(
    private complementosSeccionService: ComplementosSeccionService,
    private fb: FormBuilder,
    private complementosSeccionStore: ComplementosSeccionStore,
    private complementosSeccionQuery: ComplementosSeccionQuery
  ) {}
/**
 * compodoc
 * 
 * @property importacionstate
 * Estado de importación que contiene los datos de la sección de complementos.
 * @type {ComplementosSeccionState}
 */
public importacionstate!: ComplementosSeccionState;

/**
 * compodoc
 * 
 * @property destroy$
 * Subject utilizado para manejar la destrucción de suscripciones en el componente.
 * @type {Subject<void>}
 */
private destroy$ = new Subject<void>();

/**
 * compodoc
 * 
 * @property accionistasRadio
 * Lista de opciones para los radios de nacionalidad mexicana.
 * @type {NacionalidadMaxicana[]}
 */
accionistasRadio: NacionalidadMaxicana[] = [];

/**
 * @property tipoPersonaRadio
 * Lista de opciones para los radios de tipo de persona.
 * @type {NacionalidadMaxicana[]}
 */
tipoPersonaRadio: NacionalidadMaxicana[] = [];

/**
 * compodoc
 * 
 * @property manifiestosText
 * Texto del manifiesto que debe aceptar el usuario.
 * @type {string}
 */
manifiestosText = MANIFIESTOS_DECLARACION.MANIFIESTOS;

/**
 * compodoc
 * 
 * @property tablaSeleccion
 * Configuración para la tabla de selección.
 * @type {TablaSeleccion}
 */
tablaSeleccion = TablaSeleccion;

/**
 * compodoc
 * 
 * @property tablaSociaAccionistasExtranjeros
 * Configuración para la tabla de socios y accionistas extranjeros.
 * @type {any}
 */
tablaSociaAccionistasExtranjeros = TABLA_SOCIO_ACCIONISTAS_EXTRANJEROS;

/**
 * compodoc
 * 
 * @property tablaSociaAccionistas
 * Configuración para la tabla de socios y accionistas nacionales.
 * @type {any}
 */
tablaSociaAccionistas = TABLA_SOCIO_ACCIONISTAS;

/**
 * compodoc
 * 
 * @property accionistasExtranjerosSeleccionados
 * Lista de accionistas extranjeros seleccionados.
 * @type {SociaoAccionistas[]}
 */
accionistasExtranjerosSeleccionados: SociaoAccionistas[] = [];

/**
 * 
 * @property empresaAccionistasSeleccionados
 * Lista de accionistas nacionales seleccionados.
 * @type {SociaoAccionistas[]}
 */
empresaAccionistasSeleccionados: SociaoAccionistas[] = [];

/**
 * 
 * @property datosSocioAccionistas
 * Lista de datos de socios y accionistas nacionales.
 * @type {SociaoAccionistas[]}
 * @Input
 */
@Input() datosSocioAccionistas: SociaoAccionistas[] = [];

/**
 * compodoc
 * 
 * @property datosSocioAccionistasExtrenjeros
 * Lista de datos de socios y accionistas extranjeros.
 * @type {SociaoAccionistas[]}
 * @Input
 */
@Input() datosSocioAccionistasExtrenjeros: SociaoAccionistas[] = [];

/**
 * compodoc
 * 
 * @property formaComplimentossolicitude
 * Formulario para los datos de la solicitud.
 * @type {FormGroup}
 */
formaComplimentossolicitude: FormGroup = new FormGroup({});

/**
 * v
 * @property formaComplimentosPrograma
 * Formulario para los datos del programa.
 * @type {FormGroup}
 */
formaComplimentosPrograma: FormGroup = new FormGroup({});

/**
 * compodoc
 * 
 * @property DatosGenerales
 * Formulario para los datos generales.
 * @type {FormGroup}
 */
DatosGenerales: FormGroup = new FormGroup({});

/**
 * compodoc
 * 
 * @property ObligacionesFiscales
 * Formulario para las obligaciones fiscales.
 * @type {FormGroup}
 */
ObligacionesFiscales: FormGroup = new FormGroup({});

/**
 * compodoc
 * 
 * @property formaModificaciones
 * Formulario para las modificaciones de la sociedad.
 * @type {FormGroup}
 */
formaModificaciones: FormGroup = new FormGroup({});

/**
 * compodoc
 * 
 * @property formaAccionistas
 * Formulario para los datos de los accionistas.
 * @type {FormGroup}
 */
formaAccionistas: FormGroup = new FormGroup({});

/**
 * compodoc
 * 
 * @property formaNacionalidadMaxicana
 * Formulario para los datos de nacionalidad mexicana.
 * @type {FormGroup}
 */
formaNacionalidadMaxicana: FormGroup = new FormGroup({});

/**
 * compodoc
 * 
 * @property formaComplimentossolicitudeFormData
 * Configuración de los datos del formulario de solicitud.
 * @type {any}
 */
public formaComplimentossolicitudeFormData = FORMA_COMPLIMENTOS_SOLICITUDE;

/**
 * 
 * @property formaComplimentosProgramaFormData
 * Configuración de los datos del formulario del programa.
 * @type {any}
 */
public formaComplimentosProgramaFormData = FORMA_COMPLIMENTOS_PROGRAMA;

/**
 * 
 * @property DatosGeneralesFormData
 * Configuración de los datos del formulario de datos generales.
 * @type {any}
 */
public DatosGeneralesFormData = FORMA_DATOS_GENERALES;

/**
 * compodoc
 * 
 * @property ObligacionesFiscalesFormData
 * Configuración de los datos del formulario de obligaciones fiscales.
 * @type {any}
 */
public ObligacionesFiscalesFormData = OBLIGACIONES_FISCALES;

/**
 * compodoc
 * 
 * @property formaModificacionesFormData
 * Configuración de los datos del formulario de modificaciones.
 * @type {any}
 */
public formaModificacionesFormData = FORMA_MODIFICACIONES_SOLICITUDE;

/**
 * compodoc
 * 
 * @property formaNacionalidadMaxicanaFormData
 * Configuración de los datos del formulario de nacionalidad mexicana.
 * @type {any}
 */
public formaNacionalidadMaxicanaFormData = FORMA_NACIONALIDAA_MAXICANA;

/**
 * compodoc
 * 
 * @property formaNacionalidadMaxicanaSiFormData
 * Configuración de los datos del formulario de nacionalidad mexicana (opción "Sí").
 * @type {any}
 */
public formaNacionalidadMaxicanaSiFormData = FORMA_SI_NACIONALIDAA_MAXICANA;

/**
 * compodoc
 * 
 * @property formaPersonaFisicaFormData
 * Configuración de los datos del formulario de persona física.
 * @type {any}
 */
public formaPersonaFisicaFormData = FORMA_PERSONA_FISICA_FORM_DATA;
  /**
 * compodoc
   * 
 * @property activeTab
 * Almacena la pestaña activa basada en la selección de nacionalidad y tipo de persona.
 * @type {string}
 */
activeTab: string = '';

/**
 * compodoc
 * 
 * @property forma
 * Formulario principal que contiene un grupo de formularios dinámicos.
 * @type {FormGroup}
 */
public forma: FormGroup = new FormGroup({
  ninoFormGroup: new FormGroup({}), // Subgrupo de formularios
});

/**
 * compodoc
 * 
 * @method ninoFormGroup
 * Obtiene el subgrupo de formularios `ninoFormGroup` del formulario principal.
 * @returns {FormGroup} El subgrupo de formularios.
 */
get ninoFormGroup(): FormGroup {
  return this.forma.get('ninoFormGroup') as FormGroup;
}

/**
 * 
 * @method ngOnInit
 * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
 * Configura los formularios, suscripciones y obtiene datos iniciales.
 */
ngOnInit(): void {
  // Suscripción al estado de exportación de ilustraciones
  this.complementosSeccionQuery.selectExportarIlustraciones$
    .pipe(
      takeUntil(this.destroy$),
      map((seccionState) => {
        this.importacionstate = seccionState;
      })
    )
    .subscribe();

  // Configuración inicial del formulario de accionistas
  this.formaAccionistas = this.fb.group({
    nacionalidadMexicana: ['No'], // Valor predeterminado: "No"
    tipoDePersona: ['Persona Moral'], // Valor predeterminado: "Persona Moral"
    certificada: [{ value: 'No', disabled: true }], // Campo deshabilitado
    fechaInicio: [{ value: '', disabled: true }], // Campo deshabilitado
    fechaVigencia: [{ value: '', disabled: true }], // Campo deshabilitado
  });

  // Inicialización de datos y eventos
  this.cambiarPestanaActiva();
  this.getRadioJsonTipoPersona();
  this.getRadioJsonNacionalidad();
  this.obtenerEstado();
  this.obtenerPaise();
  this.obtenerNacionalEstado();
}

/**
 * compodoc
 * 
 * @method establecerCambioDeValor
 * Establece un valor dinámico en el store basado en el evento recibido.
 * @param {object} event - Evento que contiene el campo y el valor a actualizar.
 */
establecerCambioDeValor(event: { campo: string; valor?: object }): void {
  if (
    event &&
    typeof event.valor === 'object' &&
    event.valor !== null &&
    'id' in event.valor
  ) {
    const VALOR = event.valor.id;
    this.complementosSeccionStore.setDynamicFieldValue(event.campo, VALOR);
  } else if (event) {
    this.complementosSeccionStore.setDynamicFieldValue(
      event.campo,
      event.valor
    );
  }
}

/**
 * compodoc
 * 
 * @method agregarAccionistaExtranjeros
 * Agrega un accionista extranjero a la lista si el formulario es válido.
 */
agregarAccionistaExtranjeros(): void {
  if (this.formaAccionistas.valid) {
    this.datosSocioAccionistasExtrenjeros.push(this.formaAccionistas.value);
    this.formaAccionistas.reset(); // Reinicia el formulario
  }
}

/**
 * compodoc
 * 
 * @method getRadioJsonNacionalidad
 * Obtiene los datos de nacionalidad mexicana desde el servicio y los asigna a `accionistasRadio`.
 */
getRadioJsonNacionalidad(): void {
  this.complementosSeccionService
    .getNacionalidadMaxicanaData()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: NacionalidadMaxicana[]) => {
      this.accionistasRadio = data;
    });
}

/**
 * compodoc
 * 
 * @method getRadioJsonTipoPersona
 * Obtiene los datos de tipo de persona desde el servicio y los asigna a `tipoPersonaRadio`.
 */
getRadioJsonTipoPersona(): void {
  this.complementosSeccionService
    .getTipoPersonaData()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: NacionalidadMaxicana[]) => {
      this.tipoPersonaRadio = data;
    });
}

/**
 * compodoc
 * 
 * @method obtenerEstado
 * Obtiene los datos de estados desde el servicio y los asigna al formulario de modificaciones.
 */
public obtenerEstado(): void {
  this.complementosSeccionService
    .getEstado()
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp) => {
      if (resp.code === 200) {
        const RESPONSE = resp.data;
        const CLASIFICACION_FIELD = this.formaModificacionesFormData.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'estados'
        ) as ModeloDeFormaDinamica;
        if (CLASIFICACION_FIELD && !CLASIFICACION_FIELD.opciones) {
          CLASIFICACION_FIELD.opciones = RESPONSE.map(
            (item: { id: number; descripcion: string }) => ({
              descripcion: item.descripcion,
              id: item.id,
            })
          );
        }
      }
    });
}

/**
 * compodoc
 * 
 * @method obtenerPaise
 * Obtiene los datos de países desde el servicio y los asigna al formulario de nacionalidad mexicana.
 */
public obtenerPaise(): void {
  this.complementosSeccionService
    .getPaiseData()
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp) => {
      if (resp.code === 200) {
        const RESPONSE = resp.data;
        const CLASIFICACION_FIELD =
          this.formaNacionalidadMaxicanaFormData.find(
            (datos: ModeloDeFormaDinamica) => datos.campo === 'pais'
          ) as ModeloDeFormaDinamica;
        if (CLASIFICACION_FIELD && !CLASIFICACION_FIELD.opciones) {
          CLASIFICACION_FIELD.opciones = RESPONSE.map(
            (item: { id: number; descripcion: string }) => ({
              descripcion: item.descripcion,
              id: item.id,
            })
          );
        }
      }
    });
}

/**
 * compodoc
 * 
 * @method obtenerNacionalEstado
 * Obtiene los datos de estados desde el servicio y los asigna al formulario de nacionalidad mexicana.
 */
public obtenerNacionalEstado(): void {
  this.complementosSeccionService
    .getEstado()
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp) => {
      if (resp.code === 200) {
        const RESPONSE = resp.data;
        const CLASIFICACION_FIELD =
          this.formaNacionalidadMaxicanaFormData.find(
            (datos: ModeloDeFormaDinamica) => datos.campo === 'estado'
          ) as ModeloDeFormaDinamica;
        if (CLASIFICACION_FIELD && !CLASIFICACION_FIELD.opciones) {
          CLASIFICACION_FIELD.opciones = RESPONSE.map(
            (item: { id: number; descripcion: string }) => ({
              descripcion: item.descripcion,
              id: item.id,
            })
          );
        }
      }
    });
}

/**
 * compodoc
 * 
 * @method eliminarAccionistasExtrenjeros
 * Elimina los accionistas extranjeros seleccionados de la lista.
 */
eliminarAccionistasExtrenjeros(): void {
  if (this.accionistasExtranjerosSeleccionados.length) {
    this.datosSocioAccionistasExtrenjeros =
      this.datosSocioAccionistasExtrenjeros.filter(
        (item) => !this.accionistasExtranjerosSeleccionados.includes(item)
      );
    this.accionistasExtranjerosSeleccionados = []; // Limpia la selección
  }
}

/**
 * compodoc
 * @method cambiarPestanaActiva
 * Cambia la pestaña activa basada en la selección de nacionalidad y tipo de persona.
 */
cambiarPestanaActiva(): void {
  const NACIONALIDAD = this.formaAccionistas.get(
    'nacionalidadMexicana'
  )?.value;
  const TIPO_PERSONA = this.formaAccionistas.get('tipoDePersona')?.value;

  if (NACIONALIDAD === 'Si' && TIPO_PERSONA === 'Persona fisica') {
    this.activeTab = 'Si - Persona fisica';
  } else if (NACIONALIDAD === 'Si' && TIPO_PERSONA === 'Persona Moral') {
    this.activeTab = 'Si - Persona moral';
  } else if (NACIONALIDAD === 'No' && TIPO_PERSONA === 'Persona fisica') {
    this.activeTab = 'No - Persona fisica';
  } else if (NACIONALIDAD === 'No' && TIPO_PERSONA === 'Persona Moral') {
    this.activeTab = 'No - Persona moral';
  } else {
    this.activeTab = 'default';
  }
}

/**
 * @method ngOnDestroy
 * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
 * Limpia las suscripciones activas.
 */
ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
}
