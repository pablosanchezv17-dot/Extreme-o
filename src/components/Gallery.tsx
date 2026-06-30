"use client";

import Image from "next/image";
import { useState } from "react";

type FotoGaleria = {
  src: string;
  alt: string;
  categoria: "Habitaciones" | "Zonas comunes" | "Piscina y azotea" | "Bar y restaurante";
};

const FOTOS: FotoGaleria[] = [
  { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80", alt: "Habitación privada", categoria: "Habitaciones" },
  { src: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768?w=900&q=80", alt: "Dormitorio compartido", categoria: "Habitaciones" },
  { src: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&q=80", alt: "Habitación compartida", categoria: "Habitaciones" },
  { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80", alt: "Sala común", categoria: "Zonas comunes" },
  { src: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=900&q=80", alt: "Cocina compartida", categoria: "Zonas comunes" },
  { src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80", alt: "Piscina en la azotea", categoria: "Piscina y azotea" },
  { src: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=900&q=80", alt: "Vistas desde la azotea", categoria: "Piscina y azotea" },
  { src: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80", alt: "Bar en la azotea", categoria: "Bar y restaurante" },
];

const CATEGORIAS = ["Todas", "Habitaciones", "Zonas comunes", "Piscina y azotea", "Bar y restaurante"] as const;

export function Gallery() {
  const [filtro, setFiltro] = useState<typeof CATEGORIAS[number]>("Todas");
  const [fotoActiva, setFotoActiva] = useState<FotoGaleria | null>(null);

  const fotosFiltradas = filtro === "Todas" ? FOTOS : FOTOS.filter((f) => f.categoria === filtro);

  return (
    <section>
      <div className="mb-6 text-center">
        <span className="eyebrow">Conócenos</span>
        <h2 className="mt-2 font-body text-2xl font-bold text-neutral-800">
          Galería del hostal
        </h2>
        <p className="mt-2 font-body text-sm text-neutral-500">
          Habitaciones, zonas comunes, piscina y bar en la azotea
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            onClick={() => setFiltro(c)}
            className={`rounded-full px-4 py-1.5 font-body text-sm font-medium transition-all ${
              filtro === c
                ? "bg-olive-700 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid de fotos */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {fotosFiltradas.map((foto, i) => (
          <button
            key={i}
            onClick={() => setFotoActiva(foto)}
            className="group relative aspect-square overflow-hidden rounded-2xl"
          >
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
            <span className="absolute bottom-2 left-2 rounded-full bg-black/50 backdrop-blur px-2.5 py-1 font-body text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {foto.categoria}
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox simple */}
      {fotoActiva && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setFotoActiva(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white text-2xl"
            onClick={() => setFotoActiva(null)}
          >
            ✕
          </button>
          <div className="relative max-h-[80vh] w-full max-w-3xl aspect-[4/3]">
            <Image
              src={fotoActiva.src}
              alt={fotoActiva.alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}
