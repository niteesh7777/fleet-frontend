import { useState } from "react";

/**
 * Custom hook for managing multiple modal states
 * Eliminates boilerplate of managing individual modal states and selected entities
 *
 * @param {Object} initialState - Initial modal states (e.g., { add: false, edit: false, delete: false })
 * @returns {Object} - { modals, openModal, closeModal, selectedEntity, closeAllModals }
 *
 * @example
 * const { modals, openModal, closeModal, selectedEntity } = useModals({
 *   add: false,
 *   edit: false,
 *   delete: false
 * });
 *
 * // Open a modal
 * <Button onClick={() => openModal('edit', driver)}>Edit</Button>
 *
 * // Render modal
 * {modals.edit && (
 *   <EditDriverModal
 *     driver={selectedEntity}
 *     open={modals.edit}
 *     onClose={() => closeModal('edit')}
 *   />
 * )}
 */
export const useModals = (initialState = {}) => {
  const [modals, setModals] = useState(initialState);
  const [selectedEntity, setSelectedEntity] = useState(null);

  /**
   * Open a specific modal, optionally with an associated entity
   * @param {string} name - Modal name (must match key in initialState)
   * @param {Object|null} entity - Optional entity to associate with the modal
   */
  const openModal = (name, entity = null) => {
    setSelectedEntity(entity);
    setModals((prev) => ({ ...prev, [name]: true }));
  };

  /**
   * Close a specific modal and clear selected entity
   * @param {string} name - Modal name to close
   */
  const closeModal = (name) => {
    setModals((prev) => ({ ...prev, [name]: false }));
    setSelectedEntity(null);
  };

  /**
   * Close all modals and clear selected entity
   */
  const closeAllModals = () => {
    const allClosed = Object.keys(modals).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setModals(allClosed);
    setSelectedEntity(null);
  };

  return {
    modals,
    openModal,
    closeModal,
    selectedEntity,
    closeAllModals,
  };
};
