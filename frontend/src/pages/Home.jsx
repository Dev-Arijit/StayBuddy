import { Link } from "react-router-dom";
import { useState } from "react";

export default function Home({ properties }) {
  const [searchQuery, setSearchQuery] = useState("");

  const featuredProperties = properties.slice(0, 3);

  const stats = [
    { value: "10+", label: "years", sub: "IN BUSINESS" },
    { value: "2M+", label: "beds", sub: "BEDS" },
    { value: "1,000+", label: "colleges", sub: "COLLEGES" },
    { value: "400+", label: "cities", sub: "CITIES" },
  ];

  const steps = [
    {
      num: 1,
      title: "Search",
      desc: "Find the perfect room by searching by university, city, or property name. Use filters to narrow down your choice.",
      icon: "search",
    },
    {
      num: 2,
      title: "Book",
      desc: "Once you've found your home, click the book button. Our experts will guide you through the paperwork for free.",
      icon: "calendar_today",
    },
    {
      num: 3,
      title: "Move in",
      desc: "Receive your contract, pack your bags and head to your new home. Your student journey starts here.",
      icon: "home",
    },
  ];

  const features = [
    {
      icon: "headset_mic",
      title: "24/7 Support",
      desc: "Our multilingual experts are always available to help you throughout your booking journey.",
    },
    {
      icon: "verified",
      title: "Price Match Guarantee",
      desc: "Find the same room at a lower price elsewhere and we will match it. Guaranteed.",
    },
    {
      icon: "shield",
      title: "Verified Listings",
      desc: "Every property on our platform is personally verified by our team for safety and quality.",
    },
  ];

  return (
    <div className="min-h-screen">

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative overflow-hidden bg-background-base">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* Left: Content */}
            <div className="animate-slide-up">
              <span className="lp-badge mb-5">
                The Global Student Housing Marketplace
              </span>

              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mt-4 text-on-surface">
                Search, explore and{" "}
                <span className="text-primary">
                  book your room!
                </span>
              </h1>

              {/* Search Bar */}
              <div className="mt-8 flex items-center gap-2 max-w-xl">
                <div className="flex-1 relative">
                  <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-on-muted text-lg">search</span>
                  <input
                    type="text"
                    placeholder="Search by city, university or property"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="lp-input pl-10"
                    id="hero-search-input"
                  />
                </div>
                <Link
                  to={`/listings${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
                  className="btn-primary whitespace-nowrap flex items-center gap-1.5 text-sm"
                  id="hero-search-btn"
                >
                  Search
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-5 mt-6 text-sm text-on-surface-variant">
                {[
                  { icon: "verified", text: "Verified listings" },
                  { icon: "support_agent", text: "24/7 expert support" },
                  { icon: "price_check", text: "Online price guarantee" },
                ].map((badge) => (
                  <span key={badge.text} className="flex items-center gap-1.5">
                    <span className="material-icons-round text-base text-primary">
                      {badge.icon}
                    </span>
                    {badge.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Hero Illustration */}
            <div className="relative animate-fade-in hidden md:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "4/3" }}>
                <img
                  src="/hero-room.png"
                  alt="Cozy student room"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=450&fit=crop";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="border-t border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.sub} className="anim-count">
                <p className="text-3xl md:text-4xl font-extrabold text-on-surface">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold uppercase tracking-widest mt-1 text-on-surface-variant">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ REGIONAL SPOTLIGHT ═══════════ */}
      <section className="px-6 lg:px-8 py-14 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-on-surface-variant">
              Regional Spotlight
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface">
              Find Your Perfect College Home
            </h2>
          </div>
          <Link
            to="/listings"
            className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all text-primary"
            id="view-all-properties-link"
          >
            View all properties
            <span className="material-icons-round text-base">arrow_forward</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredProperties.length > 0
            ? featuredProperties.map((property) => (
                <Link
                  to={`/property/${property._id}`}
                  key={property._id}
                  className="lp-card group"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Price Badge */}
                    <span className="absolute bottom-3 left-3 text-xs font-bold px-3 py-1.5 rounded-lg bg-primary text-on-primary">
                      From ₹{property.price?.toLocaleString()}/mo
                    </span>
                    {/* Top badge */}
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-primary/90 text-white">
                      Top rated
                    </span>
                  </div>
                  {/* Details */}
                  <div className="p-4">
                    <h3 className="font-bold tracking-tight text-base text-on-surface">
                      {property.title}
                    </h3>
                    <p className="text-xs mt-1 flex items-center gap-1 text-on-surface-variant">
                      <span className="material-icons-round text-xs">location_on</span>
                      {property.location}
                    </p>
                    {/* Amenity Tags */}
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {property.amenities.slice(0, 4).map((a, i) => (
                          <span key={i} className="amenity-tag">{a}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))
            : /* Skeleton placeholders */
              [1, 2, 3].map((i) => (
                <div key={i} className="lp-card">
                  <div className="h-52 animate-pulse bg-surface-bright" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 rounded animate-pulse w-3/4 bg-outline-variant" />
                    <div className="h-4 rounded animate-pulse w-1/2 bg-outline-variant" />
                    <div className="flex gap-2 mt-2">
                      <div className="h-5 w-14 rounded animate-pulse bg-outline-variant" />
                      <div className="h-5 w-14 rounded animate-pulse bg-outline-variant" />
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
      </section>

      {/* ═══════════ BOOKING STEPS ═══════════ */}
      <section className="bg-surface-bright border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface">
            Booking your room is as easy as 1-2-3
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm text-on-surface-variant">
            Experience a seamless journey from finding your ideal home to moving in with our streamlined booking process.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center">
                <div className="step-circle">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold mt-2 text-on-surface">
                  {step.title}
                </h3>
                <p className="text-sm mt-2 max-w-xs text-on-surface-variant">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY STUDENTS CHOOSE US ═══════════ */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left: Features */}
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
                Why students choose
              </h2>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-10">
                StayBuddy
              </h2>

              <div className="space-y-6">
                {features.map((f) => (
                  <div key={f.title} className="flex items-start gap-4">
                    <div className="feature-icon">
                      <span className="material-icons-round text-white text-lg">{f.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{f.title}</h3>
                      <p className="text-sm mt-1 text-white/75">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Image + Trust Badge */}
            <div className="relative hidden md:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/support-agent.png"
                  alt="Our support team"
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop";
                  }}
                />
              </div>
              {/* Trustpilot-style badge */}
              <div className="absolute -bottom-4 -right-4 rounded-xl p-4 shadow-xl bg-white">
                <p className="text-3xl font-extrabold text-[#00B67A]">4.8/5</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5 text-on-surface-variant">
                  Trustpilot Score
                </p>
                <div className="flex gap-0.5 mt-1">
                  {[1,2,3,4,5].map((i) => (
                    <span key={i} className="material-icons-round text-sm" style={{ color: i <= 4 ? "#00B67A" : "#D1D5DB" }}>star</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <section className="bg-surface-bright border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 bg-white border border-outline-variant">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface">
                Own a property near campus?
              </h2>
              <p className="mt-3 max-w-md text-sm text-on-surface-variant">
                List your space on StayBuddy and reach thousands of verified students. We handle the details, you handle the keys.
              </p>
              <div className="flex gap-3 mt-6">
                <Link to="/register" className="btn-primary text-sm" id="cta-start-listing">
                  Start Listing
                </Link>
                <Link to="/listings" className="btn-secondary text-sm" id="cta-how-it-works">
                  How It Works
                </Link>
              </div>
            </div>
            <div className="shrink-0 hidden md:block">
              <div className="w-48 h-60 rounded-2xl flex items-center justify-center relative overflow-hidden bg-primary-light border-2 border-dashed border-primary">
                <div className="text-center">
                  <span className="material-icons-round text-4xl text-primary">apartment</span>
                  <p className="text-xs font-medium mt-2 text-primary">
                    Your listing<br/>goes here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}