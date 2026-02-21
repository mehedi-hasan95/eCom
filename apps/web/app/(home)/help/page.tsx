import { ArrowRight, Code, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

const Page = async () => {
  return (
    <div className="container-default">
      <section className="py-12 text-center space-y-6">
        <h2 className="text-5xl font-bold text-foreground text-balance">
          Multi-Tenant E-Commerce Platform
        </h2>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto text-balance">
          A comprehensive, scalable solution for managing multiple e-commerce
          stores with complete data isolation, advanced features, and
          enterprise-grade security.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/help"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2"
          >
            View Documentation <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="border border-border text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-background-secondary"
          >
            Learn More
          </a>
        </div>
      </section>
      <section id="features" className="py-12 space-y-8">
        <h3 className="text-3xl font-bold text-foreground text-center">
          Platform Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-border rounded-lg p-6 space-y-3 hover:shadow-lg transition-shadow">
            <Code className="w-8 h-8 text-primary" />
            <h4 className="text-lg font-semibold text-foreground">
              Robust API
            </h4>
            <p className="text-foreground/70">
              Comprehensive REST API with complete product, order, payment, and
              inventory management endpoints.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 space-y-3 hover:shadow-lg transition-shadow">
            <Zap className="w-8 h-8 text-primary" />
            <h4 className="text-lg font-semibold text-foreground">
              High Performance
            </h4>
            <p className="text-foreground/70">
              Auto-scaling infrastructure with caching, CDN integration, and
              99.9% uptime SLA.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 space-y-3 hover:shadow-lg transition-shadow">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h4 className="text-lg font-semibold text-foreground">
              Enterprise Security
            </h4>
            <p className="text-foreground/70">
              Complete tenant isolation, encryption, GDPR compliance, and
              comprehensive audit logs.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 space-y-8 bg-background-secondary rounded-lg border border-border p-8">
        <h3 className="text-2xl font-bold text-foreground">
          Core Capabilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-foreground/80">
              <span className="text-primary font-bold">✓</span> Multi-tenant
              architecture with complete data isolation
            </li>
            <li className="flex items-center gap-2 text-foreground/80">
              <span className="text-primary font-bold">✓</span> Unlimited
              products and variants per store
            </li>
            <li className="flex items-center gap-2 text-foreground/80">
              <span className="text-primary font-bold">✓</span> Advanced
              inventory management across locations
            </li>
            <li className="flex items-center gap-2 text-foreground/80">
              <span className="text-primary font-bold">✓</span> Multiple payment
              gateway integrations
            </li>
            <li className="flex items-center gap-2 text-foreground/80">
              <span className="text-primary font-bold">✓</span> Integrated
              shipping and logistics
            </li>
          </ul>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-foreground/80">
              <span className="text-primary font-bold">✓</span> Comprehensive
              reporting and analytics
            </li>
            <li className="flex items-center gap-2 text-foreground/80">
              <span className="text-primary font-bold">✓</span> Customizable
              branding per tenant
            </li>
            <li className="flex items-center gap-2 text-foreground/80">
              <span className="text-primary font-bold">✓</span> Role-based
              access control (RBAC)
            </li>
            <li className="flex items-center gap-2 text-foreground/80">
              <span className="text-primary font-bold">✓</span> Webhook support
              for integrations
            </li>
            <li className="flex items-center gap-2 text-foreground/80">
              <span className="text-primary font-bold">✓</span> Complete order
              and fulfillment lifecycle
            </li>
          </ul>
        </div>
      </section>
      <section className="py-12 text-center space-y-6 bg-primary/10 border border-primary rounded-lg p-8">
        <h3 className="text-2xl font-bold text-foreground">
          Ready to Get Started?
        </h3>
        <p className="text-foreground/80 max-w-2xl mx-auto">
          Explore the complete API documentation, learn about multi-tenant
          architecture requirements, and integrate our platform into your
          application.
        </p>
        <Link
          href="/help"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90"
        >
          View Full Documentation
        </Link>
      </section>
      <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <p className="text-4xl font-bold text-primary">50+</p>
          <p className="text-foreground/70">API Endpoints</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-primary">13</p>
          <p className="text-foreground/70">Feature Modules</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-primary">99.9%</p>
          <p className="text-foreground/70">Uptime SLA</p>
        </div>
      </section>
    </div>
  );
};

export default Page;
