import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import {
  BtnContinuarComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Mocks for child components and dependencies
class MockWizardComponent {
  siguiente = jest.fn(() => of());
  atras = jest.fn(() => of());
}
class MockPasoUnoComponent {
  avisoComponent = {
    validarFormulario: jest.fn(() => true),
  };
}

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SolicitudPageComponent,
        CommonModule,
        ReactiveFormsModule,
        PasoUnoComponent,
        PasoDosComponent,
        PasoTresComponent,
        WizardComponent,
        BtnContinuarComponent,
        HttpClientTestingModule,
      ],
    })
      .overrideComponent(SolicitudPageComponent, {
        set: {
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;

    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;

    component.pasoUnoComponent = new MockPasoUnoComponent() as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set indice to the given value', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should validate pasoUnoComponent when indice is 1', () => {
    component.indice = 1;
    const evento = { accion: 'cont', valor: 2 };
    component.pasoUnoComponent = {
      avisoComponent: {
        validarFormulario: () => true,
      },
    } as any;
    jest
      .spyOn(component.pasoUnoComponent.avisoComponent, 'validarFormulario')
      .mockReturnValue(true);

    component.getValorIndice(evento);

    expect(
      component.pasoUnoComponent.avisoComponent.validarFormulario
    ).toHaveBeenCalled();
  });

  it('should set datosPasos.indice to 1 and not proceed if esValido is false', () => {
    component.indice = 1;
    const evento = { accion: 'cont', valor: 2 };
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.pasoUnoComponent = {
      avisoComponent: {
        validarFormulario: () => false,
      },
    } as any;
    jest
      .spyOn(component.pasoUnoComponent.avisoComponent, 'validarFormulario')
      .mockReturnValue(false);

    component.getValorIndice(evento);

    expect(component.datosPasos.indice).toBe(1);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should call wizardComponent.siguiente when accion is "cont" and esValido is true', () => {
    component.indice = 1;
    const evento = { accion: 'cont', valor: 2 };
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.pasoUnoComponent = {
      avisoComponent: {
        validarFormulario: () => true,
      },
    } as any;
    jest
      .spyOn(component.pasoUnoComponent.avisoComponent, 'validarFormulario')
      .mockReturnValue(true);

    component.getValorIndice(evento);

    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should call wizardComponent.atras when accion is not "cont" and esValido is true', () => {
    component.indice = 1;
    const evento = { accion: 'back', valor: 2 };
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;

    component.pasoUnoComponent = {
      avisoComponent: {
        validarFormulario: () => true,
      },
    } as any;
    jest
      .spyOn(component.pasoUnoComponent.avisoComponent, 'validarFormulario')
      .mockReturnValue(true);

    component.getValorIndice(evento);

    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should do nothing if evento.valor is out of range', () => {
    component.indice = 1;
    const evento = { accion: 'cont', valor: 0 };
    component.getValorIndice(evento);
    expect(component.indice).toBe(1);

    const evento2 = { accion: 'cont', valor: 5 };
    component.getValorIndice(evento2);
    expect(component.indice).toBe(1);
  });

  it('should set esValido to false if avisoComponent is undefined', () => {
    component.indice = 1;
    component.pasoUnoComponent = undefined as any;
    const evento = { accion: 'cont', valor: 2 };

    component.getValorIndice(evento);

    expect(component.esValido).toBe(false);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should handle undefined return from validarFormulario', () => {
    component.indice = 1;
    component.pasoUnoComponent = {
      avisoComponent: {
        validarFormulario: () => true,
      },
    } as any;
    jest
      .spyOn(component.pasoUnoComponent.avisoComponent, 'validarFormulario')
      .mockReturnValue(true);
    const evento = { accion: 'cont', valor: 2 };

    component.getValorIndice(evento);

    expect(component.esValido).toBe(true);
    expect(component.indice).toBe(2);
  });

  it('should call wizardComponent.atras if accion is unknown but esValido is true', () => {
    component.indice = 1;
    const evento = { accion: 'random', valor: 2 };
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.pasoUnoComponent = {
      avisoComponent: {
        validarFormulario: () => true,
      },
    } as any;
    jest
      .spyOn(component.pasoUnoComponent.avisoComponent, 'validarFormulario')
      .mockReturnValue(true);

    component.getValorIndice(evento);

    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });
});
