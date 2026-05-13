function Input({ label, value, setValue }) {
  return (
    <div>
      <div
        style={{
          marginBottom: 6,
          fontSize: 12,
          opacity: 0.7,
        }}
      >
        {label}
      </div>

      <input
        className="input"
        type="number"
        value={value}
        onChange={(e) => {
          const value = e.target.value;

          setValue(
            value === ""
              ? ""
              : Number(value)
          );
        }}
      />
    </div>
  );
}