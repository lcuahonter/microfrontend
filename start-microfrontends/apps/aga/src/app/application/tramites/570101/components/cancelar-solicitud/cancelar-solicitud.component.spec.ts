/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancelarSolicitudComponent } from './cancelar-solicitud.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CancelarSolicitudStore } from '../../estados/tramite570101.store';
import { CatalogoSelectComponent, FechasService, ValidacionesFormularioService, SeccionLibStore, SeccionLibQuery } from '@libs/shared/data-access-user/src';
import { CancelarSolicitudService } from '../../service/cancelar-solicitud.service';
import { CancelarSolicitudQuery } from '../../estados/tramite570101.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CancelarSolicitudForm } from '../../modelos/cancelar-solicitud.modalidad.model';

describe('CancelarSolicitudComponent', () => {
  let component: CancelarSolicitudComponent;
  let fixture: ComponentFixture<CancelarSolicitudComponent>;
  let cancelarSolicitudServiceMock: any;
  let cancelarSolicitudStoreMock: any;
  let cancelarSolicitudQueryMock: any;
  let seccionLibStoreMock: any;
  let seccionLibQueryMock: any;
  let consultaioQueryMock: any;
  let cancelarSolicitudFormState: CancelarSolicitudForm;
  let fechaServiceMock: any;
  let validacionesServiceMock: any;
  let seccion: any;

  beforeEach(async () => {
    // Mock Services
    cancelarSolicitudServiceMock = {
      getCancelarSolicitud: jest.fn().mockReturnValue(of({
        folioSVEX: "SVEX470000012025",
        folioVUCEM: "01057001000120252470000002",
        tipoDeCancelacion: "",
        horaInicio: "06:00",
        horaFin: "23:00",
        descripcion: "",
        fechasSeleccionadas: {
            selectedFechas: [] 
        }
      })),
      getSelectRangoDias: jest.fn().mockReturnValue(of(['2023-01-01', '2023-01-02'])),
      getTipoSolicitud: jest.fn().mockReturnValue(
        of([{ modalidad: 'Total' }, { modalidad: 'Parcial' }])
      )
    };

    cancelarSolicitudStoreMock = {
      setTipoDeCancelacion: jest.fn(),
      setFechasSeleccionadas: jest.fn(),
      setDescripcion: jest.fn()
    };

    seccionLibStoreMock = {
      establecerFormaValida: jest.fn()
    };

    seccionLibQueryMock = {
      selectSeccionState$: of({
        seccion: [true, false, false],
        formaValida: [false, false, false]
      })
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false })
    };

    seccion = {
      seccion: [false, true],
      formvalida: [false, false]
    };
    
    cancelarSolicitudFormState = {
      folioSVEX: "SVEX470000012025",
      folioVUCEM: "01057001000120252470000002",
      tipoDeCancelacion: "",
      horaInicio: "06:00",
      horaFin: "23:00",
      descripcion: "",
      fechasSeleccionadas: {
          selectedFechas: [] 
      }
    };
    
    cancelarSolicitudQueryMock = {
      selectCancelarSolicitud$: of({
        folioSVEX: "SVEX470000012025",
        folioVUCEM: "01057001000120252470000002",
        tipoDeCancelacion: "",
        horaInicio: "06:00",
        horaFin: "23:00",
        descripcion: "",
        fechasSeleccionadas: {
            selectedFechas: [] 
        }
      })
    };

    fechaServiceMock = {
      obtenerDiasEntreFechas: jest.fn().mockReturnValue(['01-03-2025', '02-03-2025', '03-03-2025'])
    };

    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CatalogoSelectComponent],
      declarations: [CancelarSolicitudComponent],
      providers: [
        FormBuilder,
        { provide: CancelarSolicitudStore, useValue: cancelarSolicitudStoreMock },
        { provide: FechasService, useValue: fechaServiceMock },
        { provide: CancelarSolicitudService, useValue: cancelarSolicitudServiceMock },
        { provide: CancelarSolicitudQuery, useValue: cancelarSolicitudQueryMock },
        { provide: SeccionLibStore, useValue: seccionLibStoreMock },
        { provide: SeccionLibQuery, useValue: seccionLibQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelarSolicitudComponent);
    component = fixture.componentInstance;
    component.cancelarSolicitudFormState = cancelarSolicitudFormState;
    component.seccion = seccion;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Creación del componente
  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  // Inicialización del formulario
  it('debería inicializar el formulario con valores por defecto del estado', () => {
    expect(component.formCancelorSolicitud).toBeDefined();
    expect(component.formCancelorSolicitud.get('folioSVEX')?.value).toBe('SVEX470000012025');
    expect(component.formCancelorSolicitud.get('folioVUCEM')?.value).toBe('01057001000120252470000002');
    expect(component.formCancelorSolicitud.get('tipoDeCancelacion')?.value).toBe('');
    expect(component.formCancelorSolicitud.get('horaInicio')?.value).toBe('06:00');
    expect(component.formCancelorSolicitud.get('horaFin')?.value).toBe('23:00');
    expect(component.formCancelorSolicitud.get('descripcion')?.value).toBe('');
    expect(component.formCancelorSolicitud.get('fechasSeleccionadas.selectedFechas')?.value).toStrictEqual([]);
  });

  // Validación de campos disabled
  it('debería deshabilitar campos específicos del formulario', () => {
    expect(component.formCancelorSolicitud.get('folioSVEX')?.disabled).toBe(true);
    expect(component.formCancelorSolicitud.get('folioVUCEM')?.disabled).toBe(true);
    expect(component.formCancelorSolicitud.get('horaInicio')?.disabled).toBe(true);
    expect(component.formCancelorSolicitud.get('horaFin')?.disabled).toBe(true);
  });

  // Validación de campos requeridos
  it('debería validar campos requeridos del formulario', () => {
    component.formCancelorSolicitud.get('tipoDeCancelacion')?.setValue('');
    component.formCancelorSolicitud.get('descripcion')?.setValue('');
    
    expect(component.formCancelorSolicitud.get('tipoDeCancelacion')?.hasError('required')).toBe(true);
    expect(component.formCancelorSolicitud.get('descripcion')?.hasError('required')).toBe(true);
  });

  // Validación maxlength de descripción
  it('debería validar longitud máxima de descripción (450 caracteres)', () => {
    const textoLargo = 'a'.repeat(451);
    component.formCancelorSolicitud.get('descripcion')?.setValue(textoLargo);
    
    expect(component.formCancelorSolicitud.get('descripcion')?.hasError('maxlength')).toBe(true);
  });

  // Llamada al servicio getCancelarSolicitud
  it('debería llamar getCancelarSolicitud al inicializar y actualizar valores', () => {
    expect(cancelarSolicitudServiceMock.getCancelarSolicitud).toHaveBeenCalled();
    expect(component.formCancelorSolicitud.get('folioSVEX')?.value).toBe('SVEX470000012025');
  });

  // Tipo de solicitud parcial
  it('debería actualizar esSeleccionadaTipoParcial a true cuando tipoDeCancelacion es "2"', () => {
    component.formCancelorSolicitud.get('tipoDeCancelacion')?.setValue('2');
    component.tipoSolicitudSeleccion();
    
    expect(component.esSeleccionadaTipoParcial).toBe(true);
    expect(cancelarSolicitudStoreMock.setTipoDeCancelacion).toHaveBeenCalledWith(
      cancelarSolicitudFormState,
      '2'
    );
  });

  // Tipo de solicitud total
  it('debería actualizar esSeleccionadaTipoParcial a false cuando tipoDeCancelacion es "1"', () => {
    component.formCancelorSolicitud.patchValue({ tipoDeCancelacion: '1' });
    component.tipoSolicitudSeleccion();
    
    expect(component.esSeleccionadaTipoParcial).toBe(false);
    expect(cancelarSolicitudStoreMock.setTipoDeCancelacion).toHaveBeenCalledWith(
      cancelarSolicitudFormState,
      '1'
    );
  });

  // Validación de updateValueAndValidity
  it('debería actualizar formulario y llamar updateValueAndValidity en tipoDeCancelacion', () => {
    const tipoDeCancelacionControl = component.formCancelorSolicitud.get('tipoDeCancelacion');
    const spy = jest.spyOn(tipoDeCancelacionControl!, 'updateValueAndValidity');
    
    component.tipoSolicitudSeleccion();
    
    expect(spy).toHaveBeenCalled();
  });

  // Validación de campos del formulario
  it('debería retornar estado válido para un campo del formulario', () => {
    const resultado = component.isValid(component.formCancelorSolicitud, 'descripcion');
    
    expect(resultado).toBe(true);
    expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(component.formCancelorSolicitud, 'descripcion');
  });

  // Cleanup de suscripciones
  it('debería limpiar suscripciones al destruir el componente', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  // Rango de fechas
  it('debería obtener y poblar selectRangoDias', () => {
    expect(cancelarSolicitudServiceMock.getSelectRangoDias).toHaveBeenCalled();
    expect(component.selectRangoDias).toEqual(['2023-01-01', '2023-01-02']);
  });

  // Tipos de solicitud
  it('debería obtener y poblar tipoSolicitud', () => {
    expect(cancelarSolicitudServiceMock.getTipoSolicitud).toHaveBeenCalled();
    expect(component.tipoSolicitud).toEqual([{ modalidad: 'Total' }, { modalidad: 'Parcial' }]);
  });

  // Cambio de fechas seleccionadas
  it('debería actualizar fechas seleccionadas y llamar al store', () => {
    const nuevasFechas = ['2024-01-15', '2024-01-16'];
    const spyActualizarValidation = jest.spyOn(component, 'actualizarValidationInStore');
    
    component.onFechasSeleccionadasChange(nuevasFechas);
    
    expect(component.formCancelorSolicitud.get('fechasSeleccionadas.selectedFechas')?.value).toEqual(nuevasFechas);
    expect(cancelarSolicitudStoreMock.setFechasSeleccionadas).toHaveBeenCalledWith(
      cancelarSolicitudFormState,
      nuevasFechas
    );
    expect(spyActualizarValidation).toHaveBeenCalled();
  });

  // Cambio de descripción
  it('debería actualizar descripción y llamar al store', () => {
    const nuevaDescripcion = 'Nueva descripción de prueba';
    component.formCancelorSolicitud.patchValue({ descripcion: nuevaDescripcion });
    const spyActualizarValidation = jest.spyOn(component, 'actualizarValidationInStore');
    
    component.onDescripcionChange();
    
    expect(cancelarSolicitudStoreMock.setDescripcion).toHaveBeenCalledWith(
      cancelarSolicitudFormState,
      nuevaDescripcion
    );
    expect(spyActualizarValidation).toHaveBeenCalled();
  });

  // Actualización de validación en store
  it('debería actualizar validación en store cuando formulario es válido', () => {
    jest.spyOn(component.formCancelorSolicitud, 'valid', 'get').mockReturnValue(true);
    component.seccion = { seccion: [true, false, false], formaValida: [false, false, false] };
    
    component.actualizarValidationInStore();
    
    expect(seccionLibStoreMock.establecerFormaValida).toHaveBeenCalledWith([true, false, false]);
  });

  // Formulario inválido
  it('debería actualizar validación en store cuando formulario es inválido', () => {
    jest.spyOn(component.formCancelorSolicitud, 'valid', 'get').mockReturnValue(false);
    component.seccion = { seccion: [true, false, false], formaValida: [true, false, false] };
    
    component.actualizarValidationInStore();
    
    expect(seccionLibStoreMock.establecerFormaValida).toHaveBeenCalledWith([false, false, false]);
  });

  // Getter fechasSeleccionadas
  it('debería retornar fechas seleccionadas del estado', () => {
    component.cancelarSolicitudFormState.fechasSeleccionadas.selectedFechas = ['2024-01-15', '2024-01-16'];
    
    expect(component.fechasSeleccionadas).toEqual(['2024-01-15', '2024-01-16']);
  });

  // Fechas seleccionadas vacías
  it('debería retornar array vacío cuando no hay fechas seleccionadas', () => {
    component.cancelarSolicitudFormState.fechasSeleccionadas.selectedFechas = [];
    
    expect(component.fechasSeleccionadas).toEqual([]);
  });

  // Validador requerido para fechas
  it('debería establecer validador requerido para fechas seleccionadas', () => {
    component.setSelectedFechasRequired(true);
    const control = component.formCancelorSolicitud.get('fechasSeleccionadas.selectedFechas');
    control?.setValue([]);
    
    expect(control?.hasError('required')).toBe(true);
  });

  // Remover validador requerido
  it('debería remover validador requerido para fechas seleccionadas', () => {
    component.setSelectedFechasRequired(false);
    const control = component.formCancelorSolicitud.get('fechasSeleccionadas.selectedFechas');
    control?.setValue([]);
    
    expect(control?.hasError('required')).toBe(false);
  });

  // Formulario en modo solo lectura
  it('debería deshabilitar formulario en modo solo lectura', () => {
    component.esFormularioSoloLectura = true;
    const spyDisable = jest.spyOn(component.formCancelorSolicitud, 'disable');
    
    component.inicializarEstadoFormulario();
    
    expect(spyDisable).toHaveBeenCalled();
  });

  // Manejo de estado undefined
  it('debería manejar estado undefined sin errores', () => {
    component.cancelarSolicitudFormState = undefined as any;
    
    expect(() => component.crearFormSolicitud()).not.toThrow();
  });

  // Validación con null/undefined del servicio
  it('debería retornar false cuando el servicio de validaciones retorna null', () => {
    validacionesServiceMock.isValid.mockReturnValue(null);
    
    const resultado = component.isValid(component.formCancelorSolicitud, 'campo');
    
    expect(resultado).toBe(false);
  });

  // Control no existente en setSelectedFechasRequired
  it('no debería hacer nada si el control no existe en setSelectedFechasRequired', () => {
    component.formCancelorSolicitud = null as any;
    
    expect(() => component.setSelectedFechasRequired(true)).not.toThrow();
  });

  // Sección no activa
  it('no debería actualizar store si no hay sección activa', () => {
    component.seccion.seccion = [false, false, false];
    
    component.actualizarValidationInStore();
    
    expect(seccionLibStoreMock.establecerFormaValida).not.toHaveBeenCalled();
  });
});
