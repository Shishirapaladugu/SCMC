import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { complaintsAPI } from '../api';
import { Button } from '../components/UI';
import toast from 'react-hot-toast';

const label = { display: 'block', fontSize: 13, fontWeight: 500, color: '#6B6960', marginBottom: 6 };
const input = {
  width: '100%', padding: '10px 14px', border: '1px solid #E2DED6',
  borderRadius: 8, fontFamily: 'inherit', fontSize: 14, color: '#1A1917',
  background: '#fff', outline: 'none', boxSizing: 'border-box',
};

// Convert File to base64 string (what your backend expects)
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result); // "data:image/jpeg;base64,..."
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ReportPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview]       = useState(null);
  const [imageFile, setImageFile]   = useState(null);
  const [form, setForm]             = useState({ city: '', state: '', address: '' });

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  // Image drop — your backend takes base64, not multipart
  const onDrop = useCallback((accepted) => {
    const file = accepted[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.city.trim())    { toast.error('City is required');    return; }
    if (!form.state.trim())   { toast.error('State is required');   return; }
    if (!form.address.trim()) { toast.error('Address is required'); return; }

    setSubmitting(true);
    try {
      // Convert image to base64 if provided
      // Backend body: { city, state, address, image? }
      let image = undefined;
      if (imageFile) {
        image = await fileToBase64(imageFile);
      }

      const payload = { city: form.city, state: form.state, address: form.address };
      if (image) payload.image = image;

      const { data } = await complaintsAPI.submit(payload);
      if (data.message) {
        toast.success('Complaint submitted! Our ML model is classifying your issue.');
        navigate('/my-reports');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 660, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 24, fontWeight: 600 }}>Report a Civic Issue</h1>
        <span style={{ background: 'linear-gradient(135deg,#E8F3E8,#E6EEFA)', border: '1px solid #C5D8C5', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#2D5A2D', fontWeight: 500 }}>
          ✦ ML Auto-Classification
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2DED6', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* City + State */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={label}>City *</label>
              <input style={input} type="text" placeholder="e.g., Hyderabad" value={form.city} onChange={set('city')} required />
            </div>
            <div>
              <label style={label}>State *</label>
              <input style={input} type="text" placeholder="e.g., Telangana" value={form.state} onChange={set('state')} required />
            </div>
          </div>

          {/* Address */}
          <div>
            <label style={label}>Address / Location *</label>
            <input style={input} type="text" placeholder="Street name, area, landmark" value={form.address} onChange={set('address')} required />
          </div>

          {/* Image upload */}
          <div>
            <label style={label}>
              Upload Photo
              <span style={{ color: '#A8A49E', fontWeight: 400 }}> — ML model will auto-detect issue type</span>
            </label>
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? '#4A9E4A' : '#E2DED6'}`,
                borderRadius: 12, padding: '2rem', textAlign: 'center', cursor: 'pointer',
                background: isDragActive ? '#E8F3E8' : '#F7F6F2', transition: 'all .15s',
              }}
            >
              <input {...getInputProps()} />
              {preview ? (
                <div>
                  <img src={preview} alt="preview" style={{ maxHeight: 180, borderRadius: 8, marginBottom: 8 }} />
                  <div style={{ fontSize: 12, color: '#6B6960' }}>Click or drag to replace</div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                  <div style={{ fontSize: 14, color: '#6B6960' }}>
                    {isDragActive ? 'Drop image here' : 'Click to upload or drag & drop'}
                  </div>
                  <div style={{ fontSize: 12, color: '#A8A49E', marginTop: 4 }}>JPG, PNG, WEBP up to 10MB</div>
                </>
              )}
            </div>
          </div>

          {/* ML info banner */}
          <div style={{ background: '#E8F3E8', border: '1px solid #A5CCA5', borderRadius: 8, padding: '.75rem 1rem', fontSize: 13, color: '#2D6A2D', display: 'flex', gap: 10 }}>
            <span>✦</span>
            <div>
              Your image is sent to our <strong>ML classification model</strong> which automatically detects the issue category (pothole, garbage, streetlight, illegal parking) and assigns a priority level.
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Complaint →'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
