import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getStudentProfile,
  updateStudentProfile,
  uploadProfilePhoto,
  uploadResume,
} from '../../services/api';
import { PencilIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const StudentProfile = () => {
  const { profile, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [department, setDepartment] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      setSkills(profile.skills || []);
      setCgpa(profile.cgpa || '');
      setDepartment(profile.user?.department || '');
    }
  }, [profile]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    try {
      setLoading(true);
      const response = await uploadProfilePhoto(file);
      updateUserProfile(response.data);
      toast.success('Profile photo updated successfully');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'application/msword', 
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOC file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      const response = await uploadResume(file);
      updateUserProfile(response.data);
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await updateStudentProfile({
        skills,
        cgpa: parseFloat(cgpa),
      });
      updateUserProfile(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (profile?.user?.first_name && profile?.user?.last_name) {
      return `${profile.user.first_name[0]}${profile.user.last_name[0]}`.toUpperCase();
    }
    return profile?.username?.[0]?.toUpperCase() || '?';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
        </div>

        {/* Profile Content */}
        <div className="px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
            {/* Profile Photo */}
            <div className="relative">
              {profile?.profile_photo ? (
                <img
                  // src={`http://localhost:8000${profile.profile_photo}`}
                  src={`https://smart-placement-system-4.onrender.com${profile.profile_photo}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white text-4xl font-bold">
                    {getInitials()}
                  </span>
                </div>
              )}
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50"
              >
                <PencilIcon className="h-5 w-5 text-gray-600" />
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={loading}
                />
              </label>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile?.user?.first_name || profile?.username}{' '}
                {profile?.user?.last_name || ''}
              </h2>
              <p className="text-gray-600">{profile?.email}</p>
              <p className="text-gray-600">
                Department: {profile?.user?.department || 'Not specified'}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              {/* Resume Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Resume</h3>
                {profile?.resume ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Current: {profile.resume_filename}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={`http://localhost:8000${profile.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        View
                      </a>
                      <a
                        href={`http://localhost:8000${profile.resume}`}
                        download
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">Resume not uploaded yet</p>
                  </div>
                )}

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload New Resume (PDF/DOC)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    disabled={loading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* Skills Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Skills</h3>
                {isEditing ? (
                  <div>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        placeholder="Add a skill"
                        className="flex-1 border border-gray-300 rounded-md p-2"
                      />
                      <button
                        onClick={addSkill}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Academic Information</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CGPA
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                ) : (
                  <p className="text-gray-900">{cgpa || 'Not specified'}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;