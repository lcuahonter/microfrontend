import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoPagesComponent } from './paso-uno-pages.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasoUnoPagesComponent', () => {
  let componente: PasoUnoPagesComponent;
  let fixture: ComponentFixture<PasoUnoPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoPagesComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        require('@angular/common/http/testing').HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoPagesComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería tener el índice inicial en 1', () => {
    expect(componente.indice).toBe(1);
  });

  it('debería actualizar el índice al llamar seleccionaTab', () => {
    const NUEVO_INDICE = 3;
    componente.seleccionaTab(NUEVO_INDICE);
    expect(componente.indice).toBe(NUEVO_INDICE);
  });

  it('debería retornar los valores esperados en collectFormValues con todos los hijos', () => {
    // Mock SolicitanteComponent
    componente.solicitante = { form: { value: { nombre: 'Juan' } } } as any;

    // Mock DatosDelSolicitudModificacionComponent
    componente.datosSolicitudComponents = {
      length: 1,
      toArray: () => [
        {
          domicilioEstablecimiento: { value: { calle: 'A' } },
          scianForm: { value: { codigo: '123' } },
          solicitudEstablecimientoForm: { value: { nombre: 'Est' } },
          formMercancias: { value: { producto: 'P' } }
        }
      ]
    } as any;

    // Mock TercerosRelacionadosFabSeccionComponent
    componente.tercerosRelacionadosComponents = {
      length: 1,
      toArray: () => [
        {
          agregarFacturadorFormGroup: { value: { nombre: 'Facturador' } },
          agregarFabricanteFormGroup: { value: { nombre: 'Fabricante' } },
          agregarDestinatarioFormGroup: { value: { nombre: 'Destinatario' } },
          agregarProveedorFormGroup: { value: { nombre: 'Proveedor' } }
        }
      ]
    } as any;

    // Mock PagoDeDerechosEntradaComponent
    componente.pagoDeDerechosEntradaComponent = {
      length: 1,
      toArray: () => [
        { pagoDerechos: { value: { monto: 100 } } }
      ]
    } as any;

    // Mock TramitesAsociadosSeccionComponent
    componente.tramitesAsociadosSeccionComponent = {
      length: 1,
      toArray: () => [
        { acuseTablaDatos: [{ tramite: 'T1' }] }
      ]
    } as any;

    const resultado = componente.collectFormValues();
    expect(resultado).toEqual({
      solicitante: { nombre: 'Juan' },
      datosSolicitud: [{
        domicilioEstablecimiento: { calle: 'A' },
        scianForm: { codigo: '123' },
        solicitudEstablecimientoForm: { nombre: 'Est' },
        formMercancias: { producto: 'P' }
      }],
      tercerosRelacionados: [{
        facturador: { nombre: 'Facturador' },
        fabricante: { nombre: 'Fabricante' },
        destinatario: { nombre: 'Destinatario' },
        proveedor: { nombre: 'Proveedor' }
      }],
      pagoDeDerechos: [{ monto: 100 }],
      tramitesAsociados: [{ tramite: 'T1' }]
    });
  });

  it('debería retornar valores vacíos en collectFormValues si no hay hijos', () => {
    componente.solicitante = undefined as any;
    componente.datosSolicitudComponents = { length: 0, toArray: () => [] } as any;
    componente.tercerosRelacionadosComponents = { length: 0, toArray: () => [] } as any;
    componente.pagoDeDerechosEntradaComponent = { length: 0, toArray: () => [] } as any;
    componente.tramitesAsociadosSeccionComponent = { length: 0, toArray: () => [] } as any;

    const resultado = componente.collectFormValues();
    expect(resultado).toEqual({
      solicitante: undefined,
      datosSolicitud: [],
      tercerosRelacionados: [],
      pagoDeDerechos: [],
      tramitesAsociados: []
    });
  });

  it('debería destruir el componente y completar el notifier', () => {
    const spyNext = jest.spyOn((componente as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((componente as any).destroyNotifier$, 'complete');
    componente.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});