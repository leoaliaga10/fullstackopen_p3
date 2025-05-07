const Persons = ({ names, phones, handleDelete }) => {
  return (
    <li>
      {names} {phones} <button onClick={handleDelete}>delete</button>
    </li>
  );
};
export default Persons;
