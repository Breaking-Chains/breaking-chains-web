import React, { useState } from 'react';
import { ShieldCheck, Flame, AlertCircle, Heart, HeartHandshake, CheckCircle2, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import type { LogStatus, PMOTriggerTag } from '../../types/log';
import { triggerConfetti } from '../../utils/confetti';
import checkInContent from '../../data/checkInContent.json';
import './CheckInModal.css';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLog: (status: LogStatus, triggerTag?: PMOTriggerTag, notes?: string) => Promise<void> | void;
}

const IconMap: Record<string, React.ComponentType<any>> = {
  ShieldCheck,
  Flame,
  AlertCircle,
  Heart,
  HeartHandshake,
  CheckCircle2,
};

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  onSubmitLog,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<LogStatus | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<PMOTriggerTag>('LATE_NIGHT_SOLITUDE');
  const [notes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [postSlipSubmitted, setPostSlipSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectStatus = (status: LogStatus) => {
    setSelectedStatus(status);
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    if (!selectedStatus) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onSubmitLog(selectedStatus, selectedTrigger, notes);

      if (selectedStatus === 'CLEAN' || selectedStatus === 'URGE_RESISTED') {
        triggerConfetti();
      }

      if (selectedStatus === 'SLIP_UP') {
        setPostSlipSubmitted(true);
      } else {
        onClose();
        setSelectedStatus(null);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save check-in log. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusBtnClasses: Record<LogStatus, string> = {
    CLEAN: 'cm-status-btn-clean',
    URGE_RESISTED: 'cm-status-btn-urge',
    PEEKED_EDGED: 'cm-status-btn-peeked',
    SLIP_UP: 'cm-status-btn-slip',
  };

  const statusIconClasses: Record<LogStatus, string> = {
    CLEAN: 'cm-icon-box-clean',
    URGE_RESISTED: 'cm-icon-box-urge',
    PEEKED_EDGED: 'cm-icon-box-peeked',
    SLIP_UP: 'cm-icon-box-slip',
  };

  const { title, subtitle, submitBtn, statusOptions, triggerSection, postSlip } = checkInContent;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {!postSlipSubmitted ? (
        <div className="cm-container">
          {errorMsg && (
            <div className="cm-error-banner">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}
          <p className="cm-subtitle">
            {subtitle}
          </p>

          <div className="cm-status-grid">
            {statusOptions.map((opt) => {
              const statusId = opt.id as LogStatus;
              const isSelected = selectedStatus === statusId;
              const IconComponent = IconMap[opt.icon] || ShieldCheck;
              const activeBtnClass = statusBtnClasses[statusId] || 'cm-status-btn-clean';
              const activeIconClass = statusIconClasses[statusId] || 'cm-icon-box-clean';

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectStatus(statusId)}
                  className={`cm-status-btn ${isSelected ? activeBtnClass : 'cm-status-btn-inactive'}`}
                >
                  <div className={`cm-icon-box ${isSelected ? activeIconClass : 'cm-icon-box-inactive'}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="cm-status-title">{opt.label}</h4>
                    <p className="cm-status-desc">{opt.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {(selectedStatus === 'PEEKED_EDGED' || selectedStatus === 'SLIP_UP' || selectedStatus === 'URGE_RESISTED') && (
            <div className="cm-trigger-section">
              <label className="cm-trigger-label">{triggerSection.label}</label>
              <div className="cm-trigger-grid">
                {triggerSection.triggers.map((trig) => (
                  <button
                    key={trig.id}
                    onClick={() => setSelectedTrigger(trig.id as PMOTriggerTag)}
                    className={`cm-trigger-btn ${
                      selectedTrigger === trig.id
                        ? 'cm-trigger-btn-active'
                        : 'cm-trigger-btn-inactive'
                    }`}
                  >
                    {trig.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selectedStatus || isSubmitting}
            className={`cm-confirm-btn ${
              selectedStatus === 'SLIP_UP' 
                ? 'cm-confirm-btn-danger' 
                : 'cm-confirm-btn-primary'
            } disabled:opacity-50`}
          >
            {isSubmitting ? 'Saving...' : submitBtn}
          </button>
        </div>
      ) : (
        <div className="cm-post-slip-wrapper animate-fade-in">
          {/* Al-Baqarah/Az-Zumar quote card */}
          <div className="cm-post-slip-verse-card">
            <div className="cm-post-slip-verse-icon-box">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="cm-post-slip-verse-title">{postSlip.reminderHeader}</h3>
            <p className="cm-post-slip-verse-text">
              {postSlip.reminderVerse}
              <span className="cm-post-slip-verse-ref">
                {postSlip.reminderSource}
              </span>
            </p>
          </div>

          {/* Action steps */}
          <div className="cm-post-slip-steps-card">
            <h4 className="cm-post-slip-steps-title">
              {postSlip.actionHeader}
            </h4>
            <ul className="cm-post-slip-steps-list">
              {postSlip.actionSteps.map((step, idx) => (
                <li key={idx} className="cm-post-slip-step-item">
                  <Check className="cm-post-slip-step-bullet" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommit button */}
          <button
            onClick={() => {
              setPostSlipSubmitted(false);
              setSelectedStatus(null);
              onClose();
            }}
            className="cm-post-slip-recommit-btn"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{postSlip.recommitBtn}</span>
          </button>
        </div>
      )}
    </Modal>
  );
};

export default CheckInModal;
