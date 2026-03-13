import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SolicitudPageComponent } from './solicitud-page.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let wizardMock: jest.Mocked<WizardComponent>;

  beforeEach(async () => {
    wizardMock = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as jest.Mocked<WizardComponent>;

    await TestBed.configureTestingModule({
      
      imports: [
        WizardComponent,
        ReactiveFormsModule,
        HttpClientModule
      ],
      declarations: [SolicitudPageComponent,PasoUnoComponent,
        PasoDosComponent,
        PasoTresComponent],
      providers: [{ provide: WizardComponent, useValue: wizardMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.wizardComponent = wizardMock;
  });
  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('no debería actualizar el índice para valores de pestaña inválidos', () => {
    component.seleccionaTab(1);
  });
});