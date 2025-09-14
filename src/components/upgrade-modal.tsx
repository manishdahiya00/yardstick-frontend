import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/api/axios";
import toast from "react-hot-toast";

type Tenant = {
  slug: string;
  plan: "FREE" | "PRO";
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  onUpgradeSuccess?: () => void;
};

export default function UpgradePlanModal({
  isOpen,
  onClose,
  tenant,
  onUpgradeSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    console.log(tenant);
    if (!tenant) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `/auth/tenants/${tenant.slug}/upgrade`,
        {
          plan: "PRO",
        }
      );
      toast.success(res.data.message || "Upgraded to Pro successfully");

      onUpgradeSuccess?.();

      onClose();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to upgrade plan";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full max-w-full overflow-hidden">
        <DialogHeader>
          <DialogTitle>Upgrade Plan</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-4">
          <p>
            You are currently on <strong>Free Plan</strong>. Upgrade to Pro to
            create unlimited notes.
          </p>
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              type="button"
              className="cursor-pointer"
            >
              {loading ? "Upgrading..." : "Upgrade to Pro"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
