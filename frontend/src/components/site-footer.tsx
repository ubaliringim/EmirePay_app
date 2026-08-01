import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Wordmark } from "@/components/wordmark";

const socials = [Facebook, Instagram, Twitter, Linkedin];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-canvas-soft">
      <div className="section-shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Wordmark tone="light" />
          <p className="max-w-sm text-sm text-canvas-soft/70">
            Fast, secure and affordable digital payments for individuals, businesses, agents and
            developers across Nigeria.
          </p>
          <div className="flex gap-3 pt-2">
            {socials.map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Emir Pay social profile"
                className="grid h-10 w-10 place-items-center rounded-full bg-canvas-soft/10 text-canvas-soft transition-colors hover:bg-primary hover:text-ink"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide text-canvas-soft uppercase">
            Quick links
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-canvas-soft/70">
            {[
              ["Services", "#services"],
              ["About", "#about"],
              ["Leadership", "#leadership"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="transition-colors hover:text-primary">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide text-canvas-soft uppercase">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-canvas-soft/70">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href="mailto:emirpay@gmail.com" className="hover:text-primary">
                emirpay@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href="tel:09060659999" className="hover:text-primary">
                0906 065 9999
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Hauran Wanki Sharada Masallaci street, Kano State, Nigeria</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-canvas-soft/10">
        <div className="section-shell flex flex-col gap-2 py-6 text-xs text-canvas-soft/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Emir Pay. All rights reserved.</p>
          <p>emirpay@gmail.com · 0906 065 9999 · Kano State, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
