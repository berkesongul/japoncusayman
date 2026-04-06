"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
    productName: string;
    oemCode: string;
    phoneNumber?: string; // Optional: Provide a number or it will fetch from settings
    className?: string;
    fullWidth?: boolean;
}

// Client-side cache to avoid redundant fetches for multiple cards on same page
let cachedWhatsAppNumber: string | null = null;

export function WhatsAppButton({
    productName,
    oemCode,
    phoneNumber: propPhoneNumber,
    className = "",
    fullWidth = false,
}: WhatsAppButtonProps) {
    const defaultFallback = "905427401745"; // Keep as temporary fallback
    const [whatsappNumber, setWhatsappNumber] = useState(propPhoneNumber || cachedWhatsAppNumber || defaultFallback);

    useEffect(() => {
        // If we have a prop, update state (and clean it)
        if (propPhoneNumber) {
            setWhatsappNumber(propPhoneNumber.replace(/\+/g, "").replace(/\s+/g, ""));
            return;
        }

        // If we don't have a prop and haven't cached the number yet birden fazla butonda fetch atmamak için
        if (!cachedWhatsAppNumber) {
            const fetchSettings = async () => {
                try {
                    const res = await fetch("/api/admin/settings");
                    if (res.ok) {
                        const data = await res.json();
                        // Use whatsapp number if set, otherwise fallback to primary phone, otherwise default
                        const rawNumber = data?.whatsapp || data?.phone || defaultFallback;
                        const cleanedNumber = rawNumber.replace(/\+/g, "").replace(/\s+/g, "");
                        cachedWhatsAppNumber = cleanedNumber;
                        setWhatsappNumber(cleanedNumber);
                    }
                } catch (error) {
                    console.error("Error fetching WhatsApp setting:", error);
                }
            };
            fetchSettings();
        } else if (!propPhoneNumber) {
            // Use cached number if available
            setWhatsappNumber(cachedWhatsAppNumber);
        }
    }, [propPhoneNumber]);

    const message = `Merhaba, Japoncu Sayman'dan ${productName} (Kod: ${oemCode}) ile ilgileniyorum. Stok durumu nedir?`;

    const handleWhatsAppClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <Button
            onClick={handleWhatsAppClick}
            className={`bg-green-600 hover:bg-green-700 text-white shadow-md gap-2 ${fullWidth ? "w-full" : ""} ${className}`}
        >
            <MessageCircle className="h-4 w-4" />
            Whatsapp ile Sor
        </Button>
    );
}
