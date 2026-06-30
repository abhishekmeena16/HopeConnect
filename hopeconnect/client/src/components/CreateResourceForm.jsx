import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    UploadCloud, AlertTriangle, Send, Box, 
    MapPin, Type, ListPlus, CheckCircle 
} from 'lucide-react';

const CreateResourceForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'FOOD',
        quantity: 1,
        location: '',
        isEmergency: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('type', formData.type);
            data.append('quantity', formData.quantity);
            data.append('location', formData.location);
            data.append('isEmergency', formData.isEmergency);
            
            if (imageFile) {
                data.append('image', imageFile);
            }

            await api.post('/resources', data);
            toast.success('Resource successfully logged!');
            
            setFormData({ title: '', type: 'FOOD', quantity: 1, location: '', isEmergency: false });
            setImageFile(null);
            e.target.reset();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to submit resource');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resource Title */}
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resource Title</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                        <Type size={18} />
                    </div>
                    <input 
                        type="text" 
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., 50 Boxes of Pasta" 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                </div>
            </div>

            {/* Category & Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                            <ListPlus size={18} />
                        </div>
                        <select 
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
                        >
                            <option value="FOOD">Food & Meals</option>
                            <option value="MEDICAL_SUPPLY">Medical Supplies</option>
                            <option value="SHELTER">Shelter / Blankets</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quantity</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                            <Box size={18} />
                        </div>
                        <input 
                            type="number" 
                            name="quantity"
                            required
                            min="1"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Pickup Location */}
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pickup Location</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                        <MapPin size={18} />
                    </div>
                    <input 
                        type="text" 
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., 123 Main St, New York" 
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                </div>
            </div>

            {/* File Upload Dropzone */}
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Attach a Photo</label>
                <div className="relative">
                    <input type="file" id="file-upload" onChange={handleFileChange} className="hidden" accept="image/*" />
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-900/30 hover:bg-slate-800/50 hover:border-emerald-500 transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                            {imageFile ? (
                                <p className="text-sm font-bold text-emerald-400">{imageFile.name}</p>
                            ) : (
                                <p className="text-sm text-slate-400">Click to upload or drag and drop</p>
                            )}
                        </div>
                    </label>
                </div>
            </div>

            {/* Emergency Toggle */}
            <div>
                <button
                    type="button"
                    onClick={() => setFormData({...formData, isEmergency: !formData.isEmergency})}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                        formData.isEmergency 
                        ? 'bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.15)]' 
                        : 'bg-slate-950/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
                    }`}
                >
                    <div className={`p-2 rounded-lg ${formData.isEmergency ? 'bg-rose-500/20' : 'bg-slate-800'}`}>
                        <AlertTriangle size={20} className={formData.isEmergency ? 'text-rose-400 animate-pulse' : 'text-slate-500'} />
                    </div>
                    <div className="text-left flex-1">
                        <p className={`font-bold ${formData.isEmergency ? 'text-rose-400' : 'text-slate-300'}`}>Flag as Emergency</p>
                        <p className="text-xs opacity-80 mt-0.5">Mark this resource for immediate crisis relief.</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.isEmergency ? 'border-rose-500 bg-rose-500' : 'border-slate-600'}`}>
                        {formData.isEmergency && <CheckCircle size={14} className="text-white" />}
                    </div>
                </button>
            </div>

            {/* Submit */}
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 group disabled:opacity-50"
            >
                {isSubmitting ? 'Logging...' : 'Submit Resource'}
                {!isSubmitting && <Send size={18} />}
            </button>
        </form>
    );
};

export default CreateResourceForm;