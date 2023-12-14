import React from "react";
import InputMask from "react-input-mask";

const MaskedInputField = ({ placeholder, mask, value, onChange, dataTest }) => {
  return (
    <InputMask
      style={{
        width: "50%",
        padding: "10px",
        marginBottom: "10px",
        border: "none",
        borderRadius: "4px",
        fontSize: "16px",
      }}
      placeholder={placeholder}
      mask={mask}
      data-test={dataTest}
      value={value}
      onChange={onChange}
    />
  );
};

export default MaskedInputField;
