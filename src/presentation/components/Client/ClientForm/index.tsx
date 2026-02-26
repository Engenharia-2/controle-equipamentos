import React from 'react';
import { useClients } from '../../../hooks/useClients';
import './styles.css';

interface ClientFormProps {
  clientId?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ clientId, onCancel, onSuccess }) => {
  const {
    formData,
    setFormData,
    formLoading: loading,
    handleSave,
  } = useClients(clientId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="container">
      <h1 className="title">
        {clientId ? 'Editar Cliente' : 'Novo Cliente'}
      </h1>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Nome *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">E-mails</label>
            {formData.emails.map((email, index) => (
              <div key={index} className="email-input-group" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder="exemplo@email.com"
                  className="form-input"
                  style={{ flex: 1 }}
                />
                {formData.emails.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeEmailField(index)}
                    className="btn-remove-email"
                    title="Remover e-mail"
                    style={{ padding: '0 12px', cursor: 'pointer', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px' }}
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={addEmailField}
              className="btn-add-email"
              style={{ marginTop: '4px', cursor: 'pointer', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 12px' }}
            >
              + Adicionar E-mail
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Telefone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-actions" style={{ marginTop: '24px' }}>
            <button
              type="button"
              onClick={onCancel}
              className="btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
