import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoPagesComponent } from './paso-uno-pages.component';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

describe('PasoUnoPagesComponent', () => {
  let component: PasoUnoPagesComponent;
  let fixture: ComponentFixture<PasoUnoPagesComponent>;

  // Dummy components for ViewChild/ViewChildren
  @Component({ selector: 'lib-solicitante', template: '' })
  class MockSolicitanteComponent {
    form = new FormGroup({
      nombre: new FormControl('Juan Perez')
    });
  }

  @Component({ selector: 'app-datos-del-solicitud-modificacion', template: '' })
  class MockDatosDelSolicitudModificacionComponent {
    domicilioEstablecimiento = new FormGroup({ calle: new FormControl('Av Reforma') });
    scianForm = new FormGroup({ actividad: new FormControl('Industria') });
    solicitudEstablecimientoForm = new FormGroup({ nombre: new FormControl('Establecimiento X') });
    formMercancias = new FormGroup({ tipo: new FormControl('Medicamento') });
  }

  @Component({ selector: 'app-terceros-relacionados-fab-seccion', template: '' })
  class MockTercerosRelacionadosComponent {
    agregarFacturadorFormGroup = new FormGroup({ nombre: new FormControl('Facturador A') });
    agregarFabricanteFormGroup = new FormGroup({ nombre: new FormControl('Fabricante B') });
    agregarDestinatarioFormGroup = new FormGroup({ nombre: new FormControl('Destinatario C') });
    agregarProveedorFormGroup = new FormGroup({ nombre: new FormControl('Proveedor D') });
  }

  @Component({ selector: 'app-pago-de-derechos-entrada', template: '' })
  class MockPagoDeDerechosComponent {
    pagoDerechos = new FormGroup({ monto: new FormControl(1000) });
  }

  @Component({ selector: 'app-tramites-asociados-seccion', template: '' })
  class MockTramitesAsociadosComponent {
    acuseTablaDatos = [{ tramiteId: 1, nombre: 'Trámite X' }];
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        PasoUnoPagesComponent,
        MockSolicitanteComponent,
        MockDatosDelSolicitudModificacionComponent,
        MockTercerosRelacionadosComponent,
        MockPagoDeDerechosComponent,
        MockTramitesAsociadosComponent
      ],
      providers: [
        provideHttpClient() // Mocked HTTP client
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoPagesComponent);
    component = fixture.componentInstance;

    // Injecting mocked children
    const solicitanteComponent = new MockSolicitanteComponent();

    component.solicitante = solicitanteComponent as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
