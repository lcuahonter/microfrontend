import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/31601/servicios-pantallas.model';
import { AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/aviso-privacidad.enum';
import { PANTA_PASOS } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantallas.enum';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallasComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Mock del wizardComponent (must be after detectChanges)
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar pantallasPasos con PANTA_PASOS', () => {
    expect(component.pantallasPasos).toBe(PANTA_PASOS);
  });

  it('debería tener el índice predeterminado como 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debería tener avisoPrivacidadAlert igual a AVISO.Aviso', () => {
    expect(component.avisoPrivacidadAlert).toBe(AVISO.Aviso);
  });

  it('debería inicializar datosPasos correctamente', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('debería tener indiceDePestanaSeleccionada predeterminado como 1', () => {
    expect(component.indiceDePestanaSeleccionada).toBe(1);
  });

  describe('getValorIndice', () => {
    it('debería actualizar el índice y llamar a siguiente cuando la acción es "cont"', () => {
      const event: AccionBoton = { valor: 2, accion: 'cont' } as AccionBoton;
      component.getValorIndice(event);
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.indiceDePestanaSeleccionada).toBe(1);
    });

    it('debería actualizar el índice y llamar a atras cuando la acción no es "cont"', () => {
      const event: AccionBoton = { valor: 2, accion: 'back' } as AccionBoton;
      component.getValorIndice(event);
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
      expect(component.indiceDePestanaSeleccionada).toBe(1);
    });

    it('no debería actualizar el índice si el valor está fuera de rango', () => {
      const event: AccionBoton = { valor: 0, accion: 'cont' } as AccionBoton;
      component.indice = 1;
      component.datosPasos.indice = 1;
      component.getValorIndice(event);
      expect(component.indice).toBe(1);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('no debería reiniciar indiceDePestanaSeleccionada si valor es 1', () => {
      component.indiceDePestanaSeleccionada = 2;
      const event: AccionBoton = { valor: 1, accion: 'cont' } as AccionBoton;
      component.getValorIndice(event);
      expect(component.indiceDePestanaSeleccionada).toBe(2);
    });
  });

  describe('pestanaCambiado', () => {
    it('debería establecer indiceDePestanaSeleccionada al evento si es válido', () => {
      component.pestanaCambiado(2);
      expect(component.indiceDePestanaSeleccionada).toBe(2);
    });

    it('debería establecer indiceDePestanaSeleccionada en 1 si el evento es undefined', () => {
      component.indiceDePestanaSeleccionada = 3;
      component.pestanaCambiado(undefined as unknown as number);
      expect(component.indiceDePestanaSeleccionada).toBe(1);
    });

    it('debería establecer indiceDePestanaSeleccionada en 1 si el evento es null', () => {
      component.indiceDePestanaSeleccionada = 3;
      component.pestanaCambiado(null as unknown as number);
      expect(component.indiceDePestanaSeleccionada).toBe(1);
    });

    it('debería establecer indiceDePestanaSeleccionada en 1 si el evento es NaN', () => {
      component.indiceDePestanaSeleccionada = 3;
      component.pestanaCambiado(NaN);
      expect(component.indiceDePestanaSeleccionada).toBe(1);
    });
  });
});