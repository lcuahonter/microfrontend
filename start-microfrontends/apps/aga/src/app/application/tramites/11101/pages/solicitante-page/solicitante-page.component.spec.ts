import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { SolicitantePageComponent } from './solicitante-page.component';
import { Tramite11101Query } from '../../estados/tramite11101.query';
import { Tramite11101Store } from '../../estados/tramite11101.store';

@Injectable()
class MockTramite11101Store {
  establecerSeccion = jest.fn();
  establecerFormaValida = jest.fn();
}
fdescribe('SolicitantePageComponent', () => {
  let fixture: ComponentFixture<SolicitantePageComponent>;
  let component: SolicitantePageComponent;
  let Tramite11101QueryMock: jest.Mocked<Tramite11101Query>;
  let tramite11101StoreMock: Tramite11101Store;

  beforeEach(async () => {
    Tramite11101QueryMock = {
      selectSeccionState$: jest.fn().mockReturnValue(
        observableOf({
          pasos: [],
          currentStep: 1,
        })
      ),
    } as unknown as jest.Mocked<Tramite11101Query>;
    tramite11101StoreMock = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn(),
    } as unknown as Tramite11101Store;
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        SolicitantePageComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Tramite11101Query, useValue: Tramite11101QueryMock },
        { provide: Tramite11101Store, useValue: tramite11101StoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    jest.clearAllMocks();
  });

  /**
   * Verifica que el componente se haya creado correctamente.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verifica que el método `getValorIndice` se llame y active la navegación del asistente.
   */
  it('should call getValorIndice() and trigger wizard navigation', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();

    component.getValorIndice({ valor: 1, accion: 'prev' });
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });
});
