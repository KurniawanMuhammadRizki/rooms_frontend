import React from "react";

interface ButtonProps {
  className?: string;
  value: String | number;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const Buttons: React.FC<ButtonProps> = ({
  className,
  value,
  onClick,
  type,
}) => {
  const defaultStyle = `
    px-4 py-2 bg-[#007989] border-0 rounded-3xl text-sm font-semibold text-white
    transition-colors duration-300 ease-out
    hover:text-[#007989] hover:bg-white group hover:border hover:border-[#007989]
  `;
  const style = className ? `${defaultStyle} ${className}` : defaultStyle;
  return (
    <div>
      <button type={type} className={style} onClick={onClick}>
        {value}
      </button>
    </div>
  );
};

export default Buttons;
