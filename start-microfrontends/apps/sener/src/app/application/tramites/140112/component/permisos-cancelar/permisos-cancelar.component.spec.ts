import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PermisosCancelarComponent } from './permisos-cancelar.component';
import { Tramite140112Store } from '../../estados/tramite-140112.store';
import { Tramite140112Query } from '../../estados/tramite-140112.query';
import { PermisosCancelarService } from '../../service/permisos-cancelar.service';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PermisosCancelarComponent', () => {
  let componente: PermisosCancelarComponent;
  let fixture: ComponentFixture<PermisosCancelarComponent>;
  let almacenMock: jest.Mocked<Tramite140112Store>;
  let consultaMock: jest.Mocked<Tramite140112Query>;
  let servicioMock: jest.Mocked<PermisosCancelarService>;
  let consultaioQueryMock: Partial<ConsultaioQuery>;

  const MOCK_CONSULTA_STATE: Partial<ConsultaioState> = {
    readonly: false,
    update: false,
    procedureId: '140112',
    parameter: '',
    department: '',
    folioTramite: '',
    tipoDeTramite: '',
    estadoDeTramite: '',
    create: false,
    consultaioSolicitante: null
  };

  beforeEach(async () => {
    almacenMock = {
      establecerDatos: jest.fn(),
    } as unknown as jest.Mocked<Tramite140112Store>;

    consultaMock = {
      selectDesistimiento$: of({
        descripcionClobGenerica1: '',
        declaracionBoolean: false
      })
    } as unknown as jest.Mocked<Tramite140112Query>;

    servicioMock = {
      getPermisosCancelar: jest.fn().mockReturnValue(of([])),
      isValid: jest.fn().mockReturnValue(true)
    } as unknown as jest.Mocked<PermisosCancelarService>;

    consultaioQueryMock = {
      selectConsultaioState$: of(MOCK_CONSULTA_STATE as ConsultaioState)
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        PermisosCancelarComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite140112Store, useValue: almacenMock },
        { provide: Tramite140112Query, useValue: consultaMock },
        { provide: PermisosCancelarService, useValue: servicioMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisosCancelarComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  describe('Formulario Reactivo', () => {
    it('debería inicializar el formulario con los campos requeridos', () => {
      expect(componente.solicitud.get('descripcionClobGenerica1')).toBeTruthy();
      expect(componente.solicitud.get('declaracionBoolean')).toBeTruthy();
    });

    it('debería ser inválido cuando está vacío', () => {
      expect(componente.solicitud.valid).toBeFalsy();
    });
  });

  describe('Manejo del Formulario', () => {
    it('debería manejar cambios en el checkbox', () => {
      const checkboxControl = componente.solicitud.get('declaracionBoolean');
      checkboxControl?.setValue(true);
      expect(checkboxControl?.value).toBeTruthy();
      
      checkboxControl?.setValue(false);
      expect(checkboxControl?.value).toBeFalsy();
    });
  });

  describe('Validación del Formulario', () => {
    it('debería ser válido cuando se completan todos los campos requeridos', () => {
      componente.solicitud.patchValue({
        descripcionClobGenerica1: 'Motivo de desistimiento',
        declaracionBoolean: true
      });

      expect(componente.solicitud.valid).toBeTruthy();
    });

    it('debería ser inválido cuando falta el motivo de desistimiento', () => {
      componente.solicitud.patchValue({
        descripcionClobGenerica1: '',
        declaracionBoolean: true
      });

      expect(componente.solicitud.valid).toBeFalsy();
      expect(componente.solicitud.get('descripcionClobGenerica1')?.errors?.['required']).toBeTruthy();
    });

    it('debería ser inválido cuando no se marca el manifiesto', () => {
      componente.solicitud.patchValue({
        descripcionClobGenerica1: 'Motivo',
        declaracionBoolean: false
      });

      expect(componente.solicitud.valid).toBeFalsy();
      expect(componente.solicitud.get('declaracionBoolean')?.errors?.['required']).toBeTruthy();
    });
  });

  describe('Interacción con el Almacén', () => {
    it('debería actualizar el almacén al cambiar los valores del formulario', () => {
      const VALORES_FORMULARIO = {
        descripcionClobGenerica1: 'Motivo de prueba',
        declaracionBoolean: true
      };

      componente.solicitud.patchValue(VALORES_FORMULARIO);

      componente.setValoresStore(componente.solicitud, 'descripcionClobGenerica1');
      expect(almacenMock.establecerDatos).toHaveBeenCalledWith({
        descripcionClobGenerica1: VALORES_FORMULARIO.descripcionClobGenerica1
      });

      componente.setValoresStore(componente.solicitud, 'declaracionBoolean');
      expect(almacenMock.establecerDatos).toHaveBeenCalledWith({
        declaracionBoolean: VALORES_FORMULARIO.declaracionBoolean
      });
    });
  });

  describe('Ciclo de Vida', () => {
    it('debería limpiar las suscripciones al destruir el componente', () => {
      const destroySpy = jest.spyOn(componente.destroy$, 'next');
      const completeSpy = jest.spyOn(componente.destroy$, 'complete');

      componente.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
