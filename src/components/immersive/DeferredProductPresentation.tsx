"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProductPresentationData = {
  name: string;
  description: string;
  audience: string;
  steps: string[];
  features: string[];
  href?: string;
};

type ProductDialogComponent = React.ComponentType<{
  product: ProductPresentationData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

export function DeferredProductPresentation({ product }: { product: ProductPresentationData }) {
  const [DialogComponent, setDialogComponent] = useState<ProductDialogComponent | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    if (DialogComponent) {
      setOpen(true);
      return;
    }

    setLoading(true);
    try {
      const mod = await import("./ProductPresentationDialog");
      setDialogComponent(() => mod.ProductPresentationDialog);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        aria-label={`Ver apresentação: ${product.name}`}
        onClick={handleOpen}
        disabled={loading}
        className="h-11 w-full rounded-full border-cyan-300/25 bg-cyan-300/5 px-5 font-bold text-cyan-200 hover:bg-cyan-300/10 hover:text-white"
      >
        {loading ? "Carregando..." : "Ver apresentação"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      {DialogComponent ? (
        <DialogComponent product={product} open={open} onOpenChange={setOpen} />
      ) : null}
    </>
  );
}
