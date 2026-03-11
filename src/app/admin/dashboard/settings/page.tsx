"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        address: "",
        phone: "",
        email: "",
        workingHours: "",
        whatsapp: "",
        googleMapsUrl: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    setSettings({
                        address: data.address || "",
                        phone: data.phone || "",
                        email: data.email || "",
                        workingHours: data.workingHours || "",
                        whatsapp: data.whatsapp || "",
                        googleMapsUrl: data.googleMapsUrl || "",
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                alert("Ayarlar başarıyla güncellendi.");
            } else {
                throw new Error("Failed to update");
            }
        } catch (error) {
            alert("Ayarlar güncellenirken bir hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Site Ayarları</h1>
                    <p className="text-muted-foreground mt-1">İletişim bilgilerini ve genel site ayarlarını buradan yönetebilirsiniz.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6 bg-card p-6 rounded-xl border">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Phone className="h-5 w-5 text-blue-500" />
                        İletişim Bilgileri
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon Numarası</Label>
                            <Input
                                id="phone"
                                value={settings.phone}
                                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                placeholder="+90 5XX XXX XX XX"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp Numarası</Label>
                            <Input
                                id="whatsapp"
                                value={settings.whatsapp}
                                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                placeholder="905XXXXXXXXX (Ülke kodu ile, boşluksuz)"
                            />
                            <p className="text-xs text-muted-foreground">Boşluk bırakmadan ülke kodu ile birlikte yazın (Örn: 905321234567)</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta Adresi</Label>
                            <Input
                                id="email"
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                placeholder="info@japoncusayman.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6 bg-card p-6 rounded-xl border">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        Konum ve Saatler
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Adres</Label>
                            <Textarea
                                id="address"
                                value={settings.address}
                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                placeholder="Adres detayları..."
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="workingHours">Çalışma Saatleri</Label>
                            <Input
                                id="workingHours"
                                value={settings.workingHours}
                                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                                placeholder="Pzt – Cmt: 08:00 – 19:00"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="googleMapsUrl">Google Haritalar Embed URL</Label>
                            <Textarea
                                id="googleMapsUrl"
                                value={settings.googleMapsUrl}
                                onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                                placeholder="https://www.google.com/maps/embed?..."
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground">Iframe içindeki src kısmını yapıştırın.</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" size="lg" disabled={saving} className="min-w-[150px]">
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Kaydediliyor...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Değişiklikleri Kaydet
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
