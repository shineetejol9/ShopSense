import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { logMissingProductImages, resolveProductImage } from "@/lib/product-images";

export async function GET() {
    await connectDB();
    const products = await Product.find({}, "title description Price Category image").lean();
    logMissingProductImages(products, "Products");

    const sanitizedProducts = products.map((product) => {
        const image = resolveProductImage(product.image) || null;
        return {
            ...product,
            image,
        };
    });

    return Response.json(sanitizedProducts);
}