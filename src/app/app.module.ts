import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LoginComponent } from './login/login.component';
import { RecursiveAstVisitor } from '@angular/compiler';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavMenuAfterLoginComponent } from './nav-menu-after-login/nav-menu-after-login.component';
import { CartComponent } from './cart/cart.component';
import {  FormatTimePipe, ProcesspaymentComponent } from './processpayment/processpayment.component';
import { MyordersComponent } from './myorders/myorders.component';
import { OrderdetailsComponent } from './orderdetails/orderdetails.component';
import { NestediframeComponent } from './nestediframe/nestediframe.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    NavMenuComponent,IndexComponent, LoginComponent, DashboardComponent, NavMenuAfterLoginComponent, CartComponent, ProcesspaymentComponent,FormatTimePipe, MyordersComponent, OrderdetailsComponent, NestediframeComponent
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,FormsModule,ReactiveFormsModule,HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
