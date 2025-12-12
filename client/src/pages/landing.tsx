import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import {
  Mic,
  User,
  RefreshCw,
  Phone,
  Play,
  Building2,
  Home,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Wrench,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Globe,
  Shield,
  MapPin,
} from "lucide-react";
import { SiLinkedin, SiX, SiFacebook } from "react-icons/si";
import { ContactFormModal } from "@/components/contact-form-modal";
import { DemoSchedulingModal } from "@/components/demo-scheduling-modal";
import heroImage from "@assets/freepik__create-an-image-similar-to-img1-a-futuristic-digit___1765523398341.jpeg";
import konverxaLogo from "@assets/konverxa-logo_1765466926990.png";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Landing() {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onBookConsultation={() => setDemoModalOpen(true)} />
      <main>
        <HeroSection 
          onTryDemo={() => setContactModalOpen(true)} 
          onBookConsultation={() => setDemoModalOpen(true)} 
        />
        <DemoSection />
        <ServicesSection />
        <UseCasesSection />
        <HowItWorksSection />
        <CTASection 
          onGetStarted={() => setContactModalOpen(true)} 
          onScheduleDemo={() => setDemoModalOpen(true)} 
        />
      </main>
      <Footer onContact={() => setContactModalOpen(true)} />
      
      <ContactFormModal open={contactModalOpen} onOpenChange={setContactModalOpen} />
      <DemoSchedulingModal open={demoModalOpen} onOpenChange={setDemoModalOpen} />
    </div>
  );
}

interface HeaderProps {
  onBookConsultation: () => void;
}

function Header({ onBookConsultation }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          <div className="flex items-center gap-2">
            <img src={konverxaLogo} alt="Konverxa" className="h-8 w-auto" data-testid="img-logo" />
            <span className="font-semibold text-lg text-foreground" data-testid="text-logo">Konverxa</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-demo">Demo</a>
            <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-services">Services</a>
            <a href="#use-cases" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-use-cases">Use Cases</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-how-it-works">How It Works</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBookConsultation}
              data-testid="button-book-consultation-header"
            >
              Book Consultation
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

interface HeroSectionProps {
  onTryDemo: () => void;
  onBookConsultation: () => void;
}

function HeroSection({ onTryDemo, onBookConsultation }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight"
            variants={fadeInUp}
            data-testid="text-hero-headline"
          >
            Your 24/7 AI Receptionist That{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Never Takes a Break
            </span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
            data-testid="text-hero-subheadline"
          >
            AI voice agents and avatars that handle customer calls, book appointments, 
            and answer questions around the clock - while you focus on growing your business.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={fadeInUp}
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-base px-8" 
              onClick={onTryDemo}
              data-testid="button-try-demo"
            >
              Try Our Demo Agent
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-base px-8" 
              onClick={onBookConsultation}
              data-testid="button-book-consultation"
            >
              Book a Free Consultation
            </Button>
          </motion.div>
          
          <motion.div 
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span data-testid="text-trust-europe">Serving businesses across Europe</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span data-testid="text-trust-gdpr">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span data-testid="text-trust-eu">Built in EU</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-16"
            variants={fadeInUp}
          >
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-50" />
              <img 
                src={heroImage} 
                alt="AI Voice Agent Avatar" 
                className="relative w-full rounded-xl shadow-2xl border border-border/50"
                data-testid="img-hero"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section id="demo" className="py-20 lg:py-28 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground" data-testid="text-demo-heading">
            Experience It Yourself
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Call now and talk to our AI agent - see how natural it sounds
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="relative overflow-visible bg-card/80 backdrop-blur-sm border-border/50">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-30" />
            <CardContent className="relative p-8 sm:p-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                
                <a 
                  href="tel:+34XXXXXXXXX" 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground hover:text-primary transition-colors"
                  data-testid="link-phone-number"
                >
                  +34 XXX XXX XXX
                </a>
                
                <p className="mt-4 text-muted-foreground">
                  Available 24/7 in multiple languages
                </p>
                
                <div className="mt-8 w-full">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border/50">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Play className="w-8 h-8 text-primary ml-1" />
                      </div>
                      <p className="text-muted-foreground" data-testid="text-video-placeholder">Watch Demo Video</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: Mic,
      title: "Voice Agents",
      description: "Answer calls, book appointments, qualify leads - automatically",
    },
    {
      icon: User,
      title: "AI Avatars",
      description: "Training videos, customer support, course instructors",
    },
    {
      icon: RefreshCw,
      title: "Smart Automation",
      description: "Connect to your calendar, CRM, and existing tools",
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground" data-testid="text-services-heading">
            What We Offer
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive AI solutions tailored to your business needs
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="group relative h-full overflow-visible bg-card/50 backdrop-blur-sm border-border/50 hover-elevate transition-all duration-300"
                data-testid={`card-service-${index}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                <CardContent className="relative p-8">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3" data-testid={`text-service-title-${index}`}>
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`text-service-description-${index}`}>
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCasesSection() {
  const useCases = [
    {
      icon: Building2,
      title: "Healthcare Practices",
      description: "Never miss patient calls",
    },
    {
      icon: Home,
      title: "Real Estate Agents",
      description: "Handle property inquiries 24/7",
    },
    {
      icon: Briefcase,
      title: "Professional Services",
      description: "Always available for clients",
    },
    {
      icon: GraduationCap,
      title: "Online Educators",
      description: "Scale your teaching",
    },
  ];

  return (
    <section id="use-cases" className="py-20 lg:py-28 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground" data-testid="text-use-cases-heading">
            Who We Help
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by businesses across diverse industries
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="group h-full overflow-visible bg-card/80 backdrop-blur-sm border-border/50 hover-elevate transition-all duration-300"
                data-testid={`card-use-case-${index}`}
              >
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                    <useCase.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1" data-testid={`text-use-case-title-${index}`}>
                      {useCase.title}
                    </h3>
                    <p className="text-muted-foreground" data-testid={`text-use-case-description-${index}`}>
                      {useCase.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: MessageSquare,
      step: "01",
      title: "Discovery Call",
      description: "We understand your needs",
    },
    {
      icon: Wrench,
      step: "02",
      title: "Build & Test",
      description: "Custom AI agent for your business",
    },
    {
      icon: Rocket,
      step: "03",
      title: "Launch & Optimize",
      description: "Go live and improve continuously",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground" data-testid="text-how-it-works-heading">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </motion.div>
        
        <div className="relative">
          <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-primary/20 via-accent/40 to-primary/20 rounded-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                data-testid={`step-${index}`}
              >
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`text-step-title-${index}`}>
                  {step.title}
                </h3>
                <p className="text-muted-foreground" data-testid={`text-step-description-${index}`}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface CTASectionProps {
  onGetStarted: () => void;
  onScheduleDemo: () => void;
}

function CTASection({ onGetStarted, onScheduleDemo }: CTASectionProps) {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight" data-testid="text-cta-heading">
            Ready to Never Miss a Customer Again?
          </h2>
          
          <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
            Join hundreds of businesses that have transformed their customer experience with AI
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-base px-8" 
              onClick={onGetStarted}
              data-testid="button-get-started"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-base px-8 bg-white/5 border-white/20 text-white hover:bg-white/10"
              onClick={onScheduleDemo}
              data-testid="button-schedule-demo"
            >
              Schedule Free Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface FooterProps {
  onContact: () => void;
}

function Footer({ onContact }: FooterProps) {
  return (
    <footer className="py-12 bg-muted/30 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={konverxaLogo} alt="Konverxa" className="h-8 w-auto" />
              <span className="font-semibold text-lg text-foreground">Konverxa</span>
            </div>
            <p className="text-muted-foreground max-w-sm mb-4">
              Your trusted partner for AI-powered voice agents and avatars. 
              Serving businesses across Europe with GDPR-compliant solutions.
            </p>
            <Button variant="outline" size="sm" onClick={onContact} data-testid="button-footer-contact">
              Contact Us
            </Button>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="mailto:hello@konverxa.eu" className="hover:text-foreground transition-colors" data-testid="text-footer-email">
                  hello@konverxa.eu
                </a>
              </li>
              <li data-testid="text-footer-phone">+34 XXX XXX XXX</li>
              <li data-testid="text-footer-location">Barcelona, Spain</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                data-testid="link-linkedin"
                aria-label="Follow us on LinkedIn"
              >
                <SiLinkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                data-testid="link-twitter"
                aria-label="Follow us on X"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                data-testid="link-facebook"
                aria-label="Follow us on Facebook"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            &copy; 2024 Konverxa - Built in EU
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-privacy">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
