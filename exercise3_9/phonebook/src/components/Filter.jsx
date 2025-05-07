const Filert = ({ textFind, setTextFind }) => {
  const handleFindChange = (event) => {
    setTextFind(event.target.value);
  };
  return (
    <div>
      filter shown with: <input value={textFind} onChange={handleFindChange} />
    </div>
  );
};
export default Filert;
