export interface Product {
  slug: string;
  name: string;
  material: string;
  color: string;
  price: number;
  category: string;
  description: string;
}
export const products: Product[] = [
  [
    "poplin-shirt",
    "The Poplin Shirt",
    "Cotton poplin",
    "Chalk",
    1890,
    "Shirting",
    "An easy, long-sleeved shirt with a pointed collar and a single chest pocket.",
  ],
  [
    "field-overshirt",
    "Field Overshirt",
    "Cotton twill",
    "Olive",
    2490,
    "Outerwear",
    "Two patch pockets and a straight hem give this layer its quiet utility.",
  ],
  [
    "studio-tee",
    "Studio Tee",
    "Cotton jersey",
    "Ochre",
    890,
    "Knitwear",
    "A soft crewneck with a relaxed sleeve and a dry, sun-washed finish.",
  ],
  [
    "knit-polo",
    "Knit Polo",
    "Cotton knit",
    "Espresso",
    1690,
    "Knitwear",
    "A fine-gauge polo with a ribbed hem and an open, easy collar.",
  ],
  [
    "transit-jacket",
    "Transit Jacket",
    "Cotton canvas",
    "Sand",
    2990,
    "Outerwear",
    "A cropped zip-front jacket with slanted pockets and a gathered hem.",
  ],
  [
    "rib-tank",
    "Rib Tank",
    "Ribbed cotton",
    "Ivory",
    690,
    "Knitwear",
    "Fine vertical ribs trace a close-fitting everyday base layer.",
  ],
  [
    "pleat-trouser",
    "Pleat Trouser",
    "Brushed twill",
    "Espresso",
    1990,
    "Bottoms",
    "Deep front pleats open into a long, generous leg.",
  ],
  [
    "straight-chino",
    "Straight Chino",
    "Cotton drill",
    "Khaki",
    1790,
    "Bottoms",
    "A straight-leg trouser with clean pockets and a gently structured drape.",
  ],
  [
    "panel-skirt",
    "Panel Skirt",
    "Cotton sateen",
    "Ivory",
    1590,
    "Bottoms",
    "A softly flared midi skirt with an uninterrupted front panel.",
  ],
  [
    "field-short",
    "Field Short",
    "Cotton twill",
    "Olive",
    1290,
    "Bottoms",
    "Relaxed pleated shorts with a clean waistband and a wide opening.",
  ],
].map(([slug, name, material, color, price, category, description]) => ({
  slug: String(slug),
  name: String(name),
  material: String(material),
  color: String(color),
  price: Number(price),
  category: String(category),
  description: String(description),
}));
export const sizes = ["XS", "S", "M", "L", "XL"];
export const looks = [
  {
    id: "soft-structure",
    image: "/campaign/focus-0.webp",
    name: "Soft Structure",
    pieces: ["poplin-shirt", "rib-tank", "pleat-trouser"],
  },
  {
    id: "field-study",
    image: "/campaign/focus-1.webp",
    name: "Field Study",
    pieces: ["field-overshirt", "studio-tee", "straight-chino"],
  },
  {
    id: "after-light",
    image: "/campaign/focus-2.webp",
    name: "After Light",
    pieces: ["knit-polo", "pleat-trouser"],
  },
  {
    id: "transit-line",
    image: "/campaign/focus-3.webp",
    name: "Transit Line",
    pieces: ["transit-jacket", "rib-tank", "field-short"],
  },
];
export const categories = [...new Set(products.map((p) => p.category))];
export const peso = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
export const photo = (p: Product) => "/images/" + p.slug + ".webp";
export const number = (i: number) => String(i + 1).padStart(2, "0");
