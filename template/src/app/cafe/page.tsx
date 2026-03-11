"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Flame,
} from "lucide-react";
import {
  cafes,
  menuItems,
  reviews,
  formatPrice,
  renderStars,
  type MenuItem,
  type Review,
} from "../data";

// ─── Shared ───

const cafe = cafes[0]; // Sample: use first cafe as detail target

function CategoryLabel({ category }: { category: MenuItem["category"] }) {
  const map = {
    coffee: { label: "Coffee", cls: "bg-orange-50 text-orange-700" },
    tea: { label: "Tea", cls: "bg-green-50 text-green-700" },
    food: { label: "Food", cls: "bg-blue-50 text-blue-700" },
    dessert: { label: "Dessert", cls: "bg-pink-50 text-pink-700" },
  };
  const { label, cls } = map[category];
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${cls}`}>
      {label}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "text-orange-400 fill-orange-400" : "text-gray-200"}
        />
      ))}
    </div>
  );
}

// ─── Tab: Menu ───

function MenuTab() {
  const categories = ["coffee", "tea", "food", "dessert"] as const;

  return (
    <div className="space-y-6">
      {categories.map((cat) => {
        const items = menuItems.filter((m) => m.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat}>
            <h3 className="text-sm font-bold text-text uppercase tracking-wide mb-3">
              {cat}
            </h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 px-4 rounded-lg border border-border hover:bg-bg-surface transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-text">{item.name}</span>
                    {item.popular && (
                      <span className="flex items-center gap-0.5 text-[11px] text-orange-600 font-medium">
                        <Flame size={11} />
                        Popular
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-mono text-text-sub">
                    {formatPrice(item.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab: Reviews (Card pattern) ───

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-primary-subtle flex items-center justify-center text-sm font-bold text-primary">
          {review.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text">{review.userName}</p>
          <p className="text-xs text-text-hint">{review.date}</p>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-sm text-text-sub leading-relaxed">{review.comment}</p>
    </div>
  );
}

function ReviewsCardPattern() {
  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </div>
  );
}

// ─── Tab: Reviews (Timeline pattern) ───

function ReviewTimelineItem({ review, isLast }: { review: Review; isLast: boolean }) {
  return (
    <div className="flex gap-4">
      {/* Timeline line + avatar */}
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-primary-subtle flex items-center justify-center text-sm font-bold text-primary shrink-0">
          {review.avatar}
        </div>
        {!isLast && <div className="w-px flex-1 bg-border mt-2" />}
      </div>
      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-text">{review.userName}</span>
          <StarRating rating={review.rating} />
        </div>
        <p className="text-xs text-text-hint mb-2">{review.date}</p>
        <p className="text-sm text-text-sub leading-relaxed">{review.comment}</p>
      </div>
    </div>
  );
}

function ReviewsTimelinePattern() {
  return (
    <div>
      {reviews.map((r, i) => (
        <ReviewTimelineItem key={r.id} review={r} isLast={i === reviews.length - 1} />
      ))}
    </div>
  );
}

// ─── No Reviews variant ───

function NoReviews() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-bg-surface flex items-center justify-center mb-3">
        <Star size={22} className="text-text-hint" />
      </div>
      <h3 className="text-base font-bold text-text mb-1">まだレビューがありません</h3>
      <p className="text-sm text-text-sub mb-4">このカフェの最初のレビューを書きましょう</p>
      <button className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-on-fill hover:bg-primary-hover transition-colors">
        レビューを書く
      </button>
    </div>
  );
}

// ─── Loading variant ───

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="aspect-[16/9] bg-bg-surface rounded-lg" />
      <div className="space-y-3">
        <div className="h-6 bg-bg-surface rounded w-2/3" />
        <div className="h-4 bg-bg-surface rounded w-1/3" />
        <div className="h-4 bg-bg-surface rounded w-full" />
        <div className="h-4 bg-bg-surface rounded w-5/6" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-bg-surface rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// ─── Main ───

function CafeDetailInner() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("_tab") ?? "menu";
  const variant = searchParams.get("_v");
  const pattern = searchParams.get("_p") ?? "card-review";

  if (variant === "loading") {
    return (
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-text-sub hover:text-text mb-4 transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
        <LoadingSkeleton />
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-text-sub hover:text-text mb-4 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      {/* Hero image */}
      <div className="aspect-[16/9] rounded-lg overflow-hidden mb-6">
        <img
          src={cafe.image}
          alt={cafe.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-2">{cafe.name}</h1>
        <div className="flex items-center gap-4 text-sm text-text-sub mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {cafe.area}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {cafe.hours}
          </span>
          <span className="font-medium">{cafe.priceRange}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary">{cafe.rating}</span>
          <span className="text-orange-400">{renderStars(cafe.rating)}</span>
          <span className="text-sm text-text-hint">({cafe.reviewCount} reviews)</span>
        </div>
        <p className="text-sm text-text-sub leading-relaxed">{cafe.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {cafe.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-bg-surface text-text-sub"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        <Link
          href="/cafe?_tab=menu"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "menu"
              ? "border-primary text-primary"
              : "border-transparent text-text-sub hover:text-text"
          }`}
        >
          Menu
        </Link>
        <Link
          href="/cafe?_tab=reviews"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            tab === "reviews"
              ? "border-primary text-primary"
              : "border-transparent text-text-sub hover:text-text"
          }`}
        >
          Reviews ({cafe.reviewCount})
        </Link>
      </div>

      {/* Tab Content */}
      {tab === "menu" ? (
        <MenuTab />
      ) : variant === "no-reviews" ? (
        <NoReviews />
      ) : pattern === "timeline-review" ? (
        <ReviewsTimelinePattern />
      ) : (
        <ReviewsCardPattern />
      )}
    </main>
  );
}

export default function CafeDetailPage() {
  return (
    <Suspense>
      <CafeDetailInner />
    </Suspense>
  );
}
