import React, { useState, useRef, useEffect } from "react";

interface PrioritySelectProps {
  value: "low" | "medium" | "high" | "urgent";
  onChange: (value: "low" | "medium" | "high" | "urgent") => void;
  disabled?: boolean;
  id?: string;
}

const priorities = [
  { value: "low" as const, label: "Low Priority", icon: "🔵" },
  { value: "medium" as const, label: "Medium Priority", icon: "🟡" },
  { value: "high" as const, label: "High Priority", icon: "🟠" },
  { value: "urgent" as const, label: "Urgent", icon: "🔴" },
];

export const PrioritySelect: React.FC<PrioritySelectProps> = ({ value, onChange, disabled = false, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedPriority = priorities.find((p) => p.value === value) || priorities[1];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = priorities.findIndex((p) => p.value === value);
          const nextIndex = (currentIndex + 1) % priorities.length;
          onChange(priorities[nextIndex].value);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = priorities.findIndex((p) => p.value === value);
          const prevIndex = currentIndex === 0 ? priorities.length - 1 : currentIndex - 1;
          onChange(priorities[prevIndex].value);
        }
        break;
    }
  };

  return (
    <div className="relative" ref={selectRef}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          relative w-full rounded-lg border px-3 py-2.5 text-left text-sm shadow-sm transition-all duration-200
          ${
            disabled
              ? "cursor-not-allowed opacity-50 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
              : `cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 
                 hover:border-gray-400 dark:hover:border-gray-500`
          }
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={id ? `${id}-label` : undefined}
      >
        <div className="flex items-center gap-2">
          <span className="text-base animate-bounce-gentle">{selectedPriority.icon}</span>
          <span className="text-gray-900 dark:text-white font-medium transition-colors duration-300">
            {selectedPriority.label}
          </span>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-1 w-full rounded-lg border shadow-lg bg-white dark:bg-gray-800 
            border-gray-200 dark:border-gray-600 animate-fade-slide-up
          `}
        >
          <div className="py-1 max-h-60 overflow-auto">
            {priorities.map((priority) => (
              <button
                key={priority.value}
                type="button"
                onClick={() => {
                  onChange(priority.value);
                  setIsOpen(false);
                }}
                className={`
                  relative w-full px-3 py-2.5 text-left text-sm transition-colors duration-150
                  hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700/50
                  ${
                    priority.value === value
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-900 dark:text-white transition-colors duration-300"
                  }
                `}
                role="option"
                aria-selected={priority.value === value}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base animate-bounce-gentle">{priority.icon}</span>
                  <span className="font-medium">{priority.label}</span>
                  {priority.value === value && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
