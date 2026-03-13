import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsignarBloquePaisComponent } from '../components/asignar-bloque-pais/asignar-bloque-pais.component';
import { BloquePais } from '../service/model/response/bloque-pais.model';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ErrorMessagesComponent } from '@ng-mf/data-access-user';
import { NormaSGP } from '../service/model/response/norma-sgp.model';
import { NormasSgpService } from '../service/normas-sgp.service';
import { RegistroModificacionNormasSgpComponent } from '../components/registro-modificacion-normas-sgp/registro-modificacion-normas-sgp.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    AsignarBloquePaisComponent, 
    RegistroModificacionNormasSgpComponent,
    ErrorMessagesComponent
  ],
  templateUrl: './inicio.component.html'
})
export class NormasSgpComponent {
  form: FormGroup;
  mostrarAsignar = false;
  mostrarRegistro = false;
  
  datosNorma: NormaSGP | null = null;
  errors: string[] = [];
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private normasSgpService: NormasSgpService
  ) {
    this.form = this.fb.group({
      bloquePais: [{ value: '', disabled: false }]
    });
  }

  /*
  * Abre el modal de asignar bloque/país
  */
  onAsignar(): void {
    this.mostrarAsignar = true;
  }

  /*
  * Cierra el modal de asignar bloque/país y actualiza el formulario
  */
  onAceptarAsignar(seleccion: BloquePais): void {
    this.form.patchValue({ bloquePais: seleccion.nombre });
    this.mostrarAsignar = false;
    this.errors = [];
  }

  /*
  * Cierra el modal de asignar bloque/país
  */
  onCerrarAsignar(): void {
    this.mostrarAsignar = false;
  }

  /*
  * Consulta si existe una norma SGP para el bloque/país seleccionado y abre el modal de registro o modificación
  */
  onRegistrar(): void {
    const BLOQUE_PAIS = this.form.get('bloquePais')?.value;
    if (!BLOQUE_PAIS) {
      return;
    }

    this.errors = [];
    this.normasSgpService.consultarNorma(BLOQUE_PAIS).subscribe(res => {
      if (res.existe) {
        this.errors = [`La Norma SGP ya existe, consulte para modificarla.`];
      } else {
        this.datosNorma = null;
        this.mostrarRegistro = true;
      }
    });
  }

  /*
  * Consulta si existe una norma SGP para el bloque/país seleccionado y abre el modal de modificación
  */
  onConsultar(): void {
    const BLOQUE_PAIS = this.form.get('bloquePais')?.value;
    if (!BLOQUE_PAIS) {
      return;
    }

    this.errors = [];
    this.normasSgpService.consultarNorma(BLOQUE_PAIS).subscribe(res => {
      if (res.existe && res.datos) {
        this.datosNorma = res.datos;
        this.mostrarRegistro = true;
      } else {
        this.errors = ['La Norma SGP no existe.'];
      }
    });
  }

  /*
  * Guarda la norma SGP
  */
  onGuardarNorma(norma: NormaSGP): void {
    this.normasSgpService.guardarNorma(norma).subscribe(() => {
      this.successMessage = 'La norma se ha guardado correctamente.';
      this.mostrarRegistro = false;
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    });
  }

  /*
  * Cierra el modal de registro
  */
  onCerrarRegistro(): void {
    this.mostrarRegistro = false;
  }

  /*
  * Limpia el formulario
  */
  onLimpiar(): void {
    this.form.reset();
    this.errors = [];
    this.successMessage = '';
  }
}