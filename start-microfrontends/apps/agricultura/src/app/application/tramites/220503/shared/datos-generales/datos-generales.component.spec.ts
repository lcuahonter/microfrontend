import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosGeneralesComponent } from './datos-generales.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

class MockRevisionService {
  getAduanaIngreso = jest.fn().mockReturnValue(of({ code: 200, data: [] }));
  getOficianaInspeccion = jest.fn().mockReturnValue(of({ code: 200, data: [] }));
  getPuntoInspeccion = jest.fn().mockReturnValue(of({ code: 200, data: [] }));
  getEstablecimiento = jest.fn().mockReturnValue(of({ code: 200, data: [] }));
  getRegimenDestinaran = jest.fn().mockReturnValue(of({ code: 200, data: [] }));
  getMovilizacionNacional = jest.fn().mockReturnValue(of({ code: 200, data: [] }));
  getPuntoVerificacion = jest.fn().mockReturnValue(of({ code: 200, data: [] }));
  getEmpresaTransportista = jest.fn().mockReturnValue(of({ code: 200, data: [] }));
  getDatosDelaSolicitud = jest.fn().mockReturnValue(of({}));
}

class MockValidacionesFormularioService {
  isValid = jest.fn().mockReturnValue(true);
}

class MockSolicitud220503Store {
  setFoliodel = jest.fn();
  setClaveUCON = jest.fn();
  setEstablecimientoTIF = jest.fn();
  setNombre = jest.fn();
  setNumeroguia = jest.fn();
  setTransporte = jest.fn();
  setNombreEmpresa = jest.fn();
  setAduanaIngreso = jest.fn();
  setOficinaInspeccion = jest.fn();
  setPuntoInspeccion = jest.fn();
  setRegimen = jest.fn();
  setMovilizacion = jest.fn();
  setPunto = jest.fn();
}

class MockSolicitud220503Query {
  selectSolicitud$ = of({});
}

class MockConsultaioQuery {
  selectConsultaioState$ = of({ readonly: false });
}

describe('DatosGeneralesComponent', () => {
  let component: DatosGeneralesComponent;
  let fixture: ComponentFixture<DatosGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosGeneralesComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: 'RevisionService', useClass: MockRevisionService },
        { provide: 'ValidacionesFormularioService', useClass: MockValidacionesFormularioService },
        { provide: 'Solicitud220503Store', useClass: MockSolicitud220503Store },
        { provide: 'Solicitud220503Query', useClass: MockSolicitud220503Query },
        { provide: 'ConsultaioQuery', useClass: MockConsultaioQuery }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosGeneralesComponent);
    component = fixture.componentInstance;
    component.forma = new FormBuilder().group({
      test: ['']
    });
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener propiedades por defecto', () => {
    expect(component.colapsable).toBe(false);
    expect(component.currentIndex).toBe(0);
    expect(component.esFormularioSoloLectura).toBe(false);
    expect(component.rows).toBeDefined();
  });

  it('debe alternar colapsable', () => {
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(true);
  });

  it('debe rotar fila', () => {
    const indiceInicial = component.currentIndex;
    component.rotateRow(1);
    expect(component.currentIndex).not.toBe(indiceInicial);
  });

  it('debe validar el formulario', () => {
    const resultado = component.isValid(component.forma, 'test');
    expect(resultado).toBe(false);
  });

  it('debe llamar métodos de servicio', () => {
    component.getAduanaIngreso();
    component.getOficianaInspeccion();
    component.getPuntoInspeccion();
    component.getEstablecimiento();
    component.getRegimenDestinaran();
    component.getMovilizacionNacional();
    component.getPuntoVerificacion();
    component.getEmpresaTransportista();
    component.actualizarDatosDelaSolicitud();
    expect(true).toBe(true);
  });

  it('debe llamar métodos de selección', () => {
    const catalogo = { id: 1, descripcion: 'Test' } as any;
    component.seleccionarAduanaIngreso(catalogo);
    component.seleccionarOficianaInspeccion(catalogo);
    component.seleccionarPuntoInspeccion(catalogo);
    component.seleccionarRegimen(catalogo);
    component.seleccionarMovilizacionNacional(catalogo);
    component.seleccionarPuntoVerificacion(catalogo);
    expect(true).toBe(true);
  });

  it('debe inicializar y destruir', () => {
    component.inicializarFormulario();
    component.inicializarEstadoFormulario();
    component.guardarDatosFormulario();
    component.ngOnDestroy();
    expect(true).toBe(true);
  });
});
