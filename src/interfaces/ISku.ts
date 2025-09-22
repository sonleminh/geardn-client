export interface IAttributeValue {
    value: string;
    attribute: IAttribute;
}

export interface IAttribute {
    id: string;
    name: string;
    label: string;
    createdAt: Date;
}

export interface ISku {
    id: number;
    productId: number;
    sku: string;
    sellingPrice: number;
    imageUrl: string;
    productSkuAttributes: {
        id: number;
        attributeValue: IAttributeValue
    }[]
    createdAt: Date;
    stocks: {
        id: number;
        quantity: number;
    }[];
}
