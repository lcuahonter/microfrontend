import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { BuscarCertificadoDeOrigenService } from '../../services/buscar-certificado-de-origen/buscarCertificadoDeOrigen.service';
import { Tramite110210Store } from '../../estados/store/tramite110210.store';
import { Tramite110210Query } from '../../estados/queries/tramite110210.query';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let mockService: any;
  let mockTramiteStore: any;
  let mockTramiteQuery: any;

  beforeEach(async () => {
    mockService = {
      guardar: jest.fn().mockReturnValue(
        of({
          idSolicitud: 123,
          mensaje: 'Guardado correctamente',
        })
      ),
    };

    mockTramiteStore = {} as any;
    mockTramiteQuery = {
      selectTramite110210$: of({}),
    };

    await TestBed.configureTestingModule({
      declarations: [SolicitudPageComponent],
      providers: [
        { provide: BuscarCertificadoDeOrigenService, useValue: mockService },
        { provide: Tramite110210Store, useValue: mockTramiteStore },
        { provide: Tramite110210Query, useValue: mockTramiteQuery },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;

    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    component.pasoUnoComponent = {
      validarFormularios: jest.fn().mockReturnValue(true),
    } as any;

    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar pasos con PASOS', () => {
    expect(component.pasos).toEqual(PASOS);
  });

  it('debe inicializar datosPasos correctamente', () => {
    expect(component.datosPasos).toEqual({
      nroPasos: PASOS.length,
      indice: component.indice,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('debe actualizar el indice cuando se llama seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debe llamar wizardComponent.siguiente cuando la acción es "cont"', () => {
    component.indice = 1;
    const accionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(accionBoton);
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('no debe avanzar si validarFormularios es false en paso 1', () => {
    component.indice = 1;
    component.pasoUnoComponent.validarFormularios = jest
      .fn()
      .mockReturnValue(false);

    const accion = { accion: 'cont', valor: 1 };
    component.getValorIndice(accion);

    expect(component.esFormaValido).toBe(true);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('no debe actualizar indice si valor está fuera de rango', () => {
    const accionBoton = { accion: 'cont', valor: 6 };
    component.getValorIndice(accionBoton);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('debe llamar wizardComponent.atras cuando la acción es "ant"', () => {
    component.indice = 3;
    const accionBoton = { accion: 'ant', valor: 3 };
    component.getValorIndice(accionBoton);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('guardar() debe actualizar guardarIdSolicitud y guardarMensaje', () => {
    (component as any).guardar();
    expect(mockService.guardar).toHaveBeenCalled();
    expect(component.guardarIdSolicitud).toBe(123);
    expect(component.guardarMensaje).toBe('Guardado correctamente');
  });

  it('validarTodosFormulariosPasoUno debe retornar true si no hay pasoUnoComponent', () => {
    component.pasoUnoComponent = undefined as any;
    const result = (component as any).validarTodosFormulariosPasoUno();
    expect(result).toBe(true);
  });

  it('ngOnDestroy debe cerrar destroyNotifier$', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
