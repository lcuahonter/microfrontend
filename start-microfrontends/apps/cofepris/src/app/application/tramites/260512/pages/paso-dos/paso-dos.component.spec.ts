import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { HttpClientModule } from '@angular/common/http';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'anexar-documentos',
  template: '',
})

class MockAnexarDocumentosComponent {
  cargaArchivosEvento = new Subject<any>();
  destroyNotifier$ = new Subject<void>();
  confirmUpload = jest.fn();
}

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent, MockAnexarDocumentosComponent],
      imports: [
        HttpClientModule,
        TituloComponent,
        ToastrModule.forRoot(),
      ],
      providers: [ToastrService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
