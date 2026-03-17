import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { provideHttpClient } from '@angular/common/http';
import { AlertComponent, AnexarDocumentosComponent, CatalogosService, TituloComponent } from '@ng-mf/data-access-user';
import { provideToastr, ToastrService } from 'ngx-toastr'; 

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoDosComponent,TituloComponent, AlertComponent, AnexarDocumentosComponent], 
      providers: [
        CatalogosService,
        provideHttpClient(), 
        ToastrService, 
        provideToastr({
          positionClass: 'toast-top-right', 
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
