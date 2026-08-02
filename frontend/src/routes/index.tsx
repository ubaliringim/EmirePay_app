import {
  Smartphone,
  Wifi,
  Zap,
  Tv,
  Wallet,
  Repeat,
  GraduationCap,
  Code2,
  Users,
  School,
  ShieldCheck,
  Gauge,
  BadgeDollarSign,
  Clock,
  HeartHandshake,
  MousePointerClick,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Building2,
  Briefcase,
  UserRound,
  Store,
  Terminal,
  BookOpen,
} from "lucide-react";
import heroImage from "@/assets/hero-emirpay.png";
import ceoImg from "@/assets/ceo.jpg";
import cooImg from "@/assets/coo.jpg";
import mmImg from "@/assets/mm.jpeg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ActionButton, ActionLink, Field } from "@/components/ui-kit";

const services = [
  {
    icon: Smartphone,
    title: "Airtime Recharge",
    desc: "Instant top-ups on MTN, Airtel, Glo and 9mobile at discounted rates.",
  },
  {
    icon: Wifi,
    title: "Mobile Data Purchase",
    desc: "Affordable data bundles for every network, delivered in seconds.",
  },
  {
    icon: Zap,
    title: "Electricity Bill Payment",
    desc: "Pay prepaid and postpaid bills with tokens issued immediately.",
  },
  {
    icon: Tv,
    title: "Cable TV Subscription",
    desc: "Renew DStv, GOtv and StarTimes without leaving your home.",
  },
  {
    icon: Wallet,
    title: "Wallet Funding",
    desc: "Fund your Emir Pay wallet by transfer or card and spend instantly.",
  },
  {
    icon: Repeat,
    title: "Airtime-to-Cash",
    desc: "Convert excess airtime into cash at competitive conversion rates.",
  },
  {
    icon: GraduationCap,
    title: "Educational PINs",
    desc: "WAEC, NECO, JAMB and NABTEB result and registration PINs.",
  },
  {
    icon: Code2,
    title: "API Services",
    desc: "Plug our payment endpoints into your product with clean docs.",
  },
  {
    icon: Users,
    title: "Agent & Reseller Solutions",
    desc: "Dedicated pricing tiers and tooling for resellers at scale.",
  },
  {
    icon: School,
    title: "School Registration",
    desc: "Guided registration support for schools and their candidates.",
  },
];

const reasons = [
  {
    icon: Gauge,
    title: "Fast and secure",
    desc: "Transactions settle in seconds on encrypted, monitored infrastructure.",
  },
  {
    icon: BadgeDollarSign,
    title: "Affordable prices",
    desc: "Consistent discounts across every network and biller we support.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable service",
    desc: "Redundant provider routing keeps delivery rates high, always.",
  },
  {
    icon: MousePointerClick,
    title: "Easy to use",
    desc: "A clean interface anyone can complete a payment on, first try.",
  },
  {
    icon: Clock,
    title: "24/7 availability",
    desc: "Pay bills and top up at any hour, weekends and holidays included.",
  },
  {
    icon: HeartHandshake,
    title: "Excellent support",
    desc: "Real humans on call to resolve any transaction issue quickly.",
  },
];

const audiences = [
  { icon: UserRound, label: "Individuals" },
  { icon: BookOpen, label: "Students" },
  { icon: Store, label: "Small Businesses" },
  { icon: Building2, label: "Corporate Organizations" },
  { icon: Briefcase, label: "Agents" },
  { icon: Users, label: "Resellers" },
  { icon: Terminal, label: "Developers (API)" },
];

const leadership = [
  {
    name: "Nasiru Lawal",
    title: "Software Engineer",
    rank: "CEO / MD",
    image: ceoImg,
    initials: "NL",
  },
  {
    name: "Salma Nasir",
    title: "Engineer",
    rank: "Chief Operating Officer",
    image: cooImg,
    initials: "SN",
  },
  {
    name: "Muhammad Abdullahi Ahmad",
    title: "Engineer",
    rank: "Marketing Manager",
    image: mmImg,
    initials: "MA",
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader />
      <main>
        <section className="bg-canvas-soft pt-24 pb-10 lg:pt-28 lg:pb-16">
          <div className="section-shell grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h1 className="display-mega mt-4 text-4xl text-ink sm:text-5xl lg:text-6xl">
                One platform for airtime, data, bills and payments.
              </h1>
              <p className="mt-4 max-w-xl text-base text-body">
                Emir Pay brings every everyday payment into a single secure wallet — top up any
                network, settle electricity and cable bills, buy education PINs and power your
                business with our APIs. Fast, secure, affordable.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ActionLink to="/signup" variant="primary" size="lg">
                  Create Account <ArrowRight className="h-4 w-4" />
                </ActionLink>
                <ActionLink to="/login" variant="outline" size="lg">
                  Log In
                </ActionLink>
              </div>
              <dl className="mt-8 grid max-w-lg grid-cols-3 gap-6 border-t border-ink/10 pt-6">
                {[
                  ["99.9%", "Delivery rate"],
                  ["< 5s", "Average settlement"],
                  ["24/7", "Service uptime"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="font-display text-2xl font-black text-ink">{v}</dt>
                    <dd className="mt-1 text-sm text-body">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative flex justify-end">
              <div className="relative overflow-hidden rounded-full border-[6px] border-primary/30 shadow-lift sm:scale-x-[1.08]">
                <img
                  src={heroImage}
                  alt="Emir Pay customer completing a payment on her phone"
                  width={1024}
                  height={1280}
                  className="h-[320px] w-[320px] object-cover object-top sm:h-[400px] sm:w-[400px]"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-20 lg:py-28">
          <div className="section-shell">
            <div className="max-w-2xl">
              <p className="text-sm font-bold tracking-widest text-secondary uppercase">Services</p>
              <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                Everything you pay for, in one place
              </h2>
              <p className="mt-4 text-lg text-body">
                Ten core services built for individuals, agents and businesses — each one instant,
                traceable and priced fairly.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(({ icon: Icon, title, desc }, i) => (
                <article
                  key={title}
                  className={`group rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lift ${
                    i === 0 ? "bg-ink text-primary" : "bg-canvas-soft"
                  }`}
                >
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-lg ${
                      i === 0 ? "bg-primary text-ink" : "bg-canvas text-secondary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3
                    className={`mt-5 text-xl font-black ${i === 0 ? "text-primary" : "text-ink"}`}
                  >
                    {title}
                  </h3>
                  <p className={`mt-2 text-sm ${i === 0 ? "text-primary/80" : "text-body"}`}>
                    {desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-canvas-soft py-20 lg:py-28">
          <div className="section-shell">
            <div className="max-w-2xl">
              <p className="text-sm font-bold tracking-widest text-secondary uppercase">
                Why Emir Pay
              </p>
              <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                Built to be trusted with your money
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reasons.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="surface-card flex gap-4 p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary text-ink">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-black">{title}</h3>
                    <p className="mt-1.5 text-sm text-body">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-20 lg:py-28">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold tracking-widest text-secondary uppercase">About</p>
              <h2 className="mt-3 text-4xl font-black sm:text-5xl">About Emir Pay</h2>
              <p className="mt-5 text-lg text-body">
                Emir Pay is a digital payment and fintech company offering fast, secure and
                affordable services — airtime, data, bill payments, transfers and wallet funding —
                for individuals, businesses, agents and resellers.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl bg-canvas-soft p-6">
                <h3 className="text-xl font-black">Our Vision</h3>
                <p className="mt-2 text-sm text-body">
                  To become one of Africa's most trusted digital payment platforms by providing
                  innovative, secure and reliable financial solutions.
                </p>
              </div>
              <div className="rounded-xl bg-primary-pale p-6">
                <h3 className="text-xl font-black">Our Mission</h3>
                <p className="mt-2 text-sm text-body">
                  To simplify digital payments by providing fast, secure, affordable and easy-to-use
                  financial services that improve everyday life.
                </p>
              </div>
              <div className="rounded-xl bg-ink p-6 sm:col-span-2">
                <h3 className="text-xl font-black text-primary">Our Goal</h3>
                <p className="mt-2 text-sm text-primary/80">
                  To build a trusted platform where customers manage all everyday payment and
                  digital service needs in one place, with plans to expand services over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20 lg:pb-28">
          <div className="section-shell">
            <h2 className="text-4xl font-black sm:text-5xl">Who we serve</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {audiences.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-border p-5 transition-colors hover:border-secondary hover:bg-primary-pale"
                >
                  <Icon className="h-5 w-5 text-secondary" />
                  <span className="font-semibold text-ink">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="leadership" className="bg-ink py-20 lg:py-28">
          <div className="section-shell">
            <div className="max-w-2xl">
              <p className="text-sm font-bold tracking-widest text-primary uppercase">Leadership</p>
              <h2 className="mt-3 text-4xl font-black text-canvas-soft sm:text-5xl">
                Meet our leadership
              </h2>
              <p className="mt-4 text-lg text-canvas-soft/70">
                The team accountable for security, reliability and every naira that moves through
                Emir Pay.
              </p>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {leadership.map((p, i) => (
                <article
                  key={i}
                  className="group relative overflow-hidden rounded-3xl bg-canvas-soft transition-transform duration-300 hover:-translate-y-2"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <span className="grid h-28 w-28 place-items-center rounded-full bg-primary/20 font-display text-5xl font-black text-ink">
                          {p.initials}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-bold tracking-wide text-ink uppercase">
                      {p.rank}
                    </span>
                    <h3 className="mt-3 text-2xl font-black text-canvas-soft">{p.name}</h3>
                    <p className="mt-1 text-sm font-medium text-canvas-soft/60">{p.title}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 lg:py-28">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold tracking-widest text-secondary uppercase">Contact</p>
              <h2 className="mt-3 text-4xl font-black sm:text-5xl">Talk to Emir Pay</h2>
              <p className="mt-4 text-lg text-body">
                Questions about pricing, agent onboarding or our API? Reach us any day of the week.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-secondary" />
                  <div>
                    <p className="text-sm font-semibold text-ink">Email</p>
                    <a
                      href="mailto:emirpaymentsolutions@gmail.com"
                      className="text-sm text-body hover:text-secondary"
                    >
                      emirpaymentsolutions@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-secondary" />
                  <div>
                    <p className="text-sm font-semibold text-ink">Phone</p>
                    <a href="tel:09060659999" className="text-sm text-body hover:text-secondary">
                      09060659999
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-secondary" />
                  <div>
                    <p className="text-sm font-semibold text-ink">Address</p>
                    <p className="text-sm text-body">
                      Hauran Wanki Sharada Masallaci street, Kano State, Nigeria
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <form
              className="surface-card space-y-5 p-6 sm:p-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <Field id="contact-name" label="Name" placeholder="Your full name" />
              <Field id="contact-email" label="Email" type="email" placeholder="you@example.com" />
              <div className="space-y-2">
                <label htmlFor="contact-message" className="block text-sm font-semibold text-ink">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="How can we help?"
                  className="field-input resize-none"
                />
              </div>
              <ActionButton type="submit" variant="primary" size="block">
                Send message
              </ActionButton>
            </form>
          </div>
        </section>

        <section className="pb-12 lg:pb-16">
          <div className="section-shell">
            <div className="rounded-2xl bg-ink px-6 py-8 text-center sm:px-8 lg:py-12">
              <div className="mx-auto max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-canvas-soft/10 px-3 py-1 text-xs font-semibold tracking-widest text-primary uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" /> Free to join
                </span>
                <h2 className="display-mega mt-4 text-2xl text-canvas-soft sm:text-3xl lg:text-4xl">
                  Start paying the <span className="text-primary">easy way</span>.
                </h2>
                <p className="mt-3 text-sm text-canvas-soft/70">
                  Create your Emir Pay account in under a minute and get instant access to airtime,
                  data, bills, wallet funding and business APIs.
                </p>
                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                  <ActionLink to="/signup" variant="primary" size="lg">
                    Create Account <ArrowRight className="h-4 w-4" />
                  </ActionLink>
                  <ActionLink
                    to="/login"
                    variant="ghost"
                    size="lg"
                    className="border border-canvas-soft/25 text-canvas-soft hover:bg-canvas-soft/10"
                  >
                    Log In
                  </ActionLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
