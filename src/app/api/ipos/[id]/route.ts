// app/api/ipos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clientPromise, dbName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await params;
    const id = awaitedParams.id;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const { Recommendation, apply_for_listing_gain } = body;

    // Build the update object with only the fields provided
    const updateFields: any = {};
    if (Recommendation !== undefined) {
      updateFields.Recommendation = Recommendation;
    }
    if (apply_for_listing_gain !== undefined) {
      updateFields.apply_for_listing_gain = apply_for_listing_gain;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(dbName);

    const result = await db
      .collection("ipo_status")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "IPO not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (e) {
    console.error(e);
    console.log("Error:", e);
    return NextResponse.json(
      { error: "Failed to update IPO", message: e },
      { status: 500 }
    );
  }
}
