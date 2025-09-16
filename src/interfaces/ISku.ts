export interface IAttribute {
    id: string;
    value: string;
    attributeId: number;
    createdAt: Date;
}

export interface ISku {
    id: number;
    productId: number;
    sku: string;
    sellingPrice: number;
    quantity: number;
    imageUrl: string;
    productSkuAttributes: {
        id: number;
        attributeValue: IAttribute
    }[]
    createdAt: Date;
}
