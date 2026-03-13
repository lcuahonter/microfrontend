import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPantallasComponent } from './solicitud.component';
import { HttpClient } from '@angular/common/http';
import { of, throwError, ReplaySubject } from 'rxjs';
import { ServiciosPantallasService } from '@libs/shared/data-access-user/src/core/services/220471/servicios-pantallas.service';
import { PantallasFormData } from '@libs/shared/data-access-user/src/core/models/220401/servicios-pantallas.model';

describe('SolicitudPantallasComponent', () => {
  let component: SolicitudPantallasComponent;
  let fixture: ComponentFixture<SolicitudPantallasComponent>;
  let httpMock: any;
  let serviciosPantallasServiceMock: any;

  beforeEach(async () => {
    httpMock = {
      get: jest.fn(),
    };

    serviciosPantallasServiceMock = {
      pantallasFormObservable$: of({} as PantallasFormData),
      setPantallasFormDataSubject: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SolicitudPantallasComponent],
      providers: [
        { provide: HttpClient, useValue: httpMock },
        { provide: ServiciosPantallasService, useValue: serviciosPantallasServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPantallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe suscribirse al observable y asignar pantallasFormData', () => {
    const formData = { test: 'valor' } as any;
    serviciosPantallasServiceMock.pantallasFormObservable$ = of(formData);
    const setSpy = jest.spyOn(serviciosPantallasServiceMock, 'setPantallasFormDataSubject');
    jest.spyOn(component, 'loadSolicitudesData').mockImplementation();
    component.ngOnInit();
    expect(component.pantallasFormData).toEqual(formData);
    expect(component.pantallasFormData['solict']).toEqual([]);
    expect(setSpy).toHaveBeenCalledWith(component.pantallasFormData);
  });

  it('ngOnInit debe llamar loadSolicitudesData', () => {
    const spy = jest.spyOn(component, 'loadSolicitudesData');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('loadSolicitudesData debe cargar datos correctamente', () => {
    const mockSolicitudes = [
      { fechaCreacion: '2024-01-01', mercancia: 'Maíz', cantidad: 10, proovedor: 'Proveedor1' },
    ];
    httpMock.get.mockReturnValue(of(mockSolicitudes));
    component.loadSolicitudesData();
    expect(component.solicitudes).toEqual(mockSolicitudes);
  });

  it('loadSolicitudesData debe manejar errores correctamente', () => {
    const error = new Error('Error de red');
    httpMock.get.mockReturnValue(throwError(() => error));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    component.loadSolicitudesData();
    expect(consoleSpy).toHaveBeenCalledWith('Error loading solicitudes data', error);
  });

  it('toggleContent debe alternar el valor de showContent', () => {
    component.showContent = false;
    component.toggleContent();
    expect(component.showContent).toBe(true);
    component.toggleContent();
    expect(component.showContent).toBe(false);
  });

  it('mostrarColapsable debe alternar formFormaceuticaColapsable solo si orden es 1', () => {
    component.formFormaceuticaColapsable = false;
    component.mostrarColapsable(1);
    expect(component.formFormaceuticaColapsable).toBe(true);
    component.mostrarColapsable(1);
    expect(component.formFormaceuticaColapsable).toBe(false);
    component.formFormaceuticaColapsable = false;
    component.mostrarColapsable(2);
    expect(component.formFormaceuticaColapsable).toBe(false);
  });

  it('ngOnDestroy debe limpiar el ReplaySubject destroyed$', () => {
    const spyNext = jest.spyOn((component as any).destroyed$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalledWith(true);
    expect(spyComplete).toHaveBeenCalled();
  });
});