// client/src/components/CreateResourceForm.jsx
import { useState, useRef } from 'react';
import { createResource } from '../services/resourceService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
    UploadCloud, AlertTriangle, Send, Box, 
    MapPin, Type, CheckCircle, X,
    Utensils, Stethoscope, Home
} from 'lucide-react';

const CreateResourceForm = ({ onSuccess }) => {
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        type: 'FOOD',
        quantity: 1,
        location: user?.location || '',
        contactPhone: user?.phone || '',
        expiryHours: '0', // 0 = no expiry, or 3, 6, 12, 24
        description: '',
        isEmergency: false
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 7 * 1024 * 1024) {
                toast.error("Image file size must be under 7MB");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview('');
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const title = formData.title.trim();
        const location = formData.location.trim();
        const quantity = parseInt(formData.quantity, 10);

        if (!title) {
            toast.error("Please enter a title for the resource");
            setIsSubmitting(false);
            return;
        }

        if (isNaN(quantity) || quantity < 1) {
            toast.error("Quantity must be at least 1");
            setIsSubmitting(false);
            return;
        }

        try {
            const data = new FormData();
            data.append('title', title);
            data.append('type', formData.type);
            data.append('quantity', quantity);
            data.append('location', location || user?.location || 'Central City Hub');
            data.append('contactPhone', formData.contactPhone.trim());
            data.append('description', formData.description.trim());
            data.append('isEmergency', String(formData.isEmergency));

            const hours = parseFloat(formData.expiryHours);
            if (!isNaN(hours) && hours > 0) {
                const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
                data.append('expiresAt', expiresAt);
            }
            
            if (imageFile) {
                data.append('image', imageFile);
            }

            await createResource(data);
            toast.success('Resource successfully logged and broadcast to shelters!');
            
            // Reset form
            setFormData({ 
                title: '', 
                type: 'FOOD', 
                quantity: 1, 
                location: user?.location || '', 
                contactPhone: user?.phone || '',
                expiryHours: '0',
                description: '',
                isEmergency: false 
            });
            handleRemoveImage();

            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess();
            }
        } catch (error) {
            const msg = error.response?.data?.errors?.[0]?.msg 
                     || error.response?.data?.error 
                     || 'Failed to submit resource';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = [
        { 
            id: 'FOOD', 
            label: 'Food & Meals', 
            icon: Utensils, 
            activeColor: 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20' 
        },
        { 
            id: 'MEDICAL_SUPPLY', 
            label: 'Medical Supplies', 
            icon: Stethoscope, 
            activeColor: 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/20' 
        },
        { 
            id: 'SHELTER', 
            label: 'Shelter / Blankets', 
            icon: Home, 
            activeColor: 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20' 
        },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Category Selector Cards */}
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    1. Resource Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = formData.type === cat.id;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setFormData({...formData, type: cat.id})}
                                className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-xs ${
                                    isSelected 
                                        ? cat.activeColor + ' shadow-sm' 
                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                                }`}
                            >
                                <Icon size={18} />
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Title */}
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    2. Resource Title
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Type size={18} />
                    </div>
                    <input 
                        type="text" 
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. 50 Packs of Fresh Sandwiches & Bottled Water / 30 Thermal Blankets" 
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition text-sm shadow-xs"
                    />
                </div>
            </div>

            {/* Quantity and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Quantity Available (Units)
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <Box size={18} />
                        </div>
                        <input 
                            type="number" 
                            name="quantity"
                            required
                            min="1"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition text-sm font-mono shadow-xs"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Pickup Address
                        </label>
                        {user?.location && (
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, location: user.location})}
                                className="text-[11px] text-blue-600 font-semibold hover:underline"
                            >
                                Use profile address
                            </button>
                        )}
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <MapPin size={18} />
                        </div>
                        <input 
                            type="text" 
                            name="location"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. 45 Green Park, Main Market, New Delhi" 
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition text-sm shadow-xs"
                        />
                    </div>
                </div>
            </div>

            {/* Logistics Phone & Perishable Expiry Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Logistics Contact Phone
                    </label>
                    <input 
                        type="tel" 
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="e.g. +91 98110 12345" 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition text-sm shadow-xs"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Perishable Food Expiry Window
                    </label>
                    <select
                        name="expiryHours"
                        value={formData.expiryHours}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition text-sm shadow-xs font-medium"
                    >
                        <option value="0">Non-Perishable / Standard</option>
                        <option value="2">⚡ Critical: Expires in 2 Hours</option>
                        <option value="4">🕒 Cooked Meals: Expires in 4 Hours</option>
                        <option value="8">🌅 Event Surplus: Expires in 8 Hours</option>
                        <option value="24">📅 Fresh Produce: Expires in 24 Hours</option>
                    </select>
                </div>
            </div>

            {/* Description / Expiry notes */}
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Logistics / Safe Consumption Notes (Optional)
                </label>
                <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. Packaged in sanitized insulated boxes. Must be consumed before 10:00 PM tonight."
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition text-sm resize-none shadow-xs"
                ></textarea>
            </div>

            {/* Photo Upload with Live Thumbnail */}
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Supply Verification Photo
                </label>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*" 
                />

                {imagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-52 flex items-center justify-center group shadow-sm">
                        <img 
                            src={imagePreview} 
                            alt="Resource preview" 
                            className="w-full h-48 object-cover" 
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full transition shadow-md"
                            title="Remove photo"
                        >
                            <X size={16} />
                        </button>
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 text-slate-900 text-xs font-bold rounded-lg shadow-sm">
                            {imageFile?.name}
                        </div>
                    </div>
                ) : (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-white hover:border-blue-400 transition-all p-4 group"
                    >
                        <UploadCloud className="w-8 h-8 mb-2 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <p className="text-xs sm:text-sm font-semibold text-slate-700">Click to upload photo or drag & drop</p>
                        <p className="text-[11px] text-slate-400 mt-1">PNG, JPG or WEBP up to 7MB</p>
                    </div>
                )}
            </div>

            {/* Emergency Toggle Banner */}
            <div>
                <button
                    type="button"
                    onClick={() => setFormData({...formData, isEmergency: !formData.isEmergency})}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all shadow-xs ${
                        formData.isEmergency 
                        ? 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-500/20' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                >
                    <div className={`p-2.5 rounded-xl shrink-0 ${formData.isEmergency ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                        <AlertTriangle size={20} className={formData.isEmergency ? 'animate-pulse' : ''} />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                        <p className={`font-bold text-sm ${formData.isEmergency ? 'text-rose-700' : 'text-slate-800'}`}>
                            Flag as Urgent Emergency Aid
                        </p>
                        <p className="text-xs opacity-80 truncate">
                            Broadcasts critical audio-visual alert to shelters for immediate pickup within 30 minutes.
                        </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${formData.isEmergency ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-300'}`}>
                        {formData.isEmergency && <CheckCircle size={14} />}
                    </div>
                </button>
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 transition text-sm"
            >
                {isSubmitting ? 'Logging Resource to Buffer...' : 'Confirm & Dispatch to Network'}
                {!isSubmitting && <Send size={16} />}
            </button>
        </form>
    );
};

export default CreateResourceForm;