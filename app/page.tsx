import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-primary">LynxBase 予約フォーム</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              HP
            </a>
            <a href="https://price.lynxbaseworks.com/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              料金表
            </a>
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
              ログイン
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center pt-24 pb-8 text-center px-4 bg-gradient-to-b from-accent/30 to-background">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl text-foreground mb-10 drop-shadow-sm">
          LynxBase<br />
          <span className="text-primary">ベビーシッター予約</span>
        </h1>

        <div className="relative w-full max-w-lg aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl mx-auto mb-8">
          <Image
            src="/hero-image.png"
            alt="優しく握り合う赤ちゃんとシッターの手"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-2xl mx-auto px-6">
        <div className="border-t border-border/40"></div>
      </div>

      {/* Calendar Placeholder */}
      <section className="container mx-auto pt-8 pb-20 px-4">
        <div className="flex flex-col items-center">
          <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-2">Schedule</span>
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">空き状況・予約</h2>

          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <iframe
              src="https://app.acuityscheduling.com/schedule.php?owner=38006412&ref=embedded_csp"
              title="Schedule Appointment"
              width="100%"
              height="800"
              className="border-0"
            />
            <Script src="https://embed.acuityscheduling.com/js/embed.js" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-12 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 Sitter Reserve. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
