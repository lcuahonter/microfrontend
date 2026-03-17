import { Catalogo, CatalogoSelectComponent, CatalogoTipoDocumento, RespuestaDocuemntosRequeridos } from '@ng-mf/data-access-user';
import { Component, OnInit } from '@angular/core';
import { DocumentosStates, SolicitudDocumentosState } from '../../../estados/evaluacion-solicitud/documentos.store';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import data from '@libs/shared/theme/assets/json/funcionario/cat-tipo-documento.json';
import dataDocuemtos from '@libs/shared/theme/assets/json/funcionario/lista-documentos-requeridos.json'
import { SolicitudDocumentosQuery } from '../../../estados/queries/documentos.query';


@Component({
  selector: 'app-solicitar-documentos',
  standalone: true,
  imports: [CommonModule, FormsModule, CatalogoSelectComponent, ReactiveFormsModule],
  templateUrl: './solicitar-documentos-evaluacion.component.html',
  styleUrl: './solicitar-documentos-evaluacion.component.scss',
})
export class SolicitarDocumentosEvaluacionComponent implements OnInit {
  /**
  * Declaración de variable para el formulario
  */
  formSolicitudDocumentos!: FormGroup;
  /**
   * Catálogo documento requerido
   */
  catTipoDocumento!: Catalogo[];
  /**
   * Lista documentos requeridos
   */
  exampleDocumentosRequeridos!: RespuestaDocuemntosRequeridos[];
  /**
   * Lista de documentos agregados a la tabla
   */
  documentosSeleccionados: CatalogoTipoDocumento[] = [];
  /**
   * Documento seleccionado para agregar a requerimiento
   */
  documentoSeleccionado: CatalogoTipoDocumento | null = null;
  /**
 * Variable para identificar el Id del tipo de documento
 */
  tipoDocumentoId!: number;
  /**
 * Variable para enviar el nombre del campo 
 */
  valor!: string;
  /**
   * Notificador para destruir las suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
     * Estado de la documentación.
     */
  public solicitudDocumentosState!: SolicitudDocumentosState;
  /**
   * Selecciona el tipo de documento que obtiene del catálogo documentos
   */
  selectedOption: Catalogo | undefined;
  /**
   * Obtiene el nombre de la opcion seleccionada del documento
   */
  description: string | undefined;

  constructor(private fb: FormBuilder,
    private documentosStates: DocumentosStates,
    private solicitudRequerimientoQuery: SolicitudDocumentosQuery
  ) {
    // do nothing.
  }
  /**
     * Método que se ejecuta al inicializar el componente.
     */
  ngOnInit(): void {
    this.catTipoDocumento = data;
    this.exampleDocumentosRequeridos = dataDocuemtos;
    this.solicitudRequerimientoQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudDocumentosState = seccionState;
        })
      )
      .subscribe();
    this.crearFormDocumentos();
  }
  /**
     * Método para crear el formulario para la solicitud de documentos
     */
  crearFormDocumentos(): void {
    this.formSolicitudDocumentos = this.fb.group({
      tipoDocumento: ['', [Validators.required]],
    });
    this.documentosSeleccionados = this.solicitudDocumentosState.documentosSeleccionados;
  }
  /**
   * Metodo para agregar documento seleccionado a la tabla 
   */
  agregarDocumento() {

    const DEPENDENCIA_ID = this.formSolicitudDocumentos.get('tipoDocumento')?.value;
    const NUEVO_TIPO_DOCUMENTO: CatalogoTipoDocumento = {
      id: DEPENDENCIA_ID,
      description: this.formSolicitudDocumentos.get('tipoDocumento')?.value,
    }
    if (this.documentosSeleccionados.length === 0) {
      this.documentosSeleccionados = [];
    }
    this.documentosSeleccionados.push(NUEVO_TIPO_DOCUMENTO);
    this.documentosStates.setSolicitudDocumentos(this.documentosSeleccionados);
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.formSolicitudDocumentos.reset({
      tipoDocumento: ''
    });
  }
  /**
   * Método para eliminar el documento de la tabla 
   */
  eliminarDocumento(index: number) {
    this.documentosSeleccionados.splice(index, 1);
  }
  /**
     * Establece los valores en el store de tramite5701.
     *
     * @param {FormGroup} form - El formulario del cual se obtiene el valor.
     * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
     * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
     * @returns {void}
     */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof DocumentosStates): void {
    this.valor = form.get(campo)?.value;
    (this.documentosStates[metodoNombre] as (value: string) => void)(this.valor);
  }
}
