import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ModalOperacionComponent } from './modal-operacion.component';
import { MercanciasDesmontadasOSinMontarService } from '../../services/mercancias-desmontadas-o-sin-montar.service';
import { Solicitud32501Query } from '../../estados/solicitud32501.query';
import { Solicitud32501Store } from '../../estados/solicitud32501.store';
import { CommonModule } from '@angular/common';
import {
  AlertComponent,
  AnexarDocumentosComponent,
  BtnContinuarComponent,
  CatalogoSelectComponent,
  CrosslistComponent,
  InputCheckComponent,
  InputFechaComponent,
  InputHoraComponent,
  InputRadioComponent,
  SelectPaisesComponent,
  TituloComponent,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ModalOperacionComponent', () => {
  let component: ModalOperacionComponent;
  let fixture: ComponentFixture<ModalOperacionComponent>;
  let mercDesmSinMonServiceMock: jest.Mocked<MercanciasDesmontadasOSinMontarService>;
  let solicitud32501QueryMock: jest.Mocked<Solicitud32501Query>;
  let solicitud32501StoreMock: jest.Mocked<Solicitud32501Store>;

  beforeEach(async () => {
    mercDesmSinMonServiceMock = {
      obtenerAvisoDelCatalogo: jest.fn(() =>
        of({
          cveFraccionArancelaria: {
            catalogos: [
              {
                id: 1,
                descripcion: '01031001-Reproductors de raza..',
              },
              {
                id: 2,
                descripcion: '01031002-Reproductors de raza..',
              },
              {
                id: 3,
                descripcion: '01031003-Reproductors de raza..',
              },
            ],
            labelNombre: 'Fracción arancelaria',
            required: true,
            primerOpcion: 'Seleccione una opción',
          },
          entidadFederativa: {
            catalogos: [
              {
                id: 1,
                descripcion: 'MEXICO-1',
              },
              {
                id: 2,
                descripcion: 'MEXICO-2',
              },
              {
                id: 3,
                descripcion: 'MEXICO-3',
              },
            ],
            labelNombre: 'Entidad federativa',
            required: true,
            primerOpcion: 'Seleccione una opción',
          },
          delegacionMunicipio: {
            catalogos: [
              {
                id: 1,
                descripcion: 'ATENCO-1',
              },
              {
                id: 2,
                descripcion: 'ATENCO-2',
              },
              {
                id: 3,
                descripcion: 'ATENCO-3',
              },
            ],
            labelNombre: 'Alcaldía o municipio',
            required: true,
            primerOpcion: 'Seleccione una opción',
          },
          colonia: {
            catalogos: [
              {
                id: 1,
                descripcion: 'LA NORIA-1',
              },
              {
                id: 2,
                descripcion: 'LA NORIA-2',
              },
              {
                id: 3,
                descripcion: 'LA NORIA-3',
              },
            ],
            labelNombre: 'Colonia',
            required: true,
            primerOpcion: 'Seleccione una opción',
          },
          aduanaDeImportacion: {
            catalogos: [
              {
                id: 1,
                descripcion: 'Test-1',
              },
              {
                id: 2,
                descripcion: 'Test-2',
              },
              {
                id: 3,
                descripcion: 'Test-3',
              },
            ],
            labelNombre: 'Aduana de importación',
            required: true,
            primerOpcion: 'Seleccione una opción',
          },
          opcionTipoDeDocumento: {
            labelNombre: 'Tipo de documento',
            required: false,
            primerOpcion: 'Seleccione un tipo de documento',
            catalogos: [
              {
                id: 1,
                descripcion: 'Manifiesto',
              },
              {
                id: 2,
                descripcion: 'ID Oficial',
              },
              {
                id: 3,
                descripcion: 'Actas',
              },
              {
                id: 4,
                descripcion: 'Poderes',
              },
              {
                id: 5,
                descripcion: 'Otros',
              },
            ],
          },
        })
      ),
    } as unknown as jest.Mocked<MercanciasDesmontadasOSinMontarService>;

    solicitud32501QueryMock = {
      seleccionarSolicitud$: of({
        adace: '',
        fechaIniExposicion: '',
        ideGenerica1: '',
        idTransaccionVU: '',
        cveFraccionArancelaria: '',
        nico: '',
        peso: '',
        valorUSD: '',
        descripcionMercancia: '',
        nombreComercial: '',
        entidadFederativa: '',
        delegacionMunicipio: '',
        colonia: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        codigoPostal: '',
        patente: '',
        rfc: '',
        pedimento: '',
        aduana: '',
      }),
    } as unknown as jest.Mocked<Solicitud32501Query>;

    solicitud32501StoreMock = {
      actualizarAduana: jest.fn(() => of(1)),
      actualizarPatente: jest.fn(() => of('ABC123')),
      actualizaRFC: jest.fn(() => of('RFC123')),
      actualizarPedimento: jest.fn(() => of('PED123')),
      establecerDatos: jest.fn(), 
    } as unknown as jest.Mocked<Solicitud32501Store>;

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ModalOperacionComponent,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        WizardComponent,
        BtnContinuarComponent,
        InputCheckComponent,
        InputFechaComponent,
        InputHoraComponent,
        CrosslistComponent,
        TituloComponent,
        SelectPaisesComponent,
        AnexarDocumentosComponent,
        AlertComponent,
        CatalogoSelectComponent,
        InputRadioComponent,
      ],
      providers: [
        {
          provide: MercanciasDesmontadasOSinMontarService,
          useValue: mercDesmSinMonServiceMock,
        },
        { provide: Solicitud32501Query, useValue: solicitud32501QueryMock },
        { provide: Solicitud32501Store, useValue: solicitud32501StoreMock },
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.frmDatosOperacionImp).toBeDefined();
    expect(component.frmDatosOperacionImp.controls['patente']).toBeDefined();
    expect(component.frmDatosOperacionImp.controls['rfc']).toBeDefined();
    expect(component.frmDatosOperacionImp.controls['pedimento']).toBeDefined();
    expect(component.frmDatosOperacionImp.controls['aduana']).toBeDefined();
  });

  it('should call obtenerAvisoDelCatalogo on initialization', () => {
    jest.spyOn(mercDesmSinMonServiceMock, 'obtenerAvisoDelCatalogo');
    mercDesmSinMonServiceMock.obtenerAvisoDelCatalogo();
    expect(
      mercDesmSinMonServiceMock.obtenerAvisoDelCatalogo
    ).toHaveBeenCalled();
  });

  it('should update aduana when establecerValoresEnEstado is called', () => {
  component.frmDatosOperacionImp.get('aduana')?.setValue(1);
  component.establecerValoresEnEstado(component.frmDatosOperacionImp, 'aduana');
  expect(solicitud32501StoreMock.establecerDatos).toHaveBeenCalledWith({ aduana: 1 });
});

it('should update patente when establecerValoresEnEstado is called', () => {
  component.frmDatosOperacionImp.get('patente')?.setValue('ABC123');
  component.establecerValoresEnEstado(component.frmDatosOperacionImp, 'patente');
  expect(solicitud32501StoreMock.establecerDatos).toHaveBeenCalledWith({ patente: 'ABC123' });
});

it('should update RFC when establecerValoresEnEstado is called', () => {
  component.frmDatosOperacionImp.get('rfc')?.setValue('RFC123');
  component.establecerValoresEnEstado(component.frmDatosOperacionImp, 'rfc');
  expect(solicitud32501StoreMock.establecerDatos).toHaveBeenCalledWith({ rfc: 'RFC123' });
});

it('should update pedimento when establecerValoresEnEstado is called', () => {
  component.frmDatosOperacionImp.get('pedimento')?.setValue('PED123');
  component.establecerValoresEnEstado(component.frmDatosOperacionImp, 'pedimento');
  expect(solicitud32501StoreMock.establecerDatos).toHaveBeenCalledWith({ pedimento: 'PED123' });
});
  it('should return true if a form control is invalid and touched in noEsValido', () => {
    component.frmDatosOperacionImp.controls['patente'].setErrors({
      required: true,
    });
    component.frmDatosOperacionImp.controls['patente'].markAsTouched();
    expect(component.noEsValido('patente')).toBe(true);
  });

  it('should return false if a form control is valid in esValido', () => {
    component.frmDatosOperacionImp.controls['patente'].setValue('ValidValue');
    expect(component.esValido('patente')).toBe(false);
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
