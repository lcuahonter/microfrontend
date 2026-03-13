import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map, Subject, takeUntil } from 'rxjs';
import { TramitesStates, TramiteState } from '../../estados/tramite/tramite.store';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SolicitudTramiteQuery } from '../../estados/queries/tramite.query';

@Component({
  selector: 'app-consulta-tramite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consulta-tramite.component.html',
  styleUrl: './consulta-tramite.component.scss',
})
export class ConsultaTramiteComponent implements OnInit {
  /** Formulario de búsqueda */
  public FormBuscaTramite!: FormGroup;
  /**
     * Estado de la solicitud.
     */
  public solicitudTramiteState!: TramiteState;
  /**
    * Notificador para destruir las suscripciones.
    */
  private destroyNotifier$: Subject<void> = new Subject();
  constructor(private router: Router,
    private fb: FormBuilder,
    private tramiteStates: TramitesStates,
    private solicitudtramiteQuery: SolicitudTramiteQuery,
  ) {
    // Constructor vacío, se puede agregar lógica adicional si es necesario.  
  }
  /** Método para inicializar el formulario */
  ngOnInit():void {
    this.solicitudtramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudTramiteState = seccionState;
        })
      )
      .subscribe();

    this.inicializaFormConsulta();
  }
  /** Método para inicializar el formulario de búsqueda */
  inicializaFormConsulta():void {
    this.FormBuscaTramite = this.fb.group({
      idTramite: [''],
    });
  }
  /** Método para buscar el trámite */
  buscarTramite():void {
    this.router.navigate(['funcionario/datos-generales-tramite']);
  }

  tramiteSeleccionado(form: FormGroup, campo: string, metodoNombre: keyof TramitesStates): void {
    this.setValoresStore(form, campo, metodoNombre);
  }
  /**
     * Establece los valores en el store de tramite5701.
     *
     * @param {FormGroup} form - El formulario del cual se obtiene el valor.
     * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
     * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
     * @returns {void}
     */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof TramitesStates): void {
    const VALOR = form.get(campo)?.value;
    (this.tramiteStates[metodoNombre] as (value: string) => void)(VALOR);
  }
}
