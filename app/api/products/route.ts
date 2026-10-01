import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.API_KEY;
  const apiUrl = process.env.API_BASE_URL;

  if (!apiKey || !apiUrl) {
    return NextResponse.json(
      { message: "Missing API_KEY or API_BASE_URL." },
      { status: 500 }
    );
  }

  const search = request.nextUrl.searchParams.get("search");
  const url = new URL(apiUrl);
  if (search) url.searchParams.set("search", search);

  try {
    const response = await fetch(url, {
      headers: { "x-api-key": apiKey },
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Could not connect to the catalog." },
      { status: 502 }
    );
  }
}
