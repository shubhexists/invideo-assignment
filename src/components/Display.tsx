const DisplayWindow = ({ expression, result }: any) => {
  return (
    <div className="displayWindow">
      <p className="expression">{expression}</p>
      <p className="result">{result}</p>
    </div>
  );
};

export default DisplayWindow;
