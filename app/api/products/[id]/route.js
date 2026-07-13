import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { resolveProductImage } from "@/lib/product-images";

export async function GET(req, { params }) {
  await connectDB();

  const { id } = await params;

  const product = await Product.findById(
    id,
    "title description Price Category image"
  ).lean();

  if (!product) {
    return Response.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return Response.json({
    ...product,
    image: resolveProductImage(product.image),
  });
}