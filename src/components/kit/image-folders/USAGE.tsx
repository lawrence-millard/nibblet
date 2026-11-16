"use client";

import { ImageFolders } from "./Component";

const images = [
  {
    "id": "coast",
    "src": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=640&q=80",
    "label": "Coast"
  },
  {
    "id": "mountains",
    "src": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80",
    "label": "Mountains"
  },
  {
    "id": "forest",
    "src": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=640&q=80",
    "label": "Forest"
  },
  {
    "id": "desert",
    "src": "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=640&q=80",
    "label": "Desert"
  }
];

export default function Example() {
  return <div style={{ paddingTop: 120 }}>
    <ImageFolders images={images} appearance="light" />
  </div>;
}
