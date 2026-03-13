import { 
  Catalogo, 
  CatalogoSelectComponent, 
  ConsultaioState, 
  Notificacion, 
  SolicitanteService, 
  TituloComponent, 
  NotificacionesComponent, 
  CategoriaMensaje, 
  REGEX_RFC, 
  TablaDinamicaComponent,
  TablaSeleccion, 
  ConfiguracionColumna 
} from '@libs/shared/data-access-user/src';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@Component({
  selector: 'valor-aduana',
  standalone: true,
  imports: [CommonModule, 
    TituloComponent, 
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    CommonModule,
    TooltipModule,
    NotificacionesComponent,
    TablaDinamicaComponent],
  templateUrl: './valor-aduana.component.html',
  styleUrl: './valor-aduana.component.scss',
})
export class ValorAduanaComponent {

    /**
   * Formulario reactivo para capturar los datos de la pantalla.
   * Incluye validaciones para campos obligatorios y opcionales.
   * @type {FormGroup}
   */
  formularioValorAduana!: FormGroup;

  
     /**
   * Constructor del componente valor-aduana.
   * Inicializa los servicios necesarios y establece la suscripción al estado del formulario.
   *
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos de Angular
   * @param {ImportacionDeAcuiculturaService} importacionDeAcuiculturaServices - Servicio para obtener datos de catálogos y actualizar el store
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado de solo lectura del formulario
   * @param catalogosService
   * @param consultaSolicitudService
   */
constructor(
    private solicitanteServicio: SolicitanteService,
    private readonly fb: FormBuilder,
  ) {
    this.formularioValorAduana = this.fb.group({
      importePagado: [0, Validators.required],      
      importePorPagar: [0, Validators.required],
      importeIncrementales: ['', Validators.required],
      importeDecrementales: ['', Validators.required],
      totalValorAduana: ['', Validators.required],

    }); 

    
  }


    /**
   * Establece los valores del formulario en el servicio de almacenamiento correspondiente.
   * Actualiza el estado global con los datos actuales del formulario de movilización.
   * 
   * @public
   * @method setValoresStore
   * @memberof DatosParaMovilizacionComponent
   * @returns {void}
   */
  setValoresStore(): void {
    // const VALOR = this.formularioMovilizacion.value;
    // (this.importacionDeAcuiculturaServices.actualizarFormularioMovilizacion as (value: FormularioMovilizacion) => void)(
    //   VALOR
    // );
  }
}
