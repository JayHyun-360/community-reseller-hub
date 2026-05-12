"use client";

import { useState } from "react";
import { X, Check, MessageCircle, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  getMessagingPreference, 
  setMessagingPreference, 
  type MessagingPlatform 
} from "@/lib/messaging-preference";

interface MessagingPreferenceSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MessagingPreferenceSheet({ 
  isOpen, 
  onClose 
}: MessagingPreferenceSheetProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<MessagingPlatform>(
    getMessagingPreference()
  );

  const handleSave = () => {
    setMessagingPreference(selectedPlatform);
    onClose();
  };

  const options = [
    {
      value: "messenger" as const,
      label: "Facebook Messenger",
      icon: MessageCircle,
      color: "text-[#0084FF]",
      description: "Great for desktop conversations"
    },
    {
      value: "whatsapp" as const,
      label: "WhatsApp",
      icon: Phone,
      color: "text-[#25D366]",
      description: "Perfect for mobile messaging"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-t-3xl w-full max-w-lg max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-zinc-900">
                Messaging Preference
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-zinc-900" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="text-sm text-zinc-600">
                Choose your preferred messaging platform. This will be used when you click "Message" on products.
              </div>

              <div className="space-y-3">
                {options.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedPlatform === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSelectedPlatform(option.value)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${isSelected ? "bg-zinc-900" : "bg-zinc-100"}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? "text-white" : option.color}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-zinc-900">
                            {option.label}
                          </div>
                          <div className="text-sm text-zinc-500">
                            {option.description}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="p-1 bg-zinc-900 rounded-full">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-zinc-400">
                Your preference will be saved and used for future messaging. You can change this anytime.
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white border-t border-zinc-100 p-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full font-black text-sm text-zinc-900 bg-zinc-100 hover:bg-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-full font-black text-sm text-white bg-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                Save Preference
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
