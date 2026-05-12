import { Metadata } from "next";
import { 
  FileText, 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Scale,
  Eye
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Use - NearByt",
  description: "NearByt Terms of Use and Service Agreement - Educational platform guidelines and user responsibilities",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-zinc-900 mb-4">Terms of Use</h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Guidelines and responsibilities for using NearByt educational marketplace platform
        </p>
      </div>

      {/* Educational Notice */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-6 mb-8">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-indigo-900 mb-2">Educational Platform Agreement</h3>
            <p className="text-indigo-700 text-sm">
              NearByt is an educational project created by students for learning purposes. 
              These terms govern your use of this demonstration platform.
            </p>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-6 mb-8">
        <div className="flex items-center gap-3 text-zinc-600">
          <Calendar className="w-5 h-5" />
          <span className="font-medium">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Agreement Content */}
      <div className="space-y-8">
        {/* Introduction */}
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-lg">
          <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
            <FileText className="w-8 h-8" />
            Introduction & Acceptance
          </h2>
          <div className="space-y-4 text-zinc-600">
            <p>
              Welcome to NearByt, an educational marketplace platform developed by students at De La Salle John Bosco College. 
              By accessing or using NearByt, you agree to comply with and be bound by the following Terms of Use.
            </p>
            <div className="bg-zinc-50 rounded-2xl p-6">
              <h3 className="font-bold text-zinc-900 mb-3">Platform Purpose</h3>
              <ul className="space-y-2 text-sm">
                <li>• NearByt is an educational project for learning web development and marketplace concepts</li>
                <li>• The platform does not process real payments or handle sensitive financial data</li>
                <li>• All features and functionalities are for demonstration and testing purposes</li>
                <li>• User data may be used for educational analysis and platform improvement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8">
          <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
            <Users className="w-8 h-8" />
            User Responsibilities
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-3">Account Requirements</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>• You must be at least 13 years old to create an account</li>
                <li>• Provide accurate and complete registration information</li>
                <li>• Maintain the security of your login credentials</li>
                <li>• You are responsible for all activities under your account</li>
                <li>• One account per person is permitted</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-3">Content Standards</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>• Post only content you have the right to share</li>
                <li>• Provide accurate and honest product descriptions</li>
                <li>• Do not post misleading, fraudulent, or deceptive content</li>
                <li>• Respect intellectual property rights of others</li>
                <li>• Use appropriate images and language in all communications</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-3">Prohibited Activities</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>• Attempting to gain unauthorized access to the platform</li>
                <li>• Using automated tools to scrape data or overwhelm the system</li>
                <li>• Interfering with other users' experience</li>
                <li>• Engaging in harassment, abuse, or threatening behavior</li>
                <li>• Violating applicable laws or regulations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-lg">
          <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
            <Shield className="w-8 h-8" />
            Privacy & Data Protection
          </h2>
          <div className="space-y-4 text-zinc-600">
            <div className="bg-zinc-50 rounded-2xl p-6">
              <h3 className="font-bold text-zinc-900 mb-3">Data Collection</h3>
              <ul className="space-y-2 text-sm">
                <li>• We collect information necessary for platform functionality</li>
                <li>• Personal data includes name, email, and profile information</li>
                <li>• Platform usage data helps improve the educational experience</li>
                <li>• Communication data may be stored for platform improvement</li>
              </ul>
            </div>
            
            <div className="bg-zinc-50 rounded-2xl p-6">
              <h3 className="font-bold text-zinc-900 mb-3">Data Usage</h3>
              <ul className="space-y-2 text-sm">
                <li>• Data is used to provide and improve platform services</li>
                <li>• Anonymized data may be used for educational research</li>
                <li>• We do not sell personal information to third parties</li>
                <li>• Data may be shared with educational institutions for learning purposes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Platform Rules */}
        <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8">
          <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
            <Scale className="w-8 h-8" />
            Platform-Specific Rules
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-3">Buying Guidelines</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>• All transactions are educational demonstrations</li>
                <li>• No real payments or financial exchanges occur on the platform</li>
                <li>• Coordinate payment and delivery directly with sellers</li>
                <li>• Practice safe meeting and transaction habits</li>
                <li>• Report suspicious or inappropriate behavior</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-3">Selling Guidelines</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>• List only items you legally own or have rights to sell</li>
                <li>• Provide accurate descriptions and condition information</li>
                <li>• Respond promptly and professionally to inquiries</li>
                <li>• Do not list prohibited items (weapons, illegal substances, etc.)</li>
                <li>• Maintain professional communication with all users</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-3">Communication Standards</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>• Use platform messaging for initial communications</li>
                <li>• Maintain respectful and professional language</li>
                <li>• Do not share excessive personal information</li>
                <li>• Report harassment or inappropriate behavior immediately</li>
                <li>• Do not use the platform for spam or unsolicited marketing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-lg">
          <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
            <Eye className="w-8 h-8" />
            Intellectual Property
          </h2>
          <div className="space-y-4 text-zinc-600">
            <p>
              NearByt and its original content, features, and functionality are owned by the student developers 
              and are protected by international copyright, trademark, patent, trade secret, and other intellectual 
              property or proprietary rights laws.
            </p>
            <div className="bg-zinc-50 rounded-2xl p-6">
              <h3 className="font-bold text-zinc-900 mb-3">User-Generated Content</h3>
              <ul className="space-y-2 text-sm">
                <li>• You retain ownership of content you post on NearByt</li>
                <li>• You grant us license to use your content for platform operation</li>
                <li>• You represent you have the right to post all content you share</li>
                <li>• We may remove content that violates these terms</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8">
          <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8" />
            Disclaimers & Limitations
          </h2>
          <div className="space-y-4 text-zinc-600">
            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-3">Educational Platform Disclaimer</h3>
              <ul className="space-y-2 text-sm">
                <li>• NearByt is provided "as is" for educational purposes</li>
                <li>• We do not guarantee uninterrupted or error-free service</li>
                <li>• The platform may be temporarily unavailable for maintenance</li>
                <li>• Features and functionality may change without notice</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-3">No Financial Transactions</h3>
              <ul className="space-y-2 text-sm">
                <li>• NearByt does not process payments or handle financial data</li>
                <li>• All monetary transactions occur outside the platform</li>
                <li>• We are not responsible for payment disputes or issues</li>
                <li>• Users exercise transactions at their own risk</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-lg">
          <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
            <Users className="w-8 h-8" />
            Account Termination
          </h2>
          <div className="space-y-4 text-zinc-600">
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms of Use. 
              Users may also terminate their accounts at any time through their account settings.
            </p>
            <div className="bg-zinc-50 rounded-2xl p-6">
              <h3 className="font-bold text-zinc-900 mb-3">Grounds for Termination</h3>
              <ul className="space-y-2 text-sm">
                <li>• Repeated violations of these Terms of Use</li>
                <li>• Fraudulent or deceptive activities</li>
                <li>• Harassment or abuse of other users</li>
                <li>• Attempts to compromise platform security</li>
                <li>• Violation of applicable laws or regulations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8">
          <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            Changes to Terms
          </h2>
          <div className="space-y-4 text-zinc-600">
            <p>
              We may update these Terms of Use periodically to reflect changes in our practices, 
              legal requirements, or for other operational reasons. Continued use of NearByt after 
              such changes constitutes acceptance of the updated terms.
            </p>
            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h3 className="font-bold text-zinc-900 mb-3">Notification of Changes</h3>
              <ul className="space-y-2 text-sm">
                <li>• Significant changes will be announced on the platform</li>
                <li>• The "Last Updated" date will reflect the most recent changes</li>
                <li>• Users are responsible for reviewing updated terms periodically</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-lg">
          <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
            <Users className="w-8 h-8" />
            Contact & Questions
          </h2>
          <div className="space-y-4 text-zinc-600">
            <p>
              If you have questions about these Terms of Use or need to report violations, 
              please contact us through the Help Center or direct messaging features within the platform.
            </p>
            <div className="bg-zinc-50 rounded-2xl p-6">
              <h3 className="font-bold text-zinc-900 mb-3">Educational Context</h3>
              <p className="text-sm">
                NearByt is developed and maintained by BSIT2 students at De La Salle John Bosco College 
                as part of their educational curriculum. Your feedback and reports help us learn and improve.
              </p>
            </div>
          </div>
        </div>

        {/* Agreement Confirmation */}
        <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8" />
            <h2 className="text-2xl font-black">Agreement Confirmation</h2>
          </div>
          <p className="text-zinc-300 mb-6">
            By using NearByt, you acknowledge that you have read, understood, and agree to be bound 
            by these Terms of Use as part of this educational platform experience.
          </p>
          <div className="text-sm text-zinc-400">
            <p>De La Salle John Bosco College</p>
            <p>BSIT2 Student Project</p>
            <p>Educational Marketplace Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}
