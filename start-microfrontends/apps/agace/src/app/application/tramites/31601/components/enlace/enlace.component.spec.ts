import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { EnlaceComponent } from './enlace.component';
import { TituloComponent, TablaDinamicaComponent, ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite31601Store } from '../../../../estados/tramites/tramite31601.store';
import { Tramite31601Query } from '../../../../estados/queries/tramite31601.query';

jest.mock('@libs/shared/theme/assets/json/31601/enlace.json', () => ({
  __esModule: true,
  default: {
    tableHeader: ['Col1', 'Col2'],
    tableBody: [{ Col1: 'A', Col2: 'B' }]
  }
}));

jest.mock('@libs/shared/theme/assets/json/31601/enlace-data.json', () => ({
  __esModule: true,
  default: {
    resigtro: '123', rfc: 'RFC123', nombre: 'Nombre', apellidoPaterno: 'ApellidoP',
    apellidoMaterno: 'ApellidoM', cuidad: 'Ciudad', cargo: 'Cargo',
    telefono: '55555555', correo: 'correo@mail.com'
  }
}));

jest.mock('@libs/shared/theme/assets/json/31601/represtantante-data.json', () => ({
  __esModule: true,
  default: {
    nombre: 'John', apellidoPaterno: 'Doe', apellidoMaterno: 'Smith',
    telefono: '1234567890', correo: 'john@mail.com', cuidad: 'CDMX'
  }
}));

describe('EnlaceComponent', () => {
  let component: EnlaceComponent;
  let fixture: ComponentFixture<EnlaceComponent>;

  const mockStore = {
    setEnlaceTablaDatos: jest.fn()
  };

  const mockQuery = {
    selectSolicitud$: of({ enlaceDatos: [], suplente: false }),
    selectConsultaioState$: of({ readonly: false })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        EnlaceComponent,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        TituloComponent,
        TablaDinamicaComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite31601Store, useValue: mockStore },
        { provide: Tramite31601Query, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EnlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    expect(component.represtantante).toBeDefined();
    expect(component.represtantante.controls['rfcReprestantante']).toBeDefined();
  });

  it('should open modal and reset form', () => {
    component.abrirModal();
    expect(component.modal).toBe('show');
    expect(component.represtantante.get('suplente')?.value).toBe(false);
  });

  it('should handle row selection', () => {
    const fila = [{ id: '1' }, { id: '2' }] as any[];
    component.manejarFilaSeleccionada(fila);
    expect(component.enableModficarBoton).toBe(true);
    expect(component.enableEliminarBoton).toBe(true);
    expect(component.filaSeleccionadaEnlace.id).toBe('2');
  });

  it('should open eliminar confirmation popup if row selected', () => {
    component.listaFilaSeleccionadaEnlace = [{ id: '1' }] as any;
    component.confirmEliminarEnlaceItem();
    expect(component.confirmEliminarPopupAbierto).toBe(true);
  });

  it('should not open eliminar confirmation popup if no row selected', () => {
    component.listaFilaSeleccionadaEnlace = [];
    component.confirmEliminarEnlaceItem();
    expect(component.confirmEliminarPopupAbierto).toBe(false);
  });

  it('should add new enlace item on save', () => {
    component.represtantante.patchValue({
      resigtroReprestantante: 'R1', rfcReprestantante: 'RFC1', nombreReprestante: 'N1',
      apellidoPaterno: 'P1', apellidoMaterno: 'M1', cargo: 'C1', cuidad: 'CDMX',
      telefonoReprestantante: '1234', correoReprestantante: 'a@mail.com', suplente: false
    });
    component.saveDatos();
    expect(mockStore.setEnlaceTablaDatos).toHaveBeenCalled();
    expect(component.datosTablaEnlace.length).toBeGreaterThan(0);
  });

  it('should openBuscar and patch form values', () => {
    component.represtantante.get('resigtroReprestantante')?.setValue('RFC123');
    component.openBuscar();
    expect(component.represtantante.get('rfcReprestantante')?.value).toBe('RFC123');
    expect(component.represtantante.get('nombreReprestante')?.value).toBeDefined();
  }); 

  it('should open popup if multiple selected on modificar', () => {
    component.listaFilaSeleccionadaEnlace = [{ id: '1' }, { id: '2' }] as any;
    component.enableModficarBoton = true;
    component.modificarItemEnlace();
    expect(component.multipleSeleccionPopupAbierto).toBe(true);
  });
it('should close multiple selection popup', () => {
  component.multipleSeleccionPopupAbierto = true;
  component.multipleSeleccionPopupCerrado = true;

  component.cerrarMultipleSeleccionPopup();

  expect(component.multipleSeleccionPopupAbierto).toBe(false);
  expect(component.multipleSeleccionPopupCerrado).toBe(false);
});
it('should open eliminar confirmation popup', () => {
  component.confirmEliminarPopupAbierto = false;

  component.abrirElimninarConfirmationopup();

  expect(component.confirmEliminarPopupAbierto).toBe(true);
});
it('should close the multiple selection popup', () => {
  component.multipleSeleccionPopupAbierto = true;
  component.multipleSeleccionPopupCerrado = true;

  component.cerrarMultipleSeleccionPopup();

  expect(component.multipleSeleccionPopupAbierto).toBe(false);
  expect(component.multipleSeleccionPopupCerrado).toBe(false);
});
it('should open the eliminar confirmation popup', () => {
  component.confirmEliminarPopupAbierto = false;

  component.abrirElimninarConfirmationopup();

  expect(component.confirmEliminarPopupAbierto).toBe(true);
});
it('should close the eliminar confirmation popup', () => {
  component.confirmEliminarPopupAbierto = true;
  component.confirmEliminarPopupCerrado = true;

  component.cerrarEliminarConfirmationPopup();

  expect(component.confirmEliminarPopupAbierto).toBe(false);
  expect(component.confirmEliminarPopupCerrado).toBe(false);
});
it('should close the eliminar confirmation popup', () => {
  component.confirmEliminarPopupAbierto = true;
  component.confirmEliminarPopupCerrado = true;
  component.cerrarEliminarConfirmationPopup();  
  expect(component.confirmEliminarPopupAbierto).toBe(false);
  expect(component.confirmEliminarPopupCerrado).toBe(false);
});
});
