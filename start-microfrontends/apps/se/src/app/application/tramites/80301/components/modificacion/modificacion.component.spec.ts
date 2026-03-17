import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ModificacionComponent } from './modificacion.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80301Store } from '../../estados/tramite80301.store';
import { Tramite80301Query } from '../../estados/tramite80301.query';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideToastr, ToastrService } from 'ngx-toastr';

describe('ModificacionComponent', () => {
  let component: ModificacionComponent;
  let fixture: ComponentFixture<ModificacionComponent>;
  let solicitudServiceMock: any;
  let tramite80301StoreMock: any;
  let tramite80301QueryMock: any;

  beforeEach(async () => {
    solicitudServiceMock = {
      getDatosModificacion: jest.fn().mockReturnValue(
        of({
          rfc: 'RFC123',
          federal: true,
          tipo: 'Tipo1',
          programa: 'Programa1',
        })
      ),
      getDatosTableData: jest.fn().mockReturnValue(
        of([
          {
            claveProductoExportacion: 123,
            desEstatus: 'Baja',
            fraccionArancelaria: {
              descripcion: 'Descripción de fracción',
              clave: '1234',
            }
          }
        ])
      ),
      getDatosExportacionTableData: jest.fn().mockReturnValue(
        of([
          {
            desEstatus: 'Activada',
            fraccionPadre: 'Descripción 2',
            claveProductoExportacion: 12345,
            fraccionArancelaria: {
              descripcion: 'Descripción de fracción',
              clave: '1234',
            },
          },
        ])
      ),
      getDatosImportacionTableData: jest
        .fn()
        .mockReturnValue(of([{ id: 2, desEstatus: 'Activada' }])),
      getImportacionTablaDatos: jest
        .fn()
        .mockReturnValue(of([{ id: 3, desEstatus: 'Importada' }])),
    };

    tramite80301StoreMock = {
      setDatosModificacion: jest.fn(),
      setDatosImportacion: jest.fn(),
      setDatosExportacion: jest.fn(),
      select: jest.fn().mockImplementation((fn) => of({})),
      _select: jest.fn().mockImplementation((fn) => of({})),
    };

    tramite80301QueryMock = {
      selectSolicitud$: of({
        datosModificacion: {
          rfc: 'RFC123',
          federal: true,
          tipo: 'Tipo1',
          programa: 'Programa1',
        },
      }),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ModificacionComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Tramite80301Store, useValue: tramite80301StoreMock },
        { provide: Tramite80301Query, useValue: tramite80301QueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load modification data and update the form', () => {
    component.loadDatosModificacion();
    expect(solicitudServiceMock.getDatosModificacion).toHaveBeenCalled();
  });

  it('should load exportacion table data', fakeAsync(() => {
    solicitudServiceMock.getDatosTableData();
    expect(solicitudServiceMock.getDatosTableData).toHaveBeenCalled();
  }));

  it('should toggle the status of a table row from "Activada" to "Baja"', () => {
    component.datosExportacionTabla = [
      {
        desEstatus: 'Baja',
        claveProductoExportacion: 123,
        fraccionArancelaria: {
          descripcion: 'Descripción de fracción',
          clave: '1234',
        },
      },
    ];

    const event = {
      row: {
        desEstatus: 'Activada',
        codigoPostal: '12345',
        localidad: 'Localidad2',
        delegacionMunicipio: 'Delegacion2',
        fraccionArancelaria: {
          descripcion: 'Descripción de fracción',
          clave: '1234',
        },
      },
      column: '',
    };

    component.exportacionValorDeAlternancia(event);

    expect(component.datosExportacionTabla[0].desEstatus).toBe('Activada');
  });

  it('should toggle the status of a importacion table row from "Baja" to "Activada"', () => {
    component.datosImportacionTabla = [
      {
        desEstatus: 'Baja',
        fraccionPadre: 'Descripción 1',
        claveProductoExportacion: 54321,
        fraccionArancelaria: {
          descripcion: 'Descripción de fracción',
          clave: '4321',
        },
      },
    ];

    const event = {
      row: {
        desEstatus: 'Baja',
        codigoPostal: '54321',
        localidad: 'Localidad1',
        delegacionMunicipio: 'Delegacion1',
        fraccionArancelaria: {
          descripcion: 'Descripción de fracción',
          clave: '4321',
        },
      },
      column: '',
    };

    component.importacionValorDeAlternancia(event);

    expect(component.datosImportacionTabla[0].desEstatus).toBe('Activada');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });
});
