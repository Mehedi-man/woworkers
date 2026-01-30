import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

interface DeliveryFormProps {
  onSubmit: (deliveryText: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const DeliveryForm = ({ onSubmit, onCancel, isSubmitting }: DeliveryFormProps) => {
  const [deliveryText, setDeliveryText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (deliveryText.length < 20) {
      setError("ডেলিভারি বিবরণ কমপক্ষে ২০ অক্ষরের হতে হবে");
      return;
    }
    if (deliveryText.length > 5000) {
      setError("ডেলিভারি বিবরণ ৫০০০ অক্ষরের বেশি হতে পারবে না");
      return;
    }
    setError("");
    await onSubmit(deliveryText);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="delivery">ডেলিভারি বিবরণ *</Label>
        <Textarea
          id="delivery"
          value={deliveryText}
          onChange={(e) => setDeliveryText(e.target.value)}
          placeholder="আপনার কাজের বিবরণ দিন। কি কি সম্পন্ন করেছেন, কিভাবে ক্লায়েন্ট এটি ব্যবহার করতে পারবে, ইত্যাদি..."
          rows={6}
          maxLength={5000}
        />
        <p className="text-xs text-muted-foreground text-right">
          {deliveryText.length}/৫০০০ অক্ষর
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
          {isSubmitting ? (
            "জমা হচ্ছে..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              ডেলিভারি জমা দিন
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
