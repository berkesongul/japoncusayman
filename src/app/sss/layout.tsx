import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sıkça Sorulan Sorular (S.S.S.) | Japoncu Sayman",
    description:
        "Japoncu Sayman hakkında sıkça sorulan sorular. Sipariş, kargo, garanti, iade ve daha fazlası.",
};

export default function SSSLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
