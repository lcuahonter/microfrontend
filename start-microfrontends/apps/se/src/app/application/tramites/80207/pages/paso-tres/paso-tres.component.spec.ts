import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoTresComponent } from './paso-tres.component';
import { AlertComponent, AnexarDocumentosComponent, FirmaElectronicaComponent, TituloComponent } from '@ng-mf/data-access-user';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [TituloComponent, AlertComponent,FirmaElectronicaComponent,
        AnexarDocumentosComponent,ToastrModule.forRoot(),HttpClientModule],
      //providers:[ToastrService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
