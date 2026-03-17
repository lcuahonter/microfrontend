import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudPageComponent } from './solicitud-page.component';
import { BtnContinuarComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { HttpClientModule } from '@angular/common/http';

interface AccionBoton {
  /**
   * La acción que se realizará.
   */
  accion: string;
  /**
   * El valor asociado a la acción.
   */
  valor: number;
}

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SolicitudPageComponent,
        PasoUnoComponent,
        PasoDosComponent,
        PasoTresComponent
      ],
      imports: [
        WizardComponent,
        BtnContinuarComponent,
        SolicitanteComponent,
        HttpClientModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
    
    component.pasoUnoComponent = {
      solicitudComponent: {
        validarFormulario: jest.fn(),
      },
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set indice correctly', () => {
    component.indice = 1;
    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });

  describe('getValorIndice', () => {
    it('should validate and move forward if form is valid', () => {
      (component.pasoUnoComponent.solicitudComponent
        .validarFormulario as jest.Mock).mockReturnValue(true);

      const accion: AccionBoton = { valor: 2, accion: 'cont' };

      component.indice = 1;
      component.getValorIndice(accion);

      expect(component.esValido).toBe(true);
      expect(component.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    });

    it('should set indice back to 1 if form is invalid', () => {
      (component.pasoUnoComponent.solicitudComponent
        .validarFormulario as jest.Mock).mockReturnValue(false);

      const accion: AccionBoton = { valor: 2, accion: 'cont' };

      component.indice = 1;
      component.getValorIndice(accion);

      expect(component.esValido).toBe(false);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('should call atras() when accion is not "cont"', () => {
      (component.pasoUnoComponent.solicitudComponent
        .validarFormulario as jest.Mock).mockReturnValue(true);

      const accion: AccionBoton = { valor: 2, accion: 'back' };

      component.indice = 1;
      component.getValorIndice(accion);

      expect(component.indice).toBe(2);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });

    it('should not do anything if valor is out of range', () => {
      const accion: AccionBoton = { valor: 10, accion: 'cont' };

      component.indice = 2;
      component.getValorIndice(accion);

      expect(component.indice).toBe(2);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });
  });
});
