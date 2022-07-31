import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { LoginServiceService } from '../Services/login-service.service';
import { LoginModal } from '../Models/LoginModal';
import { ApiResponse } from '../Models/ApiResponse';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup | any;
  loading = false;
  submitted = false;
  returnUrl: string | any;
  loginObj: LoginModal | any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router, private apiService: LoginServiceService
  ) {
    // redirect to home if already logged in

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    var username = localStorage.getItem('AuthToken') || '';
    if (username!.length>0) {
      Swal.fire({
        icon: 'warning',
        title: 'Good job!',
        text: 'Already logged in!'

      });
this.router.navigate(['/dashboard']);
    }
    // get return url from route parameters or default to '/'

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;



    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    let p: LoginModal = { EmailAddress: this.loginForm.controls['username'].value, Password: this.loginForm.controls['password'].value };

    this.apiService.GetLogin(p).subscribe((x: ApiResponse) => {


      if (x != null && (x.message == null || x.message.length == 0)) {

        localStorage.setItem('AuthToken', x.token);
        localStorage.setItem('RefreshToken', x.refreshToken);
        this.apiService.getUserName(p).subscribe((y: ApiResponse) => {
          if (y != null && y.newToken != null) {
            localStorage.setItem('AuthToken', y.newToken.token);
            localStorage.setItem('RefreshToken', y.newToken.refreshToken);
          }

          if (y != null && y.message.length > 0) {
            localStorage.setItem('UserName', y.message);
            localStorage.setItem('EmailAddress', p.EmailAddress);
            Swal.fire({
              icon: 'success',
              title: 'Good job!',
              text: 'Logged in successfully'

            });
            this.router.navigate(['/dashboard']);
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops!',
              text: 'Error in backend. Please try again later'

            });
          }
        })
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: x.message

        });
      }

    });
    this.loading = true;

  }
}
