/* eslint-disable @typescript-eslint/no-empty-function */
// @ts-nocheck
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { PasoTresComponent } from './paso-tres.component';
import { Router, RouterModule } from '@angular/router';
import { TestBed } from '@angular/core/testing';

/**
 * @class MockRouter
 * @description Clase simulada (mock) del Router de Angular utilizada para las pruebas unitarias.
 * Proporciona una implementación vacía del método navigate para evitar dependencias reales del router.
 */
class MockRouter {
  /**
   * @method navigate
   * @description Método simulado para la navegación entre rutas.
   * No realiza ninguna acción real, solo cumple con la interfaz del Router.
   * @returns {void}
   */
  navigate(): void {}
}

/**
 * @description Suite de pruebas unitarias para el componente PasoTresComponent.
 * Este conjunto de pruebas verifica el correcto funcionamiento del tercer paso
 * del trámite IMMEX, incluyendo la inicialización del componente y sus dependencias.
 */
describe('PasoTresComponent', () => {
  /**
   * @property {any} fixture
   * @description Fixture del componente que proporciona acceso al DOM y a la instancia del componente.
   * Utilizado para ejecutar la detección de cambios y acceder a elementos del template.
   */
  let fixture;
  
  /**
   * @property {PasoTresComponent} component
   * @description Instancia del componente PasoTresComponent bajo prueba.
   * Contiene todas las propiedades y métodos del componente que serán probados.
   */
  let component: PasoTresComponent;
  
  /**
   * @property {Router} router
   * @description Instancia del servicio Router inyectado en las pruebas.
   * Se utiliza para verificar la navegación y las interacciones con el routing.
   */
  let router: Router;

  /**
   * @method beforeEach
   * @description Configuración que se ejecuta antes de cada prueba individual.
   * Configura el módulo de pruebas con todas las dependencias necesarias,
   * crea la instancia del componente y prepara el entorno de testing.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ToastrModule, RouterModule],
      declarations: [PasoTresComponent], // Added component declaration
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useClass: MockRouter },
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  /**
   * @test should create the component
   * @description Prueba básica que verifica que el componente se crea correctamente.
   * Esta prueba es fundamental para asegurar que todas las dependencias están
   * configuradas apropiadamente y que el componente puede ser instanciado sin errores.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
