import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Modal } from 'bootstrap';
import { RegistroVehiculosComponent } from './registro-vehiculos.component';
import { createInitialState, Tramite30401Store } from '../../estados/tramites30401.store';
import { Tramite30401Query } from '../../estados/tramites30401.query';
import { RegistroEmpresasTransporteService } from '../../services/registro-empresas-transporte.service';

describe('RegistroVehiculosComponent', () => {
  let component: RegistroVehiculosComponent;
  let fixture: any;
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
      imports: [ReactiveFormsModule,RegistroVehiculosComponent],
      providers: [
        FormBuilder,
        { provide: Tramite30401Store, useValue: tramite30401StoreMock },
        { provide: Tramite30401Query, useValue: tramite30401QueryMock },
        { provide: RegistroEmpresasTransporteService, useValue: servicioMock },
      ],
    });

    fixture = TestBed.createComponent(RegistroVehiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario al crearlo', () => {
    expect(component.registroVehiculosForm).toBeDefined();
    expect(component.registroVehiculosForm.valid).toBeFalsy();
  });

  it('Debería llamar a obtenerDatosCatalogo durante la inicialización', () => {
    const spy = jest.spyOn(component, 'obtenerDatosCatalogo');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('Debe completar los datos del catálogo del servicio', () => {
    component.obtenerDatosCatalogo();
    expect(servicioMock.getEntidadesFederativas).toHaveBeenCalled();
    expect(servicioMock.getMunicipiosAlcaldias).toHaveBeenCalled();
    expect(servicioMock.getColonias).toHaveBeenCalled();
    expect(servicioMock.getAduanas).toHaveBeenCalled();
  });

  it('Debería reiniciar el formulario cuando se llama a limpiarFormulario', () => {
    component.registroVehiculosForm.patchValue({
      solicitud: { marca: 'Test' },
    });
    component.limpiarFormulario();
    expect(component.registroVehiculosForm.value.solicitud.marca).toBeNull();
  });

  it('debe agregar un nuevo vehículo a la lista cuando se llama a vehiculosInfoDatos', () => {
    component.registroVehiculosForm.patchValue({
      solicitud: { marca: 'Test', modelo: 'Model', idVehiculoSerie: '123', caja: 'Box' },
      direccionVehiculo: { calleVehiculo: 'Street', comboEntidadVehiculo: 1 },
      persona: { nombre: 'John', apellidoPaterno: 'Doe', correoElectronico: 'test@test.com' },
    });
    component.vehiculosInfoDatos();
    expect(component.registroVehiculosInfoList.length).toBe(1);
    expect(tramite30401StoreMock.establecerDatos).toHaveBeenCalled();
  });

  it('debe actualizar un vehículo existente cuando se llama a vehiculosInfoDatos con una fila seleccionada', () => {
    component.filaSeleccionadaVehiculos = { id: 1 } as any;
    component.registroVehiculosInfoList = [{ id: 1, solicitud: {} } as any];
    component.registroVehiculosForm.patchValue({
      solicitud: { marca: 'Updated' },
    });
    component.vehiculosInfoDatos();
    expect(component.registroVehiculosInfoList[0].solicitud.marca).toBe('Updated');
  });

  it('debe abrir el modal cuando se llama agregarDialogoDatos', () => {
    const modalSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
    component.registroDeVehiculosElemento = {
      nativeElement: document.createElement('div'),
    };
    component.agregarDialogoDatos();
    expect(modalSpy).toHaveBeenCalled();
  });

  it('debe cerrar el modal cuando se llama a cambiarEstadoModal', () => {
    const modalSpy = jest.spyOn(Modal.prototype, 'hide').mockImplementation(() => {});    
    component.registroDeVehiculosElemento = {
      nativeElement: document.createElement('div'),
    };
    jest.spyOn(Modal, 'getInstance').mockReturnValue({
      hide: modalSpy,
    } as any);
  
    component.cambiarEstadoModal();
    expect(modalSpy).toHaveBeenCalled();
  });

  

  it('Debe marcar todos los controles de formulario como tocados cuando se llama a enviarDialogData con un formulario no válido', () => {
    const markAllAsTouchedSpy = jest.spyOn(component.registroVehiculosForm, 'markAllAsTouched');
    component.enviarDialogData();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('debe agregar un nuevo vehículo y restablecer el formulario cuando se llama a enviarDialogData con un formulario válido', () => {
    component.registroVehiculosForm.patchValue({
      id: 1,
      solicitud: {
        marca: "Toyota",
        modelo: "Corolla",
        idVehiculoSerie: "ABC123XYZ",
        caja: "Automática"
      },
      direccionVehiculo: {
        calleVehiculo: "Av. Principal",
        numExteriorVehiculo: "123",
        numInteriorVehiculo: "A",
        comboEntidadVehiculo: '1', 
        comboDelegacionVehiculo: '2',
        comboColoniaVehiculo: '3',
        localidadVehiculo: "Ciudad Demo",
        codigoPostalVehiculo: "110001",
        comboAduanaVehiculo: '4'
      },
      persona: {
        nombre: "Juan",
        apellidoPaterno: "Pérez",
        apellidoMaterno: "Gómez",
        correoElectronico: "juan.perez@example.com",
        telefonoContacto: "+91 9876543210"
      }
    });
  
    component.enviarDialogData();
  
    expect(component.registroVehiculosInfoList.length).toBe(1);
    expect(component.registroVehiculosInfoList[0].solicitud.marca).toBe('Toyota');
  });

  it('Debe eliminar los vehículos seleccionados cuando se llama a eliminarVehiculosItem', () => {
    component.registroVehiculosInfoList = [
      { id: 1 } as any,
      { id: 2 } as any,
    ];
    component.listaFilaSeleccionadaVehiculos = [{ id: 1 } as any];
    component.eliminarVehiculosItem(true);
    expect(component.registroVehiculosInfoList.length).toBe(1);
    expect(component.registroVehiculosInfoList[0].id).toBe(2);
  });

  it('Se deben parchear los datos del formulario cuando se llama a patchModifyiedData', () => {
    component.filaSeleccionadaVehiculos = {
      solicitud: { marca: 'Test' },
      direccionVehiculo: { comboEntidadVehiculo: 'Entity' },
      persona: { nombre: 'John' },
    } as any;
    component.patchModifyiedData();
    expect(component.registroVehiculosForm.value.solicitud.marca).toBe('Test');
  });

  it('Debería manejar controles de formulario no válidos con es Invalido', () => {
    const controlName = 'solicitud.marca';
    component.registroVehiculosForm.get('solicitud.marca')?.setErrors({ required: true });
    component.registroVehiculosForm.get('solicitud.marca')?.markAsTouched();
    expect(component.esInvalido(controlName)).toBe(true);
  });

  it('debe llamar a actualizarFilaSeleccionada, agregarDialogoDatos y patchModifyiedData cuando listaFilaSeleccionadaVehiculos tenga exactamente un elemento', () => {
    component.listaFilaSeleccionadaVehiculos = [{ id: 1 } as any];
  
    const actualizarFilaSeleccionadaSpy = jest.spyOn(component, 'actualizarFilaSeleccionada').mockImplementation(() => {});
    const agregarDialogoDatosSpy = jest.spyOn(component, 'agregarDialogoDatos').mockImplementation(() => {});
    const patchModifyiedDataSpy = jest.spyOn(component, 'patchModifyiedData').mockImplementation(() => {});
  
    component.modificarItemVehiculos();
  
    expect(actualizarFilaSeleccionadaSpy).toHaveBeenCalled();
    expect(agregarDialogoDatosSpy).toHaveBeenCalled();
    expect(patchModifyiedDataSpy).toHaveBeenCalled();
  });
  
  it('Debería llamar a abrirMultipleSeleccionPopup cuando listaFilaSeleccionadaVehiculos esté vacía o tenga más de un elemento', () => {
    component.listaFilaSeleccionadaVehiculos = [];
    const abrirMultipleSeleccionPopupSpy = jest.spyOn(component, 'abrirMultipleSeleccionPopup').mockImplementation(() => {});
    component.modificarItemVehiculos();
    expect(abrirMultipleSeleccionPopupSpy).toHaveBeenCalled();
  
    component.listaFilaSeleccionadaVehiculos = [{ id: 1 } as any, { id: 2 } as any];
    component.modificarItemVehiculos();
    expect(abrirMultipleSeleccionPopupSpy).toHaveBeenCalledTimes(2);
  });

  it('Debería regresar temprano y no llamar para abrirElimninarConfirmationopup cuando listaFilaSeleccionadaVehiculos esté vacía', () => {
    component.listaFilaSeleccionadaVehiculos = [];
    const abrirElimninarConfirmationopupSpy = jest.spyOn(component, 'abrirElimninarConfirmationopup').mockImplementation(() => {});
    component.confirmEliminarVehiculosItem();
    expect(abrirElimninarConfirmationopupSpy).not.toHaveBeenCalled();
  });
  
  it('Debería llamar a abrirElimninarConfirmationopup cuando listaFilaSeleccionadaVehiculos tenga elementos', () => {
    component.listaFilaSeleccionadaVehiculos = [{ id: 1 } as any];
    const abrirElimninarConfirmationopupSpy = jest.spyOn(component, 'abrirElimninarConfirmationopup').mockImplementation(() => {});
    component.confirmEliminarVehiculosItem();
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
    expect(component.listaFilaSeleccionadaVehiculos).toStrictEqual([]); 
    expect(component.filaSeleccionadaVehiculos).toBeUndefined();
  });
  
  it('Debería actualizar listaFilaSeleccionadaVehiculos, filaSeleccionadaVehiculos y habilitar botones cuando fila tenga artículos', () => {
    const mockFila = [
      { id: 1, solicitud: { marca: 'Toyota' } } as any,
      { id: 2, solicitud: { marca: 'Honda' } } as any,
    ];
  
    component.manejarFilaSeleccionada(mockFila);
  
    expect(component.listaFilaSeleccionadaVehiculos).toEqual(mockFila);
    expect(component.filaSeleccionadaVehiculos).toEqual(mockFila[mockFila.length - 1]);
    expect(component.enableModficarBoton).toBe(true);
    expect(component.enableEliminarBoton).toBe(true);
  });

});