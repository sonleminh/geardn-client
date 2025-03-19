// export interface ICart {
//     id: string;
//     userid: string;
//     items: ICartItem[]
// }

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
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  attributes: {
    type: string;
    value: string;
  }[]
}

export interface ICartServerItem {
    productId: number;
    skuId: number;
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
    attributes: {
        type: string;
        value: string;
    }[]
}

export interface ISyncCartPayload {
    productId: number;
    skuId: number;
    quantity: number;
}