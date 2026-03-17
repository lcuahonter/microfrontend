import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  AlertComponent,
  AnexarDocumentosComponent,
  CatalogosService,
  TituloComponent,
  ValidacionesFormularioService,
} from '@ng-mf/data-access-user';
import { provideToastr, ToastrService } from 'ngx-toastr'; // Import ToastrService and provideToastr
import { PagoDeDerechoComponent } from './pago-de-derecho.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';
import { Tramite230202Query } from '../../estados/tramite230202.query';
import { Tramite230202Store } from '../../estados/tramite230202.store';

describe('PagoDeDerechoComponent', () => {
  let component: PagoDeDerechoComponent;
  let fixture: ComponentFixture<PagoDeDerechoComponent>;

  let solicitud230202Store: any;

  beforeEach(async () => {
    solicitud230202Store = {
      setTestField: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        PagoDeDerechoComponent,
        TituloComponent,
        AlertComponent,
        AnexarDocumentosComponent,
      ], // Import standalone components
      declarations: [],
      providers: [
        CatalogosService,
        provideHttpClient(), // Provide HttpClient
        ToastrService, // Provide ToastrService
        provideToastr({
          positionClass: 'toast-top-right', // Example configuration for Toastr
        }),
        { provide: 'solicitud230202Store', useValue: solicitud230202Store }, // Mock solicitud230202Store
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return pagodeDerechos form group', () => {
    const mockPagodeDerechos = new FormGroup({});
    component.FormSolicitud = new FormGroup({
      pagodeDerechos: mockPagodeDerechos,
    });

    const result = component.pagodeDerechos;

    expect(result).toBe(mockPagodeDerechos);
  });

  it('should clean up observables on ngOnDestroy', () => {
    const destroyedNextSpy = jest.spyOn(component['destroyed$'], 'next');
    const destroyedCompleteSpy = jest.spyOn(
      component['destroyed$'],
      'complete'
    );
    const destroyNotifierNextSpy = jest.spyOn(
      component['destroyNotifier$'],
      'next'
    );
    const destroyNotifierCompleteSpy = jest.spyOn(
      component['destroyNotifier$'],
      'complete'
    );

    component.ngOnDestroy();

    expect(destroyedNextSpy).toHaveBeenCalledWith(true);
    expect(destroyedCompleteSpy).toHaveBeenCalled();
    expect(destroyNotifierNextSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });
});
