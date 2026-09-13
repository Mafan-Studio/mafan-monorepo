import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { CreateInquiryInput, Inquiry } from "@mafan/types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "inquiries.json");

const readInquiries = async (): Promise<Inquiry[]> => {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Inquiry[];
  } catch {
    return [];
  }
};

export async function POST(request: Request) {
  const body = (await request.json()) as CreateInquiryInput;

  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 },
    );
  }

  const inquiry: Inquiry = {
    id: randomUUID(),
    name: body.name,
    email: body.email,
    childName: body.childName,
    message: body.message,
    createdAt: new Date().toISOString(),
  };

  const existing = await readInquiries();
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify([...existing, inquiry], null, 2));

  return NextResponse.json({ ok: true });
}
