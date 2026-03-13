import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

 beforeEach(async () => {
     await TestBed.configureTestingModule({
       imports: [HttpClientModule,ToastrModule.forRoot()],
     }).compileComponents();
 
     fixture = TestBed.createComponent(PasoDosComponent);
     component = fixture.componentInstance;
     fixture.detectChanges();
   });
 
   it('should create', () => {
     expect(component).toBeTruthy();
   });
});
