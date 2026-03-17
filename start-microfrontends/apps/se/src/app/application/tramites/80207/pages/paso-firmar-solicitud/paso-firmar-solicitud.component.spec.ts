import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';

import { PasoFirmarSolicitudComponent } from './paso-firmar-solicitud.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoFirmarSolicitudComponent', () => {
  let component: PasoFirmarSolicitudComponent;
  let fixture: ComponentFixture<PasoFirmarSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoFirmarSolicitudComponent],
      imports: [ FirmaElectronicaComponent,ToastrModule.forRoot(), HttpClientTestingModule ],
     providers: [
        { provide: 'ToastConfig', useValue: {} }
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasoFirmarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
