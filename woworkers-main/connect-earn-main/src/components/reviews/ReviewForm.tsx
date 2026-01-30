import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  contractAmount: number;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ReviewForm = ({ contractAmount, onSubmit, onCancel, isSubmitting }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("অনুগ্রহ করে একটি রেটিং নির্বাচন করুন");
      return;
    }
    if (comment.length < 10) {
      setError("মন্তব্য কমপক্ষে ১০ অক্ষরের হতে হবে");
      return;
    }
    if (comment.length > 1000) {
      setError("মন্তব্য ১০০০ অক্ষরের বেশি হতে পারবে না");
      return;
    }
    setError("");
    await onSubmit(rating, comment);
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">চুক্তির পরিমাণ</p>
        <p className="text-2xl font-bold text-primary">৳{contractAmount.toLocaleString()}</p>
      </div>

      <div className="space-y-2">
        <Label>রেটিং দিন *</Label>
        <div className="flex gap-1 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors",
                  (hoverRating || rating) >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {rating === 1 && "খুব খারাপ"}
            {rating === 2 && "খারাপ"}
            {rating === 3 && "ঠিক আছে"}
            {rating === 4 && "ভালো"}
            {rating === 5 && "অসাধারণ"}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">আপনার মন্তব্য *</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="ফ্রিল্যান্সার সম্পর্কে আপনার অভিজ্ঞতা শেয়ার করুন..."
          rows={4}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground text-right">
          {comment.length}/১০০০ অক্ষর
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          বাতিল
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "জমা হচ্ছে..." : "রিভিউ জমা দিন ও সম্পূর্ণ করুন"}
        </Button>
      </div>
    </div>
  );
};
