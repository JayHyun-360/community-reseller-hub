import { Metadata } from "next";
import {
  Shield,
  Users,
  Eye,
  Lock,
  MapPin,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Phone,
  UserCheck,
  Camera,
  Store,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safety Guidelines - NearByt",
  description:
    "Stay safe while using NearByt - Tips for secure buying and selling in our community marketplace",
};

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-zinc-900 mb-4">
          Safety Guidelines
        </h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Your guide to staying safe while connecting with local sellers and
          buyers in our community
        </p>
      </div>

      {/* Educational Notice */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-6 mb-8">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-indigo-900 mb-2">
              Educational Platform Notice
            </h3>
            <p className="text-indigo-700 text-sm">
              NearByt is a learning environment. While we provide these safety
              guidelines, always exercise caution when interacting with others
              online, even on educational platforms.
            </p>
          </div>
        </div>
      </div>

      {/* General Safety Principles */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 mb-8 shadow-lg">
        <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
          <Shield className="w-8 h-8" />
          General Safety Principles
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 mb-2">
                Trust Your Instincts
              </h3>
              <p className="text-sm text-zinc-600">
                If something feels wrong, it probably is. Don't proceed with
                transactions that make you uncomfortable.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 mb-2">Stay Public</h3>
              <p className="text-sm text-zinc-600">
                Meet in public places, tell friends where you're going, and
                bring someone with you if possible.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 mb-2">Verify First</h3>
              <p className="text-sm text-zinc-600">
                Check profiles, read reviews, and communicate through the
                platform before meeting.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 mb-2">
                Protect Information
              </h3>
              <p className="text-sm text-zinc-600">
                Never share passwords, financial details, or excessive personal
                information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* For Buyers */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 mb-8">
        <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
          <UserCheck className="w-8 h-8" />
          For Buyers
        </h2>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-zinc-600" />
              Meeting Locations
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>
                • Choose public, well-lit locations (coffee shops, malls, police
                stations)
              </li>
              <li>• Avoid meeting at private homes or isolated areas</li>
              <li>• Consider bringing a friend or family member</li>
              <li>
                • Tell someone where you're going and when you expect to return
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-zinc-600" />
              Before Buying
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Ask for additional photos or videos of the item</li>
              <li>• Research the item's typical market value</li>
              <li>• Read the seller's profile and any available reviews</li>
              <li>• Ask specific questions about the item's condition</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-zinc-600" />
              Red Flags
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Prices that seem too good to be true</li>
              <li>• Sellers who refuse to meet in person</li>
              <li>• Pressure to pay before seeing the item</li>
              <li>• Requests for wire transfers or unusual payment methods</li>
              <li>• Poor grammar or suspicious communication patterns</li>
            </ul>
          </div>
        </div>
      </div>

      {/* For Sellers */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 mb-8 shadow-lg">
        <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
          <Store className="w-8 h-8" />
          For Sellers
        </h2>
        <div className="space-y-6">
          <div className="bg-zinc-50 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <Camera className="w-5 h-5 text-zinc-600" />
              Listing Best Practices
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Take clear, recent photos of actual items</li>
              <li>• Be honest about item condition and any defects</li>
              <li>• Include detailed measurements and specifications</li>
              <li>• Set fair, realistic prices based on market research</li>
            </ul>
          </div>

          <div className="bg-zinc-50 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-zinc-600" />
              Communication Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Respond promptly and professionally to inquiries</li>
              <li>• Keep all communication on the platform initially</li>
              <li>• Be clear about meeting arrangements and timing</li>
              <li>• Don't share personal contact information too early</li>
            </ul>
          </div>

          <div className="bg-zinc-50 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-zinc-600" />
              Transaction Safety
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Meet in safe, public locations</li>
              <li>• Verify payment before handing over items</li>
              <li>• Keep receipts or proof of transaction</li>
              <li>• Trust your instincts about buyer behavior</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Digital Safety */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 mb-8">
        <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
          <Lock className="w-8 h-8" />
          Digital Safety
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3">Account Security</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Use strong, unique passwords</li>
              <li>• Enable two-factor authentication when available</li>
              <li>• Log out when using shared devices</li>
              <li>• Regularly review your account activity</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3">Privacy Protection</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>• Don't share home addresses publicly</li>
              <li>• Be selective about personal information shared</li>
              <li>• Use platform messaging instead of personal contacts</li>
              <li>• Report suspicious accounts immediately</li>
            </ul>
          </div>
        </div>
      </div>

      {/* What to Avoid */}
      <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-8 mb-8">
        <h2 className="text-2xl font-black text-red-900 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8" />
          What to Avoid
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-red-800">Payment Scams</h3>
            <ul className="space-y-2 text-sm text-red-700">
              <li>• Wire transfers or money orders</li>
              <li>• Gift cards as payment method</li>
              <li>• Requests for payment verification codes</li>
              <li>• Deposits for items you haven't seen</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-red-800">Phishing Attempts</h3>
            <ul className="space-y-2 text-sm text-red-700">
              <li>• Fake emails asking for login details</li>
              <li>• Suspicious links in messages</li>
              <li>• Requests for verification codes</li>
              <li>• Urgent account suspension warnings</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reporting Issues */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 mb-8 shadow-lg">
        <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8" />
          Reporting Issues
        </h2>
        <div className="space-y-4 text-zinc-600">
          <p>
            If you encounter suspicious activity, scams, or feel unsafe during
            any interaction:
          </p>
          <div className="bg-zinc-50 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-900 mb-3">Immediate Actions</h3>
            <ul className="space-y-2 text-sm">
              <li>• Stop communication with the suspicious user</li>
              <li>• Block the user on the platform</li>
              <li>• Report the user to platform administrators</li>
              <li>• If in immediate danger, contact local authorities</li>
            </ul>
          </div>
          <div className="bg-zinc-50 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-900 mb-3">What to Report</h3>
            <ul className="space-y-2 text-sm">
              <li>• Fake listings or misleading descriptions</li>
              <li>• Requests for inappropriate payments</li>
              <li>• Harassment or threatening behavior</li>
              <li>• Attempts to move conversations off-platform too quickly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8">
        <h2 className="text-2xl font-black mb-6">Emergency Contacts</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Emergency Services
            </h3>
            <p className="text-zinc-300 text-sm">
              In the Philippines: Dial 911 for police, fire, or medical
              emergencies
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Platform Support
            </h3>
            <p className="text-zinc-300 text-sm">
              Report issues through our Help Center or contact platform
              administrators
            </p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
          <p className="text-sm text-zinc-400">
            Remember: Your safety is our priority. When in doubt, trust your
            instincts and prioritize your well-being.
          </p>
        </div>
      </div>
    </div>
  );
}
