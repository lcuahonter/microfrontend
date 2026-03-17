import { AccionistaStore, AccionistaStoreService } from '../../../estados/accionista.store';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { AccionistaDatosQuery } from '../../../queries/accionista.query';
import { CommonModule } from '@angular/common';
import { ConsultaSocioNacional } from '../../core/models/consulta-socio-nacional.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consulta-socio-accionista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consulta-socio-accionista.component.html',
  styleUrl: './consulta-socio-accionista.component.scss',
})
export class ConsultaSocioAccionistaComponent implements OnInit {
  /**
   * Formulario para la consulta de socio accionista.
   */
  public formConsultaSocioAccionista!: FormGroup;
  /**
   * Objeto que contiene los datos del socio accionista consultado.
   */
  public socioAccionistaConsultado?: AccionistaStore;
  /**
   * Subject utilizado para destruir el observable y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Indica si se deben registrar los datos del socio accionista nacional.
   */
  public registrarDatos: boolean = false;
  /**
   * Objeto que contiene los datos del socio accionista nacional.
   */
  socioAccionistaNacional!: ConsultaSocioNacional;
  /**
   * Lista de socios accionistas nacionales.
   */
  public listadoSociosAccionistas: ConsultaSocioNacional[] = [];

  constructor(private fb: FormBuilder,
    private router: Router,
    private busquedaQuery: AccionistaDatosQuery,
    private accionistaStore: AccionistaStoreService
  ) { }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se utiliza para limpiar los recursos y evitar memory leaks.
   */
  ngOnInit(): void {
    this.busquedaQuery.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.socioAccionistaConsultado = seccionState;
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
    this.socioAccionistaNacional = this.socioAccionistaConsultado?.accionistaNacional || {} as ConsultaSocioNacional;
    this.listadoSociosAccionistas = this.socioAccionistaConsultado?.listaAccionistasNacionales || [];
    this.crearFormSocioAccionista();
    this.llenarCamposSocioAccionista();
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se utiliza para limpiar los recursos y evitar memory leaks.
   */
  crearFormSocioAccionista():void {
    this.formConsultaSocioAccionista = this.fb.group({
      rfc: [{ value: '', disabled: true }],
      nombre: [{ value: '', disabled: true }],
      apellidoPaterno: [{ value: '', disabled: true }],
      apellidoMaterno: [{ value: '', disabled: true }],
      razonSocial: [{ value: '', disabled: true }],
    });
  }

  /**
   * Método que llena los campos del formulario con los datos del socio accionista consultado.
   */
  llenarCamposSocioAccionista():void {
    if (this.socioAccionistaConsultado) {
      this.formConsultaSocioAccionista.get('rfc')?.setValue(this.socioAccionistaConsultado.accionistaNacional.rfc);
      this.formConsultaSocioAccionista.get('nombre')?.setValue(this.socioAccionistaConsultado.accionistaNacional.nombre);
      this.formConsultaSocioAccionista.get('apellidoPaterno')?.setValue(this.socioAccionistaConsultado.accionistaNacional.apellidoPaterno);
      this.formConsultaSocioAccionista.get('apellidoMaterno')?.setValue(this.socioAccionistaConsultado.accionistaNacional.apellidoMaterno);
    }
  }

  /**
   * Método que se ejecuta al confirmar el socio accionista nacional.
   * Agrega el socio accionista nacional a la lista de socios accionistas y navega a la página de registro.
   */
  confirmarSocioNacional(): void {
    if (this.listadoSociosAccionistas.length === 0) {
      this.listadoSociosAccionistas = [];
    }
    this.listadoSociosAccionistas.push(this.socioAccionistaNacional);
    this.accionistaStore.setListaSociosNacionales(this.listadoSociosAccionistas);
    this.accionistaStore.setRegistraDatosNacional(this.registrarDatos = true);
    this.router.navigate(['login/registro-socio-accionista']);
  }

  /**
   * Método que se ejecuta al cancelar el guardado del socio accionista.
   * Navega a la página de registro de socio accionista.
   */
  cancelarGuardado(): void {
    this.router.navigate(['login/registro-socio-accionista']);
  }
}


