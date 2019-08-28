export class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    creationDate: Date;
    thumbnailUrl: string;
    url: string;
    type: number;
    deliveryComp: string;
}

export class ProductDelivery {
    delivery: string;
    type: string;
    products: Product[];
}

export class ProductJson{
    fedex: Product[];
    ups: Product[];
    type: number;
    thirdType: Product[];
}