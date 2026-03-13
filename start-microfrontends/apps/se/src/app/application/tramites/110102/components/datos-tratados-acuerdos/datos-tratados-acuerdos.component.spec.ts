import { TestBed } from '@angular/core/testing';
import { DatosTratadosAcuerdosComponent } from './datos-tratados-acuerdos.component';
import { DatostratadosacuerdosService } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CONFIGURACION_ACCIONISTAS, TablaSeleccion } from '@ng-mf/data-access-user';

describe('DatosTratadosAcuerdosComponent', () => {
  let component: DatosTratadosAcuerdosComponent;
  let mockService: any;

  beforeEach(async () => {
    mockService = {
      getData: jest.fn().mockReturnValue(of(['dato1', 'dato2']))
    };

    await TestBed.configureTestingModule({
      imports: [DatosTratadosAcuerdosComponent],
      providers: [
        { provide: DatostratadosacuerdosService, useValue: mockService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const FIXTURE = TestBed.createComponent(DatosTratadosAcuerdosComponent);
    component = FIXTURE.componentInstance;
    FIXTURE.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar configuracionTabla y seleccionTabla correctamente', () => {
    expect(component.configuracionTabla).toBe(CONFIGURACION_ACCIONISTAS);
    expect(component.seleccionTabla).toBe(TablaSeleccion.UNDEFINED);
  });

  it('ngOnInit debe obtener datos del servicio y asignarlos a datosTabla', () => {
    component.ngOnInit();
    expect(mockService.getData).toHaveBeenCalled();
    expect(component.datosTabla).toEqual(['dato1', 'dato2']);
  });

  it('ngOnDestroy debe completar el subject destroyed$', () => {
    const SPY_NEXT = jest.spyOn((component as any).destroyed$, 'next');
    const SPY_COMPLETE = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(SPY_NEXT).toHaveBeenCalled();
    expect(SPY_COMPLETE).toHaveBeenCalled();
  });
});