// domicilio.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomicilloComponent } from './domicillo.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Tramite260211Store } from '../../../../estados/tramites/tramite260211.store';
import { Tramite260211Query } from '../../../../estados/queries/tramite260211.query';
import { SanitarioService } from '../../services/sanitario.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';


describe('DomicilloComponent', () => {
  let component: DomicilloComponent;
  let fixture: ComponentFixture<DomicilloComponent>;

  const mockTramite260211Store = {
    setLicenciaSanitaria: jest.fn(),
  } as unknown as Tramite260211Store;

  const mockTramite260211Query = {
    selectSolicitud$: of({ codigoPostal: '12345' }),
  } as unknown as Tramite260211Query;

  const mockSanitarioService = {
    obtenerEstadoList: jest.fn().mockReturnValue(of({ data: [] })),
    obtenerTablaDatos: jest.fn().mockReturnValue(of({ datos: [] })),
    obtenerMercanciasDatos: jest.fn().mockReturnValue(of({ datos: [] })),
  } as unknown as SanitarioService;

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false }),
  } as unknown as ConsultaioQuery;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, DomicilloComponent],
      providers: [
        { provide: Tramite260211Store, useValue: mockTramite260211Store },
        { provide: Tramite260211Query, useValue: mockTramite260211Query },
        { provide: SanitarioService, useValue: mockSanitarioService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe deshabilitar licenciaSanitaria cuando el checkbox está marcado', () => {
    const form = component['domicilio'];
    form.get('licenciaSanitaria')?.setValue('123');
    const checkboxEvent = { target: { checked: true } } as unknown as Event;
    component.onAvisoCheckboxChange(checkboxEvent, form, 'licenciaSanitaria', 'setLicenciaSanitaria');
    expect(form.get('licenciaSanitaria')?.disabled).toBe(true);
  });

  it('debe habilitar licenciaSanitaria cuando el checkbox no está marcado', () => {
    const form = component['domicilio'];
    form.get('licenciaSanitaria')?.disable();
    const checkboxEvent = { target: { checked: false } } as unknown as Event;
    component.onAvisoCheckboxChange(checkboxEvent, form, 'licenciaSanitaria', 'setLicenciaSanitaria');
    expect(form.get('licenciaSanitaria')?.enabled).toBe(true);
  });

  it('debe agregar fila SCIAN si el formulario es válido', () => {
    component.estado = [{ id: 1, descripcion: 'Test' }] as any;
    component.formAgente.get('claveScianModal')?.setValue('1');
    component.formAgente.get('claveDescripcionModal')?.setValue('1');
    component.agregarFilaScian();
    expect(component.nicoTablaDatos.length).toBeGreaterThan(0);
  });

  it('debe limpiar el formulario de agente', () => {
    component.formAgente.get('claveScianModal')?.setValue('value');
    component.limpiarFormAgente();
    expect(component.formAgente.get('claveScianModal')?.value).toBe("");
  });

   it('debe actualizar fechaCaducidad y marcarla como untouched', () => {
    // Prepara el control de la fecha
    const control = component.formMercancias.get('fechaCaducidad');
    control?.markAsTouched();
    expect(control?.touched).toBe(true); // Asegura que inicialmente está "touched"

    // Llama al método
    const nuevaFecha = '2025-12-31';
    component.cambioFechaFinal(nuevaFecha);

    // Verifica que el valor se estableció y se marcó como "untouched"
    expect(control?.value).toBe(nuevaFecha);
    expect(control?.touched).toBe(false);
  });
    it('debe alternar el estado colapsable de la primera sección', () => {
    component.colapsable = false;
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(true);

    component.mostrar_colapsable();
    expect(component.colapsable).toBe(false);
  });

  it('debe alternar el estado colapsable de la segunda sección', () => {
    component.colapsableDos = false;
    component.mostrar_colapsableDos();
    expect(component.colapsableDos).toBe(true);

    component.mostrar_colapsableDos();
    expect(component.colapsableDos).toBe(false);
  });

  it('debe alternar el estado colapsable de la tercera sección', () => {
    component.colapsableTres = false;
    component.mostrar_colapsableTres();
    expect(component.colapsableTres).toBe(true);

    component.mostrar_colapsableTres();
    expect(component.colapsableTres).toBe(false);
  });
it('debe limpiar el formulario de mercancías', () => {
  component.formMercancias.get('denominacionEspecifica')?.setValue('Test');
  component.formMercancias.get('cantidadUMC')?.setValue('10');

  component.limpiarForm();

  expect(component.formMercancias.get('denominacionEspecifica')?.value).toBeNull();
  expect(component.formMercancias.get('cantidadUMC')?.value).toBeNull();
});
it('debe deshabilitar los formularios cuando esFormularioSoloLectura es true', () => {
  component['esFormularioSoloLectura'] = true;

  component.guardarDatosFormulario();

  expect(component.domicilio.disabled).toBe(true);
  expect(component.formAgente.disabled).toBe(true);
  expect(component.formMercancias.disabled).toBe(true);
});
it('debe habilitar los formularios cuando esFormularioSoloLectura es false', () => {
  component['esFormularioSoloLectura'] = false;

  component.guardarDatosFormulario();

  expect(component.domicilio.enabled).toBe(true);
  expect(component.formAgente.enabled).toBe(true);
  expect(component.formMercancias.enabled).toBe(true);
});
it('debe editar una mercancía existente si editMercanciaIndex no es null', () => {
  const original = {
    numeroRegistro: '123',
    denominacionEspecifica: 'Nuevo'
  } as any;

  component.mercanciasTablaDatos = [original];
  component.editMercanciaIndex = 0;

  component.formMercancias.patchValue({
    numeroRegistro: '123',
    denominacionEspecifica: 'Nuevo',
    clasificacion: 1,
    especificar: 1,
  });

  component.estado = [{ id: 1, descripcion: 'Test' }] as any;

  component.agregarFilaMercancia();

  expect(component.mercanciasTablaDatos[0].denominacionEspecifica).toBe('Nuevo');
  expect(component.editMercanciaIndex).toBe(0);
  expect(component.selectedRowsEvent.length).toBe(0);
});
it('debe establecer el índice de edición y rellenar el formulario si se selecciona una fila', () => {
 const selectedRow = {
  numeroRegistro: 'M001',
  clasificacion: '1',
  especificar: '1',
  denominacionEspecifica: 'Medicamento A',
  denominacionDistintiva: 'Distintiva A',
  denominacionComun: 'Comun A',
  formaFarmaceutica: 'Tableta',
  estadoFisico: 'Sólido',
  fraccionArancelaria: '30049099',
  descripcionFraccion: 'Fracción genérica',
  cantidadUMC: '100',
  unidad: 'mg',
  cantidadUMT: '10',
  unidadUMT: 'caja',
  presentacion: 'Caja con 10 tabletas',
  paisDeOrigen: 'México',
  paisDeProcedencia: 'México',
  tipoProducto: 'Medicamento',
  usoEspecifico: 'Tratamiento de fiebre',
  fechaCaducidad: '2026-12-31'
};
  component.mercanciasTablaDatos = [selectedRow];
  component.selectedRowsEvent = [selectedRow];

  component.modificarMercancia();

  expect(component.editMercanciaIndex).toBe(0);
  expect(component.formMercancias.get('numeroRegistro')?.value).toBe('M001');
  expect(component.formMercancias.get('denominacionEspecifica')?.value).toBe('Medicamento A');
});
it('debe eliminar las filas seleccionadas de mercancías', () => {
  const rowX = { id: 'x' };
  const rowY = { id: 'y' };

  component.mercanciasTablaDatos = [rowX, rowY] as any;
  component.selectedRowsEvent = [rowX]; 

  component.eliminarMercanciaSeleccionados();

  expect(component.mercanciasTablaDatos).toEqual([rowY]);
  expect(component.selectedRowsEvent).toEqual([]);
});

it('debe actualizar selectedRows con la selección proporcionada', () => {
  const seleccion = [{ id: 1 }, { id: 2 }];

  component.onSeleccionChange(seleccion);

  expect(component.selectedRows).toEqual(seleccion);
});
it('debe establecer noSeleccionado en false cuando hay exactamente un elemento seleccionado', () => {
  const selected = [{ id: 1 }];
  component.onSeleccionChangeEvent(selected);
  expect(component.selectedRowsEvent).toEqual(selected);
  expect(component.noSeleccionado).toBe(false);
});

it('debe establecer noSeleccionado en true cuando hay cero o más de un elemento seleccionado', () => {
  const selected = [{ id: 1 }, { id: 2 }];
  component.onSeleccionChangeEvent(selected);
  expect(component.selectedRowsEvent).toEqual(selected);
  expect(component.noSeleccionado).toBe(true);
});
});
