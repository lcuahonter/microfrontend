import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoUnoCsComponent } from './paso-uno-cs.component';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';

describe('PasoUnoCsComponent', () => {
  let component: PasoUnoCsComponent;
  let fixture: ComponentFixture<PasoUnoCsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoCsComponent],
      imports: [ SolicitanteComponent, HttpClientTestingModule, ToastrModule.forRoot() ],   
      providers: [
        { provide: 'ToastConfig', useValue: {} }
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasoUnoCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
