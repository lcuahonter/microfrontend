import { Component, EventEmitter, Input, Output, ViewChild, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';


@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``
})
export class PasoUnoComponent implements OnInit {
  indice: number = 1;

  /**
   * Nombre que debe llevar la tab solicitud
   */
  nombreTabSolicitud: string = 'Datos de la solicitud';

  /**
   * Es solicitud editable o de solo lectura
   */
  @Input() editable: boolean = true;
  
  /**
   * Emite un evento cuando el formulario hijo es válido o no.
   * 
   * @type {EventEmitter<boolean>}
   */

  @Output() validFrmPadreEsValido = new EventEmitter<boolean>();

  @ViewChild(SolicitudComponent) SolicitudHijoComponent!: SolicitudComponent;

  rutaActual: string = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private elementRef: ElementRef
  ) {
    // Lee la ruta completa donde se monta el componente
    this.rutaActual = this.router.url;
    if(this.rutaActual.includes('evaluar')) {
      this.nombreTabSolicitud = 'Datos generales original';
    }
  }

  ngOnInit(): void {
    
    // Escuchar el evento personalizado de recarga
    this.elementRef.nativeElement.addEventListener('recargarFormulario', (event: CustomEvent) => {
      this.forzarRecargaFormulario();
    });
  }

  /**
   * Selecciona una pestaña específica y actualiza el índice actual.
   *
   * @param {number} i - El índice de la pestaña a seleccionar.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    
    // Si se selecciona la pestaña "Datos de la solicitud" (índice 2), forzar recarga
    if (i === 2) {
      setTimeout(() => {
        this.forzarRecargaFormulario();
      }, 100);
    }
  }

  /**
   * Maneja el evento que indica si el formulario hijo es válido o no.
   * 
   * @param isValid - Valor booleano que indica si el formulario hijo es válido.
   */
  onFormularioHijoValido(isValid: boolean): void {
    this.validFrmPadreEsValido.emit(isValid);
  }
  /**
   * Método para validar el formulario del componente hijo.
   * 
   * @returns {boolean} - Retorna true si el formulario es válido, false en caso contrario.
   */
  validarFormularioPadre(): boolean {
    return this.SolicitudHijoComponent.validarFormulario();
  }

  /**
   * Método público para repoblar el formulario cuando se regresa al paso 1
   */
  public repoblarFormularioAlRegresarAPaso1(): void {    
    if (this.SolicitudHijoComponent) {
      this.SolicitudHijoComponent.repoblarFormularioAlRegresarAPaso1();
    }
  }

  /**
   * Fuerza la recarga del formulario desde el store
   */
  private forzarRecargaFormulario(): void {
    
    // Usar setTimeout para asegurar que el ViewChild esté disponible
    setTimeout(() => {
      if (this.SolicitudHijoComponent) {
        this.SolicitudHijoComponent.forzarRecargaDesdeStore();
      } else {
        // Reintentar después de un breve delay
        setTimeout(() => {
          if (this.SolicitudHijoComponent) {
            this.SolicitudHijoComponent.forzarRecargaDesdeStore();
          }
        }, 200);
      }
    }, 50);
  }

}
