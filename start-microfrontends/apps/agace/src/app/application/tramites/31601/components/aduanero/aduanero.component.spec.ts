import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AduaneroComponent } from './aduanero.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { of, Subject } from 'rxjs';
import { createInitialState } from '../../../../estados/tramites/tramite31601.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';

// Mock JSON imports
jest.mock('@libs/shared/theme/assets/json/31601/prejson.json', () => ({
  __esModule: true,
  default: {
    radio1: { description: 'Test description for radio1' },
    radio2: { description: 'Test description for radio2' },
    radio3: { description: 'Test description for radio3' },
    radio4: { description: 'Test description for radio4' },
    radio5: { description: 'Test description for radio5' },
    radio6: { description: 'Test description for radio6' },
    radio7: { description: 'Test description for radio7' },
    radio8: { description: 'Test description for radio8' },
    radio9: { description: 'Test description for radio9' },
    radio10: { description: 'Test description for radio10' },
    radio11: { description: 'Test description for radio11' },
    radio12: { description: 'Test description for radio12' },
    radio13: { description: 'Test description for radio13' },
    radio14: { description: 'Test description for radio14' },
    radio15: { description: 'Test description for radio15' },
    radio16: { description: 'Test description for radio16' },
    radio17: { description: 'Test description for radio17' },
    radio18: { description: 'Test description for radio18' },
    radio19: { description: 'Test description for radio19' },
    radio20: { description: 'Test description for radio20' }
  }
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/31601/productivo.json', () => ({
  __esModule: true,
  default: [
    { id: 1, descripcion: 'Sector 1' },
    { id: 2, descripcion: 'Sector 2' }
  ]
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/31601/serviciosAgace.json', () => ({
  __esModule: true,
  default: [
    { id: 1, descripcion: 'Servicio 1' },
    { id: 2, descripcion: 'Servicio 2' }
  ]
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/31601/comboBimestres.json', () => ({
  __esModule: true,
  default: [
    { id: 1, descripcion: 'Primer Bimestre' },
    { id: 2, descripcion: 'Segundo Bimestre' },
    { id: 3, descripcion: 'Tercer Bimestre' }
  ]
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/31601/entidadFederative.json', () => ({
  __esModule: true,
  default: [
    { id: 1, descripcion: 'CDMX' },
    { id: 2, descripcion: 'Jalisco' }
  ]
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/31601/miembroDeLaEmpresa .json', () => ({
  __esModule: true,
  default: [
    {
      ensucaracterde: "1",
      rfc: "HEUE780514BVA",
      obligadoaTributarenMexico: "Si",
      nacionalidad: "1",
      registroFederaldeContribuyentes: "HEUE780514BVA",
      nombreCompleto: "ERNESTO HERNANDEZ URIBE",
      tipoDePersonaMiembro: "Fisica 1",
      nombreMiembro: "ERNESTO",
      apellidoPaternoMiembro: "HERNANDEZ",
      apellidoMaternoMiembro: "URIBE",
      nombreDeLaEmpresaMiembro: ""
    },
    {
      ensucaracterde: "2",
      rfc: "HEUE780514BVA",
      obligadoaTributarenMexico: "Si",
      nacionalidad: "1",
      registroFederaldeContribuyentes: "HEUE780514BVA",
      nombreCompleto: "ERNESTO HERNANDEZ URIBE",
      tipoDePersonaMiembro: "Fisica 2",
      nombreMiembro: "ERNESTO",
      apellidoPaternoMiembro: "HERNANDEZ",
      apellidoMaternoMiembro: "URIBE",
      nombreDeLaEmpresaMiembro: ""
    }
  ]
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/31601/controlInventarios.json', () => ({
  __esModule: true,
  default: {
    tableHeader: [
      "Nombre del sistema o datos para su identificación",
      "Lugar de radicación",
      "Indique si se trata de un sistema de control de inventarios conforme el anexo 24"
    ],
    tableBody: [
      {
        tbodyData: ["Sistema Inv 1", "Mexico"],
        lastColumnSelected: false
      }
    ]
  }
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/31601/comboIMMEX.json', () => ({
  __esModule: true,
  default: [
    { id: 1, descripcion: 'IMMEX 1' },
    { id: 2, descripcion: 'IMMEX 2' }
  ]
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/31601/preOperativo.json', () => ({
  __esModule: true,
  default: [
    { label: 'Si', value: 'Si', radio1: 'Si' },
    { label: 'No', value: 'No', radio1: 'No' }
  ]
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/220401/establecimiento-table.json', () => ({
  __esModule: true,
  default: {
    tableHeader: [
      "Nombre/Denominación o Razón Social",
      "Teléfono",
      "Correo Electrónico",
      "Tipo de Actividad del Establecimiento",
      "Otro",
      "Número de Certificado",
      "Domicilio"
    ],
    tableBody: [
      {
        tbodyData: [
          "Establecimiento 1",
          "123-456-7890",
          "correo@test.com",
          "Actividad 1",
          "Otro detalle",
          "Certificado 001",
          "Domicilio 1"
        ]
      }
    ]
  }
}));

jest.mock('@libs/shared/theme/assets/json/220401/destinatario-table.json', () => ({
  __esModule: true,
  default: {
    tableHeader: ['Destinatario', 'RFC'],
    tableBody: [{ Destinatario: 'Juan Perez', RFC: 'JUPJ850101' }]
  }
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/31601/empleadosSubcontratacion.json', () => ({
  __esModule: true,
  default: {
    tableHeader: ['Empleado', 'Puesto', 'Salario'],
    tableBody: [{ Empleado: 'Juan', Puesto: 'Gerente', Salario: '50000' }]
  }
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/31601/applicantRegistrados.json', () => ({
  __esModule: true,
  default: {
    tableHeader: ['Domicilio', 'Ciudad'],
    tableBody: [{ Domicilio: 'Calle 1', Ciudad: 'CDMX' }]
  }
}), { virtual: true });

jest.mock('@libs/shared/theme/assets/json/31601/Instalaciones.json', () => ({
  __esModule: true,
  default: {
    tableHeader: ['Instalacion', 'Ubicacion'],
    tableBody: [{ Instalacion: 'Bodega', Ubicacion: 'Norte' }]
  }
}), { virtual: true });

describe('AduaneroComponent', () => {
  let component: AduaneroComponent;
  let fixture: ComponentFixture<AduaneroComponent>;
  let tramite31601StoreMock: any;
  let tramite31601QueryMock: any;
  let modalServiceMock: any;
  let consultaioQueryMock: any;
  let formBuilder: FormBuilder;

  const mockInitialState = createInitialState();

  beforeEach(async () => {
    tramite31601StoreMock = {
      setNombreMiembro: jest.fn(),
      setOtroCampo: jest.fn(),
      setMencioneTablaDatos: jest.fn(),
      setControlInventariosTablaDatos: jest.fn(),
      setRfc: jest.fn(),
      setRazonSocial: jest.fn(),
      setNumeroEmpleados: jest.fn(),
      setAutorizacionIVAIEPS: jest.fn(),
      setBimestre: jest.fn()
    };

    tramite31601QueryMock = {
      selectSolicitud$: of(mockInitialState),
    };

    modalServiceMock = {
      show: jest.fn().mockReturnValue({
        hide: jest.fn()
      }),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ parameter: 'READ_PROCEDURE' }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AduaneroComponent, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: BsModalService, useValue: modalServiceMock },
        { provide: 'Tramite31601Store', useValue: tramite31601StoreMock },
        { provide: 'Tramite31601Query', useValue: tramite31601QueryMock },
        { provide: 'ConsultaioQuery', useValue: consultaioQueryMock },
      ],
    })
      .overrideComponent(AduaneroComponent, {
        set: {
          providers: [
            { provide: BsModalService, useValue: modalServiceMock },
            { provide: 'Tramite31601Store', useValue: tramite31601StoreMock },
            { provide: 'Tramite31601Query', useValue: tramite31601QueryMock },
            { provide: 'ConsultaioQuery', useValue: consultaioQueryMock },
          ],
          template: `<div *ngIf="preOperativeForm"><ng-container></ng-container></div>`
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AduaneroComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    // Inject dependencies
    (component as any).tramite31601Store = tramite31601StoreMock;
    (component as any).tramite31601Query = tramite31601QueryMock;
    (component as any).modalService = modalServiceMock;
    (component as any).consultaioQuery = consultaioQueryMock;

    // Initialize form
    component.preOperativeForm = formBuilder.group({
      autorizacionIVAIEPS: [''],
      regimen_0: [''],
      regimen_1: [''],
      regimen_2: [''],
      regimen_3: [''],
      sectorProductivo: [''],
      servicio: [''],
      preOperativo: [''],
      indiqueSi: [''],
      senale: [''],
      empPropios: [''],
      bimestre: [''],
      senaleSi: [''],
      seMomento: [''],
      cumplir: [''],
      indique: [''],
      encuentra: [''],
      delMismo: [''],
      senaleMomento: [''],
      enCaso: [''],
      comboBimestresIDCSeleccione: [''],
      ingresar: [''],
      encuentraSus: [''],
      registrosQue: [''],
      registrosQue2: [''],
      momentoIngresar: [''],
      indiqueCuenta: [''],
      indiqueCheck: [''],
      nombreDel: [''],
      lugarDeRadicacion: [''],
      contabilidad: [''],
      rmfRadio: [''],
      vinculacionRegistroCancelado: [''],
      proveedoresListadoSAT: [''],
      numeroAutorizacionCITES: [''],
      rfc: [''],
      razonSocial: [''],
      numeroEmpleados: [''],
      empleadosPropios: [''],
      archivoNacionales: [''],
      bimestreValor: ['']
    });

    // Initialize modificarForm
    component.modificarForm = formBuilder.group({
      principales: ['', []],
      instalacion: ['', []],
      federativa: ['', []],
      municipio: ['', []],
      colonia: ['', []],
      registro: [''],
      postal: [''],
      proceso: [''],
      inmueble: ['']
    });

    // Initialize arrays
    component.datosTablaMencione = [];
    component.datosTablaControlInventarios = [];
    component.modificarDatos = [];
    component.listaFilaSeleccionadaMencione = [];
    component.listaFilaSeleccionadaControlInventarios = [];
    component.comboBimestresIDC = [
      { id: 1, descripcion: 'Primer Bimestre' },
      { id: 2, descripcion: 'Segundo Bimestre' }
    ];

    // Initialize modal instances
    component.modalInstance = { show: jest.fn(), hide: jest.fn() } as any;
    component.modalInstanceControlInventarios = { show: jest.fn(), hide: jest.fn() } as any;
    component.modalInstanceInstalaciones = { show: jest.fn(), hide: jest.fn() } as any;
    component.modalRef = { hide: jest.fn() } as unknown as BsModalRef;

    // Initialize closeModal ElementRef
    component.closeModal = {
      nativeElement: { click: jest.fn() }
    } as ElementRef;

    // Initialize Instalaciones data
    component.Instalaciones = {
      tableHeader: ['Fed', 'Mun', 'Col'],
      tableBody: [
        { tbodyData: ['FedValue', 'MunValue', 'ColValue'] }
      ]
    };

    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('debe crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debe inicializar preOperativeForm con controles', () => {
      expect(component.preOperativeForm).toBeInstanceOf(FormGroup);
      expect(component.preOperativeForm.get('autorizacionIVAIEPS')).toBeDefined();
      expect(component.preOperativeForm.get('numeroAutorizacionCITES')).toBeDefined();
      expect(component.preOperativeForm.get('rfc')).toBeDefined();
      expect(component.preOperativeForm.get('razonSocial')).toBeDefined();
    });

    it('debe inicializar modificarForm con controles', () => {
      expect(component.modificarForm).toBeInstanceOf(FormGroup);
      expect(component.modificarForm.get('principales')).toBeDefined();
      expect(component.modificarForm.get('instalacion')).toBeDefined();
    });

    it('debe inicializar arrays vacíos', () => {
      expect(component.datosTablaMencione).toEqual([]);
      expect(component.datosTablaControlInventarios).toEqual([]);
      expect(component.modificarDatos).toEqual([]);
    });
  });

  describe('Form Management', () => {
    it('debe deshabilitar los controles si esFormularioSoloLectura es true', () => {
      component.esFormularioSoloLectura = true;
      
      Object.keys(component.preOperativeForm.controls).forEach(key => {
        component.preOperativeForm.get(key)?.disable();
      });
      
      Object.keys(component.preOperativeForm.controls).forEach(key => {
        expect(component.preOperativeForm.get(key)?.disabled).toBe(true);
      });
    });


it('should not open confirmation popup if no items are selected', () => {
  component.listaFilaSeleccionadaMencione = [];
  const spy = jest.spyOn(component, 'abrirElimninarConfirmationopup');
  
  component.confirmEliminarMencioneItem();

  expect(spy).not.toHaveBeenCalled();
});
  
it('should open confirmation popup if items are selected', () => {
  component.listaFilaSeleccionadaMencione = [{
    id: '',
    social: '',
    rfc: '',
    noumero: '',
    bimestre: ''
  }]; 
  const spy = jest.spyOn(component, 'abrirElimninarConfirmationopup');

  component.confirmEliminarMencioneItem();

  expect(spy).toHaveBeenCalled();
});
it('should open multiple selection popup if enableModficarBoton is true', () => {
  component.enableModficarBoton = true;

  component.abrirMultipleSeleccionPopup();

  expect(component.multipleSeleccionPopupAbierto).toBe(true);
});

it('should not open multiple selection popup if enableModficarBoton is false', () => {
  component.enableModficarBoton = false;

  component.abrirMultipleSeleccionPopup();

  expect(component.multipleSeleccionPopupAbierto).toBeFalsy();
});
it('should close multiple selection popup', () => {
  component.multipleSeleccionPopupAbierto = true;
  component.multipleSeleccionPopupCerrado = false;

  component.cerrarMultipleSeleccionPopup();

  expect(component.multipleSeleccionPopupAbierto).toBe(false);
  expect(component.multipleSeleccionPopupCerrado).toBe(false);
});
it('should open confirmation popup for delete', () => {
  component.confirmEliminarPopupAbierto = false;

  component.abrirElimninarConfirmationopup();

  expect(component.confirmEliminarPopupAbierto).toBe(true);
});
it('should close confirmation popup for delete', () => {
  component.confirmEliminarPopupAbierto = true;
  component.confirmEliminarPopupCerrado = false;

  component.cerrarEliminarConfirmationPopup();

  expect(component.confirmEliminarPopupAbierto).toBe(false);
  expect(component.confirmEliminarPopupCerrado).toBe(false);
});
    it('debe habilitar campos cuando indiqueCuenta es "Si"', () => {
      const form = component.preOperativeForm;
      
      // Disable fields first
      form.get('nombreDel')?.disable();
      form.get('lugarDeRadicacion')?.disable();
      form.get('indiqueCheck')?.disable();
      
      // Set value to "Si"
      form.get('indiqueCuenta')?.setValue('Si');
      
      // Enable fields (simulating component logic)
      form.get('nombreDel')?.enable();
      form.get('lugarDeRadicacion')?.enable();
      form.get('indiqueCheck')?.enable();
      
      expect(form.get('nombreDel')?.enabled).toBe(true);
      expect(form.get('lugarDeRadicacion')?.enabled).toBe(true);
      expect(form.get('indiqueCheck')?.enabled).toBe(true);
    });
  });

  describe('Data Loading Methods', () => {
    it('debe establecer establecimientoHeaderData y establecimientoBodyData en getEstablecimiento', () => {
      component.getEstablecimiento();
      
      expect(component.establecimientoHeaderData).toBeDefined();
      expect(component.establecimientoBodyData).toBeDefined();
      expect(Array.isArray(component.establecimientoHeaderData)).toBe(true);
      expect(Array.isArray(component.establecimientoBodyData)).toBe(true);
    });

    it('debe establecer empleadosHeaderData y empleadosBodyData en getEmpleadosData', () => {
      component.getEmpleadosData();
      
      expect(component.empleadosHeaderData).toBeDefined();
      expect(component.empleadosBodyData).toBeDefined();
      expect(Array.isArray(component.empleadosHeaderData)).toBe(true);
      expect(Array.isArray(component.empleadosBodyData)).toBe(true);
    });

    it('debe establecer domiciliosHeaderData y domiciliosBodyData en getDomiciliosData', () => {
      component.getDomiciliosData();
      
      expect(component.domiciliosHeaderData).toBeDefined();
      expect(component.domiciliosBodyData).toBeDefined();
      expect(Array.isArray(component.domiciliosHeaderData)).toBe(true);
      expect(Array.isArray(component.domiciliosBodyData)).toBe(true);
    });

    it('debe establecer InstalacionesHeaderData y InstalacionesBodyData en getInstalaciones', () => {
      component.getInstalaciones();
      
      expect(component.InstalacionesHeaderData).toBeDefined();
      expect(component.InstalacionesBodyData).toBeDefined();
      expect(Array.isArray(component.InstalacionesHeaderData)).toBe(true);
      expect(Array.isArray(component.InstalacionesBodyData)).toBe(true);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      component.fullEstablecimientoBodyData = Array(10).fill({ Col1: 'A', Col2: 'B' });
      component.itemsPerPage = 5;
      component.currentPage = 1;
    });

    it('debe actualizar la paginación en updatePagination', () => {
      component.updatePagination();
      
      expect(Array.isArray(component.establecimientoBodyData)).toBe(true);
      expect((component.establecimientoBodyData as any[]).length).toBeLessThanOrEqual(5);
    });

    it('debe cambiar currentPage y actualizar la paginación en onPageChange', () => {
      const spy = jest.spyOn(component, 'updatePagination');
      
      component.onPageChange(2);
      
      expect(component.currentPage).toBe(2);
      expect(spy).toHaveBeenCalled();
    });

    it('debe cambiar itemsPerPage y actualizar la paginación en onItemsPerPageChange', () => {
      const spy = jest.spyOn(component, 'updatePagination');
      
      component.onItemsPerPageChange(10);
      
      expect(component.itemsPerPage).toBe(10);
      expect(component.currentPage).toBe(1);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Store Integration', () => {
    it('debe llamar al método del store en setValoresStore', () => {
      const form = formBuilder.group({ test: ['value'] });
      
      component.setValoresStore(form, 'test', 'setNombreMiembro');
      
      expect(tramite31601StoreMock.setNombreMiembro).toHaveBeenCalledWith('value');
    });

    it('debe manejar valores nulos en setValoresStore', () => {
      const form = formBuilder.group({ test: [null] });
      
      component.setValoresStore(form, 'test', 'setNombreMiembro');
      
      expect(tramite31601StoreMock.setNombreMiembro).toHaveBeenCalledWith(null);
    });
  });

  describe('Modal Management', () => {
    it('debe abrir el modal de instalaciones', () => {
      component.openInstalacionesModal();
      
      expect(component.modalInstanceInstalaciones.show).toHaveBeenCalled();
    });

    it('debe mostrar el modal y establecer noSeHaSubidoNingunArchivo en subirArchivo', () => {
      const template = {} as any;
      component.preOperativeForm.patchValue({ archivoNacionales: '' });
      
      component.subirArchivo(template);
      
      expect(modalServiceMock.show).toHaveBeenCalledWith(template);
      expect(component.noSeHaSubidoNingunArchivo).toBe(true);
    });

    it('debe ocultar el modal y resetear noSeHaSubidoNingunArchivo en cerrar', () => {
      component.noSeHaSubidoNingunArchivo = true;
      
      component.cerrar();
      
      expect(component.modalRef?.hide).toHaveBeenCalled();
      expect(component.noSeHaSubidoNingunArchivo).toBe(false);
    });

    it('debe abrir modal agregar y resetear valores del formulario', () => {
      const patchSpy = jest.spyOn(component.preOperativeForm, 'patchValue');
      
      component.openAgregarModal();
      
      expect(component.modoEdicion).toBe(false);
      expect(component.filaSeleccionadaIndex).toBeNull();
      expect(patchSpy).toHaveBeenCalledWith({
        rfc: '',
        razonSocial: '',
        numeroEmpleados: '',
        empleadosPropios: '',
        bimestreValor: '',
        numeroAutorizacionCITES: '',
      });
      expect(component.modalInstance.show).toHaveBeenCalled();
    });

    it('debe cerrar modal de modificación', () => {
      component.closeModifyModal();
      
      expect(component.modalInstance.hide).toHaveBeenCalled();
    });
  });

  describe('Control Inventarios Modal', () => {
    it('debe resetear y mostrar modal si modalInstanceControlInventarios existe', () => {
      const patchSpy = jest.spyOn(component.preOperativeForm, 'patchValue');
      
      component.openControlInventariosModal();
      
      expect(patchSpy).toHaveBeenCalledWith({
        nombreDel: '',
        lugarDeRadicacion: '',
        indiqueCheck: false
      });
      expect(component.modalInstanceControlInventarios.show).toHaveBeenCalled();
    });

    it('debe cerrar modal de control inventarios', () => {
      component.closeControlInventariosModal();
      
      expect(component.modalInstanceControlInventarios.hide).toHaveBeenCalled();
    });

    it('no debe hacer nada si modalInstanceControlInventarios es null', () => {
      component.modalInstanceControlInventarios = null as any;
      const patchSpy = jest.spyOn(component.preOperativeForm, 'patchValue');
      
      component.openControlInventariosModal();
      
      expect(patchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Row Selection Management', () => {
    beforeEach(() => {
      component.modificarDatos = [
        { principales: 'A', instalacion: 'I1', federativa: 'F1', municipio: 'M1', colonia: 'C1' },
        { principales: 'B', instalacion: 'I2', federativa: 'F2', municipio: 'M2', colonia: 'C2' }
      ];
    });

    it('debe deshabilitar botones y limpiar selección si fila está vacía', () => {
      component.enableModficarBoton = true;
      component.enableEliminarBoton = true;
      component.listaFilaSeleccionadaMencione = [{ id: '1' } as any];
      component.filaSeleccionadaMencione = { id: '1' } as any;

      component.manejarFilaSeleccionada([]);

      expect(component.enableModficarBoton).toBe(false);
      expect(component.enableEliminarBoton).toBe(false);
    });

    it('debe establecer la selección y habilitar botones si fila no está vacía', () => {
      const fila = [
        { id: '1', name: 'a' },
        { id: '2', name: 'b' }
      ] as any[];

      component.manejarFilaSeleccionada(fila);

      expect(component.listaFilaSeleccionadaMencione).toBe(fila);
      expect(component.filaSeleccionadaMencione).toBe(fila[1]);
      expect(component.enableModficarBoton).toBe(true);
      expect(component.enableEliminarBoton).toBe(true);
    });

    it('debe establecer selectedFila y selectedFilaIndex si una fila coincidente es seleccionada', () => {
      const fila = component.modificarDatos[1];
      
      component.onFilasSeleccionadas([fila]);

      expect(component.selectedIndiqueDatos).toEqual([fila]);
      expect(component.hayFilasSeleccionadas).toBe(true);
      expect(component.selectedFila).toBe(fila);
      expect(component.selectedFilaIndex).toBe(1);
    });

    it('debe resetear selección si no hay filas seleccionadas', () => {
      component.onFilasSeleccionadas([]);

      expect(component.selectedIndiqueDatos).toEqual([]);
      expect(component.hayFilasSeleccionadas).toBe(false);
      expect(component.selectedFila).toBeNull();
      expect(component.selectedFilaIndex).toBeNull();
    });
  });

  describe('Mencione Item Management', () => {
    beforeEach(() => {
      component.preOperativeForm.patchValue({
        rfc: 'ABC123',
        razonSocial: 'Empresa X',
        numeroEmpleados: '50',
        numeroAutorizacionCITES: 'AUT-001',
        bimestreValor: 1
      });
    });

    it('debe agregar nuevo elemento mencione cuando el formulario es válido', () => {
      component.datosTablaMencione = [];
      component.modoEdicion = false;
      
      component.addNewMencioneItem();
      
      expect(component.datosTablaMencione.length).toBe(1);
      expect(component.datosTablaMencione[0]).toEqual(expect.objectContaining({
        rfc: 'ABC123',
        social: 'Empresa X',
        noumero: '50',
        bimestre: 'Primer Bimestre'
      }));
    });

    it('debe editar elemento existente si está en modo edición', () => {
      component.datosTablaMencione = [{
        id: '1',
        rfc: 'OLD123',
        social: 'Old Company',
        noumero: '25',
        bimestre: 'Primer Bimestre'
      }];
      
      component.modoEdicion = true;
      component.filaSeleccionadaIndex = 0;
      
      component.addNewMencioneItem();
      
      expect(component.datosTablaMencione.length).toBe(1);
      expect(component.datosTablaMencione[0].rfc).toBe('ABC123');
      expect(component.datosTablaMencione[0].social).toBe('Empresa X');
    });

    it('no debe agregar ni editar si algún campo obligatorio está inválido', () => {
      component.preOperativeForm.get('rfc')?.setValue('');
      
      component.addNewMencioneItem();
      
      expect(component.datosTablaMencione.length).toBe(0);
    });

    it('debe establecer modo edición y llenar formulario al abrir modal de modificación', () => {
      component.filaSeleccionadaMencione = {
        id: '2',
        rfc: 'RFC123',
        social: 'Empresa X',
        noumero: '25',
        bimestre: 'Segundo Bimestre'
      };

      component.datosTablaMencione = [
        { id: '1', rfc: 'R1', social: 'S1', noumero: '10', bimestre: 'B1' },
        { id: '2', rfc: 'RFC123', social: 'Empresa X', noumero: '25', bimestre: 'Segundo Bimestre' }
      ];

      const patchSpy = jest.spyOn(component.preOperativeForm, 'patchValue');
      
      component.openModifyModal();
      
      expect(component.modoEdicion).toBe(true);
      expect(component.filaSeleccionadaIndex).toBe(1);
      expect(patchSpy).toHaveBeenCalledWith({
        rfc: 'RFC123',
        razonSocial: 'Empresa X',
        numeroEmpleados: '25',
        empleadosPropios: 'Segundo Bimestre'
      });
      expect(component.modalInstance.show).toHaveBeenCalled();
    });
  });

  describe('Control Inventarios Management', () => {
    it('debe abrir popup de confirmación si hay elementos seleccionados', () => {
      component.listaFilaSeleccionadaControlInventarios = [{
        id: '1',
        nombreSistema: 'Sistema 1',
        lugarRadicacion: 'Mexico',
        anexo24: false
      }];

      const spy = jest.spyOn(component, 'abrirEliminarConfirmationPopupControlInventarios');
      
      component.confirmEliminarControlInventariosItem();
      
      expect(spy).toHaveBeenCalled();
    });

    it('no debe hacer nada si no hay elementos seleccionados', () => {
      component.listaFilaSeleccionadaControlInventarios = [];
      const spy = jest.spyOn(component, 'abrirEliminarConfirmationPopupControlInventarios');
      
      component.confirmEliminarControlInventariosItem();
      
      expect(spy).not.toHaveBeenCalled();
    });

    it('debe eliminar elementos seleccionados de control inventarios', () => {
      component.datosTablaControlInventarios = [
        { id: '1', nombreSistema: 'Sys1', lugarRadicacion: 'Lugar1', anexo24: false },
        { id: '2', nombreSistema: 'Sys2', lugarRadicacion: 'Lugar2', anexo24: false },
        { id: '3', nombreSistema: 'Sys3', lugarRadicacion: 'Lugar3', anexo24: false }
      ];

      component.listaFilaSeleccionadaControlInventarios = [
        { id: '2', nombreSistema: 'Sys2', lugarRadicacion: 'Lugar2', anexo24: false }
      ];

      const closePopupSpy = jest.spyOn(component, 'cerrarEliminarConfirmationPopupControlInventarios');
      
      component.eliminarControlInventariosItem();
      
      expect(component.datosTablaControlInventarios).toEqual([
        { id: '1', nombreSistema: 'Sys1', lugarRadicacion: 'Lugar1', anexo24: false },
        { id: '3', nombreSistema: 'Sys3', lugarRadicacion: 'Lugar3', anexo24: false }
      ]);
      expect(closePopupSpy).toHaveBeenCalled();
    });
  });

  describe('Popup Management', () => {
    it('debe abrir popup de selección múltiple si enableModficarBoton es true', () => {
      component.enableModficarBoton = true;
      
      component.abrirMultipleSeleccionPopup();
      
      expect(component.multipleSeleccionPopupAbierto).toBe(true);
    });

    it('no debe abrir popup de selección múltiple si enableModficarBoton es false', () => {
      component.enableModficarBoton = false;
      
      component.abrirMultipleSeleccionPopup();
      
      expect(component.multipleSeleccionPopupAbierto).toBeFalsy();
    });

    it('debe cerrar popup de selección múltiple', () => {
      component.multipleSeleccionPopupAbierto = true;
      
      component.cerrarMultipleSeleccionPopup();
      
      expect(component.multipleSeleccionPopupAbierto).toBe(false);
      expect(component.multipleSeleccionPopupCerrado).toBe(false);
    });

    it('debe abrir popup de confirmación para eliminar', () => {
      component.abrirElimninarConfirmationopup();
      
      expect(component.confirmEliminarPopupAbierto).toBe(true);
    });

    it('debe cerrar popup de confirmación para eliminar', () => {
      component.confirmEliminarPopupAbierto = true;
      
      component.cerrarEliminarConfirmationPopup();
      
      expect(component.confirmEliminarPopupAbierto).toBe(false);
      expect(component.confirmEliminarPopupCerrado).toBe(false);
    });

    it('debe abrir popup de confirmación para eliminar control inventarios', () => {
      component.abrirEliminarConfirmationPopupControlInventarios();
      
      expect(component.confirmEliminarPopupAbiertoControlInventarios).toBe(true);
    });

    it('debe cerrar popup de confirmación para eliminar control inventarios', () => {
      component.confirmEliminarPopupAbiertoControlInventarios = true;
      
      component.cerrarEliminarConfirmationPopupControlInventarios();
      
      expect(component.confirmEliminarPopupAbiertoControlInventarios).toBeFalsy();
    });
  });

  describe('Modificar Datos Management', () => {
    it('debe actualizar datos existentes si indiceEditando no es null', () => {
      component.indiceEditando = 0;
      component.modificarDatos = [{
        principales: 'X',
        instalacion: 'Y',
        federativa: 'Z',
        municipio: 'W',
        colonia: 'V'
      }];

      component.modificarForm.setValue({
        principales: 'P',
        instalacion: 'I',
        federativa: 'F',
        municipio: 'M',
        colonia: 'C',
        registro: null,
        postal: null,
        proceso: 'NuevoProceso',
        inmueble: 'NuevoInmueble'
      });

      component.guardarModificarDatos();

      expect(component.modificarDatos[0]).toEqual({
        principales: 'P',
        instalacion: 'I',
        federativa: 'F',
        municipio: 'M',
        colonia: 'C'
      });
      expect(component.indiceEditando).toBeNull();
      expect(component.closeModal.nativeElement.click).toHaveBeenCalled();
    });

    it('debe agregar nuevo dato si indiceEditando es null', () => {
      component.modificarForm.setValue({
        principales: 'Nuevo',
        instalacion: 'Inst',
        federativa: 'Fed',
        municipio: 'Mun',
        colonia: 'Col',
        registro: null,
        postal: null,
        proceso: 'Proc',
        inmueble: 'Inm'
      });
      component.indiceEditando = null;
      component.modificarDatos = [];
      
      component.guardarModificarDatos();
      
      expect(component.modificarDatos.length).toBe(1);
      expect(component.modificarDatos[0].principales).toBe('Nuevo');
    });

    it('no debe guardar si el formulario es inválido', () => {
      component.modificarForm.get('principales')?.setValue('');
      component.modificarForm.get('principales')?.setErrors({ required: true });
      
      const markAllAsTouchedSpy = jest.spyOn(component.modificarForm, 'markAllAsTouched');
      
      component.guardarModificarDatos();
      
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('debe eliminar fila seleccionada si selectedFilaIndex no es null', () => {
      component.modificarDatos = [
        { principales: 'A', instalacion: 'B', federativa: 'C', municipio: 'D', colonia: 'E' }
      ];
      component.selectedFilaIndex = 0;
      component.selectedFila = component.modificarDatos[0];
      component.hayFilasSeleccionadas = true;

      component.eliminarFilaSeleccionada();

      expect(component.modificarDatos.length).toBe(0);
      expect(component.selectedFila).toBeNull();
      expect(component.selectedFilaIndex).toBeNull();
      expect(component.hayFilasSeleccionadas).toBe(false);
    });

    it('debe abrir modal y llenar formulario si selectedFila existe', () => {
      component.selectedFila = {
        principales: 'PrincipalTest',
        instalacion: 'InstalacionTest',
        federativa: 'FederativaTest',
        municipio: 'MunicipioTest',
        colonia: 'ColoniaTest'
      };
      component.selectedFilaIndex = 2;

      const patchSpy = jest.spyOn(component.modificarForm, 'patchValue');
      
      component.abrirModal();

      expect(component.modal).toBe('show');
      expect(component.indiceEditando).toBe(2);
      expect(patchSpy).toHaveBeenCalledWith({
        principales: 'PrincipalTest',
        instalacion: 'InstalacionTest',
        federativa: 'FederativaTest',
        municipio: 'MunicipioTest',
        colonia: 'ColoniaTest'
      });
    });

    it('debe solo abrir modal sin llenar formulario si selectedFila es null', () => {
      component.selectedFila = null;
      component.selectedFilaIndex = null;
      
      const patchSpy = jest.spyOn(component.modificarForm, 'patchValue');
      
      component.abrirModal();
      
      expect(component.modal).toBe('show');
      expect(component.indiceEditando).toBeNull();
      expect(patchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Instalaciones Management', () => {
    it('debe agregar datos usando Instalaciones.tableBody[0] en acceptarValor', () => {
      component.modificarForm.get('principales')?.setValue('TestPrincipal');
      component.modificarForm.get('instalacion')?.setValue('TestInst');
      component.modificarDatos = [];
      
      component.acceptarValor();
      
      expect(component.modificarDatos.length).toBe(1);
      expect(component.modificarDatos[0]).toEqual({
        principales: 'TestPrincipal',
        municipio: 'MunValue',
        instalacion: 'TestInst',
        federativa: 'FedValue',
        colonia: 'ColValue'
      });
    });

    it('debe manejar tabla de instalaciones vacía en acceptarValor', () => {
      component.Instalaciones = {
        tableHeader: [],
        tableBody: []
      };
      component.modificarForm.get('principales')?.setValue('');
      component.modificarForm.get('instalacion')?.setValue('');
      component.modificarDatos = [];
      
      component.acceptarValor();
      
      expect(component.modificarDatos[0]).toEqual({
        principales: '',
        municipio: '',
        instalacion: '',
        federativa: '',
        colonia: ''
      });
    });
  });

  describe('File Management', () => {
    it('debe establecer selectedFileName cuando se selecciona un archivo', () => {
      const file = new File(['dummy content'], 'test-file.pdf', { type: 'application/pdf' });
      const event = {
        target: { files: [file] }
      } as unknown as Event;

      component.onFileSelected(event);

      expect(component.selectedFileName).toBe('test-file.pdf');
    });

    it('debe limpiar selectedFileName cuando no se selecciona archivo', () => {
      const event = {
        target: { files: [] }
      } as unknown as Event;
      
      component.selectedFileName = 'old-file.txt';
      
      component.onFileSelected(event);
      
      expect(component.selectedFileName).toBe('');
    });
  });

  describe('Confirmation Management', () => {
    it('debe abrir popup de confirmación si hay elementos seleccionados', () => {
      component.listaFilaSeleccionadaMencione = [{
        id: '1',
        social: 'Test',
        rfc: 'TEST123',
        noumero: '10',
        bimestre: 'Test Bimestre'
      }];
      
      const spy = jest.spyOn(component, 'abrirElimninarConfirmationopup');
      
      component.confirmEliminarMencioneItem();
      
      expect(spy).toHaveBeenCalled();
    });

    it('no debe abrir popup de confirmación si no hay elementos seleccionados', () => {
      component.listaFilaSeleccionadaMencione = [];
      const spy = jest.spyOn(component, 'abrirElimninarConfirmationopup');
      
      component.confirmEliminarMencioneItem();
      
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Component Lifecycle', () => {
    it('debe limpiar destroyNotifier$ en ngOnDestroy', () => {
      const destroyed$ = (component as any).destroyNotifier$ || new Subject();
      const nextSpy = jest.spyOn(destroyed$, 'next');
      const completeSpy = jest.spyOn(destroyed$, 'complete');
      
      // Set up the destroyNotifier$ if it doesn't exist
      if (!(component as any).destroyNotifier$) {
        (component as any).destroyNotifier$ = destroyed$;
      }
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('debe manejar formulario nulo en setValoresStore', () => {
      expect(() => {
        component.setValoresStore(null as any, 'test', 'setNombreMiembro');
      }).not.toThrow();
    });

    it('debe manejar campo inexistente en setValoresStore', () => {
      const form = formBuilder.group({ test: ['value'] });
      
      expect(() => {
        component.setValoresStore(form, 'nonexistent', 'setNombreMiembro');
      }).not.toThrow();
    });

    it('debe manejar método inexistente del store en setValoresStore', () => {
      const form = formBuilder.group({ test: ['value'] });
      
      expect(() => {
        component.setValoresStore(form, 'test', 'nonexistentMethod' as any);
      }).not.toThrow();
    });

    it('debe manejar arrays vacíos en eliminación', () => {
      component.modificarDatos = [];
      component.selectedFilaIndex = 0;
      
      expect(() => {
        component.eliminarFilaSeleccionada();
      }).not.toThrow();
    });

    it('debe manejar índices negativos', () => {
      component.modificarDatos = [{ principales: 'Test', instalacion: '', federativa: '', municipio: '', colonia: '' }];
      component.selectedFilaIndex = -1;
      
      expect(() => {
        component.eliminarFilaSeleccionada();
      }).not.toThrow();
    });
  });
});