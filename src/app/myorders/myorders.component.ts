import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiResponse } from '../Models/ApiResponse';
import { LoginModal } from '../Models/LoginModal';
import { OrderDetails } from '../Models/OrderDetails';
import { OrderserviceService } from '../Services/orderservice.service';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css']
})
export class MyordersComponent implements OnInit {

  searchTerm: string = '';
  usernamebind: string = '';
  orderDetails: OrderDetails[] = [];
  constructor(private route1:Router,private route: Router, private orderService: OrderserviceService) { }
  ShowCompleteDetails(orderid: string) {
    this.route.navigate(['/orderdetails', orderid]);
  }
  ngOnInit(): void {

    var name = localStorage.getItem('UserName') || '';
    if (name!.length > 0) {
      var emailAddress = localStorage.getItem('EmailAddress') || '';
      this.usernamebind = name;
      let p: LoginModal = { EmailAddress: emailAddress, Password: '' };
      this.orderService.getAllOrders(p).subscribe((x: ApiResponse) => {
        if (x != null && x.newToken != null) {
          localStorage.setItem('AuthToken', x.newToken.token);
          localStorage.setItem('RefreshToken', x.newToken.refreshToken);
        }
        if (x.message!.length > 0) {
          var orderDetailsObj = JSON.parse(x.message) as OrderDetails[];
          if (orderDetailsObj != null && orderDetailsObj!.length > 0) {
            this.orderDetails = orderDetailsObj;
          }
        }
      })
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Please login to access this page.'

      });
      this.route1.navigate(['/login']);
    }
  }

}
