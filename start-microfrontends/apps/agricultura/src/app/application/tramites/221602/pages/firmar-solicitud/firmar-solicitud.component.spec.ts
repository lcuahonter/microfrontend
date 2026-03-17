import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirmarSolicitudComponent } from './firmar-solicitud.component';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('FirmarSolicitudComponent', () => {
  let component: FirmarSolicitudComponent;
  let fixture: ComponentFixture<FirmarSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmaElectronicaComponent,ToastrModule.forRoot(),HttpClientTestingModule],
      declarations: [FirmarSolicitudComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FirmarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
