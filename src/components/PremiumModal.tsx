import { useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useEffect } from "react";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const SubscribeForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
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
        description: "Welcome to Premium!",
      });
      onSuccess();
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-spotify-green text-black hover:bg-green-400 font-semibold"
      >
        {isLoading ? "Processing..." : "Subscribe"}
      </Button>
    </form>
  );
};

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (showPayment) {
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

  const handleSuccess = () => {
    setShowPayment(false);
    onClose();
    toast({
      title: "Welcome to Premium!",
      description: "You now have access to all premium features.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-spotify-gray border-spotify-light-gray max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Get Premium
          </DialogTitle>
        </DialogHeader>
        
        {!showPayment ? (
          <div className="space-y-6">
            <p className="text-spotify-text text-center">
              Upgrade to Premium for ad-free music, unlimited skips, and offline listening.
            </p>
            
            <div className="space-y-4">
              <Card className="bg-spotify-light-gray p-4 border-none">
                <h3 className="font-semibold mb-2 text-white">Individual</h3>
                <p className="text-2xl font-bold text-spotify-green">
                  $9.99<span className="text-sm font-normal text-white">/month</span>
                </p>
                <p className="text-spotify-text text-sm">1 account</p>
              </Card>
              
              <Card className="bg-spotify-light-gray p-4 border-none">
                <h3 className="font-semibold mb-2 text-white">Family</h3>
                <p className="text-2xl font-bold text-spotify-green">
                  $15.99<span className="text-sm font-normal text-white">/month</span>
                </p>
                <p className="text-spotify-text text-sm">Up to 6 accounts</p>
              </Card>
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowPayment(true)}
                disabled={!stripePromise}
                className="flex-1 bg-spotify-green text-black hover:bg-green-400 font-semibold disabled:bg-gray-400 disabled:text-gray-600"
              >
                {!stripePromise ? "Payment System Not Available" : "Get Premium"}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-spotify-light-gray text-white hover:bg-spotify-light-gray"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {!stripePromise ? (
              <div className="text-center py-8">
                <p className="text-spotify-text">Payment system is not configured.</p>
                <p className="text-spotify-text text-sm mt-2">Please contact support to enable payments.</p>
                <Button
                  onClick={onClose}
                  className="mt-4 bg-spotify-green text-black hover:bg-green-400 font-semibold"
                >
                  Close
                </Button>
              </div>
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm onSuccess={handleSuccess} />
              </Elements>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full mx-auto" />
                <p className="text-spotify-text mt-4">Setting up payment...</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
