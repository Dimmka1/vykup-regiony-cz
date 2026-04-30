import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BLOG_POSTS } from "../data";

export const alt = "Vykoupím Nemovitost - Blog";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function loadFont(): ArrayBuffer {
  const fontPath = join(process.cwd(), "src/assets/fonts/Inter-Bold.ttf");
  return readFileSync(fontPath).buffer as ArrayBuffer;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

interface OgImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({
  params,
}: OgImageProps): Promise<ImageResponse> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const title = post?.title ?? "Blog - Vykoupím Nemovitost";
  const fontData = loadFont();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
        padding: "60px 80px",
        fontFamily: "Inter",
      }}
    >
      {/* House icon */}
      <svg
        width="60"
        height="60"
        viewBox="0 0 24 24"
        fill="none"
        style={{ marginBottom: "24px" }}
      >
        <path
          d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        style={{
          fontSize: "48px",
          fontWeight: 700,
          color: "white",
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: "900px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "30px",
          fontSize: "20px",
          color: "rgba(255, 255, 255, 0.7)",
        }}
      >
        vykoupim-nemovitost.cz/blog
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
      // Image endpoint — should not appear as a standalone search result.
      headers: { "X-Robots-Tag": "noindex" },
    },
  );
}
