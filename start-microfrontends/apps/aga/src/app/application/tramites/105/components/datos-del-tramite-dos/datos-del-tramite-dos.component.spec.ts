import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelTramiteDosComponent } from './datos-del-tramite-dos.component';
import { InvoCarService } from '../../services/invocar.service';
import { Tramite105Store } from '../../estados/tramite105.store';
import { Tramite105Query } from '../../estados/tramite105.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';

describe('DatosDelTramiteDosComponent', () => {
  let component: DatosDelTramiteDosComponent;
  let fixture: ComponentFixture<DatosDelTramiteDosComponent>;
  let mockInvoCarService: any;
  let mockStore: any;
  let mockQuery: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockInvoCarService = {
    getPais: jest.fn().mockReturnValue(of({ code: 200, data: [] }))
  };
    mockStore = {};
    mockQuery = {
      selectSolicitud$: of({
        procedimientoCargaDescarga: 'proc',
        sistemasMedicionUbicacion: 'sist',
        motivoNoDespachoAduana: 'motivo',
        operaciones: 'op'
      })
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false, update: false })
    };

   await TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, DatosDelTramiteDosComponent],
    declarations: [],
    providers: [
      { provide: InvoCarService, useValue: mockInvoCarService },
      { provide: Tramite105Store, useValue: mockStore },
      { provide: Tramite105Query, useValue: mockQuery },
      { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
    ]
  }).compileComponents();

    fixture = TestBed.createComponent(DatosDelTramiteDosComponent);
    component = fixture.componentInstance;

    // MOCKEA LA PROPIEDAD ANTES DE detectChanges
    (component as any).getMercanciaTableData = {
      mercanciaTabledos: {
        tableHeader: ['Columna 1', 'Columna 2'],
        tableBody: []
      }
    };

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener las operaciones correctamente', () => {
    const mockResponse = { code: 200, data: [{ id: 1, nombre: 'Operación 1' }] };
    mockInvoCarService.getPais.mockReturnValue(of(mockResponse));
    component.getOperaciones();
    expect(mockInvoCarService.getPais).toHaveBeenCalled();
    expect(component.operaciones).toEqual(mockResponse.data);
  });

  it('debería inicializar los formularios correctamente', () => {
    component.crearFormularios();
    expect(component.datosDelTramiteDos).toBeDefined();
    expect(component.agenteForm).toBeDefined();
    expect(component.datosDelTramiteDos.valid).toBe(true);
    expect(component.agenteForm.valid).toBe(false);
  });

  it('debería agregar mercancías si el formulario es válido', () => {
    component.crearFormularios();
    component.agenteForm.setValue({
      nombres: 'Juan',
      primerApellido: 'Pérez',
      segundoApellido: 'López',
      numeroPatente: '1234'
    });
    // Espía el método cerrarModal
    const cerrarModalSpy = jest.spyOn(component, 'cerrarModal');
    component.agregarMercancias();
    expect(component.getMercanciaTableData.mercanciaTabledos.tableBody.length).toBeGreaterThan(0);
    expect(cerrarModalSpy).toHaveBeenCalled();
  });

  it('no debería agregar mercancías si el formulario NO es válido', () => {
    component.crearFormularios();
    component.agenteForm.setValue({
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      numeroPatente: ''
    });
    const cerrarModalSpy = jest.spyOn(component, 'cerrarModal');
    component.agregarMercancias();
    expect(component.getMercanciaTableData.mercanciaTabledos.tableBody.length).toBe(0);
    expect(cerrarModalSpy).not.toHaveBeenCalled();
  });

  it('debería abrir el modal correctamente', () => {
    component.abrirModal();
    expect(component.modal).toBe('show');
  });

  it('debería cerrar el modal correctamente si existe closeModal', () => {
    component.closeModal = { nativeElement: { click: jest.fn() } } as any;
    component.cerrarModal();
    expect(component.closeModal.nativeElement.click).toHaveBeenCalled();
  });

  it('debería obtener los datos de mercancía y asignar el header', () => {
    component.obtenerMercancia();
    expect(component.mercanciaHeaderData).toEqual(component.getMercanciaTableData.mercanciaTabledos.tableHeader);
  });

  it('debería limpiar el Subject y el modal al destruir el componente', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.modal = 'show';
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
    expect(component.modal).toBe('modal');
  });
   it('debería obtener el encabezado de la tabla de mercancías', () => {
  (component as any).getMercanciaTableData = {
    mercanciaTabledos: {
      tableHeader: ['Columna 1', 'Columna 2'],
      tableBody: []
    }
  };
  component.obtenerMercancia();
  expect(component.mercanciaHeaderData).toEqual(['Columna 1', 'Columna 2']);
});
});