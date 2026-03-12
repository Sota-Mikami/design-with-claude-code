"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, Star, Grid3x3, List } from "lucide-react";
import { cafes, renderStars, type Cafe } from "./data";

// ─── Components ───

function CafeCardGrid({ cafe }: { cafe: Cafe }) {
  return (
    <Link
      href="/cafe"
      className="group block rounded-lg border border-border overflow-hidden hover:shadow-bottom-200 transition-all"
    >
      <div className="aspect-[4/3] bg-bg-surface overflow-hidden">
        <img
          src={cafe.image}
          alt={cafe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-text group-hover:text-primary transition-colors">
            {cafe.name}
          </h3>
          <span className="text-sm text-text-sub shrink-0">{cafe.priceRange}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-text-sub mb-2">
          <MapPin size={13} />
          <span>{cafe.area}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-primary">{cafe.rating}</span>
            <span className="text-xs text-amber-400">{renderStars(cafe.rating)}</span>
          </div>
          <span className="text-xs text-text-hint">{cafe.reviewCount} reviews</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {cafe.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-full bg-bg-surface text-text-sub"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function CafeCardList({ cafe }: { cafe: Cafe }) {
  return (
    <Link
      href="/cafe"
      className="group flex gap-4 rounded-lg border border-border overflow-hidden hover:shadow-bottom-200 transition-all p-3"
    >
      <div className="w-32 h-24 rounded-md bg-bg-surface overflow-hidden shrink-0">
        <img
          src={cafe.image}
          alt={cafe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-text group-hover:text-primary transition-colors truncate">
              {cafe.name}
            </h3>
            <span className="text-sm text-text-sub shrink-0">{cafe.priceRange}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-text-sub mt-0.5">
            <MapPin size={13} />
            <span>{cafe.area}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-primary">{cafe.rating}</span>
            <span className="text-xs text-amber-400">{renderStars(cafe.rating)}</span>
            <span className="text-xs text-text-hint ml-1">({cafe.reviewCount})</span>
          </div>
          <div className="flex gap-1">
            {cafe.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-full bg-bg-surface text-text-sub"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-bg-surface" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-bg-surface rounded w-3/4" />
        <div className="h-3 bg-bg-surface rounded w-1/2" />
        <div className="h-3 bg-bg-surface rounded w-2/3" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-bg-surface flex items-center justify-center mb-4">
        <Search size={24} className="text-text-hint" />
      </div>
      <h3 className="text-lg font-bold text-text mb-1">見つかりませんでした</h3>
      <p className="text-sm text-text-sub max-w-xs">
        条件に一致するカフェがありません。検索条件を変更してお試しください。
      </p>
    </div>
  );
}

// ─── Main ───

function CafeListInner() {
  const searchParams = useSearchParams();
  const variant = searchParams.get("_v");
  const tab = searchParams.get("_tab");

  // State: grid (default) or list — controlled by app UI toggle & ProtoNav
  const isGrid = tab !== "list";
  const isLoading = variant === "loading";
  const isEmpty = variant === "empty";

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-1">Cafe Explorer</h1>
        <p className="text-sm text-text-sub">ホーチミンのお気に入りカフェを見つけよう</p>
      </div>

      {/* Search & Controls */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-hint" />
          <input
            type="text"
            placeholder="カフェ名・エリアで検索..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-bg focus:outline-none focus:border-border-primary focus:ring-2 focus:ring-border-focus/50 transition-colors"
          />
        </div>
        {/* Grid/List toggle — this is an app feature (State), not a Pattern */}
        <div className="flex items-center bg-bg-surface rounded-lg p-1 gap-0.5">
          <Link
            href="/"
            className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${
              isGrid
                ? "bg-bg text-text shadow-sm"
                : "text-text-sub hover:text-text"
            }`}
          >
            <Grid3x3 size={16} />
          </Link>
          <Link
            href="/?_tab=list"
            className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${
              !isGrid
                ? "bg-bg text-text shadow-sm"
                : "text-text-sub hover:text-text"
            }`}
          >
            <List size={16} />
          </Link>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {["All", "Wi-Fi", "Specialty", "Pet-Friendly", "Budget"].map((filter, i) => (
          <button
            key={filter}
            className={`px-4 py-1.5 text-sm rounded-full border whitespace-nowrap transition-colors ${
              i === 0
                ? "bg-primary text-on-fill border-primary"
                : "border-border text-text-sub hover:bg-bg-surface"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className={`grid gap-4 ${isGrid ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : isEmpty ? (
        <EmptyState />
      ) : isGrid ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cafes.map((cafe) => (
            <CafeCardGrid key={cafe.id} cafe={cafe} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {cafes.map((cafe) => (
            <CafeCardList key={cafe.id} cafe={cafe} />
          ))}
        </div>
      )}

      {/* Results count */}
      {!isLoading && !isEmpty && (
        <p className="text-xs text-text-hint text-center mt-6">
          {cafes.length} cafes found
        </p>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense>
      <CafeListInner />
    </Suspense>
  );
}
