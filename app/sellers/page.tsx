import { Metadata } from "next";
import { 
  Store, 
  Camera, 
  MessageCircle, 
  TrendingUp, 
  Package, 
  Star,
  Lightbulb,
  Target,
  Users,
  ChartBar,
  Zap,
  Shield
} from "lucide-react";

export const metadata: Metadata = {
  title: "Seller Resources - NearByt",
  description: "Tips and guides for successful selling on NearByt - Maximize your sales and grow your local business",
};

export default function SellerResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-zinc-900 mb-4">Seller Resources</h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Everything you need to succeed as a seller on NearByt - from listing tips to growth strategies
        </p>
      </div>

      {/* Educational Context */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-6 mb-8">
        <div className="flex items-start gap-4">
          <Lightbulb className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-indigo-900 mb-2">Learning Platform</h3>
            <p className="text-indigo-700 text-sm">
              These resources are designed to help you learn effective selling strategies. 
              Since NearByt is an educational platform, focus on building skills and understanding marketplace dynamics.
            </p>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 mb-8 shadow-lg">
        <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
          <Zap className="w-8 h-8" />
          Getting Started
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-zinc-900">Setting Up Your Profile</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Complete all profile information including bio and location</li>
              <li>• Add a clear, professional profile picture</li>
              <li>• Set up both WhatsApp and Messenger for maximum reach</li>
              <li>• Write a compelling bio that tells your story</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-zinc-900">First Listings</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Start with 5-10 high-quality products</li>
              <li>• Focus on items you know well</li>
              <li>• Price competitively based on market research</li>
              <li>• Test the platform before expanding inventory</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Product Photography */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 mb-8">
        <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
          <Camera className="w-8 h-8" />
          Product Photography Tips
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3">Lighting</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Use natural light when possible</li>
              <li>• Avoid harsh shadows and direct flash</li>
              <li>• Shoot near windows for soft lighting</li>
              <li>• Consider a lightbox for small items</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3">Composition</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Use clean, simple backgrounds</li>
              <li>• Show multiple angles of the product</li>
              <li>• Include scale references (coins, rulers)</li>
              <li>• Capture close-ups of important details</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3">Editing</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Enhance brightness and contrast</li>
              <li>• Crop to remove distractions</li>
              <li>• Keep colors accurate and natural</li>
              <li>• Don't over-edit or misrepresent items</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pricing Strategies */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 mb-8 shadow-lg">
        <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
          <ChartBar className="w-8 h-8" />
          Pricing Strategies
        </h2>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-50 rounded-2xl p-6">
              <h3 className="font-bold text-zinc-900 mb-3">Research Methods</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>• Check similar items on NearByt and other platforms</li>
                <li>• Consider original purchase price and condition</li>
                <li>• Factor in your time and any improvements made</li>
                <li>• Research seasonal demand patterns</li>
              </ul>
            </div>
            <div className="bg-zinc-50 rounded-2xl p-6">
              <h3 className="font-bold text-zinc-900 mb-3">Pricing Models</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>• Fixed pricing for standard items</li>
                <li>• Slightly higher prices for unique/rare items</li>
                <li>• Bundle pricing for related products</li>
                <li>• Leave room for negotiation when appropriate</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-zinc-50 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-900 mb-3">Common Mistakes to Avoid</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-zinc-600">
              <div>
                <p className="font-medium text-zinc-900 mb-2">Don't:</p>
                <ul className="space-y-1">
                  <li>• Price based on emotional attachment</li>
                  <li>• Ignore market research</li>
                  <li>• Set prices too low to attract buyers</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-zinc-900 mb-2">Do:</p>
                <ul className="space-y-1">
                  <li>• Update prices based on feedback</li>
                  <li>• Consider offering discounts for bundles</li>
                  <li>• Be transparent about pricing rationale</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Excellence */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 mb-8">
        <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
          <MessageCircle className="w-8 h-8" />
          Communication Excellence
        </h2>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3">Response Best Practices</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-zinc-900 mb-2">Speed Matters</h4>
                <ul className="space-y-1 text-sm text-zinc-600">
                  <li>• Respond within 24 hours</li>
                  <li>• Set expectations for response times</li>
                  <li>• Use quick replies for common questions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-zinc-900 mb-2">Quality Responses</h4>
                <ul className="space-y-1 text-sm text-zinc-600">
                  <li>• Be thorough and helpful</li>
                  <li>• Answer questions before they're asked</li>
                  <li>• Provide additional relevant information</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3">Professional Messaging</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Use proper grammar and spelling</li>
              <li>• Stay friendly but professional</li>
              <li>• Be honest about product condition and limitations</li>
              <li>• Guide buyers through the purchasing process</li>
              <li>• Follow up after successful transactions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Building Trust */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 mb-8 shadow-lg">
        <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
          <Shield className="w-8 h-8" />
          Building Trust & Reputation
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-zinc-900">Trust Signals</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Complete, detailed profiles</li>
              <li>• Consistent, positive communication</li>
              <li>• Accurate product descriptions</li>
              <li>• Prompt shipping or meeting arrangements</li>
              <li>• Encouraging buyer reviews and feedback</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-zinc-900">Reputation Building</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Start with smaller, lower-risk items</li>
              <li>• Go above and beyond in customer service</li>
              <li>• Handle issues professionally and quickly</li>
              <li>• Be transparent about any problems</li>
              <li>• Build relationships with repeat customers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Growth Strategies */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 mb-8">
        <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
          <TrendingUp className="w-8 h-8" />
          Growth Strategies
        </h2>
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-3">Product Expansion</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>• Analyze your best-selling categories</li>
                <li>• Expand into related product lines</li>
                <li>• Test new products with small quantities</li>
                <li>• Seasonal product planning</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-3">Marketing Tactics</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>• Share listings on social media</li>
                <li>• Create themed product bundles</li>
                <li>• Offer limited-time promotions</li>
                <li>• Build an email list of customers</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-3">Customer Retention</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>• Provide exceptional service</li>
                <li>• Follow up after purchases</li>
                <li>• Offer repeat customer discounts</li>
                <li>• Ask for reviews and testimonials</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 mb-8 shadow-lg">
        <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
          <Star className="w-8 h-8" />
          Success Metrics to Track
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-50 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-900 mb-3">Key Performance Indicators</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Number of inquiries per listing</li>
              <li>• Conversion rate (inquiries to sales)</li>
              <li>• Average response time</li>
              <li>• Customer satisfaction ratings</li>
              <li>• Repeat customer rate</li>
            </ul>
          </div>
          <div className="bg-zinc-50 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-900 mb-3">Improvement Areas</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Listing quality and completeness</li>
              <li>• Photo effectiveness</li>
              <li>• Description clarity</li>
              <li>• Pricing competitiveness</li>
              <li>• Communication efficiency</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tools & Resources */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 mb-8">
        <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
          <Package className="w-8 h-8" />
          Tools & Resources
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3">Photography Tools</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Smartphone camera with good lighting</li>
              <li>• Simple background setup (white poster board)</li>
              <li>• Free photo editing apps (Snapseed, VSCO)</li>
              <li>• Tripod for stable shots</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3">Business Management</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Spreadsheet for inventory tracking</li>
              <li>• Calendar for meeting scheduling</li>
              <li>• Notes app for customer preferences</li>
              <li>• Payment tracking system</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 text-center">
        <h2 className="text-2xl font-black mb-4">Ready to Start Selling?</h2>
        <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
          Apply these strategies and watch your NearByt business grow. Remember, success comes from 
          continuous learning and adapting to customer needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-white text-zinc-900 rounded-full font-black hover:bg-zinc-100 transition-colors">
            Go to Shop Manager
          </button>
          <button className="px-6 py-3 bg-zinc-800 text-white rounded-full font-black hover:bg-zinc-700 transition-colors">
            Browse Help Center
          </button>
        </div>
        <p className="text-sm text-zinc-400 mt-6">
          De La Salle John Bosco College • Supporting Student Entrepreneurs
        </p>
      </div>
    </div>
  );
}
