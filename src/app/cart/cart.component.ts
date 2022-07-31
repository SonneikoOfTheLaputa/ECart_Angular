import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiResponse } from '../Models/ApiResponse';
import { Products } from '../Models/Products';
import { Promo } from '../Models/Promo';
import { ProductServiceService } from '../Services/product-service.service';
import { PromoServiceService } from '../Services/promo-service.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  showEmptyCart!: string;
  productsList: Products[]=[];
  finalTotal: number = 0;
  SubTotal: number = 0; taxTotal: number = 0;
  showFullCart: string = '';
  isPromoApplied: boolean = false;dis:Number=0;
  displayPendingUsage: string = '';
  promoPendingUsage: string = '';
  promomsg1: string = '';
  promomsg2: string = ''; promocode: string = '';
  constructor(private promoService: PromoServiceService, private route: Router,
    private productService: ProductServiceService) { }
    usernameFromSession!: string;

  SaveTotal() {

    localStorage.setItem("TotalAmt", this.finalTotal.toString());
  }
  ReduceNumbers(item: Products) {
    if (item.inCart > 1) {
      var currentVal = item.inCart;
      localStorage.setItem(item.ProductId, (currentVal - 1).toString());
      item.inCart -= 1;
      console.log(this.dis);
      this.ReturnSubTotal(this.dis);
    }
  }
  ConvertToNumber(a: string) {
    return Number(a);
  }
  ReturnSubTotal(discount: Number) {
    var tot = 0;
    this.productsList.forEach((x) => {
      if (x.inCart > 0) {
        tot += x.inCart * (Number(x.ProductPrice));
      }
    })
    if (discount == 0)
      this.SubTotal = tot;
    else
      this.SubTotal = parseFloat(tot.toString()) * (parseFloat(discount.toString()) / parseFloat('100'));
   
    this.taxTotal = this.SubTotal * 0.16;
    this.finalTotal = this.taxTotal + this.SubTotal + parseFloat('150');
  }
  ReduceNumbersMethodDisplay(item:Products){
    if(item.inCart>1)return "block";
    else
    return "none";
  }
  ApplyPromo() {
    var emailAddress = localStorage.getItem('EmailAddress');
    var code = this.promocode;
    console.log(code);
    var name = localStorage.getItem("UserName") || '';
    if (code!.length > 0) {
      let obj: Promo = { PromoCode: code, PromoUser: name, PromoDesc: '', PromoDiscount: '', PromoExpiry: '', PromoUsage: '' };
      this.promoService.getPromoCodes(obj).subscribe((data: ApiResponse) => {
      
        if (data.newToken != null) {
          localStorage.setItem("AuthToken", data.newToken.token);
          localStorage.setItem("RefreshToken", data.newToken.refreshToken);
        }
        if (data!.message.length > 0) {
          var response = JSON.parse(data.message) as Promo;
          if (response != null && response.PromoCode!.length > 0) {
            var formats = "dd-MM-yyyy";

            this.isPromoApplied = true;
            var dis = Number(response.PromoDiscount);
            this.displayPendingUsage = "block";
            this.promomsg1 = response.PromoCode + " applied successfully.";
            this.promomsg2 = response.PromoDesc;
            this.promoPendingUsage = response.PromoUsage;
            var a = response.PromoExpiry;
            var arr = a.split('-');
            var dateTime = new Date(arr[2] + '-' + arr[1] + '-' + arr[0]);
            dateTime.setHours(23);
            dateTime.setMinutes(59);
            dateTime.setSeconds(59);
            if (new Date() > dateTime) {
              Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Promo code got expired. Please try different one.'

              });
              this.isPromoApplied = false; this.displayPendingUsage = "none"; localStorage.removeItem('AppliedPromo');
              this.ReturnSubTotal(0); this.promomsg2 = ""; this.promoPendingUsage = "";this.promomsg1 = "Please enter valid promo code to continue.";
            }
            else if (response.PromoDiscount != "0") {
              this.ReturnSubTotal(Number(response.PromoDiscount));
              localStorage.setItem("AppliedPromo", code);
            }

          }
          else {
            this.isPromoApplied = false; dis = 0;
            this.ReturnSubTotal(dis);
            this.displayPendingUsage = "none";
            this.promomsg1 = "Invalid code. Please try again.";
            this.promoPendingUsage = "";
            this.promomsg2 = "";localStorage.removeItem('AppliedPromo');
          }
        }
        else {
          this.isPromoApplied = false;
          this.ReturnSubTotal(0); this.promomsg2 = ""; this.promoPendingUsage = "";
          this.displayPendingUsage = "none"; this.promomsg1 = "Please enter promo code to continue.";localStorage.removeItem('AppliedPromo');
        }
      })

    }
else{
  this.promomsg1 = "Please enter promo code to continue.";
}

  }
  RemoveCompleteItems(item: Products) {
    item.inCart = 0;
    localStorage.setItem(item.ProductId, "0");
    var partialList:Products[]=[];
    this.productsList.forEach((x)=>{
     
      if(x.ProductId!==item.ProductId)
      {
        partialList.push(x);
      }
    })
   
   this.productsList=partialList;
  this.ReturnSubTotal(this.dis);
   
    if (this.productsList?.length > 0) {

    }
    else {
      localStorage.setItem("isCartAvailable", "false");
      this.showFullCart = "none";
      this.showEmptyCart = "block";
    }

  }
  ngOnInit(): void {
    var name = localStorage.getItem('UserName') || '';
    if (name.length > 0) {
      this.usernameFromSession=name;
      var isCartAvailable = localStorage.getItem('isCartAvailable') || '';
      if (isCartAvailable == "true") {
        this.displayPendingUsage = "none";
        var token = localStorage.getItem("AuthToken");
        var refreshToken = localStorage.getItem("RefreshToken");
        var promo = localStorage.getItem("AppliedPromo") || '';
        if (promo.length > 0) 
        {
          let obj: Promo = { PromoCode: promo, PromoUser: name, PromoDesc: '', PromoDiscount: '', PromoExpiry: '', PromoUsage: '' };
          this.promoService.getPromoCodes(obj).subscribe((data: ApiResponse) => {
            if (data.newToken != null) {
              localStorage.setItem("AuthToken", data.newToken.token);
              localStorage.setItem("RefreshToken", data.newToken.refreshToken);
            }
            if (data != null) {
              var response = JSON.parse(data.message) as Promo;
              if (response != null && response.PromoCode.length > 0) {
                var formats = "dd-MM-yyyy";
                var a = response.PromoExpiry;
                var arr = a.split('-');
                var dateTime = new Date(arr[2] + '-' + arr[1] + '-' + arr[0]);
                dateTime.setHours(23);
                dateTime.setMinutes(59);
                dateTime.setSeconds(59);

                if (new Date() > dateTime) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Promo code got expired. Please try different one.'

                  });
                }
                else {
               this.promocode=response.PromoCode;
                  this.isPromoApplied = true;
                  this.dis = Number(response.PromoDiscount);
                  this.displayPendingUsage = "block";
                  this.promomsg1 = response.PromoCode + " applied successfully."; this.promomsg2 = response.PromoDesc;
                  this.promoPendingUsage = response.PromoUsage;
                }
              }
              else {
                this.isPromoApplied = false; this.dis = 0;
                this.displayPendingUsage = "none";
                this.promomsg1 = "Invalid code. Please try again."; this.promoPendingUsage = ""; this.promomsg2 = "";
              }
            }
          })
        }
        this.showEmptyCart = "none";
        this.showFullCart = "block";

          this.productService.getProducts().subscribe((data: ApiResponse) => {
            if (data.newToken != null) {
              localStorage.setItem("AuthToken", data.newToken.token);
              localStorage.setItem("RefreshToken", data.newToken.refreshToken);
            }

            if (data != null && data.message != null) {
              var fullProducts = JSON.parse(data.message) as Products[];
              if (fullProducts?.length > 0) {
                fullProducts.forEach((item) => {
                  var inCart = localStorage.getItem(item.ProductId);
                  if (inCart == null || Number(inCart) == 0) {

                  }
                  else {
                    item.inCart = Number(inCart);
                    this.productsList.push(item);
                    this.ReturnSubTotal(this.dis>0?this.dis:0);
                  }
                })


              }
            }
          })
        
          
      

      } else if (isCartAvailable == "false") {
        this.showEmptyCart = "block"; this.showFullCart = "none"; this.displayPendingUsage = "none";

      }
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Please login to access this page.'

      });
      this.route.navigate(['/login']);
    }


  }

}
