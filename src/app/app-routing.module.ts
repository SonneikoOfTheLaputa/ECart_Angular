import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { MyordersComponent } from './myorders/myorders.component';
import { NestediframeComponent } from './nestediframe/nestediframe.component';
import { OrderdetailsComponent } from './orderdetails/orderdetails.component';
import { ProcesspaymentComponent } from './processpayment/processpayment.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'cart',component:CartComponent},
  {path:'processpayment',component:ProcesspaymentComponent},
  {path:'myorders',component:MyordersComponent},
  {path:'orderdetails/:id',component:OrderdetailsComponent},
  {path:'nestediframes',component:NestediframeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
