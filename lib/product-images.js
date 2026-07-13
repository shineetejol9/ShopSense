import { existsSync } from "fs";
import path from "path";

const IMAGE_ALIASES = {
  "/camera.jpg": "/camerajpg.jpg",
  "/camera.jpeg": "/camerajpg.jpg",
  "/sunglasses.jpg": "/sunglass.jpg",
  "/sunglasses.jpeg": "/sunglass.jpg",
  "/toothbrush.jpg": "/tootbrush.jpg",
  "/toothbrush.jpeg": "/tootbrush.jpg",
  "/fan.jpg": "/neckfan.jpg",
  "/fan.jpeg": "/neckfan.jpg",
  "/jwelery.jpg": "/jwelery.jpg",
  "/jewelry.jpg": "/jwelery.jpg",
  "/jewelry.jpeg": "/jwelery.jpg",
  "hpublic/saree.jpg": "/saree.jpg",
  "hpublic/saree.jpeg": "/saree.jpg",
};

function buildPublicPath(imagePath) {
  const normalized = imagePath
    .trim()
    .replace(/^public\//i, "/")
    .replace(/^hpublic\//i, "/")
    .replace(/^\/+/, "/");

  return path.join(process.cwd(), "public", normalized.replace(/^\//, ""));
}

function tryPathCandidates(imagePath) {
  const normalized = imagePath
    .trim()
    .replace(/^public\//i, "/")
    .replace(/^hpublic\//i, "/")
    .replace(/^\/+/, "/");

  const candidates = [];
  const alias = IMAGE_ALIASES[normalized] || IMAGE_ALIASES[normalized.toLowerCase()];

  if (alias) {
    candidates.push(alias);
  }

  candidates.push(normalized);

  const withoutLeadingSlash = normalized.replace(/^\//, "");
  const ext = path.extname(withoutLeadingSlash);
  const nameWithoutExt = ext ? withoutLeadingSlash.slice(0, -ext.length) : withoutLeadingSlash;

  if (!ext) {
    [".jpg", ".jpeg", ".png"].forEach((extension) => {
      candidates.push(`/${nameWithoutExt}${extension}`);
    });
  }

  return [...new Set(candidates)];
}

export function resolveProductImage(image) {
  if (!image || typeof image !== "string") {
    return null;
  }

  const trimmed = image.trim();

  if (!trimmed || trimmed.startsWith("http")) {
    return null;
  }

  for (const candidate of tryPathCandidates(trimmed)) {
    const publicPath = buildPublicPath(candidate);
    if (existsSync(publicPath)) {
      return candidate.startsWith("/") ? candidate : `/${candidate}`;
    }
  }

  return null;
}

export function logMissingProductImages(products, label = "Products") {
  const missing = products.filter((product) => !resolveProductImage(product.image));

  if (missing.length) {
    console.warn(
      `${label} with missing image files:`,
      missing.map((product) => ({
        title: product.title,
        image: product.image,
      }))
    );
  }
}
