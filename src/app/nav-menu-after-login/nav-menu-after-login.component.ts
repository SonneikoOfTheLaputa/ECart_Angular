import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiResponse } from '../Models/ApiResponse';
import { LogoutserviceService } from '../Services/logoutservice.service';
@Component({
  selector: 'app-nav-menu-after-login',
  templateUrl: './nav-menu-after-login.component.html',
  styleUrls: ['./nav-menu-after-login.component.css']
})
export class NavMenuAfterLoginComponent implements OnInit {
@Input() username!:string;
  constructor(private route:Router,private logoutservice:LogoutserviceService) { }

  ngOnInit(): void {
  }
  goHome(){
    this.route.navigate(['']);
  }

  LogoutUser(){
    this.logoutservice.logoutUser().subscribe((x:ApiResponse)=>{
if(x!=null && x.message!.length<=0){
      Swal.fire({
        icon: 'success',
        title: 'Good job!',
        text: 'Logged out successfully.'
  
      });
      localStorage.clear();
      this.route.navigate(['/login']); 
    }else
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Error in logging out. Please try again after some time'
    
        });
      }
    
    });
  }
 
  
}
