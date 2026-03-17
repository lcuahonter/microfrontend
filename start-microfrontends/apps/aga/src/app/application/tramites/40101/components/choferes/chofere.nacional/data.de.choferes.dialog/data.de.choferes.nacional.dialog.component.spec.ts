import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDeChoferesNacionalDialogComponent } from './data.de.choferes.nacional.dialog.component';
import { Chofer40101Service } from '../../../../estado/chofer40101.service';
import { DatosDelChoferNacional } from '../../../../models/registro-muestras-mercancias.model';
import { Catalogo } from '@ng-mf/data-access-user';

describe('DatosDeChoferesNacionalDialogComponent', () => {
  let componente: DatosDeChoferesNacionalDialogComponent;
  let fixture: ComponentFixture<DatosDeChoferesNacionalDialogComponent>;
  let mockChofer40101Service: Chofer40101Service;
  let mockModalService: BsModalService;
  let mockModalRef: BsModalRef;

  const mockPaises: Catalogo[] = [ { id: 1, descripcion: 'México' } ];
  const mockEstados: Catalogo[] = [ { id: 1, descripcion: 'Ciudad de México' }, { id: 2, descripcion: 'Jalisco' } ];
  const mockMunicipios: Catalogo[] = [ { id: 1, descripcion: 'Benito Juárez' }, { id: 2, descripcion: 'Guadalajara' } ];
  const mockColonias: Catalogo[] = [ { id: 1, descripcion: 'Del Valle' }, { id: 2, descripcion: 'Centro' } ];
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
    mockModalRef = { hide: jest.fn() } as unknown as BsModalRef;
    mockModalService = { show: jest.fn().mockReturnValue(mockModalRef) } as unknown as BsModalService;
    mockChofer40101Service = {
      getPaisEmisor: jest.fn().mockReturnValue(of(mockPaises)),
      getEstadosPorPais: jest.fn().mockReturnValue(of(mockEstados)),
      getMunicipiosPorEstado: jest.fn().mockReturnValue(of(mockMunicipios)),
      getColoniasPorMunicipio: jest.fn().mockReturnValue(of(mockColonias)),
      obtenerTablaDatos: jest.fn().mockReturnValue(of([mockChoferData]))
    } as unknown as Chofer40101Service;

    await TestBed.configureTestingModule({
      imports: [DatosDeChoferesNacionalDialogComponent, ReactiveFormsModule, CommonModule],
      providers: [
        FormBuilder,
        { provide: BsModalService, useValue: mockModalService },
        { provide: Chofer40101Service, useValue: mockChofer40101Service }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeChoferesNacionalDialogComponent);
    componente = fixture.componentInstance;
    componente.datosDeChofere = mockChoferData;
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario con la estructura y validadores correctos', async () => {
    await componente.ngOnInit();
    expect(componente.formChoferes).toBeDefined();
    expect(componente.formChoferes.get('curp')).toBeTruthy();
    expect(componente.formChoferes.get('rfc')).toBeTruthy();
    expect(componente.formChoferes.get('nombre')).toBeTruthy();
  });

  it('debería cargar los países y establecer el valor inicial en el formulario', async () => {
    await componente.ngOnInit();
    expect(mockChofer40101Service.getPaisEmisor).toHaveBeenCalled();
    expect(componente.paisList).toEqual(mockPaises);
    expect(componente.formChoferes.get('pais')?.value).toBe(1);
  });

  it('debería validar el formato de CURP', async () => {
    await componente.ngOnInit();
    const curpControl = componente.formChoferes.get('curp');
    curpControl?.setValue('INVALID_CURP');
    expect(curpControl?.hasError('pattern')).toBeTruthy();
    curpControl?.setValue('ABCD123456HDFRNN09');
    expect(curpControl?.hasError('pattern')).toBeFalsy();
  });

  it('debería validar los campos requeridos', async () => {
    await componente.ngOnInit();
    const curpControl = componente.formChoferes.get('curp');
    const rfcControl = componente.formChoferes.get('rfc');
    curpControl?.setValue('');
    rfcControl?.setValue('');
    expect(curpControl?.hasError('required')).toBeTruthy();
    expect(rfcControl?.hasError('required')).toBeTruthy();
  });

  it('debería limpiar el formulario', async () => {
    await componente.ngOnInit();
    componente.formChoferes.patchValue({ curp: 'CURP', rfc: 'RFC', pais: 1 });
    componente.limpiarFormulario();
    expect(componente.formChoferes.get('curp')?.value).toBe('');
    expect(componente.formChoferes.get('rfc')?.value).toBe('');
    expect(componente.formChoferes.get('pais')?.value).toBe(1);
  });

  it('debería abrir el modal', () => {
    componente.abiertoModal();
    expect(mockModalService.show).toHaveBeenCalled();
    expect(componente.modalRef).toBe(mockModalRef);
  });

  it('debería cerrar el modal y emitir evento de cancelación', () => {
    const cancelarSpy = jest.spyOn(componente.cancelEvent, 'emit');
    componente.modalRef = mockModalRef;
    componente.cerrarModal();
    expect(mockModalRef.hide).toHaveBeenCalled();
    expect(cancelarSpy).toHaveBeenCalled();
  });

  it('debería guardar la fila editada si el formulario es válido', async () => {
    await componente.ngOnInit();
    const agregarSpy = jest.spyOn(componente.addModalEvent, 'emit');
    componente.formChoferes.patchValue({
      curp: 'ABCD123456HDFRNN09',
      rfc: 'ABCD123456ABC',
      pais: 1,
      estado: 1,
      municipioAlcaldia: 1,
      colonia: 1,
      paisDeResidencia: 1
    });
    componente.guardarFilaEditada();
    expect(agregarSpy).toHaveBeenCalled();
  });

  it('debería mostrar alerta si el formulario es inválido', async () => {
    await componente.ngOnInit();
    componente.formChoferes.get('curp')?.setValue('');
    componente.formChoferes.get('rfc')?.setValue('');
    componente.guardarFilaEditada();
    expect(componente.alertaNotificacion).toBeDefined();
  });

  it('debería transformar los IDs de catálogo a descripciones', async () => {
    await componente.ngOnInit();
    const agregarSpy = jest.spyOn(componente.addModalEvent, 'emit');
    componente.formChoferes.patchValue({
      curp: 'ABCD123456HDFRNN09',
      rfc: 'ABCD123456ABC',
      pais: 1,
      estado: 1,
      municipioAlcaldia: 1,
      colonia: 1,
      paisDeResidencia: 1
    });
    componente.guardarFilaEditada();
    const datosEmitidos = agregarSpy.mock.calls[0][0];
    expect(datosEmitidos?.datos.pais).toBe('México');
    expect(datosEmitidos?.datos.estado).toBe('Ciudad de México');
    expect(datosEmitidos?.datos.municipioAlcaldia).toBe('Benito Juárez');
    expect(datosEmitidos?.datos.colonia).toBe('Del Valle');
  });
});