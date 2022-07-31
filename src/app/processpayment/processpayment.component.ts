import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiResponse } from '../Models/ApiResponse';
import { CardDetails } from '../Models/CreditCard';
import { OrderDetails } from '../Models/OrderDetails';
import { ProductOrderDetails } from '../Models/ProductOrderDetails';
import { Products } from '../Models/Products';
import { ShippingAddress } from '../Models/ShippingAddress'
import { ProductServiceService } from '../Services/product-service.service';
import { BookOrderServiceService } from '../Services/book-order-service.service';
import { Promo } from '../Models/Promo';
import { interval, map, pipe, Subscription, timer } from 'rxjs';
@Component({
  selector: 'app-processpayment',
  templateUrl: './processpayment.component.html',
  styleUrls: ['./processpayment.component.css']
})
export class ProcesspaymentComponent implements OnInit {

  countdown!: Subscription;
  counter = 60;
  tick = 1000;
  otp: string = ''; time: string = '';
  shippingAddress: string = ''; displayOtpSection: string = '';
  otp1: string = ''; IsRegenerateOtp: boolean = false; IsDisabled: boolean = false;
  usernamebind!: string;
  displayCardDetailsSection!: string;
  cardDetailsObj: CardDetails = { CardCvv: '', CardMonth: '', CardName: '', CardNumber: '', CardYear: '' };
  shippingAddressObj: ShippingAddress = { FullName: '', EmailAddress: '', Address: '', City: '', State: '', PinCode: '' };
  constructor(private route: Router, private productService: ProductServiceService, private bookOrderService: BookOrderServiceService) { }
  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  productOrderDetailsObj: ProductOrderDetails[] = [];
  generateUUID() {
    var d = new Date().getTime();
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if (d > 0) {//Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  FinalProceed() {
    if (this.otp == this.otp1) {
      this.IsDisabled = true;

      //Thread.Sleep(10000);
      var price = localStorage.getItem("TotalAmt") || '';

      var orderDetailsObj: OrderDetails = {
        DeliveryStatus: 'Ordered', OrderId: this.generateUUID().toString(),
        ShippingDetails: this.shippingAddress, TotalPrice: price, EmailAddress: this.shippingAddressObj.EmailAddress, ProductOrderDetailsObj: this.productOrderDetailsObj
      };


      this.bookOrderService.bookOrder(orderDetailsObj).subscribe((x: ApiResponse) => {

        if (x.newToken != null) {
          localStorage.setItem("AuthToken", x.newToken.token);
          localStorage.setItem("RefreshToken", x.newToken.refreshToken);
        }
        if (x.message != null && x.message.includes("true")) {
          Swal.fire({
            icon: 'success',
            title: 'Good job!',
            text: 'Order has been placed successfully'

          });

        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Error in placing order. Please try again after some time'

          });
        }

        this.productService.getProducts().subscribe((y: ApiResponse) => {
          if (y.newToken != null) {
            localStorage.setItem("AuthToken", y.newToken.token);
            localStorage.setItem("RefreshToken", y.newToken.refreshToken);
          }
          if (y.message!.length > 0) {
            var products = JSON.parse(y.message) as Products[];
            var finalProducts: Products[] = [];
            products.forEach((z) => {
              var dat = localStorage.getItem(z.ProductId);
              if (dat != null && Number(dat) > 0) {
                z.ProductQuantity = dat;
                finalProducts.push(z);
              }
            })

            this.productService.updateProducts(finalProducts).subscribe((c: ApiResponse) => {
              if (c.newToken != null) {
                localStorage.setItem("AuthToken", c.newToken.token);
                localStorage.setItem("RefreshToken", c.newToken.refreshToken);
              }

              products.forEach((ab) => {
                var item = localStorage.getItem(ab.ProductId);
                if (item != null)
                  localStorage.removeItem(ab.ProductId);
              })
            
              var promo = localStorage.getItem("AppliedPromo") || '';
              if (promo!.length > 0) {
                var obj1: Promo = { PromoCode: promo, PromoUser: this.usernamebind, PromoDesc: '', PromoDiscount: '', PromoExpiry: '', PromoUsage: '' };
                this.bookOrderService.UpdatePromoCode(obj1).subscribe((cb: ApiResponse) => {
                  if (cb.newToken != null) {
                    localStorage.setItem("AuthToken", cb.newToken.token);
                    localStorage.setItem("RefreshToken", cb.newToken.refreshToken);
                  }
                 
                })
              }
              localStorage.removeItem("TotalAmt");

              localStorage.removeItem("AppliedPromo");
              localStorage.removeItem("isCartAvailable");
              this.route.navigate(['/myorders']);
            })
          }
        })
      })
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Incorrect OTP'

      });
    }
  }

  RegenerateOtp() {
    this.IsRegenerateOtp = true;
    this.IsDisabled = false;
    this.otp1 = Math.floor(Math.random() * (999999 - 100000) + 100000).toString();
    Swal.fire({
      icon: 'success',
      title: 'Good job!',
      text: 'OTP has been sent to your mail ' + this.otp1

    });
    
    this.countdown = timer(0, this.tick).subscribe(() => {


      if (this.counter <= 0) {
        this.IsRegenerateOtp = false;
        this.IsDisabled = true;
        this.countdown.unsubscribe();
      }
      --this.counter;

    });
    this.counter=60;
  
  }
  ngOnInit(): void {

    var name = localStorage.getItem('UserName') || '';
    if (name!.length > 0) {
      this.usernamebind = name;
      this.IsDisabled = false;

      this.displayCardDetailsSection = "block";
      this.displayOtpSection = "none";



      var isCartAvailable = localStorage.getItem("isCartAvailable");
      var CompletedPayment = localStorage.getItem("CompletedPayment");
      console.log(isCartAvailable);
      console.log(CompletedPayment);
      if (isCartAvailable == "false" && CompletedPayment == "true") {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Your previous transaction was successfully completed.'
        })

        this.route.navigate(["/dashboard"]);
      }
    }
    else {

      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Please login to access this page.'
      })
      this.route.navigate(["/login"]);

    }
  }

  GoPayment() {
    var emailAddress = localStorage.getItem("EmailAddress");

    if (this.cardDetailsObj!.CardCvv.length != 3) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Invalid CVV'

      });
      return;
    }
    if (this.cardDetailsObj!.CardYear.length != 4) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Invalid card year'

      }); return;
    }
    if (this.cardDetailsObj!.CardMonth.length <= 0 || !this.monthNames.includes(this.cardDetailsObj!.CardMonth)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Invalid card month'

      }); return;
    }
    if (this.cardDetailsObj!.CardNumber.length != 16) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Invalid card number'

      }); return;
    }
    if (this.cardDetailsObj!.CardName.length <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Invalid card member name'

      }); return;
    }

    if (this.shippingAddressObj!.EmailAddress !== emailAddress) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Incorrect mail address'

      });
      return;
    }
    if (this.shippingAddressObj!.FullName.length <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Incorrect member name'

      });
      return;
    }
    if (this.shippingAddressObj!.City.length <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Incorrect city'

      });
      return;

    }
    if (this.shippingAddressObj!.State.length <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Incorrect state'

      });
      return;

    }
    if (this.shippingAddressObj!.PinCode.length <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Incorrect pincode'

      });
      return;
    }
    if (this.shippingAddressObj!.Address.length <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Incorrect member address'

      });
      return;
    }




    var price = localStorage.getItem("TotalAmt");

    this.productService.getProducts().subscribe((x: ApiResponse) => {
      if (x.newToken != null) {
        localStorage.setItem('AuthToken', x.newToken.token);
        localStorage.setItem('RefreshToken', x.newToken.refreshToken);
      }
      if (x.message != null) {
        var products = JSON.parse(x.message) as Products[];
        products.forEach((x) => {
          var ProductId = localStorage.getItem(x.ProductId);
          if (ProductId != null && Number(ProductId) > 0) {
            var a1: ProductOrderDetails = { ProductCount: ProductId, ProductName: x.ProductName, ProductPrice: x.ProductPrice };
            this.productOrderDetailsObj.push(a1);
          }
        })

      }
    })
    this.shippingAddress += this.shippingAddressObj.FullName + " " + this.shippingAddressObj.Address + " " + this.shippingAddressObj.City + " " + this.shippingAddressObj.State
      + " " + this.shippingAddressObj.PinCode;

    this.displayCardDetailsSection = "none";
    this.displayOtpSection = "block";
    this.otp1 = Math.floor(Math.random() * (999999 - 100000) + 100000).toString();
    Swal.fire({
      icon: 'success',
      title: 'Good job!',
      text: 'OTP has been sent to your mail address - ' + this.otp1

    });

    
    this.IsRegenerateOtp = true; this.IsDisabled = false;
    
    this.countdown = timer(0, this.tick).subscribe(() => {


      if (this.counter <= 0) {
        this.IsRegenerateOtp = false;
        this.IsDisabled = true;
        this.countdown.unsubscribe();
      }
      --this.counter;

    });
    this.counter=60;
    //this.countdown.unsubscribe();
  }
}
@Pipe({
  name: "formatTime"
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    if (value > 0) {

      return "New OTP can be generated in " + value;
    }
    else

      return "New OTP can be generated using below link";
  }

}