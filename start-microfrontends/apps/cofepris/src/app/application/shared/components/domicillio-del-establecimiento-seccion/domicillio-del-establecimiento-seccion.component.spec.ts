import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomicillioDelEstablecimientoSeccionComponent } from './domicillio-del-establecimiento-seccion.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { DatosDelSolicituteSeccionQuery } from '../../estados/queries/datos-del-solicitute-seccion.query';
import { DatosDelSolicituteSeccionStateStore } from '../../estados/stores/datos-del-solicitute-seccion.store';
import { CatalogoSelectComponent, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

describe('DomicillioDelEstablecimientoSeccionComponent', () => {
  let component: DomicillioDelEstablecimientoSeccionComponent;
  let fixture: ComponentFixture<DomicillioDelEstablecimientoSeccionComponent>;
  let establecimientoServiceMock: any;
  let queryMock: any;
  let storeMock: any;

  beforeEach(async () => {
    establecimientoServiceMock = {
      getRegimenData: jest.fn().mockReturnValue(of([])),
      getAduanaDeSalidaData: jest.fn().mockReturnValue(of([])),
      getEstadoData: jest.fn().mockReturnValue(of([])),
      getSciandata: jest.fn().mockReturnValue(of([])),
    };

    queryMock = {
      select: jest.fn().mockReturnValue(of({}))
    };

    storeMock = {
      update: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CatalogoSelectComponent,
        TablaDinamicaComponent,
        TituloComponent,
        DomicillioDelEstablecimientoSeccionComponent
      ],
      declarations: [],
      providers: [
        { provide: EstablecimientoService, useValue: establecimientoServiceMock },
        { provide: DatosDelSolicituteSeccionQuery, useValue: queryMock },
        { provide: DatosDelSolicituteSeccionStateStore, useValue: storeMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomicillioDelEstablecimientoSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component and initialize forms', () => {
    expect(component).toBeTruthy();
    expect(component.domicilioEstablecimiento).toBeDefined();
    expect(component.scianForm).toBeDefined();
  });

  it('should call services on init', () => {
    expect(establecimientoServiceMock.getRegimenData).toHaveBeenCalled();
    expect(establecimientoServiceMock.getAduanaDeSalidaData).toHaveBeenCalled();
    expect(establecimientoServiceMock.getEstadoData).toHaveBeenCalled();
    expect(establecimientoServiceMock.getSciandata).toHaveBeenCalled();
    expect(queryMock.select).toHaveBeenCalled();
  });

  it('should open and close SCIAN modal', () => {
    // mock modal elementRef
    const mockModalEl = document.createElement('div');
    component.establecimientoModal = { nativeElement: mockModalEl } as any;
    component.ngAfterViewInit();

    const showSpy = jest.spyOn(component.modalInstance, 'show');
    const hideSpy = jest.spyOn(component.modalInstance, 'hide');

    component.openScianModal();
    expect(showSpy).toHaveBeenCalled();

    component.closeScianModal();
    expect(hideSpy).toHaveBeenCalled();
  });

  it('should add valid SCIAN entry and reset form', () => {
    component.scianForm.setValue({
      scian: '12345',
      descripcionScian: 'Some description',
    });

    component.guardarScian();

    expect(component.personaparas.length).toBe(1);
    expect(component.scianForm.valid).toBe(false); // because it's reset
  });

  it('should update store when control changes', () => {
    component.domicilioEstablecimiento.get('establecimientoDomicilioEstado')?.setValue('TestEstado');
    component.onControlChange('establecimientoDomicilioEstado');

    expect(storeMock.update).toHaveBeenCalledWith({
      establecimientoDomicilioEstado: 'TestEstado',
    });
  });

  it('should disable form if input is true', () => {
    component.formularioDeshabilitado = true;
    component.ngOnInit();
    expect(component.domicilioEstablecimiento.disabled).toBe(true);
  });
});
