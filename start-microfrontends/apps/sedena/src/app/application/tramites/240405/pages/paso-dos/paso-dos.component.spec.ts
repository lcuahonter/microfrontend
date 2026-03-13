import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { AlertComponent, AnexarDocumentosComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

 beforeEach(async () => {
     await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
       imports: [HttpClientModule,TituloComponent,AlertComponent,AnexarDocumentosComponent,ToastrModule.forRoot()],
     }).compileComponents();
 
     fixture = TestBed.createComponent(PasoDosComponent);
     component = fixture.componentInstance;
     fixture.detectChanges();
   });
 
   it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
