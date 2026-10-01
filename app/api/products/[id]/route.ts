import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = process.env.API_KEY;
  const apiUrl = process.env.API_BASE_URL;

  if (!apiKey) {
    return NextResponse.json({ message: "Missing API_KEY." }, { status: 500 });
  }

  const { id } = await params;

  try {
    const response = await fetch(
      `${apiUrl}/products/${encodeURIComponent(id)}`,
      {
        headers: { "x-api-key": apiKey },
        cache: "no-store",
      }
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Could not load the product." },
      { status: 502 }
    );
  }
}
