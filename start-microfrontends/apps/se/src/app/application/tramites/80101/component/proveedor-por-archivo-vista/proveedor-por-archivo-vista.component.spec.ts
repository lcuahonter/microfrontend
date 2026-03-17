import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProveedorPorArchivoVistaComponent } from './proveedor-por-archivo-vista.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ProveedorPorArchivoVistaComponent', () => {
  let component: ProveedorPorArchivoVistaComponent;
  let fixture: ComponentFixture<ProveedorPorArchivoVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorPorArchivoVistaComponent, HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        { provide: 'ToastConfig', useValue: { timeOut: 3000, positionClass: 'toast-top-right', preventDuplicates: true } },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { paramMap: { get: () => null } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProveedorPorArchivoVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
