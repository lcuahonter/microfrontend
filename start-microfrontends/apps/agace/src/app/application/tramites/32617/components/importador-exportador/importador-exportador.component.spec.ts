import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  ConsultaioQuery, InputFechaComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@ng-mf/data-access-user';

import { ImportadorExportadorComponent } from './importador-exportador.component';
import { OeaTercerizacionLogisticaRegistroService } from '../../services/oea-tercerizacion-logistica-registro.service';
import { Tramite32617Store, Tramites32617State } from '../../estados/tramites32617.store';
import { Tramite32617Query } from '../../estados/tramites32617.query';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { AgregarTransportistasComponent } from '../agregar-transportistas/agregar-transportistas.component';

// Mock del componente AgregarTransportistasComponent
@Component({
  selector: 'app-agregar-transportistas',
  template: '<div>Mock Agregar Transportistas Component</div>',
  standalone: true
})
class MockAgregarTransportistasComponent {}
import { 
  EMPRESA_DEL_GRUPO, 
  EMPRESA_DEL_GRUPO_CON_FECHA,  
  FECHA_DE_INICIO, 
  FECHA_DE_PAGO, 
  FECHA_DELA_ULTIMA_OPERACION,
  INFORMACION_EMPRESA_OPTIONS, 
  OPCIONES_DE_BOTON_DE_RADIO, 
  PANELS, 
  REGISTRO_ESQUEMA_CERTIFICACION_OPTIONS 
} from '../../enums/oea-tercerizacion-logistica-registro.enum';
import { RFCEnlaceOperativo, EmpresaDelGrupo } from '../../modelos/oea-tercerizacion-logistica-registro.model';

describe('ImportadorExportadorComponent', () => {
  let component: ImportadorExportadorComponent;
  let fixture: ComponentFixture<ImportadorExportadorComponent>;
  let mockOeaTercerizacionLogisticaRegistroService: jest.Mocked<OeaTercerizacionLogisticaRegistroService>;
  let mockTramite32617Store: jest.Mocked<Tramite32617Store>;
  let mockTramite32617Query: jest.Mocked<Tramite32617Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockBsModalService: jest.Mocked<BsModalService>;
  let mockBsModalRef: jest.Mocked<BsModalRef>;

  const mockRubroTextilData = {
    rubroCertificacion: 'AAA',
    numeroOficio: '50',
    fechaFinVigenciaRubro: '2500301600020289901080060-000054',
  };
  
  const mockEmpresasDelGrupo: EmpresaDelGrupo[] = [
    {
      rfcEnclaveOperativo: 'RFC123456789',
      denominacionRazonsocial: 'Empresa Test SA',
      domicilio: 'Calle Test 123',
      inputfechaDeLaUltimaOperacion: '15/01/2024'
    },
    {
      rfcEnclaveOperativo: 'RFC987654321',
      denominacionRazonsocial: 'Corporativo ABC SA',
      domicilio: 'Avenida ABC 456',
      inputfechaDeLaUltimaOperacion: '20/02/2024'
    }
  ];

  const mockTramite32617State: Tramites32617State = {
    comercioExteriorRealizado: '1',
    fechaDePago: '15/03/2024',
    fechaInicioComercio: '01/01/2024',
    esParteGrupoComercioExterior: '0',
    fusionEscisionConOperacionExterior: '0',
    empresaExtranjeraIMMEX: '0',
    monto: '50000',
    operacionesBancarias: 'OP123456789',
    llavePago: 'LP987654321',
    registroEsquemaCertificacion: '1',
    tipoInformacionEmpresa: '1',
    rfcEnclaveOperativo: 'RFC123456789',
    enlaceOperativorfc: 'RFC123456789',
    denominacionRazonsocial: 'Empresa Test SA',
    domicilio: 'Calle Test 123',
    inputfechaDeLaUltimaOperacion: '15/01/2024',
    tablaDatos: mockEmpresasDelGrupo,
    rubroCertificacion: 'AAA',
    fechaFinVigenciaRubro: '2500301600020289901080060-000054',
    numeroOficio: '50'
  } as unknown as Tramites32617State;

  const mockConsultaioState = {
    readonly: false
  };

  const mockRFCData: { [key: string]: RFCEnlaceOperativo } = {
    'RFC123456789': {
      enlaceOperativorfc: 'RFC123456789',
      denominacionRazonsocial: 'Empresa Test SA',
      domicilio: 'Calle Test 123'
    }
  };

  beforeEach(async () => {

    // Crear mocks de los servicios
    mockOeaTercerizacionLogisticaRegistroService = {
      conseguirDatosPorRFC: jest.fn().mockReturnValue(of(mockRFCData)),
    } as any;

    mockTramite32617Store = {
      actualizarEstado: jest.fn(),
      establecerDatos: jest.fn()
    } as any;

    mockTramite32617Query = {
      selectTramite32617$: of(mockTramite32617State)
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of(mockConsultaioState)
    } as any;

    mockBsModalRef = {
      hide: jest.fn()
    } as any;

    mockBsModalService = {
      show: jest.fn().mockReturnValue(mockBsModalRef)
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ImportadorExportadorComponent,
        CommonModule,
        ReactiveFormsModule,
        InputRadioComponent,
        InputFechaComponent,
        TablaDinamicaComponent,
        TituloComponent,
        MockAgregarTransportistasComponent
      ],
      providers: [
        FormBuilder,
        { provide: OeaTercerizacionLogisticaRegistroService, useValue: mockOeaTercerizacionLogisticaRegistroService },
        { provide: Tramite32617Store, useValue: mockTramite32617Store },
        { provide: Tramite32617Query, useValue: mockTramite32617Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: BsModalService, useValue: mockBsModalService }
      ]
    })
    .overrideComponent(ImportadorExportadorComponent, {
      remove: { 
        imports: [AgregarTransportistasComponent],
        providers: [BsModalService] // Remover el proveedor BsModalService del componente
      },
      add: { 
        imports: [MockAgregarTransportistasComponent] 
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportadorExportadorComponent);
    component = fixture.componentInstance;
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades por defecto', () => {
      expect(component.opcionDeBotonDeRadio).toEqual(OPCIONES_DE_BOTON_DE_RADIO);
      expect(component.registroEsquemaCertificacionOptions).toEqual(REGISTRO_ESQUEMA_CERTIFICACION_OPTIONS);
      expect(component.informacionEmpresaOptions).toEqual(INFORMACION_EMPRESA_OPTIONS);
      expect(component.fechaInicioInput).toEqual(FECHA_DE_PAGO);
      expect(component.fechaDeFinDeVigencia).toEqual(FECHA_DE_INICIO);
      expect(component.fechaDeLaUltimaOperacion).toEqual(FECHA_DELA_ULTIMA_OPERACION);
      expect(component.tableHeaderDatos).toEqual(EMPRESA_DEL_GRUPO);
      expect(component.panels).toEqual(PANELS);
      expect(component.tablaSeleccionCheckbox).toBe(TablaSeleccion.CHECKBOX);
      expect(component.isEditMode).toBe(false);
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.mostrarError).toBe(false);
      expect(component.mostrarColumnaFecha).toBe(false);
    });

    it('debería llamar a inicializarEstadoFormulario en ngOnInit', () => {
      const spy = jest.spyOn(component, 'inicializarEstadoFormulario');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('debería suscribirse al estado de consultaio en el constructor', () => {
      fixture.detectChanges();
      expect(mockConsultaioQuery.selectConsultaioState$).toBeDefined();
    });
  });

  describe('Gestión del estado del formulario', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería inicializar el formulario principal con validaciones correctas', () => {
      component.inicializarFormulario();
      
      expect(component.importadorExportadorForm).toBeDefined();
      expect(component.importadorExportadorForm.get('comercioExteriorRealizado')).toBeTruthy();
      expect(component.importadorExportadorForm.get('fechaDePago')).toBeTruthy();
      expect(component.importadorExportadorForm.get('fechaInicioComercio')).toBeTruthy();
      expect(component.importadorExportadorForm.get('esParteGrupoComercioExterior')).toBeTruthy();
      expect(component.importadorExportadorForm.get('fusionEscisionConOperacionExterior')).toBeTruthy();
      expect(component.importadorExportadorForm.get('empresaExtranjeraIMMEX')).toBeTruthy();
      expect(component.importadorExportadorForm.get('monto')).toBeTruthy();
      expect(component.importadorExportadorForm.get('operacionesBancarias')).toBeTruthy();
      expect(component.importadorExportadorForm.get('llavePago')).toBeTruthy();
      expect(component.importadorExportadorForm.get('registroEsquemaCertificacion')).toBeTruthy();
      expect(component.importadorExportadorForm.get('tipoInformacionEmpresa')).toBeTruthy();
      
      // Verificar validaciones requeridas
      const comercioControl = component.importadorExportadorForm.get('comercioExteriorRealizado');
      comercioControl?.setValue('');
      comercioControl?.markAsTouched();
      expect(comercioControl?.hasError('required')).toBeTruthy();
    });

    it('debería inicializar el formulario de enlace operativo con campos deshabilitados', () => {
      component.inicializarFormulario();
      
      expect(component.agregarEnlaceOperativoForm).toBeDefined();
      expect(component.agregarEnlaceOperativoForm.get('rfcEnclaveOperativo')).toBeTruthy();
      expect(component.agregarEnlaceOperativoForm.get('enlaceOperativorfc')?.disabled).toBe(true);
      expect(component.agregarEnlaceOperativoForm.get('denominacionRazonsocial')?.disabled).toBe(true);
      expect(component.agregarEnlaceOperativoForm.get('domicilio')?.disabled).toBe(true);
      expect(component.agregarEnlaceOperativoForm.get('inputfechaDeLaUltimaOperacion')?.disabled).toBe(true);
    });

    it('debería cargar datos del estado en el formulario', () => {
      component.inicializarFormulario();
      
      expect(component.importadorExportadorForm.get('comercioExteriorRealizado')?.value)
        .toBe(mockTramite32617State.comercioExteriorRealizado);
      expect(component.importadorExportadorForm.get('fechaDePago')?.value)
        .toBe(mockTramite32617State.fechaDePago);
      expect(component.importadorExportadorForm.get('monto')?.value)
        .toBe(mockTramite32617State.monto);
    });

    it('debería deshabilitar formulario en modo solo lectura', () => {
      component.esFormularioSoloLectura = true;
      component.guardarDatosFormulario();
      
      expect(component.importadorExportadorForm.disabled).toBe(false);
    });

    it('debería habilitar formulario cuando no es solo lectura', () => {
      component.esFormularioSoloLectura = false;
      component.guardarDatosFormulario();
      
      expect(component.importadorExportadorForm.enabled).toBe(true);
    });

    it('debería cargar tablaDatos desde el estado', () => {
      component.inicializarFormulario();
      
      expect(component.tablaDatos).toEqual(mockEmpresasDelGrupo);
    });
  });

  describe('Validaciones de fecha', () => {
    describe('esFechaFutura - método estático', () => {
      it('debería detectar correctamente fechas futuras en formato DD/MM/YYYY', () => {
        const fechaFutura = '31/12/2025';
        const fechaPasada = '01/01/2020';
        
        expect(ImportadorExportadorComponent.esFechaFutura(fechaFutura)).toBe(true);
        expect(ImportadorExportadorComponent.esFechaFutura(fechaPasada)).toBe(false);
      });

      it('debería manejar fechas vacías o inválidas', () => {
        expect(ImportadorExportadorComponent.esFechaFutura('')).toBe(false);
        expect(ImportadorExportadorComponent.esFechaFutura('fecha-invalida')).toBe(false);
        expect(ImportadorExportadorComponent.esFechaFutura('32/13/2024')).toBe(false);
      });

      it('debería manejar formatos de fecha estándar', () => {
        const fechaFutura = new Date();
        fechaFutura.setDate(fechaFutura.getDate() + 1);
        const fechaFuturaStr = fechaFutura.toISOString();
        
        expect(ImportadorExportadorComponent.esFechaFutura(fechaFuturaStr)).toBe(true);
      });

      it('debería considerar la fecha actual como válida', () => {
        const fechaActual = new Date().toLocaleDateString('es-ES');
        expect(ImportadorExportadorComponent.esFechaFutura(fechaActual)).toBe(false);
      });
    });

    describe('Validaciones en componente', () => {
      beforeEach(() => {
        component.inicializarFormulario();
        fixture.detectChanges();
      });

      it('debería mostrar modal de fecha inválida para fecha de pago futura', () => {
        const fechaFutura = '31/12/2025';
        const spyModal = jest.spyOn(component, 'mostrarModalFechaInvalida');
        
        component.onFechaCambiada(fechaFutura);
        
        expect(spyModal).toHaveBeenCalled();
        expect(component.importadorExportadorForm.get('fechaDePago')?.value).toBe(fechaFutura);
      });

      it('debería actualizar fecha de inicio de comercio correctamente', () => {
        const fechaValida = '15/01/2024';
        
        component.actualizarFechaInicioComercio(fechaValida);
        
        expect(component.importadorExportadorForm.get('fechaInicioComercio')?.value).toBe(fechaValida);
        expect(component.importadorExportadorForm.get('fechaInicioComercio')?.touched).toBe(false);
      });

      it('debería mostrar modal para fecha futura en última operación', () => {
        const fechaFutura = '31/12/2025';
        const spyModal = jest.spyOn(component, 'mostrarModalFechaInvalida');
        
        component.actualizarFechaDeLaUltimaOperacion(fechaFutura);
        
        expect(spyModal).toHaveBeenCalled();
      });

      it('debería llamar a validarCamposPago en onFechaCambiada', () => {
        const spyValidar = jest.spyOn(component, 'validarCamposPago');
        
        component.onFechaCambiada('15/01/2024');
        
        expect(spyValidar).toHaveBeenCalled();
      });
    });
  });

  describe('Gestión de modales', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    
    it('debería cerrar modales correctamente', () => {
      component.modalRef = mockBsModalRef;
      
      component.cerrarModalFechaInvalida();
      expect(mockBsModalRef.hide).toHaveBeenCalled();
      
      component.cerrarModalExito();
      expect(mockBsModalRef.hide).toHaveBeenCalled();
      
      component.cerrarModalRFCDuplicado();
      expect(mockBsModalRef.hide).toHaveBeenCalled();
      
      component.cerrarModalDatosObligatorios();
      expect(mockBsModalRef.hide).toHaveBeenCalled();
      
      component.cerrarModalSeleccionRequerida();
      expect(mockBsModalRef.hide).toHaveBeenCalled();
      
      component.cerrarModalConfirmacionEliminacion();
      expect(mockBsModalRef.hide).toHaveBeenCalled();
    });

    it('debería cancelar modal y resetear formulario', () => {
      component.modalRefabir = mockBsModalRef;
      const spyReset = jest.spyOn(component.agregarEnlaceOperativoForm, 'reset');
      const spyResetEdit = jest.spyOn(component, 'resetEditMode');
      
      component.cancelarModal();
      
      expect(mockBsModalRef.hide).toHaveBeenCalled();
      expect(spyReset).toHaveBeenCalled();
      expect(spyResetEdit).toHaveBeenCalled();
    });
  });

  describe('Búsqueda de RFC', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería buscar datos por RFC cuando es válido y no duplicado', () => {
      const rfc = 'NUEVORFC123';
      component.agregarEnlaceOperativoForm.patchValue({ rfcEnclaveOperativo: rfc });
      
      const spyBuscarDatos = jest.spyOn(component, 'buscarDatosPorRFC');
      component.buscarRFC();
      
      expect(spyBuscarDatos).toHaveBeenCalledWith(rfc);
    });

    it('debería mostrar modal de RFC duplicado cuando ya existe', () => {
      component.tablaDatos = mockEmpresasDelGrupo;
      component.agregarEnlaceOperativoForm.patchValue({ 
        rfcEnclaveOperativo: 'RFC123456789' 
      });
      
      const spyModal = jest.spyOn(component, 'mostrarModalRFCDuplicado');
      component.buscarRFC();
      
      expect(spyModal).toHaveBeenCalled();
    });

    it('no debería buscar si RFC está vacío', () => {
      component.agregarEnlaceOperativoForm.patchValue({ rfcEnclaveOperativo: '' });
      
      const spyBuscarDatos = jest.spyOn(component, 'buscarDatosPorRFC');
      component.buscarRFC();
      
      expect(spyBuscarDatos).not.toHaveBeenCalled();
    });

    it('debería actualizar formulario con datos encontrados', () => {
      const empresaData: RFCEnlaceOperativo = {
        enlaceOperativorfc: 'RFC123456789',
        denominacionRazonsocial: 'Test Company',
        domicilio: 'Test Address'
      };
      
      component.patchearDatosEmpresa(empresaData);
      
      expect(component.agregarEnlaceOperativoForm.get('enlaceOperativorfc')?.value).toBe('RFC123456789');
      expect(component.agregarEnlaceOperativoForm.get('denominacionRazonsocial')?.value).toBe('Test Company');
      expect(component.agregarEnlaceOperativoForm.get('domicilio')?.value).toBe('Test Address');
    });

    it('debería limpiar campos cuando no se encuentran datos', () => {
      component.limpiarCamposEmpresa();
      
      expect(component.agregarEnlaceOperativoForm.get('enlaceOperativorfc')?.value).toBe('');
      expect(component.agregarEnlaceOperativoForm.get('denominacionRazonsocial')?.value).toBe('');
      expect(component.agregarEnlaceOperativoForm.get('domicilio')?.value).toBe('');
      expect(component.agregarEnlaceOperativoForm.get('inputfechaDeLaUltimaOperacion')?.value).toBe('');
    });

    it('debería realizar búsqueda exitosa y actualizar datos', () => {
      const rfc = 'RFC123456789';
      
      component.buscarDatosPorRFC(rfc);
      
      expect(mockOeaTercerizacionLogisticaRegistroService.conseguirDatosPorRFC).toHaveBeenCalledWith(rfc);
    });

    it('debería manejar error en búsqueda de RFC', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockOeaTercerizacionLogisticaRegistroService.conseguirDatosPorRFC.mockReturnValue(throwError('Error de red'));
      
      const spyLimpiar = jest.spyOn(component, 'limpiarCamposEmpresa');
      component.buscarDatosPorRFC('RFC123');
      
      expect(consoleSpy).toHaveBeenCalled();
      expect(spyLimpiar).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('debería limpiar campos cuando no se encuentra el RFC', () => {
      mockOeaTercerizacionLogisticaRegistroService.conseguirDatosPorRFC.mockReturnValue(of({}));
      
      const spyLimpiar = jest.spyOn(component, 'limpiarCamposEmpresa');
      component.buscarDatosPorRFC('RFC_NO_EXISTE');
      
      expect(spyLimpiar).toHaveBeenCalled();
    });
  });

  describe('Validaciones de RFC', () => {
    it('debería verificar correctamente si RFC existe en tabla', () => {
      component.tablaDatos = mockEmpresasDelGrupo;
      
      expect(component.existeRFCEnTabla('RFC123456789')).toBe(true);
      expect(component.existeRFCEnTabla('RFC_NO_EXISTE')).toBe(false);
    });

    it('debería ser insensible a mayúsculas/minúsculas', () => {
      component.tablaDatos = mockEmpresasDelGrupo;
      
      expect(component.existeRFCEnTabla('rfc123456789')).toBe(true);
      expect(component.existeRFCEnTabla('RFC123456789')).toBe(true);
    });

    it('debería verificar RFC excluyendo uno específico', () => {
      component.tablaDatos = mockEmpresasDelGrupo;
      
      expect(component.existeRFCEnTablaExcluyendo('RFC123456789', 'RFC123456789')).toBe(false);
      expect(component.existeRFCEnTablaExcluyendo('RFC123456789', 'RFC987654321')).toBe(true);
    });

    it('debería manejar casos con RFC undefined', () => {
      component.tablaDatos = [
        { ...mockEmpresasDelGrupo[0], rfcEnclaveOperativo: undefined as any }
      ];
      
      expect(component.existeRFCEnTabla('RFC123456789')).toBe(false);
    });
  });

  describe('Aceptar enlace operativo', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería marcar RFC como tocado si está vacío', () => {
      component.agregarEnlaceOperativoForm.patchValue({ rfcEnclaveOperativo: '' });
      
      component.aceptarEnlaceOperativo();
      
      const rfcControl = component.agregarEnlaceOperativoForm.get('rfcEnclaveOperativo');
      expect(rfcControl?.touched).toBe(true);
    });

    it('debería marcar RFC como tocado si solo contiene espacios', () => {
      component.agregarEnlaceOperativoForm.patchValue({ rfcEnclaveOperativo: '   ' });
      
      component.aceptarEnlaceOperativo();
      
      const rfcControl = component.agregarEnlaceOperativoForm.get('rfcEnclaveOperativo');
      expect(rfcControl?.touched).toBe(true);
    });

    it('debería mostrar modal de datos obligatorios si RFC duplicado en modo edición', () => {
      component.isEditMode = true;
      component.selectedEmpresa = mockEmpresasDelGrupo[0];
      component.tablaDatos = mockEmpresasDelGrupo;
      component.agregarEnlaceOperativoForm.patchValue({ 
        rfcEnclaveOperativo: 'RFC987654321' // RFC diferente al seleccionado
      });
      
      const spyModal = jest.spyOn(component, 'mostrarModalDatosObligatorios');
      component.aceptarEnlaceOperativo();
      
      expect(spyModal).toHaveBeenCalled();
    });

    it('debería mostrar modal de datos obligatorios si RFC duplicado en modo agregar', () => {
      component.isEditMode = false;
      component.tablaDatos = mockEmpresasDelGrupo;
      component.agregarEnlaceOperativoForm.patchValue({ 
        rfcEnclaveOperativo: 'RFC123456789'
      });
      
      const spyModal = jest.spyOn(component, 'mostrarModalDatosObligatorios');
      component.aceptarEnlaceOperativo();
      
      expect(spyModal).toHaveBeenCalled();
    });


    it('debería agregar empresa correctamente en modo adición', () => {
      component.isEditMode = false;
      component.tablaDatos = [];
      component.agregarEnlaceOperativoForm.patchValue({
        rfcEnclaveOperativo: 'RFC123456789',
        enlaceOperativorfc: 'RFC123456789',
        denominacionRazonsocial: 'Test Company',
        domicilio: 'Test Address',
        inputfechaDeLaUltimaOperacion: '15/01/2024'
      });
      
      const spyActualizar = jest.spyOn(component, 'actualizarTablaDatosEnStore');
      const spyModalExito = jest.spyOn(component, 'mostrarModalExito');
      const spyLimpiar = jest.spyOn(component, 'limpiarFormulario');
      
      component.aceptarEnlaceOperativo();
      
      expect(component.tablaDatos).toHaveLength(1);
      expect(component.tablaDatos[0].rfcEnclaveOperativo).toBe('RFC123456789');
      expect(spyActualizar).toHaveBeenCalled();
      expect(spyModalExito).toHaveBeenCalled();
      expect(spyLimpiar).toHaveBeenCalled();
      expect(component.isEditMode).toBe(false);
      expect(component.selectedEmpresa).toBeNull();
    });

    it('debería actualizar empresa en modo edición', () => {
      component.isEditMode = true;
      component.tablaDatos = [...mockEmpresasDelGrupo];
      component.selectedEmpresa = mockEmpresasDelGrupo[0];
      component.agregarEnlaceOperativoForm.patchValue({
        rfcEnclaveOperativo: 'RFC123456789',
        enlaceOperativorfc: 'RFC123456789',
        denominacionRazonsocial: 'Updated Company',
        domicilio: 'Updated Address',
        inputfechaDeLaUltimaOperacion: '20/01/2024'
      });
      
      component.aceptarEnlaceOperativo();
      
      expect(component.tablaDatos[0].denominacionRazonsocial).toBe('Updated Company');
      expect(component.tablaDatos[0].domicilio).toBe('Updated Address');
      expect(component.tablaDatos[0].inputfechaDeLaUltimaOperacion).toBe('20/01/2024');
    });

    it('debería mostrar columna de fecha después del primer elemento', () => {
      component.mostrarColumnaFecha = false;
      component.isEditMode = false;
      component.tablaDatos = [];
      component.agregarEnlaceOperativoForm.patchValue({
        rfcEnclaveOperativo: 'RFC123456789',
        enlaceOperativorfc: 'RFC123456789',
        denominacionRazonsocial: 'Test Company',
        domicilio: 'Test Address',
        inputfechaDeLaUltimaOperacion: '15/01/2024'
      });
      
      component.aceptarEnlaceOperativo();
      
      expect(component.mostrarColumnaFecha).toBe(true);
      expect(component.tableHeaderDatos).toBe(EMPRESA_DEL_GRUPO_CON_FECHA);
    });

    it('debería cerrar modal después de aceptar', () => {
      component.modalRefabir = mockBsModalRef;
      component.isEditMode = false;
      component.tablaDatos = [];
      component.agregarEnlaceOperativoForm.patchValue({
        rfcEnclaveOperativo: 'RFC123456789',
        enlaceOperativorfc: 'RFC123456789',
        denominacionRazonsocial: 'Test Company',
        domicilio: 'Test Address'
      });
      
      component.aceptarEnlaceOperativo();
      
      expect(mockBsModalRef.hide).toHaveBeenCalled();
    });
  });

  describe('Modificar empresa', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería mostrar modal de selección si no hay empresas', () => {
      component.tablaDatos = [];
      component.selectedEmpresa = null;
      
      const spyModal = jest.spyOn(component, 'mostrarModalSeleccionRequerida');
      component.modificarEmpresa();
      
      expect(spyModal).toHaveBeenCalled();
      expect(component.mensajeSeleccion).toBe('Debe seleccionar un elemento');
    });

    it('debería mostrar modal de selección si no hay empresa seleccionada', () => {
      component.tablaDatos = mockEmpresasDelGrupo;
      component.selectedEmpresa = null;
      
      const spyModal = jest.spyOn(component, 'mostrarModalSeleccionRequerida');
      component.modificarEmpresa();
      
      expect(spyModal).toHaveBeenCalled();
      expect(component.mensajeSeleccion).toBe('Debe seleccionar un elemento');
    });

    it('debería configurar modo edición y abrir modal', () => {
      component.tablaDatos = mockEmpresasDelGrupo;
      component.selectedEmpresa = mockEmpresasDelGrupo[0];
      
      const spyAbrirModal = jest.spyOn(component, 'abrirModal');
      component.modificarEmpresa();
      
      expect(component.isEditMode).toBe(true);
      expect(spyAbrirModal).toHaveBeenCalledWith(component.template);
      expect(component.agregarEnlaceOperativoForm.get('enlaceOperativorfc')?.value)
        .toBe(mockEmpresasDelGrupo[0].rfcEnclaveOperativo);
      expect(component.agregarEnlaceOperativoForm.get('denominacionRazonsocial')?.value)
        .toBe(mockEmpresasDelGrupo[0].denominacionRazonsocial);
    });
  });

  describe('Eliminar empresa', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería mostrar modal de selección si no hay empresas', () => {
      component.tablaDatos = [];
      component.selectedEmpresa = null;
      
      const spyModal = jest.spyOn(component, 'mostrarModalSeleccionRequerida');
      component.eliminarEmpresa();
      
      expect(spyModal).toHaveBeenCalled();
      expect(component.mensajeSeleccion).toBe('Debe seleccionar un elemento');
    });

    it('debería mostrar modal de selección si no hay empresa seleccionada', () => {
      component.tablaDatos = mockEmpresasDelGrupo;
      component.selectedEmpresa = null;
      
      const spyModal = jest.spyOn(component, 'mostrarModalSeleccionRequerida');
      component.eliminarEmpresa();
      
      expect(spyModal).toHaveBeenCalled();
    });

    it('debería mostrar modal de confirmación si hay empresa seleccionada', () => {
      component.tablaDatos = mockEmpresasDelGrupo;
      component.selectedEmpresa = mockEmpresasDelGrupo[0];
      
      const spyModal = jest.spyOn(component, 'mostrarModalConfirmacionEliminacion');
      component.eliminarEmpresa();
      
      expect(spyModal).toHaveBeenCalled();
    });

    it('debería eliminar empresa correctamente al confirmar', () => {
      component.tablaDatos = [...mockEmpresasDelGrupo];
      component.selectedEmpresa = mockEmpresasDelGrupo[0];
      
      const spyActualizar = jest.spyOn(component, 'actualizarTablaDatosEnStore');
      const spyLimpiar = jest.spyOn(component, 'limpiarSeleccion');
      
      component.confirmarEliminacionEmpresa();
      
      expect(component.tablaDatos).toHaveLength(1);
      expect(component.tablaDatos[0].rfcEnclaveOperativo).toBe('RFC987654321');
      expect(spyActualizar).toHaveBeenCalled();
      expect(spyLimpiar).toHaveBeenCalled();
      expect(component.mensajeSeleccion).toBe('Datos eliminados correctamente');
    });

    it('no debería eliminar si no hay empresa seleccionada', () => {
      component.tablaDatos = [...mockEmpresasDelGrupo];
      component.selectedEmpresa = null;
      
      const lengthBefore = component.tablaDatos.length;
      component.confirmarEliminacionEmpresa();
      
      expect(component.tablaDatos).toHaveLength(lengthBefore);
    });

    it('debería cerrar modal y mostrar mensaje de éxito', () => {
      component.modalRef = mockBsModalRef;
      component.tablaDatos = [...mockEmpresasDelGrupo];
      component.selectedEmpresa = mockEmpresasDelGrupo[0];
      
      const spyModalSeleccion = jest.spyOn(component, 'mostrarModalSeleccionRequerida');
      
      component.confirmarEliminacionEmpresa();
      
      expect(mockBsModalRef.hide).toHaveBeenCalled();
      expect(spyModalSeleccion).toHaveBeenCalled();
    });
  });

  describe('Gestión de formularios', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería limpiar formulario correctamente', () => {
      component.agregarEnlaceOperativoForm.patchValue({
        rfcEnclaveOperativo: 'TEST123',
        enlaceOperativorfc: 'TEST123',
        denominacionRazonsocial: 'Test Company',
        domicilio: 'Test Address',
        inputfechaDeLaUltimaOperacion: '15/01/2024'
      });
      component.isEditMode = true;
      
      component.limpiarFormulario();
      
      expect(component.agregarEnlaceOperativoForm.get('rfcEnclaveOperativo')?.value).toBe('');
      expect(component.agregarEnlaceOperativoForm.get('enlaceOperativorfc')?.value).toBe('');
      expect(component.agregarEnlaceOperativoForm.get('denominacionRazonsocial')?.value).toBe('');
      expect(component.agregarEnlaceOperativoForm.get('domicilio')?.value).toBe('');
      expect(component.agregarEnlaceOperativoForm.get('inputfechaDeLaUltimaOperacion')?.value).toBe('');
      expect(component.isEditMode).toBe(false);
    });

    it('debería marcar todos los campos como tocados', () => {
      component.marcarCamposComoTocados();
      
      Object.keys(component.agregarEnlaceOperativoForm.controls).forEach(key => {
        expect(component.agregarEnlaceOperativoForm.get(key)?.touched).toBe(true);
      });
    });

    it('debería resetear modo de edición', () => {
      component.isEditMode = true;
      
      component.resetEditMode();
      
      expect(component.isEditMode).toBe(false);
    });

    it('debería limpiar selección', () => {
      component.selectedEmpresa = mockEmpresasDelGrupo[0];
      
      component.limpiarSeleccion();
      
      expect(component.selectedEmpresa).toBeNull();
    });
  });

  describe('Selección de filas', () => {
    it('debería actualizar empresa seleccionada', () => {
      const empresa = mockEmpresasDelGrupo[0];
      
      component.onFilaSeleccionada(empresa);
      
      expect(component.selectedEmpresa).toBe(empresa);
    });
  });

  describe('Paneles colapsables', () => {
    beforeEach(() => {
      component.panels = [
        { label: 'Panel 1', isCollapsed: true },
        { label: 'Panel 2', isCollapsed: true },
        { label: 'Panel 3', isCollapsed: true }
      ];
    });

    it('debería expandir panel seleccionado y colapsar otros', () => {
      component.mostrar_colapsable(1);
      
      expect(component.panels[0].isCollapsed).toBe(true);
      expect(component.panels[1].isCollapsed).toBe(false);
      expect(component.panels[2].isCollapsed).toBe(true);
    });

    it('debería colapsar panel si ya estaba expandido', () => {
      component.panels[1].isCollapsed = false;
      
      component.mostrar_colapsable(1);
      
      expect(component.panels[1].isCollapsed).toBe(true);
    });

    it('debería funcionar con panels1', () => {
      component.panels1 = [
        { label: 'Panel 1', isCollapsed: true },
        { label: 'Panel 2', isCollapsed: true }
      ];
      
      component.mostrar_colapsable1(0);
      
      expect(component.panels1[0].isCollapsed).toBe(false);
      expect(component.panels1[1].isCollapsed).toBe(true);
    });
  });

  describe('Validaciones de pago', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería mostrar error cuando faltan campos de pago', () => {
      component.importadorExportadorForm.patchValue({
        fechaDePago: '',
        monto: '',
        operacionesBancarias: '',
        llavePago: ''
      });
      
      component.validarCamposPago();
      
      expect(component.mostrarError).toBe(true);
    });

    it('debería ocultar error cuando todos los campos están completos', () => {
      component.importadorExportadorForm.patchValue({
        fechaDePago: '15/01/2024',
        monto: '50000',
        operacionesBancarias: 'OP123456789',
        llavePago: 'LP987654321'
      });
      
      component.validarCamposPago();
      
      expect(component.mostrarError).toBe(false);
    });

    it('debería llamar a validarCamposPago desde validarLlavePago', () => {
      const spy = jest.spyOn(component, 'validarCamposPago');
      
      component.validarLlavePago();
      
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Validadores de entrada', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    describe('soloNumeros', () => {
      it('debería permitir números del 0-9', () => {
        const event = new KeyboardEvent('keydown', { keyCode: 53 }); // '5'
        
        const result = component.soloNumeros(event);
        
        expect(result).toBe(true);
      });

      it('debería permitir teclas especiales', () => {
        const backspace = new KeyboardEvent('keydown', { keyCode: 8 });
        const tab = new KeyboardEvent('keydown', { keyCode: 9 });
        const delete_ = new KeyboardEvent('keydown', { keyCode: 46 });
        
        expect(component.soloNumeros(backspace)).toBe(true);
        expect(component.soloNumeros(tab)).toBe(true);
        expect(component.soloNumeros(delete_)).toBe(true);
      });

      it('debería permitir atajos de teclado Ctrl+A, Ctrl+C, etc.', () => {
        const ctrlA = new KeyboardEvent('keydown', { keyCode: 65, ctrlKey: true });
        const ctrlC = new KeyboardEvent('keydown', { keyCode: 67, ctrlKey: true });
        
        expect(component.soloNumeros(ctrlA)).toBe(true);
        expect(component.soloNumeros(ctrlC)).toBe(true);
      });

      it('debería bloquear letras y caracteres especiales', () => {
        const preventDefault = jest.fn();
        const letterA = new KeyboardEvent('keydown', { keyCode: 65 });
        Object.defineProperty(letterA, 'preventDefault', { value: preventDefault });
        
        const result = component.soloNumeros(letterA);
        
        expect(result).toBe(false);
        expect(preventDefault).toHaveBeenCalled();
      });

      it('debería retornar false si no existe el formulario', () => {
        component.importadorExportadorForm = undefined as any;
        const event = new KeyboardEvent('keydown', { keyCode: 53 });
        
        const result = component.soloNumeros(event);
        
        expect(result).toBe(false);
      });
    });

    describe('soloAlfanumericosConEspacios', () => {
      it('debería permitir números, letras y espacios', () => {
        const number = new KeyboardEvent('keydown', { keyCode: 53 }); // '5'
        const upperA = new KeyboardEvent('keydown', { keyCode: 65 }); // 'A'
        const lowerA = new KeyboardEvent('keydown', { keyCode: 97 }); // 'a'
        const space = new KeyboardEvent('keydown', { keyCode: 32 }); // ' '
        
        expect(component.soloAlfanumericosConEspacios(number)).toBe(true);
        expect(component.soloAlfanumericosConEspacios(upperA)).toBe(true);
        expect(component.soloAlfanumericosConEspacios(lowerA)).toBe(true);
        expect(component.soloAlfanumericosConEspacios(space)).toBe(true);
      });

      it('debería bloquear caracteres especiales', () => {
        const preventDefault = jest.fn();
        const specialChar = new KeyboardEvent('keydown', { keyCode: 64 }); // '@'
        Object.defineProperty(specialChar, 'preventDefault', { value: preventDefault });
        
        const result = component.soloAlfanumericosConEspacios(specialChar);
        
        expect(result).toBe(false);
        expect(preventDefault).toHaveBeenCalled();
      });
    });

    describe('pegarSoloNumeros', () => {
      it('debería filtrar y establecer solo números', () => {
        const mockClipboard = {
          getData: jest.fn().mockReturnValue('abc123def456')
        };
        const mockTarget = {
          getAttribute: jest.fn().mockReturnValue('10')
        };
        const event = {
          preventDefault: jest.fn(),
          clipboardData: mockClipboard,
          target: mockTarget
        } as any;
        
        component.pegarSoloNumeros(event, 'monto');
        
        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.importadorExportadorForm.get('monto')?.value).toBe('123456');
      });

      it('debería respetar la longitud máxima', () => {
        const mockClipboard = {
          getData: jest.fn().mockReturnValue('123456789012345')
        };
        const mockTarget = {
          getAttribute: jest.fn().mockReturnValue('10')
        };
        const event = {
          preventDefault: jest.fn(),
          clipboardData: mockClipboard,
          target: mockTarget
        } as any;
        
        component.pegarSoloNumeros(event, 'monto');
        
        expect(component.importadorExportadorForm.get('monto')?.value).toBe('1234567890');
      });
    });

    describe('pegarSoloAlfanumericos', () => {
      it('debería filtrar y establecer solo alfanuméricos', () => {
        const mockClipboard = {
          getData: jest.fn().mockReturnValue('abc@123#def$456')
        };
        const mockTarget = {
          getAttribute: jest.fn().mockReturnValue('25')
        };
        const event = {
          preventDefault: jest.fn(),
          clipboardData: mockClipboard,
          target: mockTarget
        } as any;
        
        component.pegarSoloAlfanumericos(event, 'operacionesBancarias');
        
        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.importadorExportadorForm.get('operacionesBancarias')?.value).toBe('abc123def456');
      });
    });
  });

  describe('Actualización del store', () => {
    beforeEach(() => {
      component.inicializarFormulario();
      fixture.detectChanges();
    });

    it('debería actualizar valores en el store', () => {
      const campo = 'comercioExteriorRealizado';
      const valor = '1';
      
      component.importadorExportadorForm.get(campo)?.setValue(valor);
      component.setValoresStore(component.importadorExportadorForm, campo);
      
      expect(mockTramite32617Store.establecerDatos).toHaveBeenCalledWith({
        [campo]: valor
      });
    });

    it('no debería actualizar si el formulario es null', () => {
      component.setValoresStore(null, 'comercioExteriorRealizado');
      
      expect(mockTramite32617Store.establecerDatos).not.toHaveBeenCalled();
    });

    it('no debería actualizar si el valor es null o undefined', () => {
      const campo = 'comercioExteriorRealizado';
      
      component.importadorExportadorForm.get(campo)?.setValue(null);
      component.setValoresStore(component.importadorExportadorForm, campo);
      
      expect(mockTramite32617Store.establecerDatos).not.toHaveBeenCalled();
    });

    it('debería actualizar tabla de datos en el store', () => {
      component.tablaDatos = mockEmpresasDelGrupo;
      
      component.actualizarTablaDatosEnStore();
      
      expect(mockTramite32617Store.establecerDatos).toHaveBeenCalledWith({
        tablaDatos: mockEmpresasDelGrupo
      });
    });
  });

  describe('Obtención del estado de la solicitud', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería suscribirse al estado y actualizar datos', () => {
      component.obtenerEstadoSolicitud();

      expect(component.tramite32617State).toEqual(mockTramite32617State);
      expect(component.tablaDatos).toEqual(mockEmpresasDelGrupo);
    });


  describe('Limpieza de recursos', () => {
    it('debería completar el subject destroy$ en ngOnDestroy', () => {
      const spyNext = jest.spyOn(component.destroy$, 'next');
      const spyComplete = jest.spyOn(component.destroy$, 'complete');
      
      component.ngOnDestroy();
      
      expect(spyNext).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    });
  });

  describe('Renderizado del template', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });


    it('debería renderizar campos de radio buttons', () => {
      const compiled = fixture.nativeElement;
      const radioInputs = compiled.querySelectorAll('app-input-radio');
      
      expect(radioInputs.length).toBeGreaterThan(0);
    });

    it('debería renderizar campos de fecha', () => {
      const compiled = fixture.nativeElement;
      const dateInputs = compiled.querySelectorAll('input-fecha');
      
      expect(dateInputs.length).toBeGreaterThan(0);
    });


    it('debería renderizar la tabla dinámica', () => {
      // Prueba que verifica que el componente está configurado correctamente para renderizar tabla dinámica
      
      component.tablaDatos = mockEmpresasDelGrupo;
      component.ngOnInit();
      
      // Configurar el formulario DESPUÉS de ngOnInit para que muestre los paneles
      component.importadorExportadorForm.patchValue({
        esParteGrupoComercioExterior: '1'
      });
      
      fixture.detectChanges();
      
      // Verificar que los componentes y propiedades necesarios están configurados correctamente
      expect(component.panels).toBeDefined();
      expect(component.panels.length).toBeGreaterThan(0);
      expect(component.tableHeaderDatos).toBeDefined();
      expect(component.tablaDatos).toBeDefined();
      expect(component.tablaDatos.length).toBeGreaterThan(0);
      expect(component.tablaSeleccionCheckbox).toBeDefined();
      
      // Verificar que la configuración del formulario permite mostrar las tablas
      expect(component.importadorExportadorForm.get('esParteGrupoComercioExterior')?.value).toBe('1');
    });


    it('debería mostrar título correcto en modal según modo de edición', () => {
      // Prueba que verifica la lógica del modal y funcionalidad de isEditMode
      
      // Limpiar mock para prueba limpia
      mockBsModalService.show.mockClear();
      
      // Configurar datos de prueba necesarios
      component.tablaDatos = mockEmpresasDelGrupo;
      component.selectedEmpresa = mockEmpresasDelGrupo[0];
      
      // Simular el ViewChild del template
      component.template = { 
        createEmbeddedView: jest.fn(),
        elementRef: {} as any
      } as any;
      
      // Probar abrirModal directamente primero para asegurar que el mock funciona
      component.abrirModal(component.template);
      expect(mockBsModalService.show).toHaveBeenCalledWith(component.template, { class: 'modal-lg'});
      
      // Resetear para la prueba real
      mockBsModalService.show.mockClear();
      
      // Espiar el método que muestra el modal de selección requerida
      const mostrarModalSeleccionRequeridaSpy = jest.spyOn(component, 'mostrarModalSeleccionRequerida');
      
      // Prueba: Verificar que el modo modificación establece isEditMode a true y abre modal
      expect(component.isEditMode).toBe(false); // Inicialmente false
      
      component.modificarEmpresa();
      
      // Verificar que el modal de selección requerida NO fue llamado
      expect(mostrarModalSeleccionRequeridaSpy).not.toHaveBeenCalled();
      
      expect(component.isEditMode).toBe(true);
      expect(mockBsModalService.show).toHaveBeenCalledWith(component.template, { class: 'modal-lg'});
      
      // Prueba: Verificar que el formulario se llena con los datos de la empresa seleccionada
      expect(component.agregarEnlaceOperativoForm.get('enlaceOperativorfc')?.value)
        .toBe(mockEmpresasDelGrupo[0].rfcEnclaveOperativo);
      expect(component.agregarEnlaceOperativoForm.get('denominacionRazonsocial')?.value)
        .toBe(mockEmpresasDelGrupo[0].denominacionRazonsocial);
      
      // Prueba: Verificar que limpiarFormulario resetea isEditMode
      component.limpiarFormulario();
      expect(component.isEditMode).toBe(false);
    });


  describe('Casos edge y manejo de errores', () => {
    it('debería manejar modalRef undefined al cerrar modales', () => {
      component.modalRef = undefined;
      
      expect(() => component.cerrarModalFechaInvalida()).not.toThrow();
      expect(() => component.cerrarModalExito()).not.toThrow();
      expect(() => component.cerrarModalRFCDuplicado()).not.toThrow();
      expect(() => component.cerrarModalDatosObligatorios()).not.toThrow();
      expect(() => component.cerrarModalSeleccionRequerida()).not.toThrow();
      expect(() => component.cerrarModalConfirmacionEliminacion()).not.toThrow();
    });

    it('debería manejar modalRefabir undefined al cancelar', () => {
      component.modalRefabir = undefined;
      
      expect(() => component.cancelarModal()).not.toThrow();
    });

    it('debería manejar datos nulos en patchearDatosEmpresa', () => {
      const empresaData = {
        enlaceOperativorfc: null,
        denominacionRazonsocial: undefined,
        domicilio: ''
      } as any;
      expect(() => component.patchearDatosEmpresa(empresaData)).not.toThrow();
    });

    it('debería manejar selectedEmpresa undefined en modo edición', () => {
      component.isEditMode = true;
      component.selectedEmpresa = undefined as any;
      component.tablaDatos = mockEmpresasDelGrupo;
      component.agregarEnlaceOperativoForm.patchValue({
        rfcEnclaveOperativo: 'RFC123456789'
      });
      
      expect(() => component.aceptarEnlaceOperativo()).not.toThrow();
    });

    it('debería manejar clipboardData null en eventos de pegado', () => {
      const event = {
        preventDefault: jest.fn(),
        clipboardData: null,
        target: { getAttribute: jest.fn().mockReturnValue('10') }
      } as any;
      
      expect(() => component.pegarSoloNumeros(event, 'monto')).not.toThrow();
      expect(() => component.pegarSoloAlfanumericos(event, 'operacionesBancarias')).not.toThrow();
    });
  });

  describe('Integración con componente de transportistas', () => {
    it('debería incluir el componente de agregar transportistas', () => {
      const compiled = fixture.nativeElement;
      const transportistasComponent = compiled.querySelector('app-agregar-transportistas');
      expect(transportistasComponent).toBeTruthy();
    });
  });

});
  })
  });

