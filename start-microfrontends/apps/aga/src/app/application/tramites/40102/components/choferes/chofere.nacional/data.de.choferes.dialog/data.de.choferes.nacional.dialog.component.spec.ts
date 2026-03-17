import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDeChoferesNacionalDialogComponent } from './data.de.choferes.nacional.dialog.component';
import { Chofer40102Service } from '../../../../estados/chofer40102.service';
import { DatosDelChoferNacional } from '../../../../models/registro-muestras-mercancias.model';
import { Catalogo, TipoNotificacionEnum, CategoriaMensaje } from '@ng-mf/data-access-user';

describe('DatosDeChoferesNacionalDialogComponent', () => {
  let component: DatosDeChoferesNacionalDialogComponent;
  let fixture: ComponentFixture<DatosDeChoferesNacionalDialogComponent>;
  let mockChofer40102Service: jest.Mocked<Chofer40102Service>;
  let mockModalService: jest.Mocked<BsModalService>;
  let mockModalRef: jest.Mocked<BsModalRef>;

  const mockPaises: Catalogo[] = [
    { id: 1, descripcion: 'México' }
  ];

  const mockEstados: Catalogo[] = [
    { id: 1, descripcion: 'Ciudad de México' },
    { id: 2, descripcion: 'Jalisco' }
  ];

  const mockMunicipios: Catalogo[] = [
    { id: 1, descripcion: 'Benito Juárez' },
    { id: 2, descripcion: 'Guadalajara' }
  ];

  const mockColonias: Catalogo[] = [
    { id: 1, descripcion: 'Del Valle' },
    { id: 2, descripcion: 'Centro' }
  ];

  const mockChoferData: DatosDelChoferNacional = {
    id: 1,
    curp: 'ABCD123456HDFRNN09',
    rfc: 'ABCD123456ABC',
    nombre: 'Juan',
    primerApellido: 'Pérez',
    segundoApellido: 'García',
    numeroDeGafete: '12345',
    vigenciaGafete: '2025-12-31',
    calle: 'Insurgentes Sur',
    numeroExterior: '123',
    numeroInterior: 'A',
    pais: 'México',
    estado: 'Ciudad de México',
    municipioAlcaldia: 'Benito Juárez',
    colonia: 'Del Valle',
    paisDeResidencia: 'México',
    ciudad: 'CDMX',
    localidad: 'Del Valle',
    codigoPostal: '03100',
    correoElectronico: 'juan@test.com',
    telefono: '5551234567'
  };

  beforeEach(async () => {
    mockModalRef = {
      hide: jest.fn()
    } as unknown as jest.Mocked<BsModalRef>;

    mockModalService = {
      show: jest.fn().mockReturnValue(mockModalRef)
    } as unknown as jest.Mocked<BsModalService>;

    mockChofer40102Service = {
      getPaisEmisor: jest.fn().mockReturnValue(of(mockPaises)),
      getEstadosPorPais: jest.fn().mockReturnValue(of(mockEstados)),
      getMunicipiosPorEstado: jest.fn().mockReturnValue(of(mockMunicipios)),
      getColoniasPorMunicipio: jest.fn().mockReturnValue(of(mockColonias)),
      obtenerTablaDatos: jest.fn().mockReturnValue(of([mockChoferData]))
    } as unknown as jest.Mocked<Chofer40102Service>;

    await TestBed.configureTestingModule({
      imports: [
        DatosDeChoferesNacionalDialogComponent,
        ReactiveFormsModule,
        CommonModule
      ],
      providers: [
        FormBuilder,
        { provide: BsModalService, useValue: mockModalService },
        { provide: Chofer40102Service, useValue: mockChofer40102Service }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeChoferesNacionalDialogComponent);
    component = fixture.componentInstance;
    component.datosDeChofere = mockChoferData;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form with correct structure and validators', async () => {
      await component.ngOnInit();

      expect(component.formChoferes).toBeDefined();
      expect(component.formChoferes.get('curp')).toBeTruthy();
      expect(component.formChoferes.get('rfc')).toBeTruthy();
      expect(component.formChoferes.get('nombre')).toBeTruthy();

      // Test CURP validators
      const curpControl = component.formChoferes.get('curp');
      expect(curpControl?.hasError('required')).toBeFalsy();
      expect(curpControl?.hasError('maxlength')).toBeFalsy();
      expect(curpControl?.hasError('pattern')).toBeFalsy();
    });

    it('should load países data and initialize form', async () => {
      await component.ngOnInit();

      expect(mockChofer40102Service.getPaisEmisor).toHaveBeenCalled();
      expect(component.paisList).toEqual(mockPaises);
      expect(component.formChoferes.get('pais')?.value).toBe(1);
    });

    it('should call updateListsData with datosDeChofere', async () => {
      const updateListsDataSpy = jest.spyOn(component as any, 'updateListsData').mockResolvedValue(undefined);

      await component.ngOnInit();

      expect(updateListsDataSpy).toHaveBeenCalledWith(mockChoferData);
    });
  });

  describe('Form Validation', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should validate CURP format', () => {
      const curpControl = component.formChoferes.get('curp');
      
      // Invalid CURP
      curpControl?.setValue('INVALID_CURP');
      expect(curpControl?.hasError('pattern')).toBeTruthy();

      // Valid CURP
      curpControl?.setValue('ABCD123456HDFRNN09');
      expect(curpControl?.hasError('pattern')).toBeFalsy();
    });

    it('should validate required fields', () => {
      const curpControl = component.formChoferes.get('curp');
      const rfcControl = component.formChoferes.get('rfc');

      curpControl?.setValue('');
      rfcControl?.setValue('');

      expect(curpControl?.hasError('required')).toBeTruthy();
      expect(rfcControl?.hasError('required')).toBeTruthy();
    });

    it('should validate CURP max length', () => {
      const curpControl = component.formChoferes.get('curp');
      
      curpControl?.setValue('ABCD123456HDFRNN091'); // 19 characters
      expect(curpControl?.hasError('maxlength')).toBeTruthy();
    });
  });

  describe('Dropdown Cascading', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should update estados when país changes', () => {
      const mockPais = mockPaises[0];
      
      component.onPaisChange(mockPais);

      expect(mockChofer40102Service.getEstadosPorPais).toHaveBeenCalledWith(mockPais.id);
      expect(component.formChoferes.get('estado')?.value).toBe(null);
      expect(component.formChoferes.get('municipioAlcaldia')?.value).toBe(null);
      expect(component.formChoferes.get('colonia')?.value).toBe(null);
    });

    it('should update municipios when estado changes', () => {
      const mockEstado = mockEstados[0];
      
      component.onEstadoChange(mockEstado);

      expect(mockChofer40102Service.getMunicipiosPorEstado).toHaveBeenCalledWith(mockEstado.id);
      expect(component.formChoferes.get('municipioAlcaldia')?.value).toBe(null);
      expect(component.formChoferes.get('colonia')?.value).toBe(null);
    });

    it('should update colonias when municipio changes', () => {
      const mockMunicipio = mockMunicipios[0];
      
      component.onMunicipioChange(mockMunicipio);

      expect(mockChofer40102Service.getColoniasPorMunicipio).toHaveBeenCalledWith(mockMunicipio.id);
      expect(component.formChoferes.get('colonia')?.value).toBe(null);
    });
  });

  describe('CURP Input Handling', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should trigger chofer search when CURP has 18 characters', () => {
      const buscarChoferSpy = jest.spyOn(component, 'buscarChoferNacional').mockResolvedValue();
      
      component.formChoferes.get('curp')?.setValue('ABCD123456HDFRNN09');
      component.onCurpInput();

      expect(buscarChoferSpy).toHaveBeenCalledWith('ABCD123456HDFRNN09');
    });

    it('should not trigger search when CURP has less than 18 characters', () => {
      const buscarChoferSpy = jest.spyOn(component, 'buscarChoferNacional').mockResolvedValue();
      
      component.formChoferes.get('curp')?.setValue('ABCD123456');
      component.onCurpInput();

      expect(buscarChoferSpy).not.toHaveBeenCalled();
    });
  });

  describe('buscarChoferNacional', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should show alert when CURP is empty', async () => {
      await component.buscarChoferNacional('');

      expect(component.alertaNotificacion).toBeDefined();
      expect(component.alertaNotificacion.mensaje).toBe('Favor de ingresar CURP o RFC');
      expect(component.alertaNotificacion.tipoNotificacion).toBe(TipoNotificacionEnum.ALERTA);
    });

    it('should fetch chofer data and update form when CURP is provided', async () => {
      const updateListsDataSpy = jest.spyOn(component as any, 'updateListsData').mockResolvedValue(undefined);
      const patchValueSpy = jest.spyOn(component.formChoferes, 'patchValue');

      await component.buscarChoferNacional('ABCD123456HDFRNN09');

      expect(mockChofer40102Service.obtenerTablaDatos).toHaveBeenCalledWith('mock-data-choferes-nacionales.json');
      expect(updateListsDataSpy).toHaveBeenCalledWith(mockChoferData);
      expect(patchValueSpy).toHaveBeenCalledWith(mockChoferData);
    });

    it('should show alert when no chofer data is found', async () => {
      mockChofer40102Service.obtenerTablaDatos.mockReturnValue(of([]));

      await component.buscarChoferNacional('ABCD123456HDFRNN09');

      expect(component.alertaNotificacion.mensaje).toBe('No se encontró información para el CURP o RFC proporcionado.');
      expect(component.alertaNotificacion.tipoNotificacion).toBe(TipoNotificacionEnum.ALERTA);
    });
  });

  describe('Modal Operations', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should open modal', () => {
      component.openModal();

      expect(mockModalService.show).toHaveBeenCalledWith(component.datosDeChoferesModal, { class: 'modal-xl' });
      expect(component.modalRef).toBe(mockModalRef);
    });

    it('should close modal and emit cancel event', () => {
      const cancelEventSpy = jest.spyOn(component.cancelEvent, 'emit');
      component.modalRef = mockModalRef;

      component.closeModal();

      expect(mockModalRef.hide).toHaveBeenCalled();
      expect(cancelEventSpy).toHaveBeenCalled();
    });
  });

  describe('Form Operations', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should reset form with default values', () => {
      component.resetForm();

      expect(component.formChoferes.get('curp')?.value).toBe('');
      expect(component.formChoferes.get('rfc')?.value).toBe('');
      expect(component.formChoferes.get('pais')?.value).toBe(1);
      expect(component.formChoferes.get('paisDeResidencia')?.value).toBe('1');
    });

    it('should clear all form fields', () => {
      const resetSpy = jest.spyOn(component.formChoferes, 'reset');
      
      component.limpiarFormulario();

      expect(resetSpy).toHaveBeenCalled();
    });
  });

  describe('guardarFilaEditada', () => {
    beforeEach(async () => {
      await component.ngOnInit();
      component.paisList = mockPaises;
      component.estadoList = mockEstados;
      component.municipioList = mockMunicipios;
      component.coloniaList = mockColonias;
    });

    it('should save and emit data when form is valid', () => {
      const addModalEventSpy = jest.spyOn(component.addModalEvent, 'emit');
      const closeModalSpy = jest.spyOn(component, 'closeModal').mockImplementation();
      
      // Set valid form data
      component.formChoferes.patchValue({
        curp: 'ABCD123456HDFRNN09',
        rfc: 'ABCD123456ABC',
        pais: '1',
        estado: '1',
        municipioAlcaldia: '1',
        colonia: '1',
        paisDeResidencia: '1'
      });

      component.guardarFilaEditada();

      expect(addModalEventSpy).toHaveBeenCalled();
      expect(closeModalSpy).toHaveBeenCalled();
    });

    it('should show alert when form is invalid', () => {
      // Make form invalid
      component.formChoferes.get('curp')?.setValue('');
      component.formChoferes.get('rfc')?.setValue('');

      component.guardarFilaEditada();

      expect(component.alertaNotificacion).toBeDefined();
      expect(component.alertaNotificacion.mensaje).toBe('Formulario inválido, por favor verifica los campos.');
      expect(component.alertaNotificacion.tipoNotificacion).toBe(TipoNotificacionEnum.ALERTA);
    });

    it('should transform catalog IDs to descriptions', () => {
      const addModalEventSpy = jest.spyOn(component.addModalEvent, 'emit');
      const closeModalSpy = jest.spyOn(component, 'closeModal').mockImplementation();
      
      component.formChoferes.patchValue({
        curp: 'ABCD123456HDFRNN09',
        rfc: 'ABCD123456ABC',
        pais: '1',
        estado: '1',
        municipioAlcaldia: '1',
        colonia: '1',
        paisDeResidencia: '1'
      });

      component.guardarFilaEditada();

      const emittedData = addModalEventSpy.mock.calls[0][0];
      expect(emittedData?.pais).toBe('México');
      expect(emittedData?.estado).toBe('Ciudad de México');
      expect(emittedData?.municipioAlcaldia).toBe('Benito Juárez');
      expect(emittedData?.colonia).toBe('Del Valle');
    });
  });

  describe('isInvalid', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should return true when control is invalid and touched', () => {
      const curpControl = component.formChoferes.get('curp');
      curpControl?.setValue('');
      curpControl?.markAsTouched();

      expect(component.isInvalid('curp')).toBeTruthy();
    });

    it('should return false when control is valid', () => {
      const curpControl = component.formChoferes.get('curp');
      curpControl?.setValue('ABCD123456HDFRNN09');
      curpControl?.markAsTouched();

      expect(component.isInvalid('curp')).toBeFalsy();
    });

    it('should return null when control does not exist', () => {
      expect(component.isInvalid('nonExistentControl')).toBeNull();
    });
  });

  describe('getFormValues', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should return form controls', () => {
      const controls = component.getFormValues;
      
      expect(controls['curp']).toBeDefined();
      expect(controls['rfc']).toBeDefined();
      expect(controls['nombre']).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should handle errors in fetchMunicipiosByEstado', async () => {
      mockChofer40102Service.getMunicipiosPorEstado.mockReturnValue(throwError(() => new Error('Service error')));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await (component as any).fetchMunicipiosByEstado(mockEstados[0]);
      
      expect(consoleSpy).toHaveBeenCalledWith('Error al obtener municipios por estado:', expect.any(Error));
      expect(result).toEqual([]);
    });

    it('should handle errors in fetchColoniasByMunicipio', async () => {
      mockChofer40102Service.getColoniasPorMunicipio.mockReturnValue(throwError(() => new Error('Service error')));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await (component as any).fetchColoniasByMunicipio(mockMunicipios[0]);
      
      expect(consoleSpy).toHaveBeenCalledWith('Error al obtener colonias por municipio:', expect.any(Error));
      expect(result).toEqual([]);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyed$ subject', () => {
      const nextSpy = jest.spyOn(component.destroyed$, 'next');
      const completeSpy = jest.spyOn(component.destroyed$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalledWith(1);
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('updateListsData', () => {
    beforeEach(async () => {
      await component.ngOnInit();
      component.paisList = mockPaises;
    });

    it('should update location data with correct IDs', async () => {
      const testData = { ...mockChoferData };
      
      await (component as any).updateListsData(testData);

      expect(testData.pais).toBe('1');
      expect(testData.estado).toBe('1');
      expect(testData.municipioAlcaldia).toBe('1');
      expect(testData.colonia).toBe('1');
    });

    it('should handle missing estado in catalog', async () => {
      const testData = { ...mockChoferData, estado: 'NonExistent Estado' };
      
      await (component as any).updateListsData(testData);

      expect(testData.pais).toBe('1');
      // Estado should remain unchanged if not found
      expect(testData.estado).toBe('NonExistent Estado');
    });
  });

  describe('readonly mode', () => {
    beforeEach(async () => {
      component.readonly = true;
      await component.ngOnInit();
    });

    it('should disable address fields when readonly is true', () => {
      expect(component.formChoferes.get('calle')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('numeroExterior')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('estado')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('municipioAlcaldia')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('colonia')?.disabled).toBeTruthy();
    });

    it('should not disable address fields when readonly is false', async () => {
      component.readonly = false;
      await component.ngOnInit();

      expect(component.formChoferes.get('calle')?.disabled).toBeFalsy();
      expect(component.formChoferes.get('numeroExterior')?.disabled).toBeFalsy();
      expect(component.formChoferes.get('estado')?.disabled).toBeFalsy();
      expect(component.formChoferes.get('municipioAlcaldia')?.disabled).toBeFalsy();
      expect(component.formChoferes.get('colonia')?.disabled).toBeFalsy();
    });
  });

  describe('form field disabling', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should have certain fields always disabled', () => {
      expect(component.formChoferes.get('nombre')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('primerApellido')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('segundoApellido')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('numeroDeGafete')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('vigenciaGafete')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('pais')?.disabled).toBeTruthy();
    });

    it('should have CURP and RFC always enabled', () => {
      expect(component.formChoferes.get('curp')?.disabled).toBeFalsy();
      expect(component.formChoferes.get('rfc')?.disabled).toBeFalsy();
    });
  });
});