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

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
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
          </div>

          <div className="form-actions">
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
