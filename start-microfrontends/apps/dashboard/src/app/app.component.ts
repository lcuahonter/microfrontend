
import { FooterComponent, HeaderComponent, UserService } from '@ng-mf/data-access-user';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OnInit } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent,
    HeaderComponent,NgxSpinnerModule],
  selector: 'ng-mf-root',
  template: `
    <c-header></c-header>
    <ngx-spinner name="spinner" type="ball-clip-rotate"></ngx-spinner>
    <router-outlet></router-outlet>
    <c-footer></c-footer>
  `,
})
export class AppComponent implements OnInit {
  isLoggedIn$ = this.userService.isUserLoggedIn$;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
  this.isLoggedIn$
    .pipe(distinctUntilChanged())
    .subscribe(async (loggedIn) => {
  
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          if (!loggedIn) {
            //this.router.navigateByUrl('login');
          } else {
            this.router.navigateByUrl('aga');
          }
          resolve();
        });
      });
    });
  }
}
