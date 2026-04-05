"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`"${productName}" ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Ürün silinirken bir hata oluştu.");
            }
        } catch (error) {
            alert("Ürün silinirken bir hata oluştu.");
        }
    };

    return (
        <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 cursor-pointer"
            onClick={handleDelete}
        >
            <Trash2 className="mr-2 h-4 w-4" /> Sil
        </DropdownMenuItem>
    );
}
