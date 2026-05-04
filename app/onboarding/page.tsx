"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Store, ArrowRight, X, Check } from "lucide-react";
import { motion } from "motion/react";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showPolicy, setShowPolicy] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
    });
  }, [router, supabase]);

  const handleSelectRole = async (role: "user" | "seller") => {
    if (!user) return;

    if (role === "seller") {
      setShowPolicy(true);
      return;
    }

    setLoading(role);
    const { error } = await supabase
      .from("profiles")
      .update({ role, onboarding_completed: true })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating role:", error);
      alert("Something went wrong. Please try again.");
      setLoading(null);
      return;
    }

    router.push("/");
  };

  const handleSellerConfirm = async () => {
    if (!user || !policyAccepted) return;
    setLoading("seller");

    const { error } = await supabase
      .from("profiles")
      .update({ role: "seller", onboarding_completed: true })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating role:", error);
      alert("Something went wrong. Please try again.");
      setLoading(null);
      return;
    }

    router.push("/dashboard");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 mb-4">
            Welcome!
          </h1>
          <p className="text-lg text-zinc-500 font-medium">
            How would you like to use Community Seller Hub?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => handleSelectRole("user")}
            disabled={!!loading}
            className="group relative bg-white border-2 border-zinc-200 rounded-[2.5rem] p-8 text-left hover:border-zinc-300 hover:shadow-xl transition-all disabled:opacity-50"
          >
            <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">
              Browse & Buy
            </h2>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-6">
              Discover local sellers and their products. Contact sellers
              directly through WhatsApp or Messenger.
            </p>
            <div className="flex items-center text-sm font-bold text-zinc-900">
              Continue as Buyer
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
            {loading === "user" && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-[2.5rem]">
                <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => handleSelectRole("seller")}
            disabled={!!loading}
            className="group relative bg-zinc-900 border-2 border-zinc-900 rounded-[2.5rem] p-8 text-left hover:shadow-2xl transition-all disabled:opacity-50"
          >
            <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Start Selling</h2>
            <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-6">
              Create your shop, list products, and connect with buyers. Manage
              your listings and track engagement.
            </p>
            <div className="flex items-center text-sm font-bold text-white">
              Continue as Seller
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
            {loading === "seller" && (
              <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center rounded-[2.5rem]">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </motion.button>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-8">
          You can change this anytime in your account settings
        </p>
      </div>

      {/* Policy Modal */}
      {showPolicy && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">
                Seller Agreement
              </h2>
              <button
                onClick={() => setShowPolicy(false)}
                className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[40vh]">
              <div className="space-y-4 text-sm text-zinc-600 font-medium leading-relaxed">
                <p>
                  By becoming a seller on Community Seller Hub, you agree to the
                  following:
                </p>

                <div className="bg-zinc-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>List only authentic products that you actually have</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>Provide accurate descriptions and real photos</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      Respond to buyer inquiries promptly and professionally
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      Honor your listings - don't cancel orders without valid
                      reason
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      No prohibited items (weapons, drugs, counterfeit goods)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      Transactions happen outside the platform - you're
                      responsible for delivery
                    </p>
                  </div>
                </div>

                <p className="text-xs text-zinc-400">
                  We reserve the right to remove sellers who violate these terms
                  or receive repeated complaints from buyers.
                </p>
              </div>

              <label className="mt-6 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={policyAccepted}
                  onChange={(e) => setPolicyAccepted(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <span className="text-sm font-medium text-zinc-700">
                  I have read and agree to the seller terms above
                </span>
              </label>
            </div>

            <div className="p-8 border-t border-zinc-100">
              <Button
                fullWidth
                size="lg"
                onClick={handleSellerConfirm}
                disabled={!policyAccepted || loading === "seller"}
                className="rounded-2xl"
              >
                {loading === "seller" ? "Setting up..." : "Confirm & Continue"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
