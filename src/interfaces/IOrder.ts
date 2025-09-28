import { IModel } from "./IProduct";

export interface ICartPayload {
    model: string;
    quantity: number;
}

export interface IOrderItem {
    product: {
        name: string;
        images: string[];
    };
    sku: {
        sku: string;
        price: number;
        quantity: string;
        imageUrl: string;
        productSkuAttributes: {
            attribute: {
                type: string;
                value: string;
            }
        }[];
    };
    quantity: number;
}

export interface IOrder {
    id: number;
    userId: number;
    orderCode: string;
    totalPrice: number;
    status: string;
    fullName: string;
    phoneNumber: string;
    email?: string;
    note?: string,
    shipment: {
        method: number;
        address: string;
        deliveryDate: Date;
    };
    paymentMethod: {
        id: number,
        key: string,
        name: string,
        image: string,
    },
    flag: {
        isOnlineOrder: boolean,
    },
    orderItems: IOrderItem[],
    createdAt: Date;
}

export interface ICreateOrderPayload {
    userId?: string | null;
    fullName: string;
    phoneNumber: string;
    email: string;
    totalPrice: number;
    note: string;
    shipment: {
        method: number;
        address: string;
        deliveryDate: Date
    },
    flag: {
        isOnlineOrder: boolean;
    },
    paymentMethodId: number;
    orderItems:  {
        skuId: number;
        quantity: number
    }[]
  }
