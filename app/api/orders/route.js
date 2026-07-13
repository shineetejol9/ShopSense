import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { customerName, address, phone, notes } = body;

    if (!customerName || !address || !phone) {
      return Response.json(
        { success: false, message: "Please fill in your name, address, and phone number." },
        { status: 400 }
      );
    }

    const order = await Order.create({
      customerName,
      address,
      phone,
      notes: notes || "",
    });

    return Response.json({ success: true, order });
  } catch (error) {
    console.error("Order creation failed:", error);
    return Response.json(
      { success: false, message: "Unable to place order right now." },
      { status: 500 }
    );
  }
}
