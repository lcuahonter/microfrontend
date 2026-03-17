import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PasoDosComponent } from './paso-dos.component';
import { Tramite11201Store } from '../../../../core/estados/tramites/tramite11201.store';
import { Tramite11201Query } from '../../../../core/queries/tramite11201.query';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let tramite11201StoreMock: any;
  let tramite11201QueryMock: any;

  beforeEach(async () => {
    const mockState = {
      linea: '123456',
      monto: '1000',
      montoPagar: '352',
      lineaCheckbox: true,
    };

    tramite11201StoreMock = {
      setLinea: jest.fn(),
      setLineaCheckbox: jest.fn(),
    };

    tramite11201QueryMock = {
      selectSolicitud$: of(mockState),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        PasoDosComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: Tramite11201Store, useValue: tramite11201StoreMock },
        { provide: Tramite11201Query, useValue: tramite11201QueryMock },
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    
    expect(component.formSolicitud).toBeDefined();
    expect(component.formSolicitud.get('pagoDeDerechos')).toBeDefined();
    expect(component.formSolicitud.get('pagoDeDerechos.linea')).toBeDefined();
    expect(component.formSolicitud.get('pagoDeDerechos.monto')).toBeDefined();
    expect(component.formSolicitud.get('pagoDeDerechos.montoPagar')).toBeDefined();
    expect(component.formSolicitud.get('pagoDeDerechos.lineaCheckbox')).toBeDefined();
  });

  it('should disable and set value of montoPagar on campoDeDormularioDeActualizacion', () => {
    component.campoDeDormularioDeActualizacion();
    const montoPagarControl = component.formSolicitud.get('pagoDeDerechos.montoPagar');
    expect(montoPagarControl?.disabled).toBe(true);
    expect(montoPagarControl?.value).toBe('352');
  });

  it('should call setValoresStore when linea input changes', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    const lineaInput = fixture.debugElement.query(By.css('#linea')).nativeElement;
    lineaInput.value = '654321';
    lineaInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(setValoresStoreSpy).toHaveBeenCalledWith(component.formSolicitud, 'pagoDeDerechos.linea', 'setLinea');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});