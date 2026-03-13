import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AlertComponent, AnexarDocumentosComponent, CatalogosService, TituloComponent } from '@ng-mf/data-access-user';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { AltaPlantaComponent } from './alta-planta.component';

describe('AltaPlantaComponent', () => {
  let component: AltaPlantaComponent;
  let fixture: ComponentFixture<AltaPlantaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaPlantaComponent, TituloComponent, AlertComponent, AnexarDocumentosComponent], 
      providers: [
        CatalogosService,
        provideHttpClient(), 
        ToastrService, 
        provideToastr({
          positionClass: 'toast-top-right', 
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AltaPlantaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
