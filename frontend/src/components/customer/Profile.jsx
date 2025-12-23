import React, { useState } from 'react';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setAlert(null);

    try {
      // Call update user API
      await updateUser(formData);
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
      setEditing(false);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card title="Personal Information">
          <div className="space-y-4">
            <Input
              icon={User}
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!editing}
            />

            <Input
              icon={User}
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!editing}
            />

            <Input
              icon={Mail}
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              disabled
            />

            <Input
              icon={Phone}
              name="phone"
              label="Phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editing}
            />

            {editing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} loading={loading} fullWidth>
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setEditing(true)} fullWidth>
                Edit Profile
              </Button>
            )}
          </div>
        </Card>

        <Card title="Account Security">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Password</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Keep your account secure by using a strong password
              </p>
              <Button variant="outline" size="sm" fullWidth>
                Change Password
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Account Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email Verified</span>
                  <span className="text-green-600 font-medium">✓ Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}