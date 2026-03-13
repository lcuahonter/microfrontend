import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { provideHttpClient } from '@angular/common/http';
import { AlertComponent, AnexarDocumentosComponent, CatalogosService, TituloComponent } from '@ng-mf/data-access-user';
import { provideToastr, ToastrService } from 'ngx-toastr'; // Import ToastrService and provideToastr

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoDosComponent,TituloComponent, AlertComponent, AnexarDocumentosComponent], // Import standalone components
      providers: [
        CatalogosService,
        provideHttpClient(), // Provide HttpClient
        ToastrService, // Provide ToastrService
        provideToastr({
          positionClass: 'toast-top-right', // Example configuration for Toastr
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
