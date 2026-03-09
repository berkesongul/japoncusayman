"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
    productName: string;
    oemCode: string;
    phoneNumber?: string; // Optional: Provide a default number or pass it as prop
    className?: string;
    fullWidth?: boolean;
}

export function WhatsAppButton({
    productName,
    oemCode,
    phoneNumber = "+905555555555", // TODO: Replace with actual company WhatsApp number
    className = "",
    fullWidth = false,
}: WhatsAppButtonProps) {
    const message = `Merhaba, Japoncu Sayman'dan ${productName} (Kod: ${oemCode}) ile ilgileniyorum. Stok durumu nedir?`;

    const handleWhatsAppClick = () => {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <Button
            onClick={handleWhatsAppClick}
            className={`bg-green-600 hover:bg-green-700 text-white shadow-md gap-2 ${fullWidth ? "w-full" : ""} ${className}`}
        >
            <MessageCircle className="h-4 w-4" />
            WhatsApp'tan Sor
        </Button>
    );
}
