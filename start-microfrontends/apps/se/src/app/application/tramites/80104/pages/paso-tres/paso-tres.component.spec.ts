import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoTresComponent } from './paso-tres.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'anexar-documentos',
  template: ''
})

class MockAnexarDocumentosComponent {
  cargaArchivosEvento = {
    pipe: () => ({ subscribe: () => {} })
  };
}

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoTresComponent, MockAnexarDocumentosComponent],
      imports: [ HttpClientTestingModule, TituloComponent, AlertComponent , ToastrModule.forRoot()],
      providers: [
        { provide: 'ToastConfig', useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });
});
