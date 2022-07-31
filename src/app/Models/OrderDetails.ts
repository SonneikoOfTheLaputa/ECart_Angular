import { ProductOrderDetails } from "./ProductOrderDetails";

export interface OrderDetails
{
      EmailAddress :string;

      TotalPrice:string;
      ShippingDetails :string;
      DeliveryStatus :string;
      OrderId:string;
     ProductOrderDetailsObj :ProductOrderDetails[];
}