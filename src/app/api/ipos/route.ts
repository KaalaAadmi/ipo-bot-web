// app/api/ipos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clientPromise, dbName } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const collection_name = process.env.MONGODB_COLLECTION_NAME || "ipo_status";
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection(collection_name);

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") || "live";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;
    const now = new Date().toISOString().split("T")[0]; // Get 'YYYY-MM-DD'

    // Base filter
    let filter: any = {};

    // 1. Tab filter
    if (tab === "live") {
      filter["LiveIPODetails.end_date"] = { $gte: now };
    } else {
      filter["LiveIPODetails.end_date"] = { $lt: now };
    }

    // 2. Search filter
    if (search) {
      filter.$or = [
        { IPOAnalysisTitle: { $regex: search, $options: "i" } },
        { LiveIPOName: { $regex: search, $options: "i" } },
        { SummarySnippet: { $regex: search, $options: "i" } }, // <-- ADD THIS LINE
      ];
    }

    //
    // Get documents and total count
    const [data, totalDocs] = await Promise.all([
      collection
        .find(filter)
        .sort({ "LiveIPODetails.end_date": -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    // Manually serialize _id
    const serializedData = data.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return NextResponse.json({
      data: serializedData,
      pagination: {
        page,
        limit,
        totalDocs,
        totalPages,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
