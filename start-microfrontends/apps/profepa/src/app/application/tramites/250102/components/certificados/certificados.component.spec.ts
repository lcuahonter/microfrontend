import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificadosComponent } from './certificados.component';
import { TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CertificadosComponent', () => {
  let component: CertificadosComponent;
  let fixture: ComponentFixture<CertificadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificadosComponent],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Inicialización del componente', () => {
    it('debería inicializarse con los valores predeterminados correctos', () => {
      expect(component.tipoSeleccionTabla).toBeDefined();
      expect(component.configuracionTabla).toBeDefined();
      expect(component.permisosDatos).toEqual([]);
      expect(component.showAutorizacionesModal).toBe(false);
      expect(component.configuracionTablaCertificados).toBeDefined();
      expect(component.certificadosModalDatos).toEqual([]);
    });

    it('debería tener la configuración correcta para la tabla principal', () => {
      expect(component.configuracionTabla.length).toBeGreaterThan(0);
      expect(component.configuracionTabla[0].encabezado).toBe('Certificado');
      expect(component.configuracionTabla[1].encabezado).toBe('Fecha expedición');
      expect(component.configuracionTabla[2].encabezado).toBe('Tipo de movimiento');
    });

    it('debería tener la configuración correcta para la tabla del modal', () => {
      expect(component.configuracionTablaCertificados.length).toBe(1);
      expect(component.configuracionTablaCertificados[0].encabezado).toBe('Certificado');
    });
  });

  describe('Elementos de la interfaz de usuario', () => {
    it('debería renderizar el componente de título', () => {
      const ELEMENTO_TITULO = fixture.debugElement.query(By.directive(TituloComponent));
      expect(ELEMENTO_TITULO).toBeTruthy();
    });

    it('debería renderizar el componente de tabla', () => {
      const ELEMENTO_TABLA = fixture.debugElement.query(By.directive(TablaDinamicaComponent));
      expect(ELEMENTO_TABLA).toBeTruthy();
    });

    it('debería renderizar los botones de agregar y eliminar', () => {
      const BOTONES = fixture.debugElement.queryAll(By.css('button'));
      expect(BOTONES.length).toBe(4);
      expect(BOTONES[0].nativeElement.textContent.trim()).toBe('Eliminar');
      expect(BOTONES[1].nativeElement.textContent.trim()).toBe('Agregar');
    });
  });

  describe('Métodos del componente', () => {
    it('debería alternar la visibilidad del modal cuando se llama a cambiarCertificadosAutorizaciones', () => {
      expect(component.showAutorizacionesModal).toBe(false);
      component.cambiarCertificadosAutorizaciones();
      expect(component.showAutorizacionesModal).toBe(true);
      component.cambiarCertificadosAutorizaciones();
      expect(component.showAutorizacionesModal).toBe(false);
    });

    it('debería cerrar el modal cuando se llama a agregarCertificadosSeleccionados', () => {
      // Primero abrimos el modal
      component.showAutorizacionesModal = true;
      
      // Luego llamamos al método
      component.agregarCertificadosSeleccionados();
      
      // Verificamos que el modal esté cerrado
      expect(component.showAutorizacionesModal).toBe(false);
    });

    it('debería limpiar las suscripciones al destruir el componente', () => {
      // Creamos espías para los métodos next y complete del Subject
      const NEXT_SPY = jest.spyOn(component['destroy$'], 'next');
      const COMPLETE_SPY = jest.spyOn(component['destroy$'], 'complete');
      
      // Activamos ngOnDestroy
      component.ngOnDestroy();
      
      // Verificamos que next y complete fueron llamados
      expect(NEXT_SPY).toHaveBeenCalled();
      expect(COMPLETE_SPY).toHaveBeenCalled();
    });
  });

  describe('Interacciones del usuario', () => {
    it('debería abrir el modal cuando se hace clic en el botón agregar', () => {
      const BOTON_AGREGAR = fixture.debugElement.queryAll(By.css('button'))[1].nativeElement;
      
      expect(component.showAutorizacionesModal).toBe(false);
      BOTON_AGREGAR.click();
      expect(component.showAutorizacionesModal).toBe(true);
    });

    it('debería llamar a agregarCertificadosSeleccionados cuando se hace clic en el botón agregar del modal', () => {
      // Primero hacemos visible el modal
      component.showAutorizacionesModal = true;
      fixture.detectChanges();
      
      // Espiamos el método
      const ESPIA = jest.spyOn(component, 'agregarCertificadosSeleccionados');
      
      // Encontramos y hacemos clic en el botón agregar del modal
      const BOTON_AGREGAR_MODAL = fixture.debugElement.query(By.css('#registroDestinatarioBtn'));
      if (BOTON_AGREGAR_MODAL) {
        BOTON_AGREGAR_MODAL.nativeElement.click();
        expect(ESPIA).toHaveBeenCalled();
      }
    });

    it('debería llamar a cambiarCertificadosAutorizaciones cuando se hace clic en el botón cerrar del modal', () => {
      // Primero hacemos visible el modal
      component.showAutorizacionesModal = true;
      fixture.detectChanges();
      
      // Espiamos el método
      const ESPIA = jest.spyOn(component, 'cambiarCertificadosAutorizaciones');
      
      // Encontramos y hacemos clic en el botón cerrar del modal
      const BOTON_CERRAR_MODAL = fixture.debugElement.query(By.css('#limpiarDestinatarioBtn'));
      if (BOTON_CERRAR_MODAL) {
        BOTON_CERRAR_MODAL.nativeElement.click();
        expect(ESPIA).toHaveBeenCalled();
      }
    });
  });

  describe('Casos límite', () => {
    it('debería manejar arreglos de datos vacíos', () => {
      // Probamos con arreglos vacíos
      component.permisosDatos = [];
      component.certificadosModalDatos = [];
      fixture.detectChanges();
      
      // No debería lanzar errores
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('debería manejar múltiples llamadas a ngOnDestroy', () => {
      // Llamamos a ngOnDestroy múltiples veces
      component.ngOnDestroy();
      
      // No debería lanzar errores en llamadas subsecuentes
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});
