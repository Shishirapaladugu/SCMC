import { useState, useEffect, useCallback } from 'react';
import { complaintsAPI } from '../api';
import toast from 'react-hot-toast';

// ── All complaints (authority) ─────────────────────────────────────────────
export function useComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await complaintsAPI.getAll();
      // Backend returns plain array
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { complaints, loading, error, refetch: fetch, setComplaints };
}

// ── My complaints (citizen) ────────────────────────────────────────────────
export function useMyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await complaintsAPI.getMine();
      setComplaints(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load your reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { complaints, loading, refetch: fetch };
}

// ── Dashboard stats derived from complaints array ─────────────────────────
export function useStats() {
  const { complaints, loading } = useComplaints();

  const stats = {
    total:      complaints.length,
    new:        complaints.filter(c => c.status === 'New').length,
    inprogress: complaints.filter(c => c.status === 'In Progress').length,
    resolved:   complaints.filter(c => c.status === 'Resolved').length,
    high:       complaints.filter(c => c.priority === 'High').length,
    byCategory: ['garbage','pothole','streetlight','IllegalParking','General'].map(cat => ({
      _id: cat,
      count: complaints.filter(c => c.category === cat).length,
    })).filter(c => c.count > 0),
    byDepartment: ['Sanitation','Roads','Electricity','Traffic','General'].map(dept => ({
      _id: dept,
      count: complaints.filter(c => c.department === dept).length,
    })).filter(d => d.count > 0),
  };

  return { stats, loading };
}

// ── Update status ──────────────────────────────────────────────────────────
export function useUpdateStatus() {
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (id, status, onSuccess) => {
    setUpdating(true);
    try {
      await complaintsAPI.updateStatus(id, status);
      toast.success(`Status updated to "${status}"`);
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  return { updateStatus, updating };
}
