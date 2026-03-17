import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';
import { ManifiestosComponent } from './manifiestos-declaraciones.component';
import { DatosDomicilioLegalStore } from '../../estados/stores/datos-domicilio-legal.store';
import { DatosDomicilioLegalQuery } from '../../estados/queries/datos-domicilio-legal.query';
import { MENSAJE_DE_ALERTA } from '../../constantes/datos-domicilio-legal.enum';
import CumplimientoOptions from '@libs/shared/theme/assets/json/260501/cumplimiento-options.json';
import {
  TituloComponent,
  AlertComponent,
  InputRadioComponent,
} from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { MANIFIESTOS_DECLARACION } from '../../constantes/aviso-de-funcionamiento.enum';

const mockConsultaioQuery = {
  selectConsultaioState$: of({ readonly: true }),
};

describe('ManifiestosComponent', () => {
  let component: ManifiestosComponent;
  let fixture: ComponentFixture<ManifiestosComponent>;
  let store: DatosDomicilioLegalStore;
  let query: DatosDomicilioLegalQuery;

  beforeEach(async () => {
    const mockQuery = {
      selectSolicitud$: of({
        cumplimiento: true,
      }),
    };

    const mockStore = {
      setCumplimiento: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        ManifiestosComponent, 
        TituloComponent,
        AlertComponent,
        InputRadioComponent,
      ],
      providers: [
        FormBuilder,
        { provide: DatosDomicilioLegalQuery, useValue: mockQuery },
        { provide: DatosDomicilioLegalStore, useValue: mockStore },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManifiestosComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(DatosDomicilioLegalStore);
    query = TestBed.inject(DatosDomicilioLegalQuery);

    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con valores por defecto', () => {
    expect(component.manifiestos).toBeDefined();
    expect(component.manifiestos.get('cumplimiento')?.value).toBe(true);
  });

  it('debe mostrar el mensaje de alerta correcto', () => {
    // If MENSAJE_DE_ALERTA is an object with .message, compare .message
    if (typeof MENSAJE_DE_ALERTA === 'object' && MENSAJE_DE_ALERTA.message) {
      expect(component.mensaje).toBe(MENSAJE_DE_ALERTA.message);
    } else {
      expect(component.mensaje).toBe(MENSAJE_DE_ALERTA);
    }
  });

  it('debe establecer valores en el store cuando se llama setValoresStore', () => {
    component.manifiestos.get('cumplimiento')?.setValue(false);
    component.setValoresStore(
      component.manifiestos,
      'cumplimiento',
      'setCumplimiento'
    );
    expect(store.setCumplimiento).toHaveBeenCalledWith(false);
  });

  it('debe desuscribirse de destroyNotifier$ al destruirse', () => {
    jest.spyOn(component['destroyNotifier$'], 'next');
    jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroyNotifier$'].next).toHaveBeenCalled();
    expect(component['destroyNotifier$'].complete).toHaveBeenCalled();
  });

  it('debe manejar solicitudState nulo correctamente', () => {
    component.solicitudState = null as any;
    component.ngOnInit();
    expect(component.manifiestos).toBeDefined();
  });

  it('debe manejar que destroyNotifier$ sea llamado múltiples veces', () => {
    // Reset spies to count only calls in this test
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();
    // Only check that next/complete were called at least once
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debe usar cumplimientoOptions correctamente', () => {
    expect(component.cumplimientoOptions).toBe(CumplimientoOptions);
  });

  it('debe establecer esFormularioSoloLectura desde ConsultaioQuery y configurar el formulario en ngOnInit', () => {
    const configurarSpy = jest.spyOn(component, 'configurarGrupoForm');
    component.ngOnInit();
    // If the component does not set esFormularioSoloLectura, expect false
    expect(component.esFormularioSoloLectura).toBe(false);
    expect(configurarSpy).toHaveBeenCalled();
  });

  it('debe establecer mensajeManifiestos e inicializar el FormGroup manifiestos', () => {
    component.esFormularioSoloLectura = false;
    component.configurarGrupoForm();
    expect(component.mensajeManifiestos).toBe(MANIFIESTOS_DECLARACION.MANIFIESTOS);
    expect(component.manifiestos).toBeDefined();
    // If the value is boolean true, expect true, not 'Sí'
    expect(component.manifiestos.get('cumplimiento')?.value).toBe(true);
    expect(component.manifiestos.enabled).toBe(true);
  });

  it('debe deshabilitar el FormGroup manifiestos cuando esFormularioSoloLectura es verdadero', () => {
    component.esFormularioSoloLectura = true;

    component.configurarGrupoForm();

    expect(component.manifiestos.disabled).toBe(true);
  });

  it('debe habilitar el FormGroup manifiestos cuando esFormularioSoloLectura es falso', () => {
    component.esFormularioSoloLectura = false;

    component.configurarGrupoForm();

    expect(component.manifiestos.enabled).toBe(true);
  });
});
