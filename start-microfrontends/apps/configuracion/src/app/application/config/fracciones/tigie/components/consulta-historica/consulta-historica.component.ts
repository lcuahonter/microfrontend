import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConsultaHistoricaService } from '../../service/consulta-historica.service';
import { HistoricoItem } from '../../service/model/consulta-historica.model';
import { Router } from '@angular/router';
import { TituloComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-consulta-historica',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    TituloComponent
  ],
  templateUrl: './consulta-historica.component.html'
})
export class ConsultaHistoricaComponent implements OnInit {
  form!: FormGroup;
  agregadas: HistoricoItem[] = [];
  disgregadas: HistoricoItem[] = [];
  searched = false;
  showInvalidError = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ConsultaHistoricaService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      tipoOperacion: ['importacion', Validators.required],
      fraccionArancelaria: ['', [Validators.required, Validators.minLength(8)]]
    });

    // Reset error when user types
    this.form.get('fraccionArancelaria')?.valueChanges.subscribe(() => {
      this.showInvalidError = false;
    });
  }

  onBuscar(): void {
    const INPUT = this.form.get('fraccionArancelaria');
    
    if (!INPUT?.value || INPUT.invalid) {
      this.showInvalidError = true;
      this.searched = false;
      this.agregadas = [];
      this.disgregadas = [];
      return;
    }

    this.showInvalidError = false;
    this.service.getHistorico(this.form.value).subscribe({
      next: (res) => {
        this.agregadas = res.agregadas;
        this.disgregadas = res.disgregadas;
        this.searched = true;
      },
      error: () => {
        this.searched = false;
      }
    });
  }

  onAceptar(): void {
    // Implementar la lógica de aceptar
  }

  onSalir(): void {
    this.router.navigate(['/configuracion', 'fracciones']);
  }
}
