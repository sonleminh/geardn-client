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

export interface ICreateOrder {
    customer: {
        name: string;
        phone: string;
        mail?: string;
    }
    items: IOrderItem[]
    address?: {
        city: string;
        district: string;
        ward: string;
        specific_address: string;
    };
    shipment?: {
        method: number;
        delivery_date: Date;
        address: string;
    };
    payment: string,
    flag: {
        is_online_order: boolean,
    },
    note?: string,
    userid: string | null;
}
