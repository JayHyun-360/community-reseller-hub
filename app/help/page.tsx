import { Metadata } from "next";
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Heart, 
  Store, 
  User, 
  Shield,
  Settings,
  Camera,
  MapPin,
  Phone
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center - NearByt",
  description: "Get help with NearByt - FAQs, tutorials, and support for our community marketplace",
};

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-zinc-900 mb-4">Help Center</h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Everything you need to know about using NearByt to discover and connect with local sellers
        </p>
      </div>

      {/* Educational Notice */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-6 mb-8">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-indigo-900 mb-2">Educational Project Notice</h3>
            <p className="text-indigo-700 text-sm">
              NearByt is an educational platform for learning purposes. No real payments or sensitive data are handled. 
              All features are for demonstration and testing.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <button className="p-6 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-300 transition-colors text-left">
          <Search className="w-8 h-8 text-zinc-900 mb-3" />
          <h3 className="font-bold text-zinc-900 mb-2">Getting Started</h3>
          <p className="text-sm text-zinc-600">Learn the basics of NearByt</p>
        </button>
        <button className="p-6 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-300 transition-colors text-left">
          <Store className="w-8 h-8 text-zinc-900 mb-3" />
          <h3 className="font-bold text-zinc-900 mb-2">For Sellers</h3>
          <p className="text-sm text-zinc-600">Set up your shop and list products</p>
        </button>
        <button className="p-6 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-300 transition-colors text-left">
          <User className="w-8 h-8 text-zinc-900 mb-3" />
          <h3 className="font-bold text-zinc-900 mb-2">Account Help</h3>
          <p className="text-sm text-zinc-600">Manage your profile and settings</p>
        </button>
      </div>

      {/* FAQ Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-black text-zinc-900">Frequently Asked Questions</h2>
        
        {/* Getting Started */}
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden">
          <div className="p-6 bg-zinc-50 border-b border-zinc-100">
            <h3 className="text-lg font-black text-zinc-900 flex items-center gap-3">
              <Search className="w-5 h-5" />
              Getting Started
            </h3>
          </div>
          <div className="divide-y divide-zinc-100">
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">What is NearByt?</h4>
              <p className="text-zinc-600">
                NearByt is an educational marketplace platform that connects buyers with local sellers. 
                It's built by students to demonstrate modern web development skills and community-building concepts.
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">How do I create an account?</h4>
              <p className="text-zinc-600">
                Click "Become a Seller" or navigate to the login page. You can sign up using Google or GitHub OAuth. 
                Once registered, you can set up your profile and start exploring or selling.
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">Is NearByt free to use?</h4>
              <p className="text-zinc-600">
                Yes! NearByt is completely free as it's an educational project. There are no fees for buying, 
                selling, or using any features on the platform.
              </p>
            </div>
          </div>
        </div>

        {/* Buying & Browsing */}
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden">
          <div className="p-6 bg-zinc-50 border-b border-zinc-100">
            <h3 className="text-lg font-black text-zinc-900 flex items-center gap-3">
              <Heart className="w-5 h-5" />
              Buying & Browsing
            </h3>
          </div>
          <div className="divide-y divide-zinc-100">
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">How do I search for products?</h4>
              <p className="text-zinc-600">
                Use the search bar at the top or browse by categories on the Explore page. 
                You can filter by location, category, and price range to find exactly what you're looking for.
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">How do I contact a seller?</h4>
              <p className="text-zinc-600">
                Click the "Message" button on any product. You can choose between Messenger or WhatsApp 
                based on your preference. The system will remember your choice for future interactions.
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">What do the heart icons mean?</h4>
              <p className="text-zinc-600">
                Clicking the heart saves a product to your favorites. This helps you keep track of items 
                you're interested in and makes it easy to find them later.
              </p>
            </div>
          </div>
        </div>

        {/* Selling */}
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden">
          <div className="p-6 bg-zinc-50 border-b border-zinc-100">
            <h3 className="text-lg font-black text-zinc-900 flex items-center gap-3">
              <Store className="w-5 h-5" />
              Selling
            </h3>
          </div>
          <div className="divide-y divide-zinc-100">
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">How do I become a seller?</h4>
              <p className="text-zinc-600">
                After creating an account, go to your Account Settings and complete your profile. 
                Add your contact information (WhatsApp and/or Messenger), location, and a profile picture.
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">How do I list a product?</h4>
              <p className="text-zinc-600">
                Navigate to your Shop Manager dashboard and click "Add New Product." Fill in the details, 
                upload photos, set your price, and publish your listing.
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">What information should I include in my listings?</h4>
              <p className="text-zinc-600">
                Include clear photos, detailed descriptions, accurate pricing, and your location. 
                Good descriptions help buyers make informed decisions and build trust.
              </p>
            </div>
          </div>
        </div>

        {/* Account & Settings */}
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden">
          <div className="p-6 bg-zinc-50 border-b border-zinc-100">
            <h3 className="text-lg font-black text-zinc-900 flex items-center gap-3">
              <Settings className="w-5 h-5" />
              Account & Settings
            </h3>
          </div>
          <div className="divide-y divide-zinc-100">
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">How do I change my messaging preference?</h4>
              <p className="text-zinc-600">
                Go to Account Settings → Messaging Settings → Configure. You can choose between 
                Facebook Messenger and WhatsApp as your preferred contact method.
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">Can I change my username?</h4>
              <p className="text-zinc-600">
                Yes, you can update your username and other profile information in Account Settings. 
                Your changes are saved immediately.
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">How do I set my location?</h4>
              <p className="text-zinc-600">
                In Account Settings, use the location search field to find and set your address. 
                This helps buyers discover products near them.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Issues */}
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden">
          <div className="p-6 bg-zinc-50 border-b border-zinc-100">
            <h3 className="text-lg font-black text-zinc-900 flex items-center gap-3">
              <Shield className="w-5 h-5" />
              Technical Issues
            </h3>
          </div>
          <div className="divide-y divide-zinc-100">
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">Why can't I make payments?</h4>
              <p className="text-zinc-600">
                NearByt doesn't handle real payments as it's an educational project. 
                All transactions are coordinated directly between buyers and sellers through messaging.
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">My images aren't uploading correctly</h4>
              <p className="text-zinc-600">
                Make sure your images are in supported formats (JPG, PNG) and under 5MB. 
                Try clearing your browser cache or using a different browser if issues persist.
              </p>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-zinc-900 mb-2">Is my data secure?</h4>
              <p className="text-zinc-600">
                While this is a learning environment, we implement standard security practices. 
                However, avoid sharing sensitive personal or financial information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-12 bg-zinc-50 rounded-[2.5rem] p-8 text-center">
        <h3 className="text-xl font-black text-zinc-900 mb-4">Still Need Help?</h3>
        <p className="text-zinc-600 mb-6">
          We're students learning and improving every day. Your feedback helps us grow!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-zinc-900 text-white rounded-full font-black hover:bg-zinc-800 transition-colors">
            Send Feedback
          </button>
          <button className="px-6 py-3 bg-white border border-zinc-200 rounded-full font-black hover:bg-zinc-50 transition-colors">
            Report an Issue
          </button>
        </div>
        <p className="text-sm text-zinc-500 mt-6">
          De La Salle John Bosco College • BSIT2 Student Project
        </p>
      </div>
    </div>
  );
}
