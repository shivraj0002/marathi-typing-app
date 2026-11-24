import Link from "next/link";
import { Header } from "@/components/common/Header";
import {
  GraduationCap,
  Zap,
  Award,
  Stethoscope,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/** Landing dashboard introducing the 6-stage InScript academy, Sprint, Exam Simulator, and Clinic. */
export default function HomePage() {
  const features = [
    {
      title: "६ टप्प्यांचा इन्स्क्रिप्ट अभ्यासक्रम",
      desc: "होम रो ते जोडनिबंध, मराठी साहित्य आणि ९५% अचूकता प्रगती प्रणाली.",
      href: "/academy",
      icon: GraduationCap,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
      cta: "अभ्यासक्रम सुरू करा",
    },
    {
      title: "स्पीड स्प्रिंट (Speed Sprint)",
      desc: "मंकीटाइप स्टाईल १५, ३०, ६० सेकंदांचा विचलित-मुक्त टायपिंग सराव.",
      href: "/sprint",
      icon: Zap,
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
      cta: "स्प्रिंट खेळा",
    },
    {
      title: "GCC-TBC परीक्षा सिम्युलेटर",
      desc: "अधिकृत शासकीय निकष: ३० आणि ४० WPM टेस्ट, अचूकता तपासणी व प्रमाणपत्र.",
      href: "/exam",
      icon: Award,
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
      cta: "परीक्षा द्या",
    },
    {
      title: "वीक की क्लिनिक (Adaptive Drill)",
      desc: "आपल्या सर्वाधिक चुकणाऱ्या अक्षरांचा स्वयंचलित विश्लेषणात्मक सराव.",
      href: "/clinic",
      icon: Stethoscope,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
      cta: "क्लिनिकमध्ये जा",
    },
  ];

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12 flex-1 w-full flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> इंग्रजी कीबोर्डवर मराठी इन्स्क्रिप्ट शिका
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            मराठी टायपिंग शिका, <span className="text-emerald-400">जलद आणि अचूक!</span>
          </h1>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            कोणतीही लँग्वेज सेटिंग न बदलता थेट ब्राउझरमध्ये टाईप करा. रंगीत बोटांचे मार्गदर्शन,
            ध्वनी प्रभाव आणि शासकीय परीक्षा तयारी एकाच ठिकाणी.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/academy"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
            >
              सराव सुरू करा (Start Learning) <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/exam"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl flex items-center gap-2 transition"
            >
              <Award className="w-4 h-4 text-amber-400" /> GCC-TBC टेस्ट
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.href}
                className={`p-6 rounded-2xl border bg-gradient-to-br ${f.color} flex flex-col justify-between`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">{f.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{f.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href={f.href}
                    className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1 group"
                  >
                    {f.cta} <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
