import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapturarExpedicionCertificadosComponent } from './capturar-expedicion-certificados.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Expedicion120204Store } from '../../estados/tramites/expedicion120204.store';
import { Expedicion120204Query } from '../../estados/queries/expedicion120204.query';
import { ExpedicionCertificadoService } from '../../services/expedicion-certificado.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CapturarExpedicionCertificadosComponent', () => {
  let component: CapturarExpedicionCertificadosComponent;
  let fixture: ComponentFixture<CapturarExpedicionCertificadosComponent>;
  let serviceMock: any;
  let storeMock: any;
  let queryMock: any;

  beforeEach(async () => {
    serviceMock = {
      getEntidadFederativa: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Entidad1' }])),
      getRepresentacionFederal: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Rep1' }])),
      getDetallesDelalicitacion: jest.fn().mockReturnValue(of({
        numeraDelicitacion: '123',
        fechaDelEventoDelicitacion: '2024-01-01',
        descripcionDelProducto: 'desc'
      })),
      obtenerDatosTabla: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Licitacion1' }])),
      getDistribucionSaldo: jest.fn().mockReturnValue(of({
        montoDisponible: '1000'
      }))
    };
    storeMock = {
      setEntidadFederativa: jest.fn(),
      setRepresentacionFederal: jest.fn(),
      setMontoExpedir: jest.fn(),
      setMontoExpedirCheck: jest.fn(),
      setTotalExpedir: jest.fn()
    };
    queryMock = {
      selectSolicitud$: of({
        entidadFederativa: 'Entidad1',
        representacionFederal: 'Rep1',
        numeraDelicitacion: '123',
        fechaDelEventoDelicitacion: '2024-01-01',
        descripcionDelProducto: 'desc',
        montoDisponible: '1000',
        montoAExpedir: '100',
        montoAExpedirCheck: true,
        totalAExpedir: '1100'
      })
    };

    await TestBed.configureTestingModule({
      imports: [CapturarExpedicionCertificadosComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ExpedicionCertificadoService, useValue: serviceMock },
        { provide: Expedicion120204Store, useValue: storeMock },
        { provide: Expedicion120204Query, useValue: queryMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CapturarExpedicionCertificadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe establecer esFormularioSoloLectura desde el input readonly en ngOnInit', () => {
    component.readonly = true;
    component.ngOnInit();
    expect(component.esFormularioSoloLectura).toBe(true);
  });

  it('debe obtener entidad federativa y establecer las opciones', () => {
    component.getEntidadFederativa();
    expect(serviceMock.getEntidadFederativa).toHaveBeenCalled();
    expect(component.entidadFederativaOptions).toEqual([{ id: 1, nombre: 'Entidad1' }]);
  });

  it('debe obtener representación federal y establecer las opciones', () => {
    component.getRepresentacionFederal();
    expect(serviceMock.getRepresentacionFederal).toHaveBeenCalled();
    expect(component.representacionFederalOptions).toEqual([{ id: 1, nombre: 'Rep1' }]);
  });

  it('debe actualizar detalledelaLicitacionForm con los detalles de la licitación', () => {
    component.detalledelaLicitacionForm = new FormBuilder().group({
      numeraDelicitacion: [''],
      fechaDelEventoDelicitacion: [''],
      descripcionDelProducto: ['']
    });
    component.getDetallesDelalicitacion();
    expect(serviceMock.getDetallesDelalicitacion).toHaveBeenCalled();
    expect(component.detalledelaLicitacionForm.value.numeraDelicitacion).toBe('123');
  });

  it('debe establecer datos desde obtenerDatosTabla', () => {
    component.obtenerDatosTabla();
    expect(serviceMock.obtenerDatosTabla).toHaveBeenCalled();
    expect(component.datos).toEqual([{ id: 1, nombre: 'Licitacion1' }]);
  });

  it('debe actualizar distribucionSaldoForm con la distribución de saldo', () => {
    component.distribucionSaldoForm = new FormBuilder().group({
      montoDisponible: ['']
    });
    component.getDistribucionSaldo();
    expect(serviceMock.getDistribucionSaldo).toHaveBeenCalled();
    expect(component.distribucionSaldoForm.value.montoDisponible).toBe('1000');
  });

  it('debe llamar al store setEntidadFederativa en onCambiarEntiadFederative', () => {
    component.formulario = new FormBuilder().group({
      entidadFederativa: ['Entidad1']
    });
    component.onCambiarEntiadFederative();
    expect(storeMock.setEntidadFederativa).toHaveBeenCalledWith('Entidad1');
  });

  it('debe llamar al store setRepresentacionFederal en onCambiarRepresentacionFederal', () => {
    component.formulario = new FormBuilder().group({
      representacionFederal: ['Rep1']
    });
    component.onCambiarRepresentacionFederal();
    expect(storeMock.setRepresentacionFederal).toHaveBeenCalledWith('Rep1');
  });

  it('debe llamar al store setMontoExpedir en onCambiarMontoAExpedir', () => {
    component.distribucionSaldoForm = new FormBuilder().group({
      montoAExpedir: ['100']
    });
    component.onCambiarMontoAExpedir();
    expect(storeMock.setMontoExpedir).toHaveBeenCalledWith('100');
  });

  it('debe llamar al store setMontoExpedirCheck en onCambiarMontoAExpedirCheck', () => {
    component.distribucionSaldoForm = new FormBuilder().group({
      montoAExpedirCheck: [true]
    });
    component.onCambiarMontoAExpedirCheck();
    expect(storeMock.setMontoExpedirCheck).toHaveBeenCalledWith(true);
  });

  it('debe sumar montoAExpedir a totalAExpedir y actualizar el store', () => {
    component.distribucionSaldoForm = new FormBuilder().group({
      montoAExpedir: ['100'],
      totalAExpedir: ['200']
    });
    component.AgregarMontoExpedir();
    expect(component.distribucionSaldoForm.value.totalAExpedir).toBe('300');
    expect(storeMock.setTotalExpedir).toHaveBeenCalledWith(300);
  });

  it('debe retornar true si el control de distribucionSaldoForm es inválido y tocado', () => {
    component.distribucionSaldoForm = new FormBuilder().group({
      test: ['val']
    });
    const control = component.distribucionSaldoForm.get('test');
    control?.markAsTouched();
    control?.setErrors({ required: true });
    expect(component.isInvalid('test')).toBe(true);
  });

  it('debe retornar null si el control de distribucionSaldoForm no existe', () => {
    component.distribucionSaldoForm = new FormBuilder().group({});
    expect(component.isInvalid('notExist')).toBeNull();
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    const nextSpy = jest.spyOn<any, any>(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn<any, any>(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
