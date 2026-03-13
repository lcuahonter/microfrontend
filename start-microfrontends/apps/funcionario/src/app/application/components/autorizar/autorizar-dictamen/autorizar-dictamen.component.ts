import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { EncabezadoRequerimientoComponent } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';

@Component({
  selector: 'app-autorizar-dictamen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EncabezadoRequerimientoComponent],
  templateUrl: './autorizar-dictamen.component.html',
  styleUrl: './autorizar-dictamen.component.scss',
})
export class AutorizarDictamenComponent implements OnInit{   
  /**
   * @description Variable que almacena el formulario de dictamen
   */
  public dictamenForm: FormGroup; 

  /**
   * @description Constructor del componente AutorizarDictamenComponent
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param router - Router para navegar entre rutas.
   */
  constructor(private fb: FormBuilder, private router: Router) {
    this.dictamenForm = this.fb.group({
      cumplimiento: ['1'], 
      mensajeDictamen: [{ value: '', disabled: true }]      
    });    
  }
  /**
   * @description Metodo que se ejecuta al inicializar el componente
   */
  ngOnInit(): void {
    this.dictamenForm.get('mensajeDictamen')?.enable();
    this.dictamenForm.get('mensajeDictamen')?.setValue(AutorizarDictamenComponent.obtenerNombreDelTítulo(1));
    this.dictamenForm.get('mensajeDictamen')?.disable();    
  }
  /**
   * @description Metodo que redirige a la pantalla de firma electronica
   */
  navegarAFirmaElectronica(): void {  
    this.router.navigate(['funcionario/firma-electronica']);    
  }
  /**
   * @description Metodo que redirige a la pantalla de rechazo de dictamen
   */
  static obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?';
      case 2:
        return 'Sin justificacion';  
      default:
        return 'mensaje no encontrado';
    }
  }
  /**
   * @description Metodo que redirige a la pantalla de Observaciones
   */
  navegarAObservaciones(): void {  
    this.router.navigate(['funcionario/observaciones-dictamen']);    
  } 
}