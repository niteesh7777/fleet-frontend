import { useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { MdAutoMode } from "react-icons/md";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

/**
 * Template Manager
 * Save and reuse common configurations (vehicles, trips, routes)
 */
export default function TemplateManager({ type = "vehicle", onApplyTemplate }) {
  const [templates, setTemplates] = useState({
    vehicle: [
      {
        id: 1,
        name: "Standard Truck Template",
        data: {
          type: "truck",
          capacityKg: 5000,
          driverCapacity: 2,
        },
      },
      {
        id: 2,
        name: "Delivery Van Template",
        data: {
          type: "van",
          capacityKg: 1500,
          driverCapacity: 1,
        },
      },
    ],
    trip: [
      {
        id: 1,
        name: "Standard Delivery Template",
        data: {
          loadWeightKg: 2000,
          goodsInfo: "Standard goods delivery",
        },
      },
    ],
    route: [
      {
        id: 1,
        name: "City Route Template",
        data: {
          preferredVehicleTypes: ["van", "pickup"],
        },
      },
    ],
  });

  const [showModal, setShowModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");

  const currentTemplates = templates[type] || [];

  const applyTemplate = (template) => {
    toast.success(`Applied template: ${template.name}`);
    onApplyTemplate?.(template.data);
  };

  const saveNewTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    const newTemplate = {
      id: Date.now(),
      name: newTemplateName,
      data: {}, // Would be populated with current form data
    };

    setTemplates((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), newTemplate],
    }));

    toast.success("Template saved successfully");
    setNewTemplateName("");
    setShowModal(false);
  };

  const deleteTemplate = (templateId) => {
    setTemplates((prev) => ({
      ...prev,
      [type]: prev[type].filter((t) => t.id !== templateId),
    }));
    toast.success("Template deleted");
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MdAutoMode size={18} className="text-blue-600" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            Quick Templates
          </span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Save Current as Template
        </button>
      </div>

      {currentTemplates.length === 0 ? (
        <div className="text-center py-4 text-sm text-[var(--text-secondary)]">
          No templates saved yet
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {currentTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-all"
            >
              <button
                onClick={() => applyTemplate(template)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {template.name}
              </button>
              <button
                onClick={() => deleteTemplate(template.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-red-600 transition-all"
                title="Delete template"
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Save Template Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Save as Template"
        size="small"
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            placeholder="e.g., Standard Truck Configuration"
          />

          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button icon={<FiSave size={18} />} onClick={saveNewTemplate}>
              Save Template
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
