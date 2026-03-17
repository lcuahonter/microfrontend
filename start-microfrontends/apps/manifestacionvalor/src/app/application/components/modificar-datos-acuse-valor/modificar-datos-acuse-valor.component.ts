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
  ConfiguracionColumna,
  InputRadioComponent, 
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
import { DatosGeneralesModel } from '@libs/shared/data-access-user/src/core/models/datos-generales.model';
import { tap } from 'rxjs';
import { RfcConsulta } from '../../shared/models/rfc-consulta.model';
import { RadioOpcion } from '../../shared/models/datos-acuse-valor.model';


@Component({
  selector: 'app-modificar-datos-acuse-valor',
  standalone: true,
  imports: [CommonModule, 
    TituloComponent,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    CommonModule,
    TooltipModule,
    NotificacionesComponent,
    TablaDinamicaComponent,
    InputRadioComponent
  ],
  templateUrl: './modificar-datos-acuse-valor.component.html',
  styleUrl: './modificar-datos-acuse-valor.component.css',
})
export class ModificarDatosAcuseValorComponent {

  /**
   * Formulario reactivo para capturar los datos qde acuse valor.
   * Incluye validaciones para campos obligatorios y opcionales.
   * @type {FormGroup}
   */
  formularioDatosAcuseValorCove!: FormGroup;

    /**
   * Formulario reactivo para capturar los datos qde pedimento.
   * Incluye validaciones para campos obligatorios y opcionales.
   * @type {FormGroup}
   */
  formularioPedimento!: FormGroup;

    /**
  * catalogo de METODO VALORACION COVE.
  */
  metodoValoracionList: Catalogo[] = [
    { id: 1, clave: 'A1', descripcion: 'Registro activo' },
    { id: 2, clave: 'B2', descripcion: 'Registro inactivo' },
    { id: 3, clave: 'C3', descripcion: 'Pendiente de validación' }

  ];

      /**
  * catalogo de INCOTERM.
  */
  incotermList: Catalogo[] = [
    { id: 1, clave: 'A1', descripcion: 'Registro activo' },
    { id: 2, clave: 'B2', descripcion: 'Registro inactivo' },
    { id: 3, clave: 'C3', descripcion: 'Pendiente de validación' }

  ];

        /**
  * catalogo de Aduana.
  */
  aduanaList: Catalogo[] = [
    { id: 1, clave: 'A1', descripcion: 'Registro activo' },
    { id: 2, clave: 'B2', descripcion: 'Registro inactivo' },
    { id: 3, clave: 'C3', descripcion: 'Pendiente de validación' }

  ];
    /**
   * Opciones disponibles para el campo de radio .
   */
  radioOptions: RadioOpcion[] = [
    { label: "Sí", value: "si" },
    { label: "No", value: "no" },
    
  ];

constructor(
  private readonly fb: FormBuilder,
) {
  this.formularioDatosAcuseValorCove = this.fb.group({
        acuseValor: [ {value: '', disabled: true}, Validators.required],      
        metodoValoracion: [ {value: ''}, Validators.required],
        incoterm: [ {value: ''}, Validators.required],
        existeVinculacion: [ {value: ''}, Validators.required]

      });
  
  this.formularioPedimento = this.fb.group({
        pedimento: [ {value: ''}, Validators.required],  
        patente: [ {value: ''}, Validators.required],      
        aduana: [ {value: ''}, Validators.required]       

      }); 
}

 radioChange(): void {
    const selectedValue = this.formularioDatosAcuseValorCove.get('existeVinculacion')?.value;
    }
  
}
