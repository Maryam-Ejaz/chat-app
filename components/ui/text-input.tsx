import React from "react";
import { cn } from "@/lib/utils";

interface TextInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string; 
}

export const TextInput = ({
  id,
  value,
  onChange,
  label,
  placeholder,
  type = "text",
  className,
}: TextInputProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={cn(
          "mt-1 block w-full rounded-none border-0 shadow-sm bg-transparent focus:outline-none",
          "border-b-2 border-blue-400 focus:border-blue-500",
          className 
        )}
        placeholder={placeholder}
      />
    </div>
  );
};
