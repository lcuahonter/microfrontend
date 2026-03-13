import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDeChoferesExtranjerosDialogComponent } from './data.de.choferes.extranjeros.dialog.component';
import { Chofer40101Service } from '../../../../estado/chofer40101.service';
import { ChoferesExtranjeros } from '../../../../models/registro-muestras-mercancias.model';
import { Catalogo, TipoNotificacionEnum, CategoriaMensaje } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatosDeChoferesExtranjerosDialogComponent', () => {
  let component: DatosDeChoferesExtranjerosDialogComponent;
  let fixture: ComponentFixture<DatosDeChoferesExtranjerosDialogComponent>;
  let mockChofer40101Service: jest.Mocked<Chofer40101Service>;
  let mockModalService: jest.Mocked<BsModalService>;
  let mockModalRef: jest.Mocked<BsModalRef>;

  const mockPaises: Catalogo[] = [
    { id: 1, descripcion: 'México' },
    { id: 2, descripcion: 'Estados Unidos' }
  ];

  const mockEstados: Catalogo[] = [
    { id: 1, descripcion: 'Ciudad de México' },
    { id: 2, descripcion: 'California' }
  ];

  const mockMunicipios: Catalogo[] = [
    { id: 1, descripcion: 'Benito Juárez' },
    { id: 2, descripcion: 'Los Angeles' }
  ];

  const mockColonias: Catalogo[] = [
    { id: 1, descripcion: 'Del Valle' },
    { id: 2, descripcion: 'Downtown' }
  ];

  const mockChoferData: ChoferesExtranjeros = {
    numero: '12345',
    primerApellido: 'Pérez',
    segundoApellido: 'García',
    nacionalidad: 'Mexicana',
    numeroDeGafete: 'G12345',
    vigenciaGafete: '2025-12-31',
    numeroDelSeguroSocial: '12345678901',
    numberDeIdeFiscal: 'ABC123456XYZ1',
    pais: 'México',
    codigoPostal: '03100',
    estado: 'Ciudad de México',
    calle: 'Insurgentes Sur',
    numeroExterior: '123',
    numeroInterior: 'A',
    paisDeResidencia: 'México',
    ciudad: 'CDMX',
    correoElectronico: 'test@example.com',
    telefono: '5551234567'
  };

  beforeEach(async () => {
    mockModalRef = {
      hide: jest.fn()
    } as unknown as jest.Mocked<BsModalRef>;

    mockModalService = {
      show: jest.fn().mockReturnValue(mockModalRef)
    } as unknown as jest.Mocked<BsModalService>;

    mockChofer40101Service = {
      getPaisEmisor: jest.fn().mockReturnValue(of(mockPaises)),
      getEstadosPorPais: jest.fn().mockReturnValue(of(mockEstados)),
      getMunicipiosPorEstado: jest.fn().mockReturnValue(of(mockMunicipios)),
      getColoniasPorMunicipio: jest.fn().mockReturnValue(of(mockColonias)),
      obtenerTablaDatos: jest.fn().mockReturnValue(of([mockChoferData]))
    } as unknown as jest.Mocked<Chofer40101Service>;

    await TestBed.configureTestingModule({
      imports: [
        DatosDeChoferesExtranjerosDialogComponent,
        ReactiveFormsModule,
        CommonModule
      ],
      providers: [
        FormBuilder,
        { provide: BsModalService, useValue: mockModalService },
        { provide: Chofer40101Service, useValue: mockChofer40101Service }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeChoferesExtranjerosDialogComponent);
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
      expect(component.formChoferes.get('numero')).toBeTruthy();
      expect(component.formChoferes.get('primerApellido')).toBeTruthy();
      expect(component.formChoferes.get('numeroDelSeguroSocial')).toBeTruthy();
      expect(component.formChoferes.get('numberDeIdeFiscal')).toBeTruthy();
      expect(component.formChoferes.get('codigoPostal')).toBeTruthy();
    });

    it('should load países data and initialize form', async () => {
      await component.ngOnInit();

      expect(mockChofer40101Service.getPaisEmisor).toHaveBeenCalled();
      expect(component.paisList).toEqual(mockPaises);
    });

    it('should call updateListsData with datosDeChofere', async () => {
      const updateListsDataSpy = jest.spyOn(component as any, 'updateListsData');

      await component.ngOnInit();

      expect(updateListsDataSpy).toHaveBeenCalledWith(mockChoferData);
    });

    it('should disable fields when readonly is true', async () => {
      component.readonly = true;
      await component.ngOnInit();

      expect(component.formChoferes.get('numero')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('primerApellido')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('calle')?.disabled).toBeTruthy();
    });

    it('should enable fields when readonly is false', async () => {
      component.readonly = false;
      await component.ngOnInit();

      expect(component.formChoferes.get('numero')?.disabled).toBeFalsy();
      expect(component.formChoferes.get('primerApellido')?.disabled).toBeFalsy();
      expect(component.formChoferes.get('calle')?.disabled).toBeFalsy();
    });

    it('should have certain fields always disabled', async () => {
      await component.ngOnInit();

      expect(component.formChoferes.get('nacionalidad')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('numeroDeGafete')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('vigenciaGafete')?.disabled).toBeTruthy();
      expect(component.formChoferes.get('pais')?.disabled).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should validate required fields', () => {
      const numeroControl = component.formChoferes.get('numero');
      const primerApellidoControl = component.formChoferes.get('primerApellido');
      const numeroSeguroControl = component.formChoferes.get('numeroDelSeguroSocial');

      numeroControl?.setValue('');
      primerApellidoControl?.setValue('');
      numeroSeguroControl?.setValue('');

      expect(numeroControl?.hasError('required')).toBeTruthy();
      expect(primerApellidoControl?.hasError('required')).toBeTruthy();
      expect(numeroSeguroControl?.hasError('required')).toBeTruthy();
    });

    it('should validate max length for numero field', () => {
      const numeroControl = component.formChoferes.get('numero');

      numeroControl?.setValue('12345678901'); // 11 characters
      expect(numeroControl?.hasError('maxlength')).toBeTruthy();

      numeroControl?.setValue('1234567890'); // 10 characters
      expect(numeroControl?.hasError('maxlength')).toBeFalsy();
    });

    it('should validate numero del seguro social pattern', () => {
      const seguroControl = component.formChoferes.get('numeroDelSeguroSocial');

      // Invalid pattern (not 11 digits)
      seguroControl?.setValue('1234567890');
      expect(seguroControl?.hasError('pattern')).toBeTruthy();

      // Valid pattern (11 digits)
      seguroControl?.setValue('12345678901');
      expect(seguroControl?.hasError('pattern')).toBeFalsy();

      // Invalid pattern (contains letters)
      seguroControl?.setValue('1234567890A');
      expect(seguroControl?.hasError('pattern')).toBeTruthy();
    });

    it('should validate codigo postal pattern', () => {
      const codigoPostalControl = component.formChoferes.get('codigoPostal');

      // Invalid pattern (not 5 digits)
      codigoPostalControl?.setValue('1234');
      expect(codigoPostalControl?.hasError('pattern')).toBeTruthy();

      // Valid pattern (5 digits)
      codigoPostalControl?.setValue('12345');
      expect(codigoPostalControl?.hasError('pattern')).toBeFalsy();

      // Invalid pattern (contains letters)
      codigoPostalControl?.setValue('1234A');
      expect(codigoPostalControl?.hasError('pattern')).toBeTruthy();
    });

    it('should validate max length for various fields', () => {
      const primerApellidoControl = component.formChoferes.get('primerApellido');
      const ideFiscalControl = component.formChoferes.get('numberDeIdeFiscal');
      const calleControl = component.formChoferes.get('calle');

      primerApellidoControl?.setValue('A'.repeat(51));
      expect(primerApellidoControl?.hasError('maxlength')).toBeTruthy();

      ideFiscalControl?.setValue('A'.repeat(14));
      expect(ideFiscalControl?.hasError('maxlength')).toBeTruthy();

      calleControl?.setValue('A'.repeat(101));
      expect(calleControl?.hasError('maxlength')).toBeTruthy();
    });
  });

  describe('buscarChoferNacional', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should show alert when CURP is empty', async () => {
      await component.buscarChoferNacional('');

      expect(component.alertaNotificacion).toBeDefined();
      expect(component.alertaNotificacion.mensaje).toBe('La información proporcionada no existe');
      expect(component.alertaNotificacion.tipoNotificacion).toBe(TipoNotificacionEnum.ALERTA);
    });

    it('should fetch chofer data and update form when CURP is provided', async () => {
      const updateListsDataSpy = jest.spyOn(component as any, 'updateListsData');
      const patchValueSpy = jest.spyOn(component.formChoferes, 'patchValue');

      await component.buscarChoferNacional('ABCD123456HDFRNN09');

      expect(mockChofer40101Service.obtenerTablaDatos).toHaveBeenCalledWith('mock-data-choferes-extranjero.json');
      expect(updateListsDataSpy).toHaveBeenCalledWith(mockChoferData);
      expect(patchValueSpy).toHaveBeenCalledWith(mockChoferData);
    });

    it('should show alert when no chofer data is found', async () => {
      mockChofer40101Service.obtenerTablaDatos.mockReturnValue(of([]));

      await component.buscarChoferNacional('ABCD123456HDFRNN09');

      expect(component.alertaNotificacion.mensaje).toBe('No se encontró información para el CURP o RFC proporcionado.');
      expect(component.alertaNotificacion.tipoNotificacion).toBe(TipoNotificacionEnum.ALERTA);
    });

    it('should handle service errors gracefully', async () => {
      mockChofer40101Service.obtenerTablaDatos.mockReturnValue(throwError(() => new Error('Service error')));

      await expect(component.buscarChoferNacional('ABCD123456HDFRNN09')).resolves.not.toThrow();
    });
  });

  describe('Modal Operations', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should open modal', () => {
      component.abiertoModal();

      expect(mockModalService.show).toHaveBeenCalledWith(component.datosDeChoferesModal, { class: 'modal-xl' });
      expect(component.modalRef).toBe(mockModalRef);
    });

    it('should close modal and emit cancel event', () => {
      const cancelEventSpy = jest.spyOn(component.cancelEvent, 'emit');
      component.modalRef = mockModalRef;

      component.cerrarModal();

      expect(mockModalRef.hide).toHaveBeenCalled();
      expect(cancelEventSpy).toHaveBeenCalled();
    });

    it('should handle close modal when modalRef is undefined', () => {
      component.modalRef = undefined;
      const cancelEventSpy = jest.spyOn(component.cancelEvent, 'emit');

      expect(() => component.cerrarModal()).not.toThrow();
      expect(cancelEventSpy).toHaveBeenCalled();
    });
  });

  describe('Form Operations', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should reset form with default values', () => {
      component.limpiarFormulario();
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
    });

    it('should save and emit data when form is valid', () => {
      const addModalEventSpy = jest.spyOn(component.addModalEvent, 'emit');
      const cerrarModalSpy = jest.spyOn(component, 'cerrarModal').mockImplementation();

      component.formChoferes.patchValue({
        numero: '12345',
        primerApellido: 'Test',
        numeroDelSeguroSocial: '12345678901',
        numberDeIdeFiscal: 'ABC123456XYZ1',
        codigoPostal: '12345',
        estado: '1',
        calle: 'Test Street',
        numeroExterior: '123',
        paisDeResidencia: '1',
        ciudad: 'Test City'
      });

      component.guardarFilaEditada();

      expect(addModalEventSpy).toHaveBeenCalled();
      expect(cerrarModalSpy).toHaveBeenCalled();
    });

    it('should show alert when form is invalid', () => {
      component.formChoferes.get('numero')?.setValue('');
      component.formChoferes.get('primerApellido')?.setValue('');

      component.guardarFilaEditada();

      expect(component.alertaNotificacion).toBeDefined();
      expect(component.alertaNotificacion.mensaje).toBe('Formulario inválido, por favor verifica los campos.');
      expect(component.alertaNotificacion.tipoNotificacion).toBe(TipoNotificacionEnum.ALERTA);
    });

    it('should transform catalog IDs to descriptions', () => {
      const addModalEventSpy = jest.spyOn(component.addModalEvent, 'emit');
      const cerrarModalSpy = jest.spyOn(component, 'cerrarModal').mockImplementation();

      component.formChoferes.patchValue({
        numero: '12345',
        primerApellido: 'Test',
        numeroDelSeguroSocial: '12345678901',
        numberDeIdeFiscal: 'ABC123456XYZ1',
        codigoPostal: '12345',
        estado: '1',
        calle: 'Test Street',
        numeroExterior: '123',
        pais: '1',
        paisDeResidencia: '1',
        ciudad: 'Test City'
      });

      component.guardarFilaEditada();

      const emittedData = addModalEventSpy.mock.calls[0][0];
      expect(emittedData?.pais).toBe('México');
      expect(emittedData?.paisDeResidencia).toBe('México');
    });

    it('should handle missing catalog descriptions', () => {
      const addModalEventSpy = jest.spyOn(component.addModalEvent, 'emit');
      const closeModalSpy = jest.spyOn(component, 'cerrarModal').mockImplementation();

      component.formChoferes.patchValue({
        numero: '12345',
        primerApellido: 'Test',
        numeroDelSeguroSocial: '12345678901',
        numberDeIdeFiscal: 'ABC123456XYZ1',
        codigoPostal: '12345',
        estado: '1',
        calle: 'Test Street',
        numeroExterior: '123',
        pais: '999',
        paisDeResidencia: '999',
        ciudad: 'Test City'
      });

      component.guardarFilaEditada();

      const emittedData = addModalEventSpy.mock.calls[0][0];
      expect(emittedData?.pais).toBe('');
      expect(emittedData?.paisDeResidencia).toBe('');
    });
  });

  describe('isInvalid', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should return true when control is invalid and touched', () => {
      const numeroControl = component.formChoferes.get('numero');
      numeroControl?.setValue('');
      numeroControl?.markAsTouched();

      expect(component.isInvalid('numero')).toBeTruthy();
    });

    it('should return false when control is valid', () => {
      const numeroControl = component.formChoferes.get('numero');
      numeroControl?.setValue('12345');
      numeroControl?.markAsTouched();

      expect(component.isInvalid('numero')).toBeFalsy();
    });

    it('should return null when control does not exist', () => {
      expect(component.isInvalid('nonExistentControl')).toBeNull();
    });

    it('should return false when control is invalid but not touched', () => {
      const numeroControl = component.formChoferes.get('numero');
      numeroControl?.setValue('');
      numeroControl?.markAsUntouched();

      expect(component.isInvalid('numero')).toBeFalsy();
    });
  });

  describe('getFormValues', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should return form controls', () => {
      const controls = component.getFormValues;

      expect(controls['numero']).toBeDefined();
      expect(controls['primerApellido']).toBeDefined();
      expect(controls['numeroDelSeguroSocial']).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      await component.ngOnInit();
    });

    it('should handle errors in fetchMunicipiosByEstado', async () => {
      mockChofer40101Service.getMunicipiosPorEstado.mockReturnValue(throwError(() => new Error('Service error')));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await (component as any).fetchMunicipiosByEstado(mockEstados[0]);

      expect(consoleSpy).toHaveBeenCalledWith('Error al obtener municipios por estado:', expect.any(Error));
      expect(result).toEqual([]);
    });

    it('should handle errors in fetchColoniasByMunicipio', async () => {
      mockChofer40101Service.getColoniasPorMunicipio.mockReturnValue(throwError(() => new Error('Service error')));
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

  describe('Component Properties', () => {
    it('should initialize with default values', () => {
      expect(component.readonly).toBe(false);
      expect(component.showNotification).toBe(false);
      expect(component.paisList).toEqual([]);
      expect(component.estadoList).toEqual([]);
      expect(component.municipioList).toEqual([]);
      expect(component.coloniaList).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty paisList on initialization', async () => {
      mockChofer40101Service.getPaisEmisor.mockReturnValue(of([]));

      await component.ngOnInit();

      expect(component.paisList).toEqual([]);
    });

    it('should handle null response from service', async () => {
      mockChofer40101Service.getPaisEmisor.mockReturnValue(of(null as any));

      await component.ngOnInit();

      expect(component.paisList).toEqual([]);
    });
  });
});