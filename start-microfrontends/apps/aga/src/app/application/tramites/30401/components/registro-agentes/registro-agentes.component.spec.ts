import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RegistroAgentesComponent } from './registro-agentes.component';
import { createInitialState, Tramite30401Store } from '../../estados/tramites30401.store';
import { Tramite30401Query } from '../../estados/tramites30401.query';
import { RegistroEmpresasTransporteService } from '../../services/registro-empresas-transporte.service';
import { of } from 'rxjs';
import { Modal } from 'bootstrap';

describe('RegistroAgentesComponent', () => {
  let fixture: ComponentFixture<RegistroAgentesComponent>;
  let component: RegistroAgentesComponent;
  let tramite30401StoreMock: Partial<Tramite30401Store>;
  let tramite30401QueryMock: Partial<Tramite30401Query>;
  let servicioMock: Partial<RegistroEmpresasTransporteService>;

  beforeEach(() => {
    tramite30401StoreMock = {
       establecerDatos: jest.fn(),
    };

    tramite30401QueryMock = {
      selectTramite30401$: of({
        ...createInitialState(),
      }),
    };

    servicioMock = {
      getEntidadesFederativas: jest.fn().mockReturnValue(of([])),
      getMunicipiosAlcaldias: jest.fn().mockReturnValue(of([])),
      getColonias: jest.fn().mockReturnValue(of([])),
      getAduanas: jest.fn().mockReturnValue(of([])),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegistroAgentesComponent],
      providers: [
        FormBuilder,
        { provide: Tramite30401Store, useValue: tramite30401StoreMock },
        { provide: Tramite30401Query, useValue: tramite30401QueryMock },
        { provide: RegistroEmpresasTransporteService, useValue: servicioMock },
      ],
    });

    fixture = TestBed.createComponent(RegistroAgentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario al crearlo', () => {
    expect(component.formularioAgentesAduanales).toBeDefined();
    expect(component.formularioAgentesAduanales.valid).toBeFalsy();
  });

  it('Debería reiniciar el formulario cuando se llama a limpiarFormulario', () => {
    component.formularioAgentesAduanales.patchValue({
      primerApellido: 'Test',
    });
    component.limpiarFormulario();
    expect(component.formularioAgentesAduanales.value.primerApellido).toBeNull();
  });

  it('debe agregar un nuevo agente a la lista cuando se llama a agentesInfoDatos', () => {
    component.formularioAgentesAduanales.patchValue({
      nombreAgente: 'John',
      primerApellido: 'Doe',
      segundoApellido: 'Smith',
      patente: '12345',
    });
    component.agentesInfoDatos();
    expect(component.agentesInfoList.length).toBe(1);
    expect(tramite30401StoreMock.establecerDatos).toHaveBeenCalled();
  });

  it('debe actualizar un agente existente cuando se llama a AgentesInfoDatos con una fila seleccionada', () => {
    component.filaSeleccionadaAgentes = { id: 1 } as any;
    component.agentesInfoList = [{ id: 1, primerApellido: 'Old' } as any];
    component.formularioAgentesAduanales.patchValue({
      primerApellido: 'Updated',
    });
    component.agentesInfoDatos();
    expect(component.agentesInfoList[0].primerApellido).toBe('Updated');
  });

  it('debe abrir el modal cuando se llama agregarDialogoDatos', () => {
    const modalSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
    component.registroDeAgentesElemento = {
      nativeElement: document.createElement('div'),
    };
    component.agregarDialogoDatos();
    expect(modalSpy).toHaveBeenCalled();
  });

  it('debe cerrar el modal cuando se llama a cambiarEstadoModal', () => {
    const modalSpy = jest.spyOn(Modal.prototype, 'hide').mockImplementation(() => {});
    component.registroDeAgentesElemento = {
      nativeElement: document.createElement('div'),
    };
    jest.spyOn(Modal, 'getInstance').mockReturnValue({
      hide: modalSpy,
    } as any);
    component.cambiarEstadoModal();
    expect(modalSpy).toHaveBeenCalled();
  });

  it('Debe marcar todos los controles de formulario como tocados cuando se llama a enviarDialogData con un formulario no válido', () => {
    const markAllAsTouchedSpy = jest.spyOn(component.formularioAgentesAduanales, 'markAllAsTouched');
    component.enviarDialogData();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('Se debe agregar un nuevo agente y restablecer el formulario cuando se llama a enviarDialogData con un formulario válido', () => {
    component.formularioAgentesAduanales.patchValue({
      nombreAgente: 'John',
      primerApellido: 'Doe',
      segundoApellido: 'Smith',
      patente: '12345',
    });
    component.enviarDialogData();
    expect(component.agentesInfoList.length).toBe(1);
    expect(component.agentesInfoList[0].primerApellido).toBe('Doe');
  });

  it('Debe eliminar los agentes seleccionados cuando se llama a eliminarAgentesItem', () => {
    component.agentesInfoList = [
      { id: 1 } as any,
      { id: 2 } as any,
    ];
    component.listaFilaSeleccionadaAgentes = [{ id: 1 } as any];
    component.eliminarAgentesItem(true);
    expect(component.agentesInfoList.length).toBe(1);
    expect(component.agentesInfoList[0].id).toBe(2);
  });

  it('Se deben parchear los datos del formulario cuando se llama a patchModifyiedData', () => {
    component.filaSeleccionadaAgentes = {
      nombreAgente: 'John',
      primerApellido: 'Doe',
      segundoApellido: 'Smith',
      patente: '12345',
    } as any;
    component.patchModifyiedData();
    expect(component.formularioAgentesAduanales.value.primerApellido).toBe('Doe');
  });

  it('Debería manejar controles de formulario no válidos con esInvalido', () => {
    const controlName = 'primerApellido';
    component.formularioAgentesAduanales.get(controlName)?.setErrors({ required: true });
    component.formularioAgentesAduanales.get(controlName)?.markAsTouched();
    expect(component.esInvalido(controlName)).toBe(true);
  });

  it('Debe llamar a abrirMultipleSeleccionPopup cuando listaFilaSeleccionadaAgentes esté vacía o tenga más de un elemento', () => {
    component.listaFilaSeleccionadaAgentes = [];
    const abrirMultipleSeleccionPopupSpy = jest.spyOn(component, 'abrirMultipleSeleccionPopup').mockImplementation(() => {});
    component.modificarItemAgentes();
    expect(abrirMultipleSeleccionPopupSpy).toHaveBeenCalled();

    component.listaFilaSeleccionadaAgentes = [{ id: 1 } as any, { id: 2 } as any];
    component.modificarItemAgentes();
    expect(abrirMultipleSeleccionPopupSpy).toHaveBeenCalledTimes(2);
  });

  it('Debería regresar temprano y no llamar a abrirElimninarConfirmationopup cuando listaFilaSeleccionadaAgentes esté vacía', () => {
    component.listaFilaSeleccionadaAgentes = [];
    const abrirElimninarConfirmationopupSpy = jest.spyOn(component, 'abrirElimninarConfirmationopup').mockImplementation(() => {});
    component.confirmEliminarAgentesItem();
    expect(abrirElimninarConfirmationopupSpy).not.toHaveBeenCalled();
  });

  it('Debería llamar a abrirElimninarConfirmationopup cuando listaFilaSeleccionadaAgentes tenga elementos', () => {
    component.listaFilaSeleccionadaAgentes = [{ id: 1 } as any];
    const abrirElimninarConfirmationopupSpy = jest.spyOn(component, 'abrirElimninarConfirmationopup').mockImplementation(() => {});
    component.confirmEliminarAgentesItem();
    expect(abrirElimninarConfirmationopupSpy).toHaveBeenCalled();
  });

  it('debe establecer multipleSeleccionPopupAbierto y multipleSeleccionPopupCerrado en falso cuando se llama a cerrarMultipleSeleccionPopup', () => {
    component.multipleSeleccionPopupAbierto = true;
    component.multipleSeleccionPopupCerrado = true;
    component.cerrarMultipleSeleccionPopup();
    expect(component.multipleSeleccionPopupAbierto).toBe(false);
    expect(component.multipleSeleccionPopupCerrado).toBe(false);
  });

  it('Debería desactivar los botones y regresar antes cuando Fila esté vacío', () => {
    component.manejarFilaSeleccionada([]);
    expect(component.enableModficarBoton).toBe(false);
    expect(component.enableEliminarBoton).toBe(false);
    expect(component.listaFilaSeleccionadaAgentes).toStrictEqual([]);
    expect(component.filaSeleccionadaAgentes).toBeUndefined();
  });

  it('Debería actualizar listaFilaSeleccionadaAgentes, filaSeleccionadaAgentes y habilitar botones cuando fila tenga artículos', () => {
    const mockFila = [
      { id: 1, nombreAgente: 'John', primerApellido: 'Doe' } as any,
      { id: 2, nombreAgente: 'Jane', primerApellido: 'Smith' } as any,
    ];
    component.manejarFilaSeleccionada(mockFila);
    expect(component.listaFilaSeleccionadaAgentes).toEqual(mockFila);
    expect(component.filaSeleccionadaAgentes).toEqual(mockFila[mockFila.length - 1]);
    expect(component.enableModficarBoton).toBe(true);
    expect(component.enableEliminarBoton).toBe(true);
  });
});