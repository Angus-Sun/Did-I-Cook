"use client";

interface FormInputProps {
  label: string;
  placeholder?: string;
  type?: string;
  variant?: "amber" | "orange";
}

interface FormSelectProps {
  label: string;
  options: string[];
  variant?: "amber" | "orange";
  value?: string;
  onChange?: (value: string) => void;
}

const variants = {
  amber: {
    label: "text-amber-800",
    border: "border-amber-300",
  },
  orange: {
    label: "text-orange-800",
    border: "border-orange-300",
  },
};

export function FormInput({ label, placeholder, type = "text", variant = "amber" }: FormInputProps) {
  const styles = variants[variant];
  
  return (
    <div>
      <label className={`block text-sm font-medium ${styles.label} mb-2`}>
        {label}
      </label>
      <input 
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-lg border ${styles.border} bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all`}
      />
    </div>
  );
}

export function FormSelect({ label, options, variant = "amber", value, onChange }: FormSelectProps) {
  const styles = variants[variant];
  return (
    <div>
      <label className={`block text-sm font-medium ${styles.label} mb-2`}>
        {label}
      </label>
      <select 
        className={`w-full px-4 py-3 rounded-lg border ${styles.border} bg-white text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
