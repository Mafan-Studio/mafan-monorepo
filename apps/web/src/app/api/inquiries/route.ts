import { NextResponse } from "next/server";
import type { CreateInquiryInput } from "@mafan/types";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  const body = (await request.json()) as CreateInquiryInput;

  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 },
    );
  }

  const { error } = await supabaseAdmin.from("inquiries").insert({
    name: body.name,
    email: body.email,
    child_name: body.childName,
    message: body.message,
  });

  if (error) {
    console.error("Failed to store inquiry", error);
    return NextResponse.json(
      { error: "Failed to store inquiry" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
