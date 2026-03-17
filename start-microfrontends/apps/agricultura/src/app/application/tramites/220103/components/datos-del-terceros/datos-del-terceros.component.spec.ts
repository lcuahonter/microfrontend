import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelTercerosComponent } from './datos-del-terceros.component';
import { Tramite220103Query } from '../../estados/queries/tramites220103.query';
import { of } from 'rxjs';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Component({ selector: 'app-tabla-dinamica', template: '' })
class MockTablaDinamicaComponent {
  @Input() configuracionTabla: any;
  @Input() datos: any;
  @Input() tipoSeleccionTabla: any;
  @Output() listaDeFilaSeleccionada = new EventEmitter<any>();
}

@Component({ selector: 'app-agregar-destinatario', template: '' })
class MockAgregarDestinatarioComponent {
  @Input() esModoInstalacion?: boolean;
}

@Component({ selector: 'ng-titulo', template: '' })
class MockNgTitulo {
  @Input() titulo: string = '';
}

@Component({ selector: 'ng-alert', template: '' })
class MockNgAlert {
  @Input() CONTENIDO: any;
}

describe('DatosDelTercerosComponent', () => {
  let component: DatosDelTercerosComponent;
  let fixture: ComponentFixture<DatosDelTercerosComponent>;
  let TRAMITE_QUERY_MOCK: Partial<Tramite220103Query>;

  const MOCK_DESTINATARIO = {
    nombre: 'Juan Pérez',
    primerApellido: 'Pérez',
    segundoApellido: 'García',
    razonSocial: 'Empresa X',
    telefono: '1234567890',
    correoElectronico: 'juan.perez@example.com',
    direccion: 'Calle Falsa 123',
    codigoPostal: '54321',
    ciudad: 'Ciudad Y',
    estado: 'Estado Y',
    pais: 'Pais Y',
    tipoPersona: 'Física',
    rfc: 'RFC123456789',
    curp: 'CURP123456789',
    lada: '123',
    calle: 'Calle Principal',
    numeroExterior: '456',
    numeroInterior: 'B',
    municipioAlcaldia: 'Municipio Z',
    colonia: 'Colonia Z',
  };

  const MOCK_INSTALACION = {
    nombre: 'Planta Industrial X',
    primerApellido: 'Apellido1',
    segundoApellido: 'Apellido2',
    telefono: '1234567890',
    correoElectronico: 'example@example.com',
    direccion: 'Direccion X',
    codigoPostal: '12345',
    ciudad: 'Ciudad X',
    estado: 'Estado X',
    pais: 'Pais X',
    tipoInstalacion: 'Tipo X',
    capacidad: '1000',
    unidadMedida: 'kg',
    calle: 'Calle X',
    numeroExterior: '123',
    numeroInterior: 'A',
    municipio: 'Municipio X',
    referencia: 'Referencia X',
    colonia: 'Colonia X',
    lada: '123',
  };

  beforeEach(async () => {
    TRAMITE_QUERY_MOCK = {
      selectTramite220103State$: of({
        tablaDestinatario: [MOCK_DESTINATARIO],
        tablaInstalacion: [MOCK_INSTALACION],
      }),
    };

    await TestBed.configureTestingModule({
      imports: [
        DatosDelTercerosComponent,
        HttpClientTestingModule,
      ],
      declarations: [
        MockTablaDinamicaComponent,
        MockAgregarDestinatarioComponent,
        MockNgTitulo,
        MockNgAlert,
      ],
      providers: [
        { provide: Tramite220103Query, useValue: TRAMITE_QUERY_MOCK },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelTercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar los datos del estado en las tablas', () => {
    expect(component.datosTabla.length).toBe(1);
    expect(component.datosTablaInstalacion.length).toBe(1);
    expect(component.datosTabla[0].nombre).toBe('Juan Pérez');
    expect(component.datosTablaInstalacion[0].nombre).toBe('Planta Industrial X');
  });

  it('debe actualizar la lista de destinatarios seleccionados', () => {
    const seleccionados = [component.datosTabla[0]];
    component.obtenerDestinatarioSeleccionadas(seleccionados);
    expect(component.destinatariosSeleccionados).toEqual(seleccionados);
  });

  it('debe actualizar la lista de instalaciones seleccionadas', () => {
    const seleccionados = [component.datosTablaInstalacion[0]];
    component.obtenerInstalaciSeleccionadas(seleccionados);
    expect(component.instalacionesSeleccionadas).toEqual(seleccionados);
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    const spyNext = jest.spyOn(component['notificadorDestruccion$'], 'next');
    const spyComplete = jest.spyOn(component['notificadorDestruccion$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});