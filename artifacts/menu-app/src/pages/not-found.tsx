import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <AlertCircle className="h-16 w-16 text-primary mb-4" />
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">{t("pageNotFound")}</p>
      <Link href="/" className="mt-6 inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
        {t("goHome")}
      </Link>
    </div>
  );
}
