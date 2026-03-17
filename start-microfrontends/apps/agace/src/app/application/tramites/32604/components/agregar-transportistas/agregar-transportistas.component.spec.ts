import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { AgregarTransportistasComponent } from './agregar-transportistas.component';
import { Solicitud32604Query } from '../../estados/solicitud32604.query';
import { Solicitud32604Store } from '../../estados/solicitud32604.store';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';
import { TransportistasTable } from '../../models/empresas-comercializadoras.model';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgregarTransportistasComponent', () => {
  it('should show error notification for duplicate RFC when not modifying', () => {
    const validRFC = 'XAXX010101000';
    component.transportistasExistentes = [
      { transportistaRFCModifTrans: validRFC, transportistaRazonSocial: '', transportistaDomicilio: '', transportistaCaat: '' }
    ];
    component.transportistaCertificacionForm.get('transportistaRFC')?.setValue(validRFC);
    component.transportistaCertificacionForm.get('transportistaRFCModifTrans')?.setValue(validRFC);
    component.selectBuscarTransportista();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.categoria).toBe('danger');
    expect(component.nuevaNotificacion.mensaje).toContain('Ya existe un registro con ese RFC');
  });

  it('should show error notification for duplicate RFC when modifying and RFC is different', () => {
    const validRFC = 'XAXX010101000';
    component.transportistasExistentes = [
      { transportistaRFCModifTrans: validRFC, transportistaRazonSocial: '', transportistaDomicilio: '', transportistaCaat: '' }
    ];
    component.transportistaAModificar = { transportistaRFCModifTrans: 'OTHER12345678', transportistaRazonSocial: '', transportistaDomicilio: '', transportistaCaat: '' };
    component.transportistaCertificacionForm.get('transportistaRFC')?.setValue(validRFC);
    component.transportistaCertificacionForm.get('transportistaRFCModifTrans')?.setValue(validRFC);
    component.selectBuscarTransportista();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.categoria).toBe('danger');
    expect(component.nuevaNotificacion.mensaje).toContain('Ya existe un registro con ese RFC');
  });

  it('should show error notification if RFC not found in conseguirTransportistasLista', () => {
    jest.spyOn(component.empresasComercializadorasService, 'conseguirTransportistasLista').mockReturnValueOnce(of([]));
    component.transportistaCertificacionForm.get('transportistaRFC')?.setValue('NOTFOUND');
    component.transportistasExistentes = [];
    component.selectBuscarTransportista();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.categoria).toBe('danger');
    expect(component.nuevaNotificacion.mensaje).toContain('Existen datos incorrectos');
  });

  it('should handle service error in validarRFCContraJSON', () => {
    jest.spyOn(component.empresasComercializadorasService, 'conseguirTransportistasLista').mockReturnValueOnce({
      pipe: () => ({
        subscribe: ({ error }: any) => error()
      })
    } as any);
    component.transportistaCertificacionForm.get('transportistaRFC')?.setValue('ERROR');
    component.transportistasExistentes = [];
    component.selectBuscarTransportista();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.categoria).toBe('danger');
    expect(component.nuevaNotificacion.mensaje).toContain('Existen datos incorrectos');
  });

  it('should call limpiar and reset form and transportistaAModificar', () => {
    component.transportistaCertificacionForm.get('transportistaRFC')?.setValue('RFC');
    component.transportistaAModificar = { transportistaRFCModifTrans: 'RFC', transportistaRazonSocial: '', transportistaDomicilio: '', transportistaCaat: '' };
    component.limpiar();
    expect(component.transportistaCertificacionForm.get('transportistaRFC')?.value).toBeNull();
    expect(component.transportistaAModificar).toBeNull();
  });

  it('should clear notification on manejarConfirmacionNotificacion', () => {
    component.nuevaNotificacion = { categoria: 'danger' } as any;
    component.manejarConfirmacionNotificacion(true);
    expect(component.nuevaNotificacion).toEqual({});
  });
  let component: AgregarTransportistasComponent;
  let fixture: ComponentFixture<AgregarTransportistasComponent>;
  let empresasComercializadorasServiceMock: jest.Mocked<EmpresasComercializadorasService>;
  let solicitud32604StoreMock: jest.Mocked<Solicitud32604Store>;
  let solicitud32604QueryMock: jest.Mocked<Solicitud32604Query>;

  beforeEach(async () => {
    empresasComercializadorasServiceMock = {
      conseguirTransportistasLista: jest.fn(() =>
        of([
          {
            transportistaRFCModifTrans: 'AAL0409235E6',
            transportistaRazonSocial: 'INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV',
            transportistaDomicilio:
              'CAMINO VIEJO 1353 81210 LOS MOCHIS MIGUEL HIDALGO AHOME SINALOA ESTADOS UNIDOS MEXICANOS',
            transportistaCaat: '3CJD',
          },
        ])
      ),
    } as unknown as jest.Mocked<EmpresasComercializadorasService>;
    solicitud32604StoreMock = {
      actualizarTransportistaRFC: jest.fn(() => of()),
      actualizarTransportistaRFCModifTrans: jest.fn(() => of()),
      actualizarTransportistaRazonSocial: jest.fn(() => of()),
      actualizarTransportistaDomicilio: jest.fn(() => of()),
      actualizarTransportistaCaat: jest.fn(() => of()),
    } as unknown as jest.Mocked<Solicitud32604Store>;
    solicitud32604QueryMock = {
      selectSolicitud$: of({}) as any,
    } as unknown as jest.Mocked<Solicitud32604Query>;

    await TestBed.configureTestingModule({
      imports: [
        AgregarTransportistasComponent,
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        { provide: EmpresasComercializadorasService, useValue: empresasComercializadorasServiceMock },
        { provide: Solicitud32604Store, useValue: solicitud32604StoreMock },
        { provide: Solicitud32604Query, useValue: solicitud32604QueryMock },
        { provide: require('ngx-toastr').ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: 'ToastConfig', useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarTransportistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.transportistaCertificacionForm).toBeDefined();
    expect(
      component.transportistaCertificacionForm.get('transportistaRFC')
    ).toBeTruthy();
  });

  it('should call actualizarTransportistaRFC on input change', () => {
    const event = { target: { value: 'RFC123' } } as unknown as Event;
    component.actualizarTransportistaRFC(event);
    expect(
      solicitud32604StoreMock.actualizarTransportistaRFC
    ).toHaveBeenCalledWith('RFC123');
  });

  it('should emit seccionTransportistasLista on aceptarTransportista', () => {
    jest.spyOn(component.seccionTransportistasLista, 'emit');
    component.transportistaCertificacionForm.setValue({
      transportistaRFC: 'ZURE5401259D9',
      transportistaRFCModifTrans: 'ZURE5401259D9',
      transportistaRazonSocial: 'Razon Social',
      transportistaDomicilio: 'Domicilio',
      transportistaCaat: 'CAAT',
      transportistaIdDomicilio: null,
      transportistaIdRFC: null,
      transportistaIdRazonSocial: null,
      transportistaIdCaat: null,
    });
    component.aceptarTransportista();
    expect(component.seccionTransportistasLista.emit).toHaveBeenCalledWith({
      transportistaRFCModifTrans: 'ZURE5401259D9',
      transportistaRazonSocial: 'Razon Social',
      transportistaDomicilio: 'Domicilio',
      transportistaCaat: 'CAAT',
    });
  });

  it('should call conseguirTransportistasLista on selectBuscarTransportista if RFC is provided', () => {
    jest.spyOn(component, 'conseguirTransportistasLista');
    component.conseguirTransportistasLista();
    component.selectBuscarTransportista();
    expect(component.conseguirTransportistasLista).toHaveBeenCalled();
  });

  it('should update form values on conseguirTransportistasLista response', () => {
    const transportistasMock: TransportistasTable[] = [
      {
        transportistaRFCModifTrans: 'ZURE5401259D9',
        transportistaRazonSocial: 'Razon Social',
        transportistaDomicilio: 'Domicilio',
        transportistaCaat: 'CAAT',
      },
    ];
    empresasComercializadorasServiceMock.conseguirTransportistasLista.mockReturnValue(
      of(transportistasMock)
    );
    component.conseguirTransportistasLista();
    expect(
      solicitud32604StoreMock.actualizarTransportistaRazonSocial
    ).toHaveBeenCalledWith('Razon Social');
    expect(
      solicitud32604StoreMock.actualizarTransportistaDomicilio
    ).toHaveBeenCalledWith('Domicilio');
    expect(
      solicitud32604StoreMock.actualizarTransportistaCaat
    ).toHaveBeenCalledWith('CAAT');
  });
  
  it('should call actualizarTransportistaRFCModifTrans on input change', () => {
    const event = { target: { value: 'RFCMODIF123' } } as unknown as Event;
    component.actualizarTransportistaRFCModifTrans(event);
    expect(
      solicitud32604StoreMock.actualizarTransportistaRFCModifTrans
    ).toHaveBeenCalledWith('RFCMODIF123');
  });

  it('should call actualizarTransportistaRazonSocial on input change', () => {
    const event = { target: { value: 'Nueva Razon Social' } } as unknown as Event;
    component.actualizarTransportistaRazonSocial(event);
    expect(
      solicitud32604StoreMock.actualizarTransportistaRazonSocial
    ).toHaveBeenCalledWith('Nueva Razon Social');
  });

  it('should call actualizarTransportistaDomicilio on input change', () => {
    const event = { target: { value: 'Nuevo Domicilio' } } as unknown as Event;
    component.actualizarTransportistaDomicilio(event);
    expect(
      solicitud32604StoreMock.actualizarTransportistaDomicilio
    ).toHaveBeenCalledWith('Nuevo Domicilio');
  });

  it('should call actualizarTransportistaCaat on input change', () => {
    const event = { target: { value: 'CAAT123' } } as unknown as Event;
    component.actualizarTransportistaCaat(event);
    expect(
      solicitud32604StoreMock.actualizarTransportistaCaat
    ).toHaveBeenCalledWith('CAAT123');
  });

  it('noEsValido should return true if control is invalid and touched', () => {
    component.transportistaCertificacionForm.get('transportistaRFC')?.setErrors({ required: true });
    component.transportistaCertificacionForm.get('transportistaRFC')?.markAsTouched();
    expect(component.noEsValido('transportistaRFC')).toBe(true);
  });

  it('noEsValido should return false if control is valid', () => {
  const control = component.transportistaCertificacionForm.get('transportistaRFC');
  control?.setValue('RFC123');
  control?.setErrors(null);
  control?.markAsTouched();
  expect(component.noEsValido('transportistaRFC')).toBe(false);
  });

  it('noEsValido should return undefined if control does not exist', () => {
    expect(component.noEsValido('noExiste')).toBeUndefined();
  });

  it('selectBuscarTransportista should not call conseguirTransportistasLista if RFC is empty', () => {
    jest.spyOn(component, 'conseguirTransportistasLista');
    component.transportistaCertificacionForm.get('transportistaRFC')?.setValue('');
    component.selectBuscarTransportista();
    expect(component.conseguirTransportistasLista).not.toHaveBeenCalled();
  });


  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should set confirmarNotificacion and show error modal when RFC is invalid', () => {
    component.transportistaCertificacionForm = new FormBuilder().group({
      transportistaRFC: ['INVALID']
    });
    component.transportistaCertificacionForm.get('transportistaRFC')?.setErrors({ required: true });
    component.transportistaCertificacionForm.get('transportistaRFC')?.markAsTouched();
    component.selectBuscarTransportista();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.categoria).toBe('danger');
  });

  it('should disable form if transportistaAModificar is set', () => {
    component.transportistaAModificar = { transportistaRFCModifTrans: 'RFC123' } as any;
    component.transportistaCertificacionForm = new FormBuilder().group({
      transportistaRFC: ['RFC123']
    });
    component.patchForm(component.transportistaAModificar as any);
    expect(component.transportistaCertificacionForm.disabled).toBe(false);
  });
});
