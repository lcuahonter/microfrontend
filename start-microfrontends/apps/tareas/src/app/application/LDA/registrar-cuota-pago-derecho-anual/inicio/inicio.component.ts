import { Component, OnInit } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent, TablePaginationComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PagoDerecho } from '../model/pago-derecho.model';
import { PagoDerechoService } from '../service/pago-derecho.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, TablaDinamicaComponent, TablePaginationComponent],
  templateUrl: './inicio.component.html'
})
export class InicioRegistroCuotaPagoDerechoAnualComponent implements OnInit {
  form: FormGroup;
  anios: number[] = [];
  pagos: PagoDerecho[] = [];
  configuracionTabla: ConfiguracionColumna<PagoDerecho>[] = [];
  showAlert = false;
  anioAlert!: string;

  constructor(
    private fb: FormBuilder,
    private pagoDerechoService: PagoDerechoService
  ) {
    const CURRENT_YEAR = new Date().getFullYear();
    this.anios = [CURRENT_YEAR, CURRENT_YEAR + 1];

    this.form = this.fb.group({
      anio: [CURRENT_YEAR, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      cuota: [null, [Validators.required, Validators.maxLength(25), Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]]
    });
  }

  ngOnInit(): void {
    this.initConfiguracionTabla();
    this.loadPagos();
  }

  private initConfiguracionTabla(): void {
    this.configuracionTabla = [
      { encabezado: 'Año', clave: (item: PagoDerecho): string => item.anio.toString(), orden: 1 },
      { encabezado: 'Cuota', clave: (item: PagoDerecho): string => `$${item.cuota.toString()}`, orden: 2 },
      { encabezado: 'Fecha de Registro', clave: (item: PagoDerecho): string => item.fechaRegistro, orden: 3 },
      { encabezado: 'Estado', clave: (item: PagoDerecho): string => item.estado, orden: 4 }
    ];
  }

  /**
   * Carga los pagos de derechos anuales.
   */
  loadPagos(): void {
    this.pagoDerechoService.getPagos().subscribe((data: PagoDerecho[]) => {
      this.pagos = data;
    });
  }

  /**
   * Guarda un nuevo pago de derecho anual.
   */
  onGuardar(): void {
    if (this.form.valid) {
      const NEW_PAGO: PagoDerecho = {
        anio: Number(this.form.value.anio),
        cuota: Number(this.form.value.cuota),
        fechaRegistro: new Date().toLocaleDateString('es-MX'),
        estado: 'Activo'
      };
      
      this.pagoDerechoService.savePago(NEW_PAGO).subscribe((response) => {
        this.anioAlert = this.form.value.anio;
        this.showAlert = true;
        this.form.reset({ anio: new Date().getFullYear() });
        this.pagos = response;
      });
    }
  }

  /**
   * Cancela la operación de guardar un nuevo pago de derecho anual.
   */
  onCancelar(): void {
    this.form.reset({ anio: new Date().getFullYear() });
  }

  /**
   * Valida que solo se ingresen números en el campo especificado.
   * @param event Evento de entrada
   * @param controlName Nombre del control del formulario
   */
  validarSoloNumeros(event: Event, controlName: string): void {
    const INPUT = event.target as HTMLInputElement;
    let VAL = INPUT.value;
    
    // Para cuota permitimos números y un solo punto decimal
    VAL = VAL.replace(/[^0-9.]/g, '');
    const PARTS = VAL.split('.');
    if (PARTS.length > 2) {
      VAL = PARTS[0] + '.' + PARTS.slice(1).join('');
    }
    
    INPUT.value = VAL;
    this.form.get(controlName)?.setValue(VAL, { emitEvent: false });
  }
}