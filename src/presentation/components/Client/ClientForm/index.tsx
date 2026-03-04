import React from 'react';
import { useClientFormLogic } from './useLogic';
import './styles.css';

interface ClientFormProps {
  clientId?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ clientId, onCancel, onSuccess }) => {
  const {
    formData,
    loading,
    handleChange,
    handleEmailChange,
    addEmailField,
    removeEmailField,
    handleSubmit
  } = useClientFormLogic({ clientId, onSuccess });

  return (
    <div className="container">
      <h1 className="title">
        {clientId ? 'Editar Cliente' : 'Novo Cliente'}
      </h1>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
            {/* Nome - Full Width */}
            <div className="form-group full-width">
              <label className="form-label">Nome *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Nome completo do cliente ou razão social"
              />
            </div>

            {/* CNPJ - Ocupa a coluna 1 */}
            <div className="form-group">
              <label className="form-label">CNPJ/CPF *</label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj || ''}
                onChange={handleChange}
                required
                placeholder="00.000.000/0000-00"
                className="form-input"
              />
            </div>

            {/* Telefone - Ocupa a coluna 2 */}
            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className="form-input"
              />
            </div>

            {/* Endereço - Full Width */}
            <div className="form-group full-width">
              <label className="form-label">Endereço Completo *</label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                required
                placeholder="Rua, Número, Bairro, Cidade - UF, CEP"
                className="form-input address-textarea"
              />
            </div>

            {/* E-mails - Full Width */}
            <div className="form-group full-width">
              <label className="form-label">E-mails de Contato</label>
              {formData.emails.map((email, index) => (
                <div key={index} className="email-input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="exemplo@email.com"
                    className="form-input email-input"
                  />
                  {formData.emails.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeEmailField(index)}
                      className="btn-remove-email"
                      title="Remover e-mail"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button 
                  type="button" 
                  onClick={addEmailField}
                  className="btn-add-email"
                >
                  + Adicionar outro e-mail
                </button>
              </div>
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
