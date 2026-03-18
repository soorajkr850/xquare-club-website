import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle2, TrendingUp, Users, Target, ShieldCheck, Menu, X } from "lucide-react";
import { Button } from "@/components/Button";
import { SellerModal } from "@/components/SellerModal";
import { Section } from "@/components/Section";

export default function Landing() {
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToDisclaimer = () => {
    document.getElementById("disclaimer")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToRegister = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  const ActionButtons = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <Button variant="primary" size="lg" onClick={() => window.location.href = "/influencer-onboarding"}>
        Join as an Influencer
      </Button>
      <Button variant="outline" size="lg" onClick={() => window.location.href = "/list-your-business"}>
        List Your Business
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={`${import.meta.env.BASE_URL}images/xquare-logo.png`} 
              alt="XQUARE CLUB Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
          {/* Desktop menu */}
          <div className="hidden md:flex gap-4">
            <Button variant="ghost" size="sm" onClick={() => document.getElementById("about")?.scrollIntoView()}>About</Button>
            <Button variant="ghost" size="sm" onClick={() => document.getElementById("how-it-works")?.scrollIntoView()}>How it Works</Button>
            <Button variant="ghost" size="sm" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Contact Us</Button>
            <Button variant="primary" size="sm" onClick={scrollToRegister}>Join Now</Button>
          </div>
          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-white/10 px-6 py-4 flex flex-col gap-1">
            <button
              className="text-white/70 hover:text-white text-left py-3 text-sm font-medium border-b border-white/5"
              onClick={() => { document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }}
            >About</button>
            <button
              className="text-white/70 hover:text-white text-left py-3 text-sm font-medium border-b border-white/5"
              onClick={() => { document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }}
            >How it Works</button>
            <button
              className="text-white/70 hover:text-white text-left py-3 text-sm font-medium border-b border-white/5"
              onClick={() => { document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }}
            >Contact Us</button>
            <button
              className="mt-2 w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-blue-400 transition-all"
              onClick={() => { scrollToRegister(); setMobileMenuOpen(false); }}
            >Join Now</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Abstract Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black"></div>
          {/* Subtle radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-12 pb-24">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8">
                Collaboration should not be expensive.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">
                  Opportunity should not be exclusive.
                </span>
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/80 mb-6 font-light"
            >
              XQUARE CLUB is a community-driven platform where small businesses and growing influencers can connect, collaborate, and grow together.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-white/60 mb-12 max-w-2xl"
            >
              Built to make promotions more accessible and opportunities more open.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ActionButtons />
              <p className="mt-6 text-sm text-white/50 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                <span>{"Applications to Early Access are "}<span onClick={scrollToDisclaimer} className="underline decoration-white/50 hover:decoration-white transition-colors cursor-pointer">{"free*"}</span>{". Influencers and sellers can apply now."}</span>
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Intro Section */}
      <Section id="about">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl mb-8">What is XQUARE CLUB?</h2>
            <div className="space-y-6 text-lg">
              <p>
                XQUARE CLUB is a platform built to bring businesses, influencers, and customers into one connected ecosystem.
              </p>
              <p>
                It enables businesses to showcase their products, gives influencers the opportunity to promote products in a more accessible way, and helps customers discover products through people and content they relate to.
              </p>
              <p className="font-semibold text-white/90 border-l-2 border-primary pl-4 py-1">
                More than just a platform, XQUARE CLUB is an initiative built around community, shared growth, and multiplied opportunity.
              </p>
            </div>
            <ActionButtons className="mt-10" />
          </div>
          <div className="relative">
            <div className="aspect-square rounded-full bg-gradient-to-tr from-navy to-black border border-white/5 shadow-2xl flex items-center justify-center p-12 relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LD,I1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50 rounded-full mix-blend-screen"></div>
              <div className="text-center z-10">
                <h3 className="text-3xl font-display font-bold text-white mb-4">Why the name?</h3>
                <p className="text-base text-white/70 mb-4"><strong className="text-primary">CLUB</strong> stands for community — a space where people support one another, grow together, and create value through connection.</p>
                <p className="text-base text-white/70 mb-4"><strong className="text-primary">XQUARE</strong> represents multiplication — the belief that when the right people come together in the right ecosystem, opportunities do not just increase, they multiply.</p>
                <p className="text-base text-white font-medium mt-6">Together, it represents a community where participation multiplies value.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Why We're Building This */}
      <Section darker>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl mb-6">Built to solve real gaps in today's ecosystem</h2>
          <p className="text-xl text-white/70">
            Today, many influencers struggle to get brand opportunities unless they already have very high follower counts. At the same time, many small and growing businesses find influencer collaborations expensive, difficult to access, or hard to manage.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <TrendingUp className="w-8 h-8 text-primary mb-4" />,
              text: "Influencers do not have to wait until they become \"big enough\" to start getting opportunities."
            },
            {
              icon: <Target className="w-8 h-8 text-primary mb-4" />,
              text: "Businesses do not have to depend only on expensive or out-of-reach collaborations."
            },
            {
              icon: <Users className="w-8 h-8 text-primary mb-4" />,
              text: "Product promotion becomes more flexible, practical, and accessible for everyone."
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-card border border-card-border p-8 rounded-2xl"
            >
              {item.icon}
              <p className="text-lg text-white/90 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xl font-medium text-blue-300 mt-12">
          This is where community-led growth can make a real difference.
        </p>
      </Section>

      {/* How It Works */}
      <Section id="how-it-works">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl mb-6">A connected model built for shared growth</h2>
          <p className="text-xl text-white/70">
            XQUARE CLUB brings together three important parts of the ecosystem in one place.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {[
            { label: "For Businesses", text: "Businesses can list their products, build visibility, and explore influencer-led promotion in a more practical and budget-friendly way." },
            { label: "For Influencers", text: "Influencers can create their presence on the platform, discover products they can promote, and benefit from the activity generated through their promotions." },
            { label: "For Customers",  text: "Customers can discover products through creators, recommendations, and content that feels more engaging and relatable." },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, boxShadow: "0 0 35px -5px rgba(59,130,246,0.45)" }}
              transition={{ duration: 0.25 }}
              className="relative p-[1px] rounded-3xl bg-gradient-to-b from-white/20 to-white/0 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="h-full bg-card rounded-[23px] p-8 md:p-10 relative z-10 flex flex-col">
                <div className="inline-flex px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-semibold tracking-wider text-white/80 uppercase mb-6 w-max">
                  {card.label}
                </div>
                <p className="text-xl leading-relaxed flex-grow">{card.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <ActionButtons />
        </div>
      </Section>

      {/* Benefits Detailed */}
      <Section darker>
        <h2 className="text-4xl md:text-5xl text-center mb-20">How XQUARE CLUB creates value</h2>

        <div className="space-y-24">
          {/* Benefit 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <ShieldCheck className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-3xl">For Influencers</h3>
              </div>
              <p className="text-lg text-white/70 mb-8">
                On most traditional social platforms, collaboration opportunities often go only to creators with large follower numbers. XQUARE CLUB aims to make opportunities more accessible.
              </p>
              <ul className="space-y-4">
                {[
                  "A chance to join early and grow with the platform",
                  "Opportunity to promote listed products without waiting for direct brand recognition",
                  "Better access to product promotion opportunities even as a growing creator",
                  "Scope to benefit from engagement, clicks, or sales generated through their profile",
                  "A dedicated space to build visibility and credibility"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ChevronRight className="w-6 h-6 text-primary shrink-0" />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-navy to-black border border-card-border rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,theme(colors.primary),transparent_70%)]" />
               <img 
                 src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60" 
                 alt="Content creator" 
                 className="w-full h-full object-cover rounded-2xl absolute inset-0 opacity-40 mix-blend-overlay"
               />
               <div className="relative z-10 text-center">
                 <div className="text-5xl font-display font-bold text-white mb-2">Grow</div>
                 <div className="text-2xl text-blue-300">without limits</div>
               </div>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-gradient-to-bl from-navy to-black border border-card-border rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,theme(colors.primary),transparent_70%)]" />
               <img 
                 src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60" 
                 alt="Business growth" 
                 className="w-full h-full object-cover rounded-2xl absolute inset-0 opacity-30 mix-blend-overlay"
               />
               <div className="relative z-10 text-center">
                 <div className="text-5xl font-display font-bold text-white mb-2">Reach</div>
                 <div className="text-2xl text-blue-300">smarter audiences</div>
               </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <TrendingUp className="text-white w-6 h-6" />
                </div>
                <h3 className="text-3xl">For Businesses</h3>
              </div>
              <p className="text-lg text-white/70 mb-8">
                For many MSMEs and growing businesses, influencer marketing can feel expensive and out of reach.
              </p>
              <ul className="space-y-4">
                {[
                  "Better visibility for products through influencer-led promotion",
                  "Access to a wider pool of influencers, not just a few high-cost profiles",
                  "More control over collaboration and promotional expenses",
                  "A smarter and more manageable way to approach digital promotion",
                  "Better opportunities to reach audiences through relatable content"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ChevronRight className="w-6 h-6 text-white/60 shrink-0" />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="text-blue-400 w-6 h-6" />
                </div>
                <h3 className="text-3xl">For Customers</h3>
              </div>
              <p className="text-lg text-white/70 mb-8">
                Customers benefit from a more trust-based and engaging product discovery experience.
              </p>
              <ul className="space-y-4">
                {[
                  "Product discovery through trusted voices and relatable creators",
                  "A more engaging and connected browsing experience",
                  "Better understanding of products through content-led visibility"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ChevronRight className="w-6 h-6 text-blue-400 shrink-0" />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-tr from-navy to-black border border-card-border rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,theme(colors.primary),transparent_70%)]" />
               <img 
                 src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60" 
                 alt="Community" 
                 className="w-full h-full object-cover rounded-2xl absolute inset-0 opacity-30 mix-blend-overlay"
               />
               <div className="relative z-10 text-center">
                 <div className="text-5xl font-display font-bold text-white mb-2">Discover</div>
                 <div className="text-2xl text-blue-300">authentically</div>
               </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Impact & Mission & Vision */}
      <Section>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-3 text-center max-w-4xl mx-auto mb-12">
            <h2 className="text-4xl font-display mb-6">The impact XQUARE CLUB aims to create</h2>
            <p className="text-xl text-white/80">
              XQUARE CLUB is being built on the belief that growth should not belong only to the already-established. By bringing businesses and influencers into one ecosystem, XQUARE CLUB aims to create a multiplying effect — where one opportunity can lead to many more.
            </p>
          </div>

          <div className="bg-card/50 border border-card-border p-8 rounded-3xl backdrop-blur-sm hover:bg-card/80 transition-colors">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <p className="text-lg">For small businesses that need practical and affordable visibility</p>
          </div>

          <div className="bg-card/50 border border-card-border p-8 rounded-3xl backdrop-blur-sm hover:bg-card/80 transition-colors">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <p className="text-lg">For influencers who deserve opportunities even before reaching massive numbers</p>
          </div>

          <div className="bg-card/50 border border-card-border p-8 rounded-3xl backdrop-blur-sm hover:bg-card/80 transition-colors">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <p className="text-lg">For communities that become stronger when people help one another grow</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="bg-gradient-to-br from-navy to-black border border-white/10 p-10 rounded-3xl">
            <h3 className="text-2xl font-display text-primary mb-4 uppercase tracking-widest text-sm">Our Mission</h3>
            <p className="text-xl mb-6">To build a community-driven platform where businesses and influencers can connect, collaborate, and grow in a way that is more inclusive, accessible, and rewarding.</p>
            <p className="text-white/60">XQUARE CLUB exists to make opportunities more reachable and growth more possible for a wider group of people.</p>
          </div>
          
          <div className="bg-gradient-to-bl from-navy to-black border border-white/10 p-10 rounded-3xl">
            <h3 className="text-2xl font-display text-primary mb-4 uppercase tracking-widest text-sm">Our Vision</h3>
            <p className="text-xl mb-6">To create a trusted ecosystem where community participation leads to multiplied value.</p>
            <p className="text-white/60 mb-4">XQUARE CLUB envisions a future where businesses gain stronger reach, influencers gain fairer opportunities, and every meaningful collaboration contributes to greater growth and impact.</p>
            <p className="text-white/90 font-medium italic border-l-2 border-primary/50 pl-4 py-1">"At the heart of this vision is a simple belief: when people grow together, outcomes multiply."</p>
          </div>
        </div>
      </Section>

      {/* Early Access & Registration */}
      <Section id="register" darker className="border-t border-white/5">
        <div className="max-w-5xl mx-auto">

          {/* header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold tracking-wide text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              EARLY ACCESS
            </div>
            <h2 className="text-4xl md:text-5xl mb-6">Be among the first to join XQUARE CLUB</h2>
            <p className="text-xl text-white/70 mb-3">
              We are currently inviting influencers and businesses to apply for early access to XQUARE CLUB.
            </p>
            <p className="text-base text-white/50">
              If you are looking to grow through collaboration, visibility, and new opportunities, this is your chance to get in early.{" "}
              <button onClick={scrollToDisclaimer} className="text-white/70 font-medium underline decoration-white/50 hover:decoration-white transition-colors cursor-pointer">Applications are free to submit.*</button>
            </p>
          </div>

          {/* two cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">

            {/* Influencer card */}
            <div className="bg-card border border-card-border rounded-2xl p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-primary" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-xl">🎬</div>
                <h3 className="text-2xl font-bold">For Influencers</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-8 flex-1">
                Apply through our influencer onboarding form and let us know your interest in joining XQUARE CLUB as a creator.
              </p>
              <div className="mt-auto">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = "/influencer-onboarding"}
                  className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-blue-400 transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_-3px_rgba(59,130,246,0.7)] mb-3"
                >
                  Apply as an Influencer
                </motion.button>
                <p className="text-white/30 text-xs text-center">Takes about 5 minutes · <button onClick={scrollToDisclaimer} className="underline decoration-white/30 hover:decoration-white/60 transition-colors cursor-pointer">Free to apply*</button></p>
              </div>
            </div>

            {/* Seller card */}
            <div className="bg-card border border-card-border rounded-2xl p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-primary" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-xl">🏪</div>
                <h3 className="text-2xl font-bold">For Businesses</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-8 flex-1">
                Apply through our seller onboarding form to express your interest in listing your business on XQUARE CLUB.
              </p>
              <div className="mt-auto">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = "/list-your-business"}
                  className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-blue-400 transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_-3px_rgba(59,130,246,0.7)] mb-3"
                >
                  Apply as a Seller
                </motion.button>
                <p className="text-white/30 text-xs text-center">Takes about 5 minutes · <button onClick={scrollToDisclaimer} className="underline decoration-white/30 hover:decoration-white/60 transition-colors cursor-pointer">Free to apply*</button></p>
              </div>
            </div>

          </div>

          {/* footer note */}
          <p className="text-center text-white/50 text-sm">
            No payment. No commitment. Just an early step into something built for growth.
          </p>

        </div>
      </Section>

      {/* Closing CTA */}
      <Section className="text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&auto=format&fit=crop&q=80')] opacity-10 object-cover mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
            Be part of a community built for growth
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-6 leading-relaxed">
            XQUARE CLUB is more than a platform name — it reflects a vision of people, businesses, and opportunities coming together to create greater value for one another.
          </p>
          <p className="text-lg text-white/60 mb-12">
            If you are an influencer looking to grow, or a business looking for smarter promotion opportunities, now is the time to step in early.
          </p>
          
          <div className="flex justify-center mb-16">
            <ActionButtons />
          </div>

          <div className="inline-block border border-white/10 rounded-full px-8 py-4 bg-white/5 backdrop-blur-md">
            <p className="font-display text-xl md:text-2xl font-bold tracking-wide">
              Join early. <span className="text-primary">Grow together.</span> Multiply opportunities.
            </p>
          </div>
        </div>
      </Section>

      {/* Disclaimer — between section and footer */}
      <div id="disclaimer" className="relative z-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-white/50 text-sm max-w-3xl">
            *Application submission is currently free for both influencers and sellers. Every application will be reviewed and verified manually by the XQUARE CLUB team before onboarding. Platform onboarding or listing may be subject to charges at a later stage, based on the final approval and commercial process.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 bg-black pt-16 pb-8 text-center md:text-left relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img
                src={`${import.meta.env.BASE_URL}images/xquare-logo.png`}
                alt="XQUARE CLUB Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-white/50 text-sm max-w-sm mx-auto md:mx-0">
              A community-driven platform connecting small businesses and growing influencers.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Contact Us</h4>
            <ul className="space-y-3 text-white/50 text-sm">
              <li>
                <a href="tel:+919567089117" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  +91 95670 89117
                </a>
              </li>
              <li>
                <a href="mailto:hello@xquareclub.com" className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  hello@xquareclub.com
                </a>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Address</h4>
            <div className="flex items-start justify-center md:justify-start gap-2 text-white/50 text-sm leading-relaxed">
              <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>
                Xquare Club Private Limited<br />
                55/956, Main Avenue Road,<br />
                Panampilly Nagar, Kochi<br />
                Eranakulam, Kerala — 683036
              </span>
            </div>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-3 items-center md:items-end text-sm text-white/50">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-1">Navigate</h4>
            <button onClick={() => document.getElementById("about")?.scrollIntoView()} className="hover:text-white transition-colors">About</button>
            <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView()} className="hover:text-white transition-colors">How it works</button>
            <button onClick={scrollToRegister} className="hover:text-white transition-colors">Early Access</button>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-6 text-center text-white/30 text-sm pt-8 border-t border-white/5">
          <p>&copy; {new Date().getFullYear()} XQUARE CLUB. All rights reserved.</p>
        </div>
      </footer>

      <SellerModal 
        isOpen={isSellerModalOpen} 
        onClose={() => setIsSellerModalOpen(false)} 
      />
    </div>
  );
}
