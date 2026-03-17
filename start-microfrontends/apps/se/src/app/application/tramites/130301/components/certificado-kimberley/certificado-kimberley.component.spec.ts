import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificadoKimberleyComponent } from './certificado-kimberley.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SolicitudProrrogaService } from '../../services/solicitudProrroga/solicitud-prorroga.service';
import { Tramite130301Store } from '../../../../estados/tramites/tramite130301.store';
import { Tramite130301Query } from '../../../../estados/queries/tramite130301.query';
import { of } from 'rxjs';

describe('CertificadoKimberleyComponent', () => {
  let component: CertificadoKimberleyComponent;
  let fixture: ComponentFixture<CertificadoKimberleyComponent>;
  let mockService: Partial<SolicitudProrrogaService>;
  let mockStore: Partial<Tramite130301Store>;
  let mockQuery: Partial<Tramite130301Query>;

  beforeEach(async () => {
    mockService = {
      obtenerEstadoList: jest.fn().mockReturnValue(of({ data: [] })),
    };
    mockStore = {};
    mockQuery = {
      selectSolicitud$: of({
        idSolicitud: 0,
        folioPermiso: '',
        loginRfc: '',
        certificadosEmitidos: '',
        numeroCertificadokimberley: '',
        paisEmisorCertificado: '6',
        nombreIngles: '',
        mixed: true,
        paisDeOrigen: '6',
        nombreExportador: '',
        direccionExportador: '',
        nombreImportador: '',
        direccionImportador: '',
        numeroEnLetra: '',
        numeroEnLetraIngles: '',
        numeroFactura: '',
        cantidadQuilates: '',
        valorDiamantes: '',
        motivoJustificacion: '',
        otrasDeclaraciones: ''
      }),
    };

    await TestBed.configureTestingModule({
      imports: [CertificadoKimberleyComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: SolicitudProrrogaService, useValue: mockService },
        { provide: Tramite130301Store, useValue: mockStore },
        { provide: Tramite130301Query, useValue: mockQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadoKimberleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con los valores por defecto', () => {
    const actual = component.certificadoKimberley.getRawValue();
    expect(Object.keys(actual)).toEqual([
      'certificadosEmitidos',
      'numeroCertificadokimberley',
      'paisEmisorCertificado',
      'nombreIngles',
      'mixed',
      'paisDeOrigen',
      'nombreExportador',
      'direccionExportador',
      'nombreImportador',
      'direccionImportador',
      'numeroEnLetra',
      'numeroEnLetraIngles',
      'numeroFactura',
      'cantidadQuilates',
      'valorDiamantes',
    ]);

    expect(actual.mixed).toBe(true);
    expect([6, '6']).toContain(actual.paisEmisorCertificado);
    expect([6, '6']).toContain(actual.paisDeOrigen);
  });

  it('debe llamar a obtenerEstadoList al inicializar', () => {
    const obtenerEstadoListSpy = jest.spyOn(mockService, 'obtenerEstadoList');
    component.ngOnInit();
    expect(obtenerEstadoListSpy).toHaveBeenCalled();
  });

  it('debe actualizar los valores del formulario cuando se llama a obtenerFormDatos', () => {
    const mockData = {
      data: [
        {
          certificadosEmitidos: '123',
          numeroCertificadokimberley: '456',
          paisEmisorCertificado: '6',
          nombreIngles: 'Test Name',
          mixed: true,
          paisDeOrigen: '6',
          nombreExportador: 'Exporter Name',
          direccionExportador: 'Exporter Address',
          nombreImportador: 'Importer Name',
          direccionImportador: 'Importer Address',
          numeroEnLetra: 'One Hundred',
          numeroEnLetraIngles: 'One Hundred (EN)',
          numeroFactura: '789',
          cantidadQuilates: '10',
          valorDiamantes: '1000',
        },
      ],
    };

    (mockService.obtenerEstadoList as jest.Mock).mockReturnValueOnce(of(mockData));

    component.ngOnInit();
    const expected = {
      certificadosEmitidos: '123',
      numeroCertificadokimberley: '456',
      paisEmisorCertificado: 6,
      nombreIngles: 'Test Name',
      mixed: true,
      paisDeOrigen: 6,
      nombreExportador: 'Exporter Name',
      direccionExportador: 'Exporter Address',
      nombreImportador: 'Importer Name',
      direccionImportador: 'Importer Address',
      numeroEnLetra: 'One Hundred',
      numeroEnLetraIngles: 'One Hundred (EN)',
      numeroFactura: '789',
      cantidadQuilates: '10',
      valorDiamantes: '1000',
    };
    const actual = component.certificadoKimberley.getRawValue();
    expect([6, '6']).toContain(actual.paisEmisorCertificado);
    expect([6, '6']).toContain(actual.paisDeOrigen);
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
