import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoTresComponent } from './paso-tres.component';
import { AlertComponent, AnexarDocumentosComponent, FirmaElectronicaComponent, TablaDinamicaComponent, TituloComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent],
      imports: [TituloComponent, HttpClientTestingModule, AlertComponent, TablaDinamicaComponent, AnexarDocumentosComponent, ToastrModule.forRoot(), FirmaElectronicaComponent]
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
 