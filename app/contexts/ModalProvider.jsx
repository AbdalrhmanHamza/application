"use client";
import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalType, setModalType] = useState(null);
  const [modalProps, setModalProps] = useState({});

  const openModal = (type, props = {}) => {
    setModalType(type);
    setModalProps(props);
  };

  const closeModal = () => {
    setModalType(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, modalType, modalProps }}
    >
      {children}

      {/* Centralized modal renderer */}
      {modalType === "login" && (
        <LoginModal {...modalProps} onClose={closeModal} />
      )}
      {modalType === "signup" && (
        <SignupModal {...modalProps} onClose={closeModal} />
      )}
      {modalType === "deleteConfirm" && (
        <DeleteConfirmModal {...modalProps} onClose={closeModal} />
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
}
