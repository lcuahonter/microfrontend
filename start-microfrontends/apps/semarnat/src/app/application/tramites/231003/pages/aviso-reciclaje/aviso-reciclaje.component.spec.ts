import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoReciclajeComponent } from './aviso-reciclaje.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WizardComponent, AccionBoton } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AvisoReciclajeComponent', () => {
  let component: AvisoReciclajeComponent;
  let fixture: ComponentFixture<AvisoReciclajeComponent>;
  let mockWizardComponent: WizardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvisoReciclajeComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Ignores <app-wizard> or similar in HTML
      imports: [
        // Import HttpClientTestingModule to provide HttpClient and _HttpClient
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoReciclajeComponent);
    component = fixture.componentInstance;

    // Force trigger change detection so ngOnInit runs
    fixture.detectChanges();

    mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    component.wizardComponent = mockWizardComponent;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a wizardComponent.siguiente() si la acción es "cont"', () => {
    const evento: AccionBoton = { accion: 'cont', valor: 2 };

    component.getValorIndice(evento);

    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    expect(component.indice).toBe(2);
  });

  it('debería llamar a wizardComponent.atras() si la acción no es "cont"', () => {
    const evento: AccionBoton = { accion: 'back', valor: 3 };

    component.getValorIndice(evento);

    expect(mockWizardComponent.atras).toHaveBeenCalled();
    expect(component.indice).toBe(3);
  });

  it('no debería hacer nada si el valor está fuera del rango válido', () => {
    const evento: AccionBoton = { accion: 'cont', valor: 6 };

    component.getValorIndice(evento);

    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
    expect(component.indice).toBe(1); // valor inicial
  });
});
