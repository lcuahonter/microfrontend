import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoTresComponent } from './paso-tres.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [ HttpClientTestingModule, TituloComponent, AlertComponent, AnexarDocumentosComponent , ToastrModule.forRoot()],
      providers: [
        { provide: 'ToastConfig', useValue: {} }
      ],
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
