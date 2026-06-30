import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Heart, ShieldCheck, Users, ArrowRight, Activity, Globe, Box, Truck,
    Target, Sparkles, ChevronDown, ChevronUp, Send, MapPin, Mail, Phone,
    Sunrise, Layers, HeartHandshake
} from 'lucide-react';

const Landing = () => {
    // State to handle the interactive FAQ accordion
    const [openFAQ, setOpenFAQ] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    // Curated real-world physical community support slides for the image rotation system
    const slides = [
        {
            url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
            title: "Surplus Food Redistribution",
            desc: "Connecting community centers and local donors directly to shelters to minimize fresh food waste.",
            stat: "14,200+ Meals Routed"
        },
        {
            url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200",
            title: "Emergency Medical Logistics",
            desc: "Fast-tracking critical first-aid crates, diagnostic kits, and medical essentials to community groups.",
            stat: "3,800+ Care Kits Distributed"
        },
        {
            url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=1200",
            title: "Crisis Shelter Deployment",
            desc: "Sourcing and routing heavy winter blankets, clothing drives, and seasonal survival kits to vulnerable areas.",
            stat: "9,500+ Essentials Transferred"
        }
    ];

    // Core 2.5-second automatic image rotation interval ticker
    useEffect(() => {
        const rotationTimer = setInterval(() => {
            setActiveSlide((prevIndex) => (prevIndex + 1) % slides.length);
        }, 2500);
        return () => clearInterval(rotationTimer);
    }, [slides.length]);

    const faqs = [
        { question: "How does HopeConnect verify NGOs?", answer: "We require strict documentation including government registration, active field presence, and operational tracking history before an NGO can claim physical resources on our platform." },
        { question: "Can individuals donate food, or only businesses?", answer: "Both! While we focus heavily on bulk surplus from restaurants and event organizers to ensure efficiency, individual community donors can log extra unexpired food, blankets, or vital medical supplies directly through their dashboard." },
        { question: "How fast are resources matched and routed?", answer: "Once a donor logs a resource on our platform, our proximity smart matching system instantly alerts verified local shelters and NGOs, typically completing matches in under 15 minutes." },
        { question: "Are there any hidden fees or costs involved?", answer: "No. HopeConnect is a 100% non-monetary community utility. We do not collect payments, process financial donations, or charge transaction fees. Our platform is completely dedicated to direct physical resource coordination." }
    ];

    return (
        <div className="min-h-screen bg-[#0B1121] text-white font-sans overflow-hidden relative">
            
            {/* BACKGROUND EFFECTS: Modern fading grid and glowing orbs */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 -z-10"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-rose-500/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

            {/* TOP NAVBAR */}
            <nav className="flex justify-between items-center px-10 py-6 max-w-7xl mx-auto relative z-20">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <Sunrise className="text-[#FF3366] group-hover:rotate-45 transition duration-500" size={32} />
                    <div className="text-2xl font-black tracking-widest flex items-center gap-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500">HOPE</span>
                        <span className="text-white">CONNECT</span>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <Link to="/" className="hover:text-white transition">Home</Link>
                    <a href="#mission" className="hover:text-white transition">Mission</a>
                    <a href="#operations" className="hover:text-white transition">Operations</a>
                    <a href="#faq" className="hover:text-white transition">FAQ</a>
                    <Link to="/login" className="border border-slate-600 rounded-full px-6 py-2 hover:bg-slate-800 transition text-white">
                        LOGIN / REGISTER
                    </Link>
                </div>
            </nav>

            {/* 1. HERO SECTION */}
            <section className="relative py-20 px-6 text-center z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300 mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Platform is live and routing resources
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-extrabold tracking-tight mb-6 leading-tight">
                        Help Begins With A <br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300 italic">Single Step</span>
                    </h1>
                    <p className="text-lg md:text-xl mb-12 text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Welcome to HopeConnect — a place where compassion meets action. Join us in building stronger, kinder communities by routing surplus directly to those in need.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link to="/register" className="bg-[#FF3366] text-white font-bold text-sm tracking-wider py-4 px-10 rounded-full shadow-[0_0_20px_rgba(255,51,102,0.4)] hover:bg-[#ff1a53] hover:scale-105 transition duration-300">
                            JOIN HOPECONNECT
                        </Link>
                        <Link to="/login" className="bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 font-bold text-sm tracking-wider py-4 px-10 rounded-full hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition duration-300 flex items-center justify-center gap-2">
                            <Heart size={18} /> DONATE SUPPLIES
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. IMPACT STATS */}
            <section className="border-y border-slate-800 bg-slate-900/20 backdrop-blur-sm py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
                    <div>
                        <div className="text-4xl font-serif font-black text-white mb-2">1,240+</div>
                        <div className="text-sm tracking-wider text-slate-400 uppercase">Meals Rescued</div>
                    </div>
                    <div>
                        <div className="text-4xl font-serif font-black text-white mb-2">85</div>
                        <div className="text-sm tracking-wider text-slate-400 uppercase">Active NGOs</div>
                    </div>
                    <div>
                        <div className="text-4xl font-serif font-black text-white mb-2">4.2k</div>
                        <div className="text-sm tracking-wider text-slate-400 uppercase">Lives Impacted</div>
                    </div>
                    <div>
                        <div className="text-4xl font-serif font-black text-emerald-400 mb-2">100%</div>
                        <div className="text-sm tracking-wider text-emerald-400/70 uppercase">Verified Routing</div>
                    </div>
                </div>
            </section>

            {/* 3. OUR MISSION & INSPIRATION */}
            <section id="mission" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-sm font-bold text-[#FF3366] tracking-widest uppercase mb-2">Our Story</h2>
                        <h3 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight mb-6">The Inspiration</h3>
                        <p className="text-slate-400 leading-relaxed mb-6 text-lg">
                            Millions of tons of perfectly good food and vital resources are wasted every year due to logistical bottlenecks, while vulnerable communities remain in need. HopeConnect was born out of a simple, undeniable truth: the resources exist, but the bridge connecting them is broken.
                        </p>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            We were inspired by the tireless work of grassroots volunteers and decided to arm them with enterprise-grade logistics technology. We believe technology should serve humanity.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 p-10 rounded-3xl backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10"><Target size={120} /></div>
                        <Sparkles className="text-blue-400 mb-6" size={40} />
                        <h3 className="text-2xl font-serif font-bold text-white tracking-tight mb-4">Our Ultimate Goal</h3>
                        <p className="text-slate-300 leading-relaxed text-lg italic">
                            \"To create a zero-waste ecosystem where surplus resources are identified, claimed, and delivered within 60 minutes, ensuring no one sleeps hungry and no critical supply goes to waste.\"
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. THE PIPELINE */}
            <section className="py-24 px-6 max-w-7xl mx-auto relative z-10 bg-slate-900/20 rounded-3xl border border-slate-800/50">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-[#FF3366] tracking-widest uppercase mb-2">The Pipeline</h2>
                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">How We Route Hope</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm hover:border-slate-500 transition duration-300 group">
                        <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-rose-500 transition duration-300">
                            <Box className="text-rose-500" size={24} />
                        </div>
                        <h4 className="text-2xl font-serif font-bold text-white mb-3">1. Log Resources</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Donors and restaurants easily log surplus food or medical supplies onto our secure architecture ledger.</p>
                    </div>

                    <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm hover:border-slate-500 transition duration-300 group">
                        <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-blue-500 transition duration-300">
                            <Activity className="text-blue-500" size={24} />
                        </div>
                        <h4 className="text-2xl font-serif font-bold text-white mb-3">2. Smart Matching</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Our system instantly alerts verified NGOs and hospitals in the vicinity, creating a real-time match based on urgency.</p>
                    </div>

                    <div className="bg-slate-800/30 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm hover:border-slate-500 transition duration-300 group">
                        <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-emerald-500 transition duration-300">
                            <Truck className="text-emerald-500" size={24} />
                        </div>
                        <h4 className="text-2xl font-serif font-bold text-white mb-3">3. Secure Transit</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">End-to-end tracking ensures absolute accountability, safety, and transparency for every single donation until delivery.</p>
                    </div>
                </div>
            </section>

            {/* 5. CORE ECOSYSTEMS */}
            <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20 relative">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight relative inline-block">
                        <span className="absolute -inset-1 opacity-[0.03] text-7xl md:text-9xl -top-10 font-black text-white whitespace-nowrap left-1/2 -translate-x-1/2 pointer-events-none">
                            ECOSYSTEMS
                        </span>
                        Our Ecosystems
                    </h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-12 text-center mt-12 relative">
                    <div className="hidden md:block absolute top-auto bottom-0 left-[16.66%] right-[16.66%] h-px bg-slate-800 -z-10"></div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">Community First</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Our greatest strength is our people. Volunteers, donors, and partners come together to uplift those in need. We foster unity and compassion.
                        </p>
                        <div className="mt-8 flex justify-center"><div className="w-3 h-3 bg-[#FF3366] rounded-full shadow-[0_0_15px_rgba(255,51,102,0.8)] relative"><div className="absolute w-px h-16 bg-slate-800 top-3 left-1.5"></div></div></div>
                    </div>
                    
                    <div className="p-6 mt-12 md:mt-0">
                        <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">Safe and Reliable Aid</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Trust matters when offering or receiving help. We ensure transparency, verified beneficiaries, and secure donation handling for every initiative.
                        </p>
                        <div className="mt-8 flex justify-center"><div className="w-3 h-3 bg-[#00E676] rounded-full shadow-[0_0_15px_rgba(0,230,118,0.8)] relative"><div className="absolute w-px h-16 bg-slate-800 top-3 left-1.5"></div></div></div>
                    </div>
                    
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">Grow With Giving</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Our network rewards those who spread the word. The more we grow, the more people we can reach. Invite your friends and extend our impact.
                        </p>
                        <div className="mt-8 flex justify-center"><div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] relative"><div className="absolute w-px h-16 bg-slate-800 top-3 left-1.5"></div></div></div>
                    </div>
                </div>
            </section>

            {/* 6. NEW DYNAMIC IMPACT & ECOSYSTEM OPERATIONS SHOWCASE */}
            <section id="operations" className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-slate-800">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-bold text-emerald-400 tracking-widest uppercase mb-2">Logistics Framework</h2>
                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">Ecosystem Operations</h3>
                    <p className="text-slate-400 text-sm md:text-base">
                        HopeConnect maps real-time resource allocations directly to tracking networks without holding, collecting, or executing monetary transactions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* LEFT CONTAINER: Smooth Auto-playing Visual Stage (Switches every 2.5 seconds) */}
                    <div className="lg:col-span-7 relative h-[400px] md:h-[450px] rounded-3xl overflow-hidden border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                        {slides.map((item, index) => (
                            <div 
                                key={index}
                                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                                    index === activeSlide 
                                        ? 'opacity-100 scale-100 pointer-events-auto z-10' 
                                        : 'opacity-0 scale-105 pointer-events-none z-0'
                                }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/30 to-transparent z-10"></div>
                                <img 
                                    src={item.url} 
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700" 
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-20">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full tracking-wider uppercase mb-3">
                                        Active Supply Line
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 tracking-wide">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-300 text-sm max-w-xl font-light leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Slide Indicator Progress Pips */}
                        <div className="absolute top-6 right-6 flex gap-2 z-30">
                            {slides.map((_, index) => (
                                <div 
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                        index === activeSlide ? 'w-8 bg-emerald-400' : 'w-2 bg-slate-700'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT CONTAINER: Real-time Telemetry Control Block cards */}
                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                        {slides.map((item, index) => (
                            <div
                                key={index}
                                className={`flex-1 flex items-center gap-5 p-5 rounded-2xl border transition-all duration-500 ${
                                    index === activeSlide 
                                        ? 'bg-slate-900/60 border-emerald-500/30 text-white shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
                                        : 'bg-slate-950/20 border-slate-900/50 text-slate-500'
                                }`}
                            >
                                <div className={`p-3 rounded-xl shrink-0 ${
                                    index === activeSlide ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900 text-slate-600'
                                }`}>
                                    {index === 0 && <Layers size={20} />}
                                    {index === 1 && <Truck size={20} />}
                                    {index === 2 && <HeartHandshake size={20} />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className={`font-bold tracking-wide text-sm md:text-base truncate ${
                                            index === activeSlide ? 'text-white' : 'text-slate-400'
                                        }`}>
                                            {item.title}
                                        </h4>
                                        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                                            index === activeSlide ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-500'
                                        }`}>
                                            {item.stat}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed truncate">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. FREQUENTLY ASKED QUESTIONS */}
            <section id="faq" className="py-24 px-6 max-w-3xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">Got Questions?</h3>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden">
                            <button 
                                onClick={() => toggleFAQ(index)} 
                                className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-800/50 transition focus:outline-none"
                            >
                                <span className="font-bold text-white text-lg">{faq.question}</span>
                                {openFAQ === index ? <ChevronUp className="text-emerald-400 flex-shrink-0" /> : <ChevronDown className="text-slate-400 flex-shrink-0" />}
                            </button>
                            {openFAQ === index && (
                                <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-slate-700 mt-2">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* 8. CONTACT US */}
            <section id="donate" className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-slate-800">
                <div className="grid md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-sm font-bold text-[#FF3366] tracking-widest uppercase mb-2">Get in touch</h2>
                        <h3 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight mb-8">Let's build a better world, together.</h3>
                        <p className="text-slate-400 mb-8 leading-relaxed text-lg">Whether you are a large restaurant chain looking to partner, an NGO seeking verification, or a kind soul wanting to volunteer—we want to hear from you.</p>
                        
                        <div className="space-y-6 text-slate-300">
                            <div className="flex items-center gap-4"><Mail className="text-[#FF3366]" /> <span>partnerships@hopeconnect.org</span></div>
                            <div className="flex items-center gap-4"><Phone className="text-emerald-400" /> <span>+91 98765 43210 (24/7 Support)</span></div>
                            <div className="flex items-center gap-4"><MapPin className="text-blue-500" /> <span>Innovation Hub, Tech City, India</span></div>
                        </div>
                    </div>

                    <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-2xl backdrop-blur-sm">
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-2 gap-5">
                                <input type="text" placeholder="First Name" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                                <input type="text" placeholder="Last Name" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                            </div>
                            <input type="email" placeholder="Email Address" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
                            <textarea placeholder="How can we help you?" rows="4" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 resize-none"></textarea>
                            <button className="w-full bg-gradient-to-r from-blue-600 to-[#FF3366] hover:opacity-90 text-white font-bold py-4 rounded-lg transition duration-300 flex items-center justify-center gap-2">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* 9. FOOTER */}
            <footer className="border-t border-slate-800 bg-[#070b14] pt-16 pb-8 px-6 relative z-10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2">
                        <div className="text-2xl font-black tracking-widest flex items-center gap-2 mb-6">
                            <Sunrise className="text-[#FF3366]" size={28} />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-blue-500">HOPE</span>
                            <span className="text-white">CONNECT</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                            Bridging the gap between surplus and survival. We build scalable logistics technology to eliminate waste and support communities worldwide.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Platform</h4>
                        <ul className="space-y-4 text-slate-500 text-sm">
                            <li><Link to="/login" className="hover:text-rose-400 transition">Login</Link></li>
                            <li><Link to="/register" className="hover:text-rose-400 transition">Register NGO</Link></li>
                            <li><Link to="/register" className="hover:text-rose-400 transition">Become a Donor</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact</h4>
                        <ul className="space-y-4 text-slate-500 text-sm">
                            <li>support@hopeconnect.org</li>
                            <li>+91 98765 43210</li>
                            <li>Innovation Hub, Tech City</li>
                        </ul>
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
                    <p>© 2026 HopeConnect. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-slate-400 transition">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-400 transition">Terms of Service</a>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Landing;