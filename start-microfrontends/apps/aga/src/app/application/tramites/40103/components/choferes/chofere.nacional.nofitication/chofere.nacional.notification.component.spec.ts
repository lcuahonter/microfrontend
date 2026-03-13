import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ChofereNacionalNotificationComponent } from './chofere.nacional.notification.component';
import {
  CategoriaMensaje,
  Notificacion,
  NotificacionesComponent,
  TipoNotificacionEnum
} from '@libs/shared/data-access-user/src';

@Component({
  selector: 'lib-notificaciones',
  template: '<div>Mock NotificacionesComponent</div>',
  inputs: ['notificacion'],
  standalone: true,
  imports: [NotificacionesComponent]
})
class MockNotificacionesComponent {
  notificacion!: Notificacion;
}

@Component({
  template: `
    <app-chofere-nacional-notification 
      [mensaje]="testMensaje">
    </app-chofere-nacional-notification>
  `
})
class TestHostComponent {
  testMensaje: string = 'Test message';
}

describe('ChofereNacionalNotificationComponent', () => {
  let component: ChofereNacionalNotificationComponent;
  let fixture: ComponentFixture<ChofereNacionalNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChofereNacionalNotificationComponent, NotificacionesComponent],
      declarations: [TestHostComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(ChofereNacionalNotificationComponent, {
        remove: { imports: [NotificacionesComponent] },
        add: { imports: [MockNotificacionesComponent] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ChofereNacionalNotificationComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
  jest.clearAllMocks();
  fixture.destroy();
  });

  describe('Component Initialization', () => {

    it('should be a standalone component', () => {
      expect(component).toBeInstanceOf(ChofereNacionalNotificationComponent);
    });
  });

  describe('@Input mensaje property', () => {
    it('should accept mensaje input property', () => {
      const testMessage = 'This is a test notification message';
      component.mensaje = testMessage;

      expect(component.mensaje).toBe(testMessage);
    });
  });

  describe('alertaNotificacion property initialization', () => {
    beforeEach(() => {
      component.mensaje = 'Test initialization message';
    });

    it('should initialize alertaNotificacion with correct default values', () => {
      expect(component.alertaNotificacion).toBeDefined();
      expect(component.alertaNotificacion.tipoNotificacion).toBe(TipoNotificacionEnum.BANNER);
      expect(component.alertaNotificacion.categoria).toBe(CategoriaMensaje.INFORMACION);
      expect(component.alertaNotificacion.modo).toBe('');
      expect(component.alertaNotificacion.titulo).toBe('');
      expect(component.alertaNotificacion.cerrar).toBe(true);
      expect(component.alertaNotificacion.txtBtnAceptar).toBe('');
      expect(component.alertaNotificacion.txtBtnCancelar).toBe('');
    });

    it('should handle mensaje being undefined during initialization', () => {
      const newFixture = TestBed.createComponent(ChofereNacionalNotificationComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.alertaNotificacion).toBeDefined();
      expect(newComponent.alertaNotificacion.tipoNotificacion).toBe(TipoNotificacionEnum.BANNER);
    });

    it('should maintain immutable reference to alertaNotificacion object', () => {
      const originalNotificacion = component.alertaNotificacion;
      component.ngOnInit();
      expect(component.alertaNotificacion).toBe(originalNotificacion);
    });
  });

  describe('ngOnInit lifecycle method', () => {
    it('should update alertaNotificacion.mensaje with current mensaje value', () => {
      const testMessage = 'Updated message in ngOnInit';
      component.mensaje = testMessage;

      component.ngOnInit();

      expect(component.alertaNotificacion.mensaje).toBe(testMessage);
    });

    it('should override initial mensaje value in alertaNotificacion', () => {
      const initialMessage = 'Initial message';
      const updatedMessage = 'Updated message';

      component.mensaje = initialMessage;
      const initialAlertMessage = component.alertaNotificacion.mensaje;

      component.mensaje = updatedMessage;
      component.ngOnInit();

      expect(component.alertaNotificacion.mensaje).toBe(updatedMessage);
      expect(component.alertaNotificacion.mensaje).not.toBe(initialAlertMessage);
    });

    it('should handle empty string mensaje in ngOnInit', () => {
      component.mensaje = '';
      component.ngOnInit();

      expect(component.alertaNotificacion.mensaje).toBe('');
    });

    it('should handle null mensaje in ngOnInit', () => {
      component.mensaje = null as any;
      component.ngOnInit();

      expect(component.alertaNotificacion.mensaje).toBeNull();
    });

    it('should handle undefined mensaje in ngOnInit', () => {
      component.mensaje = undefined as any;
      component.ngOnInit();

      expect(component.alertaNotificacion.mensaje).toBeUndefined();
    });

    it('should handle multiple calls to ngOnInit', () => {
      component.mensaje = 'First message';
      component.ngOnInit();
      expect(component.alertaNotificacion.mensaje).toBe('First message');

      component.mensaje = 'Second message';
      component.ngOnInit();
      expect(component.alertaNotificacion.mensaje).toBe('Second message');

      component.mensaje = 'Third message';
      component.ngOnInit();
      expect(component.alertaNotificacion.mensaje).toBe('Third message');
    });

    it('should not modify other alertaNotificacion properties', () => {
      const originalTipoNotificacion = component.alertaNotificacion.tipoNotificacion;
      const originalCategoria = component.alertaNotificacion.categoria;
      const originalCerrar = component.alertaNotificacion.cerrar;

      component.mensaje = 'Test message';
      component.ngOnInit();

      expect(component.alertaNotificacion.tipoNotificacion).toBe(originalTipoNotificacion);
      expect(component.alertaNotificacion.categoria).toBe(originalCategoria);
      expect(component.alertaNotificacion.cerrar).toBe(originalCerrar);
    });
  });

  describe('Edge Cases and Error Handling', () => {

    it('should handle rapid input changes', () => {
      const messages = Array.from({ length: 100 }, (_, i) => `Message ${i}`);

      messages.forEach(message => {
        component.mensaje = message;
        component.ngOnInit();
        expect(component.alertaNotificacion.mensaje).toBe(message);
      });
    });

    it('should handle very large mensaje strings', () => {
      const largeMensaje = 'x'.repeat(10000);
      component.mensaje = largeMensaje;
      component.ngOnInit();

      expect(component.alertaNotificacion.mensaje).toBe(largeMensaje);
      expect(component.alertaNotificacion.mensaje.length).toBe(10000);
    });

    it('should handle objeto-like strings in mensaje', () => {
      const objectString = '{"key": "value", "number": 123}';
      component.mensaje = objectString;
      component.ngOnInit();

      expect(component.alertaNotificacion.mensaje).toBe(objectString);
    });

    it('should maintain alertaNotificacion object integrity', () => {
      component.mensaje = 'Test message';
      const originalKeys = Object.keys(component.alertaNotificacion);

      component.ngOnInit();
      const afterInitKeys = Object.keys(component.alertaNotificacion);

      expect(afterInitKeys).toEqual(originalKeys);
      expect(component.alertaNotificacion).toHaveProperty('tipoNotificacion');
      expect(component.alertaNotificacion).toHaveProperty('categoria');
      expect(component.alertaNotificacion).toHaveProperty('mensaje');
    });
  });

  describe('Enum and Constants Verification', () => {
    it('should use correct TipoNotificacionEnum value', () => {
      expect(component.alertaNotificacion.tipoNotificacion).toBe(TipoNotificacionEnum.BANNER);
    });

    it('should use correct CategoriaMensaje value', () => {
      expect(component.alertaNotificacion.categoria).toBe(CategoriaMensaje.INFORMACION);
    });

    it('should have boolean cerrar property set to true', () => {
      expect(component.alertaNotificacion.cerrar).toBe(true);
      expect(typeof component.alertaNotificacion.cerrar).toBe('boolean');
    });

    it('should have empty string properties initialized correctly', () => {
      expect(component.alertaNotificacion.modo).toBe('');
      expect(component.alertaNotificacion.titulo).toBe('');
      expect(component.alertaNotificacion.txtBtnAceptar).toBe('');
      expect(component.alertaNotificacion.txtBtnCancelar).toBe('');
    });
  });
});