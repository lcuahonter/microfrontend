import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelTramiteComponent } from './datos-del-tramite.component';
import { SolicitudProrrogaService } from '../../services/solicitudProrroga/solicitud-prorroga.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';

describe('DatosDelTramiteComponent', () => {
  let component: DatosDelTramiteComponent;
  let fixture: ComponentFixture<DatosDelTramiteComponent>;
  let mockService: any;

  const mockFormData = [
    {
      numeroFolioTramiteOriginal: 'FOL123',
      solicitudOpcion: 'OPC1',
      regimen: 'REG1',
      clasificacionDelRegimen: 'CLAS1',
      productoOpcion: 'PROD1',
      descripcionMercancia: 'Desc',
      fraccionArancelaria: '1234.56.78',
      umt: 'kg',
      cantidad: 10,
      valorFactura: 1000,
    },
  ];

  beforeEach(async () => {
    mockService = {
      obtenerDelTramiteFormDatos: jest.fn().mockReturnValue(of({ data: mockFormData })),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosDelTramiteComponent],
      providers: [
        FormBuilder,
        { provide: SolicitudProrrogaService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con los controles deshabilitados', () => {
    const controles = [
      'numeroFolioTramiteOriginal',
      'solicitudOpcion',
      'regimen',
      'clasificacionDelRegimen',
      'productoOpcion',
      'descripcionMercancia',
      'fraccionArancelaria',
      'umt',
      'cantidad',
      'valorFactura',
    ];
    controles.forEach((ctrl) => {
      expect(component.datosDelTramite.get(ctrl)).toBeTruthy();
      expect(component.datosDelTramite.get(ctrl)?.disabled).toBe(true);
    });
  });

  it('debe llamar a obtenerFormDatos y actualizar los valores del formulario', () => {
    component.obtenerFormDatos();
    mockService.obtenerDelTramiteFormDatos();
    expect(mockService.obtenerDelTramiteFormDatos).toHaveBeenCalled();
    expect(component.datosDelTramite.value).toEqual({
      numeroFolioTramiteOriginal: '',
      solicitudOpcion: '',
      regimen: '',
      clasificacionDelRegimen: '',
      productoOpcion: '',
      descripcionMercancia: '',
      fraccionArancelaria: '',
      umt: '',
      cantidad: '',
      valorFactura: '',
    });
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});