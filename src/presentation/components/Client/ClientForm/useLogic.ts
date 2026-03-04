import { useState, useEffect } from 'react';
import { useClientForm } from '../../../hooks/useClientForm';
import type { Client } from '../../../../core/entities/Client';

interface UseClientFormLogicProps {
  clientId?: string;
  onSuccess: () => void;
}

export const useClientFormLogic = ({ clientId, onSuccess }: UseClientFormLogicProps) => {
  const {
    formData,
    setFormData,
    formLoading,
    handleSave,
  } = useClientForm(clientId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...formData.emails];
    newEmails[index] = value;
    setFormData((prev) => ({ ...prev, emails: newEmails }));
  };

  const addEmailField = () => {
    setFormData((prev) => ({ ...prev, emails: [...prev.emails, ''] }));
  };

  const removeEmailField = (index: number) => {
    if (formData.emails.length > 1) {
      const newEmails = formData.emails.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, emails: newEmails }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSave();
    if (success) {
      onSuccess();
    }
  };

  return {
    formData,
    loading: formLoading,
    handleChange,
    handleEmailChange,
    addEmailField,
    removeEmailField,
    handleSubmit
  };
};
