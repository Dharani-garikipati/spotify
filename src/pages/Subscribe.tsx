import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Check, Music } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "You are now subscribed to Premium!",
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-spotify-green text-black hover:bg-green-400 font-semibold py-3"
      >
        {isLoading ? "Processing..." : "Subscribe"}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (showPayment) {
      // Create PaymentIntent as soon as the page loads
      apiRequest("POST", "/api/create-subscription")
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Failed to initialize payment",
            variant: "destructive",
          });
        });
    }
  }, [showPayment, toast]);

  const premiumFeatures = [
    "Ad-free music listening",
    "Download to listen offline",
    "Play songs in any order",
    "High quality audio",
    "Unlimited skips",
    "Listen with friends in real time",
  ];

  if (!showPayment) {
    return (
      <div className="min-h-screen bg-spotify-dark p-6 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Music className="h-12 w-12 text-spotify-green mr-3" />
              <h1 className="text-4xl font-bold text-white">Music Stream Premium</h1>
            </div>
            <p className="text-xl text-spotify-text">
              Upgrade to Premium for the best music experience
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-spotify-light-gray border-none p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Individual</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-spotify-green">$9.99</span>
                <span className="text-spotify-text">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-white">
                    <Check className="h-5 w-5 text-spotify-green mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="text-spotify-text text-sm mb-6">1 account</p>
              <Button
                onClick={() => setShowPayment(true)}
                disabled={!stripePromise}
                className="w-full bg-spotify-green text-black hover:bg-green-400 font-semibold py-3 disabled:bg-gray-400 disabled:text-gray-600"
              >
                {!stripePromise ? "Payment Not Available" : "Get Premium Individual"}
              </Button>
            </Card>

            <Card className="bg-spotify-light-gray border-none p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Family</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-spotify-green">$15.99</span>
                <span className="text-spotify-text">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-white">
                    <Check className="h-5 w-5 text-spotify-green mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                <li className="flex items-center text-white">
                  <Check className="h-5 w-5 text-spotify-green mr-3 flex-shrink-0" />
                  Block explicit music
                </li>
              </ul>
              <p className="text-spotify-text text-sm mb-6">Up to 6 accounts</p>
              <Button
                onClick={() => setShowPayment(true)}
                disabled={!stripePromise}
                className="w-full bg-spotify-green text-black hover:bg-green-400 font-semibold py-3 disabled:bg-gray-400 disabled:text-gray-600"
              >
                {!stripePromise ? "Payment Not Available" : "Get Premium Family"}
              </Button>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center text-spotify-text">
            <p className="mb-4">
              Cancel anytime. Terms and conditions apply.
            </p>
            <p className="text-sm">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-spotify-dark flex items-center justify-center">
        <Card className="bg-spotify-light-gray border-none p-8 max-w-md w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Payment Not Available</h2>
            <p className="text-spotify-text mb-6">Payment system is not configured. Please contact support.</p>
            <Button
              onClick={() => setShowPayment(false)}
              className="w-full bg-spotify-green text-black hover:bg-green-400 font-semibold py-3"
            >
              Back to plans
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-spotify-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-spotify-text">Setting up payment...</p>
        </div>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="min-h-screen bg-spotify-dark p-6 flex items-center justify-center">
      <Card className="bg-spotify-light-gray border-none p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Complete your subscription</h2>
          <p className="text-spotify-text">You're one step away from Premium</p>
        </div>
        
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <SubscribeForm />
        </Elements>
        
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => setShowPayment(false)}
            className="text-spotify-text hover:text-white"
          >
            Back to plans
          </Button>
        </div>
      </Card>
    </div>
  );
}
