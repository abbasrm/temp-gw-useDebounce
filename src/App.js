import React, { useCallback, useState } from "react";
import { useDebounce } from "./useDebounce";

const fakeFetch = (data, delay = Math.random() * 5000) =>
  new Promise(resolve => {
    setTimeout(resolve, delay, {
      data,
      delay,
      time: new Date().toLocaleTimeString()
    });
  });

function App() {
  const [value, setValue] = useState("");

  const debouchedChange = useCallback(useDebounce(fakeFetch, 300));

  const handleValueChange = async v => {
    const response = await debouchedChange(v);
    console.log(response);
    setValue(response.data);
  };

  return (
    <React.Fragment>
      <input onChange={e => handleValueChange(e.target.value)} />
      <div>{value}</div>
    </React.Fragment>
  );
}

export default App;
