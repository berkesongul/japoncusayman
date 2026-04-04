import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import sharp from "sharp";

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        let buffer = Buffer.from(bytes) as any;

        // Create a unique filename
        let filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

        if (file.type.startsWith("image/") && !file.type.includes("svg")) {
            // Change extension to .webp
            const lastDotIndex = filename.lastIndexOf(".");
            const nameWithoutExt = lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
            filename = `${nameWithoutExt}.webp`;
            
            // Convert buffer to WebP
            buffer = await sharp(buffer)
                .webp({ quality: 80 })
                .toBuffer();
        }

        const path = join(process.cwd(), "public", "uploads", filename);

        await writeFile(path, buffer);
        console.log(`File uploaded to ${path}`);

        const url = `/uploads/${filename}`;
        return NextResponse.json({ url });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
