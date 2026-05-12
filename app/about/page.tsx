import { Metadata } from "next";
import { BookOpen, Users, Target, Code2, Heart, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - NearByt",
  description: "Learn about NearByt - A student project connecting local communities through technology",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <div className="w-8 h-8 bg-white rounded-sm rotate-45"></div>
        </div>
        <h1 className="text-4xl font-black text-zinc-900 mb-4">About NearByt</h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          A student-driven project connecting local communities through technology and innovation
        </p>
      </div>

      {/* Our Story */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 mb-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <BookOpen className="w-8 h-8 text-zinc-900" />
          <h2 className="text-2xl font-black text-zinc-900">Our Story</h2>
        </div>
        <div className="space-y-4 text-zinc-600 leading-relaxed">
          <p>
            NearByt began as a passionate project by 2nd year BSIT students from De La Salle John Bosco College. 
            What started as an opportunity to practice our programming skills evolved into something much more meaningful.
          </p>
          <p>
            We wanted to create something that wasn't just technically challenging, but also genuinely useful for communities. 
            The name "NearByt" reflects our core belief: helping people discover sellers and products that are close to home, 
            while building connections that matter.
          </p>
          <p>
            This platform represents our journey from classroom concepts to practical implementation - a testament to what 
            students can achieve when they combine technical knowledge with creative vision.
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Target className="w-8 h-8 text-zinc-900" />
          <h2 className="text-2xl font-black text-zinc-900">Our Mission</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-bold text-zinc-900">Educational Growth</h3>
            <p className="text-zinc-600">
              To bridge the gap between academic learning and real-world application, 
              giving students hands-on experience in web development, user experience design, 
              and project management.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-zinc-900">Community Connection</h3>
            <p className="text-zinc-600">
              To create a platform that strengthens local communities by making it easier 
              to discover and support nearby sellers and products.
            </p>
          </div>
        </div>
      </div>

      {/* What We've Learned */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 mb-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <GraduationCap className="w-8 h-8 text-zinc-900" />
          <h2 className="text-2xl font-black text-zinc-900">Skills We've Developed</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-zinc-50 rounded-2xl">
            <Code2 className="w-8 h-8 text-zinc-900 mx-auto mb-3" />
            <h3 className="font-bold text-zinc-900 mb-2">Technical Skills</h3>
            <p className="text-sm text-zinc-600">
              Next.js, TypeScript, Supabase, Tailwind CSS, React, 
              and modern web development practices
            </p>
          </div>
          <div className="text-center p-6 bg-zinc-50 rounded-2xl">
            <Users className="w-8 h-8 text-zinc-900 mx-auto mb-3" />
            <h3 className="font-bold text-zinc-900 mb-2">Client Activities</h3>
            <p className="text-sm text-zinc-600">
              User experience design, requirement gathering, 
              client communication, and project planning
            </p>
          </div>
          <div className="text-center p-6 bg-zinc-50 rounded-2xl">
            <Target className="w-8 h-8 text-zinc-900 mx-auto mb-3" />
            <h3 className="font-bold text-zinc-900 mb-2">Strategic Thinking</h3>
            <p className="text-sm text-zinc-600">
              Problem-solving, creative solutions, 
              documentation, and practical decision-making
            </p>
          </div>
        </div>
      </div>

      {/* Project Disclaimer */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Heart className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-black text-indigo-600">Educational Project</h2>
        </div>
        <div className="space-y-4 text-indigo-700">
          <p className="font-medium">
            NearByt is an educational project created for learning and demonstration purposes.
          </p>
          <div className="space-y-2 text-sm">
            <p>• This platform does not handle real payments or sensitive financial data</p>
            <p>• All user data is for testing and educational purposes only</p>
            <p>• The system demonstrates modern web development capabilities</p>
            <p>• Features may evolve as we continue learning and improving</p>
          </div>
          <p className="text-sm mt-4">
            We welcome feedback and suggestions as part of our learning journey!
          </p>
        </div>
      </div>

      {/* Future Vision */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <Target className="w-8 h-8 text-zinc-900" />
          <h2 className="text-2xl font-black text-zinc-900">Looking Forward</h2>
        </div>
        <div className="space-y-4 text-zinc-600">
          <p>
            While NearByt started as a student project, we're excited about the possibilities it represents. 
            The skills we've developed and the lessons we've learned will guide us in creating real-world applications 
            that make a genuine difference in people's lives.
          </p>
          <p>
            This project is our foundation - the first step in a journey toward becoming developers who can 
            build meaningful, user-focused solutions for tomorrow's challenges.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="text-center mt-12 p-8 bg-zinc-50 rounded-[2.5rem]">
        <h3 className="text-xl font-black text-zinc-900 mb-4">Get in Touch</h3>
        <p className="text-zinc-600 mb-6">
          We're always open to feedback, suggestions, and collaboration opportunities!
        </p>
        <div className="text-sm text-zinc-500">
          <p>De La Salle John Bosco College</p>
          <p>BSIT2 Students</p>
        </div>
      </div>
    </div>
  );
}
