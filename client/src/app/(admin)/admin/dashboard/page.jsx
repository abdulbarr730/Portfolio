'use client';

import PrivateRoute from '@/components/PrivateRoute';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DashboardPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');

  // --- STATE MANAGEMENT ---
  // State for Projects
  const [projects, setProjects] = useState([]);
  const [addProjectForm, setAddProjectForm] = useState({ title: '', description: '', technologies: '', liveUrl: '', githubUrl: '' });
  const [editingProject, setEditingProject] = useState(null);

  // State for Experience
  const [experience, setExperience] = useState([]);
  const [addExperienceForm, setAddExperienceForm] = useState({ role: '', company: '', duration: '', description: '', type: 'professional' });
  const [editingExperience, setEditingExperience] = useState(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    fetchProjects();
    fetchExperience();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
    const data = await res.json();
    setProjects(data);
  };

  const fetchExperience = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience`);
    const data = await res.json();
    setExperience(data);
  };

  // --- FORM CHANGE HANDLERS ---
  const handleAddProjectChange = (e) => setAddProjectForm({ ...addProjectForm, [e.target.name]: e.target.value });
  const handleEditProjectChange = (e) => setEditingProject({ ...editingProject, [e.target.name]: e.target.value });
  const handleAddExperienceChange = (e) => setAddExperienceForm({ ...addExperienceForm, [e.target.name]: e.target.value });
  const handleEditExperienceChange = (e) => setEditingExperience({ ...editingExperience, [e.target.name]: e.target.value });

  // --- PROJECT CRUD FUNCTIONS ---
  const handleAddProjectSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify(addProjectForm),
    });
    if (res.ok) {
      setMessage('Project added successfully!');
      setAddProjectForm({ title: '', description: '', technologies: '', liveUrl: '', githubUrl: '' });
      fetchProjects();
    } else {
      setMessage('Failed to add project.');
    }
  };

  const handleUpdateProjectSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/update/${editingProject._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify(editingProject),
    });
    if (res.ok) {
      setMessage('Project updated successfully!');
      setEditingProject(null);
      fetchProjects();
    } else {
      setMessage('Failed to update project.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token },
    });
    if (res.ok) {
      setMessage('Project deleted successfully!');
      fetchProjects();
    } else {
      setMessage('Failed to delete project.');
    }
  };

  // --- EXPERIENCE CRUD FUNCTIONS ---
  const handleAddExperienceSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify(addExperienceForm),
    });
    if (res.ok) {
      setMessage('Experience added successfully!');
      setAddExperienceForm({ role: '', company: '', duration: '', description: '', type: 'professional' });
      fetchExperience();
    } else {
      setMessage('Failed to add experience.');
    }
  };

  const handleUpdateExperienceSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience/update/${editingExperience._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({
        ...editingExperience,
        description: Array.isArray(editingExperience.description) ? editingExperience.description.join(', ') : editingExperience.description,
      }),
    });
    if (res.ok) {
      setMessage('Experience updated successfully!');
      setEditingExperience(null);
      fetchExperience();
    } else {
      setMessage('Failed to update experience.');
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience/${experienceId}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token },
    });
    if (res.ok) {
      setMessage('Experience deleted successfully!');
      fetchExperience();
    } else {
      setMessage('Failed to delete experience.');
    }
  };
  
  // --- LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-background dark:bg-primary text-primary dark:text-background">
        <div className="container mx-auto p-4 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <button onClick={handleLogout} className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Logout</button>
          </div>
          {message && <p className="mb-4 text-center">{message}</p>}

          {/* PROJECTS MANAGEMENT */}
          <div className="bg-white dark:bg-primary/80 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Manage Projects</h2>
            <form onSubmit={handleAddProjectSubmit} className="space-y-4">
              <input name="title" value={addProjectForm.title} onChange={handleAddProjectChange} placeholder="Title" required className="w-full p-2 bg-background dark:bg-primary border rounded"/>
              <textarea name="description" value={addProjectForm.description} onChange={handleAddProjectChange} placeholder="Description" required className="w-full p-2 bg-background dark:bg-primary border rounded"/>
              <input name="technologies" value={addProjectForm.technologies} onChange={handleAddProjectChange} placeholder="Technologies (comma-separated)" required className="w-full p-2 bg-background dark:bg-primary border rounded"/>
              <input name="liveUrl" value={addProjectForm.liveUrl} onChange={handleAddProjectChange} placeholder="Live URL" className="w-full p-2 bg-background dark:bg-primary border rounded"/>
              <input name="githubUrl" value={addProjectForm.githubUrl} onChange={handleAddProjectChange} placeholder="GitHub URL" className="w-full p-2 bg-background dark:bg-primary border rounded"/>
              <button type="submit" className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Add Project</button>
            </form>
            <div className="space-y-4 mt-8">
              {projects.map(project => (
                <div key={project._id} className="p-4 border rounded dark:border-gray-600 flex justify-between items-center">
                  <p className="font-semibold">{project.title}</p>
                  <div className="space-x-2">
                    <button onClick={() => setEditingProject(project)} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Edit</button>
                    <button onClick={() => handleDeleteProject(project._id)} className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EXPERIENCE MANAGEMENT */}
          <div className="bg-white dark:bg-primary/80 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Manage Experience & Education</h2>
            <form onSubmit={handleAddExperienceSubmit} className="space-y-4 mb-8">
              <input name="role" value={addExperienceForm.role} onChange={handleAddExperienceChange} placeholder="Role / Degree" required className="w-full p-2 bg-background dark:bg-primary border rounded"/>
              <input name="company" value={addExperienceForm.company} onChange={handleAddExperienceChange} placeholder="Company / Institution" required className="w-full p-2 bg-background dark:bg-primary border rounded"/>
              <input name="duration" value={addExperienceForm.duration} onChange={handleAddExperienceChange} placeholder="Duration (e.g., Jan 2020 - Present)" required className="w-full p-2 bg-background dark:bg-primary border rounded"/>
              <input name="description" value={addExperienceForm.description} onChange={handleAddExperienceChange} placeholder="Description (comma-separated)" className="w-full p-2 bg-background dark:bg-primary border rounded"/>
              <select name="type" value={addExperienceForm.type} onChange={handleAddExperienceChange} className="w-full p-2 bg-background dark:bg-primary border rounded">
                <option value="professional">Professional</option>
                <option value="education">Education</option>
              </select>
              <button type="submit" className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Add Experience</button>
            </form>
            <div className="space-y-4">
              {experience.map(item => (
                <div key={item._id} className="p-4 border rounded dark:border-gray-600 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.role}</p>
                    <p className="text-sm text-secondary dark:text-gray-400">{item.company}</p>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => setEditingExperience(item)} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Edit</button>
                    <button onClick={() => handleDeleteExperience(item._id)} className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
            <form onSubmit={handleUpdateProjectSubmit} className="space-y-4">
              <input name="title" value={editingProject.title} onChange={handleEditProjectChange} placeholder="Title" required className="w-full p-2 bg-background dark:bg-gray-700 border rounded"/>
              <textarea name="description" value={editingProject.description} onChange={handleEditProjectChange} placeholder="Description" required className="w-full p-2 bg-background dark:bg-gray-700 border rounded"/>
              <input name="technologies" value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(', ') : editingProject.technologies} onChange={handleEditProjectChange} placeholder="Technologies (comma-separated)" required className="w-full p-2 bg-background dark:bg-gray-700 border rounded"/>
              <input name="liveUrl" value={editingProject.liveUrl} onChange={handleEditProjectChange} placeholder="Live URL" className="w-full p-2 bg-background dark:bg-gray-700 border rounded"/>
              <input name="githubUrl" value={editingProject.githubUrl} onChange={handleEditProjectChange} placeholder="GitHub URL" className="w-full p-2 bg-background dark:bg-gray-700 border rounded"/>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 font-semibold bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingExperience && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Experience</h2>
            <form onSubmit={handleUpdateExperienceSubmit} className="space-y-4">
              <input name="role" value={editingExperience.role} onChange={handleEditExperienceChange} placeholder="Role / Degree" required className="w-full p-2 bg-background dark:bg-gray-700 border rounded"/>
              <input name="company" value={editingExperience.company} onChange={handleEditExperienceChange} placeholder="Company / Institution" required className="w-red-500 w-full p-2 bg-background dark:bg-gray-700 border rounded"/>
              <input name="duration" value={editingExperience.duration} onChange={handleEditExperienceChange} placeholder="Duration" required className="w-full p-2 bg-background dark:bg-gray-700 border rounded"/>
              <input name="description" value={Array.isArray(editingExperience.description) ? editingExperience.description.join(', ') : editingExperience.description} onChange={handleEditExperienceChange} placeholder="Description (comma-separated)" className="w-full p-2 bg-background dark:bg-gray-700 border rounded"/>
              <select name="type" value={editingExperience.type} onChange={handleEditExperienceChange} className="w-full p-2 bg-background dark:bg-gray-700 border rounded">
                <option value="professional">Professional</option>
                <option value="education">Education</option>
              </select>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setEditingExperience(null)} className="px-4 py-2 font-semibold bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PrivateRoute>
  );
};

export default DashboardPage;