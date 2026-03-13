import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcuseResolucionComponent } from './acuse.component';
import { AlertComponent } from '../alert/alert.component';
import { ActivatedRoute, Router } from '@angular/router';

import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DocumentoService } from '../../..';

describe('Componente AcuseResolucionComponent', () => {
  let componente: AcuseResolucionComponent;
  let fixture: ComponentFixture<AcuseResolucionComponent>;
  let servicioDocumentoMock: any;
  let routerMock: any;

  beforeAll(() => {
    // Mock para URL.createObjectURL que no existe en Jest/Node
    global.URL.createObjectURL = jest.fn(() => 'url-mockeada');
  });

  beforeEach(async () => {
    servicioDocumentoMock = {
      generarDoc: jest.fn().mockReturnValue(of({ datos: { llave_archivo: 'abc123' } })),
      getVisualizarDoc: jest.fn().mockReturnValue(of({
        datos: {
          nombre_archivo: 'doc.pdf',
          contenido: btoa('Contenido PDF'),
        }
      }))
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, AlertComponent, AcuseResolucionComponent],
      providers: [
        { provide: DocumentoService, useValue: servicioDocumentoMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AcuseResolucionComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('debería actualizar txtAlerta si cambia', () => {
      const cambios = {
        txtAlerta: { currentValue: 'nuevo texto', previousValue: '', firstChange: false, isFirstChange: () => false }
      };
      componente.ngOnChanges(cambios as any);
      expect(componente.txtAlerta).toBe('nuevo texto');
    });

    it('debería llamar a generarYMostrarDocumentos si cambia idSolicitud', () => {
      jest.spyOn(componente, 'generarYMostrarDocumentos');
      const cambios = {
        idSolicitud: { currentValue: 123, previousValue: 0, firstChange: false, isFirstChange: () => false }
      };
      componente.ngOnChanges(cambios as any);
      expect(componente.generarYMostrarDocumentos).toHaveBeenCalled();
    });
  });

  describe('generarYMostrarDocumentos', () => {
    it('debería llamar al servicio y actualizar datosTablaAcuse si tiene éxito', () => {
      componente.idSolicitud = 123;
      componente.generarYMostrarDocumentos();

      expect(servicioDocumentoMock.generarDoc).toHaveBeenCalled();
      expect(servicioDocumentoMock.getVisualizarDoc).toHaveBeenCalledWith('abc123');

      fixture.whenStable().then(() => {
        expect(componente.datosTablaAcuse.length).toBe(1);
        expect(componente.datosTablaAcuse[0].documento).toBe('doc.pdf');
        expect(componente.datosTablaAcuse[0].urlPdf).toBe('url-mockeada');
      });
    });

    it('debería manejar error si generarDoc falla', (done) => {
      servicioDocumentoMock.generarDoc.mockReturnValueOnce(throwError(() => new Error('error')));
      componente.idSolicitud = 123;
      componente.generarYMostrarDocumentos();

      fixture.whenStable().then(() => {
        expect(componente.datosTablaAcuse.length).toBe(0);
        done();
      });
    });
  });

  describe('crearUrlPdf', () => {
    it('debería crear una URL válida de tipo blob PDF', () => {
      const base64 = btoa('contenido de prueba');
      const url = AcuseResolucionComponent.crearUrlPdf(base64);
      expect(url).toBe('url-mockeada');
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('verPdf', () => {
    it('debería abrir una nueva pestaña con la URL del PDF', () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
      componente.verPdf('http://test.pdf');
      expect(openSpy).toHaveBeenCalledWith('http://test.pdf', '_blank');
      openSpy.mockRestore();
    });
  });

  describe('salir', () => {
    it('debería redirigir a /seleccion-tramite', () => {
      componente.salir();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/seleccion-tramite']);
    });
  });
});
