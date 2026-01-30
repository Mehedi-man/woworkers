import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, RotateCcw, Clock } from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

interface DeliveryViewProps {
  deliveryText: string;
  deliveredAt: string;
  deliveryStatus: string;
  isClient: boolean;
  onAccept?: () => void;
  onRequestRevision?: () => void;
  isProcessing?: boolean;
}

export const DeliveryView = ({
  deliveryText,
  deliveredAt,
  deliveryStatus,
  isClient,
  onAccept,
  onRequestRevision,
  isProcessing = false
}: DeliveryViewProps) => {
  const getStatusBadge = () => {
    switch (deliveryStatus) {
      case "delivered":
        return (
          <Badge variant="outline" className="bg-info/10 text-info border-info/30">
            <Clock className="w-3 h-3 mr-1" />
            পর্যালোচনার অপেক্ষায়
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            গৃহীত
          </Badge>
        );
      case "revision_requested":
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
            <RotateCcw className="w-3 h-3 mr-1" />
            সংশোধন প্রয়োজন
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">ডেলিভারি</h4>
        {getStatusBadge()}
      </div>
      
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm whitespace-pre-wrap">{deliveryText}</p>
        <p className="text-xs text-muted-foreground mt-3">
          জমা দেওয়া হয়েছে: {format(new Date(deliveredAt), "d MMM yyyy, h:mm a", { locale: bn })}
        </p>
      </div>

      {isClient && deliveryStatus === "delivered" && (
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            onClick={onRequestRevision}
            disabled={isProcessing}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            সংশোধন চাই
          </Button>
          <Button 
            onClick={onAccept}
            disabled={isProcessing}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            গ্রহণ করুন ও রিভিউ দিন
          </Button>
        </div>
      )}
    </div>
  );
};
