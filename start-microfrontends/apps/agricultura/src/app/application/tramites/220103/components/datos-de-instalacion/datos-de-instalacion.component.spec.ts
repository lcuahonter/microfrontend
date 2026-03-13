import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeInstalacionComponent } from './datos-de-instalacion.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Tramite220103Query } from '../../estados/queries/tramites220103.query';
import { Tramite220103Store } from '../../estados/tramites/tramites220103.store';
import { CAMPOS_FORMULARIO_DATOS_DE_INSTALACION } from '../../constantes/sanidad-acuicola-importacion.enum';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatosDeInstalacionComponent', () => {
  let component: DatosDeInstalacionComponent;
  let fixture: ComponentFixture<DatosDeInstalacionComponent>;
  let MOCK_QUERY: jest.Mocked<Tramite220103Query>;
  let MOCK_STORE: jest.Mocked<Tramite220103Store>;

  beforeEach(async () => {
    MOCK_QUERY = {
      selectTramite220103State$: of({
        campo1: 'valor1',
        campo2: 'valor2',
        readonly: false,
      }),
    } as unknown as jest.Mocked<Tramite220103Query>;

    MOCK_STORE = {
      setTramite220103State: jest.fn(),
    } as unknown as jest.Mocked<Tramite220103Store>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,DatosDeInstalacionComponent,FormasDinamicasComponent],
      providers: [
        FormBuilder,
        { provide: Tramite220103Query, useValue: MOCK_QUERY },
        { provide: Tramite220103Store, useValue: MOCK_STORE },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignora errores de elementos desconocidos
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeInstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el estado seleccionado en ngOnInit', () => {
    component.ngOnInit();

    expect(component.estadoSeleccionado).toEqual({
      campo1: 'valor1',
      campo2: 'valor2',
      readonly: false,
    });
  });

  it('debería habilitar o deshabilitar el formulario según el estado de solo lectura', () => {
    component.esSoloLectura = true;
    component.habilitarDeshabilitarFormulario();
    expect(component.formularioDatosDeInstalacion.disabled).toBe(true);

    component.esSoloLectura = false;
    component.habilitarDeshabilitarFormulario();
    expect(component.formularioDatosDeInstalacion.enabled).toBe(true);
  });

  it('debería establecer un cambio de valor en el estado del trámite', () => {
    const MOCK_EVENT = { campo: 'campo1', valor: 'nuevoValor' };
    component.establecerCambioDeValor(MOCK_EVENT);

    expect(MOCK_STORE.setTramite220103State).toHaveBeenCalledWith(
      'campo1',
      'nuevoValor'
    );
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const DESTROY_NOTIFIER_SPY = jest.spyOn(
      component['notificadorDestruccion$'],
      'next'
    );
    const DESTROY_NOTIFIER_COMPLETE_SPY = jest.spyOn(
      component['notificadorDestruccion$'],
      'complete'
    );

    component.ngOnDestroy();

    expect(DESTROY_NOTIFIER_SPY).toHaveBeenCalled();
    expect(DESTROY_NOTIFIER_COMPLETE_SPY).toHaveBeenCalled();
  });

  it('debería inicializar el formulario con los campos de configuración', () => {
    expect(component.configuracionFormularioDatosDeInstalacion).toEqual(
      CAMPOS_FORMULARIO_DATOS_DE_INSTALACION
    );
    expect(component.formularioDatosDeInstalacion).toBeDefined();
  });

  it('debería renderizar el componente FormasDinamicas correctamente', () => {
    const COMPILED = fixture.nativeElement;
    const FORMAS_DINAMICAS_ELEMENT = COMPILED.querySelector('formas-dinamicas');
    expect(FORMAS_DINAMICAS_ELEMENT).toBeTruthy();
    expect(FORMAS_DINAMICAS_ELEMENT.getAttribute('formularioTitulo')).toBe(
      'Datos de instalación de procedencia'
    );
    expect(FORMAS_DINAMICAS_ELEMENT.getAttribute('soloLectura')).toBe(
      component.esSoloLectura.toString()
    );
  });
});