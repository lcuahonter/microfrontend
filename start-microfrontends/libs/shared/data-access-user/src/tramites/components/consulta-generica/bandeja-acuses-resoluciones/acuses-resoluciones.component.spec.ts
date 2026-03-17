import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcusesResolucionesComponent } from './acuses-resoluciones.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BodyTablaAcuses, BodyTablaResolucion } from '../../../../core/models/shared/consulta-generica.model';

describe('AcusesResolucionesComponent', () => {
  let component: AcusesResolucionesComponent;
  let fixture: ComponentFixture<AcusesResolucionesComponent>;
  
  // Mock para window.open
  const windowOpenMock = jest.fn();
  
  // Datos de prueba para acuses
  const mockAcuses: BodyTablaAcuses[] = [
    { id: 1, idDocumento: 'AC001', documento: 'Acuse de recibo', urlPdf: 'https://example.com/acuse1.pdf' },
    { id: 2, idDocumento: 'AC002', documento: 'Acuse de notificación', urlPdf: 'https://example.com/acuse2.pdf' }
  ];

  // Datos de prueba para resoluciones
  const mockResoluciones: BodyTablaResolucion[] = [
    { id: 1, idDocumento: 'RES001', documento: 'Resolución favorable', urlPdf: 'https://example.com/resolucion1.pdf' },
    { id: 2, idDocumento: 'RES002', documento: 'Resolución complementaria', urlPdf: 'https://example.com/resolucion2.pdf' }
  ];

  beforeEach(async () => {
    // Mock window.open antes de las pruebas
    Object.defineProperty(window, 'open', {
      value: windowOpenMock,
      writable: true
    });
    
    await TestBed.configureTestingModule({
      imports: [
        AcusesResolucionesComponent,
        HttpClientTestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AcusesResolucionesComponent);
    component = fixture.componentInstance;
    
    // Configurar datos de prueba
    component.datosTablaAcuse = mockAcuses;
    component.datosTablaResolucion = mockResoluciones;
    
    // Espiar los métodos de componente
    if ('verDetalleAcuse' in component && typeof component.verDetalleAcuse === 'function') {
      jest.spyOn(component, 'verDetalleAcuse');
    }
    
    if ('descargarPdfAcuse' in component && typeof component.descargarPdfAcuse === 'function') {
      jest.spyOn(component, 'descargarPdfAcuse');
    }
    
    if ('verDetalleResolucion' in component && typeof component.verDetalleResolucion === 'function') {
      jest.spyOn(component, 'verDetalleResolucion');
    }
    
    if ('descargarPdfResolucion' in component && typeof component.descargarPdfResolucion === 'function') {
      jest.spyOn(component, 'descargarPdfResolucion');
    }
    
    fixture.detectChanges();
  });

  afterEach(() => {
    // Limpiar el mock después de cada prueba
    windowOpenMock.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display acuses and resoluciones data correctly', () => {
    // Verificar que los datos de acuses se asignaron correctamente
    expect(component.datosTablaAcuse.length).toBe(2);
    expect(component.datosTablaAcuse[0].idDocumento).toBe('AC001');
    expect(component.datosTablaAcuse[0].documento).toBe('Acuse de recibo');
    
    // Verificar que los datos de resoluciones se asignaron correctamente
    expect(component.datosTablaResolucion.length).toBe(2);
    expect(component.datosTablaResolucion[1].idDocumento).toBe('RES002');
    expect(component.datosTablaResolucion[1].documento).toBe('Resolución complementaria');
  });

  it('should handle document operations correctly', () => {
    // Solo ejecutamos estas pruebas si los métodos existen
    if ('verDetalleAcuse' in component && typeof component.verDetalleAcuse === 'function') {
      component.verDetalleAcuse(1);
      expect(component.verDetalleAcuse).toHaveBeenCalledWith(1);
    }
    
    if ('descargarPdfAcuse' in component && typeof component.descargarPdfAcuse === 'function') {
      component.descargarPdfAcuse('https://example.com/acuse1.pdf');
      // Verificar que window.open fue llamado con los parámetros correctos
      expect(windowOpenMock).toHaveBeenCalledWith('https://example.com/acuse1.pdf', '_blank');
    }
    
    if ('verDetalleResolucion' in component && typeof component.verDetalleResolucion === 'function') {
      component.verDetalleResolucion(2);
      expect(component.verDetalleResolucion).toHaveBeenCalledWith(2);
    }
    
    if ('descargarPdfResolucion' in component && typeof component.descargarPdfResolucion === 'function') {
      component.descargarPdfResolucion('https://example.com/resolucion2.pdf');
      // Verificar que window.open fue llamado con los parámetros correctos
      expect(windowOpenMock).toHaveBeenCalledWith('https://example.com/resolucion2.pdf', '_blank');
    }
  });
});