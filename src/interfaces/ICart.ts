// export interface ICart {
//     id: string;
//     userid: string;
//     items: ICartItem[]
// }

import { ISku } from "./ISku";

// export interface ICart {
//     id: string;
//     userid: string;
//     items: ICartItem[]
// }

export interface ICartPayload {
    userid: string | null;
    model: string;
    quantity: number;
}

export interface ICartStoreItem {
    productId: number;
    skuId: number;
    productName: string;
    imageUrl: string;
    price: number;
    quantity: number;
    attributes: {
        attributeId: number;
        value: string;
    }[]
}

export interface ICartServerItem {
    id: number;
    productId: number;
    product: {
        name: string;
        images: string[];
    };
    sku: ISku;
    quantity: number;
}

export interface ISyncCartPayload {
    productId: number;
    skuId: number;
    quantity: number;
}

export interface ICartResponse {
    success: boolean;
    message: string;
    data: {
        id: number;
        userId: number;
        items: ICartServerItem[]};
        user: {
            id: number;
            name: string;
            email: string;
        }
    total: number;
}