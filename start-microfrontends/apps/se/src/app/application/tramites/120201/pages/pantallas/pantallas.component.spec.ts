import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import {
  BtnContinuarComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
  const mockToastr = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  }
describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallasComponent],
      imports: [WizardComponent, BtnContinuarComponent,HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: ToastrService, useValue: mockToastr }]
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update the indice and navigate wizard on getValorIndice call', () => {
    const mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent =
      mockWizardComponent as unknown as WizardComponent;

    component.datos = {
      expedicionCertificadosAsignacionDirectaComponent: {
        validarFormulario: jest.fn().mockReturnValue(true),
      },
    } as any;

    component.esValido = true;
    component.indice = 1;

    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(1);

    component.getValorIndice({ accion: 'back', valor: 1 });
    expect(component.indice).toBe(1);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  it('should set esValido to true and mostrarError to event value', () => {
    component.mostrarErrorDirectoEvento(true);
    expect(component.esValido).toBe(true);
    expect(component.mostrarError).toBe(true);

    component.mostrarErrorDirectoEvento(false);
    expect(component.mostrarError).toBe(false);
  });

  it('should set esValido to true, mostrarError to false, mostrarNumFolioAsignacionError to event value, and update error message', () => {
    const event = { mostrarError: true, valor: 'XYZ123' };

    component.mostrarNumFolioAsignacionErrorEvento(event);

    expect(component.esValido).toBe(true);
    expect(component.mostrarError).toBe(false);
    expect(component.mostrarNumFolioAsignacionError).toBe(true);
  });

  it('should set esValido to true and mostrarAgregarError to event value', () => {
    component.mostrarAgregarErrorEvento(true);
    expect(component.esValido).toBe(true);
    expect(component.mostrarAgregarError).toBe(true);

    component.mostrarAgregarErrorEvento(false);
    expect(component.mostrarAgregarError).toBe(false);
  });
});
