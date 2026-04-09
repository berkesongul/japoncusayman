"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TrashActionsProps {
    productId: string;
    productName: string;
}

export function TrashActions({ productId, productName }: TrashActionsProps) {
    const router = useRouter();
    const [isRestoring, setIsRestoring] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleRestore = async () => {
        setIsRestoring(true);
        try {
            const res = await fetch(`/api/admin/products/${productId}/restore`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Geri yükleme başarısız");
            
            toast.success(`${productName} geri yüklendi`);
            router.refresh();
        } catch (error) {
            toast.error("Bir hata oluştu");
        } finally {
            setIsRestoring(false);
        }
    };

    const handlePermanentDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/products/${productId}/permanent`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Kalıcı silme başarısız");
            
            toast.success(`${productName} ve görseli kalıcı olarak silindi`);
            router.refresh();
        } catch (error) {
            toast.error("Bir hata oluştu");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={handleRestore}
                disabled={isRestoring || isDeleting}
                className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
            >
                {isRestoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-1" />}
                Geri Yükle
            </Button>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isRestoring || isDeleting}
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />}
                        Kalıcı Sil
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kalıcı olarak silmek istediğinize emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu işlem geri alınamaz. <strong>{productName}</strong> veritabanından ve sunucudaki görsel dosyasından tamamen silinecektir.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePermanentDelete} className="bg-red-600 hover:bg-red-700">
                            Evet, Kalıcı Olarak Sil
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
