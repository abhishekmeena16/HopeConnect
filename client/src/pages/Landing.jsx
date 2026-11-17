// client/src/pages/Landing.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    HeartHandshake, ArrowRight, Activity, Box, Truck,
    Target, Sparkles, ChevronDown, ChevronUp, Send, MapPin, Mail, Phone,
    Menu, X, ChevronLeft, ChevronRight, ShieldCheck,
    Utensils, Stethoscope, Home, CheckCircle2, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const Landing = () => {
    const [openFAQ, setOpenFAQ] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isContactSubmitting, setIsContactSubmitting] = useState(false);
    const [contactForm, setContactForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const slides = [
        {
            url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
            title: "Fresh Meal Recovery",
            desc: "Routing hot prepared surplus from banquet halls, catering teams, and restaurants directly to local hunger relief kitchens.",
            stat: "14,200+ Portions Routed",
            category: "Food Relief",
            icon: Utensils,
            color: "text-emerald-600 bg-emerald-50 border-emerald-200"
        },
        {
            url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200",
            title: "First-Aid & Medical Crates",
            desc: "Fast-tracking diagnostic kits, bandages, first-aid crates, and clinic surplus to community health volunteers.",
            stat: "3,800+ Medical Kits Delivered",
            category: "Health Logistics",
            icon: Stethoscope,
            color: "text-blue-600 bg-blue-50 border-blue-200"
        },
        {
            url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=1200",
            title: "Emergency Shelter Essentials",
            desc: "Organizing winter blanket collections, sleeping mats, and seasonal survival bundles for unhoused families.",
            stat: "9,500+ Essentials Distributed",
            category: "Shelter Care",
            icon: Home,
            color: "text-amber-600 bg-amber-50 border-amber-200"
        }
    ];

    // Automatic slide rotation
    useEffect(() => {
        const rotationTimer = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slides.length);
        }, 4500);
        return () => clearInterval(rotationTimer);
    }, [slides.length]);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setIsContactSubmitting(true);
        setTimeout(() => {
            toast.success("Thank you! Our community partnerships team will connect with you within 24 hours.");
            setContactForm({ firstName: '', lastName: '', email: '', message: '' });
            setIsContactSubmitting(false);
        }, 750);
    };

    const faqs = [
        { 
            question: "How does HopeConnect ensure resources reach genuine people?", 
            answer: "Every organization claiming resources must provide verified non-profit credentials, active field coordinator contacts, and registration certificates. Every delivery is signed off with transparent activity ledger records." 
        },
        { 
            question: "Can individuals log food donations, or only large food businesses?", 
            answer: "Both! While bulk donations from banquet halls, corporate cafeterias, and restaurants form our primary volume, everyday community donors can log extra unexpired food, blankets, or first-aid supplies from their personal portal." 
        },
        { 
            question: "How quickly are emergency items matched?", 
            answer: "Our proximity smart-matching algorithm immediately notifies verified NGO shelters situated within a 10km radius. Over 80% of crisis food dispatches are accepted in under 15 minutes." 
        },
        { 
            question: "Is there any financial charge, commission, or fee?", 
            answer: "None whatsoever. HopeConnect is an entirely non-monetary, zero-fee humanitarian utility. We do not collect money or process transactions; our sole purpose is physical resource coordination." 
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
            
            {/* TOP NAVBAR */}
            <header className="sticky top-0 z-50 ui-glass-nav">
                <nav className="flex justify-between items-center px-6 lg:px-12 py-4 max-w-7xl mx-auto">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                            <HeartHandshake size={22} />
                        </div>
                        <div className="text-xl font-bold tracking-tight font-heading flex items-center gap-1">
                            <span className="text-blue-600 font-black">HOPE</span>
                            <span className="text-slate-900 font-black">CONNECT</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
                        <a href="#mission" className="hover:text-blue-600 transition-colors">Our Mission</a>
                        <a href="#pipeline" className="hover:text-blue-600 transition-colors">How It Works</a>
                        <a href="#operations" className="hover:text-blue-600 transition-colors">Live Operations</a>
                        <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
                        <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
                    </div>

                    {/* Auth Action Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link 
                            to="/login" 
                            className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-blue-600 px-4 py-2.5 transition rounded-xl hover:bg-slate-100/80"
                        >
                            Sign In
                        </Link>
                        <Link 
                            to="/register" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Hamburger Toggle Button */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        aria-label="Toggle Navigation Menu"
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
                    >
                        {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </nav>

                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col space-y-3 text-base font-semibold text-slate-700">
                            <a 
                                href="#mission" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="hover:text-blue-600 transition py-1"
                            >
                                Our Mission
                            </a>
                            <a 
                                href="#pipeline" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="hover:text-blue-600 transition py-1"
                            >
                                How It Works
                            </a>
                            <a 
                                href="#operations" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="hover:text-blue-600 transition py-1"
                            >
                                Live Operations
                            </a>
                            <a 
                                href="#faq" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="hover:text-blue-600 transition py-1"
                            >
                                FAQ
                            </a>
                            <a 
                                href="#contact" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="hover:text-blue-600 transition py-1"
                            >
                                Contact
                            </a>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                            <Link 
                                to="/login" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full text-center py-3 bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl"
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/register" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full text-center py-3 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
                            >
                                Register Now
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* 1. HERO SECTION */}
            <section className="relative pt-16 sm:pt-24 pb-20 px-6 max-w-6xl mx-auto text-center">
                {/* Background ambient radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
                
                {/* Status Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 mb-8 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold uppercase tracking-wider">Live Humanitarian Pipeline</span>
                    <span className="text-emerald-300">•</span>
                    <span>Direct Physical Aid Redistribution</span>
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading text-slate-900 tracking-tight mb-6 leading-[1.12]">
                    Where Community Surplus <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600">
                        Meets Real-Time Need
                    </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl mb-10 text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
                    HopeConnect connects edible food, emergency medical essentials, and warm shelter supplies with verified community shelters in real-time. Completely non-monetary, zero waste.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                    <Link 
                        to="/register" 
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                        <span>Join As A Coordinator</span>
                        <ArrowRight size={16} />
                    </Link>
                    <Link 
                        to="/login" 
                        className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                    >
                        <HeartHandshake size={16} className="text-blue-600" />
                        <span>Sign In To Portal</span>
                    </Link>
                </div>

                {/* Trust bar */}
                <div className="mt-14 pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-blue-600" /> Verified 501(c)(3) & Registered NGOs</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-600" /> 100% Non-Monetary Operation</span>
                    <span className="flex items-center gap-1.5"><Zap size={16} className="text-amber-500" /> 15-Minute Proximity Matching</span>
                </div>
            </section>

            {/* 2. IMPACT STATS */}
            <section className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    <div className="ui-card p-6 sm:p-8 rounded-2xl text-center ui-card-hover">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                            <Utensils size={24} />
                        </div>
                        <div className="text-3xl sm:text-4xl font-black font-heading text-slate-900 mb-1">14,240+</div>
                        <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">Meals Rescued</div>
                    </div>

                    <div className="ui-card p-6 sm:p-8 rounded-2xl text-center ui-card-hover">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="text-3xl sm:text-4xl font-black font-heading text-slate-900 mb-1">85+</div>
                        <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">Verified NGO Partners</div>
                    </div>

                    <div className="ui-card p-6 sm:p-8 rounded-2xl text-center ui-card-hover">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                            <Activity size={24} />
                        </div>
                        <div className="text-3xl sm:text-4xl font-black font-heading text-slate-900 mb-1">42,000+</div>
                        <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">Lives Impacted</div>
                    </div>

                    <div className="ui-card p-6 sm:p-8 rounded-2xl text-center ui-card-hover">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                            <Zap size={24} />
                        </div>
                        <div className="text-3xl sm:text-4xl font-black font-heading text-slate-900 mb-1">&lt; 15 Mins</div>
                        <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">Avg Route Velocity</div>
                    </div>
                </div>
            </section>

            {/* 3. OUR MISSION */}
            <section id="mission" className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-4">
                            Humanitarian Blueprint
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-slate-900 tracking-tight mb-6 leading-tight">
                            The surplus exists. The bridge was missing.
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-5 text-base sm:text-lg font-normal">
                            Every day, tons of perfectly wholesome food from dining halls, grocery chains, and community gatherings are discarded due to a lack of immediate transport coordination. At the exact same time, community shelters only blocks away struggle to keep up with need.
                        </p>
                        <p className="text-slate-600 leading-relaxed text-base sm:text-lg font-normal">
                            HopeConnect replaces chaotic manual phone trees with a real-time smart matching pipeline. Donors log items in 30 seconds; nearby volunteers and NGOs claim and dispatch them immediately.
                        </p>
                    </div>

                    {/* Editorial Obsidian Statement Card */}
                    <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-white pointer-events-none">
                            <Target size={160} />
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center mb-6 border border-white/10">
                            <Sparkles size={24} />
                        </div>
                        <h3 className="text-2xl font-bold font-heading mb-4 text-white">Our North Star</h3>
                        <p className="text-slate-300 leading-relaxed text-base sm:text-lg italic font-light">
                            "To engineer an open zero-waste ecosystem where physical surplus is claimed, rerouted, and placed in the hands of people who need it within 60 minutes."
                        </p>
                        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Zero financial transactions • 100% direct resource logistics</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. THE PIPELINE (How It Works) */}
            <section id="pipeline" className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2 block">
                        Streamlined Workflow
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-slate-900 tracking-tight">
                        How Aid Routes Through HopeConnect
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="ui-card p-8 rounded-2xl ui-card-hover relative">
                        <div className="text-5xl font-black font-mono text-slate-200 mb-4">01</div>
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 border border-blue-100">
                            <Box size={22} />
                        </div>
                        <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">1. Donor Logs Surplus</h3>
                        <p className="text-slate-600 text-sm leading-relaxed font-normal">
                            Individual donors, banquet caterers, or hospitals upload quantity, pickup coordinates, and photos onto the ledger in seconds.
                        </p>
                    </div>

                    <div className="ui-card p-8 rounded-2xl ui-card-hover relative">
                        <div className="text-5xl font-black font-mono text-slate-200 mb-4">02</div>
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-5 border border-amber-100">
                            <Activity size={22} />
                        </div>
                        <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">2. Proximity Smart Match</h3>
                        <p className="text-slate-600 text-sm leading-relaxed font-normal">
                            Nearby verified shelters receive instant urgency alerts. A coordinator locks the route with a single click to claim the batch.
                        </p>
                    </div>

                    <div className="ui-card p-8 rounded-2xl ui-card-hover relative">
                        <div className="text-5xl font-black font-mono text-slate-200 mb-4">03</div>
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 border border-emerald-100">
                            <Truck size={22} />
                        </div>
                        <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">3. Transit & Handover</h3>
                        <p className="text-slate-600 text-sm leading-relaxed font-normal">
                            Volunteer couriers or shelter staff complete pickup. Both parties update the verified delivery status on the activity log.
                        </p>
                    </div>
                </div>
            </section>

            {/* 5. INTERACTIVE OPERATIONS SHOWCASE */}
            <section id="operations" className="py-20 px-6 max-w-7xl mx-auto bg-slate-100/60 rounded-3xl p-6 sm:p-12 border border-slate-200">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase mb-2 block">
                        Live Ecosystem Showcase
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight mb-3">
                        Active Relief In The Field
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base font-normal">
                        Every day, real food, medical gear, and emergency supplies are rerouted to save lives.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Visual Stage */}
                    <div className="lg:col-span-7 relative h-[380px] sm:h-[440px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 group bg-slate-900">
                        {slides.map((item, index) => (
                            <div 
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                    index === activeSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                                }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10"></div>
                                <img 
                                    src={item.url} 
                                    alt={item.title}
                                    className="w-full h-full object-cover" 
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20 text-white">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold rounded-full tracking-wider uppercase mb-2.5">
                                        {item.category}
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-300 text-xs sm:text-sm max-w-lg font-light leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Controls */}
                        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                            <button 
                                onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                                aria-label="Previous Slide"
                                className="w-9 h-9 rounded-full bg-white/90 text-slate-800 shadow-md flex items-center justify-center hover:bg-white transition"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button 
                                onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                                aria-label="Next Slide"
                                className="w-9 h-9 rounded-full bg-white/90 text-slate-800 shadow-md flex items-center justify-center hover:bg-white transition"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Preview Cards */}
                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                        {slides.map((item, index) => {
                            const Icon = item.icon;
                            const isSelected = index === activeSlide;
                            return (
                                <div
                                    key={index}
                                    onClick={() => setActiveSlide(index)}
                                    className={`flex-1 flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                                        isSelected 
                                            ? 'bg-white border-blue-500 shadow-md text-slate-900 ring-2 ring-blue-500/20' 
                                            : 'bg-white/70 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <div className={`p-3 rounded-xl shrink-0 ${isSelected ? item.color : 'bg-slate-100 text-slate-500'}`}>
                                        <Icon size={20} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h4 className={`font-bold text-sm sm:text-base truncate font-heading ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {item.title}
                                            </h4>
                                            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${isSelected ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {item.stat}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate font-normal">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 6. FAQ SECTION */}
            <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2 block">
                        Clear Answers
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className="ui-card rounded-2xl overflow-hidden transition-all duration-200"
                        >
                            <button 
                                onClick={() => toggleFAQ(index)} 
                                className="w-full flex justify-between items-center p-5 sm:p-6 text-left hover:bg-slate-50/80 transition focus:outline-none"
                            >
                                <span className="font-bold text-slate-900 text-base sm:text-lg pr-4 font-heading">{faq.question}</span>
                                {openFAQ === index ? (
                                    <ChevronUp className="text-blue-600 shrink-0" size={20} />
                                ) : (
                                    <ChevronDown className="text-slate-400 shrink-0" size={20} />
                                )}
                            </button>
                            {openFAQ === index && (
                                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 font-normal">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. CONTACT SECTION */}
            <section id="contact" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    <div>
                        <span className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2 block">
                            Direct Liaison
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-slate-900 tracking-tight mb-5">
                            Partner With The HopeConnect Network
                        </h2>
                        <p className="text-slate-600 mb-8 leading-relaxed text-base sm:text-lg font-normal">
                            Are you a food service provider wanting to schedule recurring surplus pickups, or a community shelter needing rapid verification? Our dispatch specialists are on standby.
                        </p>
                        
                        <div className="space-y-4 text-slate-700 text-sm font-semibold">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                                    <Mail size={18} />
                                </div>
                                <span>partnerships@hopeconnect.org</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                                    <Phone size={18} />
                                </div>
                                <span>+91 98765 43210 (24/7 Field Support)</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <span>National Logistics Centre, New Delhi, India</span>
                            </div>
                        </div>
                    </div>

                    <div className="ui-card p-6 sm:p-8 rounded-3xl shadow-xl">
                        <form className="space-y-4" onSubmit={handleContactSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">First Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={contactForm.firstName}
                                        onChange={(e) => setContactForm({...contactForm, firstName: e.target.value})}
                                        placeholder="Priya" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Last Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={contactForm.lastName}
                                        onChange={(e) => setContactForm({...contactForm, lastName: e.target.value})}
                                        placeholder="Sharma" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    value={contactForm.email}
                                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                    placeholder="priya@organization.org" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition" 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Inquiry Details</label>
                                <textarea 
                                    required
                                    rows="4" 
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                    placeholder="Describe your organization's daily food volume or verification requirements..." 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition resize-none"
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isContactSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg disabled:opacity-50"
                            >
                                {isContactSubmitting ? 'Transmitting Message...' : 'Send Direct Inquiry'}
                                {!isContactSubmitting && <Send size={16} />}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* 8. FOOTER */}
            <footer className="border-t border-slate-200 bg-white pt-14 pb-8 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">
                    <div className="sm:col-span-2">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                                <HeartHandshake size={18} />
                            </div>
                            <span className="font-bold text-lg text-slate-900 tracking-tight font-heading">HOPECONNECT</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-normal">
                            A real-time, non-monetary humanitarian network eliminating resource waste and equipping grassroots shelters with modern logistics tools.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-slate-900 font-bold mb-3 uppercase tracking-wider text-xs font-heading">Navigation</h4>
                        <ul className="space-y-2 text-slate-500 text-sm font-medium">
                            <li><Link to="/login" className="hover:text-blue-600 transition">Coordinator Login</Link></li>
                            <li><Link to="/register" className="hover:text-blue-600 transition">Register as Donor</Link></li>
                            <li><Link to="/register" className="hover:text-blue-600 transition">Register as NGO Shelter</Link></li>
                            <li><Link to="/dashboard" className="hover:text-blue-600 transition">Operations Deck</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-slate-900 font-bold mb-3 uppercase tracking-wider text-xs font-heading">Operations</h4>
                        <ul className="space-y-2 text-slate-500 text-sm font-medium">
                            <li>support@hopeconnect.org</li>
                            <li>+91 98765 43210</li>
                            <li>Open Non-Monetary Protocol</li>
                        </ul>
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
                    <p>© 2026 HopeConnect Network. Dedicated to zero waste and community dignity.</p>
                    <div className="flex gap-6 font-medium">
                        <span className="hover:text-slate-800 transition cursor-pointer">Transparency Ledger</span>
                        <span className="hover:text-slate-800 transition cursor-pointer">Terms of Service</span>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Landing;