import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { CommonModule } from '@angular/common';
import { TEXTOS } from '@ng-mf/data-access-user';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core'; // Import Component and Input

// Define proper standalone mock components
@Component({ selector: 'ng-titulo', template: '', standalone: true }) // <--- Add standalone: true
class MockTituloComponent {
  @Input() titulo: string | undefined;
}

@Component({ selector: 'ng-alert', template: '', standalone: true }) // <--- Add standalone: true
class MockAlertComponent {
  @Input() CONTENIDO: string | undefined;
}

@Component({ selector: 'anexar-documentos', template: '', standalone: true }) // <--- Add standalone: true
class MockAnexarDocumentosComponent {}

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importar el componente standalone bajo prueba para que TestBed lo conozca
      imports: [
        PasoDosComponent,
        (await import('@angular/common/http/testing')).HttpClientTestingModule // <-- Import HttpClientTestingModule here
      ],
      providers: [
        // Mock or provide all services that PasoDosComponent depends on
        {
          provide: (await import('@angular/common/http')).HttpClient,
          useValue: {
            get: async () => (await import('rxjs')).of({}),
            post: async () => (await import('rxjs')).of({}),
            put: async () => (await import('rxjs')).of({}),
            delete: async () => (await import('rxjs')).of({}),
          }
        }
        // Add other providers as needed, e.g., any custom services injected in PasoDosComponent
      ]
    })
      .overrideComponent(PasoDosComponent, {
        set: {
          imports: [
            CommonModule,
            MockAnexarDocumentosComponent,
            MockAlertComponent,
            MockTituloComponent,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the "Requisitos opcionales" title', () => {
    const tituloDebugElement = fixture.debugElement.query(
      By.directive(MockTituloComponent)
    );
    expect(tituloDebugElement).toBeTruthy();
    const mockTituloInstance =
      tituloDebugElement.injector.get(MockTituloComponent);
    expect(mockTituloInstance.titulo).toBe('Requisitos opcionales');
  });

  it('should pass the correct text to the alert component', () => {
    const alertDebugElement = fixture.debugElement.query(
      By.directive(MockAlertComponent)
    );
    expect(alertDebugElement).toBeTruthy();
    const mockAlertInstance =
      alertDebugElement.injector.get(MockAlertComponent);
    expect(mockAlertInstance.CONTENIDO).toEqual(TEXTOS.INSTRUCCIONES);
  });

  it('should render the anexar-documentos component', () => {
    const anexarDocumentosDebugElement = fixture.debugElement.query(
      By.directive(MockAnexarDocumentosComponent)
    );
    expect(anexarDocumentosDebugElement).toBeTruthy();
  });

  it('should initialize TEXTOS property correctly', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
  });
});
