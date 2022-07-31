import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { ApiResponse } from '../Models/ApiResponse';
import { Products } from '../Models/Products';
import { ProductServiceService } from '../Services/product-service.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  
  constructor(private router: Router, private productService: ProductServiceService) { }
  usernameFromSession!: string;
  products!: Products[];

  ngOnInit(): void {

    this.usernameFromSession = localStorage.getItem('UserName') || '';
    if (this.usernameFromSession!.length <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Please login to access this page.'

      });
      this.router.navigate(['/login']);

    }
    else {
      this.getAllProducts();
      this.productService.RefreshRequired.subscribe((x)=>{
        this.getAllProducts();
      })
    }
  }
  CheckCartAvailabilityForCheckOut() {

    for(var i=0;i<this.products.length;i++)
    {
      var product=this.products[i];
      var inCart = localStorage.getItem(product.ProductId) || '';
      if (inCart!.length == 0 || Number(inCart) == 0) {
        localStorage.setItem("isCartAvailable", "false");
      }
      else {

        localStorage.setItem("isCartAvailable", "true"); return;
      }
    }   
  }
  AddItem(item: Products) {
    var inCartQty = localStorage.getItem(item.ProductId) || '';

    var qty = item.ProductQuantity;
    if (inCartQty!.length > 0 && Number(inCartQty) >= Number(qty)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Cart exceeded the available quantity. Please re-check the cart.'

      });
    }
    else {
      localStorage.setItem(item.ProductId, inCartQty!.length <= 0 ? "1" : (Number(inCartQty) + 1).toString());
      item.inCart = inCartQty!.length <= 0 ? 1 : (Number(inCartQty) + 1);
      if (item.inCart > 0)
        item.inCartDisplay = "block";
      else
        item.inCartDisplay = "none";

      this.CheckCartAvailabilityForCheckOut();
    }

  }
  RemoveItem(item: Products) {
    var inCartQty = localStorage.getItem(item.ProductId) || '';

    var qty = item.ProductQuantity;
    if (inCartQty!.length > 0 && Number(inCartQty) <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Selected product is not available in cart.'

      });
    }
    else {
      localStorage.setItem(item.ProductId, inCartQty!.length <= 0 ? "1" : (Number(inCartQty) - 1).toString());
      item.inCart = inCartQty!.length <= 0 ? 1 : (Number(inCartQty) - 1);
      if (item.inCart > 0)
        item.inCartDisplay = "block";
      else
        item.inCartDisplay = "none";

      this.CheckCartAvailabilityForCheckOut();



    }
  }
  NotifyUser(item: Products) {


  }
  OpenDescWindow(item: Products) {
    var myWindow = window.open("", "_blank", "width=600,height=700");
    myWindow!.document.write(item.ProductDescription);
  }
  Proceedtocart() {
    this.router.navigate(['/cart']);
  }

  ConvertToNumber(item: string) {
    return Number(item);
  }
  getAllProducts() {
    this.productService.getProducts().subscribe((x: ApiResponse) => {

      if (x != null && x.newToken != null) {
        localStorage.setItem('AuthToken', x.newToken.token);
        localStorage.setItem('RefreshToken', x.newToken.refreshToken);
      }
      if (x != null && x!.message.length > 0) {
        let obj = JSON.parse(x.message) as Products[];
        obj.forEach((x: Products) => {
          var incart = localStorage.getItem(x.ProductId) || '';
          if (incart!.length != 0) {
            x.inCart = Number(incart);
            if (Number(incart) > 0)
              x.inCartDisplay = "block";
            else
              x.inCartDisplay = "none";

          }
          else
            x.inCartDisplay = "none";
        });
        this.products = obj;
      }
    })
  }

}
