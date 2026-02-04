"use client";

import { LoadingButton } from "@/components/common/loading-button";
import { stripeConnectAction } from "@/lib/actions/stripe-action";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";

export const DashboardStripeForm = () => {
  const [activeStep, setActiveStep] = useState(1);
  const steps = [
    {
      number: 1,
      title: "Create Account",
      description: "Set up your Stripe Connect account in minutes",
      details: [
        "Business information",
        "Personal verification",
        "Tax identification",
      ],
    },
    {
      number: 2,
      title: "Bank Details",
      description: "Add your bank account for payouts",
      details: [
        "Account routing number",
        "Account number",
        "Account holder name",
      ],
    },
    {
      number: 3,
      title: "Start Selling",
      description: "Begin accepting payments immediately",
      details: [
        "Create products",
        "Accept customer payments",
        "Track earnings in real-time",
      ],
    },
  ];

  const stripeConnectMutation = useMutation({
    mutationFn: stripeConnectAction,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      // todo:
      console.log(error);
    },
  });
  return (
    <div>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h3 className="mb-4 text-center text-2xl font-bold text-foreground">
            Simple 3-Step Process
          </h3>
          <p className="mb-12 text-center text-muted-foreground">
            Get up and running in less than 10 minutes
          </p>

          <div className="space-y-6">
            {steps.map((step) => (
              <Card
                key={step.number}
                className={`border-2 p-6 cursor-pointer transition-all duration-300 ${
                  activeStep === step.number
                    ? "border-primary bg-primary/5"
                    : "border-border/40 bg-card hover:border-border/60"
                }`}
                onClick={() => setActiveStep(step.number)}
              >
                <div className="flex items-start justify-between gap-4 sm:gap-6">
                  <div className="flex flex-shrink-0 gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground">
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 ${
                      activeStep === step.number ? "rotate-90" : ""
                    }`}
                  />
                </div>

                {activeStep === step.number && (
                  <div className="mt-6 ml-16 space-y-3 border-l-2 border-primary/30 pl-4">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Card className="border-primary/30 bg-gradient-to-b from-primary/5 to-accent/5 p-12">
            <h3 className="text-3xl font-bold text-foreground">
              Ready to Get Started?
            </h3>
            <p className="mt-4 text-muted-foreground">
              Join millions of sellers who are growing their business with
              Stripe Connect. Setup takes just 10 minutes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => stripeConnectMutation.mutate()}
              >
                {stripeConnectMutation.isPending ? (
                  <LoadingButton />
                ) : (
                  <>
                    Start Your Setup <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
