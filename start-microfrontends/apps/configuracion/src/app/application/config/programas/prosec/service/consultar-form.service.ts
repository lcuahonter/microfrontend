import {
  ConsultType,
  ConsultaFormData,
  ConsultaResultado
} from './model/consultar-form.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

/**
 * Servicio para manejar la lógica del formulario de consulta de configuración PROSEC
 */
@Injectable({
  providedIn: 'root'
})
export class ConsultarFormService {
  constructor(private fb: FormBuilder) {}

  /**
   * Inicializa el formulario de consulta
   * @returns FormGroup configurado con los controles necesarios
   */
  initializeForm(): FormGroup {
    return this.fb.group({
      consultType: ['sector', Validators.required],
      sector: [null],
      fraccion: [null]
    });
  }

  /**
   * Maneja el cambio en el tipo de consulta
   * @param form Formulario reactivo
   * @param consultType Tipo de consulta seleccionado
   */
  onConsultTypeChange(form: FormGroup, consultType: ConsultType): void {
    const SECTOR_CTRL = form.get('sector');

    if (consultType === 'sector') {
      // Habilitar y requerir el campo sector
      SECTOR_CTRL?.setValidators([Validators.required]);
      SECTOR_CTRL?.enable();
    } else if (consultType === 'fraccion') {
      // Habilitar y requerir el campo fraccion
      SECTOR_CTRL?.clearValidators();
      SECTOR_CTRL?.disable();
    } else {
      // Deshabilitar y limpiar validadores
      SECTOR_CTRL?.clearValidators();
      SECTOR_CTRL?.setValue(null);
      SECTOR_CTRL?.disable();
    }

    SECTOR_CTRL?.updateValueAndValidity();
  }

  /**
   * Realiza la búsqueda según los valores del formulario
   * @param formData Datos del formulario
   * @returns Observable con los resultados de la búsqueda
   */
  searchResults(formData: ConsultaFormData): Observable<ConsultaResultado[]> {
    // Simulación de llamada HTTP - reemplazar con servicio real
    return this.getTableData(formData).pipe(delay(500));
  }

  /**
   * Obtiene los datos para la tabla
   * @param formData Datos del formulario para filtrar
   * @returns Observable con datos de ejemplo
   */
  private getTableData(
    formData: ConsultaFormData
  ): Observable<ConsultaResultado[]> {
    // Datos de ejemplo - reemplazar con llamada HTTP real
    const MOCK_DATA: ConsultaResultado[] = [
      {
        id: 1,
        sector: 'XI De la Industria Química',
        claveSector: '11',
        fechaInicio: '15/01/2024',
        fechaFin: '31/12/2024',
        activo: true,
        fraccion: '01023101',
        detalles: {
          descripcion: 'Vehículos automóviles'
        }
      },
      {
        id: 2,
        sector: 'XII De la Industria Manufactura del caucho y plástico',
        claveSector: '12',
        fechaInicio: '20/02/2024',
        fechaFin: '31/12/2024',
        activo: true,
        fraccion: '01023102',
        detalles: {
          descripcion: 'Máquinas automáticas para procesamiento de datos'
        }
      },
      {
        id: 3,
        sector: 'XIII De la Industria Siderúrgica',
        claveSector: '13',
        fechaInicio: '10/12/2023',
        fechaFin: '31/12/2024',
        activo: false,
        fraccion: '01023103',
        detalles: {
          descripcion: 'Pantalones de algodón para mujeres'
        }
      },
      {
        id: 4,
        sector: 'XIV De la Ind. Farmoquímicos, medicamentos y equipo',
        claveSector: '14',
        fechaInicio: '05/03/2024',
        fechaFin: '31/12/2024',
        activo: true,
        fraccion: '01023104',
        detalles: {
          descripcion: 'Benceno'
        }
      },
      {
        id: 5,
        sector: 'XV De la Industria de Transporte',
        claveSector: '15',
        fechaInicio: '20/01/2024',
        fechaFin: '31/12/2024',
        activo: true,
        fraccion: '01023105',
        detalles: {
          descripcion: 'Partes y accesorios de vehículos'
        }
      }
    ];

    // Filtrar según el tipo de consulta
    let filteredData = MOCK_DATA;

    if (formData.consultType === 'sector' && formData.sector) {
      filteredData = this.getDataByClaveSector();
    }

    if (formData.consultType === 'fraccion' && formData.fraccion) {
      filteredData = MOCK_DATA.filter((item) =>
        item.fraccion.toString() === formData.fraccion?.toString()
      );
    }

    return of(filteredData);
  }

  /**
   * Valida si el formulario es válido para realizar la búsqueda
   * @param form Formulario reactivo
   * @returns true si el formulario es válido
   */
  isFormValid(form: FormGroup): boolean {
    const CONSULT_TYPE = form.get('consultType')?.value;

    if (CONSULT_TYPE === 'sector') {
      return form.valid && form.get('sector')?.value !== null;
    }

    return form.get('consultType')?.valid ?? false;
  }

  /**
   * Obtiene los datos por clave de sector
   * @param claveSector Clave del sector
   * @returns Array de ConsultaResultado
   */
  getDataByClaveSector(claveSector?: string): ConsultaResultado[] {
    const MOCK_DATA: ConsultaResultado[] = [
      {
          id: 1,
          sector: 'XI De la Industria Química',
          claveSector: '11',
          fechaInicio: '15/01/2024',
          fechaFin: '31/12/2024',
          activo: true,
          fraccion: '01023101',
          detalles: {
            descripcion: 'Vehículos automóviles'
          }
        },
        {
          id: 2,
          sector: 'XI De la Industria Química',
          claveSector: '11',
          fechaInicio: '10/09/2010',
          fechaFin: '15/01/2024',
          activo: false,
          fraccion: '01023101',
          detalles: {
            descripcion: 'Vehículos automóviles'
          }
        }
    ]

    return MOCK_DATA;
  }
}
