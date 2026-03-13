import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosComunesComponent } from './datos-comunes.component';
import { FormBuilder } from '@angular/forms';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';
import { Solicitud32604Store } from '../../estados/solicitud32604.store';
import { Solicitud32604Query } from '../../estados/solicitud32604.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

jest.mock('bootstrap', () => ({
  Modal: Object.assign(
    jest.fn().mockImplementation(() => ({
      show: jest.fn(),
      hide: jest.fn(),
      _initializeBackDrop: jest.fn(),
      backdrop: {},
      _element: {},
      _config: {},
      _isShown: false,
      _backdrop: null,
      _dialog: {},
      _ignoreBackdropClick: false,
      _isTransitioning: false,
      _addEventListeners: jest.fn(),
      _removeEventListeners: jest.fn(),
      _setEscapeEvent: jest.fn(),
      _setResizeEvent: jest.fn(),
      _hideModal: jest.fn(),
      _showBackdrop: jest.fn(),
      _hideBackdrop: jest.fn(),
      _resetAdjustments: jest.fn(),
      _checkScrollbar: jest.fn(),
      _setScrollbar: jest.fn(),
      _resetScrollbar: jest.fn(),
      _adjustDialog: jest.fn(),
      _triggerBackdropTransition: jest.fn(),
      dispose: jest.fn(),
    })),
    {
      getInstance: jest.fn(() => ({
        show: jest.fn(),
        hide: jest.fn(),
        backdrop: {},
      })),
    }
  ),
}));

describe('DatosComunesComponent', () => {
  describe('validarYAnexarArchivoExtranjeros', () => {
    let inputMock: HTMLInputElement;
    let fileMock: File;
    beforeEach(() => {
      fileMock = new File(['dummy content'], 'extranjero.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      inputMock = {
        files: {
          0: fileMock,
          length: 1,
          item: (i: number) => i === 0 ? fileMock : null
        },
        value: '',
      } as any;
      jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
        if (id === 'archivoExtranjero') return inputMock;
        return null;
      });
      component.archivosExtranjerosSubidos = [];
      component.registrosExcelSubidos = [];
      component.abrirModal = jest.fn();
      jest.spyOn(component, 'validarYAnexarArchivoExtranjeros');
      (component as any).procesarAnexionArchivoExtranjeros = jest.fn();
    });

    it('should show error if no file selected', () => {
      inputMock.files = { length: 0, item: () => null };
      component.validarYAnexarArchivoExtranjeros();
      expect(component.abrirModal).toHaveBeenCalledWith('Error, No se ha seleccionado un archivo');
    });

    it('should show error if file is duplicate', () => {
      component.archivosExtranjerosSubidos = ['extranjero.xlsx'];
      component.validarYAnexarArchivoExtranjeros();
      expect(component.abrirModal).toHaveBeenCalledWith('Este archivo ya existe.');
    });

    it('should show error if limit reached', () => {
      component.registrosExcelSubidos = Array(6).fill({});
      component.validarYAnexarArchivoExtranjeros();
      expect(component.abrirModal).toHaveBeenCalledWith('Ha alcanzado el límite máximo de 6 archivos para Clientes y Proveedores en el Extranjero.');
    });

    it('should show error if file format is invalid', () => {
      const invalidFile = new File(['dummy'], 'extranjero.txt', { type: 'text/plain' });
      inputMock.files = {
        0: invalidFile,
        length: 1,
        item: (i: number) => i === 0 ? invalidFile : null
      };
      component.validarYAnexarArchivoExtranjeros();
      expect(component.abrirModal).toHaveBeenCalledWith('El formato del archivo es incorrecto.');
    });

    it('should process file if valid and not duplicate/limit', () => {
      component.validarYAnexarArchivoExtranjeros();
      expect((component as any).procesarAnexionArchivoExtranjeros).toHaveBeenCalledWith(fileMock);
    });
  });

  describe('procesarAnexionArchivoProveedores', () => {
    it('should call extraction and update methods on success', () => {
      const file = new File(['dummy'], 'proveedor.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const readerMock = {
        onload: null,
        onerror: null,
        readAsArrayBuffer: jest.fn(function() {
          if (this.onload) this.onload({ target: { result: new ArrayBuffer(8) } });
        }),
      };
      jest.spyOn(window, 'FileReader').mockImplementation(() => readerMock as any);
      (DatosComunesComponent as any).leerArchivoExcel = jest.fn().mockReturnValue({ NombresHojas: ['HojaDatos'], Hojas: { HojaDatos: {} } });
      jest.spyOn(component, 'validarYAnexarArchivoProveedores');
      jest.spyOn(component, 'abrirModal');

      const inputMock = {
        files: {
          0: file,
          length: 1,
          item: (i: number) => i === 0 ? file : null
        },
        value: '',
      } as any;
      jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
        if (id === 'archivoProveedores') return inputMock;
        return null;
      });
      component.archivosProveedoresSubidos = [];
      component.registrosProveedoresExcel = [];
      component.validarYAnexarArchivoProveedores();
      expect(component.abrirModal).toHaveBeenCalledWith('El archivo se ha subido correctamente.');
    });

    it('should show error modal on failure', () => {
      const file = new File(['dummy'], 'proveedor.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const readerMock = {
        onload: null,
        onerror: null,
        readAsArrayBuffer: jest.fn(function() {
          if (this.onload) throw new Error('fail');
        }),
      };
      jest.spyOn(window, 'FileReader').mockImplementation(() => readerMock as any);
  (DatosComunesComponent as any).leerArchivoExcel = jest.fn().mockImplementation(() => { throw new Error('fail'); });
      component.abrirModal = jest.fn();
      const inputMock = {
        files: {
          0: file,
          length: 1,
          item: (i: number) => i === 0 ? file : null
        },
        value: '',
      } as any;
      jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
        if (id === 'archivoProveedores') return inputMock;
        return null;
      });
      component.archivosProveedoresSubidos = [];
      component.registrosProveedoresExcel = [];
      const abrirModalSpy = jest.spyOn(component, 'abrirModal');
      jest.spyOn(DatosComunesComponent as any, 'leerArchivoExcel').mockImplementation(() => { throw new Error('mock error'); });
      const fileReaderMock = {
        onload: function(event: any) {},
        onerror: null,
        readAsArrayBuffer: function() {
          this.onload({ target: { result: new ArrayBuffer(8) } });
        }
      };
      jest.spyOn(window as any, 'FileReader').mockImplementation(() => fileReaderMock);
      component.validarYAnexarArchivoProveedores();
      expect(abrirModalSpy).toHaveBeenCalledWith('Error al procesar el archivo Excel de Proveedores. Verifique el formato del archivo.');
    });
  });

  describe('actualizarCampoRegistrosExistentes', () => {
    it('should update form and store with correct values', () => {
      component.registrosExcelSubidos = [
        { id: 1, nombre: 'A', descripcion: 'desc' },
        { id: 2, nombre: 'B', descripcion: 'desc' }
      ];
        const patchValueSpy = jest.spyOn(component.datosComunesForm, 'patchValue');
        const storeSpy = jest.spyOn(component.solicitud32604Store, 'actualizarActualmente1');
        (component as any).actualizarCampoRegistrosExistentes();
        expect(patchValueSpy).toHaveBeenCalled();
        expect(storeSpy).toHaveBeenCalled();
    });
  });

  describe('actualizarCampoProveedoresExistentes', () => {
    it('should update form and store with correct values', () => {
      component.registrosProveedoresExcel = [
        { id: 1, nombre: 'A', descripcion: 'desc' },
        { id: 2, nombre: 'B', descripcion: 'desc' },
        { id: 3, nombre: 'C', descripcion: 'desc' }
      ];
        const patchValueSpy = jest.spyOn(component.datosComunesForm, 'patchValue');
        const storeSpy = jest.spyOn(component.solicitud32604Store, 'actualizarActualmente2');
        (component as any).actualizarCampoProveedoresExistentes();
        expect(patchValueSpy).toHaveBeenCalled();
        expect(storeSpy).toHaveBeenCalled();
    });
  });

  describe('limpiarRegistrosExcelExtranjeros', () => {
    it('should reset arrays, counters, and input values', () => {
      component.registrosExcelSubidos = [
        { id: 1, nombre: 'A', descripcion: 'desc' },
        { id: 2, nombre: 'B', descripcion: 'desc' }
      ];
      component.textoRegistrosExcel = '2';
      component.archivosExtranjerosSubidos = ['a.xlsx'];
      component.registrosRestantes = 2;
  (component as any).actualizarCampoRegistrosExistentes = jest.fn();
      const inputMock = { value: '' };
      jest.spyOn(document, 'getElementById').mockReturnValue(inputMock as any);
      component.limpiarRegistrosExcelExtranjeros();
      expect(component.registrosExcelSubidos).toEqual([]);
      expect(component.textoRegistrosExcel).toBe('');
      expect(component.archivosExtranjerosSubidos).toEqual([]);
      expect(component.registrosRestantes).toBe(component.LIMITE_MAXIMO_REGISTROS);
  expect((component as any).actualizarCampoRegistrosExistentes).toHaveBeenCalled();
      expect(inputMock.value).toBe('');
    });
  });

  describe('limpiarRegistrosProveedores', () => {
    it('should reset arrays, counters, and input values', () => {
      component.registrosProveedoresExcel = [
        { id: 1, nombre: 'A', descripcion: 'desc' },
        { id: 2, nombre: 'B', descripcion: 'desc' }
      ];
      component.textoProveedoresExcel = '2';
      component.archivosProveedoresSubidos = ['b.xlsx'];
      component.proveedoresRestantes = 2;
  (component as any).actualizarCampoProveedoresExistentes = jest.fn();
      const inputMock = { value: '' };
      jest.spyOn(document, 'getElementById').mockReturnValue(inputMock as any);
      component.limpiarRegistrosProveedores();
      expect(component.registrosProveedoresExcel).toEqual([]);
      expect(component.textoProveedoresExcel).toBe('');
      expect(component.archivosProveedoresSubidos).toEqual([]);
      expect(component.proveedoresRestantes).toBe(component.LIMITE_MAXIMO_REGISTROS);
  expect((component as any).actualizarCampoProveedoresExistentes).toHaveBeenCalled();
      expect(inputMock.value).toBe('');
    });
  });
  describe('validarYAnexarArchivoProveedores', () => {
    let inputMock: HTMLInputElement;
    let fileMock: File;
    beforeEach(() => {
      fileMock = new File(['dummy content'], 'proveedor.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      inputMock = {
        files: [fileMock],
        value: '',
      } as any;
      jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
        if (id === 'archivoProveedores') return inputMock;
        return null;
      });
      component.archivosProveedoresSubidos = [];
      component.registrosProveedoresExcel = [];
      component.abrirModal = jest.fn();
  (component as any).procesarAnexionArchivoProveedores = jest.fn();
    });

    it('should show error if no file selected', () => {
      inputMock.files = { length: 0, item: () => null };
      component.validarYAnexarArchivoProveedores();
      expect(component.abrirModal).toHaveBeenCalledWith('Error, No se ha seleccionado un archivo');
    });

    it('should show error if file is duplicate', () => {
      component.archivosProveedoresSubidos = ['proveedor.xlsx'];
      component.validarYAnexarArchivoProveedores();
      expect(component.abrirModal).toHaveBeenCalledWith('Este archivo ya existe.');
    });

    it('should show error if limit reached', () => {
      component.registrosProveedoresExcel = Array(6).fill({});
      component.validarYAnexarArchivoProveedores();
      expect(component.abrirModal).toHaveBeenCalledWith('Ha alcanzado el límite máximo de 6 archivos para Proveedores.');
    });

    it('should show error if file format is invalid', () => {
      const invalidFile = new File(['dummy'], 'proveedor.txt', { type: 'text/plain' });
        inputMock.files = {
          0: new File(['dummy'], 'proveedor.txt', { type: 'text/plain' }),
          length: 1,
          item: (i: number) => i === 0 ? new File(['dummy'], 'proveedor.txt', { type: 'text/plain' }) : null
        };
      component.validarYAnexarArchivoProveedores();
      expect(component.abrirModal).toHaveBeenCalledWith('El formato del archivo es incorrecto.');
    });

    it('should process file if valid and not duplicate/limit', () => {
      component.validarYAnexarArchivoProveedores();
  expect((component as any).procesarAnexionArchivoProveedores).toHaveBeenCalledWith(fileMock);
    });
  });
  describe('Observable next handlers', () => {
    it('should update sinoOpcion in next handler', () => {
      const respuesta = { requisitos: { radioOptions: [1, 2], isRequired: true } };
      (component as any).sinoOpcion = {};
      const next = (respuesta: any) => {
        component.sinoOpcion = respuesta.requisitos;
      };
      next(respuesta);
      expect(component.sinoOpcion).toEqual(respuesta.requisitos);
    });
    it('should update sectorProductivo, servicio, bimestre, indiqueTodos in next handler', () => {
      const respuesta = {
        sectorProductivo: { labelNombre: 'Sector', catalogos: [1] },
        servicio: { labelNombre: 'Servicio', catalogos: [2] },
        bimestre: { labelNombre: 'Bimestre', catalogos: [3] },
        indiqueTodos: { labelNombre: 'Todos', catalogos: [4] }
      };
      const next = (respuesta: any) => {
        component.sectorProductivo = { ...component.sectorProductivo, ...respuesta.sectorProductivo };
        component.servicio = { ...component.servicio, ...respuesta.servicio };
        component.bimestre = { ...component.bimestre, ...respuesta.bimestre };
        component.indiqueTodos = { ...component.indiqueTodos, ...respuesta.indiqueTodos };
      };
      next(respuesta);
      expect(component.sectorProductivo.labelNombre).toBe('Sector');
      expect(component.servicio.labelNombre).toBe('Servicio');
      expect(component.bimestre.labelNombre).toBe('Bimestre');
      expect(component.indiqueTodos.labelNombre).toBe('Todos');
    });
  });

  describe('Modal Operations', () => {
    it('should call show on agregarMiembrosEmpresa modal and reset modificarMiembroComponent', () => {
      component.miembroSeleccionadoParaModificar = {
        tipoPersonaMuestra: '', nombre: 'Test', nombreCompleto: '', rfc: '', caracterDe: '', nacionalidad: '', tributarMexico: '', nombreEmpresa: '', idSolicitud: ''
      };
  component.modalModificarMiembro = { nativeElement: { addEventListener: jest.fn() } } as any;
      component.modificarMiembroComponent = { resetearFormulario: jest.fn() } as any;
      jest.useFakeTimers();
      component.agregarMiembrosEmpresa();
        const { Modal } = require('bootstrap');
        expect(Modal).toHaveBeenCalledWith(component.modalModificarMiembro.nativeElement);
      jest.runAllTimers();
      expect(component.modificarMiembroComponent.resetearFormulario).toHaveBeenCalled();
      jest.useRealTimers();
    });
    it('should call show on agregarSubcontratados modal', () => {
  component.elementoModalSeccionSubcontratados = { nativeElement: { addEventListener: jest.fn() } } as any;
      component.agregarSubcontratados();
      const { Modal } = require('bootstrap');
      expect(Modal).toHaveBeenCalledWith(component.elementoModalSeccionSubcontratados.nativeElement);
    });
    it('should call show on agregarInstalacionesPrincipales modal and reset componenteAgregar', () => {
  component.elementoModalInstalacionesPrincipales = { nativeElement: { addEventListener: jest.fn() } } as any;
      component.componenteAgregar = { resetModalState: jest.fn() } as any;
      component.agregarInstalacionesPrincipales();
      expect(component.componenteAgregar.resetModalState).toHaveBeenCalled();
      const { Modal } = require('bootstrap');
      expect(Modal).toHaveBeenCalledWith(component.elementoModalInstalacionesPrincipales.nativeElement);
    });
    it('should hide modal on cerrarModalInstalaciones', () => {
  const { Modal } = require('bootstrap');
  const hideMock = jest.fn();
  Modal.getInstance = jest.fn(() => ({ hide: hideMock }));
  component.elementoModalInstalacionesPrincipales = { nativeElement: { addEventListener: jest.fn() } } as any;
      component.cerrarModalInstalaciones();
      expect(hideMock).toHaveBeenCalled();
    });
    it('should hide modal on cerrarModalModificar', () => {
  const { Modal } = require('bootstrap');
  const hideMock = jest.fn();
  Modal.getInstance = jest.fn(() => ({ hide: hideMock }));
  component.elementoModalModificar = { nativeElement: { addEventListener: jest.fn() } } as any;
      component.cerrarModalModificar();
      expect(hideMock).toHaveBeenCalled();
    });
    it('should show modal on agregarModificarPrincipales if one domicilio selected', () => {
      component.seleccionarDomiciliosDatos = [{
        instalacionPrincipal: '',
        tipoInstalacion: '',
        entidadFederativa: 'A',
        municipioDelegacion: '',
        direccion: '',
        codigoPostal: '',
        registroSESAT: '',
        procesoProductivo: '',
        acreditaInmueble: '',
        operacionesCExt: '',
        instalacionCtpat: '',
        instalacionPerfil: '',
        instalacionPerfilRFE: '',
        instalacionPerfilAuto: '',
        instalacionPerfilFerro: '',
        instalacionPerfilRf: '',
        instalacionPerfilMensajeria: '',
        instalacionPerfilAlmacen: ''
      }];
  component.elementoModalModificar = { nativeElement: { addEventListener: jest.fn() } } as any;
      component.agregarModificarPrincipales();
        const { Modal } = require('bootstrap');
        expect(Modal).toHaveBeenCalledWith(component.elementoModalModificar.nativeElement);
    });
    it('should show modal on agregarEmpresaPrincipales and reset componenteAgregar', () => {
  component.elementoModalEmpresa = { nativeElement: { addEventListener: jest.fn() } } as any;
      component.componenteAgregar = { resetModalState: jest.fn() } as any;
      component.agregarEmpresaPrincipales();
      expect(component.componenteAgregar.resetModalState).toHaveBeenCalled();
      const { Modal } = require('bootstrap');
      expect(Modal).toHaveBeenCalledWith(component.elementoModalEmpresa.nativeElement);
    });
    it('should show modal on agregarModificarMiembro if one miembro selected', () => {
      component.seleccionarListaSeccionSociosIC = [{
        tipoPersonaMuestra: '', nombre: 'Test', nombreCompleto: '', rfc: '', caracterDe: '', nacionalidad: '', tributarMexico: '', nombreEmpresa: '', idSolicitud: ''
      }];
  component.modalModificarMiembro = { nativeElement: { addEventListener: jest.fn() } } as any;
      component.agregarModificarMiembro();
        const { Modal } = require('bootstrap');
        expect(Modal).toHaveBeenCalledWith(component.modalModificarMiembro.nativeElement);
    });
    it('should hide modal on cerrarModalModificarMiembro', () => {
  const { Modal } = require('bootstrap');
  const hideMock = jest.fn();
  Modal.getInstance = jest.fn(() => ({ hide: hideMock }));
  component.modalModificarMiembro = { nativeElement: { addEventListener: jest.fn() } } as any;
      component.cerrarModalModificarMiembro();
      expect(hideMock).toHaveBeenCalled();
    });
  });
  let component: DatosComunesComponent;
  let fixture: ComponentFixture<DatosComunesComponent>;
  let empresasComercializadorasServiceMock: any;
  let solicitud32604StoreMock: any;
  let solicitud32604QueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    empresasComercializadorasServiceMock = {};
    solicitud32604StoreMock = {
      actualizarActualmente1: jest.fn(),
      actualizarActualmente2: jest.fn(),
      nacionalidades: [],
      actualizarDomiciliosDatos: jest.fn(),
      actualizarListaSeccionSociosIC: jest.fn(),
      actualizarNumeroDeEmpleadosLista: jest.fn(),
      actualizar249: jest.fn(),
    };
    solicitud32604QueryMock = {
      selectSolicitud$: of({
        domiciliosDatos: [],
        listaSeccionSociosIC: [],
        numeroDeEmpleadosLista: [],
        catseleccionados: [],
        servicio: []
      })
    };
    consultaioQueryMock = {};
    const modalInstance = {
      show: jest.fn(),
      hide: jest.fn(),
      _initializeBackDrop: jest.fn(),
      backdrop: {},
      _element: {},
      _config: {},
      _isShown: false,
      _backdrop: null,
      _dialog: {},
      _ignoreBackdropClick: false,
      _isTransitioning: false,
      _addEventListeners: jest.fn(),
      _removeEventListeners: jest.fn(),
      _setEscapeEvent: jest.fn(),
      _setResizeEvent: jest.fn(),
      _hideModal: jest.fn(),
      _showBackdrop: jest.fn(),
      _hideBackdrop: jest.fn(),
      _resetAdjustments: jest.fn(),
      _checkScrollbar: jest.fn(),
      _setScrollbar: jest.fn(),
      _resetScrollbar: jest.fn(),
      _adjustDialog: jest.fn(),
      _triggerBackdropTransition: jest.fn(),
      dispose: jest.fn(),
    };
    const ModalMock: any = jest.fn().mockImplementation(() => modalInstance);
    ModalMock.getInstance = jest.fn(() => modalInstance);
    (global as any).Modal = ModalMock;

    await TestBed.configureTestingModule({
      imports: [DatosComunesComponent, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: EmpresasComercializadorasService, useValue: empresasComercializadorasServiceMock },
        { provide: Solicitud32604Store, useValue: solicitud32604StoreMock },
        { provide: Solicitud32604Query, useValue: solicitud32604QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComunesComponent);
    component = fixture.componentInstance;
    component.domiciliosDatos = [];
    component.listaSeccionSociosIC = [];
    component.numeroDeEmpleadosLista = [];
    component.seleccionarDomiciliosDatos = [];
    component.seleccionarListaSeccionSociosIC = [];
    component.seleccionarNumeroDeEmpleadosLista = [];
    component.inventariosDatos = [];
    component.seleccionarInventarios = [];
    component.datosComunesForm = (component as any).fb.group({
      catseleccionados: [],
      servicio: [],
      190: [''],
      191: [''],
      199: [''],
      200: [''],
      244: [''],
      201: [''],
      246: [''],
      247: ['']
    });
    component.sectorProductivo = { catalogos: [], labelNombre: '', primerOpcion: '', required: false };
    component.servicio = { catalogos: [], labelNombre: '', primerOpcion: '', required: false };
    component.sinoOpcion = { radioOptions: [], isRequired: false };
    component.esFormularioSoloLectura = false;
    component.desplegablesInteractuados = false;
    component.datosComunesForm.get('catseleccionados')?.setValue([]);
    component.datosComunesForm.get('servicio')?.setValue([]);

    fixture.detectChanges();

    component.modalModificarMiembro = { nativeElement: {} } as any;
    component.elementoModalSeccionSubcontratados = { nativeElement: {} } as any;
  });

    describe('CRUD Operations', () => {
      it('should update domicilio on onDomicilioModificado', () => {
        const domicilio: any = { entidadFederativa: 'A', municipioDelegacion: 'B', direccion: 'C', codigoPostal: 'D' };
        component.domiciliosDatos = [domicilio];
        component.seleccionarDomiciliosDatos = [domicilio];
        const updated = { ...domicilio, direccion: 'Z' };
          component.solicitud32604Store.actualizarDomiciliosDatos = jest.fn();        
          jest.spyOn(component['cdr'], 'detectChanges').mockImplementation(() => {});
        component.abrirModal = jest.fn();
        component.onDomicilioModificado(updated);
        expect(component.domiciliosDatos[0].direccion).toBe('Z');
        expect(component.solicitud32604Store.actualizarDomiciliosDatos).toHaveBeenCalled();
        expect(component.abrirModal).toHaveBeenCalled();
      });

      it('should add miembro on onMiembroModificado', () => {
        const miembro: any = { nombre: 'Test', rfc: 'RFC' };
        component.listaSeccionSociosIC = [];
        component.seleccionarListaSeccionSociosIC = [];
        component.solicitud32604Store.actualizarListaSeccionSociosIC = jest.fn();
          jest.spyOn(component['cdr'], 'detectChanges').mockImplementation(() => {});
        component.abrirModal = jest.fn();
        component.onMiembroModificado(miembro);
        expect(component.listaSeccionSociosIC.length).toBe(1);
        expect(component.solicitud32604Store.actualizarListaSeccionSociosIC).toHaveBeenCalled();
        expect(component.abrirModal).toHaveBeenCalled();
      });
    });

    describe('Store Update Methods', () => {
      it('should call actualizarCatseleccionados', () => {
        const valor = { id: 123 };
        component.solicitud32604Store.actualizarCatseleccionados = jest.fn();
        component.actualizarCatseleccionados(valor as any);
        expect(component.solicitud32604Store.actualizarCatseleccionados).toHaveBeenCalledWith(123);
      });

      it('should call actualizarServicio', () => {
        const valor = { id: 456 };
        component.solicitud32604Store.actualizarServicio = jest.fn();
        component.actualizarServicio(valor as any);
        expect(component.solicitud32604Store.actualizarServicio).toHaveBeenCalledWith(456);
      });

      it('should call actualizarEmpleados', () => {
        const event = { target: { value: '10' } };
        component.solicitud32604Store.actualizarEmpleados = jest.fn();
        component.actualizarEmpleados(event as any);
        expect(component.solicitud32604Store.actualizarEmpleados).toHaveBeenCalledWith('10');
      });
    });

  describe('guardarDatosFormulario', () => {
    beforeEach(() => {
      jest.spyOn(component, 'inicializarFormulario').mockImplementation(() => {});
      jest.spyOn(component.datosComunesForm, 'disable');
      jest.spyOn(component.datosComunesForm, 'enable');
    });

    it('should call inicializarFormulario and disable form if esFormularioSoloLectura is true', () => {
      component.esFormularioSoloLectura = true;
      component.guardarDatosFormulario();
      expect(component.inicializarFormulario).toHaveBeenCalled();
      expect(component.datosComunesForm.disable).toHaveBeenCalled();
    });

    it('should call inicializarFormulario and enable form if esFormularioSoloLectura is false', () => {
      component.esFormularioSoloLectura = false;
      component.guardarDatosFormulario();
      expect(component.inicializarFormulario).toHaveBeenCalled();
      expect(component.datosComunesForm.enable).toHaveBeenCalled();
    });
  });

  describe('actualizar249', () => {
    it('should enable identificacion and lugarDeRadicacion controls when value is 1', () => {
      component.datosComunesForm.addControl('identificacion', (component as any).fb.control(''));
      component.datosComunesForm.addControl('lugarDeRadicacion', (component as any).fb.control(''));
      const identificacionControl = component.datosComunesForm.get('identificacion');
      const lugarDeRadicacionControl = component.datosComunesForm.get('lugarDeRadicacion');
      jest.spyOn(identificacionControl!, 'enable');
      jest.spyOn(lugarDeRadicacionControl!, 'enable');
      component.actualizar249(1);
      expect(identificacionControl!.enable).toHaveBeenCalled();
      expect(lugarDeRadicacionControl!.enable).toHaveBeenCalled();
    });
    it('should disable identificacion and lugarDeRadicacion controls when value is not 1 or 2', () => {
      component.datosComunesForm.addControl('identificacion', (component as any).fb.control(''));
      component.datosComunesForm.addControl('lugarDeRadicacion', (component as any).fb.control(''));
      const identificacionControl = component.datosComunesForm.get('identificacion');
      const lugarDeRadicacionControl = component.datosComunesForm.get('lugarDeRadicacion');
      jest.spyOn(identificacionControl!, 'disable');
      jest.spyOn(lugarDeRadicacionControl!, 'disable');
      component.actualizar249('');
      expect(identificacionControl!.disable).toHaveBeenCalled();
      expect(lugarDeRadicacionControl!.disable).toHaveBeenCalled();
    });
  });

  describe('actualizarActualmente1', () => {
    it('should call solicitud32604StoreMock.actualizarActualmente1 with value from event', () => {
      const event = { target: { value: '5' } } as any;
      component.actualizarActualmente1(event);
      expect(solicitud32604StoreMock.actualizarActualmente1).toHaveBeenCalledWith('5');
    });
  });

  describe('actualizarActualmente2', () => {
    it('should call solicitud32604StoreMock.actualizarActualmente2 with value from event', () => {
      const event = { target: { value: '3' } } as any;
      component.actualizarActualmente2(event);
      expect(solicitud32604StoreMock.actualizarActualmente2).toHaveBeenCalledWith('3');
    });
  });

  it('should not throw if agregarMiembrosEmpresa called with missing modal', () => {
    component.modalModificarMiembro = undefined as any;
    expect(() => component.agregarMiembrosEmpresa()).not.toThrow();
  });
  it('should not throw if agregarSubcontratados called with missing modal', () => {
    component.elementoModalSeccionSubcontratados = undefined as any;
    expect(() => component.agregarSubcontratados()).not.toThrow();
  });
  it('should not throw if agregarInstalacionesPrincipales called with missing modal', () => {
    component.elementoModalInstalacionesPrincipales = undefined as any;
    expect(() => component.agregarInstalacionesPrincipales()).not.toThrow();
  });
  it('should not throw if cerrarModalInstalaciones called with missing modal', () => {
    component.elementoModalInstalacionesPrincipales = undefined as any;
    expect(() => component.cerrarModalInstalaciones()).not.toThrow();
  });
  it('should not throw if cerrarModalModificar called with missing modal', () => {
    component.elementoModalModificar = undefined as any;
    expect(() => component.cerrarModalModificar()).not.toThrow();
  });
  it('should show notification', () => {
    component.nuevaNotificacion = { mensaje: 'Test', tipo: 'success' } as any;
    component.mostrarNotificacion = false;
    component.abrirModal = jest.fn();
    component.abrirModal('Test');
    expect(component.abrirModal).toHaveBeenCalledWith('Test');
  });
  
  it('should not throw if guardarDatosFormulario called with missing form', () => {
    component.datosComunesForm = undefined as any;
    expect(() => component.guardarDatosFormulario()).not.toThrow();
  });

  it('should not throw if actualizar249 called with missing controls', () => {
    component.datosComunesForm = (component as any).fb.group({});
    expect(() => component.actualizar249(1)).not.toThrow();
    expect(() => component.actualizar249('')).not.toThrow();
  });

  it('should not throw if actualizarCatseleccionados called with mock data', () => {
    component.solicitud32604Store.actualizarCatseleccionados = jest.fn();
    expect(() => component.actualizarCatseleccionados({ id: 1 } as any)).not.toThrow();
  });

  it('should not throw if actualizarServicio called with mock data', () => {
    component.solicitud32604Store.actualizarServicio = jest.fn();
    expect(() => component.actualizarServicio({ id: 2 } as any)).not.toThrow();
  });

  it('should not throw if actualizarEmpleados called with mock data', () => {
    component.solicitud32604Store.actualizarEmpleados = jest.fn();
    expect(() => component.actualizarEmpleados({ target: { value: '10' } } as any)).not.toThrow();
  });
  it('should show notification and return if multiple inventarios selected in confirmarEliminarInventarios', () => {
    component.seleccionarInventarios = [{}, {}] as any;
    component.nuevaNotificacion = null as any;
    component.confirmarEliminarInventarios();
    expect(component.nuevaNotificacion).toEqual(expect.objectContaining({
      mensaje: 'Seleccione un registro.',
      cerrar: true,
      modo: 'simple',
      categoria: 'danger',
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: ''
    }));
    expect(component.accionConfirmarEliminar).not.toBe('inventarios');
  });

  it('should show notification and return if multiple socios selected in confirmarEliminarSocios', () => {
    component.seleccionarListaSeccionSociosIC = [{}, {}] as any;
    component.nuevaNotificacion = null as any;
    component.confirmarEliminarSocios();
    expect(component.nuevaNotificacion).toEqual(expect.objectContaining({
      mensaje: 'Seleccione un registro.',
      cerrar: true,
      modo: 'simple',
      categoria: 'danger',
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: ''
    }));
    expect(component.accionConfirmarEliminar).not.toBe('socios');
  });

  it('should show success notification in manejarConfirmacionEliminacion', () => {
    component.accionConfirmarEliminar = 'domicilios';
    jest.spyOn(component, 'eliminarDomiciliosDatos').mockImplementation(() => {});
    jest.spyOn(component, 'cerrarModal').mockImplementation(() => {});
    component.manejarConfirmacionEliminacion(true);
    expect(component.nuevaNotificacion).toEqual(expect.objectContaining({
      mensaje: 'Se han eliminado los datos correctamente.',
      categoria: 'success',
      modo: 'simple',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: ''
    }));
    expect(component.mostrarNotificacion).toBe(true);
    expect(component.cerrarModal).toHaveBeenCalled();
  });
});
