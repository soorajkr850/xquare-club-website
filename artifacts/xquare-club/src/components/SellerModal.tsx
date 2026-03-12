import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MessageCircle } from "lucide-react";
import { Button } from "./Button";

interface SellerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SellerModal({ isOpen, onClose }: SellerModalProps) {
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-card border border-card-border shadow-2xl pointer-events-auto"
            >
              {/* Subtle top gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>

              <div className="p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 pr-6">
                  Get Your Business Listed on XQUARE CLUB
                </h3>
                
                <p className="text-lg mb-8">
                  Want to showcase your products on XQUARE CLUB and explore collaboration opportunities with influencers? Connect with us to know more about seller onboarding, product listing, and how your business can benefit from the platform.
                </p>

                <div className="bg-navy-dark rounded-xl p-6 mb-8 border border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-white/60 mb-1">Call / WhatsApp</p>
                    <p className="font-display text-xl font-bold text-white">+1 (555) 123-4567</p>
                  </div>
                </div>

                <p className="text-sm text-center text-white/50 mb-8 italic">
                  Our team will guide you through the next steps for getting listed on the platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                    Close
                  </Button>
                  <Button 
                    variant="primary" 
                    className="w-full sm:w-auto flex items-center gap-2"
                    onClick={() => window.location.href = "tel:+15551234567"}
                  >
                    <MessageCircle size={18} />
                    Contact Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
