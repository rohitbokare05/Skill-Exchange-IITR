import { useState } from 'react';
import { Camera, Upload, X, Loader } from 'lucide-react';

const ProfilePictureUpload = ({ currentUser, onPhotoUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Generate UI Avatars URL
  const getUIAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=256&background=4F46E5&color=fff&bold=true&format=png`;
  };

  // Get current photo URL (custom or UI Avatar)
  const getCurrentPhotoUrl = () => {
    if (currentUser.customPhoto) {
      return currentUser.customPhoto;
    }
    return getUIAvatarUrl(currentUser.name);
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }

    try {
      setUploading(true);
      
      // Convert to base64
      const base64String = await fileToBase64(file);
      
      // Show preview
      setPreviewUrl(base64String);
      setShowModal(true);
      
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Confirm and save photo
  const handleSavePhoto = async () => {
    if (!previewUrl) return;

    try {
      setUploading(true);
      
      // Call parent callback to update Firestore
      await onPhotoUpdate(previewUrl);
      
      // Close modal
      setShowModal(false);
      setPreviewUrl(null);
      
      alert('Profile picture updated successfully!');
      
    } catch (error) {
      console.error('Error saving photo:', error);
      alert('Failed to save profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Remove custom photo (revert to UI Avatar)
  const handleRemovePhoto = async () => {
    if (!confirm('Remove your custom profile picture and revert to default avatar?')) {
      return;
    }

    try {
      setUploading(true);
      
      // Call parent callback with null to remove custom photo
      await onPhotoUpdate(null);
      
      alert('Profile picture removed. Using default avatar.');
      
    } catch (error) {
      console.error('Error removing photo:', error);
      alert('Failed to remove profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Current Profile Picture with Upload Button */}
      <div className="relative inline-block">
        <img
          src={getCurrentPhotoUrl()}
          alt={currentUser.name}
          className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
        />
        
        {/* Upload Button Overlay */}
        <label
          htmlFor="profile-picture-input"
          className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg"
          title="Change profile picture"
        >
          {uploading ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            <Camera size={20} />
          )}
        </label>
        
        <input
          id="profile-picture-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {/* Remove Button (only show if custom photo exists) */}
        {currentUser.customPhoto && (
          <button
            onClick={handleRemovePhoto}
            className="absolute top-0 right-0 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors shadow-lg"
            title="Remove custom picture"
            disabled={uploading}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Preview Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Preview Profile Picture
            </h3>
            
            {/* Preview Image */}
            <div className="flex justify-center mb-6">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-48 h-48 rounded-full border-4 border-indigo-200 object-cover"
              />
            </div>

            <p className="text-sm text-gray-600 mb-6 text-center">
              This is how your profile picture will appear to others
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPreviewUrl(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              
              <button
                onClick={handleSavePhoto}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploading}
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader size={16} className="animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Save Photo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePictureUpload;