import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { ModificacionPermisoImportacionMedicamentosComponent } from './modificacion-permiso-importacion-medicamentos';
import { DatosProcedureStore } from '../../../../estados/tramites/tramites261103.store';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261103.query';
import { ModificacionPermisoImportacionMedicamentosService } from '../../services/modificacion-permiso-importacion-medicamentos.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
 
describe('ModificacionPermisoImportacionMedicamentosComponent', () => {
  let component: ModificacionPermisoImportacionMedicamentosComponent;
  let destroy$: Subject<void>;
 
  const mockStore = {
    establecerDatos: jest.fn()
  };
 
  const mockQuery = {
    selectProrroga$: of({
      ideGenerica1: 'valor1',
      observaciones: 'Justificación de prueba',
    })
  };
 
jest.spyOn(ModificacionPermisoImportacionMedicamentosService, 'isValid').mockReturnValue(true);
 
  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false })
  };
 
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ModificacionPermisoImportacionMedicamentosComponent],
      providers: [
        FormBuilder,
        { provide: DatosProcedureStore, useValue: mockStore },
        { provide: DatosProcedureQuery, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        {
          provide: ModificacionPermisoImportacionMedicamentosService,
          useValue: { isValid: jest.fn() }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
 
    const fixture = TestBed.createComponent(ModificacionPermisoImportacionMedicamentosComponent);
    component = fixture.componentInstance;
    destroy$ = component['destroy$'];
 
  });
 
  afterEach(() => {
    jest.clearAllMocks();
  });
 
  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });
 
  it('debería llamar a inicializarEstadoFormulario al iniciar', () => {
    const spy = jest.spyOn(component as any, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
 
  it('debería crear el formulario con los valores del estado', () => {
    component.crearFormulario();
    expect(component.preOperativeForm.get('ideGenerica1')?.value).toBe('valor1');
    expect(component.preOperativeForm.get('observaciones')?.value).toBe('Justificación de prueba');
  });
 
  it('debería deshabilitar el formulario si esFormularioSoloLectura es true', () => {
    component.esFormularioSoloLectura = true;
    component.crearFormulario();
    component.guardarDatosFormulario();
    expect(component.preOperativeForm.disabled).toBe(true);
  });
 
  it('debería habilitar el formulario si esFormularioSoloLectura es false', () => {
    component.esFormularioSoloLectura = false;
    component.crearFormulario();
    component.guardarDatosFormulario();
    expect(component.preOperativeForm.enabled).toBe(true);
  });
 
  it('debería llamar a establecerDatos en el store al ejecutar setValoresStore', () => {
    const formulario = new FormBuilder().group({
      observaciones: ['Texto de prueba'],
    });
    component.setValoresStore(formulario, 'observaciones');
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({ observaciones: 'Texto de prueba' });
  });
 
it('debería validar un campo con el servicio isValid', () => {
  const spy = jest.spyOn(ModificacionPermisoImportacionMedicamentosService, 'isValid').mockReturnValue(true);
 
  component.preOperativeForm = new FormBuilder().group({
    ideGenerica1: ['valor válido'],
  });
 
  const resultado = component.isValid('ideGenerica1');
 
  expect(resultado).toBe(true);
  expect(spy).toHaveBeenCalledWith(component.preOperativeForm, 'ideGenerica1');
});
 
 
  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const spyNext = jest.spyOn(destroy$, 'next');
    const spyComplete = jest.spyOn(destroy$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
 
  it('debería ejecutar obtenerDatosFormulario y crearFormulario al guardar datos', () => {
    const spyObtener = jest.spyOn(component, 'obtenerDatosFormulario');
    const spyCrear = jest.spyOn(component, 'crearFormulario');
    component.guardarDatosFormulario();
    expect(spyObtener).toHaveBeenCalled();
    expect(spyCrear).toHaveBeenCalled();
  });
});