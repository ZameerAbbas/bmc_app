import { db } from "@/lib/firebase";
import { equalTo, get, orderByChild, push, query, ref, set, update } from "firebase/database";

export interface Product {
    id: string;
    name: string;
    price: number;
    category?: {
        id: string;
        name: string;
    }
    categoryId?: string;
    description?: string;
    productImage?: string;
    brand?: string;
    instock?: boolean;
    mg?: number;
    totalSold?: number;
}


export interface Category {
    id?: string;
    name?: string;
    description?: string;
    image?: string;
}
export interface IAddress {
    id?: string;
    street: string;
    city: string;
    stateProvince: string;
    zipCode: string;
    deliveryFee: string;
    deliveryFree: string;
}






export const getProducts = async (): Promise<Product[]> => {
    try {
        const snapshot = await get(ref(db, "products"));
        const data = snapshot.val();

        const products: Product[] = data
            ? Object.keys(data).map((id) => ({
                id,
                ...data[id],
            }))
            : [];

        return products;
    } catch (error) {
        console.log("Error fetching products:", error);
        return [];
    }
};

export const updateProduct = async (product: Product): Promise<void> => {
    try {
        if (!product.id) throw new Error("Product ID is required");

        const productRef = ref(db, `products/${product.id}`);

        await update(productRef, {
            ...product,
        });

    } catch (error) {
        console.log("Error updating product:", error);
        throw error;
    }
};

export const getProductById = async (productId: string): Promise<Product | null> => {
    try {
        const snapshot = await get(ref(db, `products/${productId}`));
        const data = snapshot.val();

        if (!data) return null;

        return {
            id: productId,
            ...data,
        };
    } catch (error) {
        console.log("Error fetching product by ID:", error);
        return null;
    }
};



export const getProductsByCategory = async (
    categoryId: string
): Promise<Product[]> => {
    try {
        const snapshot = await get(ref(db, "products"));
        const data = snapshot.val();

        const products: Product[] = data
            ? Object.keys(data)
                .map((id) => ({
                    id,
                    ...data[id],
                }))
                .filter((item) => item.categoryId === categoryId)
            : [];

        return products;
    } catch (error) {
        console.log("Error fetching category products:", error);
        return [];
    }
};


export const getProductCategories = async (): Promise<Category[]> => {
    try {
        const snapshot = await get(ref(db, "categories"));
        const data = snapshot.val();

        const categories: Category[] = data
            ? Object.keys(data).map((id) => ({
                id,
                ...data[id],
            }))
            : [];

        return categories;
    } catch (error) {
        console.log("Error fetching categories:", error);
        return [];
    }
};





export const getAddresses = async (): Promise<IAddress[]> => {
    try {
        const snapshot = await get(ref(db, "addresses"));
        const data = snapshot.val();

        const addresses: IAddress[] = data
            ? Object.keys(data).map((id) => ({
                id,
                ...data[id],
            }))
            : [];

        return addresses;
    } catch (error) {
        console.log("Error fetching addresses:", error);
        return [];
    }
};


export const getUserById = async (uid: string) => {
    try {
        const snapshot = await get(ref(db, `users/${uid}`));
        return snapshot.val();
    } catch (error) {
        console.log("Error fetching user:", error);
        return null;
    }
};


export const createOrder = async (orderData: any) => {
    try {
        const ordersRef = ref(db, "orders");

        const newOrderRef = push(ordersRef);

        await set(newOrderRef, {
            ...orderData,
            id: newOrderRef.key,
        });

        return {
            success: true,
            orderId: newOrderRef.key,
        };
    } catch (error) {
        console.log("Error creating order:", error);

        return {
            success: false,
            error,
        };
    }
};



export const getOrdersByUserId = async (userId: string) => {
    try {
        const ordersRef = ref(db, "orders");

        const q = query(
            ordersRef,
            orderByChild("userId"),
            equalTo(userId)
        );

        const snapshot = await get(q);

        console.log("ALL ORDERS:", snapshot.val());

        if (!snapshot.exists()) return [];

        const data = snapshot.val();

        return Object.keys(data).map((id) => ({
            id,
            ...data[id],
        }));
    } catch (error) {
        console.log(error);
        return [];
    }
};
