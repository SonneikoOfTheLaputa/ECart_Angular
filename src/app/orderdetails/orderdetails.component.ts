import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiResponse } from '../Models/ApiResponse';
import { OrderDetails } from '../Models/OrderDetails';
import { SingleOrderDetailsRequest } from '../Models/SingleOrderDetailsRequest';
import { OrderserviceService } from '../Services/orderservice.service';

@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.css']
})
export class OrderdetailsComponent implements OnInit {
  usernamebind: string = '';
  orderId:string='';

  orderDetails:OrderDetails={DeliveryStatus:'',EmailAddress:'',OrderId:'',ProductOrderDetailsObj:[],ShippingDetails:'',TotalPrice:''};
  constructor(private route1:Router,private route:ActivatedRoute,private orderservice:OrderserviceService) { }

  ngOnInit(): void {


    var name = localStorage.getItem('UserName') || '';
    if (name!.length > 0) {
      this.usernamebind = name;
this.orderId=this.route.snapshot.paramMap.get('id')||'';
var obj:SingleOrderDetailsRequest={OrderId:this.orderId};
this.orderservice.getSingleOrder(obj).subscribe((x:ApiResponse)=>{
  if (x != null && x.newToken != null) {
    localStorage.setItem('AuthToken', x.newToken.token);
    localStorage.setItem('RefreshToken', x.newToken.refreshToken);
  }
  if(x.message!.length>0){
this.orderDetails=JSON.parse(x.message) as OrderDetails;


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
